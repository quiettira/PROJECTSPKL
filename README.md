# 📝 Notes Sharing App

Full-stack web application untuk berbagi catatan dengan fitur authentication, CRUD operations, dan logging system.

**Tech Stack:** Next.js (Frontend) | Golang (Backend) | PostgreSQL (Database) | Docker

## 🚀 Setup Instructions

### Option 1: Docker (Recommended) ⭐

**Prerequisites:**
- Docker Desktop installed
- Docker Compose installed
- Git installed

**Step-by-step:**

```bash
# 1. Clone repository
git clone https://github.com/quiettira/PROJECTSPKL.git
cd PROJECTSPKL

# 2. Verify docker-compose.yml exists
ls docker-compose.yml

# 3. Start all services with one command
docker-compose up -d --build

# 4. Check services status
docker-compose ps

# 5. View logs (optional)
docker-compose logs -f
```

**Access the application:**
- 🌐 **Frontend:** http://localhost:3000
- 🔧 **Backend API:** http://localhost:8080
- 🗄️ **Database:** localhost:5433 (user: admin, password: 123456)

**Wait 1-2 minutes** for all services to become healthy, then access the frontend!

**Stopping services:**
```bash
# Stop all services
docker-compose down

# Stop and remove volumes (clean slate)
docker-compose down -v
```

### Option 2: Local Development

**Prerequisites:**
- Go 1.21+ installed
- Node.js 18+ and npm installed
- PostgreSQL 15+ installed and running

#### Step 1: Setup Database

```bash
# Create database
psql -U postgres
CREATE DATABASE notesdb;
CREATE USER admin WITH PASSWORD '123456';
GRANT ALL PRIVILEGES ON DATABASE notesdb TO admin;
\q

# Run initialization script
psql -U admin -d notesdb -f init.sql
```

#### Step 2: Setup Backend

```bash
# Navigate to backend directory
cd notes-backend

# Install dependencies
go mod download

# Copy environment file
cp .env.example .env

# Edit .env file with your database credentials
# DATABASE_URL=postgres://admin:123456@localhost:5432/notesdb?sslmode=disable
# PORT=8080
# JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Run backend
go run main.go
```

Backend will start on **http://localhost:8080**

#### Step 3: Setup Frontend

```bash
# Open new terminal
# Navigate to frontend directory
cd notes-frontend

# Install dependencies
npm install

# Copy environment file
cp .env.local.example .env.local

# Edit .env.local file
# NEXT_PUBLIC_API_URL=http://localhost:8080

# Run development server
npm run dev
```

Frontend will start on **http://localhost:3000**

## 🔧 Contoh Environment Variables (.env)

#### Backend (.env)

**For Docker deployment:**
```env
# Database Configuration
DATABASE_URL=postgres://admin:123456@postgres:5432/notesdb?sslmode=disable

# Server Configuration
PORT=8080

# JWT Secret (change this in production!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-chars
```

**For local development:**
```env
# Database Configuration (note: localhost instead of postgres)
DATABASE_URL=postgres://admin:123456@localhost:5432/notesdb?sslmode=disable

# Server Configuration
PORT=8080

# JWT Secret (change this in production!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-chars
```

> 📝 **Note:** File `.env.example` tersedia di folder `notes-backend/` sebagai template.

#### Frontend (.env.local)

**For Docker deployment:**
```env
# Backend API URL (using Docker service name)
NEXT_PUBLIC_API_URL=http://backend:8080
```

**For local development:**
```env
# Backend API URL (using localhost)
NEXT_PUBLIC_API_URL=http://localhost:8080
```

> 📝 **Note:** File `.env.local.example` tersedia di folder `notes-frontend/` sebagai template.


## 📸 Screenshots

### 1. Login Page
![Login Page](screenshots/login.png)
*User authentication with email and password*

### 2. Register Page
![Register Page](screenshots/register.png)
*New user registration form*

### 3. Dashboard - Notes List
![Dashboard](screenshots/dashboard.png)
*Main dashboard showing user's notes and shared notes*

### 4. Create Note
![Create Note](screenshots/create-note.png)
*Form to create new note*

### 5. Note Detail & Edit
![Note Detail](screenshots/note-detail.png)
*View and edit note details (owner only)*

### 6. Database Logs
![Database Logs](screenshots/logs.png)
*HTTP request logs stored in PostgreSQL*

> 📝 **Note:** Screenshots akan ditambahkan di folder `screenshots/` setelah deployment.

## 📋 Logging System Examples

### Log Entry Structure

Setiap HTTP request akan dicatat ke database dengan struktur berikut:

```json
{
  "id": 1,
  "datetime": "2025-10-15T11:25:30.123Z",
  "method": "POST",
  "endpoint": "/notes",
  "headers": "{\"Content-Type\":\"application/json\",\"Authorization\":\"Bearer ***MASKED***\"}",
  "payload": "{\"title\":\"My First Note\",\"content\":\"This is the content\"}",
  "response": "{\"id\":1,\"title\":\"My First Note\",\"content\":\"This is the content\",\"user_id\":1,\"created_at\":\"2025-10-15T11:25:30.123Z\"}",
  "status_code": 201
}
```

### Sample Log Entries

#### 1. User Registration
```json
{
  "datetime": "2025-10-15 11:20:15",
  "method": "POST",
  "endpoint": "/register",
  "headers": "{\"Content-Type\":\"application/json\"}",
  "payload": "{\"name\":\"John Doe\",\"email\":\"john@example.com\",\"password\":\"***MASKED***\"}",
  "response": "{\"message\":\"User registered successfully\"}",
  "status_code": 201
}
```

#### 2. User Login
```json
{
  "datetime": "2025-10-15 11:21:30",
  "method": "POST",
  "endpoint": "/login",
  "headers": "{\"Content-Type\":\"application/json\"}",
  "payload": "{\"email\":\"john@example.com\",\"password\":\"***MASKED***\"}",
  "response": "{\"token\":\"eyJhbGciOiJIUzI1NiIs...\",\"user\":{\"id\":1,\"name\":\"John Doe\"}}",
  "status_code": 200
}
```

#### 3. Create Note (Authenticated)
```json
{
  "datetime": "2025-10-15 11:22:45",
  "method": "POST",
  "endpoint": "/notes",
  "headers": "{\"Content-Type\":\"application/json\",\"Authorization\":\"Bearer ***MASKED***\"}",
  "payload": "{\"title\":\"Meeting Notes\",\"content\":\"Discuss project requirements\"}",
  "response": "{\"id\":1,\"title\":\"Meeting Notes\",\"user_id\":1,\"created_at\":\"2025-10-15T11:22:45Z\"}",
  "status_code": 201
}
```

#### 4. Get All Notes
```json
{
  "datetime": "2025-10-15 11:23:10",
  "method": "GET",
  "endpoint": "/notes",
  "headers": "{\"Authorization\":\"Bearer ***MASKED***\"}",
  "payload": "",
  "response": "[{\"id\":1,\"title\":\"Meeting Notes\",\"content\":\"Discuss project requirements\",\"user_id\":1}]",
  "status_code": 200
}
```

#### 5. Update Note
```json
{
  "datetime": "2025-10-15 11:24:20",
  "method": "PUT",
  "endpoint": "/notes/1",
  "headers": "{\"Content-Type\":\"application/json\",\"Authorization\":\"Bearer ***MASKED***\"}",
  "payload": "{\"title\":\"Updated Meeting Notes\",\"content\":\"Updated content\"}",
  "response": "{\"message\":\"Note updated successfully\"}",
  "status_code": 200
}
```

#### 6. Delete Note
```json
{
  "datetime": "2025-10-15 11:25:00",
  "method": "DELETE",
  "endpoint": "/notes/1",
  "headers": "{\"Authorization\":\"Bearer ***MASKED***\"}",
  "payload": "",
  "response": "{\"message\":\"Note deleted successfully\"}",
  "status_code": 200
}
```

### Viewing Logs

**Via API:**
```bash
curl http://localhost:8080/admin/logs
```

**Via Database:**
```bash
# Access PostgreSQL
docker-compose exec postgres psql -U admin -d notesdb

# Query logs
SELECT id, datetime, method, endpoint, status_code 
FROM logs 
ORDER BY datetime DESC 
LIMIT 10;
```

**Sample Output:**
```
 id |        datetime         | method |  endpoint   | status_code 
----+-------------------------+--------+-------------+-------------
  6 | 2025-10-15 11:25:00.123 | DELETE | /notes/1    |         200
  5 | 2025-10-15 11:24:20.456 | PUT    | /notes/1    |         200
  4 | 2025-10-15 11:23:10.789 | GET    | /notes      |         200
  3 | 2025-10-15 11:22:45.012 | POST   | /notes      |         201
  2 | 2025-10-15 11:21:30.345 | POST   | /login      |         200
  1 | 2025-10-15 11:20:15.678 | POST   | /register   |         201
```

**Security Features:**
- ✅ Authorization headers are masked (JWT tokens tidak disimpan plaintext)
- ✅ Passwords are masked in logs
- ✅ Complete request tracking dengan timestamp UTC

---

**Created for Bootcamp Selection Test**
