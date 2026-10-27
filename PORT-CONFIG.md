# 🎯 Cara Set Port Custom

## Quick Answer

```bash
# Method 1: Via Installer (Recommended)
./cute-finance -install
# Enter port when prompted (e.g., 9090)
# Port saved to data/config.json

# Method 2: Via Flag
./cute-finance -port 9090

# Method 3: Edit Config
nano data/config.json
# Change "port": 8080 to "port": 9090
```

---

## Detailed Guide

### Method 1: Via Installer (Recommended)

Jalankan installer dan masukkan port yang diinginkan:

```bash
./cute-finance -install
```

Output:
```
[1/4] Custom Port Access
Enter port (default: 8080): 9090
✓ Port set to: 9090

...

✅ Configuration saved to ./data/config.json
```

Port akan tersimpan di `data/config.json`:
```json
{
  "port": 9090,
  "data_dir": "./data"
}
```

Selanjutnya, setiap kali run server, port 9090 akan dipakai:
```bash
./cute-finance
# Server running on http://localhost:9090
```

### Method 2: Via Command Line Flag

Override port saat run server:

```bash
./cute-finance -port 9090
# Server running on http://localhost:9090
```

**Note:** Flag ini override config file.

### Method 3: Edit Config File

Edit file config secara manual:

```bash
nano data/config.json
```

Ubah port:
```json
{
  "port": 9090,
  "data_dir": "./data"
}
```

Save dan run server:
```bash
./cute-finance
# Server running on http://localhost:9090
```

---

## Port Priority Order

1. **Command line flag** (`-port`) - highest priority
2. **Config file** (`data/config.json`)
3. **Default** (8080) - lowest priority

### Examples

```bash
# Config file: port 9090
# Run with flag: port 8888
./cute-finance -port 8888
# Result: Server runs on port 8888

# Config file: port 9090
# Run without flag
./cute-finance
# Result: Server runs on port 9090

# No config file
# Run without flag
./cute-finance
# Result: Server runs on port 8080 (default)
```

---

## Verify Port Configuration

### Check Config File
```bash
cat data/config.json
```

### Check Running Process
```bash
ps aux | grep cute-finance
```

### Check Listening Port
```bash
sudo netstat -tulpn | grep cute-finance
# or
sudo lsof -i :9090
```

---

## Common Scenarios

### Scenario 1: First Time Setup
```bash
# Run installer
./cute-finance -install
# Enter port: 9090

# Run server
./cute-finance
# Access: http://localhost:9090
```

### Scenario 2: Change Port Later
```bash
# Edit config
nano data/config.json
# Change port to 8888

# Restart server
./cute-finance
# Access: http://localhost:8888
```

### Scenario 3: Temporary Port Change
```bash
# Use different port just once
./cute-finance -port 7777
# Access: http://localhost:7777

# Next run will use config port
./cute-finance
# Access: http://localhost:9090 (from config)
```

### Scenario 4: Multiple Instances
```bash
# Instance 1
./cute-finance -data ./data1 -port 8080

# Instance 2
./cute-finance -data ./data2 -port 8081

# Instance 3
./cute-finance -data ./data3 -port 8082
```

---

## Troubleshooting

### Port Already in Use
```bash
# Check what's using the port
sudo lsof -i :9090

# Kill the process
sudo kill -9 <PID>

# Or use different port
./cute-finance -port 9091
```

### Config Not Loading
```bash
# Check if config exists
ls -la data/config.json

# Check config content
cat data/config.json

# Re-run installer
./cute-finance -install
```

### Wrong Port After Install
```bash
# Check config
cat data/config.json

# If wrong, re-run installer
./cute-finance -install

# Or edit manually
nano data/config.json
```

---

## Summary

| Method | When to Use | Persistence |
|--------|-------------|-------------|
| Installer | First time setup | ✅ Permanent |
| Config file | Change port permanently | ✅ Permanent |
| Command flag | Temporary override | ❌ One-time |

**Recommendation:** Use installer untuk setup awal, edit config untuk perubahan permanent.
