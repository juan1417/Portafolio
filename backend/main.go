package main

import (
	"context"
	"html/template"
	"log"
	"os"

	"github.com/gin-gonic/gin"

	"backend/db"
	"backend/handlers"
	"backend/middleware"
	"backend/repository"
	"backend/services"
)

func main() {
	ctx := context.Background()

	// Supabase connection pool. main.go owns the lifecycle.
	pool, err := db.Connect(ctx)
	if err != nil {
		log.Fatal("failed to connect to database:", err)
	}
	defer pool.Close()

	// Repositories
	projectRepo := repository.NewProjectRepository(pool)
	contactRepo := repository.NewContactRepository(pool)
	analyticsRepo := repository.NewAnalyticsRepository(pool)

	// Services
	githubService := services.NewGitHubService(projectRepo)

	// Admin templates
	tmpl := template.Must(template.ParseGlob("template/*.html"))

	// Handlers
	projectHandler := handlers.NewProjectHandler(projectRepo, githubService)
	contactHandler := handlers.NewContactHandler(contactRepo)
	analyticsHandler := handlers.NewAnalyticsHandler(analyticsRepo)
	adminHandler := handlers.NewAdminHandler(contactRepo, projectRepo, analyticsRepo, tmpl)

	// Gin router
	r := gin.Default()

	// CORS — only accept requests from the portfolio frontend (and localhost in dev).
	r.Use(func(c *gin.Context) {
		origin := c.Request.Header.Get("Origin")
		allowedOrigins := []string{
			os.Getenv("ALLOWED_ORIGIN"),
			"http://localhost:4321",
			"http://localhost:3000",
		}
		for _, allowed := range allowedOrigins {
			if origin == allowed {
				c.Header("Access-Control-Allow-Origin", origin)
				break
			}
		}
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Content-Type, Authorization")
		c.Header("Access-Control-Allow-Credentials", "true")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	// Public API
	api := r.Group("/api")
	{
		api.GET("/projects", projectHandler.GetProjects)
		api.GET("/projects/:name/screenshots", projectHandler.GetScreenshots)
		api.POST("/contact", contactHandler.CreateContact)
		api.POST("/analytics/visit", analyticsHandler.RegisterVisit)
		api.GET("/health", func(c *gin.Context) {
			c.JSON(200, gin.H{"status": "ok"})
		})
	}

	// Admin: login is public, the rest require JWT cookie.
	r.GET("/admin/login", adminHandler.LoginPage)
	r.POST("/admin/login", adminHandler.Login)

	admin := r.Group("/admin")
	admin.Use(middleware.AuthRequired())
	{
		admin.GET("/", adminHandler.Dashboard)
		admin.GET("/contacts", adminHandler.Contacts)
		admin.GET("/projects", adminHandler.Projects)
		admin.PUT("/projects/:id/featured", adminHandler.ToggleFeatured)
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server running on port %s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatal(err)
	}
}
