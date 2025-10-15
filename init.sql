-- init.sql
-- Database initialization script for Notes Sharing App

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create notes table
CREATE TABLE IF NOT EXISTS notes (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create logs table
CREATE TABLE IF NOT EXISTS logs (
    id SERIAL PRIMARY KEY,
    datetime TIMESTAMP DEFAULT NOW(),
    method VARCHAR(10),
    endpoint VARCHAR(255),
    headers TEXT,
    payload TEXT,
    response TEXT,
    status_code INT
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_notes_user_id ON notes(user_id);
CREATE INDEX IF NOT EXISTS idx_notes_created_at ON notes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_logs_datetime ON logs(datetime DESC);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Insert sample data (optional - for testing)
-- Uncomment if you want sample data

-- INSERT INTO users (name, email, password) VALUES
-- ('John Doe', 'john@example.com', '$2a$10$YourHashedPasswordHere'),
-- ('Jane Smith', 'jane@example.com', '$2a$10$YourHashedPasswordHere');

-- INSERT INTO notes (user_id, title, content) VALUES
-- (1, 'Welcome to Notes App', 'This is your first note. You can create, edit, and share notes with others!'),
-- (1, 'Docker Deployment', 'This app is now running in Docker containers!'),
-- (2, 'Shared Note', 'This note is shared by another user. You can view it but not edit it.');

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO admin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO admin;
