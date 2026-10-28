#!/bin/bash

# Debug Script for CuteFinance PWA
# Check semua komponen dan test server

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🔍 Debug CuteFinance PWA${NC}"
echo ""

# Check 1: Binary exists
echo -e "${BLUE}[1/7] Checking binary...${NC}"
if [ -f "cute-finance" ]; then
    echo -e "${GREEN}✅ Binary exists${NC}"
    ls -lh cute-finance
else
    echo -e "${RED}❌ Binary not found!${NC}"
    echo "Run: go build -o cute-finance ./cmd/server"
    exit 1
fi
echo ""

# Check 2: Config file
echo -e "${BLUE}[2/7] Checking config file...${NC}"
if [ -f "data/config.json" ]; then
    echo -e "${GREEN}✅ Config file exists${NC}"
    echo "Content:"
    cat data/config.json
    echo ""
    
    # Extract port
    PORT=$(grep -o '"port": *[0-9]*' data/config.json | grep -o '[0-9]*')
    echo -e "${BLUE}Port from config: ${PORT}${NC}"
else
    echo -e "${YELLOW}⚠️  Config file not found${NC}"
    echo "Creating default config..."
    mkdir -p data
    cat > data/config.json << 'EOF'
{
  "port": 1234,
  "data_dir": "./data"
}
EOF
    echo -e "${GREEN}✅ Config created with port 1234${NC}"
    PORT=1234
fi
echo ""

# Check 3: Frontend dist folder
echo -e "${BLUE}[3/7] Checking frontend...${NC}"
if [ -d "dist" ]; then
    echo -e "${GREEN}✅ dist folder exists${NC}"
    echo "Contents:"
    ls -la dist/
    
    if [ -f "dist/index.html" ]; then
        echo -e "${GREEN}✅ index.html exists${NC}"
    else
        echo -e "${RED}❌ index.html not found!${NC}"
        echo "Run: npm run build"
    fi
else
    echo -e "${RED}❌ dist folder not found!${NC}"
    echo "Run: npm run build"
    exit 1
fi
echo ""

# Check 4: Database
echo -e "${BLUE}[4/7] Checking database...${NC}"
if [ -f "data/cutefinance.db" ]; then
    echo -e "${GREEN}✅ Database exists${NC}"
    ls -lh data/cutefinance.db
else
    echo -e "${YELLOW}⚠️  Database not found (will be created on first run)${NC}"
fi
echo ""

# Check 5: Port availability
echo -e "${BLUE}[5/7] Checking port ${PORT}...${NC}"
if netstat -tuln 2>/dev/null | grep -q ":${PORT} "; then
    echo -e "${RED}❌ Port ${PORT} already in use!${NC}"
    echo "Processes using port ${PORT}:"
    netstat -tulnp 2>/dev/null | grep ":${PORT} " || lsof -i :${PORT} 2>/dev/null || echo "Could not determine"
    echo ""
    echo "Options:"
    echo "1. Kill the process: sudo kill -9 <PID>"
    echo "2. Use different port: ./cute-finance -port 9090"
    echo "3. Edit config: nano data/config.json"
    exit 1
else
    echo -e "${GREEN}✅ Port ${PORT} is available${NC}"
fi
echo ""

# Check 6: Test binary version
echo -e "${BLUE}[6/7] Testing binary...${NC}"
if ./cute-finance -version 2>&1; then
    echo -e "${GREEN}✅ Binary works${NC}"
else
    echo -e "${RED}❌ Binary test failed!${NC}"
    exit 1
fi
echo ""

# Check 7: Start server
echo -e "${BLUE}[7/7] Starting server...${NC}"
echo -e "${YELLOW}Server akan berjalan di background. Tekan Ctrl+C untuk stop.${NC}"
echo ""
echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN}  🚀 Starting CuteFinance PWA${NC}"
echo -e "${GREEN}=========================================${NC}"
echo ""
echo -e "${BLUE}Access at: ${NC}http://localhost:${PORT}"
echo -e "${BLUE}API health: ${NC}http://localhost:${PORT}/api/health"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop server${NC}"
echo ""

# Run server
./cute-finance
