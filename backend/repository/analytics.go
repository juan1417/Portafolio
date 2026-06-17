package repository

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
	"backend/models"
)

type AnalyticsRepository struct {
	db *pgxpool.Pool
}

func NewAnalyticsRepository(db *pgxpool.Pool) *AnalyticsRepository {
	return &AnalyticsRepository{db: db}
}

func (r *AnalyticsRepository) RegisterVisit(ctx context.Context, req models.PageViewRequest, userAgent string) error {
	_, err := r.db.Exec(ctx, `
		INSERT INTO page_views (page, referrer, user_agent)
		VALUES ($1, $2, $3)
	`, req.Page, req.Referrer, userAgent)
	return err
}

func (r *AnalyticsRepository) GetStats(ctx context.Context) (map[string]int, error) {
	rows, err := r.db.Query(ctx, `
		SELECT page, COUNT(*) as visits
		FROM page_views
		GROUP BY page
		ORDER BY visits DESC
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	stats := make(map[string]int)
	for rows.Next() {
		var page string
		var count int
		if err := rows.Scan(&page, &count); err != nil {
			return nil, err
		}
		stats[page] = count
	}
	return stats, nil
}

func (r *AnalyticsRepository) GetTotalVisits(ctx context.Context) (int, error) {
	var total int
	err := r.db.QueryRow(ctx, "SELECT COUNT(*) FROM page_views").Scan(&total)
	return total, err
}
