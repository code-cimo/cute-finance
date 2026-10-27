#!/bin/bash

# CuteFinance PWA Installer Script
# Version: 1.0.0
# Supported: Linux (ARM64/x64), macOS

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Banner
show_banner() {
    echo -e "${BLUE}"
    echo "  ____      _   _   ___                  _ _____ _   _  ___ _____ ____  "
    echo " / ___|__ _| |_| | |_ _|_ __   __ _  ___| | ____| \\ | |/ _ \\_   _/ ___| "
    echo "| |   / _\` | __| |  | || '_ \\ / _\` |/ _ \\ |  _| |  \\| | | | || | \\___ \\ "
    echo "| |__| (_| | |_| |  | || | | | (_| |  __/ | |___| |\\  | |_| || |  ___) |"
    echo " \\____\\__,_|\\__|_| |___|_| |_|\\__, |\\___|_|_____|_| \\_|\\___/ |_| |____/ "
    echo "                               |___/                                     "
    echo -e "${NC}"
    echo -e "${YELLOW}🐾 CuteFinance PWA Installer v1.0.0${NC}"
    echo ""
}

# Check if running as root
check_root() {
    if [ "$EUID" -ne 0 ]; then
        log_warn "Script ini tidak dijalankan sebagai root"
        log_info "Beberapa fitur mungkin memerlukan sudo"
        echo ""
        read -p "Lanjutkan tanpa root? (y/n) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            log_error "Installer dibatalkan"
            exit 1
        fi
    fi
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
    fi
}

# Check and install Node.js
check_nodejs() {
    log_info "Checking Node.js..."
    
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
        if [ "$NODE_VERSION" -ge 18 ]; then
            log_success "Node.js $(node -v) sudah terinstall"
            return 0
        else
            log_warn "Node.js versi lama terdeteksi: $(node -v)"
            log_info "Memerlukan Node.js 18+"
        fi
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
        brew link --overwrite node@20
    fi
    
    log_success "Node.js $(node -v) berhasil diinstall"
}

# Check and install npm
check_npm() {
    log_info "Checking npm..."
    
    if command -v npm &> /dev/null; then
        log_success "npm $(npm -v) sudah terinstall"
        return 0
    fi
    
    log_error "npm tidak terdeteksi"
    exit 1
}

# Install dependencies
install_dependencies() {
    log_info "Installing project dependencies..."
    npm install
    
    log_success "Dependencies berhasil diinstall"
}

# Build application
build_app() {
    log_info "Building application..."
    npm run build
    
    log_success "Build berhasil! Output ada di folder dist/"
}

# Setup Nginx
setup_nginx() {
    log_info "Setting up Nginx..."
    
    if [ "$OS" == "linux" ]; then
        if ! command -v nginx &> /dev/null; then
            log_info "Installing Nginx..."
            if [ "$PKG_MANAGER" == "apt" ]; then
                sudo apt-get install -y nginx
            elif [ "$PKG_MANAGER" == "yum" ] || [ "$PKG_MANAGER" == "dnf" ]; then
                sudo $PKG_MANAGER install -y nginx
            fi
        fi
        
        # Create directory
        sudo mkdir -p /var/www/cutefinance
        
        # Copy files
        log_info "Copying build files to /var/www/cutefinance..."
        sudo cp -r dist/* /var/www/cutefinance/
        
        # Create Nginx config
        log_info "Creating Nginx configuration..."
        sudo tee /etc/nginx/sites-available/cutefinance > /dev/null <<'EOF'
server {
    listen 8080;
    server_name _;
    root /var/www/cutefinance;
    index index.html;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Enable gzip
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript image/svg+xml;
}
EOF
        
        # Enable site
        sudo ln -sf /etc/nginx/sites-available/cutefinance /etc/nginx/sites-enabled/
        
        # Test config
        sudo nginx -t
        
        # Reload Nginx
        sudo systemctl reload nginx
        
        log_success "Nginx configured successfully"
        log_info "Akses aplikasi di: http://localhost:8080"
        
    elif [ "$OS" == "macos" ]; then
        log_warn "Nginx setup tidak otomatis di macOS"
        log_info "Gunakan 'npm run dev' untuk development"
    fi
}

# Setup systemd service
setup_systemd() {
    if [ "$OS" != "linux" ]; then
        return
    fi
    
    log_info "Setting up systemd service..."
    
    read -p "Setup systemd service untuk auto-start? (y/n) " -n 1 -r
    echo
    
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        return
    fi
    
    # Create service file
    sudo tee /etc/systemd/system/cutefinance.service > /dev/null <<EOF
[Unit]
Description=CuteFinance PWA
After=network.target

[Service]
Type=simple
User=$(whoami)
WorkingDirectory=/var/www/cutefinance
ExecStart=/usr/bin/python3 -m http.server 8080
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF
    
    # Reload systemd
    sudo systemctl daemon-reload
    
    # Enable service
    sudo systemctl enable cutefinance
    
    # Start service
    sudo systemctl start cutefinance
    
    log_success "Systemd service berhasil di setup"
    log_info "Service status: sudo systemctl status cutefinance"
}

# Setup firewall
setup_firewall() {
    if [ "$OS" != "linux" ]; then
        return
    fi
    
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
    log_info ""
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

# Generate SSL certificate (optional)
setup_ssl() {
    log_info ""
    read -p "Setup SSL certificate dengan Let's Encrypt? (y/n) " -n 1 -r
    echo
    
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        return
    fi
    
    if ! command -v certbot &> /dev/null; then
        log_info "Installing Certbot..."
        if [ "$PKG_MANAGER" == "apt" ]; then
            sudo apt-get install -y certbot python3-certbot-nginx
        elif [ "$PKG_MANAGER" == "yum" ] || [ "$PKG_MANAGER" == "dnf" ]; then
            sudo $PKG_MANAGER install -y certbot python3-certbot-nginx
        fi
    fi
    
    read -p "Masukkan domain (contoh: cutefinance.example.com): " DOMAIN
    
    sudo certbot --nginx -d $DOMAIN
    
    log_success "SSL certificate berhasil di setup untuk $DOMAIN"
}

# Show completion message
show_completion() {
    echo ""
    echo -e "${GREEN}=========================================${NC}"
    echo -e "${GREEN}  🎉 Instalasi Berhasil! 🎉${NC}"
    echo -e "${GREEN}=========================================${NC}"
    echo ""
    echo -e "${BLUE}Akses aplikasi:${NC}"
    echo "  • Local: http://localhost:8080"
    
    if command -v tailscale &> /dev/null; then
        TAILSCALE_IP=$(tailscale ip -4)
        echo "  • Tailscale: http://$TAILSCALE_IP:8080"
    fi
    
    echo ""
    echo -e "${BLUE}Perintah berguna:${NC}"
    echo "  • Development: npm run dev"
    echo "  • Build: npm run build"
    echo "  • Service status: sudo systemctl status cutefinance"
    echo "  • Service restart: sudo systemctl restart cutefinance"
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
    check_root
    detect_os
    check_arch
    
    echo ""
    log_info "Memulai instalasi..."
    echo ""
    
    # Step 1: Check dependencies
    check_nodejs
    check_npm
    
    # Step 2: Install project dependencies
    install_dependencies
    
    # Step 3: Build application
    build_app
    
    # Step 4: Setup web server
    echo ""
    read -p "Setup Nginx web server? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        setup_nginx
        setup_firewall
        setup_systemd
    fi
    
    # Step 5: Optional setups
    setup_tailscale
    setup_ssl
    
    # Completion
    show_completion
}

# Run main function
main "$@"
