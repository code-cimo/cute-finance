import { UserProfile, Transaction, MonthlyBudget, BudgetCategory, CategoryType, BudgetRule } from './types';

const PROFILE_KEY = 'cute-finance-profile';
const TRANSACTIONS_KEY = 'cute-finance-transactions';
const BUDGETS_KEY = 'cute-finance-budgets';

// Category colors (pastel)
export const CATEGORY_COLORS: Record<CategoryType, string> = {
  food: '#FFB74D',
  dessert: '#F48FB1',
  fruit: '#A5D6A7',
  drink: '#81D4FA',
  bills: '#CE93D8',
  interest: '#FFF176',
  bonus: '#FFD54F',
  transport: '#90CAF9',
  shopping: '#EF9A9A',
  entertainment: '#B39DDB',
  health: '#80CBC4',
  education: '#80DEEA',
  'pet-care': '#FFAB91',
  charity: '#C5E1A5',
  other: '#BDBDBD',
};

export const CATEGORY_ICONS: Record<CategoryType, string> = {
  food: '🍜',
  dessert: '🍰',
  fruit: '🍓',
  drink: '🧋',
  bills: '📄',
  interest: '💰',
  bonus: '🎁',
  transport: '🚗',
  shopping: '🛍️',
  entertainment: '🎮',
  health: '💊',
  education: '📚',
  'pet-care': '🐾',
  charity: '❤️',
  other: '📦',
};

export const CATEGORY_LABELS: Record<CategoryType, string> = {
  food: 'Food & Meals',
  dessert: 'Desserts',
  fruit: 'Fruits',
  drink: 'Drinks',
  bills: 'Bills & Utilities',
  interest: 'Interest',
  bonus: 'Bonus',
  transport: 'Transport',
  shopping: 'Shopping',
  entertainment: 'Entertainment',
  health: 'Health',
  education: 'Education',
  'pet-care': 'Pet Care',
  charity: 'Charity',
  other: 'Other',
};

// Budget allocation rules
export function calculateBudgetAllocation(income: number, rule: BudgetRule): BudgetCategory[] {
  const categories: CategoryType[] = ['food', 'bills', 'transport', 'shopping', 'entertainment', 'health', 'education', 'pet-care', 'charity'];
  
  if (rule === '50-30-20') {
    // 50% Needs, 30% Wants, 20% Savings
    const needs = income * 0.5;
    const wants = income * 0.3;
    const savings = income * 0.2;
    
    return [
      { category: 'food', limit: needs * 0.4, spent: 0, color: CATEGORY_COLORS.food },
      { category: 'bills', limit: needs * 0.35, spent: 0, color: CATEGORY_COLORS.bills },
      { category: 'transport', limit: needs * 0.25, spent: 0, color: CATEGORY_COLORS.transport },
      { category: 'shopping', limit: wants * 0.3, spent: 0, color: CATEGORY_COLORS.shopping },
      { category: 'entertainment', limit: wants * 0.3, spent: 0, color: CATEGORY_COLORS.entertainment },
      { category: 'health', limit: wants * 0.2, spent: 0, color: CATEGORY_COLORS.health },
      { category: 'education', limit: savings * 0.5, spent: 0, color: CATEGORY_COLORS.education },
      { category: 'pet-care', limit: savings * 0.25, spent: 0, color: CATEGORY_COLORS['pet-care'] },
      { category: 'charity', limit: savings * 0.25, spent: 0, color: CATEGORY_COLORS.charity },
    ];
  } else if (rule === 'zero-based') {
    // 40% Survival, 20% Lifestyle, 30% Future, 10% Charity/Pet
    const survival = income * 0.4;
    const lifestyle = income * 0.2;
    const future = income * 0.3;
    const charityPet = income * 0.1;
    
    return [
      { category: 'food', limit: survival * 0.5, spent: 0, color: CATEGORY_COLORS.food },
      { category: 'bills', limit: survival * 0.35, spent: 0, color: CATEGORY_COLORS.bills },
      { category: 'transport', limit: survival * 0.15, spent: 0, color: CATEGORY_COLORS.transport },
      { category: 'shopping', limit: lifestyle * 0.4, spent: 0, color: CATEGORY_COLORS.shopping },
      { category: 'entertainment', limit: lifestyle * 0.35, spent: 0, color: CATEGORY_COLORS.entertainment },
      { category: 'health', limit: lifestyle * 0.25, spent: 0, color: CATEGORY_COLORS.health },
      { category: 'education', limit: future * 0.5, spent: 0, color: CATEGORY_COLORS.education },
      { category: 'pet-care', limit: charityPet * 0.5, spent: 0, color: CATEGORY_COLORS['pet-care'] },
      { category: 'charity', limit: charityPet * 0.5, spent: 0, color: CATEGORY_COLORS.charity },
    ];
  }
  
  // Custom - equal distribution
  const perCategory = income / categories.length;
  return categories.map(cat => ({
    category: cat,
    limit: perCategory,
    spent: 0,
    color: CATEGORY_COLORS[cat],
  }));
}

// LocalStorage helpers
export function getProfile(): UserProfile | null {
  const data = localStorage.getItem(PROFILE_KEY);
  return data ? JSON.parse(data) : null;
}

export function saveProfile(profile: UserProfile): void {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function getTransactions(): Transaction[] {
  const data = localStorage.getItem(TRANSACTIONS_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveTransactions(transactions: Transaction[]): void {
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
}

export function addTransaction(transaction: Transaction): void {
  const transactions = getTransactions();
  transactions.unshift(transaction);
  saveTransactions(transactions);
}

export function deleteTransaction(id: string): void {
  const transactions = getTransactions().filter(t => t.id !== id);
  saveTransactions(transactions);
}

export function getMonthlyBudget(): MonthlyBudget | null {
  const data = localStorage.getItem(BUDGETS_KEY);
  return data ? JSON.parse(data) : null;
}

export function saveMonthlyBudget(budget: MonthlyBudget): void {
  localStorage.setItem(BUDGETS_KEY, JSON.stringify(budget));
}

export function getCurrentMonthKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

export function formatCurrency(amount: number, currency: string = 'IDR'): string {
  if (currency === 'IDR') {
    return `Rp ${amount.toLocaleString('id-ID')}`;
  } else if (currency === 'USD') {
    return `$ ${amount.toLocaleString('en-US')}`;
  } else if (currency === 'EUR') {
    return `€ ${amount.toLocaleString('de-DE')}`;
  } else if (currency === 'JPY') {
    return `¥ ${amount.toLocaleString('ja-JP')}`;
  }
  return `${amount.toLocaleString()}`;
}

export function getMonthTransactions(transactions: Transaction[], monthKey?: string): Transaction[] {
  const key = monthKey || getCurrentMonthKey();
  return transactions.filter(t => t.date.startsWith(key));
}

export function calculateCategorySpent(transactions: Transaction[], category: CategoryType): number {
  return transactions
    .filter(t => t.category === category && t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
}
