#!/bin/bash

# Quick Start Script - Skip TUI installer
# Langsung jalankan server dengan config yang sudah ada

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🚀 Quick Start CuteFinance PWA${NC}"
echo ""

# Check binary
if [ ! -f "cute-finance" ]; then
    echo -e "${RED}❌ Binary not found!${NC}"
    echo "Building..."
    go build -ldflags="-w -s" -o cute-finance ./cmd/server
fi

# Check config
if [ ! -f "data/config.json" ]; then
    echo -e "${YELLOW}⚠️  Config not found, creating default...${NC}"
    mkdir -p data
    cat > data/config.json << 'EOF'
{
  "port": 1234,
  "data_dir": "./data"
}
EOF
fi

# Extract port from config
PORT=$(grep -o '"port": *[0-9]*' data/config.json | grep -o '[0-9]*')
echo -e "${GREEN}✅ Config loaded - Port: ${PORT}${NC}"

# Check if port is in use
if netstat -tuln 2>/dev/null | grep -q ":${PORT} "; then
    echo -e "${RED}❌ Port ${PORT} already in use!${NC}"
    echo ""
    echo "Options:"
    echo "1. Kill process: sudo fuser -k ${PORT}/tcp"
    echo "2. Use different port: ./cute-finance -port 9090"
    echo "3. Edit config: nano data/config.json"
    exit 1
fi

# Check frontend
if [ ! -d "dist" ]; then
    echo -e "${YELLOW}⚠️  Frontend not built, building now...${NC}"
    npm run build
fi

echo ""
echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN}  🐾 Starting CuteFinance PWA${NC}"
echo -e "${GREEN}=========================================${NC}"
echo ""
echo -e "${BLUE}📡 Server: ${NC}http://localhost:${PORT}"
echo -e "${BLUE}💾 Database: ${NC}./data/cutefinance.db"
echo -e "${BLUE}📂 Frontend: ${NC}./dist/"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop server${NC}"
echo ""

# Run server
exec ./cute-finance
