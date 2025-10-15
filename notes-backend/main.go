package main
import "github.com/gofiber/fiber/v2/middleware/cors"

import (
	"fmt"
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/joho/godotenv"

	"notes-backend/internal/database"
	"notes-backend/internal/handlers"
	"notes-backend/internal/middleware"
)

func main() {
	// Load .env file (optional, will use environment variables if not found)
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using environment variables")
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	database.ConnectDB()
	

	app := fiber.New()
	app.Use(middleware.Logger)
	app.Use(cors.New(cors.Config{
    AllowOrigins: "http://localhost:3000",
    AllowHeaders: "Origin, Content-Type, Accept, Authorization",
}))

	// 🏠 Route awal
	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Notes App Backend is running ✅")
	})

	// 👤 Auth routes
	app.Post("/register", handlers.Register)
	app.Post("/login", handlers.Login)
	// 🧾 Admin logs (sementara tanpa proteksi)
	app.Get("/admin/logs", handlers.GetLogs)

	// 📝 Notes routes (dengan JWT protection)
	notes := app.Group("/notes", middleware.JWTProtected())
	notes.Get("/", handlers.GetNotes)          // GET semua notes (shared/public)
	notes.Get("/:id", handlers.GetNoteByID)    // GET note by ID
	notes.Post("/", handlers.CreateNote)       // CREATE note (butuh JWT)
	notes.Put("/:id", handlers.UpdateNote)     // UPDATE note (hanya owner)
	notes.Delete("/:id", handlers.DeleteNote)  // DELETE note (hanya owner)
	


	// 🚀 Jalankan server
	fmt.Printf("🚀 Server running on http://localhost:%s\n", port)
	log.Fatal(app.Listen(":" + port))

	
}

