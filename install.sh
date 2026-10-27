#!/bin/bash

# CuteFinance PWA Installer Script (Go Version)
# Version: 1.0.0
# Supported: Linux (ARM64/x64), macOS

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# Logging functions
log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Banner
show_banner() {
    echo -e "${CYAN}"
    echo "  ____      _   _   ___                  _ _____ _   _  ___ _____ ____  "
    echo " / ___|__ _| |_| | |_ _|_ __   __ _  ___| | ____| \ | |/ _ \_   _/ ___| "
    echo "| |   / _\`| __| |  | || '_ \ / _\` |/ _ \ |  _| |  \| | | | || | \___ \ "
    echo "| |__| (_| | |_| |  | || | | | (_| |  __/ | |___| |\  | |_| || |  ___) |"
    echo " \____\__,_|\__|_| |___|_| |_|\__, |\___|_|_____|_| \_|\___/ |_| |____/ "
    echo "                               |___/                                     "
    echo -e "${NC}"
    echo -e "${YELLOW}🐾 CuteFinance PWA Installer v1.0.0 (Go Edition)${NC}"
    echo ""
}

# Detect OS
detect_os() {
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        OS="linux"
        if command -v apt-get &> /dev/null; then
            PKG_MANAGER="apt"
        elif command -v yum &> /dev/null; then
            PKG_MANAGER="yum"
        elif command -v dnf &> /dev/null; then
            PKG_MANAGER="dnf"
        else
            log_error "Package manager tidak terdeteksi"
            exit 1
        fi
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        OS="macos"
        PKG_MANAGER="brew"
    else
        log_error "OS tidak didukung: $OSTYPE"
        exit 1
    fi
    
    log_info "OS terdeteksi: $OS ($PKG_MANAGER)"
}

# Check architecture
check_arch() {
    ARCH=$(uname -m)
    log_info "Architecture: $ARCH"
    
    if [[ "$ARCH" == "aarch64" ]] || [[ "$ARCH" == "arm64" ]]; then
        log_success "ARM64 detected - Optimal untuk Odroid C2!"
        TARGET_ARCH="arm64"
    elif [[ "$ARCH" == "x86_64" ]]; then
        TARGET_ARCH="amd64"
    else
        log_warn "Architecture tidak dikenali: $ARCH"
        TARGET_ARCH="amd64"
    fi
}

# Check and install Go
check_go() {
    log_info "Checking Go..."
    
    if command -v go &> /dev/null; then
        GO_VERSION=$(go version | awk '{print $3}' | sed 's/go//')
        GO_MAJOR=$(echo $GO_VERSION | cut -d. -f1)
        GO_MINOR=$(echo $GO_VERSION | cut -d. -f2)
        
        if [ "$GO_MAJOR" -ge 1 ] && [ "$GO_MINOR" -ge 22 ]; then
            log_success "Go $GO_VERSION sudah terinstall"
            return 0
        else
            log_warn "Go versi lama terdeteksi: $GO_VERSION (memerlukan 1.22+)"
        fi
    fi
    
    log_info "Installing Go 1.22..."
    
    if [ "$OS" == "linux" ]; then
        if [ "$PKG_MANAGER" == "apt" ]; then
            sudo apt-get update
            sudo apt-get install -y golang-go
        elif [ "$PKG_MANAGER" == "yum" ] || [ "$PKG_MANAGER" == "dnf" ]; then
            sudo $PKG_MANAGER install -y golang
        fi
    elif [ "$OS" == "macos" ]; then
        brew install go
    fi
    
    log_success "Go $(go version | awk '{print $3}') berhasil diinstall"
}

# Check and install Node.js (for frontend build)
check_nodejs() {
    log_info "Checking Node.js (untuk build frontend)..."
    
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
        if [ "$NODE_VERSION" -ge 18 ]; then
            log_success "Node.js $(node -v) sudah terinstall"
            return 0
        else
            log_warn "Node.js versi lama: $(node -v)"
        fi
    fi
    
    read -p "Install Node.js untuk build frontend? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log_warn "Node.js tidak diinstall - gunakan frontend yang sudah di-build"
        return 1
    fi
    
    log_info "Installing Node.js 20.x..."
    
    if [ "$OS" == "linux" ]; then
        if [ "$PKG_MANAGER" == "apt" ]; then
            curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
            sudo apt-get install -y nodejs
        elif [ "$PKG_MANAGER" == "yum" ] || [ "$PKG_MANAGER" == "dnf" ]; then
            curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
            sudo $PKG_MANAGER install -y nodejs
        fi
    elif [ "$OS" == "macos" ]; then
        brew install node@20
    fi
    
    log_success "Node.js $(node -v) berhasil diinstall"
}

# Build application
build_app() {
    log_info "Building CuteFinance PWA..."
    
    # Download Go dependencies
    log_info "Downloading Go dependencies..."
    go mod download
    
    # Build frontend (if Node.js is available)
    if command -v node &> /dev/null && [ -d "frontend" ]; then
        log_info "Building frontend..."
        cd frontend
        npm install
        npm run build
        cd ..
        
        # Copy dist to root
        if [ -d "frontend/dist" ]; then
            cp -r frontend/dist ./dist
            log_success "Frontend built successfully"
        fi
    else
        log_warn "Frontend tidak di-build (Node.js tidak tersedia atau folder frontend tidak ada)"
        log_info "Pastikan folder dist/ sudah ada atau build frontend secara manual"
    fi
    
    # Build Go binary
    log_info "Building Go binary..."
    if [ "$TARGET_ARCH" == "arm64" ]; then
        GOOS=linux GOARCH=arm64 go build -ldflags="-w -s" -o cute-finance ./cmd/server
    else
        go build -ldflags="-w -s" -o cute-finance ./cmd/server
    fi
    
    log_success "Build complete: ./cute-finance"
}

# Run installer TUI
run_installer() {
    log_info "Running interactive installer..."
    ./cute-finance -install
}

# Setup firewall
setup_firewall() {
    log_info "Configuring firewall..."
    
    if command -v ufw &> /dev/null; then
        sudo ufw allow 8080/tcp
        log_success "Port 8080 dibuka di UFW"
    elif command -v firewall-cmd &> /dev/null; then
        sudo firewall-cmd --permanent --add-port=8080/tcp
        sudo firewall-cmd --reload
        log_success "Port 8080 dibuka di firewalld"
    fi
}

# Setup Tailscale
setup_tailscale() {
    read -p "Install Tailscale untuk secure remote access? (y/n) " -n 1 -r
    echo
    
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        return
    fi
    
    if [ "$OS" == "linux" ]; then
        log_info "Installing Tailscale..."
        curl -fsSL https://tailscale.com/install.sh | sh
        
        log_info "Starting Tailscale..."
        sudo tailscale up
        
        log_success "Tailscale berhasil diinstall"
        log_info "Akses aplikasi via Tailscale IP di port 8080"
    fi
}

# Show completion message
show_completion() {
    echo ""
    echo -e "${GREEN}=========================================${NC}"
    echo -e "${GREEN}  🎉 Instalasi Berhasil! 🎉${NC}"
    echo -e "${GREEN}=========================================${NC}"
    echo ""
    echo -e "${BLUE}Perintah untuk menjalankan:${NC}"
    echo "  ./cute-finance              # Jalankan server"
    echo "  ./cute-finance -install     # Jalankan installer TUI"
    echo "  ./cute-finance -port 9090   # Jalankan di port custom"
    echo ""
    echo -e "${BLUE}Akses aplikasi:${NC}"
    echo "  • Local: http://localhost:8080"
    
    if command -v tailscale &> /dev/null; then
        TAILSCALE_IP=$(tailscale ip -4 2>/dev/null || echo "")
        if [ -n "$TAILSCALE_IP" ]; then
            echo "  • Tailscale: http://$TAILSCALE_IP:8080"
        fi
    fi
    
    echo ""
    echo -e "${YELLOW}📱 Install sebagai PWA:${NC}"
    echo "  1. Buka aplikasi di browser mobile"
    echo "  2. Tap menu browser (⋮ atau ⋯)"
    echo "  3. Pilih 'Add to Home Screen'"
    echo ""
    echo -e "${GREEN}🐾 Selamat menggunakan CuteFinance! 🐾${NC}"
    echo ""
}

# Main installation flow
main() {
    show_banner
    detect_os
    check_arch
    
    echo ""
    log_info "Memulai instalasi..."
    echo ""
    
    # Step 1: Check Go
    check_go
    
    # Step 2: Check Node.js (optional)
    check_nodejs || true
    
    # Step 3: Build application
    build_app
    
    # Step 4: Run installer TUI
    run_installer
    
    # Step 5: Setup firewall (Linux only)
    if [ "$OS" == "linux" ]; then
        setup_firewall
    fi
    
    # Step 6: Setup Tailscale (optional)
    setup_tailscale
    
    # Completion
    show_completion
}

# Run main function
main "$@"
