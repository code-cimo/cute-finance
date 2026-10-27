package main

import (
	"database/sql"
	"embed"
	"encoding/json"
	"flag"
	"fmt"
	"io/fs"
	"log"
	"net/http"
	"os"
	"os/signal"
	"path/filepath"
	"syscall"

	"github.com/cutefinance/pwa/internal/database"
	"github.com/cutefinance/pwa/internal/handlers"
	"github.com/cutefinance/pwa/internal/installer"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
)

//go:embed dist/*
var frontendFS embed.FS

const AppVersion = "1.0.0"

// Config holds application configuration
type Config struct {
	Port    int    `json:"port"`
	DataDir string `json:"data_dir"`
}

// Global config
var config Config

func main() {
	// Define flags with default values
	port := flag.Int("port", 0, "Server port (0 = use config file)")
	dataDir := flag.String("data", "./data", "Data directory")
	install := flag.Bool("install", false, "Run interactive installer")
	version := flag.Bool("version", false, "Show version")
	
	flag.Parse()

	if *version {
		fmt.Printf("CuteFinance PWA v%s\n", AppVersion)
		os.Exit(0)
	}

	// If installer mode, run TUI and exit
	if *install {
		fmt.Printf("🔧 Running installer with data directory: %s\n\n", *dataDir)
		installer.Run(*dataDir)
		return
	}

	// Load config from data directory
	config = loadConfig(*dataDir)

	// Override config with command-line flags if provided
	if *port > 0 {
		config.Port = *port
		log.Printf("⚠️  Port overridden by flag: %d", *port)
	}
	
	// Ensure DataDir is set
	config.DataDir = *dataDir

	// Ensure data directory exists
	if err := os.MkdirAll(config.DataDir, 0755); err != nil {
		log.Fatalf("❌ Failed to create data directory: %v", err)
	}

	// Initialize database
	dbPath := filepath.Join(config.DataDir, "cutefinance.db")
	db, err := database.Init(dbPath)
	if err != nil {
		log.Fatalf("❌ Failed to initialize database: %v", err)
	}
	defer db.Close()

	// Setup router
	r := setupRouter(db)

	// Start server
	addr := fmt.Sprintf(":%d", config.Port)
	log.Printf("🐾 CuteFinance PWA v%s", AppVersion)
	log.Printf("📡 Server running on http://localhost%s", addr)
	log.Printf("💾 Database: %s", dbPath)
	log.Printf("📁 Data directory: %s", config.DataDir)

	// Graceful shutdown
	go func() {
		sigChan := make(chan os.Signal, 1)
		signal.Notify(sigChan, syscall.SIGINT, syscall.SIGTERM)
		<-sigChan
		log.Println("\n🛑 Shutting down gracefully...")
		os.Exit(0)
	}()

	if err := http.ListenAndServe(addr, r); err != nil {
		log.Fatalf("❌ Server failed: %v", err)
	}
}

func loadConfig(dataDir string) Config {
	configPath := filepath.Join(dataDir, "config.json")
	
	// Default config
	cfg := Config{
		Port:    8080,
		DataDir: dataDir,
	}

	// Try to read config file
	data, err := os.ReadFile(configPath)
	if err != nil {
		// Config file doesn't exist yet, return defaults
		return cfg
	}

	// Parse config
	if err := json.Unmarshal(data, &cfg); err != nil {
		log.Printf("⚠️  Warning: Failed to parse config file: %v", err)
		return Config{Port: 8080, DataDir: dataDir}
	}

	// Ensure DataDir is set
	if cfg.DataDir == "" {
		cfg.DataDir = dataDir
	}

	return cfg
}

func setupRouter(db *sql.DB) *chi.Mux {
	r := chi.NewRouter()

	// Middleware
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(middleware.Compress(5))
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	// API routes
	h := handlers.New(db)

	r.Route("/api", func(r chi.Router) {
		// Profile
		r.Get("/profile", h.GetProfile)
		r.Post("/profile", h.SaveProfile)

		// Transactions
		r.Get("/transactions", h.GetTransactions)
		r.Post("/transactions", h.AddTransaction)
		r.Delete("/transactions/{id}", h.DeleteTransaction)

		// Budget
		r.Get("/budget", h.GetBudget)
		r.Post("/budget", h.SaveBudget)

		// Export/Import
		r.Get("/export", h.ExportData)
		r.Post("/import", h.ImportData)

		// Health check
		r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
			json.NewEncoder(w).Encode(map[string]string{
				"status":  "ok",
				"version": AppVersion,
			})
		})
	})

	// Serve frontend (embedded)
	distFS, err := fs.Sub(frontendFS, "dist")
	if err != nil {
		log.Printf("⚠️  Warning: Frontend not embedded, serving from disk")
		fileServer := http.FileServer(http.Dir("./dist"))
		r.Handle("/*", fileServer)
	} else {
		fileServer := http.FileServer(http.FS(distFS))
		r.Handle("/*", fileServer)
	}

	return r
}
