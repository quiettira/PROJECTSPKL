package handlers

import (
	"context"
	"fmt"
	"time"

	"github.com/gofiber/fiber/v2"
	"notes-backend/internal/database"
)

func GetLogs(c *fiber.Ctx) error {
	rows, err := database.DB.Query(context.Background(),
		`SELECT id, datetime, method, endpoint, status_code FROM logs ORDER BY id DESC LIMIT 50`)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch logs"})
	}
	defer rows.Close()

	var logs []map[string]interface{}

	for rows.Next() {
		var (
			id         int64
			datetime   *time.Time // ✅ pointer biar bisa null
			method     *string
			endpoint   *string
			statusCode *int
		)

		// Scan dan tangkap error-nya
		if scanErr := rows.Scan(&id, &datetime, &method, &endpoint, &statusCode); scanErr != nil {
			fmt.Println("❌ Scan error:", scanErr)
			continue
		}

		// Handle nilai NULL
		logItem := fiber.Map{"id": id}
		if datetime != nil {
			logItem["datetime"] = datetime.Format("2006-01-02 15:04:05")
		} else {
			logItem["datetime"] = "(null)"
		}
		if method != nil {
			logItem["method"] = *method
		} else {
			logItem["method"] = "(null)"
		}
		if endpoint != nil {
			logItem["endpoint"] = *endpoint
		} else {
			logItem["endpoint"] = "(null)"
		}
		if statusCode != nil {
			logItem["status_code"] = *statusCode
		} else {
			logItem["status_code"] = 0
		}

		logs = append(logs, logItem)
	}

	return c.JSON(logs)
}
