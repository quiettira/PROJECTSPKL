package database

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
)

var DB *pgxpool.Pool

func ConnectDB() {
	// Load .env (optional for Docker, will use environment variables if not found)
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using environment variables")
	}

	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		log.Fatal("DATABASE_URL not found in .env")
	}

	// Buat koneksi ke PostgreSQL
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	pool, err := pgxpool.New(ctx, dbURL)
	if err != nil {
		log.Fatalf("Unable to create connection pool: %v\n", err)
	}

	// Tes koneksi
	if err := pool.Ping(ctx); err != nil {
		log.Fatalf("Unable to connect to database: %v\n", err)
	}

	fmt.Println("✅ Database connected successfully!")
	DB = pool
}
