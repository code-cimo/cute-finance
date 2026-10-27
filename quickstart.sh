#!/bin/bash

# Quick Start Script for CuteFinance PWA
# Usage: ./quickstart.sh [command]
# Commands: dev, build, docker, docker-up, docker-down

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

show_help() {
    echo -e "${BLUE}🐾 CuteFinance PWA - Quick Start${NC}"
    echo ""
    echo "Usage: ./quickstart.sh [command]"
    echo ""
    echo "Commands:"
    echo "  dev          Start development server"
    echo "  build        Build for production"
    echo "  preview      Preview production build"
    echo "  docker       Build Docker image"
    echo "  docker-up    Start Docker container"
    echo "  docker-down  Stop Docker container"
    echo "  install      Run full installer"
    echo "  help         Show this help"
    echo ""
}

cmd_dev() {
    echo -e "${GREEN}Starting development server...${NC}"
    npm run dev
}

cmd_build() {
    echo -e "${GREEN}Building for production...${NC}"
    npm run build
    echo -e "${GREEN}Build complete! Files in dist/${NC}"
}

cmd_preview() {
    echo -e "${GREEN}Preview production build...${NC}"
    npm run preview
}

cmd_docker() {
    echo -e "${GREEN}Building Docker image...${NC}"
    docker build -t cutefinance-pwa .
    echo -e "${GREEN}Docker image built successfully!${NC}"
}

cmd_docker_up() {
    echo -e "${GREEN}Starting Docker container...${NC}"
    docker-compose up -d
    echo -e "${GREEN}Container started!${NC}"
    echo -e "${BLUE}Access at: http://localhost:8080${NC}"
}

cmd_docker_down() {
    echo -e "${GREEN}Stopping Docker container...${NC}"
    docker-compose down
    echo -e "${GREEN}Container stopped!${NC}"
}

cmd_install() {
    echo -e "${GREEN}Running full installer...${NC}"
    chmod +x install.sh
    ./install.sh
}

# Main
case "${1:-}" in
    dev)
        cmd_dev
        ;;
    build)
        cmd_build
        ;;
    preview)
        cmd_preview
        ;;
    docker)
        cmd_docker
        ;;
    docker-up)
        cmd_docker_up
        ;;
    docker-down)
        cmd_docker_down
        ;;
    install)
        cmd_install
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        show_help
        ;;
esac
