# 🐾 CuteFinance PWA v2.0 - Personal Finance Manager

Aplikasi manajemen keuangan pribadi berbasis PWA dengan **authentication system**, **multi-device sync**, dan **server-side storage**.

![Go](https://img.shields.io/badge/Go-1.22+-00ADD8?style=flat&logo=go)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react)
![SQLite](https://img.shields.io/badge/SQLite-Pure%20Go-003B57?style=flat&logo=sqlite)
![PWA](https://img.shields.io/badge/PWA-Ready-9cf)

## ✨ Fitur Baru v2.0

### 🔐 Authentication System
- **User Registration & Login** - Buat akun dan login
- **Device Token** - Identifikasi perangkat unik
- **Session Management** - Token-based authentication
- **Multi-Device Support** - Login dari beberapa perangkat

### 💾 Server-Side Storage
- **Data tersimpan di server** - Aman dan persistent
- **Multi-user support** - Setiap user punya data terpisah
- **Data sync** - Sinkronisasi antar perangkat
- **Export/Import** - Backup dan restore data

### 🗑️ Delete with Confirmation
- **Swipe to delete** - Geser kiri untuk hapus transaksi
- **Confirmation dialog** - Peringatan sebelum hapus
- **Warning notification** - Notifikasi bahwa aksi tidak bisa dibatalkan

### 💰 Free & Open
- **100% Gratis** - Tidak ada biaya apapun
- **Mulai dari kosong** - Tidak ada sample data
- **Privacy first** - Data Anda aman di server

## 🚀 Quick Start

### 1. Setup & Build

```bash
# Clone repository
git clone https://github.com/yourusername/cutefinance-pwa.git
cd cutefinance-pwa

# Install dependencies
go mod download
npm install

# Build frontend
npm run build

# Build Go backend
go build -o cute-finance ./cmd/server
```

### 2. Run Server

```bash
# Jalankan installer (set port)
./cute-finance -install

# Atau jalankan langsung
./cute-finance
```

### 3. Access & Register

Buka browser: `http://localhost:<port>`

1. **Register** - Buat akun baru
2. **Login** - Masuk dengan akun
3. **Setup** - Pilih mascot, currency, budget
4. **Start tracking** - Mulai catat keuangan!

## 📱 Cara Menggunakan

### Register & Login

**Register:**
1. Buka aplikasi
2. Klik tab "Register"
3. Isi username, email, password
4. Klik "Register 🎉"

**Login:**
1. Buka aplikasi
2. Klik tab "Login"
3. Isi username dan password
4. Klik "Login 🐾"

### Menambah Transaksi

1. Tap tombol **+** (FAB) di pojok kanan bawah
2. Pilih tipe: Expense atau Income
3. Input nominal (atau gunakan quick buttons)
4. Pilih kategori (Food, Bills, Transport, dll)
5. Pilih metode pembayaran (Cash, Bank, E-Wallet)
6. Tambahkan catatan (opsional)
7. Tap "Record" untuk menyimpan

### Menghapus Transaksi

1. Buka halaman Transactions
2. **Swipe kiri** pada transaksi yang ingin dihapus
3. Tap tombol "Delete"
4. **Konfirmasi** di modal peringatan
5. Tap "Delete 🗑️" untuk menghapus

⚠️ **Peringatan:** Aksi hapus tidak bisa dibatalkan!

### Logout

1. Buka Settings
2. Tap "Logout 🚪"
3. Konfirmasi logout
4. Data tetap aman di server

## 🔧 API Endpoints

### Public (No Auth)
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
```

## 🛠️ Development

### Backend (Go)

```bash
# Run server
go run ./cmd/server

# Build
go build -o cute-finance ./cmd/server

# Cross-compile for ARM64
GOOS=linux GOARCH=arm64 go build -o cute-finance-arm64 ./cmd/server
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

## 📦 Deployment

### Docker

```bash
docker build -t cutefinance .
docker run -p 8080:8080 -v ./data:/app/data cutefinance
```

### Manual

```bash
# Build
npm run build
go build -o cute-finance ./cmd/server

# Run
./cute-finance -port 8080
```

### Odroid C2 (ARM64)

```bash
# Cross-compile
GOOS=linux GOARCH=arm64 go build -o cute-finance ./cmd/server

# Copy to Odroid
scp cute-finance odroid@<ip>:~/

# Run on Odroid
./cute-finance
```

## 🔒 Security

- **Password hashing** - bcrypt dengan cost default
- **Token-based auth** - Session tokens dengan expiry
- **Device tracking** - Setiap perangkat punya token unik
- **CORS enabled** - Cross-origin requests supported
- **Input validation** - Semua input divalidasi

## 📝 Features List

### Authentication
- ✅ User registration
- ✅ User login
- ✅ Session management
- ✅ Device token generation
- ✅ Auto-logout on token expiry

### Transactions
- ✅ Add expense/income
- ✅ Delete with confirmation
- ✅ Swipe-to-delete gesture
- ✅ Warning notifications
- ✅ Multi-category support
- ✅ Multi-account support

### Budget
- ✅ 50/30/20 rule
- ✅ Zero-based budget
- ✅ Custom allocation
- ✅ Progress tracking
- ✅ Visual charts

### Data Management
- ✅ Server-side storage
- ✅ Export to JSON
- ✅ Import from JSON
- ✅ Data sync between devices

### UI/UX
- ✅ Mobile-first design
- ✅ Pastel color palette
- ✅ 5 cute mascots
- ✅ Smooth animations
- ✅ Bottom navigation
- ✅ PWA support

## 🆘 Troubleshooting

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
# Clean and rebuild
rm -f cute-finance go.sum
go mod download
go mod tidy
go build -o cute-finance ./cmd/server
```

## 📚 Documentation

- [INSTALL.md](INSTALL.md) - Installation guide
- [QUICKSTART.md](QUICKSTART.md) - Quick start guide
- [USAGE.md](USAGE.md) - Usage guide
- [PORT-CONFIG.md](PORT-CONFIG.md) - Port configuration
- [docs/DEPLOYMENT-ODROID.md](docs/DEPLOYMENT-ODROID.md) - Odroid deployment

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## 📝 License

MIT License - see [LICENSE](LICENSE) file

## 🙏 Acknowledgments

- Font: [Nunito](https://fonts.google.com/specimen/Nunito) by Vernon Adams
- Icons: EmojiOne & custom SVG
- Backend: Go with Chi Router
- Frontend: React with TailwindCSS
- Database: SQLite (Pure Go driver)

---

**Made with 🐾 by CuteFinance Team**

**Version 2.0.0** - Authentication & Multi-Device Support
