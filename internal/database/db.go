package database

import (
	"database/sql"
	"fmt"

	_ "modernc.org/sqlite"
)

// Init initializes the SQLite database
func Init(dbPath string) (*sql.DB, error) {
	db, err := sql.Open("sqlite", dbPath)
	if err != nil {
		return nil, fmt.Errorf("failed to open database: %w", err)
	}

	// Set pragmas for performance
	pragmas := []string{
		"PRAGMA journal_mode=WAL",
		"PRAGMA synchronous=NORMAL",
		"PRAGMA cache_size=10000",
		"PRAGMA temp_store=MEMORY",
		"PRAGMA mmap_size=268435456",
	}

	for _, pragma := range pragmas {
		if _, err := db.Exec(pragma); err != nil {
			return nil, fmt.Errorf("failed to set pragma %s: %w", pragma, err)
		}
	}

	// Create tables
	if err := createTables(db); err != nil {
		return nil, fmt.Errorf("failed to create tables: %w", err)
	}

	return db, nil
}

func createTables(db *sql.DB) error {
	schema := `
	CREATE TABLE IF NOT EXISTS user_profile (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		mascot TEXT NOT NULL DEFAULT 'panda',
		currency TEXT NOT NULL DEFAULT 'IDR',
		payday_date INTEGER NOT NULL DEFAULT 25,
		budget_rule TEXT NOT NULL DEFAULT '50-30-20',
		monthly_income REAL NOT NULL DEFAULT 0,
		setup_complete INTEGER NOT NULL DEFAULT 0,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
	);

	CREATE TABLE IF NOT EXISTS transactions (
		id TEXT PRIMARY KEY,
		amount REAL NOT NULL,
		category TEXT NOT NULL,
		account TEXT NOT NULL,
		note TEXT DEFAULT '',
		date TEXT NOT NULL,
		type TEXT NOT NULL,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP
	);

	CREATE TABLE IF NOT EXISTS monthly_budgets (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		month TEXT NOT NULL UNIQUE,
		total_income REAL NOT NULL DEFAULT 0,
		total_spent REAL NOT NULL DEFAULT 0,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
	);

	CREATE TABLE IF NOT EXISTS budget_categories (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		budget_id INTEGER NOT NULL,
		category TEXT NOT NULL,
		limit_amount REAL NOT NULL DEFAULT 0,
		spent REAL NOT NULL DEFAULT 0,
		color TEXT NOT NULL DEFAULT '#CCCCCC',
		FOREIGN KEY (budget_id) REFERENCES monthly_budgets(id) ON DELETE CASCADE
	);

	CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
	CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions(category);
	CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
	CREATE INDEX IF NOT EXISTS idx_budget_categories_budget_id ON budget_categories(budget_id);
	`

	_, err := db.Exec(schema)
	return err
}
