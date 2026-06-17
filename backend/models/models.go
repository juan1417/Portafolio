package models

import "time"

type Project struct {
	ID            string    `json:"id"`
	Name          string    `json:"name"`
	Description   string    `json:"description"`
	DescriptionEn string    `json:"-"`
	URL           string    `json:"url"`
	GithubID    int64     `json:"github_id"`
	Stars       int       `json:"stars"`
	Topics      []string  `json:"topics"`
	Featured    bool      `json:"featured"`
	CachedAt    time.Time `json:"cached_at"`
	CreatedAt   time.Time `json:"created_at"`
}

type Contact struct {
	ID        string    `json:"id"`
	Name      string    `json:"name"`
	Email     string    `json:"email"`
	Content   string    `json:"content"`
	Status    string    `json:"status"`
	Source    string    `json:"source"`
	CreatedAt time.Time `json:"created_at"`
}

type PageView struct {
	ID        string    `json:"id"`
	Page      string    `json:"page"`
	Country   string    `json:"country"`
	Referrer  string    `json:"referrer"`
	UserAgent string    `json:"user_agent"`
	VisitedAt time.Time `json:"visited_at"`
}

type AdminUser struct {
	ID           string    `json:"id"`
	Email        string    `json:"email"`
	PasswordHash string    `json:"-"`
	CreatedAt    time.Time `json:"created_at"`
}

// DTOs — what the API receives from the frontend
type ContactRequest struct {
	Name    string `json:"name" binding:"required"`
	Email   string `json:"email" binding:"required,email"`
	Content string `json:"content" binding:"required,min=10"`
	Source  string `json:"source"`
}

type PageViewRequest struct {
	Page     string `json:"page" binding:"required"`
	Referrer string `json:"referrer"`
}

type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

type LoginResponse struct {
	Token string `json:"token"`
}
