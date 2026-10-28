#!/bin/bash

# Fix Embed Issue Script
# Automatically fix the "pattern dist/*: no matching files found" error

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🔧 Fixing embed issue...${NC}"
echo ""

# Step 1: Check for embed directive
echo -e "${BLUE}Step 1: Checking for embed directive...${NC}"
if grep -q "//go:embed" cmd/server/main.go 2>/dev/null; then
    echo -e "${YELLOW}⚠️  Found embed directive in main.go${NC}"
    echo "Removing embed directive..."
    
    # Backup original
    cp cmd/server/main.go cmd/server/main.go.backup
    echo "✅ Backup created: cmd/server/main.go.backup"
    
    # Remove embed import and directive
    sed -i '/"embed"/d' cmd/server/main.go
    sed -i '/\/\/go:embed/d' cmd/server/main.go
    sed -i '/var frontendFS embed.FS/d' cmd/server/main.go
    
    echo -e "${GREEN}✅ Embed directive removed${NC}"
else
    echo -e "${GREEN}✅ No embed directive found${NC}"
fi
echo ""

# Step 2: Verify main.go structure
echo -e "${BLUE}Step 2: Verifying main.go structure...${NC}"
if grep -q "embed" cmd/server/main.go 2>/dev/null; then
    echo -e "${RED}❌ Still found 'embed' in main.go!${NC}"
    echo "Please check cmd/server/main.go manually"
    exit 1
else
    echo -e "${GREEN}✅ main.go structure is correct${NC}"
fi
echo ""

# Step 3: Build frontend
echo -e "${BLUE}Step 3: Building frontend...${NC}"
if command -v npm &> /dev/null; then
    echo "Installing npm dependencies..."
    npm install > /dev/null 2>&1
    
    echo "Building frontend..."
    npm run build > /dev/null 2>&1
    
    # Verify dist folder
    if [ -d "dist" ]; then
        echo -e "${GREEN}✅ Frontend built successfully${NC}"
        echo "Dist folder size: $(du -sh dist/ | cut -f1)"
    else
        echo -e "${RED}❌ dist folder not found after build!${NC}"
        exit 1
    fi
else
    echo -e "${YELLOW}⚠️  npm not found - skip frontend build${NC}"
    echo "Install Node.js and run: npm run build"
fi
echo ""

# Step 4: Build Go application
echo -e "${BLUE}Step 4: Building Go application...${NC}"
echo "Running: go build -ldflags=\"-w -s\" -o cute-finance ./cmd/server"

if go build -ldflags="-w -s" -o cute-finance ./cmd/server 2>&1; then
    if [ -f "cute-finance" ]; then
        echo -e "${GREEN}✅ Build successful!${NC}"
        echo "Binary size: $(ls -lh cute-finance | awk '{print $5}')"
    else
        echo -e "${RED}❌ Binary not found after build!${NC}"
        exit 1
    fi
else
    echo -e "${RED}❌ Build failed!${NC}"
    echo ""
    echo "Error details:"
    go build -ldflags="-w -s" -o cute-finance ./cmd/server
    exit 1
fi
echo ""

# Step 5: Test run
echo -e "${BLUE}Step 5: Testing binary...${NC}"
if ./cute-finance -version > /dev/null 2>&1; then
    VERSION=$(./cute-finance -version)
    echo -e "${GREEN}✅ Binary works!${NC}"
    echo "Version: $VERSION"
else
    echo -e "${RED}❌ Binary test failed!${NC}"
    exit 1
fi
echo ""

# Success message
echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN}  ✅ All fixes applied successfully!${NC}"
echo -e "${GREEN}=========================================${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "  1. Run installer: ./install.sh"
echo "  2. Or run directly: ./cute-finance"
echo ""
echo -e "${YELLOW}💡 Tips:${NC}"
echo "  • If you want to change port: ./cute-finance -install"
echo "  • Check logs: ls -la install-*.log"
echo "  • View debug guide: cat DEBUG-EMBED.md"
echo ""
