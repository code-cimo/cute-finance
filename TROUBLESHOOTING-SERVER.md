# 🔧 Troubleshooting: Server Tidak Bisa Diakses

## ❌ Masalah
Server sudah dijalankan tapi tidak bisa diakses di `http://localhost:1234`

## ✅ Solusi Cepat

### Option 1: Gunakan Quick Start Script
```bash
chmod +x start.sh
./start.sh
```

### Option 2: Manual Check & Start

**Step 1: Check apakah server sedang berjalan**
```bash
# Check process
ps aux | grep cute-finance

# Check port
netstat -tuln | grep 1234
# atau
lsof -i :1234
```

**Step 2: Kill process lama (jika ada)**
```bash
# Kill by port
sudo fuser -k 1234/tcp

# atau kill by PID
sudo kill -9 <PID>
```

**Step 3: Check config file**
```bash
cat data/config.json
```

Harusnya seperti ini:
```json
{
  "port": 1234,
  "data_dir": "./data"
}
```

**Step 4: Check frontend**
```bash
ls -la dist/
```

Harusnya ada:
- `index.html`
- `assets/` folder
- `icons/` folder

**Step 5: Start server**
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

**Step 6: Test di browser**
```
http://localhost:1234
```

---

## 🔍 Debug Steps

### 1. Check Log File
```bash
# Lihat log terbaru
ls -t install-*.log | head -1 | xargs cat

# atau
cat install-*.log | tail -100
```

### 2. Check Server Output
Saat menjalankan `./cute-finance`, perhatikan output:

**✅ Output yang benar:**
```
🐾 CuteFinance PWA v1.0.0
📡 Server running on http://localhost:1234
💾 Database: ./data/cutefinance.db
📁 Data directory: ./data
📂 Serving frontend from: ./dist
```

**❌ Output error:**
```
❌ Failed to create data directory: ...
❌ Failed to initialize database: ...
❌ Server failed: listen tcp :1234: bind: address already in use
```

### 3. Test API Endpoint
```bash
# Test health check
curl http://localhost:1234/api/health

# Expected:
# {"status":"ok","version":"1.0.0"}
```

### 4. Check Firewall
```bash
# Check UFW status
sudo ufw status

# Allow port if needed
sudo ufw allow 1234/tcp
```

### 5. Check Browser Console
Buka browser → F12 → Console tab
Lihat apakah ada error JavaScript

---

## 🛠️ Common Issues & Solutions

### Issue 1: Port Already in Use
**Error:** `bind: address already in use`

**Solution:**
```bash
# Find process using port
sudo lsof -i :1234

# Kill process
sudo kill -9 <PID>

# atau
sudo fuser -k 1234/tcp
```

### Issue 2: Frontend Not Found
**Error:** Server jalan tapi halaman blank

**Solution:**
```bash
# Rebuild frontend
npm run build

# Verify
ls -la dist/index.html

# Restart server
./cute-finance
```

### Issue 3: Config Not Loaded
**Error:** Server jalan di port 8080 bukan 1234

**Solution:**
```bash
# Check config
cat data/config.json

# If wrong, edit
nano data/config.json

# Atau override via flag
./cute-finance -port 1234
```

### Issue 4: Database Error
**Error:** `Failed to initialize database`

**Solution:**
```bash
# Check permissions
ls -la data/

# Fix permissions
chmod 755 data/
chmod 644 data/cutefinance.db

# Atau delete dan recreate
rm data/cutefinance.db
./cute-finance
```

### Issue 5: Browser Cache
**Error:** Halaman lama masih muncul

**Solution:**
```bash
# Hard refresh
Ctrl + Shift + R (Chrome/Firefox)
Cmd + Shift + R (Safari)

# Atau clear cache
# Chrome: F12 → Application → Clear storage
```

---

## 📊 Diagnostic Commands

Jalankan semua command ini untuk diagnostic:

```bash
echo "=== Binary ==="
ls -lh cute-finance

echo -e "\n=== Config ==="
cat data/config.json

echo -e "\n=== Frontend ==="
ls -la dist/

echo -e "\n=== Database ==="
ls -lh data/

echo -e "\n=== Port Check ==="
netstat -tuln | grep 1234 || echo "Port 1234 not in use"

echo -e "\n=== Process Check ==="
ps aux | grep cute-finance | grep -v grep

echo -e "\n=== Test API ==="
curl -s http://localhost:1234/api/health || echo "API not accessible"
```

---

## 🚀 Quick Fix Script

Buat file `fix-all.sh`:

```bash
#!/bin/bash

echo "🔧 Fixing all issues..."

# 1. Kill existing process
echo "1. Killing existing process..."
sudo fuser -k 1234/tcp 2>/dev/null || true

# 2. Check and create config
echo "2. Checking config..."
if [ ! -f "data/config.json" ]; then
    mkdir -p data
    cat > data/config.json << 'EOF'
{
  "port": 1234,
  "data_dir": "./data"
}
EOF
fi

# 3. Rebuild frontend
echo "3. Rebuilding frontend..."
npm run build

# 4. Rebuild Go
echo "4. Rebuilding Go..."
go build -ldflags="-w -s" -o cute-finance ./cmd/server

# 5. Start server
echo "5. Starting server..."
./cute-finance
```

Jalankan:
```bash
chmod +x fix-all.sh
./fix-all.sh
```

---

## 📞 Still Not Working?

### Step 1: Collect Debug Info
```bash
# Run debug script
chmod +x debug.sh
./debug.sh
```

### Step 2: Check Logs
```bash
# View latest log
ls -t install-*.log | head -1 | xargs less
```

### Step 3: Test Manually
```bash
# Start with verbose output
./cute-finance 2>&1 | tee server.log

# In another terminal, test
curl -v http://localhost:1234/api/health
```

### Step 4: Send for Analysis
```bash
# Create debug package
tar -czf debug-$(date +%Y%m%d-%H%M%S).tar.gz \
  data/config.json \
  server.log \
  install-*.log \
  dist/index.html

# Send file for analysis
```

---

## ✅ Verification Checklist

Setelah fix, verify:

- [ ] Binary exists: `ls -lh cute-finance`
- [ ] Config correct: `cat data/config.json`
- [ ] Frontend built: `ls -la dist/`
- [ ] Port available: `netstat -tuln | grep 1234`
- [ ] Server running: `ps aux | grep cute-finance`
- [ ] API accessible: `curl http://localhost:1234/api/health`
- [ ] Browser works: Open `http://localhost:1234`

---

## 🎯 Expected Result

Setelah semua fix, Anda seharusnya bisa:

1. **Akses browser:** `http://localhost:1234`
2. **Lihat setup wizard:** Pilih mascot, currency, dll
3. **Mulai tracking:** Tambah transaksi pertama
4. **Lihat dashboard:** Balance, charts, statistics

---

**Status: Ready to Fix** 🔧

Jika masih ada masalah, jalankan `./debug.sh` dan kirim output untuk analisis.
