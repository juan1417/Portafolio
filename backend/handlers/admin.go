package handlers

import (
	"html/template"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"

	"backend/models"
	"backend/repository"
)

type AdminHandler struct {
	contactRepo   *repository.ContactRepository
	projectRepo   *repository.ProjectRepository
	analyticsRepo *repository.AnalyticsRepository
	tmpl          *template.Template
}

func NewAdminHandler(
	contact *repository.ContactRepository,
	project *repository.ProjectRepository,
	analytics *repository.AnalyticsRepository,
	tmpl *template.Template,
) *AdminHandler {
	return &AdminHandler{
		contactRepo:   contact,
		projectRepo:   project,
		analyticsRepo: analytics,
		tmpl:          tmpl,
	}
}

func (h *AdminHandler) LoginPage(c *gin.Context) {
	h.tmpl.ExecuteTemplate(c.Writer, "login.html", nil)
}

func (h *AdminHandler) Login(c *gin.Context) {
	var req models.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request"})
		return
	}

	// TODO: in production, look up the admin in admin_users of Supabase.
	// For now we compare against env vars to keep deploy simple.
	adminEmail := os.Getenv("ADMIN_EMAIL")
	adminHash := os.Getenv("ADMIN_PASSWORD_HASH")
	// Strip surrounding quotes (godotenv may preserve them when $ chars are present)
	if len(adminHash) > 1 && (adminHash[0] == '\'' || adminHash[0] == '"') {
		adminHash = adminHash[1 : len(adminHash)-1]
	}

	if req.Email != adminEmail {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid credentials"})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(adminHash), []byte(req.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid credentials"})
		return
	}

	secret := os.Getenv("JWT_SECRET")
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"email": req.Email,
		"exp":   time.Now().Add(24 * time.Hour).Unix(),
	})

	tokenStr, err := token.SignedString([]byte(secret))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to generate token"})
		return
	}

	c.SetCookie("admin_token", tokenStr, 86400, "/", "", true, true)
	c.JSON(http.StatusOK, models.LoginResponse{Token: tokenStr})
}

func (h *AdminHandler) Dashboard(c *gin.Context) {
	ctx := c.Request.Context()

	stats, _ := h.analyticsRepo.GetStats(ctx)
	total, _ := h.analyticsRepo.GetTotalVisits(ctx)
	contacts, _ := h.contactRepo.GetAll(ctx)

	unread := 0
	for _, msg := range contacts {
		if msg.Status == "unread" {
			unread++
		}
	}

	data := map[string]any{
		"Stats":         stats,
		"TotalVisits":   total,
		"TotalContacts": len(contacts),
		"UnreadCount":   unread,
	}

	h.tmpl.ExecuteTemplate(c.Writer, "dashboard.html", data)
}

func (h *AdminHandler) Contacts(c *gin.Context) {
	contacts, err := h.contactRepo.GetAll(c.Request.Context())
	if err != nil {
		c.String(http.StatusInternalServerError, "Error loading contacts")
		return
	}
	h.tmpl.ExecuteTemplate(c.Writer, "contacts.html", map[string]any{
		"Contacts": contacts,
	})
}

func (h *AdminHandler) Projects(c *gin.Context) {
	projects, err := h.projectRepo.GetAll(c.Request.Context())
	if err != nil {
		c.String(http.StatusInternalServerError, "Error loading projects")
		return
	}
	h.tmpl.ExecuteTemplate(c.Writer, "projects.html", map[string]any{
		"Projects": projects,
	})
}

func (h *AdminHandler) ToggleFeatured(c *gin.Context) {
	id := c.Param("id")
	var body struct {
		Featured bool `json:"featured"`
	}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request"})
		return
	}
	if err := h.projectRepo.SetFeatured(c.Request.Context(), id, body.Featured); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to update"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": true})
}
