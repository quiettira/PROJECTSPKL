package handlers

import (
	"context"
	"log"
	"os"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"

	"notes-backend/internal/database"
	"notes-backend/internal/models"
)

var jwtSecret = []byte(getJWTSecret())

func getJWTSecret() string {
	s := os.Getenv("JWT_SECRET")
	if s == "" {
		return "supersecretkey"
	}
	return s
}

// ✅ REGISTER USER
func Register(c *fiber.Ctx) error {
	var body struct {
		Name     string `json:"name"`
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := c.BodyParser(&body); err != nil {
		// debug info to help identify malformed requests from clients
		log.Printf("Register: BodyParser error: %v; raw body: %s", err, string(c.Body()))
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request"})
	}

	if body.Email == "" || body.Password == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Email and password are required"})
	}

	// 🔹 Hash password pakai bcrypt
	hashed, err := bcrypt.GenerateFromPassword([]byte(body.Password), 10)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to hash password"})
	}

	// 🔹 Simpan ke database
	query := `INSERT INTO users (name, email, password, created_at) VALUES ($1, $2, $3, NOW())`
	_, err = database.DB.Exec(context.Background(), query, body.Name, body.Email, string(hashed))
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to save user (mungkin email sudah digunakan)"})
	}

	return c.JSON(fiber.Map{"message": "User registered successfully ✅"})
}

// ✅ LOGIN USER
func Login(c *fiber.Ctx) error {
	var body struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request"})
	}

	// 🔹 Ambil user berdasarkan email
	var user models.User
	row := database.DB.QueryRow(context.Background(), `SELECT id, name, email, password FROM users WHERE email=$1`, body.Email)
	err := row.Scan(&user.ID, &user.Name, &user.Email, &user.Password)
	if err != nil {
		return c.Status(401).JSON(fiber.Map{"error": "Invalid email or password"})
	}

	// 🔹 Bandingkan password hash
	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(body.Password))
	if err != nil {
		return c.Status(401).JSON(fiber.Map{"error": "Invalid email or password"})
	}

	// 🔹 Generate JWT Token
	claims := jwt.MapClaims{
		"user_id": user.ID,
		"exp":     time.Now().Add(time.Hour * 2).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	t, err := token.SignedString(jwtSecret)
	if err != nil {
		log.Println(err)
		return c.Status(500).JSON(fiber.Map{"error": "Failed to generate token"})
	}

	return c.JSON(fiber.Map{
		"message": "Login successful ✅",
		"token":   t,
		"user": fiber.Map{
			"id":    user.ID,
			"name":  user.Name,
			"email": user.Email,
		},
	})
}
