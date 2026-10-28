package models

import "time"

// MascotType represents available mascot characters
type MascotType string

const (
	MascotPanda    MascotType = "panda"
	MascotShiba    MascotType = "shiba"
	MascotBunny    MascotType = "bunny"
	MascotCapybara MascotType = "capybara"
	MascotCat      MascotType = "cat"
)

// Currency represents supported currencies
type Currency string

const (
	CurrencyIDR Currency = "IDR"
	CurrencyUSD Currency = "USD"
	CurrencyEUR Currency = "EUR"
	CurrencyJPY Currency = "JPY"
)

// BudgetRule represents budget allocation methods
type BudgetRule string

const (
	BudgetRule503020 BudgetRule = "50-30-20"
	BudgetRuleZero   BudgetRule = "zero-based"
	BudgetRuleCustom BudgetRule = "custom"
)

// CategoryType represents spending categories
type CategoryType string

const (
	CategoryFood          CategoryType = "food"
	CategoryDessert       CategoryType = "dessert"
	CategoryFruit         CategoryType = "fruit"
	CategoryDrink         CategoryType = "drink"
	CategoryBills         CategoryType = "bills"
	CategoryInterest      CategoryType = "interest"
	CategoryBonus         CategoryType = "bonus"
	CategoryTransport     CategoryType = "transport"
	CategoryShopping      CategoryType = "shopping"
	CategoryEntertainment CategoryType = "entertainment"
	CategoryHealth        CategoryType = "health"
	CategoryEducation     CategoryType = "education"
	CategoryPetCare       CategoryType = "pet-care"
	CategoryCharity       CategoryType = "charity"
	CategoryOther         CategoryType = "other"
)

// AccountType represents payment methods
type AccountType string

const (
	AccountCash    AccountType = "cash"
	AccountBank    AccountType = "bank"
	AccountEWallet AccountType = "ewallet"
)

// TransactionType represents income or expense
type TransactionType string

const (
	TransactionExpense TransactionType = "expense"
	TransactionIncome  TransactionType = "income"
)

// User represents a registered user
type User struct {
	ID           int64     `json:"id"`
	Username     string    `json:"username"`
	Email        string    `json:"email"`
	PasswordHash string    `json:"-"` // Never send to client
	CreatedAt    time.Time `json:"createdAt"`
	UpdatedAt    time.Time `json:"updatedAt"`
}

// Device represents a registered device
type Device struct {
	ID          int64     `json:"id"`
	UserID      int64     `json:"userId"`
	Token       string    `json:"token"`
	Name        string    `json:"name"`
	Platform    string    `json:"platform"`
	LastActive  time.Time `json:"lastActive"`
	CreatedAt   time.Time `json:"createdAt"`
}

// Session represents user session
type Session struct {
	Token     string    `json:"token"`
	UserID    int64     `json:"userId"`
	DeviceID  int64     `json:"deviceId"`
	ExpiresAt time.Time `json:"expiresAt"`
}

// UserProfile represents user settings
type UserProfile struct {
	ID            int64      `json:"id"`
	UserID        int64      `json:"userId"`
	Mascot        MascotType `json:"mascot"`
	Currency      Currency   `json:"currency"`
	PaydayDate    int        `json:"paydayDate"`
	BudgetRule    BudgetRule `json:"budgetRule"`
	MonthlyIncome float64    `json:"monthlyIncome"`
	SetupComplete bool       `json:"setupComplete"`
	CreatedAt     time.Time  `json:"createdAt"`
	UpdatedAt     time.Time  `json:"updatedAt"`
}

// Transaction represents a financial transaction
type Transaction struct {
	ID        string          `json:"id"`
	UserID    int64           `json:"userId"`
	Amount    float64         `json:"amount"`
	Category  CategoryType    `json:"category"`
	Account   AccountType     `json:"account"`
	Note      string          `json:"note"`
	Date      string          `json:"date"` // YYYY-MM-DD
	Type      TransactionType `json:"type"`
	CreatedAt time.Time       `json:"createdAt"`
}

// BudgetCategory represents budget allocation for a category
type BudgetCategory struct {
	Category CategoryType `json:"category"`
	Limit    float64      `json:"limit"`
	Spent    float64      `json:"spent"`
	Color    string       `json:"color"`
}

// MonthlyBudget represents monthly budget data
type MonthlyBudget struct {
	ID          int64            `json:"id"`
	UserID      int64            `json:"userId"`
	Month       string           `json:"month"` // YYYY-MM
	Categories  []BudgetCategory `json:"categories"`
	TotalIncome float64          `json:"totalIncome"`
	TotalSpent  float64          `json:"totalSpent"`
	CreatedAt   time.Time        `json:"createdAt"`
	UpdatedAt   time.Time        `json:"updatedAt"`
}

// LoginRequest represents login request
type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

// RegisterRequest represents register request
type RegisterRequest struct {
	Username string `json:"username"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

// AuthResponse represents authentication response
type AuthResponse struct {
	Token    string `json:"token"`
	UserID   int64  `json:"userId"`
	Username string `json:"username"`
}

// SyncRequest represents data sync request
type SyncRequest struct {
	LastSync time.Time `json:"lastSync"`
}

// SyncResponse represents data sync response
type SyncResponse struct {
	Transactions []Transaction  `json:"transactions"`
	Profile      *UserProfile   `json:"profile"`
	Budget       *MonthlyBudget `json:"budget"`
	ServerTime   time.Time      `json:"serverTime"`
}
