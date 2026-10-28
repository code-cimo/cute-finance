#!/bin/bash

# CuteFinance PWA - Smart Uninstaller
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

# Check what exists
EXISTING_BINARY=false
EXISTING_SERVICE=false
EXISTING_DATA=false
EXISTING_CONFIG=false
EXISTING_NODE=false

[ -f "cute-finance" ] && EXISTING_BINARY=true
[ -f "/etc/systemd/system/cutefinance.service" ] && EXISTING_SERVICE=true
[ -d "data" ] && EXISTING_DATA=true
[ -f "data/config.json" ] && EXISTING_CONFIG=true
[ -d "node_modules" ] && EXISTING_NODE=true

# If nothing exists
if [ "$EXISTING_BINARY" = false ] && [ "$EXISTING_SERVICE" = false ] && [ "$EXISTING_DATA" = false ]; then
    echo -e "${YELLOW}ℹ️  No CuteFinance installation found${NC}"
    echo ""
    echo "Nothing to uninstall."
    exit 0
fi

# Show what exists
echo -e "${YELLOW}Found installation:${NC}"
[ "$EXISTING_BINARY" = true ] && echo "  • Binary: cute-finance"
[ "$EXISTING_SERVICE" = true ] && echo "  • Service: cutefinance (systemd)"
[ "$EXISTING_DATA" = true ] && echo "  • Data: ./data/"
[ "$EXISTING_CONFIG" = true ] && echo "  • Config: data/config.json"
[ "$EXISTING_NODE" = true ] && echo "  • Node modules: ./node_modules/"
echo ""

# Warning
echo -e "${RED}⚠️  WARNING: This will uninstall CuteFinance PWA${NC}"
echo ""

# Confirmation
read -p "Are you sure you want to uninstall? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Uninstallation cancelled."
    exit 0
fi

echo ""

# ============================================
# STEP 1: Stop server
# ============================================
echo -e "${BLUE}[1/5] Stopping server...${NC}"
if pgrep -f "cute-finance" > /dev/null; then
    pkill -f cute-finance
    echo -e "${GREEN}✅ Server stopped${NC}"
else
    echo -e "${NC}ℹ️  Server not running${NC}"
fi
echo ""

# ============================================
# STEP 2: Remove systemd service
# ============================================
echo -e "${BLUE}[2/5] Removing systemd service...${NC}"
if [ "$EXISTING_SERVICE" = true ]; then
    sudo systemctl stop cutefinance 2>/dev/null || true
    sudo systemctl disable cutefinance 2>/dev/null || true
    sudo rm -f /etc/systemd/system/cutefinance.service
    sudo systemctl daemon-reload
    echo -e "${GREEN}✅ Systemd service removed${NC}"
else
    echo -e "${NC}ℹ️  Systemd service not found${NC}"
fi
echo ""

# ============================================
# STEP 3: Remove binary
# ============================================
echo -e "${BLUE}[3/5] Removing binary files...${NC}"
if [ "$EXISTING_BINARY" = true ]; then
    rm -f cute-finance
    echo -e "${GREEN}✅ Binary removed${NC}"
else
    echo -e "${NC}ℹ️  Binary not found${NC}"
fi

# Remove other binaries
for binary in cute-finance-linux-arm64 cute-finance-linux-amd64 cute-finance-arm64 cute-finance-amd64; do
    if [ -f "$binary" ]; then
        rm -f "$binary"
        echo -e "${GREEN}✅ Removed: $binary${NC}"
    fi
done
echo ""

# ============================================
# STEP 4: Data Management
# ============================================
echo -e "${BLUE}[4/5] Data Management${NC}"
echo ""

if [ "$EXISTING_DATA" = true ]; then
    echo -e "${YELLOW}What would you like to do with your data?${NC}"
    echo ""
    echo "  1) 🗑️  Delete all data (database, config, everything)"
    echo "  2) 💾 Keep data (preserve database and config)"
    echo ""
    read -p "Choose option (1-2): " DATA_CHOICE
    
    case $DATA_CHOICE in
        1)
            echo ""
            echo -e "${RED}⚠️  WARNING: This will DELETE all data permanently!${NC}"
            read -p "Are you REALLY sure? Type 'YES' to confirm: " FINAL_CONFIRM
            
            if [ "$FINAL_CONFIRM" = "YES" ]; then
                echo ""
                echo "Deleting data..."
                
                if [ -d "data" ]; then
                    rm -rf data
                    echo -e "${GREEN}✅ Data directory deleted${NC}"
                fi
                
                if [ -d "dist" ]; then
                    rm -rf dist
                    echo -e "${GREEN}✅ Frontend build deleted${NC}"
                fi
            else
                echo "Data deletion cancelled."
                echo "Data preserved in: ./data"
            fi
            ;;
        2|*)
            echo "Data preserved in: ./data"
            ;;
    esac
else
    echo -e "${NC}ℹ️  No data found${NC}"
fi

echo ""

# ============================================
# STEP 5: Cleanup
# ============================================
echo -e "${BLUE}[5/5] Cleanup${NC}"
echo ""

# Node modules
if [ "$EXISTING_NODE" = true ]; then
    read -p "Delete node_modules? (y/n) " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "Deleting node_modules..."
        rm -rf node_modules
        echo -e "${GREEN}✅ node_modules deleted${NC}"
    else
        echo "node_modules preserved"
    fi
else
    echo -e "${NC}ℹ️  node_modules not found${NC}"
fi

# Log files
if ls install-*.log 1> /dev/null 2>&1; then
    echo ""
    read -p "Delete install log files? (y/n) " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        rm -f install-*.log
        echo -e "${GREEN}✅ Log files deleted${NC}"
    else
        echo "Log files preserved"
    fi
fi

echo ""

# ============================================
# SUCCESS MESSAGE
# ============================================
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  ✅ Uninstallation Complete!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${BLUE}📝 Summary:${NC}"
echo "  • Server stopped"
echo "  • Systemd service removed"
echo "  • Binary deleted"

if [ "$DATA_CHOICE" = "1" ] && [ "$FINAL_CONFIRM" = "YES" ]; then
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
