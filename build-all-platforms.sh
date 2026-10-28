#!/bin/bash

# CuteFinance PWA - Cross-Platform Build with TUI
# Version 2.0.0

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
WHITE='\033[1;37m'
NC='\033[0m'

# Clear screen
clear

# Banner
echo -e "${CYAN}"
echo "  ____      _   _   ___                  _ _____ _   _  ___ _____ ____  "
echo " / ___|__ _| |_| | |_ _|_ __   __ _  ___| | ____| \ | |/ _ \_   _/ ___| "
echo "| |   / _\`| __| |  | || '_ \ / _\` |/ _ \ |  _| |  \| | | | || | \___ \ "
echo "| |__| (_| | |_| |  | || | | | (_| |  __/ | |___| |\  | |_| || |  ___) |"
echo " \____\__,_|\__|_| |___|_| |_|\__, |\___|_|_____|_| \_|\___/ |_| |____/ "
echo "                               |___/                                     "
echo -e "${NC}"
echo -e "${YELLOW}🔨 CuteFinance PWA - Cross-Platform Build Tool v2.0.0${NC}"
echo ""

# ============================================
# STEP 1: Check Go
# ============================================
echo -e "${BLUE}📋 Checking prerequisites...${NC}"
echo ""

if ! command -v go &> /dev/null; then
    echo -e "${RED}❌ Go tidak terinstall!${NC}"
    echo "Download dari: https://go.dev/dl/"
    exit 1
fi

GO_VERSION=$(go version | awk '{print $3}')
echo -e "${GREEN}✅ Go version: $GO_VERSION${NC}"

# Check Node.js (optional)
BUILD_FRONTEND=false
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✅ Node.js version: $NODE_VERSION${NC}"
    BUILD_FRONTEND=true
else
    echo -e "${YELLOW}⚠️  Node.js tidak terinstall - skip frontend build${NC}"
fi

echo ""

# ============================================
# STEP 2: Fix Dependencies
# ============================================
echo -e "${BLUE}📦 Fixing dependencies...${NC}"
echo ""

# Remove old go.sum
if [ -f "go.sum" ]; then
    echo -e "${YELLOW}🗑️  Removing old go.sum...${NC}"
    rm -f go.sum
fi

# Download dependencies
echo -e "${CYAN}Downloading Go dependencies...${NC}"
if go mod download 2>&1; then
    echo -e "${GREEN}✅ Dependencies downloaded${NC}"
else
    echo -e "${YELLOW}⚠️  Error downloading, cleaning cache...${NC}"
    go clean -modcache
    go mod download
fi

# Tidy modules
echo -e "${CYAN}Tidying modules...${NC}"
if go mod tidy 2>&1; then
    echo -e "${GREEN}✅ Modules tidied${NC}"
else
    echo -e "${RED}❌ Failed to tidy modules!${NC}"
    exit 1
fi

echo ""

# ============================================
# STEP 3: Build Frontend (Optional)
# ============================================
if [ "$BUILD_FRONTEND" = true ]; then
    echo -e "${BLUE}🎨 Build Frontend?${NC}"
    echo ""
    echo "  1) ✅ Yes - Build frontend (recommended)"
    echo "  2) ❌ No  - Skip frontend build"
    echo ""
    read -p "Choose (1-2) [default: 1]: " BUILD_FRONTEND_CHOICE
    BUILD_FRONTEND_CHOICE=${BUILD_FRONTEND_CHOICE:-1}
    
    if [ "$BUILD_FRONTEND_CHOICE" = "1" ]; then
        echo ""
        echo -e "${CYAN}📦 Installing npm dependencies...${NC}"
        npm install > /dev/null 2>&1
        
        echo -e "${CYAN}🔨 Building frontend...${NC}"
        npm run build > /dev/null 2>&1
        echo -e "${GREEN}✅ Frontend built successfully${NC}"
    else
        echo -e "${YELLOW}⚠️  Skipping frontend build${NC}"
    fi
    echo ""
fi

# ============================================
# STEP 4: Platform Selection Menu
# ============================================
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}  🎯 Select Platforms to Build${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${WHITE}Available Platforms:${NC}"
echo ""
echo "  ${GREEN}1)${NC} 🖥️  Current Platform ($(uname -s)-$(uname -m))"
echo "  ${GREEN}2)${NC} 🐧 Linux ARM64 (Odroid C2, Raspberry Pi)"
echo "  ${GREEN}3)${NC} 🐧 Linux AMD64 (x86_64)"
echo "  ${GREEN}4)${NC} 🪟 Windows AMD64"
echo "  ${GREEN}5)${NC} 🍎 macOS ARM64 (Apple Silicon M1/M2/M3)"
echo "  ${GREEN}6)${NC} 🍎 macOS AMD64 (Intel)"
echo "  ${GREEN}7)${NC} 🌍 Build ALL Platforms"
echo "  ${GREEN}0)${NC} ❌ Exit"
echo ""
echo -e "${YELLOW}💡 Tips:${NC}"
echo "  • Enter multiple numbers separated by space (e.g., '1 2 3')"
echo "  • Or enter '7' to build all platforms"
echo ""
read -p "Choose platform(s): " PLATFORM_CHOICES

# Parse choices
BUILD_CURRENT=false
BUILD_LINUX_ARM64=false
BUILD_LINUX_AMD64=false
BUILD_WINDOWS=false
BUILD_MACOS_ARM64=false
BUILD_MACOS_AMD64=false

for choice in $PLATFORM_CHOICES; do
    case $choice in
        1) BUILD_CURRENT=true ;;
        2) BUILD_LINUX_ARM64=true ;;
        3) BUILD_LINUX_AMD64=true ;;
        4) BUILD_WINDOWS=true ;;
        5) BUILD_MACOS_ARM64=true ;;
        6) BUILD_MACOS_AMD64=true ;;
        7) 
            BUILD_CURRENT=true
            BUILD_LINUX_ARM64=true
            BUILD_LINUX_AMD64=true
            BUILD_WINDOWS=true
            BUILD_MACOS_ARM64=true
            BUILD_MACOS_AMD64=true
            ;;
        0) 
            echo -e "${YELLOW}Exiting...${NC}"
            exit 0
            ;;
        *)
            echo -e "${RED}❌ Invalid choice: $choice${NC}"
            exit 1
            ;;
    esac
done

echo ""
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}  🚀 Starting Build Process${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# ============================================
# STEP 5: Build Selected Platforms
# ============================================
BUILD_COUNT=0
SUCCESS_COUNT=0

# Build Current Platform
if [ "$BUILD_CURRENT" = true ]; then
    BUILD_COUNT=$((BUILD_COUNT + 1))
    echo -e "${BLUE}[$BUILD_COUNT] Building for current platform ($(uname -s)-$(uname -m))...${NC}"
    
    if go build -ldflags="-w -s" -o cute-finance ./cmd/server 2>&1; then
        echo -e "${GREEN}✅ Built: cute-finance ($(ls -lh cute-finance | awk '{print $5}'))${NC}"
        SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
    else
        echo -e "${RED}❌ Failed to build current platform${NC}"
    fi
    echo ""
fi

# Build Linux ARM64
if [ "$BUILD_LINUX_ARM64" = true ]; then
    BUILD_COUNT=$((BUILD_COUNT + 1))
    echo -e "${BLUE}[$BUILD_COUNT] Building for Linux ARM64...${NC}"
    
    if GOOS=linux GOARCH=arm64 CGO_ENABLED=0 go build -ldflags="-w -s" -o cute-finance-linux-arm64 ./cmd/server 2>&1; then
        echo -e "${GREEN}✅ Built: cute-finance-linux-arm64 ($(ls -lh cute-finance-linux-arm64 | awk '{print $5}'))${NC}"
        SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
    else
        echo -e "${RED}❌ Failed to build Linux ARM64${NC}"
    fi
    echo ""
fi

# Build Linux AMD64
if [ "$BUILD_LINUX_AMD64" = true ]; then
    BUILD_COUNT=$((BUILD_COUNT + 1))
    echo -e "${BLUE}[$BUILD_COUNT] Building for Linux AMD64...${NC}"
    
    if GOOS=linux GOARCH=amd64 CGO_ENABLED=0 go build -ldflags="-w -s" -o cute-finance-linux-amd64 ./cmd/server 2>&1; then
        echo -e "${GREEN}✅ Built: cute-finance-linux-amd64 ($(ls -lh cute-finance-linux-amd64 | awk '{print $5}'))${NC}"
        SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
    else
        echo -e "${RED}❌ Failed to build Linux AMD64${NC}"
    fi
    echo ""
fi

# Build Windows AMD64
if [ "$BUILD_WINDOWS" = true ]; then
    BUILD_COUNT=$((BUILD_COUNT + 1))
    echo -e "${BLUE}[$BUILD_COUNT] Building for Windows AMD64...${NC}"
    
    if GOOS=windows GOARCH=amd64 CGO_ENABLED=0 go build -ldflags="-w -s" -o cute-finance-windows-amd64.exe ./cmd/server 2>&1; then
        echo -e "${GREEN}✅ Built: cute-finance-windows-amd64.exe ($(ls -lh cute-finance-windows-amd64.exe | awk '{print $5}'))${NC}"
        SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
    else
        echo -e "${RED}❌ Failed to build Windows AMD64${NC}"
    fi
    echo ""
fi

# Build macOS ARM64
if [ "$BUILD_MACOS_ARM64" = true ]; then
    BUILD_COUNT=$((BUILD_COUNT + 1))
    echo -e "${BLUE}[$BUILD_COUNT] Building for macOS ARM64...${NC}"
    
    if GOOS=darwin GOARCH=arm64 CGO_ENABLED=0 go build -ldflags="-w -s" -o cute-finance-darwin-arm64 ./cmd/server 2>&1; then
        echo -e "${GREEN}✅ Built: cute-finance-darwin-arm64 ($(ls -lh cute-finance-darwin-arm64 | awk '{print $5}'))${NC}"
        SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
    else
        echo -e "${RED}❌ Failed to build macOS ARM64${NC}"
    fi
    echo ""
fi

# Build macOS AMD64
if [ "$BUILD_MACOS_AMD64" = true ]; then
    BUILD_COUNT=$((BUILD_COUNT + 1))
    echo -e "${BLUE}[$BUILD_COUNT] Building for macOS AMD64...${NC}"
    
    if GOOS=darwin GOARCH=amd64 CGO_ENABLED=0 go build -ldflags="-w -s" -o cute-finance-darwin-amd64 ./cmd/server 2>&1; then
        echo -e "${GREEN}✅ Built: cute-finance-darwin-amd64 ($(ls -lh cute-finance-darwin-amd64 | awk '{print $5}'))${NC}"
        SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
    else
        echo -e "${RED}❌ Failed to build macOS AMD64${NC}"
    fi
    echo ""
fi

# ============================================
# STEP 6: Summary
# ============================================
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  ✅ Build Complete!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${BLUE}📊 Build Summary:${NC}"
echo "  Total builds: $BUILD_COUNT"
echo "  Successful:   $SUCCESS_COUNT"
echo "  Failed:       $((BUILD_COUNT - SUCCESS_COUNT))"
echo ""

if [ $SUCCESS_COUNT -gt 0 ]; then
    echo -e "${BLUE}📦 Built binaries:${NC}"
    ls -lh cute-finance* 2>/dev/null | grep -v "\.sh$" | grep -v "\.bat$" | awk '{print "  " $9 " (" $5 ")"}'
    echo ""
    
    echo -e "${BLUE}📝 Platform guide:${NC}"
    [ -f "cute-finance" ] && echo "  • Current:    ./cute-finance"
    [ -f "cute-finance-linux-arm64" ] && echo "  • Linux ARM64: ./cute-finance-linux-arm64"
    [ -f "cute-finance-linux-amd64" ] && echo "  • Linux AMD64: ./cute-finance-linux-amd64"
    [ -f "cute-finance-windows-amd64.exe" ] && echo "  • Windows:     cute-finance-windows-amd64.exe"
    [ -f "cute-finance-darwin-arm64" ] && echo "  • macOS ARM64: ./cute-finance-darwin-arm64"
    [ -f "cute-finance-darwin-amd64" ] && echo "  • macOS AMD64: ./cute-finance-darwin-amd64"
    echo ""
    
    echo -e "${BLUE}💡 Next steps:${NC}"
    echo "  • Run installer: ./install.sh"
    echo "  • Or run directly: ./cute-finance"
    echo ""
fi

# Ask to run installer
if [ $SUCCESS_COUNT -gt 0 ]; then
    read -p "Run installer now? (y/n) " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo ""
        chmod +x install.sh
        ./install.sh
    fi
fi
