package services

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"regexp"
	"strings"
	"sync"
	"time"

	"backend/models"
	"backend/repository"
)

type GitHubService struct {
	projectRepo *repository.ProjectRepository
	httpClient  *http.Client
}

func NewGitHubService(repo *repository.ProjectRepository) *GitHubService {
	return &GitHubService{
		projectRepo: repo,
		httpClient:  &http.Client{Timeout: 15 * time.Second},
	}
}

type githubRepo struct {
	ID            int64    `json:"id"`
	Name          string   `json:"name"`
	Description   string   `json:"description"`
	HTMLURL       string   `json:"html_url"`
	StargazersCnt int      `json:"stargazers_count"`
	Topics        []string `json:"topics"`
}

// FetchAndCache pulls repos from GitHub and upserts them into Supabase.
func (s *GitHubService) FetchAndCache(ctx context.Context) error {
	username := os.Getenv("GITHUB_USERNAME")
	token := os.Getenv("GITHUB_TOKEN")

	url := fmt.Sprintf("https://api.github.com/users/%s/repos?per_page=100&sort=updated", username)
	req, err := http.NewRequestWithContext(ctx, "GET", url, nil)
	if err != nil {
		return fmt.Errorf("build request: %w", err)
	}
	if token != "" {
		req.Header.Set("Authorization", "Bearer "+token)
	}
	req.Header.Set("Accept", "application/vnd.github+json")

	resp, err := s.httpClient.Do(req)
	if err != nil {
		return fmt.Errorf("github fetch error: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("github returned status %d", resp.StatusCode)
	}

	var repos []githubRepo
	if err := json.NewDecoder(resp.Body).Decode(&repos); err != nil {
		return fmt.Errorf("github decode error: %w", err)
	}

	// Fetch languages + README concurrently for every repo.
	type repoEnrichment struct {
		index       int
		langs       []string
		description string
		err         error
	}
	ch := make(chan repoEnrichment, len(repos))
	var wg sync.WaitGroup

	for i, r := range repos {
		wg.Add(1)
		go func(idx int, repoName string) {
			defer wg.Done()
			langs, langErr := s.fetchLanguages(ctx, username, repoName, token)
			desc, readmeErr := s.fetchReadmeDescription(ctx, username, repoName, token)
			// Return the first error, prefer readme error for visibility.
			err := langErr
			if readmeErr != nil {
				err = readmeErr
			}
			ch <- repoEnrichment{idx, langs, desc, err}
		}(i, r.Name)
	}
	wg.Wait()
	close(ch)

	// Collect results.
	repoLangs := make(map[int][]string, len(repos))
	repoDescs := make(map[int]string, len(repos))
	for r := range ch {
		if r.err != nil {
			fmt.Fprintf(os.Stderr, "warning: enrich repo %d: %v\n", r.index, r.err)
		}
		repoLangs[r.index] = r.langs
		repoDescs[r.index] = r.description
	}

	for i, r := range repos {
		// Merge: start with GitHub topics, append languages that aren't already there.
		seen := make(map[string]bool, len(r.Topics))
		for _, t := range r.Topics {
			seen[t] = true
		}
		merged := make([]string, 0, len(r.Topics)+len(repoLangs[i]))
		merged = append(merged, r.Topics...)
		for _, lang := range repoLangs[i] {
			if !seen[lang] {
				merged = append(merged, lang)
				seen[lang] = true
			}
		}

		// Use README description if the GitHub short description is empty.
		desc := r.Description
		if desc == "" && repoDescs[i] != "" {
			desc = repoDescs[i]
		}

		// Translate to English if we have a description.
		descEn := ""
		if desc != "" {
			descEn = TranslateToEnglish(desc)
		}

		p := models.Project{
			GithubID:      r.ID,
			Name:          r.Name,
			Description:   desc,
			DescriptionEn: descEn,
			URL:           r.HTMLURL,
			Stars:         r.StargazersCnt,
			Topics:        merged,
		}
		if err := s.projectRepo.UpsertFromGitHub(ctx, p); err != nil {
			return fmt.Errorf("upsert error for %s: %w", r.Name, err)
		}
	}
	return nil
}

// fetchLanguages calls /repos/{owner}/{repo}/languages and returns the language names.
func (s *GitHubService) fetchLanguages(ctx context.Context, owner, repo, token string) ([]string, error) {
	url := fmt.Sprintf("https://api.github.com/repos/%s/%s/languages", owner, repo)
	req, err := http.NewRequestWithContext(ctx, "GET", url, nil)
	if err != nil {
		return nil, fmt.Errorf("build languages request: %w", err)
	}
	if token != "" {
		req.Header.Set("Authorization", "Bearer "+token)
	}
	req.Header.Set("Accept", "application/vnd.github+json")

	resp, err := s.httpClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("languages fetch error: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("languages returned status %d", resp.StatusCode)
	}

	var langsMap map[string]int64
	if err := json.NewDecoder(resp.Body).Decode(&langsMap); err != nil {
		return nil, fmt.Errorf("languages decode error: %w", err)
	}

	names := make([]string, 0, len(langsMap))
	for name := range langsMap {
		names = append(names, name)
	}
	return names, nil
}

// fetchReadmeDescription fetches the README and extracts the first paragraph under
// a "Descripción" / "Description" heading.
func (s *GitHubService) fetchReadmeDescription(ctx context.Context, owner, repo, token string) (string, error) {
	url := fmt.Sprintf("https://api.github.com/repos/%s/%s/readme", owner, repo)
	req, err := http.NewRequestWithContext(ctx, "GET", url, nil)
	if err != nil {
		return "", fmt.Errorf("build readme request: %w", err)
	}
	if token != "" {
		req.Header.Set("Authorization", "Bearer "+token)
	}
	// Raw content so we don't have to base64-decode.
	req.Header.Set("Accept", "application/vnd.github.raw")

	resp, err := s.httpClient.Do(req)
	if err != nil {
		return "", fmt.Errorf("readme fetch error: %w", err)
	}
	defer resp.Body.Close()

	// 404 = no README, that's fine.
	if resp.StatusCode == http.StatusNotFound {
		return "", nil
	}
	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("readme returned status %d", resp.StatusCode)
	}

	// Read the raw markdown.
	var buf bytes.Buffer
	_, _ = io.Copy(&buf, resp.Body)
	markdown := buf.String()

	return extractDescriptionFromMarkdown(markdown), nil
}

// extractDescriptionFromMarkdown looks for a "Descripción" or "Description" heading
// (any level, case-insensitive, with or without accent) and returns the paragraph(s)
// that follow until the next heading.
func extractDescriptionFromMarkdown(md string) string {
	re := regexp.MustCompile(`(?im)^#{1,6}\s*descripci[oó]n|^#{1,6}\s*description`)
	lines := strings.Split(md, "\n")

	start := -1
	for i, line := range lines {
		if re.MatchString(line) {
			start = i + 1
			break
		}
	}
	if start == -1 || start >= len(lines) {
		return ""
	}

	var parts []string
	for _, line := range lines[start:] {
		if strings.HasPrefix(line, "#") {
			break
		}
		trimmed := strings.TrimSpace(line)
		if trimmed != "" {
			parts = append(parts, trimmed)
		}
	}
	return strings.Join(parts, " ")
}

// githubContentFile represents a file returned by the GitHub Contents API.
type githubContentFile struct {
	Name        string `json:"name"`
	Type        string `json:"type"`
	DownloadURL string `json:"download_url"`
}

// FetchScreenshots lists image files in the repo's content/ folder.
func (s *GitHubService) FetchScreenshots(ctx context.Context, repoName string) ([]string, error) {
	username := os.Getenv("GITHUB_USERNAME")
	token := os.Getenv("GITHUB_TOKEN")

	url := fmt.Sprintf("https://api.github.com/repos/%s/%s/contents/content", username, repoName)
	req, err := http.NewRequestWithContext(ctx, "GET", url, nil)
	if err != nil {
		return nil, fmt.Errorf("build contents request: %w", err)
	}
	if token != "" {
		req.Header.Set("Authorization", "Bearer "+token)
	}
	req.Header.Set("Accept", "application/vnd.github+json")

	resp, err := s.httpClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("contents fetch error: %w", err)
	}
	defer resp.Body.Close()

	// No content folder = no screenshots.
	if resp.StatusCode == http.StatusNotFound {
		return nil, nil
	}
	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("contents returned status %d", resp.StatusCode)
	}

	var files []githubContentFile
	if err := json.NewDecoder(resp.Body).Decode(&files); err != nil {
		return nil, fmt.Errorf("contents decode error: %w", err)
	}

	extensions := map[string]bool{
		".png": true, ".jpg": true, ".jpeg": true,
		".gif": true, ".webp": true, ".svg": true,
	}

	var screenshots []string
	for _, f := range files {
		if f.Type != "file" || f.DownloadURL == "" {
			continue
		}
		dotIdx := strings.LastIndex(f.Name, ".")
		if dotIdx < 0 {
			continue
		}
		ext := strings.ToLower(f.Name[dotIdx:])
		if extensions[ext] {
			screenshots = append(screenshots, f.DownloadURL)
		}
	}
	return screenshots, nil
}
