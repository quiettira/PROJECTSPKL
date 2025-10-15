# 🚀 Cara Menjalankan Project Notes Sharing App

## Prerequisites
- PostgreSQL terinstall dan berjalan di komputer Anda
- Go 1.22+ terinstall
- Node.js 20+ terinstall

---

## 📋 Langkah-langkah Setup

### 1️⃣ Setup Database PostgreSQL

**Buat database dan user:**
```sql
CREATE DATABASE notesdb;
CREATE USER admin WITH PASSWORD '123456';
GRANT ALL PRIVILEGES ON DATABASE notesdb TO admin;
```

**Jalankan init.sql untuk membuat tables:**
```bash
psql -U admin -d notesdb -f init.sql
```

Atau copy-paste isi file `init.sql` ke PostgreSQL client Anda.

---

### 2️⃣ Setup Backend (Golang)

**Masuk ke folder backend:**
```bash
cd notes-backend
```

**Buat file `.env` (copy dari .env.example):**
```bash
# Di Windows PowerShell:
Copy-Item ..\.env.example .env
```

**Edit file `.env` jika perlu:**
```env
DATABASE_URL=postgres://admin:123456@localhost:5433/notesdb?sslmode=disable
PORT=8080
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

**⚠️ PENTING:** Port PostgreSQL adalah **5433**, bukan 5432!

**Install dependencies:**
```bash
go mod download
```

**Jalankan backend:**
```bash
go run main.go
```

✅ Backend akan berjalan di: **http://localhost:8080**

---

### 3️⃣ Setup Frontend (Next.js)

**Buka terminal baru, masuk ke folder frontend:**
```bash
cd notes-frontend
```

**Install dependencies:**
```bash
npm install
```

**Jalankan frontend (development mode):**
```bash
npm run dev
```

✅ Frontend akan berjalan di: **http://localhost:3000**

---

## 🎯 Testing Project

1. **Buka browser:** http://localhost:3000
2. **Register** akun baru
3. **Login** dengan akun yang baru dibuat
4. **Create Note** - Tambah catatan baru
5. **View Notes** - Lihat semua catatan (yours + shared)
6. **Edit/Delete** - Hanya bisa edit/delete catatan sendiri
7. **View Logs** - Akses http://localhost:8080/admin/logs untuk melihat semua request logs

---

## 🔍 Troubleshooting

### ❌ Error: "Unable to connect to database"
**Solusi:**
- Pastikan PostgreSQL sudah berjalan
- Cek username, password, dan database name di `.env`
- Test koneksi: `psql -U admin -d notesdb`

### ❌ Error: "Port 8080 already in use"
**Solusi:**
- Matikan aplikasi lain yang menggunakan port 8080
- Atau ubah PORT di file `.env` backend

### ❌ Error: "Port 3000 already in use"
**Solusi:**
- Matikan aplikasi lain yang menggunakan port 3000
- Atau jalankan dengan port berbeda: `npm run dev -- -p 3001`

### ❌ Frontend tidak bisa connect ke backend
**Solusi:**
- Pastikan backend sudah berjalan di port 8080
- Cek `NEXT_PUBLIC_API_URL` di `notes-frontend/src/lib/api.js`

---

## 📁 Struktur Project

```
PROJECTSPKL/
├── notes-backend/          # Backend Golang
│   ├── internal/
│   │   ├── handlers/      # Auth & Notes handlers
│   │   ├── middleware/    # JWT & Logger middleware
│   │   ├── database/      # Database connection
│   │   └── models/        # Data models
│   ├── main.go           # Entry point
│   └── .env              # Environment variables (buat manual)
│
├── notes-frontend/         # Frontend Next.js
│   ├── src/
│   │   ├── app/          # Pages (login, register, notes)
│   │   ├── components/   # Reusable components
│   │   └── lib/          # API utilities
│   └── package.json
│
├── init.sql               # Database schema
└── .env.example          # Template environment variables
```

---

## 🎉 Fitur yang Sudah Berjalan

✅ **Authentication:**
- Register user baru
- Login dengan JWT token
- Auto-redirect jika belum login

✅ **Notes Management:**
- Create note (dengan JWT protection)
- View all notes (yours + shared by others)
- View note detail
- Edit note (hanya owner)
- Delete note (hanya owner)

✅ **Logging System:**
- Semua request tercatat di database
- Mencatat: datetime, method, endpoint, headers, payload, response, status code
- Authorization header di-mask untuk keamanan
- View logs di: http://localhost:8080/admin/logs

---

## 🔐 API Endpoints

### Auth
- `POST /register` - Register user baru
- `POST /login` - Login dan dapatkan JWT token

### Notes (Protected dengan JWT)
- `GET /notes` - Get semua notes
- `GET /notes/:id` - Get detail note
- `POST /notes` - Create note baru
- `PUT /notes/:id` - Update note (owner only)
- `DELETE /notes/:id` - Delete note (owner only)

### Admin
- `GET /admin/logs` - View all request logs

---

## 💡 Tips Development

1. **Backend:** Gunakan `go run main.go` untuk auto-reload saat development
2. **Frontend:** `npm run dev` sudah support hot-reload
3. **Database:** Gunakan pgAdmin atau DBeaver untuk manage database
4. **Testing API:** Gunakan Postman atau Thunder Client (VS Code extension)

---

## 📝 Catatan Penting

- File `.env` tidak di-commit ke Git (sudah ada di .gitignore)
- JWT Secret harus diganti di production
- Password database harus lebih kuat di production
- Logging system otomatis berjalan untuk semua request
