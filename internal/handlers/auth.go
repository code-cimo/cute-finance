package handlers

import (
	"crypto/rand"
	"database/sql"
	"encoding/hex"
	"encoding/json"
	"net/http"
	"time"

	"github.com/cutefinance/pwa/internal/models"
	"golang.org/x/crypto/bcrypt"
)

type AuthHandler struct {
	db *sql.DB
}

func NewAuthHandler(db *sql.DB) *AuthHandler {
	return &AuthHandler{db: db}
}

// Register creates a new user account
func (h *AuthHandler) Register(w http.ResponseWriter, r *http.Request) {
	var req models.RegisterRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Validate input
	if req.Username == "" || req.Email == "" || req.Password == "" {
		http.Error(w, "Username, email, and password are required", http.StatusBadRequest)
		return
	}

	if len(req.Password) < 6 {
		http.Error(w, "Password must be at least 6 characters", http.StatusBadRequest)
		return
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		http.Error(w, "Failed to hash password", http.StatusInternalServerError)
		return
	}

	// Insert user
	result, err := h.db.Exec(`
		INSERT INTO users (username, email, password_hash)
		VALUES (?, ?, ?)
	`, req.Username, req.Email, string(hashedPassword))

	if err != nil {
		if err.Error() == "UNIQUE constraint failed: users.username" {
			http.Error(w, "Username already exists", http.StatusConflict)
			return
		}
		if err.Error() == "UNIQUE constraint failed: users.email" {
			http.Error(w, "Email already exists", http.StatusConflict)
			return
		}
		http.Error(w, "Failed to create user", http.StatusInternalServerError)
		return
	}

	userID, _ := result.LastInsertId()

	// Create default profile
	_, err = h.db.Exec(`
		INSERT INTO user_profiles (user_id, mascot, currency, payday_date, budget_rule, monthly_income, setup_complete)
		VALUES (?, 'panda', 'IDR', 25, '50-30-20', 0, 0)
	`, userID)

	if err != nil {
		http.Error(w, "Failed to create user profile", http.StatusInternalServerError)
		return
	}

	// Generate device token
	deviceToken, err := generateToken()
	if err != nil {
		http.Error(w, "Failed to generate device token", http.StatusInternalServerError)
		return
	}

	// Register device
	userAgent := r.UserAgent()
	platform := detectPlatform(userAgent)

	result, err = h.db.Exec(`
		INSERT INTO devices (user_id, token, name, platform)
		VALUES (?, ?, ?, ?)
	`, userID, deviceToken, "Web Browser", platform)

	if err != nil {
		http.Error(w, "Failed to register device", http.StatusInternalServerError)
		return
	}

	deviceID, _ := result.LastInsertId()

	// Create session
	sessionToken, err := generateToken()
	if err != nil {
		http.Error(w, "Failed to generate session token", http.StatusInternalServerError)
		return
	}

	expiresAt := time.Now().Add(30 * 24 * time.Hour) // 30 days
	_, err = h.db.Exec(`
		INSERT INTO sessions (token, user_id, device_id, expires_at)
		VALUES (?, ?, ?, ?)
	`, sessionToken, userID, deviceID, expiresAt)

	if err != nil {
		http.Error(w, "Failed to create session", http.StatusInternalServerError)
		return
	}

	// Return response
	response := models.AuthResponse{
		Token:    sessionToken,
		UserID:   userID,
		Username: req.Username,
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(response)
}

// Login authenticates a user
func (h *AuthHandler) Login(w http.ResponseWriter, r *http.Request) {
	var req models.LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Find user by username
	var user models.User
	err := h.db.QueryRow(`
		SELECT id, username, email, password_hash
		FROM users WHERE username = ?
	`, req.Username).Scan(&user.ID, &user.Username, &user.Email, &user.PasswordHash)

	if err == sql.ErrNoRows {
		http.Error(w, "Invalid username or password", http.StatusUnauthorized)
		return
	}
	if err != nil {
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	// Check password
	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password)); err != nil {
		http.Error(w, "Invalid username or password", http.StatusUnauthorized)
		return
	}

	// Generate device token
	deviceToken, err := generateToken()
	if err != nil {
		http.Error(w, "Failed to generate device token", http.StatusInternalServerError)
		return
	}

	// Register device
	userAgent := r.UserAgent()
	platform := detectPlatform(userAgent)

	result, err := h.db.Exec(`
		INSERT INTO devices (user_id, token, name, platform)
		VALUES (?, ?, ?, ?)
	`, user.ID, deviceToken, "Web Browser", platform)

	if err != nil {
		http.Error(w, "Failed to register device", http.StatusInternalServerError)
		return
	}

	deviceID, _ := result.LastInsertId()

	// Create session
	sessionToken, err := generateToken()
	if err != nil {
		http.Error(w, "Failed to generate session token", http.StatusInternalServerError)
		return
	}

	expiresAt := time.Now().Add(30 * 24 * time.Hour) // 30 days
	_, err = h.db.Exec(`
		INSERT INTO sessions (token, user_id, device_id, expires_at)
		VALUES (?, ?, ?, ?)
	`, sessionToken, user.ID, deviceID, expiresAt)

	if err != nil {
		http.Error(w, "Failed to create session", http.StatusInternalServerError)
		return
	}

	// Update last active
	h.db.Exec(`UPDATE devices SET last_active = CURRENT_TIMESTAMP WHERE id = ?`, deviceID)

	// Return response
	response := models.AuthResponse{
		Token:    sessionToken,
		UserID:   user.ID,
		Username: user.Username,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// Logout invalidates a session
func (h *AuthHandler) Logout(w http.ResponseWriter, r *http.Request) {
	token := r.Header.Get("Authorization")
	if token == "" {
		http.Error(w, "Authorization header required", http.StatusBadRequest)
		return
	}

	// Remove session
	_, err := h.db.Exec("DELETE FROM sessions WHERE token = ?", token)
	if err != nil {
		http.Error(w, "Failed to logout", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"status": "logged out"})
}

// ValidateSession checks if a session token is valid
func (h *AuthHandler) ValidateSession(token string) (int64, error) {
	var userID int64
	var expiresAt time.Time

	err := h.db.QueryRow(`
		SELECT user_id, expires_at
		FROM sessions WHERE token = ?
	`, token).Scan(&userID, &expiresAt)

	if err == sql.ErrNoRows {
		return 0, sql.ErrNoRows
	}
	if err != nil {
		return 0, err
	}

	// Check if expired
	if time.Now().After(expiresAt) {
		// Delete expired session
		h.db.Exec("DELETE FROM sessions WHERE token = ?", token)
		return 0, sql.ErrNoRows
	}

	return userID, nil
}

// AuthMiddleware validates authentication token
func (h *AuthHandler) AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		token := r.Header.Get("Authorization")
		if token == "" {
			http.Error(w, "Authorization required", http.StatusUnauthorized)
			return
		}

		userID, err := h.ValidateSession(token)
		if err != nil {
			http.Error(w, "Invalid or expired token", http.StatusUnauthorized)
			return
		}

		// Add userID to context
		r.Header.Set("X-User-ID", string(rune(userID)))
		
		next.ServeHTTP(w, r)
	})
}

// Helper functions
func generateToken() (string, error) {
	bytes := make([]byte, 32)
	if _, err := rand.Read(bytes); err != nil {
		return "", err
	}
	return hex.EncodeToString(bytes), nil
}

func detectPlatform(userAgent string) string {
	// Simple platform detection
	if contains(userAgent, "Android") {
		return "android"
	}
	if contains(userAgent, "iPhone") || contains(userAgent, "iPad") {
		return "ios"
	}
	if contains(userAgent, "Windows") {
		return "windows"
	}
	if contains(userAgent, "Mac") {
		return "macos"
	}
	if contains(userAgent, "Linux") {
		return "linux"
	}
	return "unknown"
}

func contains(s, substr string) bool {
	return len(s) >= len(substr) && (s == substr || len(s) > len(substr) && (s[:len(substr)] == substr || contains(s[1:], substr)))
}
