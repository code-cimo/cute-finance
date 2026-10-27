export type MascotType = 'panda' | 'shiba' | 'bunny' | 'capybara' | 'cat';

export type Currency = 'IDR' | 'USD' | 'EUR' | 'JPY';

export type BudgetRule = '50-30-20' | 'zero-based' | 'custom';

export type AccountType = 'cash' | 'bank' | 'ewallet';

export type CategoryType = 'food' | 'dessert' | 'fruit' | 'drink' | 'bills' | 'interest' | 'bonus' | 'transport' | 'shopping' | 'entertainment' | 'health' | 'education' | 'pet-care' | 'charity' | 'other';

export interface UserProfile {
  mascot: MascotType;
  currency: Currency;
  paydayDate: number;
  budgetRule: BudgetRule;
  monthlyIncome: number;
  setupComplete: boolean;
}

export interface Transaction {
  id: string;
  amount: number;
  category: CategoryType;
  account: AccountType;
  note: string;
  date: string;
  type: 'expense' | 'income';
}

export interface BudgetCategory {
  category: CategoryType;
  limit: number;
  spent: number;
  color: string;
}

export interface MonthlyBudget {
  month: string;
  categories: BudgetCategory[];
  totalIncome: number;
  totalSpent: number;
}

export type PageType = 'dashboard' | 'transactions' | 'statistics' | 'settings';
