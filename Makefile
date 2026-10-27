.PHONY: build run test clean docker docker-run install help

# Variables
APP_NAME = cute-finance
VERSION = 1.0.0
BUILD_TIME = $(shell date -u +"%Y-%m-%dT%H:%M:%SZ")
LDFLAGS = -ldflags "-w -s -X main.version=$(VERSION) -X main.buildTime=$(BUILD_TIME)"

# Default target
all: build

# Build the application
build: deps
	@echo "🔨 Building $(APP_NAME)..."
	go build $(LDFLAGS) -o $(APP_NAME) ./cmd/server
	@echo "✅ Build complete: ./$(APP_NAME)"

# Build for ARM64 (Odroid C2)
build-arm64: deps
	@echo "🔨 Building $(APP_NAME) for ARM64..."
	GOOS=linux GOARCH=arm64 CGO_ENABLED=0 go build $(LDFLAGS) -o $(APP_NAME)-arm64 ./cmd/server
	@echo "✅ Build complete: ./$(APP_NAME)-arm64"

# Build for x86_64
build-amd64: deps
	@echo "🔨 Building $(APP_NAME) for x86_64..."
	GOOS=linux GOARCH=amd64 CGO_ENABLED=0 go build $(LDFLAGS) -o $(APP_NAME)-amd64 ./cmd/server
	@echo "✅ Build complete: ./$(APP_NAME)-amd64"

# Build for all platforms
build-all: build build-arm64 build-amd64
	@echo "✅ All builds complete"

# Run the application
run: build
	@echo "🚀 Starting $(APP_NAME)..."
	./$(APP_NAME)

# Run with custom port
run-port:
	@echo "🚀 Starting $(APP_NAME) on port $(PORT)..."
	./$(APP_NAME) -port $(PORT)

# Run installer
install-tui: build
	@echo "🔧 Running installer..."
	./$(APP_NAME) -install

# Run tests
test:
	@echo "🧪 Running tests..."
	go test -v ./...

# Run tests with coverage
test-coverage:
	@echo "🧪 Running tests with coverage..."
	go test -coverprofile=coverage.out ./...
	go tool cover -html=coverage.out -o coverage.html
	@echo "✅ Coverage report: coverage.html"

# Clean build artifacts
clean:
	@echo "🧹 Cleaning..."
	rm -f $(APP_NAME) $(APP_NAME)-arm64
	rm -f coverage.out coverage.html
	rm -rf data/
	@echo "✅ Clean complete"

# Build Docker image
docker:
	@echo "🐳 Building Docker image..."
	docker build -t $(APP_NAME):$(VERSION) .
	docker tag $(APP_NAME):$(VERSION) $(APP_NAME):latest
	@echo "✅ Docker image built: $(APP_NAME):$(VERSION)"

# Run Docker container
docker-run:
	@echo "🐳 Starting Docker container..."
	docker run -d \
		--name $(APP_NAME) \
		-p 8080:8080 \
		-v $(PWD)/data:/app/data \
		--restart unless-stopped \
		$(APP_NAME):latest
	@echo "✅ Container started: http://localhost:8080"

# Stop Docker container
docker-stop:
	@echo "🐳 Stopping Docker container..."
	docker stop $(APP_NAME)
	docker rm $(APP_NAME)
	@echo "✅ Container stopped"

# View Docker logs
docker-logs:
	docker logs -f $(APP_NAME)

# Install dependencies
deps:
	@echo "📦 Installing dependencies..."
	go mod download
	go mod tidy
	@echo "✅ Dependencies installed"

# Clean and reinstall dependencies
deps-clean:
	@echo "🧹 Cleaning dependencies..."
	rm -f go.sum
	go clean -modcache
	go mod download
	go mod tidy
	@echo "✅ Dependencies reinstalled"

# Format code
fmt:
	@echo "🎨 Formatting code..."
	go fmt ./...
	@echo "✅ Code formatted"

# Run linter
lint:
	@echo "🔍 Running linter..."
	golangci-lint run
	@echo "✅ Linting complete"

# Generate documentation
docs:
	@echo "📚 Generating documentation..."
	go doc -all ./... > docs/api.md
	@echo "✅ Documentation generated: docs/api.md"

# Build frontend (requires Node.js)
frontend:
	@echo "🎨 Building frontend..."
	cd frontend && npm install && npm run build
	@echo "✅ Frontend built: dist/"

# Full build (frontend + backend)
full-build: frontend build
	@echo "✅ Full build complete"

# Development mode (watch mode)
dev:
	@echo "🔧 Starting development mode..."
	go run ./cmd/server -port 8080

# Show help
help:
	@echo "CuteFinance PWA - Makefile Commands"
	@echo ""
	@echo "Usage: make [target]"
	@echo ""
	@echo "Build Targets:"
	@echo "  build          Build for current platform"
	@echo "  build-arm64    Build for ARM64 (Odroid C2)"
	@echo "  build-amd64    Build for x86_64"
	@echo "  build-all      Build for all platforms"
	@echo ""
	@echo "Run Targets:"
	@echo "  run            Build and run the application"
	@echo "  run-port       Run with custom port (PORT=8080)"
	@echo "  install-tui    Run interactive installer"
	@echo "  dev            Run in development mode"
	@echo ""
	@echo "Dependency Targets:"
	@echo "  deps           Install Go dependencies"
	@echo "  deps-clean     Clean and reinstall dependencies"
	@echo ""
	@echo "Test Targets:"
	@echo "  test           Run tests"
	@echo "  test-coverage  Run tests with coverage"
	@echo ""
	@echo "Docker Targets:"
	@echo "  docker         Build Docker image"
	@echo "  docker-run     Run Docker container"
	@echo "  docker-stop    Stop Docker container"
	@echo "  docker-logs    View Docker logs"
	@echo ""
	@echo "Utility Targets:"
	@echo "  clean          Clean build artifacts"
	@echo "  fmt            Format code"
	@echo "  lint           Run linter"
	@echo "  docs           Generate documentation"
	@echo "  frontend       Build frontend (requires Node.js)"
	@echo "  full-build     Build frontend + backend"
	@echo "  help           Show this help"
