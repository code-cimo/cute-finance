#!/bin/bash

# CuteFinance PWA - Quick Installer
# Setup aplikasi dengan port custom

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

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

# Check Go
if ! command -v go &> /dev/null; then
    echo -e "${RED}❌ Go tidak terinstall!${NC}"
    echo "Download dari: https://go.dev/dl/"
    exit 1
fi

echo -e "${GREEN}✓ Go version: $(go version | awk '{print $3}')${NC}"

# Ask for port
echo ""
echo -e "${BLUE}📡 Konfigurasi Port${NC}"
read -p "Masukkan port (default: 8080): " PORT
PORT=${PORT:-8080}

# Validate port
if ! [[ "$PORT" =~ ^[0-9]+$ ]] || [ "$PORT" -lt 1 ] || [ "$PORT" -gt 65535 ]; then
    echo -e "${RED}❌ Port tidak valid!${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Port: $PORT${NC}"

# Ask for data directory
echo ""
echo -e "${BLUE}📁 Data Directory${NC}"
read -p "Masukkan data directory (default: ./data): " DATA_DIR
DATA_DIR=${DATA_DIR:-./data}

echo -e "${GREEN}✓ Data directory: $DATA_DIR${NC}"

# Create data directory
mkdir -p "$DATA_DIR"

# Setup dependencies
echo ""
echo -e "${BLUE}📦 Setting up dependencies...${NC}"
rm -f go.sum
go mod download
go mod tidy
echo -e "${GREEN}✓ Dependencies ready${NC}"

# Build application
echo ""
echo -e "${BLUE}🔨 Building application...${NC}"
go build -ldflags="-w -s" -o cute-finance ./cmd/server
echo -e "${GREEN}✓ Build complete${NC}"

# Run installer TUI
echo ""
echo -e "${BLUE}🔧 Running installer...${NC}"
./cute-finance -install -data "$DATA_DIR"

echo ""
echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN}  ✅ Instalasi Berhasil!${NC}"
echo -e "${GREEN}=========================================${NC}"
echo ""
echo -e "${BLUE}Cara menjalankan:${NC}"
echo "  ./cute-finance"
echo ""
echo -e "${BLUE}Akses aplikasi:${NC}"
echo "  http://localhost:$PORT"
echo ""
echo -e "${YELLOW}💡 Tips:${NC}"
echo "  • Tekan Ctrl+C untuk stop server"
echo "  • Data tersimpan di: $DATA_DIR"
echo "  • Config tersimpan di: $DATA_DIR/config.json"
echo ""
