# 🌍 CuteFinance PWA - Cross-Platform Installation

Panduan instalasi untuk berbagai platform (Windows, Linux, macOS).

## 📦 File Installer & Uninstaller

### Windows
| File | Deskripsi |
|------|-----------|
| `installer-windows.bat` | Installer otomatis untuk Windows |
| `uninstaller-windows.bat` | Uninstaller untuk Windows |
| `cute-finance-windows-amd64.exe` | Binary untuk Windows 64-bit |

### Linux
| File | Deskripsi |
|------|-----------|
| `install.sh` | Installer otomatis untuk Linux (dengan TUI) |
| `uninstaller-linux.sh` | Uninstaller untuk Linux |
| `cute-finance-linux-arm64` | Binary untuk ARM64 (Odroid C2, Raspberry Pi) |
| `cute-finance-linux-amd64` | Binary untuk x86_64 |

### macOS
| File | Deskripsi |
|------|-----------|
| `cute-finance-darwin-arm64` | Binary untuk Apple Silicon (M1/M2/M3) |
| `cute-finance-darwin-amd64` | Binary untuk Intel Mac |

---

## 🚀 Quick Start

### Option 1: Build Semua Platform

```bash
# Build untuk semua platform
chmod +x build-all-platforms.sh
./build-all-platforms.sh
```

Output:
```
cute-finance                      # Current platform
cute-finance-linux-arm64          # Odroid C2, Raspberry Pi
cute-finance-linux-amd64          # Linux x86_64
cute-finance-windows-amd64.exe    # Windows
cute-finance-darwin-arm64         # macOS Apple Silicon
cute-finance-darwin-amd64         # macOS Intel
```

### Option 2: Download Pre-built Binary

Download dari releases page (jika ada) atau build manual.

---

## 🪟 Windows Installation

### Step 1: Copy Files

Copy ke Windows machine:
- `cute-finance-windows-amd64.exe`
- `installer-windows.bat`
- `uninstaller-windows.bat`

### Step 2: Run Installer

**Method 1: Double-click**
1. Double-click `installer-windows.bat`
2. Follow prompts

**Method 2: Command Prompt**
```cmd
installer-windows.bat
```

### Step 3: Configuration

Installer akan tanya:
- Port (default: 8080)
- Data directory (default: `.\data`)
- Create Windows service? (y/n)
- Create desktop shortcut? (y/n)
- Add to PATH? (y/n)

### Step 4: Access

Buka browser: `http://localhost:<port>`

### Uninstall

```cmd
uninstaller-windows.bat
```

---

## 🐧 Linux Installation

### Odroid C2 (ARM64)

**Di Development Machine:**
```bash
# Build untuk ARM64
GOOS=linux GOARCH=arm64 CGO_ENABLED=0 go build \
  -ldflags="-w -s" \
  -o cute-finance-linux-arm64 ./cmd/server

# Copy ke Odroid
scp cute-finance-linux-arm64 odroid@<ip>:~/cute-finance
scp install.sh uninstaller-linux.sh odroid@<ip>:~/
```

**Di Odroid C2:**
```bash
# SSH ke Odroid
ssh odroid@<ip>

# Jalankan installer
chmod +x install.sh
./install.sh
```

### Linux x86_64

```bash
# Build
GOOS=linux GOARCH=amd64 CGO_ENABLED=0 go build \
  -ldflags="-w -s" \
  -o cute-finance-linux-amd64 ./cmd/server

# Install
chmod +x cute-finance-linux-amd64
./cute-finance-linux-amd64 -install
```

### Uninstall

```bash
chmod +x uninstaller-linux.sh
./uninstaller-linux.sh
```

---

## 🍎 macOS Installation

### Apple Silicon (M1/M2/M3)

```bash
# Build
GOOS=darwin GOARCH=arm64 CGO_ENABLED=0 go build \
  -ldflags="-w -s" \
  -o cute-finance-darwin-arm64 ./cmd/server

# Run
chmod +x cute-finance-darwin-arm64
./cute-finance-darwin-arm64 -install
```

### Intel Mac

```bash
# Build
GOOS=darwin GOARCH=amd64 CGO_ENABLED=0 go build \
  -ldflags="-w -s" \
  -o cute-finance-darwin-amd64 ./cmd/server

# Run
chmod +x cute-finance-darwin-amd64
./cute-finance-darwin-amd64 -install
```

---

## 📋 Installer Features

### Windows Installer (`installer-windows.bat`)

✅ Check Go installation
✅ Check Node.js installation
✅ Configure port
✅ Configure data directory
✅ Build frontend (if Node.js available)
✅ Build Go binary
✅ Save configuration
✅ Create Windows service (optional)
✅ Create desktop shortcut (optional)
✅ Add to PATH (optional)

### Linux Installer (`install.sh`)

✅ Check Go installation
✅ Check Node.js installation
✅ Configure port (TUI)
✅ Configure data directory (TUI)
✅ Build frontend (if Node.js available)
✅ Build Go binary
✅ Run TUI installer
✅ Save configuration
✅ Setup firewall (optional)
✅ Setup Tailscale (optional)

---

## 📋 Uninstaller Features

### Windows Uninstaller (`uninstaller-windows.bat`)

✅ Stop server
✅ Delete Windows service
✅ Remove desktop shortcut
✅ Remove from PATH
✅ Delete binary
✅ Delete data (optional)
✅ Delete node_modules (optional)

### Linux Uninstaller (`uninstaller-linux.sh`)

✅ Stop server
✅ Remove systemd service
✅ Delete binary
✅ Delete data (optional)
✅ Delete node_modules (optional)

---

## 🔧 Manual Installation

### Windows (Manual)

```cmd
:: Build
go build -ldflags="-w -s" -o cute-finance.exe ./cmd/server

:: Run installer
cute-finance.exe -install

:: Or run directly
cute-finance.exe -port 8080
```

### Linux (Manual)

```bash
# Build
go build -ldflags="-w -s" -o cute-finance ./cmd/server

# Run installer
./cute-finance -install

# Or run directly
./cute-finance -port 8080
```

---

## 🐳 Docker Installation

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
```

---

## 📊 Platform Comparison

| Feature | Windows | Linux | macOS |
|---------|---------|-------|-------|
| **Installer** | ✅ Batch script | ✅ Shell script (TUI) | ⚠️ Manual |
| **Uninstaller** | ✅ Batch script | ✅ Shell script | ⚠️ Manual |
| **Service** | ✅ Windows Service | ✅ Systemd | ⚠️ LaunchDaemon |
| **Auto-start** | ✅ Task Scheduler | ✅ Systemd | ⚠️ LaunchDaemon |
| **Firewall** | ✅ Windows Firewall | ✅ UFW/Firewalld | ⚠️ pf |
| **TUI Installer** | ⚠️ Batch (limited) | ✅ Full TUI | ⚠️ Manual |

---

## 🌐 Network Configuration

### Windows Firewall

```cmd
:: Allow port
netsh advfirewall firewall add rule name="CuteFinance" dir=in action=allow protocol=TCP localport=8080
```

### Linux Firewall

```bash
# UFW
sudo ufw allow 8080/tcp

# Firewalld
sudo firewall-cmd --permanent --add-port=8080/tcp
sudo firewall-cmd --reload
```

### macOS Firewall

```bash
# Allow through System Preferences
# Or use pf
echo "pass in proto tcp from any to any port 8080" | sudo pfctl -ef -
```

---

## 🔄 Update Procedure

### Windows

```cmd
:: Stop service
net stop CuteFinance

:: Backup data
xcopy data data-backup /E /I

:: Replace binary
copy /Y cute-finance-windows-amd64.exe cute-finance.exe

:: Restart
net start CuteFinance
```

### Linux

```bash
# Stop service
sudo systemctl stop cutefinance

# Backup data
cp -r data data-backup-$(date +%Y%m%d)

# Replace binary
sudo cp cute-finance-linux-arm64 /usr/local/bin/cute-finance

# Restart
sudo systemctl start cutefinance
```

---

## 🐛 Troubleshooting

### Windows: Binary blocked by SmartScreen

**Solution:**
1. Right-click `cute-finance-windows-amd64.exe`
2. Properties
3. Check "Unblock"
4. Apply

### Linux: Permission denied

```bash
chmod +x cute-finance
chmod +x install.sh
chmod +x uninstaller-linux.sh
```

### Port already in use

**Windows:**
```cmd
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

**Linux:**
```bash
sudo lsof -i :8080
sudo kill -9 <PID>
```

### Service won't start

**Windows:**
```cmd
eventvwr.msc
:: Check Windows Logs > Application
```

**Linux:**
```bash
sudo journalctl -u cutefinance -n 50
```

---

## 📚 Documentation

- **Main README**: [README.md](README.md)
- **Installation**: [INSTALL.md](INSTALL.md)
- **Cross-Platform**: [docs/CROSS-PLATFORM.md](docs/CROSS-PLATFORM.md)
- **Usage**: [USAGE.md](USAGE.md)
- **Troubleshooting**: [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)

---

## 📞 Support

- **Issues**: GitHub Issues
- **Email**: support@cutefinance.app
- **Documentation**: See docs/ folder

---

**Happy deploying! 🚀**

**Version:** 2.0.0
**Platforms:** Windows, Linux (ARM64/AMD64), macOS (ARM64/AMD64)
