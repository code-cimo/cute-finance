import React, { useState, useEffect, useCallback } from 'react';
import { UserProfile, PageType, Transaction } from './types';
import { getProfile, getTransactions, saveMonthlyBudget, calculateBudgetAllocation, getCurrentMonthKey } from './store';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AuthPage } from './components/AuthPage';
import { SetupWizard } from './components/SetupWizard';
import { Dashboard } from './components/Dashboard';
import { Transactions } from './components/Transactions';
import { Statistics } from './components/Statistics';
import { Settings } from './components/Settings';
import { BottomNav } from './components/BottomNav';
import { FAB } from './components/FAB';
import { AddTransaction } from './components/AddTransaction';
import { PaydayNotification } from './components/Notification';

function AppContent() {
  const { isAuthenticated, token } = useAuth();
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

    if (isAuthenticated) {
      // Load data from server
      loadData();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load profile
      const profileRes = await fetch('/api/profile', {
        headers: { 'Authorization': token || '' },
      });
      if (profileRes.ok) {
        const profileData = await profileRes.json();
        if (profileData) {
          setProfile(profileData);
        }
      }

      // Load transactions
      const txRes = await fetch('/api/transactions', {
        headers: { 'Authorization': token || '' },
      });
      if (txRes.ok) {
        const txData = await txRes.json();
        setTransactions(txData || []);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    }
    setLoading(false);
  };

  const refreshTransactions = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      const txRes = await fetch('/api/transactions', {
        headers: { 'Authorization': token || '' },
      });
      if (txRes.ok) {
        const txData = await txRes.json();
        setTransactions(txData || []);
      }
    } catch (error) {
      console.error('Failed to refresh transactions:', error);
    }
  }, [isAuthenticated, token]);

  const handleSetupComplete = async (newProfile: UserProfile) => {
    try {
      // Save profile to server
      await fetch('/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token || '',
        },
        body: JSON.stringify(newProfile),
      });

      setProfile(newProfile);
      
      // Initialize budget
      const budgetCategories = calculateBudgetAllocation(newProfile.monthlyIncome, newProfile.budgetRule);
      const budget = {
        month: getCurrentMonthKey(),
        categories: budgetCategories,
        totalIncome: newProfile.monthlyIncome,
        totalSpent: 0,
      };

      await fetch('/api/budget', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token || '',
        },
        body: JSON.stringify(budget),
      });
    } catch (error) {
      console.error('Failed to save profile:', error);
    }
  };

  const handleProfileUpdate = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
  };

  // Show auth page if not authenticated
  if (!isAuthenticated) {
    return <AuthPage />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pastel-yellow to-white flex items-center justify-center">
        <div className="text-center animate-pulse-soft">
          <div className="text-5xl mb-4">🐾</div>
          <p className="text-cute-brown font-bold text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // Show setup wizard if profile not complete
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
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
