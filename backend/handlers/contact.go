package handlers

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"os"

	"github.com/gin-gonic/gin"
	"backend/models"
	"backend/repository"
)

type ContactHandler struct {
	repo *repository.ContactRepository
}

func NewContactHandler(repo *repository.ContactRepository) *ContactHandler {
	return &ContactHandler{repo: repo}
}

func (h *ContactHandler) CreateContact(c *gin.Context) {
	var req models.ContactRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx := c.Request.Context()

	// Persist first — DB is the source of truth, notifications are best-effort.
	if err := h.repo.Create(ctx, req); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to save contact"})
		return
	}

	// Fire notifications in the background so the user gets a fast response.
	go sendEmail(req)
	go sendWhatsApp(req)

	c.JSON(http.StatusOK, gin.H{"success": true})
}

func sendEmail(req models.ContactRequest) {
	apiKey := os.Getenv("RESEND_API_KEY")
	toEmail := os.Getenv("RESEND_TO_EMAIL")

	body := map[string]any{
		"from":    "Portfolio <onboarding@resend.dev>",
		"to":      []string{toEmail},
		"subject": fmt.Sprintf("New contact from %s", req.Name),
		"html": fmt.Sprintf(`
			<h2>New message from your portfolio</h2>
			<p><strong>Name:</strong> %s</p>
			<p><strong>Email:</strong> %s</p>
			<p><strong>Message:</strong></p>
			<p>%s</p>
		`, req.Name, req.Email, req.Content),
	}

	jsonBody, _ := json.Marshal(body)
	r, err := http.NewRequest("POST", "https://api.resend.com/emails", bytes.NewBuffer(jsonBody))
	if err != nil {
		return
	}
	r.Header.Set("Authorization", "Bearer "+apiKey)
	r.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	client.Do(r)
}

func sendWhatsApp(req models.ContactRequest) {
	phone := os.Getenv("WHATSAPP_PHONE")
	apiKey := os.Getenv("WHATSAPP_APIKEY")

	message := fmt.Sprintf(
		"New portfolio contact!\nName: %s\nEmail: %s\nMessage: %s",
		req.Name, req.Email, req.Content,
	)

	apiURL := fmt.Sprintf(
		"https://api.callmebot.com/whatsapp.php?phone=%s&text=%s&apikey=%s",
		phone, url.QueryEscape(message), apiKey,
	)
	http.Get(apiURL)
}
