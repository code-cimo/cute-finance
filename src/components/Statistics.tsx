import React, { useMemo } from 'react';
import { UserProfile, Transaction } from '../types';
import { Mascot } from './Mascot';
import {
  formatCurrency,
  getMonthTransactions,
  getCurrentMonthKey,
  CATEGORY_COLORS,
  CATEGORY_LABELS,
  CATEGORY_ICONS,
  calculateCategorySpent,
  getMonthlyBudget,
} from '../store';

interface StatisticsProps {
  profile: UserProfile;
  transactions: Transaction[];
}

export const Statistics: React.FC<StatisticsProps> = ({ profile, transactions }) => {
  const monthKey = getCurrentMonthKey();
  const monthTransactions = useMemo(() => getMonthTransactions(transactions, monthKey), [transactions, monthKey]);
  const budget = useMemo(() => getMonthlyBudget(), []);

  const totalExpense = useMemo(
    () => monthTransactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0),
    [monthTransactions]
  );
  const totalIncome = useMemo(
    () => monthTransactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0),
    [monthTransactions]
  );

  // Category breakdown
  const categoryBreakdown = useMemo(() => {
    const cats = new Set(monthTransactions.map(t => t.category));
    return Array.from(cats)
      .map(cat => ({
        category: cat,
        amount: calculateCategorySpent(monthTransactions, cat),
        color: CATEGORY_COLORS[cat],
        percent: totalExpense > 0 ? (calculateCategorySpent(monthTransactions, cat) / totalExpense) * 100 : 0,
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [monthTransactions, totalExpense]);

  // Daily spending trend (last 7 days)
  const dailyTrend = useMemo(() => {
    const days: { date: string; amount: number; label: string }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayAmount = monthTransactions
        .filter(t => t.date === dateStr && t.type === 'expense')
        .reduce((s, t) => s + t.amount, 0);
      days.push({
        date: dateStr,
        amount: dayAmount,
        label: d.toLocaleDateString('en-US', { weekday: 'short' }),
      });
    }
    return days;
  }, [monthTransactions]);

  const maxDaily = Math.max(...dailyTrend.map(d => d.amount), 1);

  // Account breakdown
  const accountBreakdown = useMemo(() => {
    const accounts: Record<string, number> = {};
    monthTransactions.filter(t => t.type === 'expense').forEach(t => {
      accounts[t.account] = (accounts[t.account] || 0) + t.amount;
    });
    return Object.entries(accounts).map(([acc, amount]) => ({
      account: acc,
      amount,
      percent: totalExpense > 0 ? (amount / totalExpense) * 100 : 0,
    }));
  }, [monthTransactions, totalExpense]);

  const accountIcons: Record<string, string> = {
    cash: '💵',
    bank: '🏦',
    ewallet: '📱',
  };

  const accountLabels: Record<string, string> = {
    cash: 'Cash',
    bank: 'Bank Transfer',
    ewallet: 'E-Wallet',
  };

  // Budget compliance
  const budgetCompliance = useMemo(() => {
    if (!budget) return [];
    return budget.categories.map(cat => {
      const spent = calculateCategorySpent(monthTransactions, cat.category);
      const percent = cat.limit > 0 ? (spent / cat.limit) * 100 : 0;
      return {
        category: cat.category,
        limit: cat.limit,
        spent,
        percent: Math.min(percent, 100),
        status: percent > 90 ? 'over' : percent > 70 ? 'warning' : 'good',
      };
    }).filter(c => c.limit > 0);
  }, [budget, monthTransactions]);

  return (
    <div className="px-4 pb-4 animate-fade-in">
      <h1 className="text-xl font-extrabold text-cute-brown mb-4 pt-2">Statistics 📊</h1>

      {/* Overview Cards */}
      <div className="grid grid-cols-3 gap-2 mb-5">
        <div className="bg-pastel-mint/40 rounded-2xl p-3 text-center">
          <p className="text-xs text-cute-brown/60 font-semibold">Income</p>
          <p className="text-sm font-extrabold text-green-600 mt-1">
            {formatCurrency(totalIncome, profile.currency)}
          </p>
        </div>
        <div className="bg-pastel-pink/40 rounded-2xl p-3 text-center">
          <p className="text-xs text-cute-brown/60 font-semibold">Expense</p>
          <p className="text-sm font-extrabold text-red-400 mt-1">
            {formatCurrency(totalExpense, profile.currency)}
          </p>
        </div>
        <div className="bg-pastel-yellow/40 rounded-2xl p-3 text-center">
          <p className="text-xs text-cute-brown/60 font-semibold">Saved</p>
          <p className="text-sm font-extrabold text-cute-brown mt-1">
            {formatCurrency(totalIncome - totalExpense, profile.currency)}
          </p>
        </div>
      </div>

      {/* Daily Trend Chart */}
      <div className="bg-white rounded-3xl p-5 shadow-sm mb-5">
        <h3 className="font-bold text-cute-brown mb-4 text-sm">Last 7 Days 📈</h3>
        <div className="flex items-end justify-between gap-1 h-28">
          {dailyTrend.map((day, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-[9px] text-cute-brown/50 font-semibold">
                {day.amount > 0 ? formatCurrency(day.amount, profile.currency).replace(/[\d,.\s]/g, '').slice(0, 2) : ''}
              </span>
              <div
                className="w-full rounded-t-lg transition-all duration-500"
                style={{
                  height: `${Math.max((day.amount / maxDaily) * 80, 4)}px`,
                  backgroundColor: day.amount > 0 ? '#F48FB1' : '#E0E0E0',
                }}
              />
              <span className="text-[10px] text-cute-brown/60 font-semibold">{day.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white rounded-3xl p-5 shadow-sm mb-5">
        <h3 className="font-bold text-cute-brown mb-4 text-sm">By Category 🏷️</h3>
        {categoryBreakdown.length === 0 ? (
          <div className="text-center py-6">
            <Mascot type={profile.mascot} size={45} />
            <p className="text-cute-brown/50 text-sm mt-2">No expenses recorded yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {categoryBreakdown.map((cat) => (
              <div key={cat.category}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-base">{CATEGORY_ICONS[cat.category]}</span>
                  <span className="text-xs font-bold text-cute-brown/70 flex-1">
                    {CATEGORY_LABELS[cat.category]}
                  </span>
                  <span className="text-xs font-bold text-cute-brown">
                    {formatCurrency(cat.amount, profile.currency)}
                  </span>
                  <span className="text-[10px] text-cute-brown/40 w-8 text-right">
                    {cat.percent.toFixed(0)}%
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full progress-fill"
                    style={{ width: `${cat.percent}%`, backgroundColor: cat.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Account Breakdown */}
      {accountBreakdown.length > 0 && (
        <div className="bg-white rounded-3xl p-5 shadow-sm mb-5">
          <h3 className="font-bold text-cute-brown mb-4 text-sm">By Payment Method 💳</h3>
          <div className="space-y-3">
            {accountBreakdown.map((acc) => (
              <div key={acc.account} className="flex items-center gap-3">
                <span className="text-xl">{accountIcons[acc.account]}</span>
                <div className="flex-1">
                  <p className="text-xs font-bold text-cute-brown">{accountLabels[acc.account]}</p>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden mt-1">
                    <div
                      className="h-full rounded-full progress-fill"
                      style={{ width: `${acc.percent}%`, backgroundColor: '#90CAF9' }}
                    />
                  </div>
                </div>
                <span className="text-xs font-bold text-cute-brown">
                  {formatCurrency(acc.amount, profile.currency)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Budget Compliance */}
      {budgetCompliance.length > 0 && (
        <div className="bg-white rounded-3xl p-5 shadow-sm mb-5">
          <h3 className="font-bold text-cute-brown mb-4 text-sm">Budget Health 🩺</h3>
          <div className="space-y-3">
            {budgetCompliance.map((cat) => (
              <div key={cat.category} className="flex items-center gap-2">
                <span className="text-lg">
                  {cat.status === 'over' ? '🔴' : cat.status === 'warning' ? '🟡' : '🟢'}
                </span>
                <span className="text-xs font-semibold text-cute-brown/70 flex-1">
                  {CATEGORY_ICONS[cat.category]} {CATEGORY_LABELS[cat.category]}
                </span>
                <span className="text-[10px] text-cute-brown/50">
                  {cat.percent.toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Fun Stats */}
      <div className="bg-gradient-to-br from-pastel-lavender/30 to-pastel-pink/30 rounded-3xl p-5 shadow-sm">
        <h3 className="font-bold text-cute-brown mb-3 text-sm">Fun Stats 🎉</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/70 rounded-xl p-3 text-center">
            <p className="text-2xl mb-1">📝</p>
            <p className="text-lg font-extrabold text-cute-brown">{monthTransactions.length}</p>
            <p className="text-[10px] text-cute-brown/50">Transactions</p>
          </div>
          <div className="bg-white/70 rounded-xl p-3 text-center">
            <p className="text-2xl mb-1">🏷️</p>
            <p className="text-lg font-extrabold text-cute-brown">{categoryBreakdown.length}</p>
            <p className="text-[10px] text-cute-brown/50">Categories Used</p>
          </div>
          <div className="bg-white/70 rounded-xl p-3 text-center">
            <p className="text-2xl mb-1">💰</p>
            <p className="text-lg font-extrabold text-cute-brown">
              {totalExpense > 0 && monthTransactions.length > 0
                ? formatCurrency(totalExpense / monthTransactions.filter(t => t.type === 'expense').length || 0, profile.currency)
                : '—'}
            </p>
            <p className="text-[10px] text-cute-brown/50">Avg. Expense</p>
          </div>
          <div className="bg-white/70 rounded-xl p-3 text-center">
            <p className="text-2xl mb-1">🏆</p>
            <p className="text-sm font-extrabold text-cute-brown">
              {categoryBreakdown[0] ? CATEGORY_ICONS[categoryBreakdown[0].category] : '—'}
            </p>
            <p className="text-[10px] text-cute-brown/50">Top Category</p>
          </div>
        </div>
      </div>
    </div>
  );
};
