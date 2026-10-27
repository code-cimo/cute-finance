import React, { useMemo } from 'react';
import { UserProfile, Transaction } from '../types';
import { Mascot, MascotMessage } from './Mascot';
import {
  formatCurrency,
  getMonthlyBudget,
  getMonthTransactions,
  getCurrentMonthKey,
  CATEGORY_COLORS,
  CATEGORY_LABELS,
  CATEGORY_ICONS,
  calculateCategorySpent,
} from '../store';

interface DashboardProps {
  profile: UserProfile;
  transactions: Transaction[];
}

export const Dashboard: React.FC<DashboardProps> = ({ profile, transactions }) => {
  const monthKey = getCurrentMonthKey();
  const monthTransactions = useMemo(() => getMonthTransactions(transactions, monthKey), [transactions, monthKey]);
  const budget = useMemo(() => getMonthlyBudget(), []);

  const totalIncome = profile.monthlyIncome;
  const totalSpent = useMemo(
    () => monthTransactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0),
    [monthTransactions]
  );
  const remaining = totalIncome - totalSpent;
  const spentPercent = totalIncome > 0 ? Math.min((totalSpent / totalIncome) * 100, 100) : 0;

  // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getMascotMessage = () => {
    if (spentPercent < 30) return "You're doing great! Keep it up! 🌟";
    if (spentPercent < 60) return "Nice spending habits today! 💪";
    if (spentPercent < 80) return "Getting close to budget limit... 🤔";
    return "Careful! Budget almost used up! 😿";
  };

  // Category breakdown for donut chart
  const categoryData = useMemo(() => {
    if (!budget) return [];
    return budget.categories
      .map(cat => ({
        ...cat,
        spent: calculateCategorySpent(monthTransactions, cat.category),
        percent: cat.limit > 0 ? (calculateCategorySpent(monthTransactions, cat.category) / cat.limit) * 100 : 0,
      }))
      .filter(cat => cat.spent > 0)
      .sort((a, b) => b.spent - a.spent);
  }, [budget, monthTransactions]);

  // Recent transactions
  const recentTransactions = monthTransactions.slice(0, 5);

  // Streak calculation
  const getStreak = () => {
    if (monthTransactions.length === 0) return 0;
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const hasTransaction = monthTransactions.some(t => t.date === dateStr);
      if (hasTransaction) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }
    return streak;
  };

  // Daily tips
  const getDailyTip = () => {
    const tips = [
      "Try the 24-hour rule: Wait before making impulse purchases! 🛒",
      "Track every expense, no matter how small. It adds up! 📝",
      "Set aside savings first, then spend what's left. 🏦",
      "Review your subscriptions monthly. Cancel what you don't use! 📱",
      "Cook at home more often — your wallet & health will thank you! 🍳",
      "Use cash for discretionary spending to feel the cost. 💵",
      "Automate your savings — pay yourself first! 💰",
      "Challenge: No-spend weekend! See how much you can save. 🎯",
    ];
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    return tips[dayOfYear % tips.length];
  };

  return (
    <div className="px-4 pb-4 animate-fade-in">
      {/* Header with mascot */}
      <div className="flex items-end gap-3 mb-4 pt-2">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="text-cute-brown/60 text-sm font-semibold">{getGreeting()} 👋</p>
            <span className="text-xs bg-pastel-pink/30 px-2 py-0.5 rounded-full text-cute-brown/60 font-semibold">
              {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          </div>
          <h1 className="text-lg font-extrabold text-cute-brown mt-1">
            {getMascotMessage()}
          </h1>
        </div>
        <div className="animate-float">
          <Mascot type={profile.mascot} size={55} animate />
        </div>
      </div>

      {/* Balance Card */}
      <div className="bg-gradient-to-br from-pastel-pink/60 via-pastel-peach/40 to-pastel-yellow/40 rounded-3xl p-5 shadow-lg mb-5">
        <p className="text-cute-brown/70 text-sm font-semibold mb-1">This Month's Budget</p>
        <h2 className="text-3xl font-extrabold text-cute-brown mb-3">
          {formatCurrency(remaining, profile.currency)}
        </h2>
        <div className="flex justify-between text-xs text-cute-brown/60 mb-2">
          <span>Spent: {formatCurrency(totalSpent, profile.currency)}</span>
          <span>Budget: {formatCurrency(totalIncome, profile.currency)}</span>
        </div>
        <div className="h-3 bg-white/60 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full progress-fill transition-all"
            style={{
              width: `${spentPercent}%`,
              background: spentPercent > 80 ? '#EF5350' : spentPercent > 60 ? '#FFA726' : '#66BB6A',
            }}
          />
        </div>
        <p className="text-xs text-cute-brown/50 mt-2 text-right">
          {spentPercent.toFixed(0)}% used
        </p>
      </div>

      {/* Donut Chart */}
      {categoryData.length > 0 && (
        <div className="bg-white rounded-3xl p-5 shadow-sm mb-5">
          <h3 className="font-bold text-cute-brown mb-4 text-sm">Spending Breakdown 📊</h3>
          <div className="flex items-center gap-4">
            <div className="relative w-28 h-28 flex-shrink-0">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                {categoryData.reduce<{ elements: React.ReactNode[]; offset: number }>(
                  (acc, cat, i) => {
                    const total = categoryData.reduce((s, c) => s + c.spent, 0);
                    const percent = (cat.spent / total) * 100;
                    const dashArray = `${percent} ${100 - percent}`;
                    acc.elements.push(
                      <circle
                        key={i}
                        cx="18"
                        cy="18"
                        r="14"
                        fill="none"
                        stroke={cat.color}
                        strokeWidth="5"
                        strokeDasharray={dashArray}
                        strokeDashoffset={-acc.offset}
                        strokeLinecap="round"
                        className="donut-segment"
                      />
                    );
                    acc.offset += percent;
                    return acc;
                  },
                  { elements: [], offset: 0 }
                ).elements}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <Mascot type={profile.mascot} size={35} />
              </div>
            </div>
            <div className="flex-1 space-y-2 max-h-28 overflow-y-auto">
              {categoryData.slice(0, 4).map((cat) => (
                <div key={cat.category} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                  <span className="text-xs text-cute-brown/70 flex-1 truncate">
                    {CATEGORY_ICONS[cat.category]} {CATEGORY_LABELS[cat.category]}
                  </span>
                  <span className="text-xs font-bold text-cute-brown">
                    {formatCurrency(cat.spent, profile.currency)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Budget Progress */}
      {budget && (
        <div className="bg-white rounded-3xl p-5 shadow-sm mb-5">
          <h3 className="font-bold text-cute-brown mb-4 text-sm">Budget Progress 🎯</h3>
          <div className="space-y-3 max-h-48 overflow-y-auto">
            {budget.categories
              .map(cat => ({
                ...cat,
                spent: calculateCategorySpent(monthTransactions, cat.category),
              }))
              .filter(cat => cat.spent > 0 || cat.limit > 0)
              .slice(0, 6)
              .map((cat) => {
                const percent = cat.limit > 0 ? Math.min((cat.spent / cat.limit) * 100, 100) : 0;
                return (
                  <div key={cat.category}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-semibold text-cute-brown/70">
                        {CATEGORY_ICONS[cat.category]} {CATEGORY_LABELS[cat.category]}
                      </span>
                      <span className="text-xs text-cute-brown/50">
                        {formatCurrency(cat.spent, profile.currency)} / {formatCurrency(cat.limit, profile.currency)}
                      </span>
                    </div>
                    <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full progress-fill"
                        style={{
                          width: `${percent}%`,
                          backgroundColor: percent > 90 ? '#EF5350' : percent > 70 ? '#FFA726' : cat.color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Savings Goal */}
      <div className="bg-gradient-to-br from-pastel-mint/40 to-pastel-blue/30 rounded-3xl p-5 shadow-sm mb-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-cute-brown text-sm">Savings Goal 🎯</h3>
          <span className="text-xs bg-white/70 px-2 py-1 rounded-full text-cute-brown/60 font-semibold">
            This Month
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <div className="flex justify-between text-xs text-cute-brown/60 mb-1">
              <span>Saved</span>
              <span>{formatCurrency(remaining, profile.currency)} / {formatCurrency(totalIncome * 0.2, profile.currency)}</span>
            </div>
            <div className="h-3 bg-white/60 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-pastel-mint to-pastel-blue progress-fill"
                style={{ width: `${totalIncome > 0 ? Math.min((remaining / (totalIncome * 0.2)) * 100, 100) : 0}%` }}
              />
            </div>
            <p className="text-[10px] text-cute-brown/40 mt-1">
              20% savings target: {formatCurrency(totalIncome * 0.2, profile.currency)}
            </p>
          </div>
          <div className="text-center">
            <span className="text-2xl">
              {remaining >= totalIncome * 0.2 ? '🏆' : remaining >= totalIncome * 0.1 ? '⭐' : '💪'}
            </span>
          </div>
        </div>
      </div>

      {/* Streak & Quick Tips */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-white/70 rounded-2xl p-4 shadow-sm flex items-center gap-3">
          <span className="text-2xl">🔥</span>
          <div>
            <p className="text-lg font-extrabold text-cute-brown">{getStreak()} days</p>
            <p className="text-[10px] text-cute-brown/50">Logging streak</p>
          </div>
        </div>
        <div className="bg-white/70 rounded-2xl p-4 shadow-sm flex items-center gap-2">
          <span className="text-xl">💡</span>
          <div>
            <p className="text-[10px] text-cute-brown/50 font-semibold">Tip</p>
            <p className="text-[10px] text-cute-brown/70 leading-tight">
              {getDailyTip().split('.')[0]}.
            </p>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-3xl p-5 shadow-sm">
        <h3 className="font-bold text-cute-brown mb-4 text-sm">Recent Activity 📝</h3>
        {recentTransactions.length === 0 ? (
          <div className="text-center py-6">
            <Mascot type={profile.mascot} size={50} />
            <p className="text-cute-brown/50 text-sm mt-2">No transactions yet this month!</p>
            <p className="text-cute-brown/40 text-xs">Tap + to add your first one</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentTransactions.map((t) => (
              <div key={t.id} className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                  style={{ backgroundColor: `${CATEGORY_COLORS[t.category]}30` }}
                >
                  {CATEGORY_ICONS[t.category]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-cute-brown truncate">
                    {CATEGORY_LABELS[t.category]}
                  </p>
                  <p className="text-xs text-cute-brown/50 truncate">
                    {t.note || t.date.split('-').reverse().join('/')}
                  </p>
                </div>
                <span className={`text-sm font-bold ${t.type === 'income' ? 'text-green-500' : 'text-cute-brown'}`}>
                  {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount, profile.currency)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
