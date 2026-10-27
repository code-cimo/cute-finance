#!/bin/bash

# CuteFinance PWA - Setup Script
# Script ini akan setup environment dan generate go.sum yang benar

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🐾 CuteFinance PWA - Setup Script${NC}"
echo ""

# Check Go
if ! command -v go &> /dev/null; then
    echo -e "${RED}❌ Go tidak terinstall!${NC}"
    echo "Download dari: https://go.dev/dl/"
    exit 1
fi

GO_VERSION=$(go version | awk '{print $3}')
echo -e "${GREEN}✓ Go version: $GO_VERSION${NC}"

# Clean old go.sum jika ada
if [ -f "go.sum" ]; then
    echo -e "${YELLOW}🗑️  Menghapus go.sum lama...${NC}"
    rm -f go.sum
fi

# Download dependencies
echo -e "${BLUE}📦 Downloading dependencies...${NC}"
go mod download

# Generate go.sum yang benar
echo -e "${BLUE}🔧 Generating go.sum...${NC}"
go mod tidy

echo -e "${GREEN}✅ Setup complete!${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "  1. Build: make build"
echo "  2. Run: ./cute-finance"
echo ""
echo -e "${YELLOW}Untuk cross-compile:${NC}"
echo "  ARM64 (Odroid C2): make build-arm64"
echo "  x86_64: make build-amd64"
echo ""
