# 🐾 CuteFinance PWA - Panduan Instalasi (Go Edition)

## 📋 Prasyarat

### Wajib
- **Go 1.22+** - [Download](https://go.dev/dl/)
- **Git**

### Opsional
- **Node.js 18+** - Untuk build frontend
- **Docker** - Untuk containerized deployment
- **Tailscale** - Untuk secure remote access

## 🚀 Instalasi Cepat

### ⚠️ Fix Error go.sum (Jika Ada)

Jika muncul error `malformed go.sum`, jalankan:

```bash
# Hapus go.sum lama
rm -f go.sum

# Download dan generate ulang
go mod download
go mod tidy

# Atau gunakan setup script
chmod +x setup.sh
./setup.sh
```

### Metode 1: Installer Otomatis (Recommended)

```bash
# Clone repository
git clone https://github.com/yourusername/cutefinance-pwa.git
cd cutefinance-pwa

# Jalankan installer
chmod +x install.sh
./install.sh
```

Installer akan:
1. ✅ Cek Go installation
2. ✅ **Tanya port custom** (default: 8080)
3. ✅ Tanya data directory (default: ./data)
4. ✅ Setup dependencies
5. ✅ Build aplikasi
6. ✅ Jalankan TUI installer (preview mascot, systemd service)
7. ✅ Save konfigurasi ke `data/config.json`

Setelah install, jalankan server:
```bash
./cute-finance
# Server akan jalan di port yang sudah di-set di installer
```

### Metode 2: Manual Build

```bash
# 1. Clone
git clone https://github.com/yourusername/cutefinance-pwa.git
cd cutefinance-pwa

# 2. Download Go dependencies
go mod download

# 3. Build frontend (jika Node.js tersedia)
cd frontend && npm install && npm run build && cd ..
cp -r frontend/dist ./dist

# 4. Build Go binary
go build -ldflags="-w -s" -o cute-finance ./cmd/server

# 5. Jalankan
./cute-finance
```

### Metode 3: Docker

```bash
# Build image
docker build -t cutefinance .

# Run container
docker run -d \
  --name cutefinance \
  -p 8080:8080 \
  -v $(pwd)/data:/app/data \
  --restart unless-stopped \
  cutefinance

# Access: http://localhost:8080
```

### Metode 4: Menggunakan Make

```bash
# Install dependencies
make deps

# Build
make build

# Run
make run

# Atau custom port
make run PORT=9090
```

## 🖥️ Cross-Compile Multi-Architecture

### Build untuk ARM64 (Odroid C2)

**Di Development Machine (x86_64 atau ARM64):**

```bash
# Gunakan Makefile
make build-arm64

# Atau manual
GOOS=linux GOARCH=arm64 CGO_ENABLED=0 go build \
  -ldflags="-w -s" \
  -o cute-finance-arm64 ./cmd/server

# Copy ke Odroid C2
scp cute-finance-arm64 odroid@<ip-address>:~/cute-finance
```

### Build untuk x86_64 (Server/PC)

```bash
# Gunakan Makefile
make build-amd64

# Atau manual
GOOS=linux GOARCH=amd64 CGO_ENABLED=0 go build \
  -ldflags="-w -s" \
  -o cute-finance-amd64 ./cmd/server
```

### Build untuk Semua Platform

```bash
# Build untuk x86_64, ARM64, dan native
make build-all

# Output:
# - cute-finance (native)
# - cute-finance-arm64 (ARM64)
# - cute-finance-amd64 (x86_64)
```

### Build untuk macOS

```bash
# macOS ARM64 (Apple Silicon)
GOOS=darwin GOARCH=arm64 go build -o cute-finance-darwin-arm64 ./cmd/server

# macOS x86_64 (Intel)
GOOS=darwin GOARCH=amd64 go build -o cute-finance-darwin-amd64 ./cmd/server
```

### Build untuk Windows

```bash
# Windows x86_64
GOOS=windows GOARCH=amd64 go build -o cute-finance.exe ./cmd/server
```

### Deploy ke Odroid C2

```bash
# 1. Build di development machine
make build-arm64

# 2. Copy ke Odroid
scp cute-finance-arm64 odroid@<ip-address>:~/cute-finance

# 3. SSH ke Odroid
ssh odroid@<ip-address>

# 4. Berikan permission
chmod +x ~/cute-finance

# 5. Jalankan installer
./cute-finance -install

# Atau jalankan langsung
./cute-finance -port 8080
```

## 🔧 Konfigurasi

### Cara Set Port

**Option 1: Via Installer (Recommended)**
```bash
# Jalankan installer
./cute-finance -install

# Masukkan port yang diinginkan saat ditanya
# Port akan tersimpan di config.json
```

**Option 2: Via Command Line Flag**
```bash
# Override port saat run server
./cute-finance -port 9090
```

**Option 3: Edit Config Manual**
```bash
# Edit file config
nano data/config.json

# Ubah port
{
  "port": 9090,
  "data_dir": "./data"
}
```

### Command Line Flags

```bash
./cute-finance [flags]

Flags:
  -port int     Server port (override config)
  -data string  Data directory (default: "./data")
  -install      Run interactive installer
  -version      Show version
```

### Config File

Config disimpan di `{data_dir}/config.json`:

```json
{
  "port": 8080,
  "data_dir": "./data"
}
```

**Urutan Prioritas Port:**
1. Command line flag (`-port`) - highest priority
2. Config file (`config.json`)
3. Default (8080) - lowest priority

## 🐳 Docker Deployment

### Build Image

```bash
docker build -t cutefinance:latest .
```

### Run Container

```bash
docker run -d \
  --name cutefinance \
  -p 8080:8080 \
  -v $(pwd)/data:/app/data \
  -e TZ=Asia/Jakarta \
  --restart unless-stopped \
  cutefinance:latest
```

### Docker Compose

```yaml
version: '3.8'
services:
  cutefinance:
    build: .
    ports:
      - "8080:8080"
    volumes:
      - ./data:/app/data
    restart: unless-stopped
```

```bash
docker-compose up -d
```

## 🔐 Systemd Service

### Auto-generate via Installer

```bash
./cute-finance -install
# Pilih "y" saat ditanya membuat systemd service
```

### Manual Setup

```bash
# Create service file
sudo tee /etc/systemd/system/cutefinance.service > /dev/null <<EOF
[Unit]
Description=CuteFinance PWA
After=network.target

[Service]
Type=simple
User=$(whoami)
WorkingDirectory=$(pwd)
ExecStart=$(pwd)/cute-finance -port 8080
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# Enable and start
sudo systemctl daemon-reload
sudo systemctl enable cutefinance
sudo systemctl start cutefinance

# Check status
sudo systemctl status cutefinance
```

## 🔒 Tailscale Setup

```bash
# Install Tailscale
curl -fsSL https://tailscale.com/install.sh | sh

# Start
sudo tailscale up

# Get IP
tailscale ip

# Access via: http://<tailscale-ip>:8080
```

## 📊 Database

### Location
Default: `./data/cutefinance.db`

### Backup
```bash
# Manual backup
cp data/cutefinance.db data/cutefinance-backup-$(date +%Y%m%d).db

# Via API
curl http://localhost:8080/api/export > backup.json
```

### Restore
```bash
# Via API
curl -X POST -H "Content-Type: application/json" \
  --data @backup.json \
  http://localhost:8080/api/import
```

## 🐛 Troubleshooting

### Port already in use
```bash
# Check what's using port 8080
sudo lsof -i :8080

# Use different port
./cute-finance -port 9090
```

### Permission denied
```bash
chmod +x cute-finance
```

### Database locked
```bash
# Kill existing process
pkill cute-finance

# Remove lock file
rm -f data/cutefinance.db-wal
rm -f data/cutefinance.db-shm
```

### Build error
```bash
# Clean and rebuild
go clean -modcache
go mod download
go build -o cute-finance ./cmd/server
```

### ARM64 build error
```bash
# Pastikan menggunakan Pure Go SQLite (no CGO)
CGO_ENABLED=0 GOOS=linux GOARCH=arm64 go build -o cute-finance ./cmd/server
```

## 📞 Support

- **Documentation**: [README.md](README.md)
- **Deployment Guide**: [docs/DEPLOYMENT-ODROID.md](docs/DEPLOYMENT-ODROID.md)
- **Issues**: GitHub Issues

---

**Selamat menggunakan CuteFinance! 🐾**
