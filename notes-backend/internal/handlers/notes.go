package handlers

import (
	"context"
	"fmt"
	"time"

	"github.com/gofiber/fiber/v2"
	"notes-backend/internal/database"
)

// ✅ GET ALL NOTES (semua notes dari semua user - SHARED/PUBLIC)
func GetNotes(c *fiber.Ctx) error {
	// Tidak perlu cek user_id karena ini endpoint public untuk melihat semua notes
	
	rows, err := database.DB.Query(context.Background(),
		`SELECT n.id, n.title, n.content, n.created_at, n.updated_at, n.user_id, u.name, u.email
		 FROM notes n
		 JOIN users u ON n.user_id = u.id
		 ORDER BY n.created_at DESC`)
	if err != nil {
		fmt.Println("❌ DB error GetNotes:", err)
		return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch notes"})
	}
	defer rows.Close()

	var notes []map[string]interface{}
	for rows.Next() {
		var n struct {
			ID        int64
			Title     string
			Content   string
			CreatedAt time.Time
			UpdatedAt time.Time
			UserID    int64
			UserName  string
			UserEmail string
		}
		if err := rows.Scan(&n.ID, &n.Title, &n.Content, &n.CreatedAt, &n.UpdatedAt, &n.UserID, &n.UserName, &n.UserEmail); err != nil {
			continue
		}
		notes = append(notes, fiber.Map{
			"id":         n.ID,
			"title":      n.Title,
			"content":    n.Content,
			"created_at": n.CreatedAt.Format("2006-01-02 15:04:05"),
			"updated_at": n.UpdatedAt.Format("2006-01-02 15:04:05"),
			"user_id":    n.UserID,
			"user_name":  n.UserName,
			"user_email": n.UserEmail,
		})
	}

	if notes == nil {
		notes = []map[string]interface{}{}
	}

	return c.JSON(notes)
}

// ✅ CREATE NOTE
func CreateNote(c *fiber.Ctx) error {
	userIDFloat, ok := c.Locals("user_id").(float64)
	if !ok {
		return c.Status(401).JSON(fiber.Map{"error": "Invalid user ID"})
	}
	userID := int(userIDFloat)

	var body struct {
		Title   string `json:"title"`
		Content string `json:"content"`
	}
	if err := c.BodyParser(&body); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request"})
	}

	if body.Title == "" {
		return c.Status(400).JSON(fiber.Map{"error": "Title is required"})
	}

	_, err := database.DB.Exec(context.Background(),
		`INSERT INTO notes (user_id, title, content, created_at, updated_at) 
		 VALUES ($1, $2, $3, NOW(), NOW())`,
		userID, body.Title, body.Content)
	if err != nil {
		fmt.Println("❌ DB error CreateNote:", err)
		return c.Status(500).JSON(fiber.Map{"error": "Failed to create note"})
	}

	return c.JSON(fiber.Map{"message": "Note created successfully ✅"})
}

// ✅ UPDATE NOTE
func UpdateNote(c *fiber.Ctx) error {
	userIDFloat, ok := c.Locals("user_id").(float64)
	if !ok {
		return c.Status(401).JSON(fiber.Map{"error": "Invalid user ID"})
	}
	userID := int(userIDFloat)
	id := c.Params("id")

	var body struct {
		Title   string `json:"title"`
		Content string `json:"content"`
	}
	if err := c.BodyParser(&body); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request"})
	}

	res, err := database.DB.Exec(context.Background(),
		`UPDATE notes SET title=$1, content=$2, updated_at=NOW() 
		 WHERE id=$3 AND user_id=$4`,
		body.Title, body.Content, id, userID)
	if err != nil {
		fmt.Println("❌ DB error UpdateNote:", err)
		return c.Status(500).JSON(fiber.Map{"error": "Failed to update note"})
	}
	if res.RowsAffected() == 0 {
		return c.Status(403).JSON(fiber.Map{"error": "Note not found or unauthorized"})
	}

	return c.JSON(fiber.Map{"message": "Note updated successfully ✅"})
}

// ✅ DELETE NOTE
func DeleteNote(c *fiber.Ctx) error {
	userIDFloat, ok := c.Locals("user_id").(float64)
	if !ok {
		return c.Status(401).JSON(fiber.Map{"error": "Invalid user ID"})
	}
	userID := int(userIDFloat)
	id := c.Params("id")

	res, err := database.DB.Exec(context.Background(),
		`DELETE FROM notes WHERE id=$1 AND user_id=$2`, id, userID)
	if err != nil {
		fmt.Println("❌ DB error DeleteNote:", err)
		return c.Status(500).JSON(fiber.Map{"error": "Failed to delete note"})
	}
	if res.RowsAffected() == 0 {
		return c.Status(403).JSON(fiber.Map{"error": "Note not found or unauthorized"})
	}

	return c.JSON(fiber.Map{"message": "Note deleted successfully ✅"})
}

// ✅ GET NOTE BY ID (bisa dari user manapun - untuk sharing)
func GetNoteByID(c *fiber.Ctx) error {
    id := c.Params("id")

    var note struct {
        ID        int64
        Title     string
        Content   string
        CreatedAt time.Time
        UpdatedAt time.Time
        UserID    int64
        UserName  string
        UserEmail string
    }

    err := database.DB.QueryRow(context.Background(),
        `SELECT n.id, n.title, n.content, n.created_at, n.updated_at, n.user_id, u.name, u.email
         FROM notes n
         JOIN users u ON n.user_id = u.id
         WHERE n.id=$1`, id).
        Scan(&note.ID, &note.Title, &note.Content, &note.CreatedAt, &note.UpdatedAt, &note.UserID, &note.UserName, &note.UserEmail)

    if err != nil {
        return c.Status(404).JSON(fiber.Map{"error": "Note not found"})
    }

    return c.JSON(fiber.Map{
        "id":         note.ID,
        "title":      note.Title,
        "content":    note.Content,
        "created_at": note.CreatedAt.Format("2006-01-02 15:04:05"),
        "updated_at": note.UpdatedAt.Format("2006-01-02 15:04:05"),
        "user_id":    note.UserID,
        "user_name":  note.UserName,
        "user_email": note.UserEmail,
    })
}


