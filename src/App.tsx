import React, { useState, useEffect, useCallback } from 'react';
import { UserProfile, PageType, Transaction } from './types';
import { getProfile, getTransactions, saveMonthlyBudget, calculateBudgetAllocation, getCurrentMonthKey } from './store';
import { SetupWizard } from './components/SetupWizard';
import { Dashboard } from './components/Dashboard';
import { Transactions } from './components/Transactions';
import { Statistics } from './components/Statistics';
import { Settings } from './components/Settings';
import { BottomNav } from './components/BottomNav';
import { FAB } from './components/FAB';
import { AddTransaction } from './components/AddTransaction';
import { PaydayNotification, requestNotificationPermission } from './components/Notification';
import { InstallPrompt } from './components/InstallPrompt';

function App() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }

    // Request notification permission
    requestNotificationPermission();

    // Load data
    const savedProfile = getProfile();
    const savedTransactions = getTransactions();
    
    if (savedProfile && savedProfile.setupComplete) {
      setProfile(savedProfile);
      
      // Initialize budget if not exists
      const existingBudget = localStorage.getItem('cute-finance-budgets');
      if (!existingBudget && savedProfile.monthlyIncome > 0) {
        const budgetCategories = calculateBudgetAllocation(savedProfile.monthlyIncome, savedProfile.budgetRule);
        saveMonthlyBudget({
          month: getCurrentMonthKey(),
          categories: budgetCategories,
          totalIncome: savedProfile.monthlyIncome,
          totalSpent: 0,
        });
      }
    }
    
    setTransactions(savedTransactions);
    setLoading(false);
  }, []);

  const refreshTransactions = useCallback(() => {
    setTransactions(getTransactions());
  }, []);

  const handleSetupComplete = (newProfile: UserProfile) => {
    setProfile(newProfile);
    // Initialize budget
    const budgetCategories = calculateBudgetAllocation(newProfile.monthlyIncome, newProfile.budgetRule);
    saveMonthlyBudget({
      month: getCurrentMonthKey(),
      categories: budgetCategories,
      totalIncome: newProfile.monthlyIncome,
      totalSpent: 0,
    });
    
    // Add sample transactions for demo
    const today = new Date();
    const sampleTransactions = [
      { id: crypto.randomUUID(), amount: 50000, category: 'food' as const, account: 'ewallet' as const, note: 'Lunch at café', date: today.toISOString().split('T')[0], type: 'expense' as const },
      { id: crypto.randomUUID(), amount: 25000, category: 'drink' as const, account: 'cash' as const, note: 'Coffee & milk tea', date: today.toISOString().split('T')[0], type: 'expense' as const },
      { id: crypto.randomUUID(), amount: 150000, category: 'bills' as const, account: 'bank' as const, note: 'Electricity bill', date: new Date(today.getTime() - 86400000).toISOString().split('T')[0], type: 'expense' as const },
      { id: crypto.randomUUID(), amount: 35000, category: 'transport' as const, account: 'ewallet' as const, note: 'Grab ride', date: new Date(today.getTime() - 86400000).toISOString().split('T')[0], type: 'expense' as const },
      { id: crypto.randomUUID(), amount: 75000, category: 'dessert' as const, account: 'cash' as const, note: 'Birthday cake', date: new Date(today.getTime() - 172800000).toISOString().split('T')[0], type: 'expense' as const },
      { id: crypto.randomUUID(), amount: 200000, category: 'shopping' as const, account: 'ewallet' as const, note: 'New clothes', date: new Date(today.getTime() - 259200000).toISOString().split('T')[0], type: 'expense' as const },
      { id: crypto.randomUUID(), amount: 5000000, category: 'bonus' as const, account: 'bank' as const, note: 'Monthly salary', date: new Date(today.getTime() - 432000000).toISOString().split('T')[0], type: 'income' as const },
    ];
    
    const existing = JSON.parse(localStorage.getItem('cute-finance-transactions') || '[]');
    localStorage.setItem('cute-finance-transactions', JSON.stringify([...sampleTransactions, ...existing]));
    setTransactions([...sampleTransactions, ...existing]);
  };

  const handleProfileUpdate = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pastel-yellow to-white flex items-center justify-center">
        <div className="text-center animate-pulse-soft">
          <div className="text-5xl mb-4">🐾</div>
          <p className="text-cute-brown font-bold text-lg">Loading CuteFinance...</p>
        </div>
      </div>
    );
  }

  // Show setup wizard if not completed
  if (!profile || !profile.setupComplete) {
    return <SetupWizard onComplete={handleSetupComplete} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pastel-yellow via-pastel-cream to-white pb-20">
      {/* Page Content */}
      <div className="max-w-lg mx-auto pt-2">
        {currentPage === 'dashboard' && (
          <Dashboard profile={profile} transactions={transactions} />
        )}
        {currentPage === 'transactions' && (
          <Transactions
            profile={profile}
            transactions={transactions}
            onUpdate={refreshTransactions}
          />
        )}
        {currentPage === 'statistics' && (
          <Statistics profile={profile} transactions={transactions} />
        )}
        {currentPage === 'settings' && (
          <Settings profile={profile} onUpdate={handleProfileUpdate} />
        )}
      </div>

      {/* FAB - Only on dashboard and transactions */}
      {(currentPage === 'dashboard' || currentPage === 'transactions') && (
        <FAB onClick={() => setShowAddTransaction(true)} />
      )}

      {/* Bottom Navigation */}
      <BottomNav currentPage={currentPage} onNavigate={setCurrentPage} />

      {/* Add Transaction Bottom Sheet */}
      <AddTransaction
        profile={profile}
        isOpen={showAddTransaction}
        onClose={() => setShowAddTransaction(false)}
        onAdded={refreshTransactions}
      />

      {/* Payday Notification */}
      <PaydayNotification profile={profile} />

      {/* Install Prompt */}
      <InstallPrompt />
    </div>
  );
}

export default App;
