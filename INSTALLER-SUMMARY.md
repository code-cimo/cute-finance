# 🎉 Cross-Platform Installer & Uninstaller - Complete!

## ✅ Files yang Dibuat

### Windows
| File | Status | Deskripsi |
|------|--------|-----------|
| `installer-windows.bat` | ✅ | Installer otomatis dengan TUI-like prompts |
| `uninstaller-windows.bat` | ✅ | Uninstaller lengkap dengan konfirmasi |
| `cute-finance-windows-amd64.exe` | ✅ | Binary untuk Windows 64-bit |

### Linux
| File | Status | Deskripsi |
|------|--------|-----------|
| `install.sh` | ✅ | Installer dengan TUI (sudah ada) |
| `uninstaller-linux.sh` | ✅ | Uninstaller lengkap dengan konfirmasi |
| `cute-finance-linux-arm64` | ✅ | Binary untuk ARM64 (Odroid C2) |
| `cute-finance-linux-amd64` | ✅ | Binary untuk x86_64 |

### macOS
| File | Status | Deskripsi |
|------|--------|-----------|
| `cute-finance-darwin-arm64` | ✅ | Binary untuk Apple Silicon |
| `cute-finance-darwin-amd64` | ✅ | Binary untuk Intel Mac |

### Build & Documentation
| File | Status | Deskripsi |
|------|--------|-----------|
| `build-all-platforms.sh` | ✅ | Script untuk build semua platform |
| `docs/CROSS-PLATFORM.md` | ✅ | Dokumentasi cross-platform lengkap |
| `CROSS-PLATFORM-INSTALL.md` | ✅ | Panduan instalasi cross-platform |

---

## 🚀 Cara Menggunakan

### 1. Build Semua Platform

```bash
chmod +x build-all-platforms.sh
./build-all-platforms.sh
```

Output:
```
✅ cute-finance                      # Current platform
✅ cute-finance-linux-arm64          # Odroid C2, Raspberry Pi
✅ cute-finance-linux-amd64          # Linux x86_64
✅ cute-finance-windows-amd64.exe    # Windows
✅ cute-finance-darwin-arm64         # macOS Apple Silicon
✅ cute-finance-darwin-amd64         # macOS Intel
```

### 2. Distribusi

**Windows Package:**
```
CuteFinance-Windows/
├── cute-finance-windows-amd64.exe
├── installer-windows.bat
├── uninstaller-windows.bat
└── README.md
```

**Linux Package:**
```
CuteFinance-Linux/
├── cute-finance-linux-arm64 (atau amd64)
├── install.sh
├── uninstaller-linux.sh
└── README.md
```

---

## 🪟 Windows Installation

### Step 1: Copy Files
Copy ke Windows machine:
- `cute-finance-windows-amd64.exe`
- `installer-windows.bat`
- `uninstaller-windows.bat`

### Step 2: Run Installer
**Double-click** `installer-windows.bat`

Installer akan:
- ✅ Check Go & Node.js
- ✅ Tanya port (default: 8080)
- ✅ Tanya data directory
- ✅ Build frontend
- ✅ Build binary
- ✅ Save config
- ✅ Create Windows service (optional)
- ✅ Create desktop shortcut (optional)
- ✅ Add to PATH (optional)

### Step 3: Access
Buka browser: `http://localhost:<port>`

### Uninstall
**Double-click** `uninstaller-windows.bat`

Uninstaller akan:
- ✅ Stop server
- ✅ Delete Windows service
- ✅ Remove desktop shortcut
- ✅ Remove from PATH
- ✅ Delete binary
- ✅ Delete data (optional)
- ✅ Delete node_modules (optional)

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
chmod +x install.sh
./install.sh
```

### Uninstall

```bash
chmod +x uninstaller-linux.sh
./uninstaller-linux.sh
```

---

## 📋 Installer Features Comparison

| Feature | Windows | Linux |
|---------|---------|-------|
| **Check Go** | ✅ | ✅ |
| **Check Node.js** | ✅ | ✅ |
| **Configure Port** | ✅ | ✅ (TUI) |
| **Configure Data Dir** | ✅ | ✅ (TUI) |
| **Build Frontend** | ✅ | ✅ |
| **Build Binary** | ✅ | ✅ |
| **Save Config** | ✅ | ✅ |
| **Create Service** | ✅ Windows Service | ✅ Systemd |
| **Create Shortcut** | ✅ Desktop | ❌ |
| **Add to PATH** | ✅ | ❌ |
| **Setup Firewall** | ❌ | ✅ |
| **Setup Tailscale** | ❌ | ✅ |
| **TUI Interface** | ⚠️ Batch prompts | ✅ Full TUI |

---

## 📋 Uninstaller Features Comparison

| Feature | Windows | Linux |
|---------|---------|-------|
| **Stop Server** | ✅ | ✅ |
| **Remove Service** | ✅ Windows Service | ✅ Systemd |
| **Remove Shortcut** | ✅ Desktop | ❌ |
| **Remove from PATH** | ✅ | ❌ |
| **Delete Binary** | ✅ | ✅ |
| **Delete Data** | ✅ (optional) | ✅ (optional) |
| **Delete node_modules** | ✅ (optional) | ✅ (optional) |
| **Confirmation** | ✅ | ✅ |
| **Warning** | ✅ | ✅ |

---

## 🎯 Platform Support Matrix

| Platform | Architecture | Installer | Uninstaller | Service | Auto-start |
|----------|--------------|-----------|-------------|---------|------------|
| **Windows** | AMD64 | ✅ `.bat` | ✅ `.bat` | ✅ Windows Service | ✅ Task Scheduler |
| **Linux** | ARM64 | ✅ `.sh` (TUI) | ✅ `.sh` | ✅ Systemd | ✅ Systemd |
| **Linux** | AMD64 | ✅ `.sh` (TUI) | ✅ `.sh` | ✅ Systemd | ✅ Systemd |
| **macOS** | ARM64 | ⚠️ Manual | ⚠️ Manual | ⚠️ LaunchDaemon | ⚠️ LaunchDaemon |
| **macOS** | AMD64 | ⚠️ Manual | ⚠️ Manual | ⚠️ LaunchDaemon | ⚠️ LaunchDaemon |

---

## 📦 Distribution Packages

### Windows Package
```bash
# Create package folder
mkdir CuteFinance-Windows
cp cute-finance-windows-amd64.exe CuteFinance-Windows/
cp installer-windows.bat CuteFinance-Windows/
cp uninstaller-windows.bat CuteFinance-Windows/
cp README.md CuteFinance-Windows/

# Zip
zip -r CuteFinance-Windows.zip CuteFinance-Windows/
```

### Linux Package (ARM64)
```bash
# Create package folder
mkdir CuteFinance-Linux-ARM64
cp cute-finance-linux-arm64 CuteFinance-Linux-ARM64/cute-finance
cp install.sh CuteFinance-Linux-ARM64/
cp uninstaller-linux.sh CuteFinance-Linux-ARM64/
cp README.md CuteFinance-Linux-ARM64/

# Tar
tar -czf CuteFinance-Linux-ARM64.tar.gz CuteFinance-Linux-ARM64/
```

### Linux Package (AMD64)
```bash
# Create package folder
mkdir CuteFinance-Linux-AMD64
cp cute-finance-linux-amd64 CuteFinance-Linux-AMD64/cute-finance
cp install.sh CuteFinance-Linux-AMD64/
cp uninstaller-linux.sh CuteFinance-Linux-AMD64/
cp README.md CuteFinance-Linux-AMD64/

# Tar
tar -czf CuteFinance-Linux-AMD64.tar.gz CuteFinance-Linux-AMD64/
```

---

## 🔧 Build Commands

### Build All Platforms
```bash
./build-all-platforms.sh
```

### Build Specific Platform

**Windows:**
```bash
GOOS=windows GOARCH=amd64 CGO_ENABLED=0 go build \
  -ldflags="-w -s" \
  -o cute-finance-windows-amd64.exe ./cmd/server
```

**Linux ARM64:**
```bash
GOOS=linux GOARCH=arm64 CGO_ENABLED=0 go build \
  -ldflags="-w -s" \
  -o cute-finance-linux-arm64 ./cmd/server
```

**Linux AMD64:**
```bash
GOOS=linux GOARCH=amd64 CGO_ENABLED=0 go build \
  -ldflags="-w -s" \
  -o cute-finance-linux-amd64 ./cmd/server
```

**macOS ARM64:**
```bash
GOOS=darwin GOARCH=arm64 CGO_ENABLED=0 go build \
  -ldflags="-w -s" \
  -o cute-finance-darwin-arm64 ./cmd/server
```

**macOS AMD64:**
```bash
GOOS=darwin GOARCH=amd64 CGO_ENABLED=0 go build \
  -ldflags="-w -s" \
  -o cute-finance-darwin-amd64 ./cmd/server
```

---

## 📚 Documentation

- **Main README**: [README.md](README.md)
- **Installation**: [INSTALL.md](INSTALL.md)
- **Cross-Platform**: [CROSS-PLATFORM-INSTALL.md](CROSS-PLATFORM-INSTALL.md)
- **Cross-Platform Details**: [docs/CROSS-PLATFORM.md](docs/CROSS-PLATFORM.md)
- **Usage**: [USAGE.md](USAGE.md)
- **Upgrade Guide**: [UPGRADE-v2.0.md](UPGRADE-v2.0.md)

---

## 🎉 Summary

### ✅ Fitur yang Ditambahkan

1. **Windows Installer** (`installer-windows.bat`)
   - Automated installation
   - Port configuration
   - Windows service creation
   - Desktop shortcut
   - PATH integration

2. **Windows Uninstaller** (`uninstaller-windows.bat`)
   - Complete removal
   - Service cleanup
   - Data deletion (optional)
   - Confirmation dialogs

3. **Linux Uninstaller** (`uninstaller-linux.sh`)
   - Systemd service removal
   - Binary deletion
   - Data deletion (optional)
   - Confirmation dialogs

4. **Cross-Platform Build Script** (`build-all-platforms.sh`)
   - Build untuk semua platform
   - One-command build
   - Platform detection

5. **Documentation**
   - Cross-platform guide
   - Installation guide
   - Troubleshooting

### 🎯 Platform Support

✅ **Windows** (AMD64)
- Installer: `installer-windows.bat`
- Uninstaller: `uninstaller-windows.bat`
- Binary: `cute-finance-windows-amd64.exe`

✅ **Linux** (ARM64 - Odroid C2, Raspberry Pi)
- Installer: `install.sh` (TUI)
- Uninstaller: `uninstaller-linux.sh`
- Binary: `cute-finance-linux-arm64`

✅ **Linux** (AMD64 - x86_64)
- Installer: `install.sh` (TUI)
- Uninstaller: `uninstaller-linux.sh`
- Binary: `cute-finance-linux-amd64`

✅ **macOS** (ARM64 - Apple Silicon)
- Binary: `cute-finance-darwin-arm64`
- Manual install/uninstall

✅ **macOS** (AMD64 - Intel)
- Binary: `cute-finance-darwin-amd64`
- Manual install/uninstall

---

## 🚀 Quick Start

### 1. Build All Platforms
```bash
chmod +x build-all-platforms.sh
./build-all-platforms.sh
```

### 2. Distribute

**Windows:**
```
Copy: cute-finance-windows-amd64.exe + installer-windows.bat + uninstaller-windows.bat
```

**Linux:**
```
Copy: cute-finance-linux-* + install.sh + uninstaller-linux.sh
```

### 3. Install

**Windows:**
```
Double-click: installer-windows.bat
```

**Linux:**
```bash
./install.sh
```

---

**Status: Complete & Ready for Distribution** 🎉

**Version:** 2.0.0
**Platforms:** Windows, Linux (ARM64/AMD64), macOS (ARM64/AMD64)
**Installers:** ✅ Windows (.bat), ✅ Linux (.sh with TUI)
**Uninstallers:** ✅ Windows (.bat), ✅ Linux (.sh)
