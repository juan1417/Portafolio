package handlers

import (
	"context"
	"net/http"

	"github.com/gin-gonic/gin"
	"backend/repository"
	"backend/services"
)

type ProjectHandler struct {
	repo          *repository.ProjectRepository
	githubService *services.GitHubService
}

func NewProjectHandler(repo *repository.ProjectRepository, github *services.GitHubService) *ProjectHandler {
	return &ProjectHandler{repo: repo, githubService: github}
}

func (h *ProjectHandler) GetProjects(c *gin.Context) {
	ctx := c.Request.Context()
	lang := c.Query("lang")

	// Try to return cached data immediately.
	needsRefresh, err := h.repo.NeedsRefresh(ctx)
	projects, err := h.repo.GetAll(ctx)

	// If we have cached data and it just needs a refresh, return it now and refresh in background.
	if err == nil && len(projects) > 0 {
		// Refresh async if stale — user gets fast response, cache gets updated silently.
		if needsRefresh {
			go func() {
				bgCtx := context.Background()
				_ = h.githubService.FetchAndCache(bgCtx)
			}()
		}
	} else if needsRefresh || err != nil {
		// No cached data — must wait for the sync.
		if err := h.githubService.FetchAndCache(ctx); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to refresh projects"})
			return
		}
		projects, err = h.repo.GetAll(ctx)
	}
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch projects"})
		return
	}

	// If lang=en and we have an English description, swap it in.
	if lang == "en" {
		for i := range projects {
			if projects[i].DescriptionEn != "" {
				projects[i].Description = projects[i].DescriptionEn
			}
		}
	}

	c.JSON(http.StatusOK, projects)
}

// GetScreenshots returns image URLs from the repo's content/ folder.
func (h *ProjectHandler) GetScreenshots(c *gin.Context) {
	ctx := c.Request.Context()
	name := c.Param("name")

	screenshots, err := h.githubService.FetchScreenshots(ctx, name)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch screenshots"})
		return
	}
	if screenshots == nil {
		screenshots = []string{}
	}

	c.JSON(http.StatusOK, screenshots)
}
