# 🚀 Quick Fix Guide

## ⚡ Error: pattern dist/*: no matching files found

### Quick Fix (1 Command)

```bash
chmod +x fix-embed.sh
./fix-embed.sh
```

Script ini akan:
1. ✅ Hapus embed directive dari main.go
2. ✅ Build frontend
3. ✅ Build Go application
4. ✅ Test binary

---

## 📋 Manual Fix (Step-by-Step)

### Step 1: Check main.go

```bash
# Check if embed directive exists
grep -n "embed" cmd/server/main.go
```

**Jika ada output**, hapus baris tersebut:
```bash
# Backup
cp cmd/server/main.go cmd/server/main.go.backup

# Remove embed lines
sed -i '/"embed"/d' cmd/server/main.go
sed -i '/\/\/go:embed/d' cmd/server/main.go
sed -i '/var frontendFS embed.FS/d' cmd/server/main.go
```

### Step 2: Build Frontend

```bash
npm install
npm run build
```

### Step 3: Build Go

```bash
go build -ldflags="-w -s" -o cute-finance ./cmd/server
```

### Step 4: Run

```bash
./cute-finance -install
```

---

## 🔍 Debug dengan Log File

Installer sekarang membuat log file otomatis:

```bash
# Jalankan installer
./install.sh

# Lihat log file
ls -la install-*.log

# View log
cat install-20240115-123456.log
```

Log berisi:
- ✅ Semua command yang dijalankan
- ✅ Output dari setiap step
- ✅ Error details
- ✅ File listings

---

## 🆘 Troubleshooting

### Problem 1: Still getting embed error

```bash
# Check main.go
head -30 cmd/server/main.go

# Should NOT have:
# import "embed"
# //go:embed all:dist
# var frontendFS embed.FS
```

### Problem 2: dist folder not found

```bash
# Build frontend
npm run build

# Verify
ls -la dist/
```

### Problem 3: Build failed

```bash
# Clean and rebuild
rm -f cute-finance
rm -rf dist/
rm -f go.sum

# Rebuild
npm install
npm run build
go mod download
go mod tidy
go build -o cute-finance ./cmd/server
```

---

## 📊 Verification

After fix, verify:

```bash
# 1. Binary exists
ls -lh cute-finance

# 2. Can run version
./cute-finance -version

# 3. Frontend exists
ls -la dist/

# 4. Can install
./cute-finance -install
```

---

## 📞 Need Help?

1. Check log: `cat install-*.log`
2. Check debug guide: `cat DEBUG-EMBED.md`
3. Run fix script: `./fix-embed.sh`

---

**Status: Ready to Fix** 🔧
