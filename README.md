# 📝 Notes Sharing App

Full-stack web application untuk berbagi catatan dengan fitur authentication, CRUD operations, dan logging system.

**Tech Stack:** Next.js (Frontend) | Golang (Backend) | PostgreSQL (Database) | Docker

## ✨ Fitur Aplikasi

### 1. Registrasi & Login User (JWT Authentication)
- ✅ Registrasi user baru dengan nama, email, dan password
- ✅ Login user dengan JWT token
- ✅ Password di-hash menggunakan bcrypt
- ✅ Protected routes dengan JWT middleware

### 2. CRUD Notes
- ✅ **Create** - Buat catatan baru (user yang login)
- ✅ **Read** - Lihat semua catatan (public sharing)
- ✅ **Update** - Edit catatan (hanya pemilik)
- ✅ **Delete** - Hapus catatan (hanya pemilik)

### 3. Database PostgreSQL dengan Docker
- ✅ PostgreSQL 15 running di Docker container
- ✅ Persistent volume untuk data
- ✅ Database initialization otomatis
- ✅ Tables: users, notes, logs

### 4. Logging System
- ✅ Mencatat setiap HTTP request ke database
- ✅ Log berisi: datetime, method, endpoint, headers, payload, response, status_code
- ✅ Authorization header di-mask untuk keamanan
- ✅ Password di-mask di log payload

## 🚀 Cara Menjalankan Aplikasi

### Opsi 1: Menggunakan Docker (Direkomendasikan) ⭐

**Prasyarat:**
- Docker Desktop sudah terinstall
- Docker Compose sudah terinstall
- Git sudah terinstall

**Langkah-langkah:**

```bash
# 1. Clone repository
git clone https://github.com/quiettira/PROJECTSPKL.git
cd PROJECTSPKL

# 2. Verifikasi file docker-compose.yml ada
ls docker-compose.yml

# 3. Jalankan semua service dengan satu perintah
docker-compose up -d --build

# 4. Cek status services
docker-compose ps

# 5. Lihat logs (opsional)
docker-compose logs -f
```

**Akses aplikasi:**
- 🌐 **Frontend:** http://localhost:3000
- 🔧 **Backend API:** http://localhost:8080
- 🗄️ **Database:** localhost:5433 (user: admin, password: 123456)

**Tunggu 1-2 menit** agar semua service siap, lalu akses frontend!

**Menghentikan services:**
```bash
# Hentikan semua services
docker-compose down

# Hentikan dan hapus volumes (reset data)
docker-compose down -v
```

### Opsi 2: Development Lokal

**Prasyarat:**
- Go 1.21+ sudah terinstall
- Node.js 18+ dan npm sudah terinstall
- PostgreSQL 15+ sudah terinstall dan berjalan

#### Langkah 1: Setup Database

```bash
# Buat database
psql -U postgres
CREATE DATABASE notesdb;
CREATE USER admin WITH PASSWORD '123456';
GRANT ALL PRIVILEGES ON DATABASE notesdb TO admin;
\q

# Jalankan script inisialisasi
psql -U admin -d notesdb -f init.sql
```

#### Langkah 2: Setup Backend

```bash
# Masuk ke direktori backend
cd notes-backend

# Install dependencies
go mod download

# Copy file environment
cp .env.example .env

# Edit file .env dengan kredensial database Anda
# DATABASE_URL=postgres://admin:123456@localhost:5432/notesdb?sslmode=disable
# PORT=8080
# JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Jalankan backend
go run main.go
```

Backend akan berjalan di **http://localhost:8080**

#### Langkah 3: Setup Frontend

```bash
# Buka terminal baru
# Masuk ke direktori frontend
cd notes-frontend

# Install dependencies
npm install

# Copy file environment
cp .env.local.example .env.local

# Edit file .env.local
# NEXT_PUBLIC_API_URL=http://localhost:8080

# Jalankan development server
npm run dev
```

Frontend akan berjalan di **http://localhost:3000**

## 🔧 Contoh Environment Variables (.env)

#### Backend (.env)

**Untuk deployment Docker:**
```env
# Konfigurasi Database
DATABASE_URL=postgres://admin:123456@postgres:5432/notesdb?sslmode=disable

# Konfigurasi Server
PORT=8080

# JWT Secret (ganti ini di production!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-chars
```

**Untuk development lokal:**
```env
# Konfigurasi Database (catatan: localhost bukan postgres)
DATABASE_URL=postgres://admin:123456@localhost:5432/notesdb?sslmode=disable

# Konfigurasi Server
PORT=8080

# JWT Secret (ganti ini di production!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-chars
```

> 📝 **Note:** File `.env.example` tersedia di folder `notes-backend/` sebagai template.

#### Frontend (.env.local)

**Untuk deployment Docker:**
```env
# Backend API URL (menggunakan nama service Docker)
NEXT_PUBLIC_API_URL=http://backend:8080
```

**Untuk development lokal:**
```env
# Backend API URL (menggunakan localhost)
NEXT_PUBLIC_API_URL=http://localhost:8080
```

> 📝 **Note:** File `.env.local.example` tersedia di folder `notes-frontend/` sebagai template.


## 📸 Tampilan Aplikasi

![Login Page](assets-readme/signup.jpeg)

![Register Page](assets-readme/tampilan7.jpeg)

![Dashboard](assets-readme/tampilan.jpeg)

![Create Note](assets-readme/tampilan2.jpeg)

![Note Detail & Edit](assets-readme/tampilan3.jpeg)

![Database Logs](assets-readme/tampilan4.jpeg)

![Database Logs](assets-readme/tampilan6.jpeg)

![Database Logs](assets-readme/tampilan5.jpeg)

## 📋 Contoh Logging System

### Struktur Log Entry

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

### Contoh Log Entries

#### 1. Registrasi User
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

#### 2. Login User
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

#### 3. Buat Catatan (Terautentikasi)
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

#### 4. Ambil Semua Catatan
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

#### 5. Update Catatan
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

#### 6. Hapus Catatan
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

### Cara Melihat Logs

**Melalui API:**
```bash
curl http://localhost:8080/admin/logs
```

**Melalui Database:**
```bash
# Akses PostgreSQL
docker-compose exec db psql -U admin -d notesdb

# Query logs
SELECT id, datetime, method, endpoint, status_code 
FROM logs 
ORDER BY datetime DESC 
LIMIT 10;
```

**Contoh Output:**
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

**Fitur Keamanan Logging:**
- ✅ Authorization headers di-mask (JWT tokens tidak disimpan plaintext)
- ✅ Password di-mask di logs
- ✅ Tracking lengkap setiap request dengan timestamp UTC

---

**Dibuat untuk Bootcamp Selection Test**
