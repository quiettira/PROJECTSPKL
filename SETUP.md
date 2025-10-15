# 🚀 Setup Guide - Notes Sharing App

## Prerequisites

- Docker Desktop installed
- Git installed
- Port 3000, 8080, dan 5433 tersedia

## Quick Start (5 menit)

### 1. Clone Repository
```bash
git clone https://github.com/YOUR_USERNAME/notes-sharing-app.git
cd notes-sharing-app
```

### 2. Setup Database
```bash
# Jalankan migration untuk membuat tabel
docker-compose up -d db

# Tunggu 5 detik, lalu jalankan migration
Get-Content notes-backend/migrations/001_init.sql | docker exec -i notesapp-postgres psql -U admin -d notesdb
```

### 3. Build & Run All Services
```bash
# Build semua images
docker-compose build

# Start semua containers
docker-compose up -d
```

### 4. Verify Services
```bash
# Cek status containers
docker-compose ps

# Semua harus "Up"
# - notesapp-postgres (Up)
# - notesapp-backend (Up)
# - notesapp-frontend (Up)
```

### 5. Access Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **Database**: localhost:5433

## First Time Usage

### 1. Register User
1. Buka http://localhost:3000/register
2. Isi form:
   - Name: Test User
   - Email: test@example.com
   - Password: password123
3. Klik "Sign Up"

### 2. Login
1. Otomatis redirect ke http://localhost:3000/login
2. Login dengan credentials yang baru dibuat
3. Akan masuk ke dashboard

### 3. Create Note
1. Di dashboard, isi form "Create New Note"
2. Title: "My First Note"
3. Content: "This is my first note!"
4. Klik "Create Note"

### 4. View & Manage Notes
- **Your Notes**: Notes yang Anda buat
- **Shared by Others**: Notes dari user lain
- Klik note untuk lihat detail
- Edit/Delete hanya bisa untuk notes Anda sendiri

## Troubleshooting

### Container terus restart
```bash
# Lihat logs
docker-compose logs backend
docker-compose logs frontend
docker-compose logs db

# Restart semua
docker-compose down
docker-compose up -d
```

### Database error
```bash
# Reset database
docker-compose down -v
docker-compose up -d db

# Jalankan migration lagi
Get-Content notes-backend/migrations/001_init.sql | docker exec -i notesapp-postgres psql -U admin -d notesdb
```

### Port sudah digunakan
```bash
# Cek port yang digunakan
netstat -ano | findstr :3000
netstat -ano | findstr :8080
netstat -ano | findstr :5433

# Matikan process atau ubah port di docker-compose.yml
```

## Development Mode

### Backend Development
```bash
cd notes-backend
go run main.go
```

### Frontend Development
```bash
cd notes-frontend
npm run dev
```

## Database Access

### Via Docker
```bash
docker exec -it notesapp-postgres psql -U admin -d notesdb
```

### Via GUI (pgAdmin/DBeaver)
- Host: localhost
- Port: 5433
- Database: notesdb
- Username: admin
- Password: 123456

## Useful Commands

```bash
# Stop semua
docker-compose down

# Start semua
docker-compose up -d

# Rebuild semua
docker-compose up --build -d

# Lihat logs real-time
docker-compose logs -f

# Lihat logs specific service
docker-compose logs -f backend

# Restart specific service
docker-compose restart backend

# Remove semua (termasuk volume)
docker-compose down -v
```

## Environment Variables

### Backend (.env)
```env
DATABASE_URL=postgres://admin:123456@db:5432/notesdb?sslmode=disable
PORT=8080
JWT_SECRET=supersecretkey
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

## Testing

### Test Backend API
```bash
# Health check
curl http://localhost:8080

# Register
curl -X POST http://localhost:8080/register -H "Content-Type: application/json" -d "{\"name\":\"Test\",\"email\":\"test@mail.com\",\"password\":\"pass123\"}"

# Login
curl -X POST http://localhost:8080/login -H "Content-Type: application/json" -d "{\"email\":\"test@mail.com\",\"password\":\"pass123\"}"
```

### Test Database
```bash
# Cek tabel
docker exec -it notesapp-postgres psql -U admin -d notesdb -c "\dt"

# Cek data users
docker exec -it notesapp-postgres psql -U admin -d notesdb -c "SELECT * FROM users;"

# Cek data notes
docker exec -it notesapp-postgres psql -U admin -d notesdb -c "SELECT * FROM notes;"

# Cek logs
docker exec -it notesapp-postgres psql -U admin -d notesdb -c "SELECT * FROM logs ORDER BY id DESC LIMIT 10;"
```

## Production Deployment

### Update Environment Variables
1. Edit `docker-compose.yml`
2. Ganti password database
3. Ganti JWT_SECRET
4. Update NEXT_PUBLIC_API_URL dengan domain production

### Build for Production
```bash
docker-compose -f docker-compose.yml build
docker-compose -f docker-compose.yml up -d
```

## Support

Jika ada masalah:
1. Cek logs: `docker-compose logs -f`
2. Restart services: `docker-compose restart`
3. Reset semua: `docker-compose down -v && docker-compose up -d`

---

**Setup selesai! Happy coding! 🎉**
