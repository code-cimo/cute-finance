package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"time"

	"github.com/cutefinance/pwa/internal/models"
	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
)

type Handler struct {
	db *sql.DB
}

func New(db *sql.DB) *Handler {
	return &Handler{db: db}
}

// GetProfile returns user profile
func (h *Handler) GetProfile(w http.ResponseWriter, r *http.Request) {
	var profile models.UserProfile
	err := h.db.QueryRow(`
		SELECT id, mascot, currency, payday_date, budget_rule, monthly_income, setup_complete, created_at, updated_at
		FROM user_profile LIMIT 1
	`).Scan(&profile.ID, &profile.Mascot, &profile.Currency, &profile.PaydayDate,
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
	var profile models.UserProfile
	if err := json.NewDecoder(r.Body).Decode(&profile); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Check if profile exists
	var count int
	h.db.QueryRow("SELECT COUNT(*) FROM user_profile").Scan(&count)

	if count == 0 {
		// Insert new profile
		_, err := h.db.Exec(`
			INSERT INTO user_profile (mascot, currency, payday_date, budget_rule, monthly_income, setup_complete)
			VALUES (?, ?, ?, ?, ?, ?)
		`, profile.Mascot, profile.Currency, profile.PaydayDate, profile.BudgetRule,
			profile.MonthlyIncome, profile.SetupComplete)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	} else {
		// Update existing profile
		_, err := h.db.Exec(`
			UPDATE user_profile SET mascot=?, currency=?, payday_date=?, budget_rule=?,
			monthly_income=?, setup_complete=?, updated_at=CURRENT_TIMESTAMP
			WHERE id=1
		`, profile.Mascot, profile.Currency, profile.PaydayDate, profile.BudgetRule,
			profile.MonthlyIncome, profile.SetupComplete)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
}

// GetTransactions returns all transactions
func (h *Handler) GetTransactions(w http.ResponseWriter, r *http.Request) {
	rows, err := h.db.Query(`
		SELECT id, amount, category, account, note, date, type, created_at
		FROM transactions ORDER BY date DESC, created_at DESC
	`)
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
		transactions = append(transactions, t)
	}

	if transactions == nil {
		transactions = []models.Transaction{}
	}

	json.NewEncoder(w).Encode(transactions)
}

// AddTransaction adds a new transaction
func (h *Handler) AddTransaction(w http.ResponseWriter, r *http.Request) {
	var t models.Transaction
	if err := json.NewDecoder(r.Body).Decode(&t); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Generate ID if not provided
	if t.ID == "" {
		t.ID = uuid.New().String()
	}

	_, err := h.db.Exec(`
		INSERT INTO transactions (id, amount, category, account, note, date, type)
		VALUES (?, ?, ?, ?, ?, ?, ?)
	`, t.ID, t.Amount, t.Category, t.Account, t.Note, t.Date, t.Type)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(t)
}

// DeleteTransaction deletes a transaction
func (h *Handler) DeleteTransaction(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	
	_, err := h.db.Exec("DELETE FROM transactions WHERE id=?", id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"status": "deleted"})
}

// GetBudget returns current month budget
func (h *Handler) GetBudget(w http.ResponseWriter, r *http.Request) {
	currentMonth := time.Now().Format("2006-01")

	var budget models.MonthlyBudget
	err := h.db.QueryRow(`
		SELECT id, month, total_income, total_spent, created_at, updated_at
		FROM monthly_budgets WHERE month=?
	`, currentMonth).Scan(&budget.ID, &budget.Month, &budget.TotalIncome, &budget.TotalSpent,
		&budget.CreatedAt, &budget.UpdatedAt)

	if err == sql.ErrNoRows {
		json.NewEncoder(w).Encode(nil)
		return
	}
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Get categories
	rows, err := h.db.Query(`
		SELECT category, limit_amount, spent, color
		FROM budget_categories WHERE budget_id=?
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
	var budget models.MonthlyBudget
	if err := json.NewDecoder(r.Body).Decode(&budget); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Insert or update budget
	_, err := h.db.Exec(`
		INSERT INTO monthly_budgets (month, total_income, total_spent)
		VALUES (?, ?, ?)
		ON CONFLICT(month) DO UPDATE SET
		total_income=excluded.total_income,
		total_spent=excluded.total_spent,
		updated_at=CURRENT_TIMESTAMP
	`, budget.Month, budget.TotalIncome, budget.TotalSpent)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Get budget ID
	var budgetID int64
	h.db.QueryRow("SELECT id FROM monthly_budgets WHERE month=?", budget.Month).Scan(&budgetID)

	// Delete existing categories
	h.db.Exec("DELETE FROM budget_categories WHERE budget_id=?", budgetID)

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

// ExportData exports all data
func (h *Handler) ExportData(w http.ResponseWriter, r *http.Request) {
	var export models.ExportData
	export.ExportDate = time.Now()

	// Get profile
	var profile models.UserProfile
	err := h.db.QueryRow(`
		SELECT id, mascot, currency, payday_date, budget_rule, monthly_income, setup_complete, created_at, updated_at
		FROM user_profile LIMIT 1
	`).Scan(&profile.ID, &profile.Mascot, &profile.Currency, &profile.PaydayDate,
		&profile.BudgetRule, &profile.MonthlyIncome, &profile.SetupComplete,
		&profile.CreatedAt, &profile.UpdatedAt)
	if err == nil {
		export.Profile = &profile
	}

	// Get transactions
	rows, err := h.db.Query(`
		SELECT id, amount, category, account, note, date, type, created_at
		FROM transactions ORDER BY date DESC
	`)
	if err == nil {
		defer rows.Close()
		for rows.Next() {
			var t models.Transaction
			rows.Scan(&t.ID, &t.Amount, &t.Category, &t.Account, &t.Note, &t.Date, &t.Type, &t.CreatedAt)
			export.Transactions = append(export.Transactions, t)
		}
	}

	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Content-Disposition", "attachment; filename=cutefinance-export.json")
	json.NewEncoder(w).Encode(export)
}

// ImportData imports data
func (h *Handler) ImportData(w http.ResponseWriter, r *http.Request) {
	var export models.ExportData
	if err := json.NewDecoder(r.Body).Decode(&export); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Import profile
	if export.Profile != nil {
		h.db.Exec(`
			INSERT OR REPLACE INTO user_profile (id, mascot, currency, payday_date, budget_rule, monthly_income, setup_complete)
			VALUES (1, ?, ?, ?, ?, ?, ?)
		`, export.Profile.Mascot, export.Profile.Currency, export.Profile.PaydayDate,
			export.Profile.BudgetRule, export.Profile.MonthlyIncome, export.Profile.SetupComplete)
	}

	// Import transactions
	for _, t := range export.Transactions {
		h.db.Exec(`
			INSERT OR REPLACE INTO transactions (id, amount, category, account, note, date, type)
			VALUES (?, ?, ?, ?, ?, ?, ?)
		`, t.ID, t.Amount, t.Category, t.Account, t.Note, t.Date, t.Type)
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"status": "imported"})
}
