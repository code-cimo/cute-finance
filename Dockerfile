# Multi-stage build for CuteFinance PWA

# Stage 1: Build frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Build Go backend
FROM golang:1.22-alpine AS backend-builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-w -s" -o cute-finance ./cmd/server

# Stage 3: Final runtime
FROM alpine:latest
WORKDIR /app

# Install runtime dependencies
RUN apk --no-cache add ca-certificates tzdata

# Copy binary
COPY --from=backend-builder /app/cute-finance .

# Copy frontend build
COPY --from=frontend-builder /app/dist ./dist

# Create data directory
RUN mkdir -p /app/data

# Expose port (will be overridden by config)
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/api/health || exit 1

# Run the application
CMD ["./cute-finance"]
