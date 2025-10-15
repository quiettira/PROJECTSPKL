package middleware

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"
	"time"

	"notes-backend/internal/database"

	"github.com/gofiber/fiber/v2"
)

func Logger(c *fiber.Ctx) error {
	start := time.Now()

	// 🔹 Simpan body request
	var requestBody map[string]interface{}
	if err := json.Unmarshal(c.Body(), &requestBody); err != nil {
		requestBody = map[string]interface{}{}
	}

	// 🔹 Jalankan handler berikutnya
	err := c.Next()

	// 🔹 Ambil data response
	var responseBody map[string]interface{}
	body := c.Response().Body()
	if len(body) > 0 {
		if err := json.Unmarshal(body, &responseBody); err != nil {
			responseBody = map[string]interface{}{
				"raw": string(body),
			}
		}
	}

	// 🔹 Ambil semua header (Authorization dimasking)
	headers := make(map[string]string)
	c.Request().Header.VisitAll(func(k, v []byte) {
		key := string(k)
		val := string(v)
		if strings.ToLower(key) == "authorization" {
			val = "Bearer ***MASKED***"
		}
		headers[key] = val
	})

	// 🔹 Simpan log ke DB
	_, dbErr := database.DB.Exec(
		context.Background(),
		`INSERT INTO logs (datetime, method, endpoint, headers, payload, response, status_code)
		 VALUES ($1, $2, $3, $4, $5, $6, $7)`,
		start,
		c.Method(),
		c.OriginalURL(),
		headers,
		requestBody,
		responseBody,
		c.Response().StatusCode(),
	)

	// 🔹 Kalau gagal simpan log, tampilkan di terminal
	if dbErr != nil {
		fmt.Println("❌ Failed to save log:", dbErr)
	}

	return err
}
