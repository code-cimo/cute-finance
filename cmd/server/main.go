package main

import (
	"database/sql"
	"encoding/json"
	"flag"
	"fmt"
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

const AppVersion = "2.0.0"

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

	// Set defaults if config is empty
	if config.Port == 0 {
		config.Port = 8080
	}
	if config.DataDir == "" {
		config.DataDir = "./data"
	}

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
	log.Printf("🔐 Authentication: Enabled")

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

	// Initialize handlers
	authHandler := handlers.NewAuthHandler(db)
	dataHandler := handlers.New(db, authHandler)

	// Public routes (no auth required)
	r.Post("/api/auth/register", authHandler.Register)
	r.Post("/api/auth/login", authHandler.Login)
	r.Post("/api/auth/logout", authHandler.Logout)

	// Protected routes (auth required)
	r.Group(func(r chi.Router) {
		r.Use(authHandler.AuthMiddleware)

		// Profile
		r.Get("/api/profile", dataHandler.GetProfile)
		r.Post("/api/profile", dataHandler.SaveProfile)

		// Transactions
		r.Get("/api/transactions", dataHandler.GetTransactions)
		r.Post("/api/transactions", dataHandler.AddTransaction)
		r.Delete("/api/transactions/{id}", dataHandler.DeleteTransaction)

		// Budget
		r.Get("/api/budget", dataHandler.GetBudget)
		r.Post("/api/budget", dataHandler.SaveBudget)

		// Sync
		r.Post("/api/sync", dataHandler.SyncData)

		// Export
		r.Get("/api/export", dataHandler.ExportData)
	})

	// Health check (public)
	r.Get("/api/health", func(w http.ResponseWriter, r *http.Request) {
		json.NewEncoder(w).Encode(map[string]string{
			"status":  "ok",
			"version": AppVersion,
		})
	})

	// Serve frontend from disk
	serveFrontend(r)

	return r
}

func serveFrontend(r *chi.Mux) {
	// Check multiple possible locations for frontend
	locations := []string{
		"./dist",           // Default build output
		"./frontend/dist",  // Frontend subdirectory
		"../dist",          // Parent directory
	}

	for _, loc := range locations {
		if info, err := os.Stat(loc); err == nil && info.IsDir() {
			log.Printf("📂 Serving frontend from: %s", loc)
			fileServer := http.FileServer(http.Dir(loc))
			r.Handle("/*", fileServer)
			return
		}
	}

	// No frontend found - serve helpful message
	log.Println("⚠️  Frontend not found. Please build frontend first:")
	log.Println("   npm run build")
	log.Println("   Or copy frontend dist to ./dist")
	
	r.Get("/*", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "text/html; charset=utf-8")
		fmt.Fprintf(w, `<!DOCTYPE html>
<html>
<head>
    <title>CuteFinance PWA</title>
    <style>
        body { font-family: 'Nunito', sans-serif; text-align: center; padding: 50px; background: linear-gradient(180deg, #FFF9C4 0%%, #FFF8E1 50%%, #FFFFFF 100%%); }
        .container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        h1 { color: #5D4037; }
        .mascot { font-size: 80px; margin: 20px 0; }
        code { background: #f5f5f5; padding: 2px 8px; border-radius: 4px; font-family: monospace; }
        pre { background: #f5f5f5; padding: 15px; border-radius: 8px; text-align: left; overflow-x: auto; }
        .btn { display: inline-block; background: #F8BBD0; color: white; padding: 12px 24px; border-radius: 12px; text-decoration: none; font-weight: bold; margin: 10px 5px; }
        .btn:hover { background: #F48FB1; }
    </style>
</head>
<body>
    <div class="container">
        <div class="mascot">🐾</div>
        <h1>CuteFinance PWA v%s</h1>
        <p><strong>Backend is running!</strong> ✅</p>
        <p>But frontend needs to be built first.</p>
        
        <h3>🔨 Build Frontend:</h3>
        <pre><code>npm run build</code></pre>
        
        <p>Then refresh this page or restart the server.</p>
        
        <hr style="margin: 30px 0; border: none; border-top: 2px dashed #F8BBD0;">
        
        <h3>🔌 API Endpoints:</h3>
        <p>
            <a href="/api/health" class="btn">/api/health</a>
        </p>
        
        <p style="margin-top: 30px; color: #999; font-size: 12px;">
            CuteFinance PWA v%s • Made with 🐾
        </p>
    </div>
</body>
</html>`, AppVersion, AppVersion)
	})
}
