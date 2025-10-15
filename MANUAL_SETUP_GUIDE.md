# 🚀 Manual Setup Guide - Notes Sharing App

## 📋 Cara Menjalankan Aplikasi Secara Manual

Aplikasi ini terdiri dari 3 komponen yang dijalankan **terpisah**:
1. **PostgreSQL Database**
2. **Backend (Golang)**
3. **Frontend (Next.js)**

---

## 1️⃣ Setup PostgreSQL Database

### Install PostgreSQL

**Windows:**
- Download dari: https://www.postgresql.org/download/windows/
- Install PostgreSQL 16 atau lebih baru
- Set password untuk user `postgres`

### Buat Database

```sql
-- Buka pgAdmin atau psql
-- Login sebagai postgres

-- Buat user admin
CREATE USER admin WITH PASSWORD '123456';

-- Buat database
CREATE DATABASE notesdb OWNER admin;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE notesdb TO admin;
```

### Jalankan init.sql

```powershell
# Dari folder project
cd D:\PROJECTSPKL

# Import schema
psql -U admin -d notesdb -f init.sql
# Password: 123456
```

**Atau via pgAdmin:**
1. Buka pgAdmin
2. Connect ke database `notesdb`
3. Tools → Query Tool
4. Open file `init.sql`
5. Execute

### Verify Database

```sql
-- Connect ke notesdb
\c notesdb

-- Cek tables
\dt

-- Harus ada:
-- users
-- notes
-- logs
```

---

## 2️⃣ Setup & Run Backend (Golang)

### Prerequisites

- Go 1.23 atau lebih baru
- PostgreSQL running

### Install Dependencies

```powershell
cd D:\PROJECTSPKL\notes-backend

# Download dependencies
go mod download

# Verify
go mod verify
```

### Setup Environment Variables

Buat file `.env` di folder `notes-backend`:

```env
DATABASE_URL=postgres://admin:123456@localhost:5432/notesdb?sslmode=disable
PORT=8080
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

**Atau copy dari .env.example:**

```powershell
# Di folder notes-backend
Copy-Item ..\.env.example .env
```

### Run Backend

```powershell
cd D:\PROJECTSPKL\notes-backend

# Run
go run main.go
```

**Expected output:**
```
🚀 Server running on http://localhost:8080
```

### Test Backend

Buka browser atau terminal baru:

```powershell
curl http://localhost:8080
```

**Response:**
```
Notes App Backend is running ✅
```

---

## 3️⃣ Setup & Run Frontend (Next.js)

### Prerequisites

- Node.js 20 atau lebih baru
- npm atau yarn
- Backend sudah running

### Install Dependencies

```powershell
cd D:\PROJECTSPKL\notes-frontend

# Install
npm install
```

### Setup Environment Variables

Buat file `.env.local` di folder `notes-frontend`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

**Atau buat manual:**

```powershell
# Di folder notes-frontend
echo "NEXT_PUBLIC_API_URL=http://localhost:8080" > .env.local
```

### Run Frontend

```powershell
cd D:\PROJECTSPKL\notes-frontend

# Run development server
npm run dev
```

**Expected output:**
```
  ▲ Next.js 15.5.4
  - Local:        http://localhost:3000
  - Turbopack:    enabled

 ✓ Ready in 2.5s
```

### Access Application

Buka browser: **http://localhost:3000**

---

## ✅ Verifikasi Semua Berjalan

### Checklist:

- [ ] PostgreSQL running (port 5432)
- [ ] Database `notesdb` ada dengan 3 tables
- [ ] Backend running (port 8080)
- [ ] Frontend running (port 3000)
- [ ] Frontend bisa akses backend

### Test Flow:

1. **Register User**
   - Buka http://localhost:3000
   - Klik Register
   - Isi form dan submit

2. **Login**
   - Login dengan user yang baru dibuat
   - Harus redirect ke dashboard

3. **Create Note**
   - Isi form create note
   - Submit
   - Note muncul di list

4. **Check Database**
   ```sql
   -- Di psql atau pgAdmin
   SELECT * FROM users;
   SELECT * FROM notes;
   SELECT * FROM logs;
   ```

---

## 🔧 Troubleshooting

### Backend Error: "Error loading .env file"

**Solusi:**
```powershell
cd notes-backend

# Pastikan .env ada
ls .env

# Jika tidak ada, buat:
Copy-Item ..\.env.example .env
```

### Backend Error: "connection refused"

**Solusi:**
1. Pastikan PostgreSQL running
2. Cek connection string di `.env`
3. Test connection:
   ```powershell
   psql -U admin -d notesdb
   # Password: 123456
   ```

### Frontend Error: "Failed to fetch"

**Solusi:**
1. Pastikan backend running di port 8080
2. Test: `curl http://localhost:8080`
3. Cek `.env.local` di frontend
4. Restart frontend

### Port Already in Use

**Backend (8080):**
```powershell
# Cek process
netstat -ano | findstr :8080

# Kill process atau ubah PORT di .env
```

**Frontend (3000):**
```powershell
# Cek process
netstat -ano | findstr :3000

# Kill atau run di port lain:
npm run dev -- -p 3001
```

---

## 📊 Development Workflow

### Normal Development:

**Terminal 1 - Database:**
```powershell
# PostgreSQL biasanya running sebagai service
# Cek status di Services (services.msc)
```

**Terminal 2 - Backend:**
```powershell
cd D:\PROJECTSPKL\notes-backend
go run main.go
```

**Terminal 3 - Frontend:**
```powershell
cd D:\PROJECTSPKL\notes-frontend
npm run dev
```

### Stop Services:

- **Backend**: Ctrl+C di terminal
- **Frontend**: Ctrl+C di terminal
- **Database**: Jangan stop (biarkan running)

---

## 🗄️ Database Management

### Backup Database

```powershell
pg_dump -U admin notesdb > backup.sql
```

### Restore Database

```powershell
psql -U admin -d notesdb < backup.sql
```

### Reset Database

```powershell
# Drop dan recreate
psql -U postgres

DROP DATABASE notesdb;
CREATE DATABASE notesdb OWNER admin;
\q

# Import ulang
psql -U admin -d notesdb -f init.sql
```

---

## 📝 Environment Variables Summary

### Backend (.env)
```env
DATABASE_URL=postgres://admin:123456@localhost:5432/notesdb?sslmode=disable
PORT=8080
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

---

## 🎯 Quick Commands Reference

### Backend
```powershell
cd notes-backend
go mod download      # Install dependencies
go run main.go       # Run server
go build            # Build binary
```

### Frontend
```powershell
cd notes-frontend
npm install         # Install dependencies
npm run dev         # Run dev server
npm run build       # Build for production
npm start           # Run production build
```

### Database
```powershell
psql -U admin -d notesdb              # Connect
psql -U admin -d notesdb -f init.sql  # Import schema
pg_dump -U admin notesdb > backup.sql # Backup
```

---

## ✅ Checklist Sebelum Testing

- [ ] PostgreSQL installed dan running
- [ ] Database `notesdb` created
- [ ] Tables created (users, notes, logs)
- [ ] Go installed (go version)
- [ ] Node.js installed (node --version)
- [ ] Backend .env file configured
- [ ] Frontend .env.local file configured
- [ ] Backend dependencies installed (go mod download)
- [ ] Frontend dependencies installed (npm install)
- [ ] All 3 components running simultaneously

---

**Setup manual selesai! Aplikasi siap digunakan! 🎉**
