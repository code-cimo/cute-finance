import React, { useState, useRef, useMemo } from 'react';
import { UserProfile, Transaction, AccountType } from '../types';
import {
  formatCurrency,
  getMonthTransactions,
  getCurrentMonthKey,
  CATEGORY_COLORS,
  CATEGORY_LABELS,
  CATEGORY_ICONS,
  deleteTransaction,
} from '../store';

interface TransactionsProps {
  profile: UserProfile;
  transactions: Transaction[];
  onUpdate: () => void;
}

const accountLabels: Record<AccountType, { label: string; icon: string; color: string }> = {
  cash: { label: 'Cash', icon: '💵', color: '#A5D6A7' },
  bank: { label: 'Bank', icon: '🏦', color: '#90CAF9' },
  ewallet: { label: 'E-Wallet', icon: '📱', color: '#CE93D8' },
};

export const Transactions: React.FC<TransactionsProps> = ({ profile, transactions, onUpdate }) => {
  const [selectedAccount, setSelectedAccount] = useState<AccountType | 'all'>('all');
  const [selectedMonth] = useState(getCurrentMonthKey());
  const [swipedId, setSwipedId] = useState<string | null>(null);
  const touchStartX = useRef(0);
  const touchCurrentX = useRef(0);

  const monthTransactions = useMemo(() => {
    let txns = getMonthTransactions(transactions, selectedMonth);
    if (selectedAccount !== 'all') {
      txns = txns.filter(t => t.account === selectedAccount);
    }
    return txns;
  }, [transactions, selectedMonth, selectedAccount]);

  const totalExpense = useMemo(
    () => monthTransactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0),
    [monthTransactions]
  );
  const totalIncome = useMemo(
    () => monthTransactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0),
    [monthTransactions]
  );

  const handleTouchStart = (e: React.TouchEvent, id: string) => {
    touchStartX.current = e.touches[0].clientX;
    setSwipedId(id);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchCurrentX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchCurrentX.current;
    if (diff < 50) {
      setSwipedId(null);
    }
  };

  const handleDelete = (id: string) => {
    deleteTransaction(id);
    setSwipedId(null);
    onUpdate();
  };

  const groupByDate = (txns: Transaction[]) => {
    const groups: Record<string, Transaction[]> = {};
    txns.forEach(t => {
      const dateKey = t.date;
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(t);
    });
    return Object.entries(groups).sort(([a], [b]) => b.localeCompare(a));
  };

  const groupedTransactions = groupByDate(monthTransactions);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (dateStr === today.toISOString().split('T')[0]) return 'Today';
    if (dateStr === yesterday.toISOString().split('T')[0]) return 'Yesterday';
    return date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  return (
    <div className="px-4 pb-4 animate-fade-in">
      <h1 className="text-xl font-extrabold text-cute-brown mb-4 pt-2">Transactions 📋</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-gradient-to-br from-pastel-mint/60 to-pastel-mint/30 rounded-2xl p-4 shadow-sm">
          <p className="text-xs text-cute-brown/60 font-semibold">Income</p>
          <p className="text-lg font-extrabold text-green-600">
            +{formatCurrency(totalIncome, profile.currency)}
          </p>
        </div>
        <div className="bg-gradient-to-br from-pastel-pink/60 to-pastel-pink/30 rounded-2xl p-4 shadow-sm">
          <p className="text-xs text-cute-brown/60 font-semibold">Expense</p>
          <p className="text-lg font-extrabold text-red-400">
            -{formatCurrency(totalExpense, profile.currency)}
          </p>
        </div>
      </div>

      {/* Account Filter */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
        <button
          onClick={() => setSelectedAccount('all')}
          className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all active:scale-95 ${
            selectedAccount === 'all'
              ? 'bg-pastel-lavender text-cute-brown shadow-sm'
              : 'bg-white text-cute-brown/60'
          }`}
        >
          All
        </button>
        {(Object.keys(accountLabels) as AccountType[]).map((acc) => (
          <button
            key={acc}
            onClick={() => setSelectedAccount(acc)}
            className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all active:scale-95 ${
              selectedAccount === acc
                ? 'bg-pastel-lavender text-cute-brown shadow-sm'
                : 'bg-white text-cute-brown/60'
            }`}
          >
            {accountLabels[acc].icon} {accountLabels[acc].label}
          </button>
        ))}
      </div>

      {/* Transaction List */}
      {groupedTransactions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-4xl mb-3">📝</p>
          <p className="text-cute-brown/50 font-semibold">No transactions yet</p>
          <p className="text-cute-brown/40 text-sm">Tap the + button to add one!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {groupedTransactions.map(([date, txns]) => (
            <div key={date}>
              <p className="text-xs font-bold text-cute-brown/50 mb-2 px-1">{formatDate(date)}</p>
              <div className="space-y-2">
                {txns.map((t) => (
                  <div key={t.id} className="relative overflow-hidden rounded-2xl">
                    {/* Swipe actions background */}
                    <div className="absolute inset-0 flex justify-end">
                      <button
                        onClick={() => handleDelete(t.id)}
                        className="w-20 bg-red-400 flex items-center justify-center text-white font-bold text-sm"
                      >
                        Delete
                      </button>
                    </div>
                    {/* Transaction item */}
                    <div
                      className={`relative bg-white p-4 flex items-center gap-3 transition-transform duration-200 ${
                        swipedId === t.id ? '-translate-x-20' : 'translate-x-0'
                      }`}
                      onTouchStart={(e) => handleTouchStart(e, t.id)}
                      onTouchMove={handleTouchMove}
                      onTouchEnd={handleTouchEnd}
                    >
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                        style={{ backgroundColor: `${CATEGORY_COLORS[t.category]}30` }}
                      >
                        {CATEGORY_ICONS[t.category]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-cute-brown truncate">
                          {CATEGORY_LABELS[t.category]}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-cute-brown/50">
                            {accountLabels[t.account].icon} {accountLabels[t.account].label}
                          </span>
                          {t.note && (
                            <span className="text-xs text-cute-brown/40 truncate">• {t.note}</span>
                          )}
                        </div>
                      </div>
                      <span className={`text-sm font-bold flex-shrink-0 ${
                        t.type === 'income' ? 'text-green-500' : 'text-cute-brown'
                      }`}>
                        {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount, profile.currency)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
