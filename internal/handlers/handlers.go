package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"strconv"
	"time"

	"github.com/cutefinance/pwa/internal/models"
	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
)

type Handler struct {
	db          *sql.DB
	authHandler *AuthHandler
}

func New(db *sql.DB, authHandler *AuthHandler) *Handler {
	return &Handler{db: db, authHandler: authHandler}
}

// getUserID extracts user ID from request context
func getUserID(r *http.Request) (int64, error) {
	userIDStr := r.Header.Get("X-User-ID")
	if userIDStr == "" {
		return 0, sql.ErrNoRows
	}
	return strconv.ParseInt(userIDStr, 10, 64)
}

// GetProfile returns user profile
func (h *Handler) GetProfile(w http.ResponseWriter, r *http.Request) {
	userID, err := getUserID(r)
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	var profile models.UserProfile
	err = h.db.QueryRow(`
		SELECT id, user_id, mascot, currency, payday_date, budget_rule, monthly_income, setup_complete, created_at, updated_at
		FROM user_profiles WHERE user_id = ?
	`, userID).Scan(&profile.ID, &profile.UserID, &profile.Mascot, &profile.Currency, &profile.PaydayDate,
		&profile.BudgetRule, &profile.MonthlyIncome, &profile.SetupComplete,
		&profile.CreatedAt, &profile.UpdatedAt)

	if err == sql.ErrNoRows {
		json.NewEncoder(w).Encode(nil)
		return
	}
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(profile)
}

// SaveProfile saves user profile
func (h *Handler) SaveProfile(w http.ResponseWriter, r *http.Request) {
	userID, err := getUserID(r)
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	var profile models.UserProfile
	if err := json.NewDecoder(r.Body).Decode(&profile); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Check if profile exists
	var count int
	h.db.QueryRow("SELECT COUNT(*) FROM user_profiles WHERE user_id = ?", userID).Scan(&count)

	if count == 0 {
		// Insert new profile
		_, err := h.db.Exec(`
			INSERT INTO user_profiles (user_id, mascot, currency, payday_date, budget_rule, monthly_income, setup_complete)
			VALUES (?, ?, ?, ?, ?, ?, ?)
		`, userID, profile.Mascot, profile.Currency, profile.PaydayDate, profile.BudgetRule,
			profile.MonthlyIncome, profile.SetupComplete)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	} else {
		// Update existing profile
		_, err := h.db.Exec(`
			UPDATE user_profiles SET mascot=?, currency=?, payday_date=?, budget_rule=?,
			monthly_income=?, setup_complete=?, updated_at=CURRENT_TIMESTAMP
			WHERE user_id=?
		`, profile.Mascot, profile.Currency, profile.PaydayDate, profile.BudgetRule,
			profile.MonthlyIncome, profile.SetupComplete, userID)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
}

// GetTransactions returns all transactions for the user
func (h *Handler) GetTransactions(w http.ResponseWriter, r *http.Request) {
	userID, err := getUserID(r)
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	rows, err := h.db.Query(`
		SELECT id, amount, category, account, note, date, type, created_at
		FROM transactions WHERE user_id = ?
		ORDER BY date DESC, created_at DESC
	`, userID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var transactions []models.Transaction
	for rows.Next() {
		var t models.Transaction
		if err := rows.Scan(&t.ID, &t.Amount, &t.Category, &t.Account, &t.Note, &t.Date, &t.Type, &t.CreatedAt); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		t.UserID = userID
		transactions = append(transactions, t)
	}

	if transactions == nil {
		transactions = []models.Transaction{}
	}

	json.NewEncoder(w).Encode(transactions)
}

// AddTransaction adds a new transaction
func (h *Handler) AddTransaction(w http.ResponseWriter, r *http.Request) {
	userID, err := getUserID(r)
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	var t models.Transaction
	if err := json.NewDecoder(r.Body).Decode(&t); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Generate ID if not provided
	if t.ID == "" {
		t.ID = uuid.New().String()
	}
	t.UserID = userID

	_, err = h.db.Exec(`
		INSERT INTO transactions (id, user_id, amount, category, account, note, date, type)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?)
	`, t.ID, userID, t.Amount, t.Category, t.Account, t.Note, t.Date, t.Type)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(t)
}

// DeleteTransaction deletes a transaction
func (h *Handler) DeleteTransaction(w http.ResponseWriter, r *http.Request) {
	userID, err := getUserID(r)
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	id := chi.URLParam(r, "id")

	// Verify the transaction belongs to the user
	var count int
	h.db.QueryRow("SELECT COUNT(*) FROM transactions WHERE id = ? AND user_id = ?", id, userID).Scan(&count)
	if count == 0 {
		http.Error(w, "Transaction not found", http.StatusNotFound)
		return
	}

	_, err = h.db.Exec("DELETE FROM transactions WHERE id = ? AND user_id = ?", id, userID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"status": "deleted"})
}

// GetBudget returns current month budget
func (h *Handler) GetBudget(w http.ResponseWriter, r *http.Request) {
	userID, err := getUserID(r)
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	currentMonth := time.Now().Format("2006-01")

	var budget models.MonthlyBudget
	err = h.db.QueryRow(`
		SELECT id, month, total_income, total_spent, created_at, updated_at
		FROM monthly_budgets WHERE user_id = ? AND month = ?
	`, userID, currentMonth).Scan(&budget.ID, &budget.Month, &budget.TotalIncome, &budget.TotalSpent,
		&budget.CreatedAt, &budget.UpdatedAt)

	if err == sql.ErrNoRows {
		json.NewEncoder(w).Encode(nil)
		return
	}
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	budget.UserID = userID

	// Get categories
	rows, err := h.db.Query(`
		SELECT category, limit_amount, spent, color
		FROM budget_categories WHERE budget_id = ?
	`, budget.ID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var categories []models.BudgetCategory
	for rows.Next() {
		var cat models.BudgetCategory
		if err := rows.Scan(&cat.Category, &cat.Limit, &cat.Spent, &cat.Color); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		categories = append(categories, cat)
	}
	budget.Categories = categories

	json.NewEncoder(w).Encode(budget)
}

// SaveBudget saves monthly budget
func (h *Handler) SaveBudget(w http.ResponseWriter, r *http.Request) {
	userID, err := getUserID(r)
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	var budget models.MonthlyBudget
	if err := json.NewDecoder(r.Body).Decode(&budget); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	budget.UserID = userID

	// Insert or update budget
	_, err = h.db.Exec(`
		INSERT INTO monthly_budgets (user_id, month, total_income, total_spent)
		VALUES (?, ?, ?, ?)
		ON CONFLICT(user_id, month) DO UPDATE SET
		total_income=excluded.total_income,
		total_spent=excluded.total_spent,
		updated_at=CURRENT_TIMESTAMP
	`, userID, budget.Month, budget.TotalIncome, budget.TotalSpent)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Get budget ID
	var budgetID int64
	h.db.QueryRow("SELECT id FROM monthly_budgets WHERE user_id = ? AND month = ?", userID, budget.Month).Scan(&budgetID)

	// Delete existing categories
	h.db.Exec("DELETE FROM budget_categories WHERE budget_id = ?", budgetID)

	// Insert categories
	for _, cat := range budget.Categories {
		_, err := h.db.Exec(`
			INSERT INTO budget_categories (budget_id, category, limit_amount, spent, color)
			VALUES (?, ?, ?, ?, ?)
		`, budgetID, cat.Category, cat.Limit, cat.Spent, cat.Color)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
}

// SyncData returns data for client sync
func (h *Handler) SyncData(w http.ResponseWriter, r *http.Request) {
	userID, err := getUserID(r)
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	var req models.SyncRequest
	json.NewDecoder(r.Body).Decode(&req)

	var response models.SyncResponse
	response.ServerTime = time.Now()

	// Get profile
	var profile models.UserProfile
	err = h.db.QueryRow(`
		SELECT id, user_id, mascot, currency, payday_date, budget_rule, monthly_income, setup_complete, created_at, updated_at
		FROM user_profiles WHERE user_id = ?
	`, userID).Scan(&profile.ID, &profile.UserID, &profile.Mascot, &profile.Currency, &profile.PaydayDate,
		&profile.BudgetRule, &profile.MonthlyIncome, &profile.SetupComplete,
		&profile.CreatedAt, &profile.UpdatedAt)
	if err == nil {
		response.Profile = &profile
	}

	// Get transactions since last sync
	rows, err := h.db.Query(`
		SELECT id, amount, category, account, note, date, type, created_at
		FROM transactions WHERE user_id = ? AND created_at > ?
		ORDER BY created_at DESC
	`, userID, req.LastSync)
	if err == nil {
		defer rows.Close()
		for rows.Next() {
			var t models.Transaction
			rows.Scan(&t.ID, &t.Amount, &t.Category, &t.Account, &t.Note, &t.Date, &t.Type, &t.CreatedAt)
			t.UserID = userID
			response.Transactions = append(response.Transactions, t)
		}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// ExportData exports all user data
func (h *Handler) ExportData(w http.ResponseWriter, r *http.Request) {
	userID, err := getUserID(r)
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	var export models.ExportData
	export.ExportDate = time.Now()

	// Get profile
	var profile models.UserProfile
	err = h.db.QueryRow(`
		SELECT id, user_id, mascot, currency, payday_date, budget_rule, monthly_income, setup_complete, created_at, updated_at
		FROM user_profiles WHERE user_id = ?
	`, userID).Scan(&profile.ID, &profile.UserID, &profile.Mascot, &profile.Currency, &profile.PaydayDate,
		&profile.BudgetRule, &profile.MonthlyIncome, &profile.SetupComplete,
		&profile.CreatedAt, &profile.UpdatedAt)
	if err == nil {
		export.Profile = &profile
	}

	// Get transactions
	rows, err := h.db.Query(`
		SELECT id, amount, category, account, note, date, type, created_at
		FROM transactions WHERE user_id = ?
		ORDER BY date DESC
	`, userID)
	if err == nil {
		defer rows.Close()
		for rows.Next() {
			var t models.Transaction
			rows.Scan(&t.ID, &t.Amount, &t.Category, &t.Account, &t.Note, &t.Date, &t.Type, &t.CreatedAt)
			t.UserID = userID
			export.Transactions = append(export.Transactions, t)
		}
	}

	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Content-Disposition", "attachment; filename=cutefinance-export.json")
	json.NewEncoder(w).Encode(export)
}
