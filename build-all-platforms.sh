#!/bin/bash

# CuteFinance PWA - Cross-Platform Build Script
# Build untuk semua platform

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🔨 CuteFinance PWA - Cross-Platform Build${NC}"
echo ""

# Check Go
if ! command -v go &> /dev/null; then
    echo -e "${RED}❌ Go tidak terinstall!${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Go version: $(go version | awk '{print $3}')${NC}"
echo ""

# Build frontend first
echo -e "${BLUE}📦 Building frontend...${NC}"
if command -v npm &> /dev/null; then
    npm install
    npm run build
    echo -e "${GREEN}✅ Frontend built${NC}"
else
    echo -e "${YELLOW}⚠️  npm tidak ditemukan - skip frontend build${NC}"
fi
echo ""

# Build for current platform
echo -e "${BLUE}🔨 Building for current platform...${NC}"
go build -ldflags="-w -s" -o cute-finance ./cmd/server
echo -e "${GREEN}✅ Built: cute-finance ($(uname -s)-$(uname -m))${NC}"
echo ""

# Build for Linux ARM64 (Odroid C2)
echo -e "${BLUE}🔨 Building for Linux ARM64 (Odroid C2)...${NC}"
GOOS=linux GOARCH=arm64 CGO_ENABLED=0 go build -ldflags="-w -s" -o cute-finance-linux-arm64 ./cmd/server
echo -e "${GREEN}✅ Built: cute-finance-linux-arm64${NC}"
echo ""

# Build for Linux AMD64
echo -e "${BLUE}🔨 Building for Linux AMD64...${NC}"
GOOS=linux GOARCH=amd64 CGO_ENABLED=0 go build -ldflags="-w -s" -o cute-finance-linux-amd64 ./cmd/server
echo -e "${GREEN}✅ Built: cute-finance-linux-amd64${NC}"
echo ""

# Build for Windows AMD64
echo -e "${BLUE}🔨 Building for Windows AMD64...${NC}"
GOOS=windows GOARCH=amd64 CGO_ENABLED=0 go build -ldflags="-w -s" -o cute-finance-windows-amd64.exe ./cmd/server
echo -e "${GREEN}✅ Built: cute-finance-windows-amd64.exe${NC}"
echo ""

# Build for macOS ARM64 (Apple Silicon)
echo -e "${BLUE}🔨 Building for macOS ARM64...${NC}"
GOOS=darwin GOARCH=arm64 CGO_ENABLED=0 go build -ldflags="-w -s" -o cute-finance-darwin-arm64 ./cmd/server
echo -e "${GREEN}✅ Built: cute-finance-darwin-arm64${NC}"
echo ""

# Build for macOS AMD64 (Intel)
echo -e "${BLUE}🔨 Building for macOS AMD64...${NC}"
GOOS=darwin GOARCH=amd64 CGO_ENABLED=0 go build -ldflags="-w -s" -o cute-finance-darwin-amd64 ./cmd/server
echo -e "${GREEN}✅ Built: cute-finance-darwin-amd64${NC}"
echo ""

# Summary
echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN}  ✅ All Builds Complete!${NC}"
echo -e "${GREEN}=========================================${NC}"
echo ""
echo -e "${BLUE}📦 Built binaries:${NC}"
ls -lh cute-finance* | grep -v "\.sh$" | grep -v "\.bat$"
echo ""
echo -e "${BLUE}📝 Platform guide:${NC}"
echo "  • Linux (current):    ./cute-finance"
echo "  • Linux ARM64:        ./cute-finance-linux-arm64"
echo "  • Linux AMD64:        ./cute-finance-linux-amd64"
echo "  • Windows:            cute-finance-windows-amd64.exe"
echo "  • macOS ARM64:        ./cute-finance-darwin-arm64"
echo "  • macOS AMD64:        ./cute-finance-darwin-amd64"
echo ""
echo -e "${BLUE}💡 Distribution:${NC}"
echo "  Windows: Copy cute-finance-windows-amd64.exe + installer-windows.bat"
echo "  Linux:   Copy cute-finance-linux-* + installer-linux.sh"
echo "  macOS:   Copy cute-finance-darwin-*"
echo ""
