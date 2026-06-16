package main

import (
	"log"
	"porfolio.dev/backend/services"
)



func main() {
	repositories := github.GetGithubRepos()
	for _, repo := range repositories {
		log.Printf("Repository: %s, URL: %s", repo.Name, repo.HTMLURL)
	}
}