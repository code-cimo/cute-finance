# 🔧 Troubleshooting Guide

## Error: malformed go.sum

### Symptoms
```
malformed go.sum:
/home/user/cutefinance/go.sum:1: wrong number of fields 5
make: *** [Makefile:15: build] Error 1
```

### Cause
File `go.sum` tidak valid atau korup. Ini bisa terjadi karena:
- File `go.sum` dibuat manual dengan konten yang salah
- File `go.sum` dari git repository tidak lengkap
- Dependencies berubah tapi `go.sum` tidak di-update

### Solution

**Option 1: Gunakan setup script (Recommended)**
```bash
chmod +x setup.sh
./setup.sh
```

**Option 2: Manual fix**
```bash
# 1. Hapus go.sum yang lama
rm -f go.sum

# 2. Clean module cache (optional, jika masih error)
go clean -modcache

# 3. Download dependencies
go mod download

# 4. Generate go.sum yang benar
go mod tidy

# 5. Build
go build -o cute-finance ./cmd/server
```

**Option 3: Gunakan Makefile**
```bash
# Clean dan reinstall dependencies
make deps-clean

# Build
make build
```

### Prevention
- Jangan commit `go.sum` yang kosong atau invalid ke git
- Selalu jalankan `go mod tidy` setelah mengubah `go.mod`
- Gunakan `make deps` sebelum build

---

## Error: module not found

### Symptoms
```
go: github.com/go-chi/chi/v5@v5.0.12: module lookup disabled by GOPROXY=off
```

### Solution
```bash
# Enable Go proxy
export GOPROXY=https://proxy.golang.org,direct

# Atau set permanent
go env -w GOPROXY=https://proxy.golang.org,direct

# Download dependencies
go mod download
```

---

## Error: cannot find module

### Symptoms
```
cmd/server/main.go:10:2: no required module provides package github.com/go-chi/chi/v5
```

### Solution
```bash
# Download all dependencies
go mod download

# Verify go.mod
cat go.mod

# Tidy modules
go mod tidy
```

---

## Error: build constraints exclude all Go files

### Symptoms
```
build constraints exclude all Go files in /path/to/package
```

### Cause
Cross-compiling dengan CGO enabled tapi tidak ada C compiler untuk target platform.

### Solution
```bash
# Disable CGO untuk cross-compile
CGO_ENABLED=0 GOOS=linux GOARCH=arm64 go build -o cute-finance ./cmd/server

# Atau gunakan Makefile
make build-arm64
```

---

## Error: permission denied

### Symptoms
```
bash: ./cute-finance: Permission denied
```

### Solution
```bash
chmod +x cute-finance
./cute-finance
```

---

## Error: port already in use

### Symptoms
```
listen tcp :8080: bind: address already in use
```

### Solution
```bash
# Option 1: Gunakan port lain via flag
./cute-finance -port 9090

# Option 2: Edit config file
nano data/config.json
# Ubah "port": 8080 menjadi "port": 9090

# Option 3: Re-run installer dengan port baru
./cute-finance -install
# Masukkan port baru saat ditanya

# Option 4: Kill process yang menggunakan port
sudo lsof -i :8080
sudo kill -9 <PID>
```

---

## Port Configuration

### How to Set Custom Port

**Method 1: Via Installer (Recommended)**
```bash
# Run installer
./cute-finance -install

# Enter port when prompted
# Port will be saved to data/config.json
```

**Method 2: Via Command Line Flag**
```bash
# Override port at runtime
./cute-finance -port 9090
```

**Method 3: Edit Config File**
```bash
# Edit config
nano data/config.json

# Change port
{
  "port": 9090,
  "data_dir": "./data"
}
```

### Port Priority Order
1. Command line flag (`-port`) - highest priority
2. Config file (`data/config.json`)
3. Default (8080) - lowest priority

### Verify Current Port
```bash
# Check config file
cat data/config.json

# Check running process
ps aux | grep cute-finance
```

---

## Error: database locked

### Symptoms
```
database is locked
```

### Solution
```bash
# 1. Kill semua proses cute-finance
pkill cute-finance

# 2. Hapus lock files
rm -f data/cutefinance.db-wal
rm -f data/cutefinance.db-shm

# 3. Restart
./cute-finance
```

---

## Error: frontend not found

### Symptoms
```
Warning: Frontend not embedded, serving from disk
```

### Cause
Folder `dist/` tidak ada atau tidak di-embed ke binary.

### Solution
```bash
# Option 1: Build frontend
cd frontend
npm install
npm run build
cd ..
cp -r frontend/dist ./dist

# Option 2: Serve dari disk (development)
# Binary akan otomatis serve dari folder ./dist jika ada
```

---

## Cross-Compile Issues

### ARM64 build di x86_64 machine

```bash
# Pastikan CGO disabled
CGO_ENABLED=0 GOOS=linux GOARCH=arm64 go build -o cute-finance-arm64 ./cmd/server

# Verify binary
file cute-finance-arm64
# Output: ELF 64-bit LSB executable, ARM aarch64
```

### Binary tidak bisa dijalankan di Odroid

```bash
# Check architecture
file cute-finance

# Harus: ELF 64-bit LSB executable, ARM aarch64
# Jika x86_64, re-build dengan GOARCH=arm64
```

---

## Docker Build Issues

### Error: go.sum not found

```bash
# Dockerfile akan auto-generate go.sum
# Pastikan go.mod ada dan valid
```

### Error: frontend not embedded

```bash
# Build frontend dulu
cd frontend && npm install && npm run build && cd ..
cp -r frontend/dist ./dist

# Lalu build Docker
docker build -t cutefinance .
```

---

## Performance Issues

### Slow startup

```bash
# Check database size
ls -lh data/cutefinance.db

# Vacuum database
sqlite3 data/cutefinance.db "VACUUM;"
```

### High memory usage

```bash
# Check memory
ps aux | grep cute-finance

# Restart service
sudo systemctl restart cutefinance
```

---

## Getting Help

Jika masih ada masalah:

1. Check logs: `journalctl -u cutefinance -f`
2. Check Go version: `go version` (harus 1.22+)
3. Check dependencies: `go mod verify`
4. Open issue: https://github.com/yourusername/cutefinance-pwa/issues

---

## Quick Fix Commands

```bash
# Full reset
rm -f go.sum cute-finance cute-finance-arm64 cute-finance-amd64
go clean -modcache
go mod download
go mod tidy
make build

# Verify
./cute-finance -version
```
