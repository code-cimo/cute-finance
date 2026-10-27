# 🚀 Quick Start Guide

## ⚡ 3-Step Setup

### Step 1: Clone Repository
```bash
git clone https://github.com/yourusername/cutefinance-pwa.git
cd cutefinance-pwa
```

### Step 2: Run Installer
```bash
# Jalankan installer (akan tanya port & setup)
chmod +x install.sh
./install.sh
```

Installer akan:
- ✅ Setup dependencies
- ✅ **Tanya port custom** (default: 8080)
- ✅ Build aplikasi
- ✅ Save konfigurasi

### Step 3: Run Server
```bash
# Jalankan server (pakai port dari config)
./cute-finance
```

Access: `http://localhost:<port-yang-dipilih>`

---

## 🎯 Cara Set Port Custom

### Via Installer (Recommended)
```bash
# Jalankan installer
./cute-finance -install

# Masukkan port saat ditanya
# Contoh: 9090

# Port tersimpan di data/config.json
```

### Via Command Line
```bash
# Override port saat run
./cute-finance -port 9090
```

### Via Config File
```bash
# Edit config
nano data/config.json

# Ubah port
{
  "port": 9090,
  "data_dir": "./data"
}
```

---

## 🛠️ Fix Common Errors

### Error: malformed go.sum

**Quick Fix:**
```bash
rm -f go.sum
go mod download
go mod tidy
```

**Or use setup script:**
```bash
./setup.sh
```

---

## 🏗️ Build for Different Platforms

### Current Platform (Native)
```bash
make build
```

### ARM64 (Odroid C2)
```bash
make build-arm64
# Output: cute-finance-arm64
```

### x86_64 (Server/PC)
```bash
make build-amd64
# Output: cute-finance-amd64
```

### All Platforms
```bash
make build-all
```

---

## 📦 Installation Methods

### Method 1: Make (Recommended)
```bash
make build
./cute-finance
```

### Method 2: Manual Go Build
```bash
go build -o cute-finance ./cmd/server
./cute-finance
```

### Method 3: Installer Script
```bash
chmod +x install.sh
./install.sh
```

### Method 4: Docker
```bash
docker build -t cutefinance .
docker run -p 8080:8080 -v $(pwd)//app/data cutefinance
```

---

## 🖥️ Deploy to Odroid C2

### 1. Build on Development Machine
```bash
make build-arm64
```

### 2. Copy to Odroid
```bash
scp cute-finance-arm64 odroid@<ip>:~/cute-finance
```

### 3. Run on Odroid
```bash
ssh odroid@<ip>
chmod +x ~/cute-finance
./cute-finance -install
```

---

## 📚 Documentation

- **Full Installation Guide**: [INSTALL.md](INSTALL.md)
- **Troubleshooting**: [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)
- **Odroid Deployment**: [docs/DEPLOYMENT-ODROID.md](docs/DEPLOYMENT-ODROID.md)

---

## 🆘 Need Help?

1. Check [Troubleshooting Guide](docs/TROUBLESHOOTING.md)
2. Run `./setup.sh` to fix dependency issues
3. Use `make help` to see all available commands
4. Open issue on GitHub

---

**Happy coding! 🐾**
