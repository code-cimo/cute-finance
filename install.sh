#!/bin/bash

# CuteFinance PWA - Quick Installer with Logging
# Setup aplikasi dengan port custom

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# Log file
LOG_FILE="install-$(date +%Y%m%d-%H%M%S).log"

# Logging functions
log() {
    echo -e "$1" | tee -a "$LOG_FILE"
}

log_error() {
    echo -e "${RED}❌ $1${NC}" | tee -a "$LOG_FILE"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}" | tee -a "$LOG_FILE"
}

log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}" | tee -a "$LOG_FILE"
}

log_warn() {
    echo -e "${YELLOW}⚠️  $1${NC}" | tee -a "$LOG_FILE"
}

# Initialize log
echo "📝 Logging to: $LOG_FILE"
echo "=== CuteFinance PWA Installer Started ===" > "$LOG_FILE"
echo "Timestamp: $(date)" >> "$LOG_FILE"
echo "Working directory: $(pwd)" >> "$LOG_FILE"
echo "User: $(whoami)" >> "$LOG_FILE"
echo "" >> "$LOG_FILE"

# Banner
echo -e "${CYAN}"
echo "  ____      _   _   ___                  _ _____ _   _  ___ _____ ____  "
echo " / ___|__ _| |_| | |_ _|_ __   __ _  ___| | ____| \ | |/ _ \_   _/ ___| "
echo "| |   / _\`| __| |  | || '_ \ / _\` |/ _ \ |  _| |  \| | | | || | \___ \ "
echo "| |__| (_| | |_| |  | || | | | (_| |  __/ | |___| |\  | |_| || |  ___) |"
echo " \____\__,_|\__|_| |___|_| |_|\__, |\___|_|_____|_| \_|\___/ |_| |____/ "
echo "                               |___/                                     "
echo -e "${NC}"
echo -e "${YELLOW}🐾 CuteFinance PWA Quick Installer${NC}"
echo ""

# Step 1: Check Go
log_info "Step 1: Checking Go installation..."
if ! command -v go &> /dev/null; then
    log_error "Go tidak terinstall!"
    log "Download dari: https://go.dev/dl/"
    exit 1
fi

GO_VERSION=$(go version | awk '{print $3}')
log_success "Go version: $GO_VERSION"
log "Go path: $(which go)" >> "$LOG_FILE"
echo ""

# Step 2: Check Node.js (for frontend)
log_info "Step 2: Checking Node.js installation..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    log_success "Node.js version: $NODE_VERSION"
    log "Node path: $(which node)" >> "$LOG_FILE"
else
    log_warn "Node.js tidak terinstall - frontend tidak akan di-build"
    log "Install Node.js dari: https://nodejs.org/" >> "$LOG_FILE"
fi
echo ""

# Step 3: Konfigurasi Port
log_info "Step 3: Konfigurasi Port"
read -p "Masukkan port (default: 8080): " PORT
PORT=${PORT:-8080}

# Validate port
if ! [[ "$PORT" =~ ^[0-9]+$ ]] || [ "$PORT" -lt 1 ] || [ "$PORT" -gt 65535 ]; then
    log_error "Port tidak valid: $PORT"
    exit 1
fi

log_success "Port: $PORT"
echo ""

# Step 4: Data Directory
log_info "Step 4: Data Directory"
read -p "Masukkan data directory (default: ./data): " DATA_DIR
DATA_DIR=${DATA_DIR:-./data}

log_success "Data directory: $DATA_DIR"

# Create data directory
mkdir -p "$DATA_DIR"
log "Created directory: $DATA_DIR" >> "$LOG_FILE"
echo ""

# Step 5: Setup dependencies
log_info "Step 5: Setting up Go dependencies..."
log "Current directory: $(pwd)" >> "$LOG_FILE"
log "Files in directory:" >> "$LOG_FILE"
ls -la >> "$LOG_FILE" 2>&1

# Check if go.mod exists
if [ ! -f "go.mod" ]; then
    log_error "go.mod tidak ditemukan!"
    log "Pastikan Anda menjalankan script dari root directory proyek" >> "$LOG_FILE"
    exit 1
fi

# Remove old go.sum
rm -f go.sum
log "Removed old go.sum" >> "$LOG_FILE"

# Download dependencies
log "Running: go mod download" >> "$LOG_FILE"
if ! go mod download >> "$LOG_FILE" 2>&1; then
    log_warn "Dependency error detected, cleaning cache..."
    log "Running: go clean -modcache" >> "$LOG_FILE"
    go clean -modcache >> "$LOG_FILE" 2>&1
    
    log "Retrying: go mod download" >> "$LOG_FILE"
    if ! go mod download >> "$LOG_FILE" 2>&1; then
        log_error "Gagal download dependencies!"
        log "Check log file untuk detail: $LOG_FILE" >> "$LOG_FILE"
        exit 1
    fi
fi

# Tidy modules
log "Running: go mod tidy" >> "$LOG_FILE"
if ! go mod tidy >> "$LOG_FILE" 2>&1; then
    log_error "Gagal tidy modules!"
    log "Check log file untuk detail: $LOG_FILE" >> "$LOG_FILE"
    exit 1
fi

log_success "Dependencies ready"
echo ""

# Step 6: Build Frontend
log_info "Step 6: Building frontend..."

if command -v npm &> /dev/null; then
    log "Running: npm install" >> "$LOG_FILE"
    if ! npm install >> "$LOG_FILE" 2>&1; then
        log_error "Gagal install npm dependencies!"
        log "Check log file untuk detail: $LOG_FILE" >> "$LOG_FILE"
        exit 1
    fi
    
    log "Running: npm run build" >> "$LOG_FILE"
    if ! npm run build >> "$LOG_FILE" 2>&1; then
        log_error "Gagal build frontend!"
        log "Check log file untuk detail: $LOG_FILE" >> "$LOG_FILE"
        exit 1
    fi
    
    # Verify dist folder
    if [ ! -d "dist" ]; then
        log_error "Folder dist tidak ditemukan setelah build!"
        log "Check log file untuk detail: $LOG_FILE" >> "$LOG_FILE"
        exit 1
    fi
    
    log_success "Frontend built successfully"
    log "Dist folder contents:" >> "$LOG_FILE"
    ls -la dist/ >> "$LOG_FILE" 2>&1
else
    log_warn "npm tidak ditemukan - skip frontend build"
    log "Install Node.js dan jalankan: npm run build" >> "$LOG_FILE"
fi
echo ""

# Step 7: Build Go application
log_info "Step 7: Building Go application..."
log "Running: go build -ldflags=\"-w -s\" -o cute-finance ./cmd/server" >> "$LOG_FILE"

if ! go build -ldflags="-w -s" -o cute-finance ./cmd/server >> "$LOG_FILE" 2>&1; then
    log_error "Gagal build Go application!"
    log "" >> "$LOG_FILE"
    log "=== BUILD ERROR DETAILS ===" >> "$LOG_FILE"
    go build -ldflags="-w -s" -o cute-finance ./cmd/server >> "$LOG_FILE" 2>&1 || true
    log "" >> "$LOG_FILE"
    log "Check log file untuk detail: $LOG_FILE" >> "$LOG_FILE"
    exit 1
fi

# Verify binary
if [ ! -f "cute-finance" ]; then
    log_error "Binary cute-finance tidak ditemukan setelah build!"
    exit 1
fi

log_success "Build complete"
log "Binary size: $(ls -lh cute-finance | awk '{print $5}')" >> "$LOG_FILE"
echo ""

# Step 8: Run installer TUI
log_info "Step 8: Running TUI installer..."
echo ""

# Save port and data_dir to temp file for TUI
echo "$PORT" > /tmp/cutefinance_port
echo "$DATA_DIR" > /tmp/cutefinance_datadir

# Run installer with saved config
./cute-finance -install -data "$DATA_DIR"

# Cleanup temp files
rm -f /tmp/cutefinance_port /tmp/cutefinance_datadir

echo ""
log_success "========================================="
log_success "  ✅ Instalasi Berhasil!"
log_success "========================================="
echo ""
log_info "Cara menjalankan:"
echo "  ./cute-finance"
echo ""
log_info "Akses aplikasi:"
echo "  http://localhost:$PORT"
echo ""
log_info "Log file tersimpan di:"
echo "  $LOG_FILE"
echo ""
log_info "💡 Tips:"
echo "  • Tekan Ctrl+C untuk stop server"
echo "  • Data tersimpan di: $DATA_DIR"
echo "  • Config tersimpan di: $DATA_DIR/config.json"
echo "  • Jika ada error, check: $LOG_FILE"
echo ""
