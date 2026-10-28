import React, { useState, useRef, useMemo } from 'react';
import { UserProfile, Transaction, AccountType } from '../types';
import { useAuth } from '../contexts/AuthContext';
import {
  formatCurrency,
  getMonthTransactions,
  getCurrentMonthKey,
  CATEGORY_COLORS,
  CATEGORY_LABELS,
  CATEGORY_ICONS,
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
  const { token } = useAuth();
  const [selectedAccount, setSelectedAccount] = useState<AccountType | 'all'>('all');
  const [selectedMonth] = useState(getCurrentMonthKey());
  const [swipedId, setSwipedId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Transaction | null>(null);
  const [deleting, setDeleting] = useState(false);
  const touchStartX = useRef(0);
  const touchCurrentX = useRef(0);

  const monthTransactions = useMemo(() => {
    let txns = transactions.filter(t => t.date.startsWith(selectedMonth));
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

  const handleDeleteRequest = (transaction: Transaction) => {
    setDeleteConfirm(transaction);
    setSwipedId(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return;
    
    setDeleting(true);
    try {
      const response = await fetch(`/api/transactions/${deleteConfirm.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': token || '' },
      });

      if (response.ok) {
        setDeleteConfirm(null);
        onUpdate();
      } else {
        alert('Failed to delete transaction');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete transaction');
    }
    setDeleting(false);
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

      {/* Swipe hint */}
      {groupedTransactions.length > 0 && (
        <p className="text-xs text-cute-brown/40 text-center mb-3">
          👈 Swipe left on transaction to delete
        </p>
      )}

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
                        onClick={() => handleDeleteRequest(t)}
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

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl">
            <div className="text-center mb-4">
              <div className="text-5xl mb-3">⚠️</div>
              <h3 className="text-lg font-extrabold text-cute-brown">Delete Transaction?</h3>
              <p className="text-sm text-cute-brown/60 mt-2">
                This action cannot be undone.
              </p>
            </div>

            {/* Transaction Preview */}
            <div className="bg-gray-50 rounded-2xl p-4 mb-5">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                  style={{ backgroundColor: `${CATEGORY_COLORS[deleteConfirm.category]}30` }}
                >
                  {CATEGORY_ICONS[deleteConfirm.category]}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-cute-brown">
                    {CATEGORY_LABELS[deleteConfirm.category]}
                  </p>
                  <p className="text-xs text-cute-brown/50">
                    {deleteConfirm.date} • {accountLabels[deleteConfirm.account].label}
                  </p>
                </div>
                <span className={`text-sm font-bold ${
                  deleteConfirm.type === 'income' ? 'text-green-500' : 'text-cute-brown'
                }`}>
                  {deleteConfirm.type === 'income' ? '+' : '-'}
                  {formatCurrency(deleteConfirm.amount, profile.currency)}
                </span>
              </div>
              {deleteConfirm.note && (
                <p className="text-xs text-cute-brown/50 mt-2">Note: {deleteConfirm.note}</p>
              )}
            </div>

            {/* Warning */}
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-3 mb-5">
              <p className="text-xs text-yellow-700 font-semibold">
                ⚠️ Warning: This will permanently delete this {deleteConfirm.type} record.
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                disabled={deleting}
                className="flex-1 py-3 rounded-xl bg-gray-100 text-cute-brown/60 font-bold text-sm active:scale-95 transition-transform"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="flex-1 py-3 rounded-xl bg-red-400 text-white font-bold text-sm active:scale-95 transition-transform"
              >
                {deleting ? 'Deleting...' : 'Delete 🗑️'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
