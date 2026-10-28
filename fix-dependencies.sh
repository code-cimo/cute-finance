#!/bin/bash

# Quick Fix Script untuk masalah go.sum
# Jalankan script ini untuk fix semua dependency issues

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🔧 CuteFinance PWA - Quick Fix Script${NC}"
echo ""

# Step 1: Check Go
echo -e "${BLUE}[1/4] Checking Go installation...${NC}"
if ! command -v go &> /dev/null; then
    echo -e "${RED}❌ Go tidak terinstall!${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Go version: $(go version | awk '{print $3}')${NC}"
echo ""

# Step 2: Remove old go.sum
echo -e "${BLUE}[2/4] Removing old go.sum...${NC}"
if [ -f "go.sum" ]; then
    rm -f go.sum
    echo -e "${GREEN}✅ go.sum removed${NC}"
else
    echo -e "${YELLOW}⚠️  go.sum not found (will be created)${NC}"
fi
echo ""

# Step 3: Download dependencies
echo -e "${BLUE}[3/4] Downloading dependencies...${NC}"
echo -e "${YELLOW}This may take a few minutes...${NC}"
echo ""

# Clean module cache first
echo "Cleaning module cache..."
go clean -modcache 2>/dev/null || true

# Set proxy
export GOPROXY=https://proxy.golang.org,direct

# Download
echo "Downloading modules..."
if go mod download; then
    echo -e "${GREEN}✅ Dependencies downloaded${NC}"
else
    echo -e "${RED}❌ Failed to download dependencies${NC}"
    echo ""
    echo "Trying alternative proxy..."
    export GOPROXY=https://goproxy.cn,direct
    go mod download || {
        echo -e "${RED}❌ Still failed. Check your internet connection.${NC}"
        exit 1
    }
fi
echo ""

# Step 4: Tidy modules
echo -e "${BLUE}[4/4] Tidying modules...${NC}"
if go mod tidy; then
    echo -e "${GREEN}✅ Modules tidied successfully${NC}"
else
    echo -e "${RED}❌ Failed to tidy modules${NC}"
    exit 1
fi
echo ""

# Verify
echo -e "${BLUE}Verifying installation...${NC}"
if go mod verify; then
    echo -e "${GREEN}✅ All modules verified${NC}"
else
    echo -e "${RED}❌ Module verification failed${NC}"
    exit 1
fi
echo ""

# Check go.sum
if [ -f "go.sum" ]; then
    echo -e "${GREEN}✅ go.sum created successfully${NC}"
    echo "   Size: $(ls -lh go.sum | awk '{print $5}')"
    echo "   Lines: $(wc -l < go.sum)"
else
    echo -e "${RED}❌ go.sum not created${NC}"
    exit 1
fi
echo ""

# Success message
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  ✅ Fix Complete!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${BLUE}🎯 Next steps:${NC}"
echo ""
echo "  1. Build with TUI:"
echo "     chmod +x build-all-platforms.sh"
echo "     ./build-all-platforms.sh"
echo ""
echo "  2. Or build directly:"
echo "     go build -ldflags=\"-w -s\" -o cute-finance ./cmd/server"
echo ""
echo "  3. Run installer:"
echo "     chmod +x install.sh"
echo "     ./install.sh"
echo ""
echo -e "${YELLOW}💡 Tip: Gunakan build-all-platforms.sh untuk TUI interaktif${NC}"
echo ""
