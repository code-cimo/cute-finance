# 🐾 CuteFinance PWA - Panduan Instalasi Lengkap

## 📋 Daftar Isi

1. [Instalasi Cepat (Frontend Only)](#instalasi-cepat)
2. [Instalasi dengan Docker](#instalasi-docker)
3. [Instalasi Manual](#instalasi-manual)
4. [Deployment di Odroid C2](#deployment-odroid-c2)
5. [Konfigurasi Lanjutan](#konfigurasi-lanjutan)
6. [Troubleshooting](#troubleshooting)

---

## 🚀 Instalasi Cepat

### Prasyarat

- **Node.js** 18+ dan npm
- **Git**
- **Modern Browser** (Chrome, Firefox, Safari, Edge)

### Langkah 1: Clone Repository

```bash
git clone https://github.com/yourusername/cutefinance-pwa.git
cd cutefinance-pwa
```

### Langkah 2: Install Dependencies

```bash
npm install
```

### Langkah 3: Jalankan Development Server

```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:5173`

### Langkah 4: Build untuk Production

```bash
npm run build
```

File output ada di folder `dist/`

---

## 🐳 Instalasi Docker

### Metode 1: Docker Compose (Recommended)

```bash
# Clone repository
git clone https://github.com/yourusername/cutefinance-pwa.git
cd cutefinance-pwa

# Build dan jalankan
docker-compose up -d

# Cek status
docker-compose ps

# Lihat logs
docker-compose logs -f
```

Akses di `http://localhost:8080`

### Metode 2: Docker Manual

```bash
# Build image
docker build -t cutefinance-pwa .

# Jalankan container
docker run -d \
  --name cutefinance \
  -p 8080:80 \
  --restart unless-stopped \
  cutefinance-pwa

# Cek logs
docker logs -f cutefinance
```

### Stop/Start Container

```bash
# Stop
docker-compose down

# Start
docker-compose up -d

# Restart
docker-compose restart
```

---

## 🔧 Instalasi Manual

### 1. Install Node.js

**Ubuntu/Debian:**
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**CentOS/RHEL:**
```bash
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo yum install -y nodejs
```

**macOS:**
```bash
brew install node@20
```

### 2. Install Nginx

**Ubuntu/Debian:**
```bash
sudo apt install -y nginx
```

**CentOS/RHEL:**
```bash
sudo yum install -y nginx
```

**macOS:**
```bash
brew install nginx
```

### 3. Build Aplikasi

```bash
git clone https://github.com/yourusername/cutefinance-pwa.git
cd cutefinance-pwa
npm install
npm run build
```

### 4. Deploy ke Nginx

```bash
# Create directory
sudo mkdir -p /var/www/cutefinance

# Copy files
sudo cp -r dist/* /var/www/cutefinance/

# Set permissions
sudo chown -R www-data:www-data /var/www/cutefinance
sudo chmod -R 755 /var/www/cutefinance
```

### 5. Konfigurasi Nginx

```bash
sudo nano /etc/nginx/sites-available/cutefinance
```

Paste konfigurasi berikut:

```nginx
server {
    listen 8080;
    server_name _;
    root /var/www/cutefinance;
    index index.html;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Enable gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml image/svg+xml;
}
```

### 6. Enable Site

```bash
# Create symlink
sudo ln -s /etc/nginx/sites-available/cutefinance /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

### 7. Setup Firewall

```bash
# UFW (Ubuntu)
sudo ufw allow 8080/tcp
sudo ufw enable

# Firewalld (CentOS/RHEL)
sudo firewall-cmd --permanent --add-port=8080/tcp
sudo firewall-cmd --reload
```

### 8. Akses Aplikasi

Buka browser dan akses: `http://localhost:8080` atau `http://<your-ip>:8080`

---

## 🖥️ Deployment Odroid C2

### Persiapan Hardware

1. **Flash OS** ke eMMC/SD Card
   - Download Ubuntu 20.04 ARM64 dari [Odroid Wiki](https://wiki.odroid.com/odroid-c2/os_images/ubuntu)
   - Flash menggunakan Etcher atau `dd`

2. **Initial Setup**
   ```bash
   # SSH ke Odroid
   ssh odroid@<ip-address>
   
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install basic tools
   sudo apt install -y curl git wget vim htop
   ```

### Instalasi dengan Docker

```bash
# Install Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
newgrp docker

# Clone dan run
git clone https://github.com/yourusername/cutefinance-pwa.git
cd cutefinance-pwa
docker-compose up -d
```

### Instalasi Manual

```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs nginx

# Clone dan build
git clone https://github.com/yourusername/cutefinance-pwa.git
cd cutefinance-pwa
npm install
npm run build

# Deploy
sudo mkdir -p /var/www/cutefinance
sudo cp -r dist/* /var/www/cutefinance/
sudo chown -R www-data:www-data /var/www/cutefinance

# Setup Nginx (ikuti langkah manual installation di atas)
```

### Setup Tailscale (Secure Remote Access)

```bash
# Install Tailscale
curl -fsSL https://tailscale.com/install.sh | sh

# Start Tailscale
sudo tailscale up

# Login di browser dan authorize

# Cek IP Tailscale
tailscale ip

# Akses via: http://<tailscale-ip>:8080
```

### Optimasi Performance

```bash
# Enable swap (jika RAM 2GB)
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# Monitor temperature
cat /sys/class/thermal/thermal_zone0/temp
```

Panduan lengkap: [docs/DEPLOYMENT-ODROID.md](docs/DEPLOYMENT-ODROID.md)

---

## ⚙️ Konfigurasi Lanjutan

### SSL/HTTPS

**Let's Encrypt (Public Domain):**
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d cutefinance.yourdomain.com
```

**Self-Signed (Local Network):**
```bash
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/ssl/private/cutefinance.key \
  -out /etc/ssl/certs/cutefinance.crt \
  -subj "/CN=cutefinance.local"
```

### Systemd Service

```bash
# Copy service file
sudo cp systemd/cutefinance.service /etc/systemd/system/

# Reload systemd
sudo systemctl daemon-reload

# Enable and start
sudo systemctl enable cutefinance
sudo systemctl start cutefinance

# Check status
sudo systemctl status cutefinance
```

### Environment Variables

```bash
# Copy .env.example
cp .env.example .env

# Edit sesuai kebutuhan
nano .env
```

### Backup & Restore

**Backup:**
```bash
# Export dari browser: Settings > Export Data

# Backup configuration
sudo tar -czf cutefinance-backup-$(date +%Y%m%d).tar.gz \
  /var/www/cutefinance \
  /etc/nginx/sites-available/cutefinance \
  /etc/systemd/system/cutefinance.service
```

**Restore:**
```bash
sudo tar -xzf cutefinance-backup-YYYYMMDD.tar.gz -C /
sudo systemctl restart nginx
sudo systemctl restart cutefinance
```

---

## 🐛 Troubleshooting

### Aplikasi tidak bisa dibuka

```bash
# Check service
sudo systemctl status cutefinance

# Check Nginx
sudo systemctl status nginx

# Check port
sudo netstat -tulpn | grep 8080

# Check logs
sudo journalctl -u cutefinance -n 50
sudo tail -f /var/log/nginx/error.log
```

### Build error

```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install

# Update Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

### PWA tidak bisa di-install

- Pastikan menggunakan HTTPS atau localhost
- Clear browser cache
- Check manifest.json accessible: `curl http://localhost:8080/manifest.json`
- Check service worker: `curl http://localhost:8080/sw.js`

### Data hilang

- Data disimpan di localStorage browser
- Export rutin via Settings > Export Data
- Import kembali via Settings > Import Data

### Performance lambat

```bash
# Enable Nginx caching (lihat konfigurasi di atas)
# Check disk I/O
iostat -x 1 5

# Check memory
free -h

# Enable swap jika perlu
```

### Odroid C2 kepanasan

```bash
# Monitor temperature
cat /sys/class/thermal/thermal_zone0/temp

# Install heatsink fan
sudo apt install -y odroid-c2-utilities

# Throttle CPU jika perlu
echo "powersave" | sudo tee /sys/devices/system/cpu/cpu0/cpufreq/scaling_governor
```

---

## 📞 Support & Resources

### Dokumentasi

- **README**: [README.md](README.md)
- **Quick Start (ID)**: [docs/QUICK-START-ID.md](docs/QUICK-START-ID.md)
- **Deployment Odroid**: [docs/DEPLOYMENT-ODROID.md](docs/DEPLOYMENT-ODROID.md)

### Community

- **GitHub Issues**: [Report bug](https://github.com/yourusername/cutefinance-pwa/issues)
- **Discussions**: [Ask questions](https://github.com/yourusername/cutefinance-pwa/discussions)
- **Email**: support@cutefinance.app

### Useful Links

- [Node.js Documentation](https://nodejs.org/docs/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Docker Documentation](https://docs.docker.com/)
- [Tailscale Documentation](https://tailscale.com/kb/)
- [PWA Best Practices](https://web.dev/progressive-web-apps/)

---

## ✅ Checklist Instalasi

- [ ] Node.js 18+ terinstall
- [ ] Git terinstall
- [ ] Repository di-clone
- [ ] Dependencies terinstall (`npm install`)
- [ ] Build berhasil (`npm run build`)
- [ ] Nginx terinstall dan dikonfigurasi
- [ ] Firewall port 8080 dibuka
- [ ] Aplikasi accessible di browser
- [ ] PWA bisa di-install (Add to Home Screen)
- [ ] Backup data rutin dilakukan

---

**Selamat! Aplikasi CuteFinance PWA siap digunakan! 🐾💰**

Untuk pertanyaan lebih lanjut, silakan buka issue di GitHub atau hubungi support@cutefinance.app
