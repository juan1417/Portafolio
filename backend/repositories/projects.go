package repositories

import (
	"porfolio.dev/backend/db"
	"porfolio.dev/backend/handlers"
	"context"
	"porfolio.dev/backend/models"
	"log"
)


func PostProject() {
	// validate that the projects doesn't exist in the database
	// if it doesn't exist, insert it into the database
	conn := access.ConectDB()
	projects := handlers.SearchProjects()
	for _, project := range projects {
		var exists bool
		err := conn.QueryRow(context.Background(), "SELECT EXISTS(SELECT 1 FROM projects WHERE name=$1)", project.Name).Scan(&exists)
		if err != nil {
			log.Fatal("Error checking if project exists", err)
		}
		if !exists {
			
		}
	}
}


func GetProjects() []models.Projects {
	conn := access.ConectDB()
	var projects []models.Projects
	if err := conn.QueryRow(context.Background(), "SELECT * FROM projects" ).Scan(&projects); err != nil {
		log.Fatal("Error fetching projects")
	}
	return projects
}
