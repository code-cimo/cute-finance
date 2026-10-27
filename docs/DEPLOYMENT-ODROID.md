# 🚀 Deployment Guide - Odroid C2 (ARM64)

Panduan lengkap deployment CuteFinance PWA di Odroid C2.

## 📋 Spesifikasi Hardware

**Odroid C2:**
- CPU: Amlogic S905 1.5GHz Quad-Core ARM Cortex-A53 (ARM64)
- RAM: 2GB DDR3
- Storage: eMMC/SD Card
- OS: Ubuntu 18.04/20.04 ARM64 atau Armbian

## 🔧 Persiapan Odroid C2

### 1. Flash OS ke eMMC/SD Card

```bash
# Download Ubuntu 20.04 ARM64 untuk Odroid C2
# https://wiki.odroid.com/odroid-c2/os_images/ubuntu

# Flash menggunakan Etcher atau dd
sudo dd if=ubuntu-20.04-4.9-mate-odroid-c2.img of=/dev/sdX bs=4M status=progress
```

### 2. Initial Setup

```bash
# SSH ke Odroid
ssh odroid@<ip-address>
# Default password: odroid

# Update system
sudo apt update && sudo apt upgrade -y

# Install basic tools
sudo apt install -y curl git wget vim htop

# Set timezone
sudo timedatectl set-timezone Asia/Jakarta

# Set hostname (optional)
sudo hostnamectl set-hostname cutefinance
```

### 3. Configure Network

```bash
# Static IP (optional)
sudo nano /etc/netplan/01-netcfg.yaml
```

```yaml
network:
  version: 2
  renderer: networkd
  ethernets:
    eth0:
      dhcp4: no
      addresses:
        - 192.168.1.100/24
      gateway4: 192.168.1.1
      nameservers:
        addresses: [8.8.8.8, 8.8.4.4]
```

```bash
sudo netplan apply
```

## 📦 Installation Methods

### Method 1: Automated Installer (Recommended)

```bash
# Clone repository
git clone https://github.com/yourusername/cutefinance-pwa.git
cd cutefinance-pwa

# Run installer
chmod +x install.sh
./install.sh

# Ikuti prompt installer
```

### Method 2: Docker Deployment (Paling Mudah)

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker

# Clone repository
git clone https://github.com/yourusername/cutefinance-pwa.git
cd cutefinance-pwa

# Build and run
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

### Method 3: Manual Deployment

```bash
# 1. Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 2. Install Nginx
sudo apt install -y nginx

# 3. Clone dan build
git clone https://github.com/yourusername/cutefinance-pwa.git
cd cutefinance-pwa
npm install
npm run build

# 4. Copy ke web root
sudo mkdir -p /var/www/cutefinance
sudo cp -r dist/* /var/www/cutefinance/

# 5. Setup Nginx
sudo nano /etc/nginx/sites-available/cutefinance
```

Paste konfigurasi dari `install.sh` atau gunakan template di `docker/nginx.conf`

```bash
# 6. Enable site
sudo ln -s /etc/nginx/sites-available/cutefinance /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# 7. Setup firewall
sudo ufw allow 8080/tcp
sudo ufw enable
```

## 🔐 Tailscale Setup (Secure Remote Access)

```bash
# Install Tailscale
curl -fsSL https://tailscale.com/install.sh | sh

# Start Tailscale
sudo tailscale up

# Login di browser
# Buka URL yang ditampilkan

# Cek IP Tailscale
tailscale ip

# Akses aplikasi via Tailscale
# http://<tailscale-ip>:8080
```

### Tailscale Funnel (Public Access)

```bash
# Enable Tailscale Funnel (HTTPS public access)
sudo tailscale funnel 8080

# Akses via: https://cutefinance.tail1234.ts.net
```

## 🔒 SSL/HTTPS Setup

### Option 1: Let's Encrypt (Public Domain)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d cutefinance.yourdomain.com

# Auto-renewal
sudo certbot renew --dry-run
```

### Option 2: Tailscale HTTPS

```bash
# Tailscale menyediakan HTTPS otomatis
sudo tailscale cert cutefinance.ts.net

# Certificate akan disimpan di:
# /var/lib/tailscale/certs/cutefinance.ts.net.crt
# /var/lib/tailscale/certs/cutefinance.ts.net.key
```

### Option 3: Self-Signed Certificate (Local Network)

```bash
# Generate self-signed cert
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/ssl/private/cutefinance.key \
  -out /etc/ssl/certs/cutefinance.crt \
  -subj "/CN=cutefinance.local"

# Update Nginx config
sudo nano /etc/nginx/sites-available/cutefinance
```

```nginx
server {
    listen 443 ssl;
    server_name cutefinance.local;
    
    ssl_certificate /etc/ssl/certs/cutefinance.crt;
    ssl_certificate_key /etc/ssl/private/cutefinance.key;
    
    # ... rest of config
}

server {
    listen 80;
    server_name cutefinance.local;
    return 301 https://$server_name$request_uri;
}
```

## 🔧 Optimization untuk Odroid C2

### 1. Memory Optimization

```bash
# Check memory usage
free -h

# Enable swap (jika RAM terbatas)
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Add to fstab for persistence
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### 2. Nginx Optimization

```bash
sudo nano /etc/nginx/nginx.conf
```

```nginx
worker_processes 2;  # Odroid C2 has 4 cores
worker_connections 1024;
multi_accept on;

# Gzip compression
gzip on;
gzip_comp_level 5;
gzip_min_length 256;
gzip_proxied any;
gzip_vary on;
gzip_types
    text/plain
    text/css
    text/xml
    text/javascript
    application/json
    application/javascript
    application/xml
    application/rss+xml
    image/svg+xml;

# Cache
open_file_cache max=10000 inactive=30s;
open_file_cache_valid 60s;
open_file_cache_min_uses 2;
open_file_cache_errors on;
```

### 3. Systemd Service Optimization

```bash
sudo systemctl edit cutefinance
```

```ini
[Service]
# Memory limit
MemoryMax=512M
MemoryHigh=384M

# CPU limit
CPUQuota=50%

# Restart policy
Restart=always
RestartSec=5
```

## 📊 Monitoring

### 1. Basic Monitoring

```bash
# System resources
htop

# Nginx status
sudo systemctl status nginx

# Service logs
sudo journalctl -u cutefinance -f
```

### 2. Advanced Monitoring (Optional)

```bash
# Install Netdata (lightweight monitoring)
bash <(curl -Ss https://my-netdata.io/kickstart.sh)

# Access at: http://<odroid-ip>:19999
```

## 🔄 Backup & Restore

### Backup Data

```bash
# Backup localStorage data (manual export dari browser)
# Settings > Export Data

# Backup configuration
sudo tar -czf cutefinance-backup-$(date +%Y%m%d).tar.gz \
  /var/www/cutefinance \
  /etc/nginx/sites-available/cutefinance \
  /etc/systemd/system/cutefinance.service
```

### Restore Data

```bash
# Extract backup
sudo tar -xzf cutefinance-backup-YYYYMMDD.tar.gz -C /

# Restart services
sudo systemctl restart nginx
sudo systemctl restart cutefinance
```

## 🐛 Troubleshooting

### Issue: Odroid C2 kepanasan

```bash
# Install heatsink fan
sudo apt install -y odroid-c2-utilities

# Monitor temperature
cat /sys/class/thermal/thermal_zone0/temp

# Throttle CPU jika perlu
echo "performance" | sudo tee /sys/devices/system/cpu/cpu0/cpufreq/scaling_governor
```

### Issue: Nginx 502 Bad Gateway

```bash
# Check if service is running
sudo systemctl status cutefinance

# Check logs
sudo journalctl -u cutefinance -n 50

# Restart service
sudo systemctl restart cutefinance
```

### Issue: PWA tidak bisa di-install

```bash
# Pastikan HTTPS atau localhost
# Check manifest
curl http://localhost:8080/manifest.json

# Check service worker
curl http://localhost:8080/sw.js
```

### Issue: Performance lambat

```bash
# Enable Nginx caching
# Lihat optimization section di atas

# Check disk I/O
iostat -x 1 5

# Check memory
free -h
```

## 📈 Performance Benchmarks

**Odroid C2 Performance:**
- Build time: ~2-3 menit
- Memory usage: ~100-150MB (Nginx)
- CPU usage: <5% idle, <20% load
- Response time: <50ms

## 🔗 Useful Links

- [Odroid C2 Wiki](https://wiki.odroid.com/odroid-c2/odroid-c2)
- [Tailscale Documentation](https://tailscale.com/kb/)
- [Nginx ARM64 Guide](https://nginx.org/en/docs/install.html)
- [PWA Best Practices](https://web.dev/progressive-web-apps/)

## 💡 Tips

1. **Gunakan eMMC** daripada SD Card untuk performa lebih baik
2. **Enable swap** jika RAM 2GB terasa kurang
3. **Monitor temperature** - Odroid C2 bisa panas
4. **Backup rutin** - Export data dari Settings
5. **Update berkala** - `sudo apt update && sudo apt upgrade`

---

**Happy deploying! 🐾**
