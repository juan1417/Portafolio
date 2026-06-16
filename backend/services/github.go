package github

import (
	"log"
	"net/http"
	"encoding/json"
	"porfolio.dev/backend/models"
)


const githubAPI = "https://api.github.com/users/juan1417/repos"

func GetGithubRepos() []models.Repositories {
	const reposURL = githubAPI + "?per_page=100&sort=updated"
	resp, err := http.Get(reposURL)
	if err != nil {
		log.Fatal("Repository no found", err)
		return []models.Repositories{}
	}
	defer resp.Body.Close()
	var repositories []models.Repositories
	err = json.NewDecoder(resp.Body).Decode(&repositories)
	if err != nil {
		log.Fatal("Error decoding JSON", err)
		return []models.Repositories{}
	}
	return repositories
}

