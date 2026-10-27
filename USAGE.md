# 🎯 Complete Usage Guide

## 📖 Table of Contents
1. [Initial Setup](#initial-setup)
2. [Building the Application](#building-the-application)
3. [Running the Application](#running-the-application)
4. [Using the TUI Installer](#using-the-tui-installer)
5. [Web Interface](#web-interface)
6. [Deployment](#deployment)
7. [Maintenance](#maintenance)

---

## 🚀 Initial Setup

### Step 1: Clone Repository
```bash
git clone https://github.com/yourusername/cutefinance-pwa.git
cd cutefinance-pwa
```

### Step 2: Setup Dependencies
```bash
# Jalankan setup script
chmod +x setup.sh
./setup.sh
```

**What this does:**
- ✅ Check Go installation
- ✅ Remove invalid go.sum (if exists)
- ✅ Download all dependencies
- ✅ Generate correct go.sum
- ✅ Verify modules

### Step 3: Verify Setup
```bash
# Check dependencies
go mod verify

# Should output: all modules verified
```

---

## 🏗️ Building the Application

### Build for Current Platform
```bash
make build
# Output: cute-finance
```

### Build for ARM64 (Odroid C2)
```bash
make build-arm64
# Output: cute-finance-arm64
```

### Build for x86_64 (Server/PC)
```bash
make build-amd64
# Output: cute-finance-amd64
```

### Build for All Platforms
```bash
make build-all
# Output: cute-finance, cute-finance-arm64, cute-finance-amd64
```

### Manual Build (Alternative)
```bash
# Native
go build -ldflags="-w -s" -o cute-finance ./cmd/server

# ARM64
GOOS=linux GOARCH=arm64 CGO_ENABLED=0 go build \
  -ldflags="-w -s" \
  -o cute-finance-arm64 ./cmd/server

# x86_64
GOOS=linux GOARCH=amd64 CGO_ENABLED=0 go build \
  -ldflags="-w -s" \
  -o cute-finance-amd64 ./cmd/server
```

---

## ▶️ Running the Application

### Basic Run
```bash
./cute-finance
```

### Custom Port
```bash
./cute-finance -port 9090
```

### Custom Data Directory
```bash
./cute-finance -data /path/to/data
```

### Combined Options
```bash
./cute-finance -port 9090 -data /var/lib/cutefinance
```

### Run with TUI Installer
```bash
./cute-finance -install
```

### Check Version
```bash
./cute-finance -version
```

---

## 🖥️ Using the TUI Installer

### Launch Installer
```bash
./cute-finance -install
```

### Installer Steps

**Step 1: Custom Port**
```
[1/4] Custom Port Access
Enter port (default: 8080): [press Enter or type custom port]
```

**Step 2: Dependency Check**
```
[2/4] Dependency & Environment Check
✓ Data directory ./data is writable
✓ Tailscale is installed
✓ SQLite (Pure Go driver) - No external dependency needed
```

**Step 3: Mascot Preview**
```
[3/4] UI & Mascot Preview

        ╭━━━━━━━━━━━━━━╮
        ┃  🐾 CAPYBARA ┃
        ╰━━━━━━━━━━━━━━╯
        
   Available Mascots:
   🐼 Panda  🐕 Shiba  🐰 Bunny
   🦫 Capybara  🐱 Cat
```

**Step 4: Systemd Service**
```
[4/4] Auto-Deploy Configuration
Create systemd service? (y/n): y
Run with sudo? (y/n): y
✓ Systemd service created and enabled
```

### After Installation
```bash
# Start service
sudo systemctl start cutefinance

# Enable on boot
sudo systemctl enable cutefinance

# Check status
sudo systemctl status cutefinance
```

---

## 🌐 Web Interface

### Access the Application
```
http://localhost:8080
```

### First Time Setup

**Step 1: Welcome**
- See cute mascot animation
- Click "Next" to continue

**Step 2: Choose Mascot**
- Select your favorite mascot:
  - 🐼 Panda
  - 🐕 Shiba
  - 🐰 Bunny
  - 🦫 Capybara
  - 🐱 Cat

**Step 3: Currency**
- Select your currency:
  - IDR (Indonesian Rupiah)
  - USD (US Dollar)
  - EUR (Euro)
  - JPY (Japanese Yen)

**Step 4: Payday Date**
- Set your payday date (1-31)
- Use slider or input field

**Step 5: Budget Method**
- Choose budget allocation:
  - 50/30/20 Rule (Needs/Wants/Savings)
  - Zero-Based (Survival/Lifestyle/Future/Charity)
  - Custom (Set your own)

**Step 6: Monthly Income**
- Enter your monthly income
- Click "Let's Go!" to finish

### Dashboard Features

**Balance Card**
- Shows remaining budget
- Progress bar (color-coded)
- Spent vs Budget comparison

**Donut Chart**
- Visual spending breakdown
- Per category allocation
- Interactive legend

**Budget Progress**
- Progress bars per category
- Color-coded status:
  - 🟢 Green: < 70%
  - 🟡 Yellow: 70-90%
  - 🔴 Red: > 90%

**Recent Activity**
- Latest transactions
- Category icons
- Amount and date

**Savings Goal**
- 20% savings target
- Progress tracker
- Achievement badges

### Adding Transactions

**Method 1: FAB Button**
1. Click **+** button (bottom-right)
2. Select Expense or Income
3. Enter amount (or use quick buttons)
4. Choose category
5. Select payment method
6. Add note (optional)
7. Click "Record"

**Method 2: Quick Amount**
- Use preset buttons: 10k, 25k, 50k, 100k, 200k, 500k
- Faster input for common amounts

### Viewing Statistics

**Daily Trend**
- Bar chart (last 7 days)
- Visual spending pattern

**Category Breakdown**
- Detailed spending per category
- Percentage and amount
- Progress bars

**Account Breakdown**
- Spending by payment method
- Cash vs Bank vs E-Wallet

**Budget Health**
- Status indicators
- Compliance tracking
- Warnings for over-budget

### Settings

**Edit Profile**
- Change mascot
- Update currency
- Modify payday date
- Adjust budget method
- Update income

**Data Management**
- Export data (JSON)
- Export transactions (CSV)
- Import data
- Reset all data

---

## 🚀 Deployment

### Deploy to Odroid C2

**1. Build on Development Machine**
```bash
make build-arm64
```

**2. Transfer to Odroid**
```bash
scp cute-finance-arm64 odroid@<ip>:~/cute-finance
```

**3. Setup on Odroid**
```bash
ssh odroid@<ip>
chmod +x ~/cute-finance
./cute-finance -install
```

**4. Access via Tailscale (Optional)**
```bash
# Install Tailscale
curl -fsSL https://tailscale.com/install.sh | sh
sudo tailscale up

# Access via Tailscale IP
http://<tailscale-ip>:8080
```

### Deploy with Docker

**1. Build Image**
```bash
docker build -t cutefinance .
```

**2. Run Container**
```bash
docker run -d \
  --name cutefinance \
  -p 8080:8080 \
  -v $(pwd)//app/data \
  --restart unless-stopped \
  cutefinance
```

**3. Access**
```
http://localhost:8080
```

### Deploy with Systemd

**1. Create Service File**
```bash
sudo tee /etc/systemd/system/cutefinance.service > /dev/null <<EOF
[Unit]
Description=CuteFinance PWA
After=network.target

[Service]
Type=simple
User=$(whoami)
WorkingDirectory=$(pwd)
ExecStart=$(pwd)/cute-finance -port 8080
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF
```

**2. Enable and Start**
```bash
sudo systemctl daemon-reload
sudo systemctl enable cutefinance
sudo systemctl start cutefinance
```

**3. Check Status**
```bash
sudo systemctl status cutefinance
```

---

## 🔧 Maintenance

### Backup Data

**Manual Backup**
```bash
cp data/cutefinance.db data/backup-$(date +%Y%m%d).db
```

**Via API**
```bash
curl http://localhost:8080/api/export > backup.json
```

### Restore Data

**Via API**
```bash
curl -X POST -H "Content-Type: application/json" \
  --data @backup.json \
  http://localhost:8080/api/import
```

### Update Application

**1. Pull Latest Code**
```bash
git pull origin main
```

**2. Rebuild**
```bash
make build
```

**3. Restart Service**
```bash
sudo systemctl restart cutefinance
```

### Monitor Logs

**Systemd Logs**
```bash
sudo journalctl -u cutefinance -f
```

**Direct Output**
```bash
./cute-finance  # Logs to stdout
```

### Performance Tuning

**Database Optimization**
```bash
# Vacuum database
sqlite3 data/cutefinance.db "VACUUM;"

# Check size
ls -lh data/cutefinance.db
```

**Memory Management**
```bash
# Check memory usage
ps aux | grep cute-finance

# Restart if needed
sudo systemctl restart cutefinance
```

---

## 📱 PWA Installation

### Install on Mobile

**1. Open in Browser**
```
http://<your-ip>:8080
```

**2. Add to Home Screen**
- **Android Chrome**: Menu → "Add to Home screen"
- **iOS Safari**: Share → "Add to Home Screen"

**3. Launch as App**
- Icon appears on home screen
- Opens in standalone mode
- Works offline

---

## 🆘 Troubleshooting

### Common Issues

**Error: malformed go.sum**
```bash
./setup.sh
```

**Error: port already in use**
```bash
./cute-finance -port 9090
```

**Error: permission denied**
```bash
chmod +x cute-finance
```

**Error: database locked**
```bash
pkill cute-finance
rm -f data/cutefinance.db-wal data/cutefinance.db-shm
./cute-finance
```

### Get Help

1. Check [TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)
2. Check logs: `sudo journalctl -u cutefinance -f`
3. Open issue on GitHub

---

## 📚 Additional Resources

- **Quick Start**: [QUICKSTART.md](QUICKSTART.md)
- **Installation**: [INSTALL.md](INSTALL.md)
- **Troubleshooting**: [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)
- **Odroid Guide**: [docs/DEPLOYMENT-ODROID.md](docs/DEPLOYMENT-ODROID.md)

---

**Enjoy CuteFinance! 🐾💰**
