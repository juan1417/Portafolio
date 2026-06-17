package services

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"strings"
)

type deeplRequest struct {
	Text       []string `json:"text"`
	TargetLang string   `json:"target_lang"`
	SourceLang string   `json:"source_lang,omitempty"`
}

type deeplResponse struct {
	Translations []struct {
		Text string `json:"text"`
	} `json:"translations"`
}

// TranslateToEnglish translates a Spanish string to English using DeepL.
// Returns the original text if the API key is not set or translation fails.
func TranslateToEnglish(text string) string {
	apiKey := os.Getenv("DEEPL_API_KEY")
	if apiKey == "" {
		return text
	}

	if strings.TrimSpace(text) == "" {
		return text
	}

	body := deeplRequest{
		Text:       []string{text},
		TargetLang: "EN",
		SourceLang: "ES",
	}
	payload, err := json.Marshal(body)
	if err != nil {
		return text
	}

	req, err := http.NewRequest("POST", "https://api-free.deepl.com/v2/translate", bytes.NewReader(payload))
	if err != nil {
		return text
	}
	req.Header.Set("Authorization", "DeepL-Auth-Key "+apiKey)
	req.Header.Set("Content-Type", "application/json")

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return text
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		// Debug: read the body for logging
		respBody, _ := io.ReadAll(resp.Body)
		fmt.Printf("DeepL API error: %s - %s\n", resp.Status, string(respBody))
		return text
	}

	var result deeplResponse
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return text
	}

	if len(result.Translations) == 0 {
		return text
	}

	return strings.TrimSpace(result.Translations[0].Text)
}
