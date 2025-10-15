# 📝 Notes Sharing App

Full-stack web application untuk berbagi catatan dengan fitur authentication, CRUD operations, dan logging system.

## 🚀 Tech Stack

- **Frontend:** Next.js 15 (React)
- **Backend:** Golang (Fiber framework)
- **Database:** PostgreSQL
- **Authentication:** JWT
- **Deployment:** Docker & Docker Compose

## ✨ Features

### Authentication
- ✅ User registration
- ✅ User login with JWT
- ✅ Password hashing (bcrypt)
- ✅ Protected routes

### Notes Management
- ✅ Create notes (authenticated users)
- ✅ View all notes (public sharing)
- ✅ View note details
- ✅ Edit notes (owner only)
- ✅ Delete notes (owner only)

### Logging System
- ✅ Log semua HTTP requests
- ✅ Log disimpan ke database PostgreSQL
- ✅ Mencatat: datetime, method, endpoint, headers, payload, response, status code
- ✅ Authorization header di-mask untuk security

## 📁 Project Structure

```
PROJECTSPKL/
├── notes-backend/           # Golang REST API
│   ├── internal/
│   │   ├── database/       # Database connection
│   │   ├── handlers/       # HTTP handlers
│   │   ├── middleware/     # JWT & Logging middleware
│   │   └── models/         # Data models
│   ├── main.go
│   ├── Dockerfile
│   └── .env
│
├── notes-frontend/          # Next.js application
│   ├── src/
│   │   ├── app/           # Pages & routes
│   │   ├── components/    # React components
│   │   └── lib/          # API utilities
│   ├── Dockerfile
│   └── .env.local
│
├── docker-compose.yml       # Docker orchestration
├── init.sql                # Database initialization
└── README.md
```

## 🏃 Quick Start

### Option 1: Docker (Recommended) ⭐

```bash
# Clone repository
git clone <repository-url>
cd PROJECTSPKL

# Start all services with one command
docker-compose up -d --build

# Or use deployment script (Windows)
.\deploy.ps1 build

# Access application
# Frontend: http://localhost:3000
# Backend: http://localhost:8080
# Database: localhost:5433
```

**Wait 1-2 minutes** for all services to become healthy, then access the frontend!

### Option 2: Manual Setup

#### Backend
```bash
cd notes-backend

# Install dependencies
go mod download

# Setup database (PostgreSQL harus running)
# Edit .env dengan database credentials

# Run
go run main.go
```

#### Frontend
```bash
cd notes-frontend

# Install dependencies
npm install

# Create .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:8080" > .env.local

# Run development server
npm run dev
```

## 🔧 Configuration

### Environment Variables

**Backend (.env)**
```env
DATABASE_URL=postgres://admin:123456@localhost:5433/notesdb?sslmode=disable
PORT=8080
JWT_SECRET=your-secret-key
```

**Frontend (.env.local)**
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

## 📚 API Documentation

### Authentication

#### Register
```http
POST /register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login
```http
POST /login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### Notes (Protected - Require JWT)

#### Get All Notes
```http
GET /notes
Authorization: Bearer {token}
```

#### Get Note by ID
```http
GET /notes/{id}
Authorization: Bearer {token}
```

#### Create Note
```http
POST /notes
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "My Note",
  "content": "Note content here"
}
```

#### Update Note
```http
PUT /notes/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated content"
}
```

#### Delete Note
```http
DELETE /notes/{id}
Authorization: Bearer {token}
```

### Logs

#### Get All Logs
```http
GET /admin/logs
```

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### Notes Table
```sql
CREATE TABLE notes (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    content TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### Logs Table
```sql
CREATE TABLE logs (
    id SERIAL PRIMARY KEY,
    datetime TIMESTAMP DEFAULT NOW(),
    method VARCHAR(10),
    endpoint VARCHAR(255),
    headers TEXT,
    payload TEXT,
    response TEXT,
    status_code INT
);
```

## 🐳 Docker Commands

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild services
docker-compose up --build -d

# Access database
docker-compose exec postgres psql -U admin -d notesdb

# Access backend shell
docker-compose exec backend sh
```

## 🧪 Testing

### Manual Testing

1. **Register User**
   - Go to http://localhost:3000/register
   - Fill form and submit

2. **Login**
   - Go to http://localhost:3000/login
   - Use registered credentials

3. **Create Note**
   - After login, use form in dashboard
   - Submit note

4. **View Notes**
   - See "Your Notes" section
   - See "Shared by Others" section

5. **Edit/Delete**
   - Click note to view detail
   - Edit button appears for your notes
   - Delete button in dashboard

### API Testing with curl

```bash
# Register
curl -X POST http://localhost:8080/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@mail.com","password":"pass123"}'

# Login
curl -X POST http://localhost:8080/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@mail.com","password":"pass123"}'

# Get notes (replace TOKEN)
curl -X GET http://localhost:8080/notes \
  -H "Authorization: Bearer TOKEN"
```

## 📊 Features Checklist

### Backend
- [x] User registration
- [x] User login with JWT
- [x] JWT middleware protection
- [x] CRUD Notes endpoints
- [x] Owner authorization
- [x] Logging middleware
- [x] Logs saved to database
- [x] CORS configuration

### Frontend
- [x] Register page
- [x] Login page
- [x] Dashboard with notes list
- [x] Create note form
- [x] Note detail page
- [x] Edit note functionality
- [x] Delete note functionality
- [x] JWT storage in localStorage
- [x] Protected routes
- [x] Modern UI design

### Deployment
- [x] Backend Dockerfile
- [x] Frontend Dockerfile
- [x] docker-compose.yml
- [x] PostgreSQL with persistent volume
- [x] Database initialization script
- [x] Health checks
- [x] Multi-stage builds

## 🔐 Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT token authentication
- ✅ Protected API endpoints
- ✅ Owner-only authorization for edit/delete
- ✅ Authorization header masking in logs
- ✅ CORS configuration
- ✅ SQL injection prevention (parameterized queries)

## 📝 Documentation Files

- `README.md` - This file (overview)
- `DOCKER_DEPLOYMENT_GUIDE.md` - **Complete Docker deployment guide** ⭐
- `DEPLOYMENT_CHECKLIST.md` - **Step-by-step deployment checklist** ⭐
- `PRESENTATION_GUIDE.md` - **Presentation template & tips** ⭐
- `DOCKER_DEPLOYMENT.md` - Docker deployment details
- `KONEKSI_FRONTEND_BACKEND.md` - Frontend-Backend connection details
- `CHECKLIST_REQUIREMENTS.md` - Requirements checklist
- `FIXED_HYDRATION_ERROR.md` - Hydration error fix documentation
- `TEST_EDIT_NOTE.md` - Edit note troubleshooting guide

## 🤝 Contributing

This is a bootcamp test project. For educational purposes only.

## 📄 License

MIT License

## 👨‍💻 Author

Created for Bootcamp Selection Test

## 🎯 Project Goals

This project demonstrates:
- Full-stack development skills
- RESTful API design
- JWT authentication implementation
- Database design and management
- Docker containerization
- Modern web development practices
- Clean code architecture

## 🚀 Next Steps (Optional Improvements)

- [ ] Upload gambar pada notes
- [ ] Search and filter functionality
- [ ] Categories/tags for notes
- [ ] User profile management
- [ ] Email verification
- [ ] Password reset
- [ ] Real-time updates with WebSocket
- [ ] Unit tests
- [ ] Integration tests
- [ ] CI/CD pipeline

---

**Happy Coding! 🎉**
