# 🖥️ Deployment Guide - Odroid C2 (ARM64)

Panduan deployment CuteFinance PWA (Go Edition) di Odroid C2.

## 📋 Spesifikasi Hardware

**Odroid C2:**
- CPU: Amlogic S905 1.5GHz Quad-Core ARM Cortex-A53 (ARM64)
- RAM: 2GB DDR3
- Storage: eMMC/SD Card
- OS: Ubuntu 20.04/22.04 ARM64 atau Armbian

## 🔧 Persiapan

### 1. Flash OS

```bash
# Download Ubuntu 22.04 ARM64 untuk Odroid C2
# https://wiki.odroid.com/odroid-c2/os_images/ubuntu

# Flash ke eMMC/SD Card
sudo dd if=ubuntu-22.04-minimal-odroid-c2.img of=/dev/sdX bs=4M status=progress
```

### 2. Initial Setup

```bash
# SSH ke Odroid
ssh odroid@<ip-address>

# Update system
sudo apt update && sudo apt upgrade -y

# Install basic tools
sudo apt install -y curl git wget vim htop

# Set timezone
sudo timedatectl set-timezone Asia/Jakarta
```

## 🚀 Deployment Methods

### Method 1: Cross-Compile (Recommended)

Build di development machine, deploy ke Odroid.

**Di Development Machine:**
```bash
# Clone repository
git clone https://github.com/yourusername/cutefinance-pwa.git
cd cutefinance-pwa

# Cross-compile untuk ARM64
GOOS=linux GOARCH=arm64 CGO_ENABLED=0 go build \
  -ldflags="-w -s" \
  -o cute-finance ./cmd/server

# Copy ke Odroid
scp cute-finance odroid@<ip>:~/
```

**Di Odroid C2:**
```bash
# SSH ke Odroid
ssh odroid@<ip>

# Berikan permission
chmod +x ~/cute-finance

# Jalankan installer
./cute-finance -install

# Atau jalankan langsung
./cute-finance -port 8080
```

### Method 2: Build di Odroid

**Di Odroid C2:**
```bash
# Install Go
sudo apt install -y golang-go

# Atau install Go 1.22+ manual
wget https://go.dev/dl/go1.22.0.linux-arm64.tar.gz
sudo tar -C /usr/local -xzf go1.22.0.linux-arm64.tar.gz
export PATH=$PATH:/usr/local/go/bin

# Clone repository
git clone https://github.com/yourusername/cutefinance-pwa.git
cd cutefinance-pwa

# Download dependencies
go mod download

# Build
go build -ldflags="-w -s" -o cute-finance ./cmd/server

# Jalankan
./cute-finance
```

### Method 3: Docker

**Di Odroid C2:**
```bash
# Install Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
newgrp docker

# Clone repository
git clone https://github.com/yourusername/cutefinance-pwa.git
cd cutefinance-pwa

# Build image (akan lama di ARM64)
docker build -t cutefinance .

# Run container
docker run -d \
  --name cutefinance \
  -p 8080:8080 \
  -v /home/odroid/cutefinance-data:/app/data \
  --restart unless-stopped \
  cutefinance
```

## 🔐 Tailscale Setup

```bash
# Install Tailscale
curl -fsSL https://tailscale.com/install.sh | sh

# Start Tailscale
sudo tailscale up

# Login di browser

# Cek IP
tailscale ip

# Access: http://<tailscale-ip>:8080
```

## 🔧 Systemd Service

### Auto-generate
```bash
./cute-finance -install
# Pilih "y" untuk membuat systemd service
```

### Manual
```bash
sudo tee /etc/systemd/system/cutefinance.service > /dev/null <<EOF
[Unit]
Description=CuteFinance PWA
After=network.target

[Service]
Type=simple
User=odroid
WorkingDirectory=/home/odroid
ExecStart=/home/odroid/cute-finance -port 8080
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable cutefinance
sudo systemctl start cutefinance
```

## 📊 Optimasi Performance

### Memory Optimization
```bash
# Enable swap
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# Check memory
free -h
```

### Temperature Monitoring
```bash
# Install monitoring
sudo apt install -y odroid-c2-utilities

# Check temperature
cat /sys/class/thermal/thermal_zone0/temp

# Throttle CPU jika panas
echo "powersave" | sudo tee /sys/devices/system/cpu/cpu0/cpufreq/scaling_governor
```

## 🔄 Backup & Restore

### Backup
```bash
# Database backup
cp ~/data/cutefinance.db ~/data/backup-$(date +%Y%m%d).db

# Full backup
tar -czf cutefinance-backup-$(date +%Y%m%d).tar.gz \
  ~/cute-finance \
  ~/data/
```

### Restore
```bash
# Extract backup
tar -xzf cutefinance-backup-YYYYMMDD.tar.gz -C ~/

# Restart service
sudo systemctl restart cutefinance
```

## 🐛 Troubleshooting

### Binary tidak bisa dijalankan
```bash
# Check architecture
file cute-finance

# Harus: ELF 64-bit LSB executable, ARM aarch64
# Jika bukan, re-cross-compile
```

### Port tidak accessible
```bash
# Check firewall
sudo ufw status
sudo ufw allow 8080/tcp

# Check if running
sudo netstat -tulpn | grep 8080
```

### Database locked
```bash
# Kill process
pkill cute-finance

# Remove lock files
rm -f ~/data/cutefinance.db-wal
rm -f ~/data/cutefinance.db-shm

# Restart
./cute-finance
```

### Odroid kepanasan
```bash
# Monitor temperature
watch -n 1 cat /sys/class/thermal/thermal_zone0/temp

# Install fan
sudo apt install -y odroid-c2-utilities

# Reduce CPU frequency
echo 1512000 | sudo tee /sys/devices/system/cpu/cpu0/cpufreq/scaling_max_freq
```

## 📈 Performance Benchmarks

**Odroid C2 Performance:**
- Binary size: ~10-15MB (stripped)
- Memory usage: ~20-50MB
- Startup time: <1 second
- Request latency: <10ms
- CPU usage: <5% idle

## 🔗 Useful Links

- [Odroid C2 Wiki](https://wiki.odroid.com/odroid-c2/odroid-c2)
- [Go ARM64 Documentation](https://go.dev/doc/install)
- [Tailscale Documentation](https://tailscale.com/kb/)
- [SQLite Performance](https://www.sqlite.org/pragma.html)

## 💡 Tips

1. **Gunakan eMMC** - Lebih cepat dan reliable dari SD Card
2. **Enable swap** - Mencegah OOM saat build
3. **Monitor temperature** - Odroid C2 bisa panas
4. **Backup rutin** - Export data via Settings
5. **Update berkala** - `sudo apt update && sudo apt upgrade`
6. **Gunakan Tailscale** - Secure remote access tanpa port forwarding

---

**Happy deploying! 🐾**
