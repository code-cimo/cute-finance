# 🐾 CuteFinance PWA - Panduan Cepat

## 🚀 Instalasi Tercepat (3 Metode)

### Metode 1: Docker (Paling Mudah - 2 Menit)

```bash
# 1. Install Docker (jika belum ada)
curl -fsSL https://get.docker.com | sh

# 2. Clone & Run
git clone https://github.com/yourusername/cutefinance-pwa.git
cd cutefinance-pwa
docker-compose up -d

# 3. Akses di browser
# http://localhost:8080
```

### Metode 2: Installer Otomatis (5 Menit)

```bash
# 1. Clone repository
git clone https://github.com/yourusername/cutefinance-pwa.git
cd cutefinance-pwa

# 2. Jalankan installer
chmod +x install.sh
./install.sh

# 3. Ikuti prompt
```

### Metode 3: Manual (10 Menit)

```bash
# 1. Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs nginx

# 2. Clone & Build
git clone https://github.com/yourusername/cutefinance-pwa.git
cd cutefinance-pwa
npm install
npm run build

# 3. Deploy
sudo mkdir -p /var/www/cutefinance
sudo cp -r dist/* /var/www/cutefinance/

# 4. Setup Nginx (gunakan config dari install.sh)
```

## 📱 Cara Menggunakan

### First Time Setup

1. **Buka aplikasi** di browser
2. **Pilih maskot** (Panda/Shiba/Bunny/Capybara/Cat)
3. **Set mata uang** (IDR/USD/EUR/JPY)
4. **Input tanggal gajian** (1-31)
5. **Pilih budget method** (50/30/20, Zero-Based, Custom)
6. **Input pendapatan bulanan**
7. **Selesai!** 🎉

### Menambah Transaksi

1. Tap tombol **+** (FAB) di pojok kanan bawah
2. Pilih tipe: **Expense** atau **Income**
3. Input **nominal** (atau pakai quick buttons)
4. Pilih **kategori** (🍜 Food, 📄 Bills, 🚗 Transport, dll)
5. Pilih **metode bayar** (💵 Cash, 🏦 Bank, 📱 E-Wallet)
6. Tambahkan **catatan** (opsional)
7. Tap **Record** ✅

### Melihat Dashboard

- **Balance Card**: Sisa budget bulan ini
- **Donut Chart**: Spending per kategori
- **Budget Progress**: Progress bar per kategori
- **Recent Activity**: Transaksi terbaru
- **Streak Counter**: Hari berturut-turut logging

### Statistik

- **Daily Trend**: Grafik 7 hari terakhir
- **Category Breakdown**: Detail per kategori
- **Account Breakdown**: Per metode pembayaran
- **Budget Health**: Status compliance (🟢🟡🔴)

## 🎨 Fitur Utama

✅ **5 Cute Mascots** - Panda, Shiba, Bunny, Capybara, Cat
✅ **Multi-Currency** - IDR, USD, EUR, JPY
✅ **Budget Allocation** - 50/30/20, Zero-Based, Custom
✅ **Multi-Account** - Cash, Bank, E-Wallet
✅ **15 Kategori** - Food, Bills, Transport, Shopping, dll
✅ **Dashboard Interaktif** - Charts, progress bars
✅ **Statistics Lengkap** - Daily trend, breakdown
✅ **PWA Support** - Offline, installable
✅ **Payday Reminder** - Notifikasi otomatis
✅ **Export/Import** - JSON & CSV
✅ **Mobile-First** - Touch-optimized UI

## 🔧 Perintah Berguna

### Development

```bash
npm run dev          # Start dev server
npm run build        # Build production
npm run preview      # Preview build
```

### Docker

```bash
docker-compose up -d      # Start
docker-compose down       # Stop
docker-compose logs -f    # Logs
docker-compose restart    # Restart
```

### Systemd Service

```bash
sudo systemctl start cutefinance      # Start
sudo systemctl stop cutefinance       # Stop
sudo systemctl restart cutefinance    # Restart
sudo systemctl status cutefinance     # Status
sudo journalctl -u cutefinance -f     # Logs
```

### Nginx

```bash
sudo systemctl reload nginx    # Reload config
sudo nginx -t                  # Test config
sudo tail -f /var/log/nginx/access.log  # Access log
sudo tail -f /var/log/nginx/error.log   # Error log
```

## 📊 Struktur Data

### LocalStorage Keys

- `cute-finance-profile` - User profile & settings
- `cute-finance-transactions` - All transactions
- `cute-finance-budgets` - Monthly budget allocation

### Export Format (JSON)

```json
{
  "profile": {
    "mascot": "panda",
    "currency": "IDR",
    "paydayDate": 25,
    "budgetRule": "50-30-20",
    "monthlyIncome": 10000000,
    "setupComplete": true
  },
  "transactions": [...],
  "budget": {...},
  "exportDate": "2024-01-15T10:30:00.000Z"
}
```

## 🐛 Troubleshooting Cepat

### Aplikasi tidak bisa dibuka
```bash
# Check service
sudo systemctl status cutefinance

# Check Nginx
sudo systemctl status nginx

# Check port
sudo netstat -tulpn | grep 8080
```

### Data hilang
```bash
# Data disimpan di localStorage browser
# Export rutin via Settings > Export Data
# Import kembali via Settings > Import Data
```

### PWA tidak bisa di-install
```bash
# Pastikan HTTPS atau localhost
# Clear browser cache
# Check manifest.json accessible
curl http://localhost:8080/manifest.json
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

## 📞 Support

- **Documentation**: [README.md](../README.md)
- **Deployment Guide**: [DEPLOYMENT-ODROID.md](DEPLOYMENT-ODROID.md)
- **Issues**: GitHub Issues
- **Email**: support@cutefinance.app

## 🎯 Tips & Tricks

1. **Backup Rutin** - Export data setiap minggu
2. **Install sebagai PWA** - Add to Home Screen untuk akses cepat
3. **Gunakan Quick Amount** - Tombol nominal cepat untuk input faster
4. **Check Streak** - Logging harian untuk build habit
5. **Review Budget** - Cek budget health setiap akhir bulan
6. **Custom Categories** - Tambah kategori sesuai kebutuhan
7. **Multi-Account** - Track cash vs bank vs e-wallet separately

## 🚀 Next Steps

1. ✅ Install aplikasi
2. ✅ Setup profile & budget
3. ✅ Tambah transaksi pertama
4. ✅ Install sebagai PWA
5. ✅ Setup backup rutin
6. ✅ Share ke teman/keluarga!

---

**Selamat menggunakan CuteFinance! 🐾💰**
