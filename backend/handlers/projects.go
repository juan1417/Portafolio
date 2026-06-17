package handlers

import (
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

	// Refresh the cache if it's stale (or empty).
	needsRefresh, err := h.repo.NeedsRefresh(ctx)
	if err != nil || needsRefresh {
		if err := h.githubService.FetchAndCache(ctx); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to refresh projects"})
			return
		}
	}

	projects, err := h.repo.GetAll(ctx)
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
