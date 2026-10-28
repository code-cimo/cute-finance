# 🌍 Cross-Platform Deployment Guide

Panduan deployment CuteFinance PWA untuk berbagai platform.

## 📦 Platform yang Didukung

| Platform | Architecture | Binary | Installer | Uninstaller |
|----------|--------------|--------|-----------|-------------|
| **Linux** | ARM64 (Odroid C2) | `cute-finance-linux-arm64` | `install.sh` | `uninstaller-linux.sh` |
| **Linux** | AMD64 (x86_64) | `cute-finance-linux-amd64` | `install.sh` | `uninstaller-linux.sh` |
| **Windows** | AMD64 | `cute-finance-windows-amd64.exe` | `installer-windows.bat` | `uninstaller-windows.bat` |
| **macOS** | ARM64 (Apple Silicon) | `cute-finance-darwin-arm64` | Manual | Manual |
| **macOS** | AMD64 (Intel) | `cute-finance-darwin-amd64` | Manual | Manual |

---

## 🚀 Quick Build (All Platforms)

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

---

## 🐧 Linux Deployment

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

# Atau jalankan manual
chmod +x cute-finance
./cute-finance -install
```

### Linux x86_64 (Server/PC)

```bash
# Build
GOOS=linux GOARCH=amd64 CGO_ENABLED=0 go build \
  -ldflags="-w -s" \
  -o cute-finance-linux-amd64 ./cmd/server

# Install
chmod +x cute-finance-linux-amd64
./cute-finance-linux-amd64 -install
```

### Uninstall (Linux)

```bash
chmod +x uninstaller-linux.sh
./uninstaller-linux.sh
```

---

## 🪟 Windows Deployment

### Windows Home/Pro (AMD64)

**Option 1: Automated Installer**

1. Copy files ke Windows:
   - `cute-finance-windows-amd64.exe`
   - `installer-windows.bat`
   - `uninstaller-windows.bat`

2. Double-click `installer-windows.bat`

3. Ikuti prompt:
   - Set port (default: 8080)
   - Set data directory
   - Create Windows service (optional)
   - Create desktop shortcut (optional)

**Option 2: Manual Installation**

```cmd
:: Build di Windows (jika ada Go)
go build -ldflags="-w -s" -o cute-finance.exe ./cmd/server

:: Jalankan installer
installer-windows.bat

:: Atau jalankan manual
cute-finance.exe -install
```

### Run as Windows Service

```cmd
:: Create service
sc create CuteFinance binPath= "C:\path\to\cute-finance.exe -port 8080" start= auto

:: Start service
net start CuteFinance

:: Stop service
net stop CuteFinance

:: Delete service
sc delete CuteFinance
```

### Run at Startup (Task Scheduler)

1. Open Task Scheduler
2. Create Basic Task
3. Trigger: "When the computer starts"
4. Action: "Start a program"
5. Program: `C:\path\to\cute-finance.exe`
6. Arguments: `-port 8080`

### Uninstall (Windows)

1. Double-click `uninstaller-windows.bat`
2. Follow prompts
3. Choose to delete data or preserve

---

## 🍎 macOS Deployment

### macOS ARM64 (Apple Silicon - M1/M2/M3)

```bash
# Build
GOOS=darwin GOARCH=arm64 CGO_ENABLED=0 go build \
  -ldflags="-w -s" \
  -o cute-finance-darwin-arm64 ./cmd/server

# Run
chmod +x cute-finance-darwin-arm64
./cute-finance-darwin-arm64 -install
```

### macOS AMD64 (Intel)

```bash
# Build
GOOS=darwin GOARCH=amd64 CGO_ENABLED=0 go build \
  -ldflags="-w -s" \
  -o cute-finance-darwin-amd64 ./cmd/server

# Run
chmod +x cute-finance-darwin-amd64
./cute-finance-darwin-amd64 -install
```

### Run as LaunchDaemon (macOS)

Create `/Library/LaunchDaemons/com.cutefinance.plist`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.cutefinance</string>
    <key>ProgramArguments</key>
    <array>
        <string>/path/to/cute-finance</string>
        <string>-port</string>
        <string>8080</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
</dict>
</plist>
```

Load daemon:
```bash
sudo launchctl load /Library/LaunchDaemons/com.cutefinance.plist
```

---

## 🐳 Docker Deployment (All Platforms)

### Build Image

```bash
docker build -t cutefinance:latest .
```

### Run Container

```bash
docker run -d \
  --name cutefinance \
  -p 8080:8080 \
  -v $(pwd)//app/data \
  --restart unless-stopped \
  cutefinance:latest
```

### Docker Compose

```yaml
version: '3.8'
services:
  cutefinance:
    build: .
    ports:
      - "8080:8080"
    volumes:
      - .//app/data
    restart: unless-stopped
```

```bash
docker-compose up -d
```

---

## 📋 Distribution Package

### Windows Package

Create folder:
```
CuteFinance-Windows/
├── cute-finance-windows-amd64.exe
├── installer-windows.bat
├── uninstaller-windows.bat
├── README.md
└── LICENSE
```

Zip and distribute:
```bash
zip -r CuteFinance-Windows.zip CuteFinance-Windows/
```

### Linux Package

Create folder:
```
CuteFinance-Linux/
├── cute-finance-linux-amd64    # or arm64
├── install.sh
├── uninstaller-linux.sh
├── README.md
└── LICENSE
```

Tar and distribute:
```bash
tar -czf CuteFinance-Linux.tar.gz CuteFinance-Linux/
```

---

## 🔧 Platform-Specific Notes

### Windows Home

**Limitations:**
- No IIS (use built-in HTTP server)
- No domain join
- Limited service management

**Workarounds:**
- Use Windows Service (sc create)
- Use Task Scheduler for auto-start
- Use Windows Firewall for port management

**Firewall:**
```cmd
:: Allow port
netsh advfirewall firewall add rule name="CuteFinance" dir=in action=allow protocol=TCP localport=8080
```

### Odroid C2 (ARM64)

**Optimization:**
- Enable swap (2GB RAM limited)
- Monitor temperature
- Use eMMC instead of SD card

**Swap:**
```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### Raspberry Pi

Similar to Odroid C2 (ARM64):
```bash
# Use same ARM64 binary
./cute-finance-linux-arm64 -install
```

---

## 🌐 Network Configuration

### Access from LAN

**Linux:**
```bash
# UFW
sudo ufw allow 8080/tcp

# Firewalld
sudo firewall-cmd --permanent --add-port=8080/tcp
sudo firewall-cmd --reload
```

**Windows:**
```cmd
netsh advfirewall firewall add rule name="CuteFinance" dir=in action=allow protocol=TCP localport=8080
```

### Access via Tailscale

```bash
# Install Tailscale
curl -fsSL https://tailscale.com/install.sh | sh

# Start
sudo tailscale up

# Access via Tailscale IP
http://<tailscale-ip>:8080
```

---

## 🔄 Update Procedure

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

---

## 🐛 Troubleshooting

### Binary won't run

**Linux:**
```bash
# Check architecture
file cute-finance

# Fix permissions
chmod +x cute-finance

# Check dependencies
ldd cute-finance
```

**Windows:**
```cmd
:: Check if blocked
Right-click > Properties > Unblock

:: Run as administrator
```

### Port already in use

**Linux:**
```bash
sudo lsof -i :8080
sudo kill -9 <PID>
```

**Windows:**
```cmd
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

### Service won't start

**Linux:**
```bash
sudo journalctl -u cutefinance -n 50
```

**Windows:**
```cmd
eventvwr.msc
:: Check Windows Logs > Application
```

---

## 📞 Support

- **Documentation**: README.md, INSTALL.md
- **Issues**: GitHub Issues
- **Email**: support@cutefinance.app

---

**Happy deploying! 🚀**
