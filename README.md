# 🐾 CuteFinance PWA v2.0

Aplikasi manajemen keuangan pribadi berbasis PWA dengan **authentication system**, **multi-device sync**, dan **server-side storage**. Mendukung **cross-platform** deployment (Windows, Linux, macOS).

![Go](https://img.shields.io/badge/Go-1.22+-00ADD8?style=flat&logo=go)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react)
![SQLite](https://img.shields.io/badge/SQLite-Pure%20Go-003B57?style=flat&logo=sqlite)
![PWA](https://img.shields.io/badge/PWA-Ready-9cf)
![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20Linux%20%7C%20macOS-blue)

## ✨ Fitur Utama

### 🔐 Authentication & Multi-Device
- **User Registration & Login** - Buat akun dan login dengan aman
- **Device Token** - Identifikasi perangkat unik untuk setiap device
- **Session Management** - Token-based authentication dengan expiry 30 hari
- **Multi-Device Sync** - Akses data dari beberapa perangkat secara bersamaan
- **Password Hashing** - bcrypt untuk keamanan password

### 💾 Server-Side Storage
- **Data tersimpan di server** - Aman dan persistent (SQLite)
- **Multi-user support** - Setiap user punya data terpisah
- **Data sync otomatis** - Sinkronisasi antar perangkat
- **Export/Import** - Backup dan restore data (JSON)

### 🗑️ Safe Delete
- **Swipe to delete** - Geser kiri untuk hapus transaksi
- **Confirmation dialog** - Peringatan sebelum hapus
- **Warning notification** - Notifikasi bahwa aksi tidak bisa dibatalkan

### 💰 Free & Private
- **100% Gratis** - Tidak ada biaya apapun
- **Mulai dari kosong** - Tidak ada sample data
- **Privacy first** - Data Anda aman di server Anda sendiri

### 🎨 Cute UI/UX
- **5 Cute Mascots** - Panda, Shiba, Bunny, Capybara, Cat
- **Pastel Colors** - Yellow, Pink, Mint, Blue
- **Mobile-First** - Touch-optimized, bottom navigation
- **Smooth Animations** - CSS transitions, confetti effects

### 📊 Finance Features
- **Budget Allocation** - 50/30/20, Zero-Based, Custom
- **Multi-Account** - Cash, Bank, E-Wallet
- **15 Categories** - Food, Bills, Transport, Shopping, dll
- **Statistics** - Charts, trends, budget health
- **Streak Counter** - Gamifikasi logging harian

### 🌐 Cross-Platform
- **Linux** - Installer TUI & uninstaller `.sh` dengan smart detection
- **Windows** - Binary `.exe` (manual install)
- **macOS** - Binary untuk ARM64 & AMD64
- **Docker** - Containerized deployment

## 🚀 Quick Start

### Step 1: Fix Dependencies (Jika Ada Error)

Jika muncul error `missing go.sum entry`:

```bash
# Jalankan fix script
chmod +x fix-dependencies.sh
./fix-dependencies.sh
```

Script ini akan:
- ✅ Remove old go.sum
- ✅ Clean module cache
- ✅ Download dependencies
- ✅ Generate go.sum yang valid
- ✅ Verify modules

### Step 2: Build dengan TUI

```bash
# Jalankan build script dengan TUI interaktif
chmod +x build-all-platforms.sh
./build-all-platforms.sh
```

**TUI Menu:**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  🎯 Select Platforms to Build
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  1) 🖥️  Current Platform
  2) 🐧 Linux ARM64 (Odroid C2, Raspberry Pi)
  3) 🐧 Linux AMD64 (x86_64)
  4) 🪟 Windows AMD64
  5) 🍎 macOS ARM64 (Apple Silicon)
  6) 🍎 macOS AMD64 (Intel)
  7) 🌍 Build ALL Platforms
  0) ❌ Exit

💡 Tips:
  • Enter multiple numbers (e.g., '1 2 3')
  • Or enter '7' to build all
```

### Step 3: Install

```bash
# Jalankan installer
chmod +x install.sh
./install.sh

# Follow TUI prompts:
# - Pilih mode: Update/Reinstall/Fresh
# - Set port
# - Set data directory
# - Optional: Create systemd service
```

### Step 4: Access

Buka browser: `http://localhost:<port>`

---

### Alternative: Manual Installation

**Linux:**
```bash
# 1. Fix dependencies
./fix-dependencies.sh

# 2. Build
go build -ldflags="-w -s" -o cute-finance ./cmd/server

# 3. Install
chmod +x install.sh
./install.sh

# 4. Access: http://localhost:<port>
```

## 📱 Cara Menggunakan

### 1. Register & Login

**Register:**
1. Buka aplikasi di browser
2. Klik tab **"Register"**
3. Isi username, email, password
4. Klik **"Register 🎉"**

**Login:**
1. Buka aplikasi
2. Klik tab **"Login"**
3. Isi username dan password
4. Klik **"Login 🐾"**

### 2. Setup Profile

Setelah login pertama kali:
1. Pilih mascot (Panda/Shiba/Bunny/Capybara/Cat)
2. Pilih currency (IDR/USD/EUR/JPY)
3. Set payday date (1-31)
4. Set monthly income (atau biarkan 0)
5. Pilih budget method (50/30/20, Zero-Based, Custom)

### 3. Tambah Transaksi

1. Tap tombol **+** (FAB) di pojok kanan bawah
2. Pilih tipe: Expense atau Income
3. Input nominal (atau gunakan quick buttons)
4. Pilih kategori (Food, Bills, Transport, dll)
5. Pilih metode pembayaran (Cash, Bank, E-Wallet)
6. Tambahkan catatan (opsional)
7. Tap **"Record"** untuk menyimpan

### 4. Hapus Transaksi

1. Buka halaman **Transactions**
2. **Swipe kiri** pada transaksi yang ingin dihapus
3. Tap tombol **"Delete"**
4. **Konfirmasi** di modal peringatan
5. Tap **"Delete 🗑️"** untuk menghapus

⚠️ **Peringatan:** Aksi hapus tidak bisa dibatalkan!

### 5. Logout

1. Buka **Settings**
2. Tap **"Logout 🚪"**
3. Konfirmasi logout
4. Data tetap aman di server

## 🌐 Platform Support

| Platform | Architecture | Installer | Uninstaller | Binary |
|----------|--------------|-----------|-------------|--------|
| **Linux** | ARM64 | `install.sh` (TUI) | `uninstaller-linux.sh` | `cute-finance-linux-arm64` |
| **Linux** | AMD64 | `install.sh` (TUI) | `uninstaller-linux.sh` | `cute-finance-linux-amd64` |
| **Windows** | AMD64 | Manual | Manual | `cute-finance-windows-amd64.exe` |
| **macOS** | ARM64 | Manual | Manual | `cute-finance-darwin-arm64` |
| **macOS** | AMD64 | Manual | Manual | `cute-finance-darwin-amd64` |

### Linux Installation (Odroid C2 / Raspberry Pi)

```bash
# 1. Fix dependencies
./fix-dependencies.sh

# 2. Build untuk ARM64
GOOS=linux GOARCH=arm64 CGO_ENABLED=0 go build \
  -ldflags="-w -s" \
  -o cute-finance-linux-arm64 ./cmd/server

# 3. Copy ke Odroid
scp cute-finance-linux-arm64 odroid@<ip>:~/cute-finance
scp install.sh uninstaller-linux.sh odroid@<ip>:~/

# 4. Di Odroid
ssh odroid@<ip>
chmod +x install.sh
./install.sh

# 5. Access: http://localhost:<port>

# 6. Uninstall:
chmod +x uninstaller-linux.sh
./uninstaller-linux.sh
```

### Windows Installation (Manual)

```cmd
:: 1. Fix dependencies
fix-dependencies.sh

:: 2. Build
GOOS=windows GOARCH=amd64 CGO_ENABLED=0 go build ^
  -ldflags="-w -s" ^
  -o cute-finance-windows-amd64.exe ./cmd/server

:: 3. Copy ke Windows
::    cute-finance-windows-amd64.exe

:: 4. Run installer
cute-finance-windows-amd64.exe -install

:: 5. Follow prompts
:: 6. Access: http://localhost:<port>
```

### Docker

```bash
# Build image
docker build -t cutefinance:latest .

# Run container
docker run -d \
  --name cutefinance \
  -p 8080:8080 \
  -v $(pwd)//app/data \
  --restart unless-stopped \
  cutefinance:latest

# Access: http://localhost:8080
```

## 🔧 API Endpoints

### Public (No Auth Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/logout` | Logout user |
| GET | `/api/health` | Health check |

### Protected (Auth Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/profile` | Get user profile |
| POST | `/api/profile` | Save user profile |
| GET | `/api/transactions` | Get all transactions |
| POST | `/api/transactions` | Add transaction |
| DELETE | `/api/transactions/{id}` | Delete transaction |
| GET | `/api/budget` | Get monthly budget |
| POST | `/api/budget` | Save budget |
| POST | `/api/sync` | Sync data |
| GET | `/api/export` | Export all data |

### Example API Usage

**Register:**
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"user1","email":"user1@example.com","password":"password123"}'
```

**Login:**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"user1","password":"password123"}'

# Response: {"token":"...","userId":1,"username":"user1"}
```

**Add Transaction:**
```bash
curl -X POST http://localhost:8080/api/transactions \
  -H "Content-Type: application/json" \
  -H "Authorization: <token>" \
  -d '{"amount":50000,"category":"food","account":"cash","note":"Lunch","date":"2024-01-15","type":"expense"}'
```

## 📊 Database Schema

```sql
-- Users
CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    username TEXT UNIQUE,
    email TEXT UNIQUE,
    password_hash TEXT,
    created_at DATETIME
);

-- Devices
CREATE TABLE devices (
    id INTEGER PRIMARY KEY,
    user_id INTEGER,
    token TEXT UNIQUE,
    name TEXT,
    platform TEXT,
    last_active DATETIME
);

-- Sessions
CREATE TABLE sessions (
    token TEXT PRIMARY KEY,
    user_id INTEGER,
    device_id INTEGER,
    expires_at DATETIME
);

-- Transactions
CREATE TABLE transactions (
    id TEXT PRIMARY KEY,
    user_id INTEGER,
    amount REAL,
    category TEXT,
    account TEXT,
    note TEXT,
    date TEXT,
    type TEXT
);

-- Budgets
CREATE TABLE monthly_budgets (
    id INTEGER PRIMARY KEY,
    user_id INTEGER,
    month TEXT,
    total_income REAL,
    total_spent REAL
);
```

## 🛠️ Development

### Backend (Go)

```bash
# Fix dependencies
./fix-dependencies.sh

# Run server
go run ./cmd/server

# Build
go build -ldflags="-w -s" -o cute-finance ./cmd/server

# Cross-compile for ARM64
GOOS=linux GOARCH=arm64 CGO_ENABLED=0 go build \
  -ldflags="-w -s" \
  -o cute-finance-arm64 ./cmd/server

# Cross-compile for Windows
GOOS=windows GOARCH=amd64 CGO_ENABLED=0 go build \
  -ldflags="-w -s" \
  -o cute-finance.exe ./cmd/server
```

### Frontend (React)

```bash
# Development
npm run dev

# Build
npm run build

# Preview
npm run preview
```

## 🔒 Security

- **Password Hashing** - bcrypt dengan cost default
- **Token-based Auth** - Session tokens dengan expiry 30 hari
- **Device Tracking** - Setiap perangkat punya token unik
- **CORS Enabled** - Cross-origin requests supported
- **Input Validation** - Semua input divalidasi
- **SQLite Security** - Pure Go driver, no external dependencies

## 📦 Project Structure

```
cutefinance-pwa/
├── cmd/server/              # Go backend entry point
│   └── main.go
├── internal/
│   ├── database/            # SQLite setup & schema
│   ├── handlers/            # API handlers (auth, data)
│   ├── installer/           # TUI installer
│   └── models/              # Data models
├── src/                     # React frontend
│   ├── components/          # React components
│   ├── contexts/            # Auth context
│   ├── App.tsx              # Main app
│   └── ...
├── public/                  # PWA assets
├── dist/                    # Built frontend
├── data/                    # SQLite database
├── fix-dependencies.sh      # Fix go.sum & dependencies
├── install.sh               # Linux installer (TUI with smart detection)
├── uninstaller-linux.sh     # Linux uninstaller
├── build-all-platforms.sh   # Cross-platform build with TUI
├── go.mod                   # Go modules
├── package.json             # Node.js dependencies
└── README.md                # This file
```

## 📚 Documentation

- **[FIX-GO-SUM.md](FIX-GO-SUM.md)** - Fix missing go.sum error
- **[CROSS-PLATFORM-INSTALL.md](CROSS-PLATFORM-INSTALL.md)** - Panduan instalasi cross-platform
- **[docs/CROSS-PLATFORM.md](docs/CROSS-PLATFORM.md)** - Detail deployment per platform
- **[INSTALL.md](INSTALL.md)** - Installation guide lengkap
- **[USAGE.md](USAGE.md)** - Usage guide
- **[UPGRADE-v2.0.md](UPGRADE-v2.0.md)** - Upgrade guide dari v1.0

## 🆘 Troubleshooting

### Error: missing go.sum entry

**Solution:**
```bash
# Jalankan fix script
chmod +x fix-dependencies.sh
./fix-dependencies.sh

# Atau manual
rm -f go.sum
go clean -modcache
go mod download
go mod tidy
```

### Existing Installation Detected

Jika installer mendeteksi instalasi yang sudah ada, Anda akan diberikan 3 pilihan:

1. **Update/Upgrade** - Keep data & config, replace binary only
   - Gunakan jika ingin update versi tanpa kehilangan data
   
2. **Reinstall** - Keep data, reset config & binary
   - Gunakan jika ada masalah config tapi ingin keep data
   
3. **Fresh Install** - Delete everything & start fresh
   - Gunakan jika ingin mulai dari awal (data akan dihapus!)

### Cannot access localhost:port

```bash
# Check if server is running
ps aux | grep cute-finance

# Check port
netstat -tuln | grep <port>

# Restart server
./cute-finance
```

### Login not working

```bash
# Check database
ls -la data/cutefinance.db

# Check logs
./cute-finance 2>&1 | tee server.log
```

### Build errors

```bash
# Fix dependencies
./fix-dependencies.sh

# Clean and rebuild
rm -f cute-finance
go build -o cute-finance ./cmd/server
```

### Service won't start

```bash
# Check logs
sudo journalctl -u cutefinance -n 50

# Check config
cat data/config.json

# Restart service
sudo systemctl restart cutefinance
```

## 🤝 Contributing

Contributions are welcome! Silakan buat pull request atau buka issue untuk saran/perbaikan.

## 📝 License

MIT License - see [LICENSE](LICENSE) file

## 🙏 Acknowledgments

- Font: [Nunito](https://fonts.google.com/specimen/Nunito) by Vernon Adams
- Icons: EmojiOne & custom SVG
- Backend: Go with Chi Router
- Frontend: React with TailwindCSS
- Database: SQLite (Pure Go driver)

## 📊 Version History

- **v2.0.0** (2024) - Authentication, multi-device, cross-platform, smart installer, TUI build
- **v1.0.0** (2024) - Initial release

---

**Made with 🐾 by CuteFinance Team**

**Version:** 2.0.0  
**Platforms:** Windows, Linux (ARM64/AMD64), macOS (ARM64/AMD64)  
**Status:** Production Ready ✅
