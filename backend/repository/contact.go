package repository

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
	"backend/models"
)

type ContactRepository struct {
	db *pgxpool.Pool
}

func NewContactRepository(db *pgxpool.Pool) *ContactRepository {
	return &ContactRepository{db: db}
}

func (r *ContactRepository) Create(ctx context.Context, req models.ContactRequest) error {
	source := req.Source
	if source == "" {
		source = "form"
	}
	_, err := r.db.Exec(ctx, `
		INSERT INTO contact (name, email, content, status, source)
		VALUES ($1, $2, $3, 'unread', $4)
	`, req.Name, req.Email, req.Content, source)
	return err
}

func (r *ContactRepository) GetAll(ctx context.Context) ([]models.Contact, error) {
	rows, err := r.db.Query(ctx, `
		SELECT id, name, email, content, status, source, created_at
		FROM contact
		ORDER BY created_at DESC
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var contacts []models.Contact
	for rows.Next() {
		var c models.Contact
		err := rows.Scan(
			&c.ID, &c.Name, &c.Email, &c.Content,
			&c.Status, &c.Source, &c.CreatedAt,
		)
		if err != nil {
			return nil, err
		}
		contacts = append(contacts, c)
	}
	return contacts, nil
}

func (r *ContactRepository) UpdateStatus(ctx context.Context, id string, status string) error {
	_, err := r.db.Exec(ctx,
		"UPDATE contact SET status = $1 WHERE id = $2",
		status, id,
	)
	return err
}
