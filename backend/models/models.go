package models

type Repositories struct {
	Id		  int    `json:"id"`
	Name      string `json:"name"`
	HTMLURL   string `json:"html_url"`
	LanguagesURL  string `json:"languages_url"`
	ContentsURL   string `json:"contents_url"`
}

type Projects struct {
	Id		  int    `json:"id"`
	Name	  string `json:"name"`
	Description string `json:"description"`
	CreatedAt   string `json:"created_at"`
	Github_id   int    `json:"github_id"`
	Starts   string `json:"starts"`
	Topics   []string `json:"topics"`
	Features   []string `json:"features"`
	Cached_at   string `json:"cached_at"`
	URL         string `json:"url"`
}

type Contact struct {
	Id		  int    `json:"id"`
	Name	  string `json:"name"`
	Email     string `json:"email"`
	Content   string `json:"content"`
	CreatedAt string `json:"created_at"`
	Status    string `json:"status"`
	Source	string `json:"source"`
}

type admin_users struct {
	Id		  int    `json:"id"`
	Email	  string `json:"Email"`
	Password_hash  string `json:"Password"`
	Created_at string `json:"created_at"`
}

type page_views struct {
	Id		  int    `json:"id"`
	Page	  string `json:"page"`
	Country     int    `json:"country"`
	Referrer   string `json:"referrer"`
	User_agent   string `json:"user_agent"`
	Visited_at   string `json:"visited_at"`
}