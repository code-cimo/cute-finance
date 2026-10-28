#!/bin/bash

# CuteFinance PWA - Linux Uninstaller
# Version 2.0.0

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Banner
echo -e "${RED}"
echo "  ____      _   _   ___                  _ _____ _   _  ___ _____ ____  "
echo " / ___|__ _| |_| | |_ _|_ __   __ _  ___| | ____| \ | |/ _ \_   _/ ___| "
echo "| |   / _\`| __| |  | || '_ \ / _\` |/ _ \ |  _| |  \| | | | || | \___ \ "
echo "| |__| (_| | |_| |  | || | | | (_| |  __/ | |___| |\  | |_| || |  ___) |"
echo " \____\__,_|\__|_| |___|_| |_|\__, |\___|_|_____|_| \_|\___/ |_| |____/ "
echo "                               |___/                                     "
echo -e "${NC}"
echo -e "${YELLOW}🐾 CuteFinance PWA Uninstaller v2.0.0${NC}"
echo ""

# Warning
echo -e "${YELLOW}⚠️  WARNING: This will uninstall CuteFinance PWA${NC}"
echo ""
echo "This will:"
echo "  • Stop the server if running"
echo "  • Remove systemd service (if exists)"
echo "  • Optionally delete all data"
echo ""

# Confirmation
read -p "Are you sure you want to uninstall? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Uninstallation cancelled."
    exit 0
fi

echo ""

# Step 1: Stop server
echo -e "${BLUE}[1/5] Stopping server...${NC}"
pkill -f cute-finance 2>/dev/null
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Server stopped${NC}"
else
    echo -e "${NC}ℹ️  Server not running${NC}"
fi
echo ""

# Step 2: Stop and remove systemd service
echo -e "${BLUE}[2/5] Removing systemd service...${NC}"
if systemctl is-active --quiet cutefinance 2>/dev/null; then
    sudo systemctl stop cutefinance
    echo -e "${GREEN}✅ Service stopped${NC}"
fi

if [ -f "/etc/systemd/system/cutefinance.service" ]; then
    sudo systemctl disable cutefinance 2>/dev/null
    sudo rm -f /etc/systemd/system/cutefinance.service
    sudo systemctl daemon-reload
    echo -e "${GREEN}✅ Systemd service removed${NC}"
else
    echo -e "${NC}ℹ️  Systemd service not found${NC}"
fi
echo ""

# Step 3: Remove binary
echo -e "${BLUE}[3/5] Removing binary files...${NC}"
if [ -f "cute-finance" ]; then
    rm -f cute-finance
    echo -e "${GREEN}✅ Binary removed${NC}"
else
    echo -e "${NC}ℹ️  Binary not found${NC}"
fi

if [ -f "cute-finance-arm64" ]; then
    rm -f cute-finance-arm64
    echo -e "${GREEN}✅ ARM64 binary removed${NC}"
fi

if [ -f "cute-finance-amd64" ]; then
    rm -f cute-finance-amd64
    echo -e "${GREEN}✅ AMD64 binary removed${NC}"
fi
echo ""

# Step 4: Delete data (optional)
echo -e "${BLUE}[4/5] Data Management${NC}"
echo ""
read -p "Do you want to delete all data? (y/n) " -n 1 -r
echo
echo -e "${YELLOW}⚠️  WARNING: This cannot be undone!${NC}"

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    read -p "Are you REALLY sure? Type 'YES' to confirm: " FINAL_CONFIRM
    
    if [ "$FINAL_CONFIRM" = "YES" ]; then
        echo ""
        echo "Deleting data..."
        
        if [ -d "data" ]; then
            rm -rf data
            echo -e "${GREEN}✅ Data directory deleted${NC}"
        else
            echo -e "${NC}ℹ️  Data directory not found${NC}"
        fi
        
        if [ -d "dist" ]; then
            rm -rf dist
            echo -e "${GREEN}✅ Frontend build deleted${NC}"
        else
            echo -e "${NC}ℹ️  Frontend build not found${NC}"
        fi
    else
        echo "Data deletion cancelled."
        echo "Data preserved in: ./data"
    fi
else
    echo "Data preserved in: ./data"
fi
echo ""

# Step 5: Cleanup (optional)
echo -e "${BLUE}[5/5] Cleanup${NC}"
echo ""
read -p "Do you want to delete node_modules? (y/n) " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
    if [ -d "node_modules" ]; then
        echo "Deleting node_modules..."
        rm -rf node_modules
        echo -e "${GREEN}✅ node_modules deleted${NC}"
    else
        echo -e "${NC}ℹ️  node_modules not found${NC}"
    fi
else
    echo "node_modules preserved"
fi

echo ""

# Success message
echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN}  ✅ Uninstallation Complete!${NC}"
echo -e "${GREEN}=========================================${NC}"
echo ""
echo -e "${BLUE}📝 Summary:${NC}"
echo "  • Server stopped"
echo "  • Systemd service removed"
echo "  • Binary deleted"
if [[ $REPLY =~ ^[Yy]$ ]] && [ "$FINAL_CONFIRM" = "YES" ]; then
    echo "  • All data deleted"
else
    echo "  • Data preserved in: ./data"
fi
echo ""
echo -e "${BLUE}💡 To reinstall:${NC}"
echo "  • Run: ./install.sh"
echo ""
echo -e "${BLUE}📚 Documentation:${NC}"
echo "  • README.md"
echo "  • INSTALL.md"
echo ""
