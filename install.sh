#!/bin/bash

# CuteFinance PWA - Smart Installer
# Version 2.0.0
# With existing installation detection

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
log() { echo -e "$1" | tee -a "$LOG_FILE"; }
log_error() { echo -e "${RED}❌ $1${NC}" | tee -a "$LOG_FILE"; }
log_success() { echo -e "${GREEN}✅ $1${NC}" | tee -a "$LOG_FILE"; }
log_info() { echo -e "${BLUE}ℹ️  $1${NC}" | tee -a "$LOG_FILE"; }
log_warn() { echo -e "${YELLOW}⚠️  $1${NC}" | tee -a "$LOG_FILE"; }

# Initialize log
echo "📝 Logging to: $LOG_FILE"
echo "=== CuteFinance PWA Installer Started ===" > "$LOG_FILE"
echo "Timestamp: $(date)" >> "$LOG_FILE"
echo "Working directory: $(pwd)" >> "$LOG_FILE"
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
echo -e "${YELLOW}🐾 CuteFinance PWA Smart Installer v2.0.0${NC}"
echo ""

# ============================================
# STEP 0: Check Existing Installation
# ============================================
log_info "Checking for existing installation..."

EXISTING_BINARY=false
EXISTING_SERVICE=false
EXISTING_DATA=false
EXISTING_CONFIG=false

# Check binary
if [ -f "cute-finance" ]; then
    EXISTING_BINARY=true
    log_warn "Existing binary found: cute-finance"
fi

# Check systemd service
if systemctl is-active --quiet cutefinance 2>/dev/null; then
    EXISTING_SERVICE=true
    log_warn "Active service found: cutefinance"
elif [ -f "/etc/systemd/system/cutefinance.service" ]; then
    EXISTING_SERVICE=true
    log_warn "Service file found: /etc/systemd/system/cutefinance.service"
fi

# Check data directory
if [ -d "data" ]; then
    EXISTING_DATA=true
    log_warn "Existing data directory found: ./data"
fi

# Check config
if [ -f "data/config.json" ]; then
    EXISTING_CONFIG=true
    log_warn "Existing config found: data/config.json"
fi

# If existing installation detected
if [ "$EXISTING_BINARY" = true ] || [ "$EXISTING_SERVICE" = true ] || [ "$EXISTING_DATA" = true ]; then
    echo ""
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${YELLOW}  ⚠️  EXISTING INSTALLATION DETECTED${NC}"
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo "Found:"
    [ "$EXISTING_BINARY" = true ] && echo "  • Binary: cute-finance"
    [ "$EXISTING_SERVICE" = true ] && echo "  • Service: cutefinance (systemd)"
    [ "$EXISTING_DATA" = true ] && echo "  • Data: ./data/"
    [ "$EXISTING_CONFIG" = true ] && echo "  • Config: data/config.json"
    echo ""
    echo -e "${BLUE}What would you like to do?${NC}"
    echo ""
    echo "  1) 🔄 Update/Upgrade (keep data & config, replace binary)"
    echo "  2) 🔁 Reinstall (keep data, reset config & binary)"
    echo "  3) 🗑️  Fresh Install (delete everything & start fresh)"
    echo "  4) ❌ Cancel installation"
    echo ""
    read -p "Choose option (1-4): " INSTALL_CHOICE
    
    case $INSTALL_CHOICE in
        1)
            echo ""
            log_info "Mode: UPDATE/UPGRADE"
            log_info "Keeping data and config, replacing binary only..."
            UPDATE_MODE="upgrade"
            ;;
        2)
            echo ""
            log_info "Mode: REINSTALL"
            log_info "Keeping data, resetting config and binary..."
            UPDATE_MODE="reinstall"
            ;;
        3)
            echo ""
            log_warn "Mode: FRESH INSTALL"
            echo ""
            echo -e "${RED}⚠️  WARNING: This will DELETE all data!${NC}"
            read -p "Are you sure? Type 'YES' to confirm: " CONFIRM_FRESH
            if [ "$CONFIRM_FRESH" != "YES" ]; then
                log_info "Fresh install cancelled."
                exit 0
            fi
            UPDATE_MODE="fresh"
            ;;
        4|*)
            log_info "Installation cancelled."
            exit 0
            ;;
    esac
    echo ""
else
    log_success "No existing installation found. Proceeding with fresh install..."
    UPDATE_MODE="fresh"
    echo ""
fi

# ============================================
# STEP 1: Check Go
# ============================================
log_info "Step 1: Checking Go installation..."
if ! command -v go &> /dev/null; then
    log_error "Go tidak terinstall!"
    log "Download dari: https://go.dev/dl/"
    exit 1
fi

GO_VERSION=$(go version | awk '{print $3}')
log_success "Go version: $GO_VERSION"
echo ""

# ============================================
# STEP 2: Check Node.js (optional)
# ============================================
log_info "Step 2: Checking Node.js installation..."
BUILD_FRONTEND=false
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    log_success "Node.js version: $NODE_VERSION"
    BUILD_FRONTEND=true
else
    log_warn "Node.js tidak terinstall - skip frontend build"
    log "Install Node.js jika ingin build frontend"
fi
echo ""

# ============================================
# STEP 3: Handle Existing Installation
# ============================================
if [ "$UPDATE_MODE" = "fresh" ]; then
    log_info "Step 3: Cleaning up existing installation..."
    
    # Stop service if running
    if [ "$EXISTING_SERVICE" = true ]; then
        log "Stopping existing service..."
        sudo systemctl stop cutefinance 2>/dev/null || true
        sudo systemctl disable cutefinance 2>/dev/null || true
        sudo rm -f /etc/systemd/system/cutefinance.service
        sudo systemctl daemon-reload
        log_success "Service removed"
    fi
    
    # Stop running process
    if pgrep -f "cute-finance" > /dev/null; then
        log "Stopping running process..."
        pkill -f cute-finance || true
        log_success "Process stopped"
    fi
    
    # Delete binary
    if [ "$EXISTING_BINARY" = true ]; then
        rm -f cute-finance
        log_success "Binary removed"
    fi
    
    # Delete data
    if [ "$EXISTING_DATA" = true ]; then
        rm -rf data
        log_success "Data directory removed"
    fi
    
elif [ "$UPDATE_MODE" = "reinstall" ]; then
    log_info "Step 3: Preparing for reinstall..."
    
    # Stop service if running
    if [ "$EXISTING_SERVICE" = true ]; then
        log "Stopping existing service..."
        sudo systemctl stop cutefinance 2>/dev/null || true
        sudo systemctl disable cutefinance 2>/dev/null || true
        sudo rm -f /etc/systemd/system/cutefinance.service
        sudo systemctl daemon-reload
        log_success "Service removed"
    fi
    
    # Stop running process
    if pgrep -f "cute-finance" > /dev/null; then
        log "Stopping running process..."
        pkill -f cute-finance || true
        log_success "Process stopped"
    fi
    
    # Delete binary only
    if [ "$EXISTING_BINARY" = true ]; then
        rm -f cute-finance
        log_success "Binary removed"
    fi
    
    # Delete config only
    if [ "$EXISTING_CONFIG" = true ]; then
        rm -f data/config.json
        log_success "Config removed"
    fi
    
    log "Data preserved: ./data/"
    
elif [ "$UPDATE_MODE" = "upgrade" ]; then
    log_info "Step 3: Preparing for upgrade..."
    
    # Stop service if running
    if [ "$EXISTING_SERVICE" = true ]; then
        log "Stopping existing service..."
        sudo systemctl stop cutefinance 2>/dev/null || true
        log_success "Service stopped"
    fi
    
    # Stop running process
    if pgrep -f "cute-finance" > /dev/null; then
        log "Stopping running process..."
        pkill -f cute-finance || true
        log_success "Process stopped"
    fi
    
    # Delete binary only
    if [ "$EXISTING_BINARY" = true ]; then
        rm -f cute-finance
        log_success "Binary removed"
    fi
    
    log "Data and config preserved"
fi

echo ""

# ============================================
# STEP 4: Configure Port
# ============================================
if [ "$UPDATE_MODE" = "upgrade" ] && [ "$EXISTING_CONFIG" = true ]; then
    # Use existing port
    EXISTING_PORT=$(grep -o '"port": *[0-9]*' data/config.json | grep -o '[0-9]*')
    log_info "Step 4: Using existing port: $EXISTING_PORT"
    PORT=$EXISTING_PORT
    read -p "Change port? (current: $PORT, press Enter to keep): " NEW_PORT
    if [ ! -z "$NEW_PORT" ]; then
        PORT=$NEW_PORT
    fi
else
    log_info "Step 4: Configure Port"
    read -p "Enter port (default: 8080): " PORT
    PORT=${PORT:-8080}
fi

# Validate port
if ! [[ "$PORT" =~ ^[0-9]+$ ]] || [ "$PORT" -lt 1 ] || [ "$PORT" -gt 65535 ]; then
    log_error "Port tidak valid: $PORT"
    exit 1
fi

# Check if port is in use
if netstat -tuln 2>/dev/null | grep -q ":$PORT "; then
    log_warn "Port $PORT sudah digunakan!"
    read -p "Use different port? (y/n): " CHANGE_PORT
    if [[ $CHANGE_PORT =~ ^[Yy]$ ]]; then
        read -p "Enter new port: " PORT
    fi
fi

log_success "Port: $PORT"
echo ""

# ============================================
# STEP 5: Configure Data Directory
# ============================================
if [ "$UPDATE_MODE" = "upgrade" ] && [ "$EXISTING_CONFIG" = true ]; then
    # Use existing data dir
    EXISTING_DATA_DIR=$(grep -o '"data_dir": *"[^"]*"' data/config.json | grep -o '"[^"]*"$' | tr -d '"')
    log_info "Step 5: Using existing data directory: $EXISTING_DATA_DIR"
    DATA_DIR=$EXISTING_DATA_DIR
else
    log_info "Step 5: Data Directory"
    read -p "Enter data directory (default: ./data): " DATA_DIR
    DATA_DIR=${DATA_DIR:-./data}
fi

log_success "Data directory: $DATA_DIR"
mkdir -p "$DATA_DIR"
echo ""

# ============================================
# STEP 6: Setup Dependencies
# ============================================
log_info "Step 6: Setting up dependencies..."

# Clean old go.sum
if [ -f "go.sum" ]; then
    rm -f go.sum
    log "Removed old go.sum"
fi

# Download dependencies
log "Downloading Go dependencies..."
if ! go mod download >> "$LOG_FILE" 2>&1; then
    log_warn "Dependency error, cleaning cache..."
    go clean -modcache >> "$LOG_FILE" 2>&1
    if ! go mod download >> "$LOG_FILE" 2>&1; then
        log_error "Gagal download dependencies!"
        exit 1
    fi
fi

# Tidy modules
log "Tidying modules..."
if ! go mod tidy >> "$LOG_FILE" 2>&1; then
    log_error "Gagal tidy modules!"
    exit 1
fi

log_success "Dependencies ready"
echo ""

# ============================================
# STEP 7: Build Frontend
# ============================================
if [ "$BUILD_FRONTEND" = true ]; then
    log_info "Step 7: Building frontend..."
    
    log "Installing npm dependencies..."
    if ! npm install >> "$LOG_FILE" 2>&1; then
        log_error "Gagal install npm dependencies!"
        exit 1
    fi
    
    log "Building frontend..."
    if ! npm run build >> "$LOG_FILE" 2>&1; then
        log_error "Gagal build frontend!"
        exit 1
    fi
    
    # Verify dist folder
    if [ ! -d "dist" ]; then
        log_error "Folder dist tidak ditemukan!"
        exit 1
    fi
    
    log_success "Frontend built successfully"
    echo ""
else
    log_info "Step 7: Skipping frontend build"
    echo ""
fi

# ============================================
# STEP 8: Build Go Application
# ============================================
log_info "Step 8: Building Go application..."

if ! go build -ldflags="-w -s" -o cute-finance ./cmd/server >> "$LOG_FILE" 2>&1; then
    log_error "Gagal build Go application!"
    log ""
    log "Error details:"
    go build -ldflags="-w -s" -o cute-finance ./cmd/server >> "$LOG_FILE" 2>&1 || true
    exit 1
fi

# Verify binary
if [ ! -f "cute-finance" ]; then
    log_error "Binary cute-finance tidak ditemukan!"
    exit 1
fi

log_success "Build complete"
log "Binary size: $(ls -lh cute-finance | awk '{print $5}')"
echo ""

# ============================================
# STEP 9: Save Configuration
# ============================================
log_info "Step 9: Saving configuration..."

cat > "$DATA_DIR/config.json" << EOF
{
  "port": $PORT,
  "data_dir": "$DATA_DIR"
}
EOF

log_success "Configuration saved to $DATA_DIR/config.json"
echo ""

# ============================================
# STEP 10: Setup Service (Optional)
# ============================================
if [ "$UPDATE_MODE" != "upgrade" ] || [ "$EXISTING_SERVICE" = false ]; then
    log_info "Step 10: Service Setup"
    read -p "Create systemd service? (y/n): " CREATE_SERVICE
    
    if [[ $CREATE_SERVICE =~ ^[Yy]$ ]]; then
        log "Creating systemd service..."
        
        # Get absolute paths
        BINARY_PATH=$(readlink -f cute-finance)
        DATA_PATH=$(readlink -f "$DATA_DIR")
        
        # Create service file
        sudo tee /etc/systemd/system/cutefinance.service > /dev/null << EOF
[Unit]
Description=CuteFinance PWA - Personal Finance Manager
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$(dirname "$BINARY_PATH")
ExecStart=$BINARY_PATH -port $PORT -data $DATA_PATH
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF
        
        # Reload systemd
        sudo systemctl daemon-reload
        
        # Enable service
        sudo systemctl enable cutefinance
        
        log_success "Systemd service created and enabled"
        echo ""
        echo -e "${BLUE}Service commands:${NC}"
        echo "  Start:   sudo systemctl start cutefinance"
        echo "  Stop:    sudo systemctl stop cutefinance"
        echo "  Status:  sudo systemctl status cutefinance"
        echo "  Logs:    sudo journalctl -u cutefinance -f"
    fi
else
    log_info "Step 10: Restarting existing service..."
    sudo systemctl start cutefinance
    log_success "Service restarted"
fi

echo ""

# ============================================
# SUCCESS MESSAGE
# ============================================
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  ✅ Installation Complete!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${BLUE}📝 Installation Mode:${NC} $UPDATE_MODE"
echo ""
echo -e "${BLUE}🚀 How to run:${NC}"
if [ "$EXISTING_SERVICE" = true ] && [ "$UPDATE_MODE" = "upgrade" ]; then
    echo "  Service is already running!"
    echo "  Or manually: ./cute-finance"
else
    echo "  ./cute-finance"
    echo "  Or: sudo systemctl start cutefinance"
fi
echo ""
echo -e "${BLUE}🌐 Access application:${NC}"
echo "  http://localhost:$PORT"
echo ""
echo -e "${BLUE}💡 Tips:${NC}"
echo "  • Press Ctrl+C to stop server"
echo "  • Data saved in: $DATA_DIR"
echo "  • Config saved in: $DATA_DIR/config.json"
echo "  • Log file: $LOG_FILE"
echo "  • To uninstall: ./uninstaller-linux.sh"
echo ""
echo -e "${BLUE}📚 Documentation:${NC}"
echo "  • README.md"
echo "  • INSTALL.md"
echo "  • USAGE.md"
echo ""
