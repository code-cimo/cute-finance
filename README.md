# 🐾 CuteFinance PWA - Personal Finance Manager

Aplikasi manajemen keuangan pribadi berbasis PWA dengan backend **Go (Golang)** dan frontend **React + TailwindCSS**. Dioptimalkan untuk self-hosted di Odroid C2 (ARM64 Linux).

![Go](https://img.shields.io/badge/Go-1.22+-00ADD8?style=flat&logo=go)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react)
![SQLite](https://img.shields.io/badge/SQLite-Pure%20Go-003B57?style=flat&logo=sqlite)
![PWA](https://img.shields.io/badge/PWA-Ready-9cf)

## ✨ Fitur Utama

### 🏗️ Tech Stack
- **Backend**: Go 1.22+ (Chi Router, Pure Go SQLite)
- **Frontend**: React 18 + TypeScript + TailwindCSS
- **Database**: SQLite (modernc.org/sqlite - no CGO)
- **Deployment**: Single binary, Docker, systemd

### 🎨 UI/UX
- **5 Cute Mascots**: Panda, Shiba, Bunny, Capybara, Cat (SVG)
- **Pastel Colors**: Yellow, Pink, Mint, Blue
- **Mobile-First**: Touch-optimized, bottom navigation
- **Smooth Animations**: CSS transitions, confetti effects

### 💰 Finance Features
- **Budget Allocation**: 50/30/20, Zero-Based, Custom
- **Multi-Account**: Cash, Bank, E-Wallet
- **15 Categories**: Food, Bills, Transport, Shopping, dll
- **Statistics**: Charts, trends, budget health

### 📱 PWA Features
- **Offline Support**: Service Worker
- **Installable**: Add to Home Screen
- **Push Notifications**: Payday reminders
- **Background Sync**

## 🚀 Quick Start

**📖 Lihat [QUICKSTART.md](QUICKSTART.md) untuk panduan lengkap!**

### Prasyarat
- Go 1.22+
- Git

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/cutefinance-pwa.git
cd cutefinance-pwa

# Jalankan installer (akan tanya port & setup)
chmod +x install.sh
./install.sh
```

Installer akan:
- ✅ Setup dependencies
- ✅ Build aplikasi
- ✅ Tanya port custom (default: 8080)
- ✅ Save konfigurasi

### 2. Run Server

```bash
# Jalankan server (pakai port dari config)
./cute-finance

# Atau override port via flag
./cute-finance -port 9090
```

### 3. Access

Buka browser: `http://localhost:<port-yang-dipilih>`

### ⚠️ Fix Error go.sum

Jika muncul error `malformed go.sum`:

```bash
# Hapus go.sum lama
rm -f go.sum

# Generate ulang
go mod download
go mod tidy

# Atau gunakan setup script
chmod +x setup.sh
./setup.sh
```

## 📦 Installation Methods

### Method 1: Automated Installer

```bash
chmod +x install.sh
./install.sh
```

Installer akan:
- ✅ Check & install Go
- ✅ Check & install Node.js (optional)
- ✅ Download dependencies
- ✅ Build frontend & backend
- ✅ Run TUI installer (port, mascot preview, systemd)
- ✅ Configure firewall
- ✅ Setup Tailscale (optional)

### Method 2: Docker

```bash
# Build image
make docker

# Run container
make docker-run

# Access: http://localhost:8080
```

### Method 3: Manual Build

```bash
# 1. Install Go 1.22+
# 2. Clone repository
git clone https://github.com/yourusername/cutefinance-pwa.git
cd cutefinance-pwa

# 3. Download dependencies
go mod download

# 4. Build frontend (optional)
cd frontend && npm install && npm run build && cd ..
cp -r frontend/dist ./dist

# 5. Build Go binary
go build -ldflags="-w -s" -o cute-finance ./cmd/server

# 6. Run
./cute-finance
```

### Method 4: Cross-compile Multi-Architecture

**Build untuk ARM64 (Odroid C2):**
```bash
# Gunakan Makefile
make build-arm64

# Atau manual
GOOS=linux GOARCH=arm64 CGO_ENABLED=0 go build \
  -ldflags="-w -s" \
  -o cute-finance-arm64 ./cmd/server

# Copy ke Odroid C2
scp cute-finance-arm64 odroid@<ip>:~/cute-finance
```

**Build untuk x86_64 (Server/PC):**
```bash
make build-amd64

# Atau manual
GOOS=linux GOARCH=amd64 CGO_ENABLED=0 go build \
  -ldflags="-w -s" \
  -o cute-finance-amd64 ./cmd/server
```

**Build untuk Semua Platform:**
```bash
make build-all
# Output: cute-finance (native), cute-finance-arm64, cute-finance-amd64
```

## 📁 Project Structure

```
cutefinance-pwa/
├── cmd/server/          # Go entry point
│   └── main.go
├── internal/
│   ├── models/          # Data models
│   ├── database/        # SQLite setup
│   ├── handlers/        # API handlers
│   └── installer/       # TUI installer
├── src/                 # React frontend
│   ├── components/      # React components
│   ├── App.tsx
│   └── ...
├── public/              # PWA assets
├── docs/                # Documentation
├── go.mod               # Go modules
├── Makefile             # Build commands
├── Dockerfile           # Docker build
└── install.sh           # Installer script
```

## 🔧 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/profile` | Get user profile |
| POST | `/api/profile` | Save user profile |
| GET | `/api/transactions` | Get all transactions |
| POST | `/api/transactions` | Add transaction |
| DELETE | `/api/transactions/{id}` | Delete transaction |
| GET | `/api/budget` | Get monthly budget |
| POST | `/api/budget` | Save budget |
| GET | `/api/export` | Export all data |
| POST | `/api/import` | Import data |

## 🛠️ Makefile Commands

```bash
make build           # Build application
make build-arm64     # Build for ARM64
make run             # Build and run
make run-port PORT=9090  # Run with custom port
make install-tui     # Run TUI installer
make test            # Run tests
make clean           # Clean build artifacts
make docker          # Build Docker image
make docker-run      # Run Docker container
make deps            # Install Go dependencies
make fmt             # Format code
make frontend        # Build frontend
make help            # Show all commands
```

## 📱 Cara Menggunakan

### First Time Setup
1. Buka aplikasi di browser
2. Pilih maskot (Panda/Shiba/Bunny/Capybara/Cat)
3. Set mata uang (IDR/USD/EUR/JPY)
4. Input tanggal gajian
5. Pilih budget method
6. Input pendapatan bulanan

### Menambah Transaksi
1. Tap tombol **+** (FAB)
2. Pilih Expense/Income
3. Input nominal
4. Pilih kategori & account
5. Tap Record

## 🖥️ Deployment di Odroid C2

```bash
# 1. Cross-compile di development machine
GOOS=linux GOARCH=arm64 go build -ldflags="-w -s" -o cute-finance ./cmd/server

# 2. Copy ke Odroid
scp cute-finance odroid@<ip>:~/

# 3. SSH ke Odroid
ssh odroid@<ip>

# 4. Jalankan
./cute-finance -install

# 5. (Optional) Setup Tailscale
curl -fsSL https://tailscale.com/install.sh | sh
sudo tailscale up
```

Panduan lengkap: [docs/DEPLOYMENT-ODROID.md](docs/DEPLOYMENT-ODROID.md)

## 📊 Database Schema

SQLite database disimpan di `./data/cutefinance.db`:

```sql
-- User Profile
CREATE TABLE user_profile (
    id INTEGER PRIMARY KEY,
    mascot TEXT,
    currency TEXT,
    payday_date INTEGER,
    budget_rule TEXT,
    monthly_income REAL,
    setup_complete INTEGER
);

-- Transactions
CREATE TABLE transactions (
    id TEXT PRIMARY KEY,
    amount REAL,
    category TEXT,
    account TEXT,
    note TEXT,
    date TEXT,
    type TEXT
);

-- Monthly Budgets
CREATE TABLE monthly_budgets (
    id INTEGER PRIMARY KEY,
    month TEXT UNIQUE,
    total_income REAL,
    total_spent REAL
);

-- Budget Categories
CREATE TABLE budget_categories (
    id INTEGER PRIMARY KEY,
    budget_id INTEGER,
    category TEXT,
    limit_amount REAL,
    spent REAL,
    color TEXT,
    FOREIGN KEY (budget_id) REFERENCES monthly_budgets(id)
);
```

## 🔒 Security

- Single binary deployment (no external dependencies)
- SQLite with WAL mode for performance
- CORS configurable
- No authentication by default (add middleware as needed)
- Tailscale recommended for secure remote access

## 📞 Support

- **Documentation**: [README.md](README.md), [INSTALL.md](INSTALL.md)
- **Troubleshooting**: [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)
- **Issues**: GitHub Issues
- **Email**: support@cutefinance.app

## 📝 License

MIT License - see [LICENSE](LICENSE) file

---

Made with 🐾 and Go
