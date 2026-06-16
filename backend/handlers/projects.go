package handlers

import (
	"porfolio.dev/backend/services"
	"porfolio.dev/backend/models"
)

func SearchProjects() []models.Repositories {
	var projects = github.GetGithubRepos()
	return projects
}
