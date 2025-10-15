# 📤 Cara Push ke GitHub

## Step 1: Buat Repository di GitHub

1. Buka https://github.com
2. Klik tombol **"New"** atau **"+"** → **"New repository"**
3. Isi form:
   - **Repository name**: `notes-sharing-app` (atau nama lain)
   - **Description**: "Full-stack Notes Sharing App with Go, Next.js, PostgreSQL, and Docker"
   - **Visibility**: ✅ **Public**
   - ❌ Jangan centang "Add a README file" (sudah ada)
   - ❌ Jangan centang "Add .gitignore" (sudah ada)
4. Klik **"Create repository"**

## Step 2: Initialize Git (Jika Belum)

```bash
# Masuk ke folder project
cd d:\PROJECTSPKL

# Initialize git (jika belum)
git init

# Cek status
git status
```

## Step 3: Add & Commit Files

```bash
# Add semua file
git add .

# Commit
git commit -m "Initial commit: Full-stack Notes Sharing App

Features:
- Backend: Golang + Fiber + PostgreSQL + JWT
- Frontend: Next.js 15 + React
- Authentication: Register & Login
- CRUD Notes with owner validation
- Logging system to database
- Docker deployment with docker-compose
- Database migrations
"

# Atau commit singkat
git commit -m "Initial commit: Notes Sharing App"
```

## Step 4: Add Remote & Push

```bash
# Add remote (ganti YOUR_USERNAME dengan username GitHub Anda)
git remote add origin https://github.com/YOUR_USERNAME/notes-sharing-app.git

# Cek remote
git remote -v

# Push ke GitHub
git branch -M main
git push -u origin main
```

## Step 5: Verify

1. Buka repository di GitHub
2. Pastikan semua file sudah ter-upload
3. README.md akan otomatis ditampilkan

## 🎯 Struktur File yang Di-Push

```
✅ notes-backend/          (Backend code)
✅ notes-frontend/         (Frontend code)
✅ docker-compose.yml      (Docker orchestration)
✅ README.md               (Documentation)
✅ SETUP.md                (Setup guide)
✅ .gitignore              (Git ignore rules)
✅ notes-backend/migrations/ (Database migrations)

❌ .env                    (Ignored - sensitive)
❌ .env.local              (Ignored - sensitive)
❌ node_modules/           (Ignored - dependencies)
❌ .next/                  (Ignored - build files)
```

## Troubleshooting

### Error: "remote origin already exists"
```bash
# Hapus remote lama
git remote remove origin

# Add remote baru
git remote add origin https://github.com/YOUR_USERNAME/notes-sharing-app.git
```

### Error: "failed to push some refs"
```bash
# Pull dulu (jika ada conflict)
git pull origin main --allow-unrelated-histories

# Lalu push lagi
git push -u origin main
```

### File .env ter-push (BAHAYA!)
```bash
# Remove from git
git rm --cached .env
git rm --cached notes-backend/.env
git rm --cached notes-frontend/.env.local

# Commit
git commit -m "Remove sensitive files"

# Push
git push
```

## Update Repository (Setelah Ada Perubahan)

```bash
# Add perubahan
git add .

# Commit dengan pesan
git commit -m "Update: Add new feature"

# Push
git push
```

## Clone Repository (Di Komputer Lain)

```bash
# Clone
git clone https://github.com/YOUR_USERNAME/notes-sharing-app.git

# Masuk folder
cd notes-sharing-app

# Setup environment variables
cp notes-backend/.env.example notes-backend/.env
cp notes-frontend/.env.local.example notes-frontend/.env.local

# Edit .env files dengan credentials Anda

# Run dengan Docker
docker-compose up -d
```

## 📝 Tips

1. **Jangan push file sensitive** (.env, passwords, API keys)
2. **Gunakan .gitignore** untuk exclude file yang tidak perlu
3. **Commit message yang jelas** untuk memudahkan tracking
4. **Push secara berkala** untuk backup code
5. **Gunakan branch** untuk fitur baru (optional)

## 🎉 Selesai!

Repository Anda sekarang public dan bisa diakses di:
```
https://github.com/YOUR_USERNAME/notes-sharing-app
```

Share link ini untuk portfolio atau submission! 🚀
