package repository

import (
	"context"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	"backend/models"
)

type ProjectRepository struct {
	db *pgxpool.Pool
}

func NewProjectRepository(db *pgxpool.Pool) *ProjectRepository {
	return &ProjectRepository{db: db}
}

// GetAll returns every project ordered: featured first, then by stars.
func (r *ProjectRepository) GetAll(ctx context.Context) ([]models.Project, error) {
	rows, err := r.db.Query(ctx, `
		SELECT id, name, description, description_en, url, github_id, stars, topics,
		       featured, cached_at, created_at
		FROM projects
		ORDER BY featured DESC, stars DESC
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var projects []models.Project
	for rows.Next() {
		var p models.Project
		err := rows.Scan(
			&p.ID, &p.Name, &p.Description, &p.DescriptionEn, &p.URL, &p.GithubID,
			&p.Stars, &p.Topics, &p.Featured, &p.CachedAt, &p.CreatedAt,
		)
		if err != nil {
			return nil, err
		}
		projects = append(projects, p)
	}
	return projects, nil
}

// NeedsRefresh reports whether the cache is older than 1 hour.
func (r *ProjectRepository) NeedsRefresh(ctx context.Context) (bool, error) {
	var cachedAt time.Time
	err := r.db.QueryRow(ctx,
		"SELECT cached_at FROM projects ORDER BY cached_at DESC LIMIT 1",
	).Scan(&cachedAt)
	if err != nil {
		return true, nil
	}
	return time.Since(cachedAt) > time.Hour, nil
}

// UpsertFromGitHub inserts or updates a project from the GitHub API.
// Note: the DB column is misspelled as "description" in Supabase; kept on purpose.
func (r *ProjectRepository) UpsertFromGitHub(ctx context.Context, p models.Project) error {
	_, err := r.db.Exec(ctx, `
		INSERT INTO projects (name, description, description_en, url, github_id, stars, topics, cached_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
		ON CONFLICT (github_id)
		DO UPDATE SET
			name           = EXCLUDED.name,
			description    = EXCLUDED.description,
			description_en = EXCLUDED.description_en,
			url            = EXCLUDED.url,
			stars          = EXCLUDED.stars,
			topics         = EXCLUDED.topics,
			cached_at      = NOW()
	`, p.Name, p.Description, p.DescriptionEn, p.URL, p.GithubID, p.Stars, p.Topics)
	return err
}

func (r *ProjectRepository) SetFeatured(ctx context.Context, id string, featured bool) error {
	_, err := r.db.Exec(ctx,
		"UPDATE projects SET featured = $1 WHERE id = $2",
		featured, id,
	)
	return err
}
