package access

import (
		"github.com/joho/godotenv"
		"log"
		"os"
		"context"

		"github.com/jackc/pgx/v5"
)

func getEnv() (string) {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	return os.Getenv("DATABASE_URL")	
}


func ConectDB() *pgx.Conn {
	dbUrl := getEnv()
	conn, err := pgx.Connect(context.Background(), dbUrl)
	if err != nil {
		log.Fatal("Error connecting to database")
	}
	defer conn.Close(context.Background())
	return conn
}