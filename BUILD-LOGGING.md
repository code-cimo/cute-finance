# 🔍 Build Logging System

## 📋 Overview

Build script sekarang memiliki **logging system** yang lengkap untuk memudahkan diagnosis error saat build gagal.

## ✨ Fitur Logging

### 1. Error Log Files
Setiap build yang gagal akan menghasilkan **log file** terpisah dengan timestamp:
- `build-current-YYYYMMDD-HHMMSS.log`
- `build-linux-arm64-YYYYMMDD-HHMMSS.log`
- `build-linux-amd64-YYYYMMDD-HHMMSS.log`
- `build-windows-amd64-YYYYMMDD-HHMMSS.log`
- `build-macos-arm64-YYYYMMDD-HHMMSS.log`
- `build-macos-amd64-YYYYMMDD-HHMMSS.log`

### 2. Console Output
Saat build gagal, script akan menampilkan:
- ✅ Status build (success/failed)
- 📝 Lokasi log file
- 📋 20 baris terakhir dari error log
- 📊 Summary build yang gagal

### 3. Build Summary
Di akhir build, script menampilkan:
- Total builds
- Successful builds
- Failed builds
- Daftar platform yang gagal dengan lokasi log file

## 🚀 Cara Menggunakan

### Normal Build
```bash
./build-all-platforms.sh
```

### Saat Build Gagal
Script akan otomatis:
1. Menyimpan error ke log file
2. Menampilkan 20 baris terakhir error di console
3. Menambahkan platform yang gagal ke summary

### Melihat Log File
```bash
# Lihat semua log files
ls -la build-*.log

# Lihat log file tertentu
cat build-linux-arm64-20241028-123456.log

# Lihat 50 baris terakhir
tail -50 build-linux-arm64-20241028-123456.log

# Cari error spesifik
grep "error" build-*.log
```

## 📊 Contoh Output

### Build Berhasil
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ✅ Build Complete!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Build Summary:
  Total builds: 3
  Successful:   3
  Failed:       0
```

### Build Gagal
```
[1] Building for Linux ARM64...
❌ Failed to build Linux ARM64
📝 Error log saved to: build-linux-arm64-20241028-123456.log
📋 Last 20 lines of error:
# github.com/cutefinance/pwa/internal/handlers
internal/handlers/handlers.go:368:20: undefined: models.ExportData

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ⚠️  Build Complete with Errors
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Build Summary:
  Total builds: 3
  Successful:   2
  Failed:       1

❌ Failed Builds:
  • Linux ARM64 - See: build-linux-arm64-20241028-123456.log

💡 Check the log files for detailed error messages
```

## 🔧 Troubleshooting dengan Log

### Error: undefined type
```
undefined: models.ExportData
```
**Solusi:** Tambahkan definisi type di `internal/models/models.go`

### Error: missing go.sum entry
```
missing go.sum entry for module providing package
```
**Solusi:** Jalankan `./fix-dependencies.sh`

### Error: import cycle
```
import cycle not allowed
```
**Solusi:** Periksa struktur package dan hapus circular dependency

### Error: cannot find package
```
cannot find package "github.com/..."
```
**Solusi:** Jalankan `go mod download` atau `./fix-dependencies.sh`

## 📝 Tips Debugging

### 1. Lihat Full Error Log
```bash
cat build-linux-arm64-*.log | less
```

### 2. Cari Error Spesifik
```bash
grep -n "error" build-*.log
```

### 3. Lihat Context Error
```bash
# Lihat 10 baris sebelum dan sesudah error
grep -B 10 -A 10 "undefined" build-*.log
```

### 4. Bandingkan Log
```bash
# Bandingkan dua log file
diff build-linux-arm64-*.log build-linux-amd64-*.log
```

### 5. Clean Build
```bash
# Hapus semua log files
rm -f build-*.log

# Clean build cache
go clean -cache

# Rebuild
./build-all-platforms.sh
```

## 📊 Log File Structure

Log file berisi:
- Timestamp build
- Platform target
- Go compiler output
- Error messages
- Stack traces (jika ada)
- Warning messages

## 🎯 Best Practices

1. **Selalu cek log file** saat build gagal
2. **Simpan log file** untuk referensi di masa depan
3. **Cari pattern error** yang sama di log files
4. **Gunakan grep** untuk mencari error spesifik
5. **Bandingkan log** dari platform berbeda untuk identifikasi issue spesifik platform

## 📞 Support

Jika masih ada masalah setelah melihat log:
1. Check log file lengkap
2. Lihat dokumentasi: `FIX-TYPES.md`, `FIX-GO-SUM.md`
3. Buat issue di GitHub dengan melampirkan log file

---

**Status: Active** ✅

Logging system aktif untuk semua platform build
