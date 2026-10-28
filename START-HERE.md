# 🚀 Quick Start - Manual Setup

## Status Installation

✅ Frontend: Built successfully
✅ Dependencies: Ready
❌ Go Binary: Need to build
❌ Config: Need to run installer

---

## Step 1: Build Go Binary

```bash
go build -ldflags="-w -s" -o cute-finance ./cmd/server
```

Expected output:
```
✓ Binary created: ./cute-finance
```

---

## Step 2: Run Installer (Set Port)

```bash
./cute-finance -install
```

You will see:
```
🐾 CuteFinance PWA Installer v1.0.0

[1/4] Custom Port Access
Enter port (default: 8080): 1234
✓ Port set to: 1234

[2/4] Dependency & Environment Check
✓ Data directory ./data is writable
✓ SQLite (Pure Go driver) - No external dependency needed

[3/4] UI & Mascot Preview
   🐼 Panda  🐕 Shiba  🐰 Bunny
   🦫 Capybara  🐱 Cat

[4/4] Auto-Deploy Configuration
Create systemd service? (y/n): n

✅ Configuration saved to ./data/config.json
```

---

## Step 3: Run Server

```bash
./cute-finance
```

Expected output:
```
🐾 CuteFinance PWA v1.0.0
📡 Server running on http://localhost:1234
💾 Database: ./data/cutefinance.db
📁 Data directory: ./data
📂 Serving frontend from: ./dist
```

---

## Step 4: Access Application

Open browser: `http://localhost:1234`

You should see the CuteFinance PWA setup wizard!

---

## 🔧 Troubleshooting

### If Go build fails:
```bash
# Clean and rebuild
go clean -modcache
rm -f go.sum
go mod download
go mod tidy
go build -o cute-finance ./cmd/server
```

### If port already in use:
```bash
# Use different port
./cute-finance -port 9090

# Or edit config
nano data/config.json
# Change "port": 1234 to "port": 9090
```

### If frontend not found:
```bash
# Rebuild frontend
npm run build

# Check dist folder exists
ls -la dist/
```

---

## 📝 Alternative: One-Command Setup

If you want to skip the manual steps:

```bash
# Full automated setup
chmod +x install.sh
./install.sh
```

This will:
1. Ask for port
2. Build frontend
3. Build Go binary
4. Run installer
5. Ready to run!

---

## ✅ Verification

After setup, verify:

```bash
# Check binary exists
ls -lh cute-finance

# Check config
cat data/config.json

# Check database
ls -lh data/cutefinance.db

# Check frontend
ls -lh dist/
```

---

## 🎯 Next Steps

1. ✅ Build Go binary
2. ✅ Run installer
3. ✅ Start server
4. ✅ Access http://localhost:1234
5. ✅ Complete setup wizard in browser
6. ✅ Start tracking finances! 🐾💰

---

**Happy tracking! 🐾**
