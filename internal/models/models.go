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
	BudgetRule503020  BudgetRule = "50-30-20"
	BudgetRuleZero    BudgetRule = "zero-based"
	BudgetRuleCustom  BudgetRule = "custom"
)

// AccountType represents payment methods
type AccountType string

const (
	AccountCash    AccountType = "cash"
	AccountBank    AccountType = "bank"
	AccountEWallet AccountType = "ewallet"
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

// TransactionType represents income or expense
type TransactionType string

const (
	TransactionExpense TransactionType = "expense"
	TransactionIncome  TransactionType = "income"
)

// UserProfile represents user settings
type UserProfile struct {
	ID            int64      `json:"id"`
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
	Month       string           `json:"month"` // YYYY-MM
	Categories  []BudgetCategory `json:"categories"`
	TotalIncome float64          `json:"totalIncome"`
	TotalSpent  float64          `json:"totalSpent"`
	CreatedAt   time.Time        `json:"createdAt"`
	UpdatedAt   time.Time        `json:"updatedAt"`
}

// ExportData represents full data export
type ExportData struct {
	Profile      *UserProfile     `json:"profile"`
	Transactions []Transaction    `json:"transactions"`
	Budget       *MonthlyBudget   `json:"budget"`
	ExportDate   time.Time        `json:"exportDate"`
}
