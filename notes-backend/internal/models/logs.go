package models

import "time"

type Log struct {
	ID        int64     `json:"id"`
	UserID    int64     `json:"user_id"`
	Action    string    `json:"action"`
	NoteID    int64     `json:"note_id"`
	CreatedAt time.Time `json:"created_at"`
}
