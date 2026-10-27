# 🐾 CuteFinance PWA - Personal Finance Manager

Aplikasi manajemen keuangan pribadi berbasis PWA (Progressive Web App) dengan estetika "Original Cute Animals" yang lucu dan clean. Dioptimalkan untuk mobile-first dan self-hosted di Odroid C2 (ARM64).

![CuteFinance](https://img.shields.io/badge/Status-Production%20Ready-success)
![License](https://img.shields.io/badge/License-MIT-blue)
![PWA](https://img.shields.io/badge/PWA-Ready-9cf)

## ✨ Fitur Utama

### 🎨 UI/UX
- **Mobile-First Design**: Dioptimalkan untuk layar sentuh
- **Cute Animal Mascots**: Pilih maskot favorit (Panda, Shiba, Bunny, Capybara, Cat)
- **Pastel Color Palette**: Warna lembut yang nyaman di mata
- **Smooth Animations**: Transisi halus dan micro-interactions
- **Bottom Navigation**: Navigasi thumb-friendly

### 💰 Manajemen Keuangan
- **Budget Allocation Otomatis**: 
  - Rule A: 50/30/20 (Needs/Wants/Savings)
  - Rule B: Zero-Based (Survival/Lifestyle/Future/Charity)
  - Rule C: Custom allocation
- **Multi-Account Support**: Cash, Bank Transfer, E-Wallet
- **Kategori Lengkap**: Food, Bills, Transport, Shopping, dll
- **Real-time Tracking**: Progress bar per kategori

### 📊 Dashboard & Statistik
- **Balance Overview**: Total budget vs spent
- **Donut Chart**: Visualisasi spending per kategori
- **Daily Trend**: Grafik 7 hari terakhir
- **Budget Health**: Status compliance per kategori
- **Streak Counter**: Gamifikasi logging harian

### 🔔 Notifikasi & Scheduler
- **Payday Reminder**: Notifikasi otomatis di hari gajian
- **Budget Alert**: Warning saat mendekati limit
- **PWA Push Notification**: Berfungsi offline
- **Background Sync**: Sinkronisasi data otomatis

### 📱 PWA Features
- **Offline Support**: Service Worker untuk akses offline
- **Installable**: Add to Home Screen
- **Standalone Mode**: Berjalan seperti native app
- **Fast Loading**: App Shell Architecture

## 🚀 Quick Start

### Prasyarat
- Node.js 18+ dan npm
- Modern web browser (Chrome, Firefox, Safari, Edge)
- (Opsional) Odroid C2 atau ARM64 device untuk self-hosting

### Instalasi Development

```bash
# Clone repository
git clone https://github.com/yourusername/cutefinance-pwa.git
cd cutefinance-pwa

# Install dependencies
npm install

# Jalankan development server
npm run dev

# Akses di browser
# http://localhost:5173
```

### Build untuk Production

```bash
# Build aplikasi
npm run build

# File output ada di folder dist/
# Deploy folder dist/ ke web server
```

## 📦 Deployment Options

### Option 1: Static Hosting (Recommended untuk Development)

Deploy folder `dist/` ke static hosting:
- Vercel
- Netlify
- GitHub Pages
- Cloudflare Pages

```bash
# Contoh deploy ke Vercel
npm install -g vercel
vercel --prod
```

### Option 2: Self-Hosted di Odroid C2 (Production)

#### A. Menggunakan Docker (Paling Mudah)

```bash
# Build Docker image
docker build -t cutefinance-pwa .

# Jalankan container
docker run -d \
  --name cutefinance \
  -p 8080:80 \
  --restart unless-stopped \
  cutefinance-pwa

# Akses via: http://<odroid-ip>:8080
```

#### B. Manual Deployment dengan Nginx

```bash
# 1. Build aplikasi
npm run build

# 2. Copy folder dist ke server
scp -r dist/* user@odroid-ip:/var/www/cutefinance/

# 3. Setup Nginx
sudo nano /etc/nginx/sites-available/cutefinance
```

Konfigurasi Nginx:
```nginx
server {
    listen 8080;
    server_name _;
    root /var/www/cutefinance;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Enable gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
}
```

```bash
# 4. Enable site
sudo ln -s /etc/nginx/sites-available/cutefinance /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# 5. Akses via: http://<odroid-ip>:8080
```

### Option 3: Tailscale Access (Secure Remote Access)

```bash
# 1. Install Tailscale di Odroid
curl -fsSL https://tailscale.com/install.sh | sh
sudo tailscale up

# 2. Aplikasi sudah accessible via Tailscale IP
# Contoh: http://100.x.y.z:8080

# 3. (Opsional) Setup HTTPS dengan Tailscale
sudo tailscale cert cutefinance.ts.net
```

## 🛠️ Installer Script (Automated Setup)

Gunakan installer script untuk setup otomatis:

```bash
# Download installer
curl -O https://raw.githubusercontent.com/yourusername/cutefinance-pwa/main/install.sh

# Berikan permission executable
chmod +x install.sh

# Jalankan installer
./install.sh
```

Installer akan:
- ✅ Cek dependency (Node.js, npm)
- ✅ Install dependencies
- ✅ Build aplikasi
- ✅ Setup Nginx (jika dipilih)
- ✅ Configure firewall
- ✅ Setup systemd service (opsional)
- ✅ Generate SSL certificate (opsional)

## 📱 Cara Menggunakan

### 1. Setup Wizard (First Time)

Saat pertama kali membuka aplikasi:

1. **Pilih Maskot**: Pilih karakter pendamping (Panda, Shiba, Bunny, Capybara, atau Cat)
2. **Pilih Mata Uang**: Default IDR/Rupiah
3. **Set Tanggal Gajian**: Input tanggal gajian (1-31)
4. **Pilih Budget Method**: 
   - 50/30/20 Rule
   - Zero-Based Budget
   - Custom Allocation
5. **Input Monthly Income**: Masukkan pendapatan bulanan

### 2. Menambah Transaksi

1. Tap tombol **+** (FAB) di pojok kanan bawah
2. Pilih tipe: Expense atau Income
3. Input nominal (atau gunakan quick amount buttons)
4. Pilih kategori (Food, Bills, Transport, dll)
5. Pilih metode pembayaran (Cash, Bank, E-Wallet)
6. Tambahkan catatan (opsional)
7. Tap "Record" untuk menyimpan

### 3. Melihat Dashboard

- **Balance Card**: Lihat sisa budget bulan ini
- **Donut Chart**: Visualisasi spending per kategori
- **Budget Progress**: Progress bar per kategori
- **Recent Activity**: Daftar transaksi terbaru
- **Savings Goal**: Target tabungan 20% dari income

### 4. Statistik

- **Daily Trend**: Grafik spending 7 hari terakhir
- **Category Breakdown**: Detail spending per kategori
- **Account Breakdown**: Spending per metode pembayaran
- **Budget Health**: Status compliance (🟢 Good, 🟡 Warning, 🔴 Over)

### 5. Pengaturan

- Edit profil (maskot, currency, payday, budget rule)
- Export data (JSON/CSV)
- Import data
- Reset semua data

## 🎨 Customization

### Mengganti Warna Tema

Edit `src/index.css`:

```css
@theme {
  --color-pastel-yellow: #FFF9C4;  /* Ganti warna ini */
  --color-pastel-pink: #F8BBD0;
  --color-pastel-mint: #C8E6C9;
  /* ... */
}
```

### Menambah Kategori Baru

Edit `src/store.ts`:

```typescript
export const CATEGORY_COLORS: Record<CategoryType, string> = {
  // ... existing categories
  'new-category': '#FF6B6B',  // Tambah di sini
};

export const CATEGORY_ICONS: Record<CategoryType, string> = {
  // ... existing categories
  'new-category': '🎯',  // Tambah emoji
};
```

### Mengganti Mascot

Edit `src/components/Mascot.tsx` untuk menambah atau mengubah mascot SVG.

## 🔧 Troubleshooting

### Aplikasi tidak bisa di-install sebagai PWA

**Solusi:**
- Pastikan menggunakan HTTPS (kecuali localhost)
- Clear browser cache
- Cek manifest.json sudah benar
- Pastikan service worker terdaftar

### Data hilang setelah refresh

**Penyebab:** Data disimpan di localStorage browser

**Solusi:**
- Export data secara berkala (Settings > Export Data)
- Gunakan fitur backup otomatis (coming soon)

### Build error di ARM64

**Solusi:**
```bash
# Install build dependencies
sudo apt-get update
sudo apt-get install -y build-essential python3

# Clear npm cache
npm cache clean --force

# Reinstall
rm -rf node_modules package-lock.json
npm install
```

### Service Worker tidak update

**Solusi:**
```javascript
// Di browser console
navigator.serviceWorker.getRegistrations().then(function(registrations) {
  for(let registration of registrations) {
    registration.unregister();
  }
});
// Refresh halaman
```

## 📊 Database Schema

Aplikasi menggunakan localStorage dengan struktur:

```typescript
// User Profile
{
  mascot: 'panda' | 'shiba' | 'bunny' | 'capybara' | 'cat',
  currency: 'IDR' | 'USD' | 'EUR' | 'JPY',
  paydayDate: number,  // 1-31
  budgetRule: '50-30-20' | 'zero-based' | 'custom',
  monthlyIncome: number,
  setupComplete: boolean
}

// Transaction
{
  id: string,
  amount: number,
  category: CategoryType,
  account: 'cash' | 'bank' | 'ewallet',
  note: string,
  date: string,  // YYYY-MM-DD
  type: 'expense' | 'income'
}

// Monthly Budget
{
  month: string,  // YYYY-MM
  categories: BudgetCategory[],
  totalIncome: number,
  totalSpent: number
}
```

## 🤝 Contributing

Contributions are welcome! Silakan buat pull request atau buka issue untuk saran/perbaikan.

### Development Guidelines

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details

## 🙏 Acknowledgments

- Font: [Nunito](https://fonts.google.com/specimen/Nunito) by Vernon Adams
- Icons: EmojiOne & custom SVG
- Inspiration: Cute finance apps & Japanese kawaii aesthetic

## 📞 Support

Untuk pertanyaan atau bantuan:
- Buka issue di GitHub
- Email: support@cutefinance.app
- Discord: [Join our community](https://discord.gg/cutefinance)

## 🗺️ Roadmap

- [ ] Multi-currency support
- [ ] Recurring transactions
- [ ] Budget templates
- [ ] Data sync across devices
- [ ] Dark mode
- [ ] More mascots & animations
- [ ] AI-powered spending insights
- [ ] Export to popular accounting software
- [ ] Multi-language support

---

Made with 🐾 by CuteFinance Team
