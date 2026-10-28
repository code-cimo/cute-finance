# 🔧 Debug Guide - Error: pattern dist/*: no matching files found

## 🎯 Error yang Terjadi

```
cmd/server/main.go:25:12: pattern dist/*: no matching files found
```

## 📋 Penyebab

Error ini terjadi karena:
1. File `cmd/server/main.go` memiliki directive `//go:embed all:dist`
2. Folder `dist` tidak ada di `cmd/server/`
3. Go compiler mencari folder `dist` untuk di-embed tapi tidak menemukannya

## ✅ Solusi (3 Langkah)

### Step 1: Hapus Embed Directive

File `cmd/server/main.go` **TIDAK BOLEH** memiliki baris ini:
```go
//go:embed all:dist
var frontendFS embed.FS
```

**Jika ada, hapus baris tersebut!**

File yang benar seharusnya:
```go
package main

import (
    "database/sql"
    "encoding/json"
    // ... imports lainnya
    // TIDAK ADA "embed" import
)

const AppVersion = "1.0.0"

// ... kode lainnya
```

### Step 2: Build Frontend Dulu

```bash
# Install dependencies
npm install

# Build frontend
npm run build

# Verify dist folder exists
ls -la dist/
```

Output yang diharapkan:
```
dist/
├── index.html
├── assets/
│   ├── index-xxx.js
│   └── index-xxx.css
└── ...
```

### Step 3: Build Go Application

```bash
go build -ldflags="-w -s" -o cute-finance ./cmd/server
```

## 🔍 Verification Checklist

Jalankan perintah ini untuk verifikasi:

```bash
# 1. Check apakah ada embed directive
grep -n "embed" cmd/server/main.go

# Jika ada output, berarti masih ada embed directive
# Hapus baris yang mengandung "embed"

# 2. Check apakah dist folder ada
ls -la dist/

# Jika tidak ada, build frontend dulu:
npm run build

# 3. Check go.mod
cat go.mod

# Pastikan ada:
# module github.com/cutefinance/pwa
# go 1.22
```

## 🚀 Quick Fix Script

Buat file `fix-embed.sh`:

```bash
#!/bin/bash

echo "🔧 Fixing embed issue..."

# Step 1: Check for embed directive
if grep -q "//go:embed" cmd/server/main.go; then
    echo "⚠️  Found embed directive in main.go"
    echo "Removing embed directive..."
    
    # Backup original
    cp cmd/server/main.go cmd/server/main.go.backup
    
    # Remove embed import and directive
    sed -i '/"embed"/d' cmd/server/main.go
    sed -i '/\/\/go:embed/d' cmd/server/main.go
    sed -i '/var frontendFS embed.FS/d' cmd/server/main.go
    
    echo "✅ Embed directive removed"
else
    echo "✅ No embed directive found"
fi

# Step 2: Build frontend
echo ""
echo "📦 Building frontend..."
if command -v npm &> /dev/null; then
    npm install
    npm run build
    echo "✅ Frontend built"
else
    echo "⚠️  npm not found - skip frontend build"
fi

# Step 3: Build Go
echo ""
echo "🔨 Building Go application..."
go build -ldflags="-w -s" -o cute-finance ./cmd/server

if [ -f "cute-finance" ]; then
    echo "✅ Build successful!"
    ls -lh cute-finance
else
    echo "❌ Build failed!"
    exit 1
fi
```

Jalankan:
```bash
chmod +x fix-embed.sh
./fix-embed.sh
```

## 📊 Debug dengan Log File

Installer sekarang membuat log file otomatis:

```bash
# Jalankan installer
./install.sh

# Check log file
ls -la install-*.log

# View log
cat install-*.log | less
```

Log akan menunjukkan:
- ✅ Step-by-step process
- ✅ Error details
- ✅ Command outputs
- ✅ File listings

## 🆘 Jika Masih Error

### Option 1: Clean Build

```bash
# Clean everything
rm -f cute-finance
rm -rf dist/
rm -rf node_modules/
rm -f go.sum

# Reinstall
npm install
npm run build
go mod download
go mod tidy

# Build
go build -o cute-finance ./cmd/server
```

### Option 2: Check Go Version

```bash
go version

# Harus Go 1.22+
# Jika lebih lama, update Go:
# https://go.dev/dl/
```

### Option 3: Manual File Check

```bash
# Check main.go structure
head -30 cmd/server/main.go

# Harus seperti ini:
# package main
# 
# import (
#     "database/sql"
#     "encoding/json"
#     ...
# )
# 
# const AppVersion = "1.0.0"

# TIDAK ADA:
# import "embed"
# //go:embed all:dist
# var frontendFS embed.FS
```

## 📞 Support

Jika masih ada masalah:

1. Check log file: `cat install-*.log`
2. Check main.go: `head -30 cmd/server/main.go`
3. Check dist folder: `ls -la dist/`
4. Send log file untuk debug

---

**Status: Fixed** ✅

File main.go sudah diupdate untuk tidak menggunakan embed directive.
