# 🔧 Fix Error Dependencies

## Error yang Sering Terjadi

### Error 1: Invalid Version
```
go: modernc.org/gc/v3@v3.0.0-20240304020402-f0667fa4495b: invalid version: unknown revision
```

### Error 2: Malformed go.sum
```
malformed go.sum: wrong number of fields
```

### Error 3: Module Not Found
```
no required module provides package
```

---

## ✅ Solusi (3 Cara)

### Cara 1: Gunakan Setup Script (Recommended)

```bash
chmod +x setup.sh
./setup.sh
```

Script ini akan:
- ✅ Hapus go.sum lama
- ✅ Clean module cache
- ✅ Download dependencies baru
- ✅ Generate go.sum yang benar

### Cara 2: Manual Fix

```bash
# 1. Hapus go.sum
rm -f go.sum

# 2. Clean module cache
go clean -modcache

# 3. Download ulang
go mod download

# 4. Tidy modules
go mod tidy

# 5. Build
go build -o cute-finance ./cmd/server
```

### Cara 3: Full Reset

```bash
# Hapus semua artifacts
rm -f go.sum cute-finance cute-finance-arm64 cute-finance-amd64

# Clean everything
go clean -modcache
go clean -cache

# Re-download
go mod download
go mod tidy

# Build
go build -o cute-finance ./cmd/server
```

---

## 🎯 Penjelasan Error

### Kenapa Error Terjadi?

1. **Invalid Version**: Versi dependency di `go.mod` tidak valid atau tidak ditemukan di repository
2. **Malformed go.sum**: File `go.sum` korup atau tidak lengkap
3. **Module Not Found**: Dependencies belum di-download atau cache korup

### Solusi Otomatis

Installer (`install.sh`) dan setup script (`setup.sh`) sekarang memiliki:
- Auto-detect error
- Auto-clean cache
- Auto-retry download
- Error handling yang lebih baik

---

## 🚀 Quick Fix Commands

```bash
# Quick fix (paling cepat)
./setup.sh

# Atau
rm -f go.sum && go mod tidy

# Full reset (jika masih error)
go clean -modcache && rm -f go.sum && go mod download && go mod tidy
```

---

## 📚 Dokumentasi Lengkap

- **Setup Guide**: `INSTALL.md`
- **Troubleshooting**: `docs/TROUBLESHOOTING.md`
- **Quick Start**: `QUICKSTART.md`

---

**Status: Fixed** ✅
