import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import confetti from 'canvas-confetti';
import { UserProfile, Transaction, CategoryType, AccountType } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { CATEGORY_LABELS, CATEGORY_ICONS, formatCurrency } from '../store';

interface AddTransactionProps {
  profile: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onAdded: () => void;
}

const categories: CategoryType[] = [
  'food', 'dessert', 'fruit', 'drink', 'bills', 'transport',
  'shopping', 'entertainment', 'health', 'education', 'pet-care', 'charity', 'interest', 'bonus', 'other'
];

const accounts: { type: AccountType; label: string; icon: string }[] = [
  { type: 'cash', label: 'Cash', icon: '💵' },
  { type: 'bank', label: 'Bank', icon: '🏦' },
  { type: 'ewallet', label: 'E-Wallet', icon: '📱' },
];

export const AddTransaction: React.FC<AddTransactionProps> = ({ profile, isOpen, onClose, onAdded }) => {
  const { token } = useAuth();
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<CategoryType>('food');
  const [account, setAccount] = useState<AccountType>('cash');
  const [note, setNote] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!amount || parseFloat(amount) <= 0) return;

    setSaving(true);

    const transaction: Transaction = {
      id: uuidv4(),
      amount: parseFloat(amount),
      category,
      account,
      note,
      date: new Date().toISOString().split('T')[0],
      type,
      userId: 0, // Will be set by server
    };

    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token || '',
        },
        body: JSON.stringify(transaction),
      });

      if (!response.ok) {
        throw new Error('Failed to save transaction');
      }

      setShowSuccess(true);
      
      // Confetti celebration!
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#F8BBD0', '#FFF9C4', '#C8E6C9', '#BBDEFB', '#E1BEE7'],
      });
      
      setTimeout(() => {
        setShowSuccess(false);
        setAmount('');
        setNote('');
        setCategory('food');
        onAdded();
        onClose();
      }, 800);
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save transaction. Please try again.');
    }

    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30 sheet-overlay" onClick={onClose} />
      
      {/* Sheet */}
      <div className="relative w-full bg-white rounded-t-3xl animate-slide-up max-h-[90vh] overflow-y-auto">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1.5 bg-gray-300 rounded-full" />
        </div>

        {/* Success overlay */}
        {showSuccess && (
          <div className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center z-10 rounded-t-3xl">
            <div className="text-5xl mb-3 animate-bounce-soft">🎉</div>
            <p className="text-lg font-bold text-cute-brown">Added Successfully!</p>
            <p className="text-sm text-cute-brown/60">Your buddy is happy~ 🐾</p>
          </div>
        )}

        <div className="px-5 pb-8">
          {/* Type Toggle */}
          <div className="flex bg-gray-100 rounded-2xl p-1 mb-5">
            <button
              onClick={() => setType('expense')}
              className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${
                type === 'expense' ? 'bg-pastel-pink text-white shadow-sm' : 'text-cute-brown/60'
              }`}
            >
              💸 Expense
            </button>
            <button
              onClick={() => setType('income')}
              className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${
                type === 'income' ? 'bg-pastel-mint text-white shadow-sm' : 'text-cute-brown/60'
              }`}
            >
              💰 Income
            </button>
          </div>

          {/* Amount Input */}
          <div className="text-center mb-4">
            <p className="text-sm text-cute-brown/60 font-semibold mb-2">Amount</p>
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl font-bold text-cute-brown">
                {profile.currency === 'IDR' ? 'Rp' : profile.currency === 'USD' ? '$' : profile.currency === 'EUR' ? '€' : '¥'}
              </span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="text-4xl font-extrabold text-cute-brown text-center bg-transparent w-48 border-b-2 border-pastel-pink focus:border-pastel-pink pb-1"
                inputMode="numeric"
              />
            </div>
            {amount && parseFloat(amount) > 0 && (
              <p className="text-xs text-cute-brown/40 mt-2">
                {formatCurrency(parseFloat(amount), profile.currency)}
              </p>
            )}
          </div>

          {/* Quick Amount Buttons */}
          <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
            {(profile.currency === 'IDR' 
              ? [10000, 25000, 50000, 100000, 200000, 500000]
              : [5, 10, 20, 50, 100, 200]
            ).map((val) => (
              <button
                key={val}
                onClick={() => setAmount(val.toString())}
                className="px-3 py-2 rounded-full bg-pastel-yellow/40 text-xs font-bold text-cute-brown whitespace-nowrap active:scale-90 transition-transform flex-shrink-0"
              >
                {profile.currency === 'IDR' ? `${(val/1000)}k` : `${profile.currency === 'USD' ? '$' : profile.currency === 'EUR' ? '€' : '¥'}${val}`}
              </button>
            ))}
          </div>

          {/* Category Selection */}
          <div className="mb-5">
            <p className="text-sm text-cute-brown/60 font-semibold mb-3">Category</p>
            <div className="grid grid-cols-5 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`flex flex-col items-center p-2 rounded-xl transition-all active:scale-90 ${
                    category === cat
                      ? 'bg-pastel-yellow/60 border-2 border-pastel-yellow shadow-sm'
                      : 'bg-gray-50 border-2 border-transparent'
                  }`}
                >
                  <span className="text-xl">{CATEGORY_ICONS[cat]}</span>
                  <span className="text-[9px] text-cute-brown/60 mt-1 text-center leading-tight">
                    {CATEGORY_LABELS[cat].split(' ')[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Account Selection */}
          <div className="mb-5">
            <p className="text-sm text-cute-brown/60 font-semibold mb-3">Payment Method</p>
            <div className="flex gap-2">
              {accounts.map((acc) => (
                <button
                  key={acc.type}
                  onClick={() => setAccount(acc.type)}
                  className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all active:scale-95 ${
                    account === acc.type
                      ? 'bg-pastel-blue/50 border-2 border-pastel-blue shadow-sm'
                      : 'bg-gray-50 border-2 border-transparent text-cute-brown/60'
                  }`}
                >
                  {acc.icon} {acc.label}
                </button>
              ))}
            </div>
          </div>

          {/* Note */}
          <div className="mb-6">
            <p className="text-sm text-cute-brown/60 font-semibold mb-2">Note (optional)</p>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="What's this for?"
              className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm text-cute-brown border-2 border-transparent focus:border-pastel-pink"
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={!amount || parseFloat(amount) <= 0 || saving}
            className={`w-full py-4 rounded-2xl font-bold text-base text-white shadow-lg active:scale-95 transition-all ${
              amount && parseFloat(amount) > 0 && !saving
                ? type === 'expense' ? 'bg-pastel-pink' : 'bg-pastel-mint'
                : 'bg-gray-300'
            }`}
          >
            {saving ? 'Saving...' : type === 'expense' ? '💸 Record Expense' : '💰 Record Income'}
          </button>
        </div>
      </div>
    </div>
  );
};
