import React, { useState } from 'react';
import { UserProfile, MascotType, Currency, BudgetRule } from '../types';
import { Mascot } from './Mascot';
import { saveProfile, calculateBudgetAllocation, saveMonthlyBudget, getCurrentMonthKey } from '../store';

interface SettingsProps {
  profile: UserProfile;
  onUpdate: (profile: UserProfile) => void;
}

export const Settings: React.FC<SettingsProps> = ({ profile, onUpdate }) => {
  const [editProfile, setEditProfile] = useState(false);
  const [newMascot, setNewMascot] = useState<MascotType>(profile.mascot);
  const [newCurrency, setNewCurrency] = useState<Currency>(profile.currency);
  const [newPayday, setNewPayday] = useState(profile.paydayDate);
  const [newBudgetRule, setNewBudgetRule] = useState<BudgetRule>(profile.budgetRule);
  const [newIncome, setNewIncome] = useState(profile.monthlyIncome.toString());
  const [showExport, setShowExport] = useState(false);
  const [exportData, setExportData] = useState('');

  const handleSave = () => {
    const updatedProfile: UserProfile = {
      ...profile,
      mascot: newMascot,
      currency: newCurrency,
      paydayDate: newPayday,
      budgetRule: newBudgetRule,
      monthlyIncome: parseFloat(newIncome) || 0,
    };
    saveProfile(updatedProfile);

    // Recalculate budget
    const budgetCategories = calculateBudgetAllocation(updatedProfile.monthlyIncome, newBudgetRule);
    saveMonthlyBudget({
      month: getCurrentMonthKey(),
      categories: budgetCategories,
      totalIncome: updatedProfile.monthlyIncome,
      totalSpent: 0,
    });

    onUpdate(updatedProfile);
    setEditProfile(false);
  };

  const handleExport = () => {
    const data = {
      profile,
      transactions: JSON.parse(localStorage.getItem('cute-finance-transactions') || '[]'),
      budget: JSON.parse(localStorage.getItem('cute-finance-budgets') || 'null'),
      exportDate: new Date().toISOString(),
    };
    setExportData(JSON.stringify(data, null, 2));
    setShowExport(true);
  };

  const handleReset = () => {
    if (confirm('Are you sure? This will delete ALL data!')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const mascots: { type: MascotType; name: string }[] = [
    { type: 'panda', name: 'Panda' },
    { type: 'shiba', name: 'Shiba' },
    { type: 'bunny', name: 'Bunny' },
    { type: 'capybara', name: 'Capybara' },
    { type: 'cat', name: 'Cat' },
  ];

  const currencies: { code: Currency; name: string }[] = [
    { code: 'IDR', name: 'IDR (Rp)' },
    { code: 'USD', name: 'USD ($)' },
    { code: 'EUR', name: 'EUR (€)' },
    { code: 'JPY', name: 'JPY (¥)' },
  ];

  return (
    <div className="px-4 pb-4 animate-fade-in">
      <h1 className="text-xl font-extrabold text-cute-brown mb-4 pt-2">Settings ⚙️</h1>

      {/* Profile Card */}
      <div className="bg-white rounded-3xl p-5 shadow-sm mb-5">
        <div className="flex items-center gap-4 mb-4">
          <Mascot type={profile.mascot} size={60} animate />
          <div>
            <h2 className="font-bold text-cute-brown text-lg">
              {mascots.find(m => m.type === profile.mascot)?.name}
            </h2>
            <p className="text-sm text-cute-brown/60">Your finance buddy</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-pastel-yellow/30 rounded-xl p-3">
            <p className="text-xs text-cute-brown/60">Currency</p>
            <p className="font-bold text-cute-brown">{profile.currency}</p>
          </div>
          <div className="bg-pastel-mint/30 rounded-xl p-3">
            <p className="text-xs text-cute-brown/60">Payday</p>
            <p className="font-bold text-cute-brown">Every {profile.paydayDate}th</p>
          </div>
          <div className="bg-pastel-pink/30 rounded-xl p-3">
            <p className="text-xs text-cute-brown/60">Budget Rule</p>
            <p className="font-bold text-cute-brown text-xs">{profile.budgetRule}</p>
          </div>
          <div className="bg-pastel-blue/30 rounded-xl p-3">
            <p className="text-xs text-cute-brown/60">Monthly Income</p>
            <p className="font-bold text-cute-brown text-xs">
              {profile.currency === 'IDR' ? 'Rp' : profile.currency === 'USD' ? '$' : profile.currency === 'EUR' ? '€' : '¥'}
              {profile.monthlyIncome.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Edit Profile */}
      {!editProfile ? (
        <button
          onClick={() => setEditProfile(true)}
          className="w-full bg-white rounded-2xl p-4 shadow-sm mb-5 flex items-center justify-between active:scale-[0.98] transition-transform"
        >
          <span className="font-bold text-cute-brown">✏️ Edit Profile</span>
          <span className="text-cute-brown/40">→</span>
        </button>
      ) : (
        <div className="bg-white rounded-3xl p-5 shadow-sm mb-5 animate-fade-in">
          <h3 className="font-bold text-cute-brown mb-4">Edit Profile</h3>
          
          {/* Mascot Selection */}
          <div className="mb-4">
            <p className="text-xs font-semibold text-cute-brown/60 mb-2">Mascot</p>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {mascots.map(m => (
                <button
                  key={m.type}
                  onClick={() => setNewMascot(m.type)}
                  className={`flex flex-col items-center p-2 rounded-xl min-w-[60px] transition-all ${
                    newMascot === m.type ? 'bg-pastel-pink/30 border-2 border-pastel-pink' : 'bg-gray-50 border-2 border-transparent'
                  }`}
                >
                  <Mascot type={m.type} size={35} />
                  <span className="text-[10px] text-cute-brown/60 mt-1">{m.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Currency */}
          <div className="mb-4">
            <p className="text-xs font-semibold text-cute-brown/60 mb-2">Currency</p>
            <div className="flex gap-2">
              {currencies.map(c => (
                <button
                  key={c.code}
                  onClick={() => setNewCurrency(c.code)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                    newCurrency === c.code ? 'bg-pastel-mint/50 border-2 border-pastel-mint' : 'bg-gray-50 border-2 border-transparent text-cute-brown/60'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Payday */}
          <div className="mb-4">
            <p className="text-xs font-semibold text-cute-brown/60 mb-2">Payday Date</p>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="1"
                max="31"
                value={newPayday}
                onChange={(e) => setNewPayday(parseInt(e.target.value))}
                className="flex-1 h-3 rounded-full appearance-none bg-gray-200 accent-pastel-pink"
              />
              <span className="text-lg font-bold text-cute-brown min-w-[40px] text-center">{newPayday}</span>
            </div>
          </div>

          {/* Budget Rule */}
          <div className="mb-4">
            <p className="text-xs font-semibold text-cute-brown/60 mb-2">Budget Method</p>
            <select
              value={newBudgetRule}
              onChange={(e) => setNewBudgetRule(e.target.value as BudgetRule)}
              className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm text-cute-brown font-semibold border-2 border-transparent focus:border-pastel-pink"
            >
              <option value="50-30-20">50/30/20 Rule</option>
              <option value="zero-based">Zero-Based Budget</option>
              <option value="custom">Custom Allocation</option>
            </select>
          </div>

          {/* Income */}
          <div className="mb-5">
            <p className="text-xs font-semibold text-cute-brown/60 mb-2">Monthly Income</p>
            <input
              type="number"
              value={newIncome}
              onChange={(e) => setNewIncome(e.target.value)}
              className="w-full bg-gray-50 rounded-xl px-4 py-3 text-lg font-bold text-cute-brown border-2 border-transparent focus:border-pastel-pink"
              inputMode="numeric"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setEditProfile(false)}
              className="flex-1 py-3 rounded-xl bg-gray-100 text-cute-brown/60 font-bold text-sm active:scale-95"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-3 rounded-xl bg-pastel-pink text-white font-bold text-sm active:scale-95 shadow-sm"
            >
              Save ✓
            </button>
          </div>
        </div>
      )}

      {/* Data Management */}
      <div className="bg-white rounded-3xl p-5 shadow-sm mb-5">
        <h3 className="font-bold text-cute-brown mb-4">Data Management 📦</h3>
        <div className="space-y-3">
          <button
            onClick={() => {
              const transactions = JSON.parse(localStorage.getItem('cute-finance-transactions') || '[]');
              if (transactions.length === 0) {
                alert('No transactions to export!');
                return;
              }
              const headers = 'Date,Type,Category,Amount,Account,Note\n';
              const rows = transactions.map((t: any) => 
                `${t.date},${t.type},${t.category},${t.amount},${t.account},"${t.note || ''}"`
              ).join('\n');
              const csv = headers + rows;
              const blob = new Blob([csv], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `cute-finance-${new Date().toISOString().split('T')[0]}.csv`;
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="w-full py-3 rounded-xl bg-pastel-mint/30 text-cute-brown font-bold text-sm active:scale-95 transition-transform"
          >
            📊 Export Transactions (CSV)
          </button>
          <button
            onClick={handleExport}
            className="w-full py-3 rounded-xl bg-pastel-yellow/40 text-cute-brown font-bold text-sm active:scale-95 transition-transform"
          >
            📤 Export Data (JSON)
          </button>
          <button
            onClick={() => {
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = '.json';
              input.onchange = (e) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (ev) => {
                    try {
                      const data = JSON.parse(ev.target?.result as string);
                      if (data.profile) saveProfile(data.profile);
                      if (data.transactions) localStorage.setItem('cute-finance-transactions', JSON.stringify(data.transactions));
                      if (data.budget) localStorage.setItem('cute-finance-budgets', JSON.stringify(data.budget));
                      alert('Data imported successfully! 🎉');
                      window.location.reload();
                    } catch {
                      alert('Invalid file format');
                    }
                  };
                  reader.readAsText(file);
                }
              };
              input.click();
            }}
            className="w-full py-3 rounded-xl bg-pastel-mint/40 text-cute-brown font-bold text-sm active:scale-95 transition-transform"
          >
            📥 Import Data (JSON)
          </button>
          <button
            onClick={handleReset}
            className="w-full py-3 rounded-xl bg-red-50 text-red-400 font-bold text-sm active:scale-95 transition-transform"
          >
            🗑️ Reset All Data
          </button>
        </div>
      </div>

      {/* Export Modal */}
      {showExport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowExport(false)} />
          <div className="relative bg-white rounded-3xl p-5 w-full max-w-sm animate-slide-up max-h-[80vh] overflow-y-auto">
            <h3 className="font-bold text-cute-brown mb-3">Export Data</h3>
            <textarea
              readOnly
              value={exportData}
              className="w-full h-48 bg-gray-50 rounded-xl p-3 text-xs font-mono text-cute-brown/70 resize-none"
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(exportData);
                  alert('Copied to clipboard!');
                }}
                className="flex-1 py-3 rounded-xl bg-pastel-blue/50 text-cute-brown font-bold text-sm active:scale-95"
              >
                📋 Copy
              </button>
              <button
                onClick={() => setShowExport(false)}
                className="flex-1 py-3 rounded-xl bg-gray-100 text-cute-brown/60 font-bold text-sm active:scale-95"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* About */}
      <div className="bg-gradient-to-br from-pastel-pink/20 to-pastel-yellow/20 rounded-3xl p-5 text-center">
        <Mascot type={profile.mascot} size={50} animate />
        <h3 className="font-bold text-cute-brown mt-2">CuteFinance v1.0</h3>
        <p className="text-xs text-cute-brown/50 mt-1">Your adorable finance companion 🐾</p>
        <p className="text-[10px] text-cute-brown/30 mt-2">
          Self-hosted PWA • Made with love
        </p>
      </div>
    </div>
  );
};
