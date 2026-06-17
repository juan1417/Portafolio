package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"backend/models"
	"backend/repository"
)

type AnalyticsHandler struct {
	repo *repository.AnalyticsRepository
}

func NewAnalyticsHandler(repo *repository.AnalyticsRepository) *AnalyticsHandler {
	return &AnalyticsHandler{repo: repo}
}

func (h *AnalyticsHandler) RegisterVisit(c *gin.Context) {
	var req models.PageViewRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userAgent := c.Request.UserAgent()
	if err := h.repo.RegisterVisit(c.Request.Context(), req, userAgent); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to register visit"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true})
}
