import React, { useState } from 'react';
import { MascotType, Currency, BudgetRule, UserProfile } from '../types';
import { Mascot } from './Mascot';
import { saveProfile } from '../store';

interface SetupWizardProps {
  onComplete: (profile: UserProfile) => void;
}

const mascots: { type: MascotType; name: string; desc: string }[] = [
  { type: 'panda', name: 'Panda', desc: 'Chill & wise financial advisor' },
  { type: 'shiba', name: 'Shiba', desc: 'Enthusiastic savings buddy' },
  { type: 'bunny', name: 'Bunny', desc: 'Quick & gentle money tracker' },
  { type: 'capybara', name: 'Capybara', desc: 'Relaxed budget companion' },
  { type: 'cat', name: 'Cat', desc: 'Independent & smart planner' },
];

const currencies: { code: Currency; symbol: string; name: string }[] = [
  { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
];

const budgetRules: { rule: BudgetRule; name: string; desc: string; icon: string }[] = [
  { rule: '50-30-20', name: '50/30/20 Rule', desc: 'Needs 50% • Wants 30% • Savings 20%', icon: '📊' },
  { rule: 'zero-based', name: 'Zero-Based', desc: 'Survival 40% • Lifestyle 20% • Future 30% • Care 10%', icon: '🎯' },
  { rule: 'custom', name: 'Custom', desc: 'Set your own allocation percentages', icon: '✨' },
];

export const SetupWizard: React.FC<SetupWizardProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [selectedMascot, setSelectedMascot] = useState<MascotType>('panda');
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>('IDR');
  const [paydayDate, setPaydayDate] = useState(25);
  const [budgetRule, setBudgetRule] = useState<BudgetRule>('50-30-20');
  const [monthlyIncome, setMonthlyIncome] = useState('');

  const totalSteps = 5;

  const handleComplete = () => {
    const profile: UserProfile = {
      mascot: selectedMascot,
      currency: selectedCurrency,
      paydayDate,
      budgetRule,
      monthlyIncome: parseFloat(monthlyIncome) || 0,
      setupComplete: true,
    };
    saveProfile(profile);
    onComplete(profile);
  };

  const nextStep = () => setStep(s => Math.min(s + 1, totalSteps - 1));
  const prevStep = () => setStep(s => Math.max(s - 1, 0));

  return (
    <div className="min-h-screen bg-gradient-to-b from-pastel-yellow via-pastel-cream to-white flex flex-col">
      {/* Progress bar */}
      <div className="px-6 pt-8 pb-4">
        <div className="flex gap-2">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                i <= step ? 'bg-pastel-pink' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
        <p className="text-center text-sm text-cute-brown/60 mt-2 font-semibold">
          Step {step + 1} of {totalSteps}
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pb-8 flex flex-col">
        {/* Step 0: Welcome */}
        {step === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center animate-fade-in">
            <div className="animate-float mb-6">
              <Mascot type="panda" size={120} animate />
            </div>
            <h1 className="text-3xl font-extrabold text-cute-brown text-center mb-3">
              Welcome to CuteFinance! 🐾
            </h1>
            <p className="text-cute-brown/70 text-center text-base max-w-xs">
              Your adorable personal finance companion. Let's set things up together!
            </p>
            <div className="mt-8 flex gap-3">
              <div className="w-3 h-3 rounded-full bg-pastel-pink animate-pulse-soft" />
              <div className="w-3 h-3 rounded-full bg-pastel-mint animate-pulse-soft" style={{ animationDelay: '0.3s' }} />
              <div className="w-3 h-3 rounded-full bg-pastel-yellow animate-pulse-soft" style={{ animationDelay: '0.6s' }} />
            </div>
          </div>
        )}

        {/* Step 1: Choose Mascot */}
        {step === 1 && (
          <div className="flex-1 flex flex-col animate-fade-in">
            <h2 className="text-2xl font-bold text-cute-brown mb-2">Choose Your Buddy 🐻</h2>
            <p className="text-cute-brown/60 mb-6">Pick a cute companion for your finance journey!</p>
            <div className="grid grid-cols-2 gap-3 flex-1">
              {mascots.map((m) => (
                <button
                  key={m.type}
                  onClick={() => setSelectedMascot(m.type)}
                  className={`rounded-2xl p-4 flex flex-col items-center transition-all duration-200 active:scale-95 ${
                    selectedMascot === m.type
                      ? 'bg-pastel-pink/40 border-2 border-pastel-pink shadow-md'
                      : 'bg-white border-2 border-transparent shadow-sm'
                  }`}
                >
                  <Mascot type={m.type} size={60} animate={selectedMascot === m.type} />
                  <span className="font-bold text-cute-brown text-sm mt-2">{m.name}</span>
                  <span className="text-xs text-cute-brown/50 text-center mt-1">{m.desc}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Currency */}
        {step === 2 && (
          <div className="flex-1 flex flex-col animate-fade-in">
            <h2 className="text-2xl font-bold text-cute-brown mb-2">Your Currency 💱</h2>
            <p className="text-cute-brown/60 mb-6">What currency do you use?</p>
            <div className="space-y-3">
              {currencies.map((c) => (
                <button
                  key={c.code}
                  onClick={() => setSelectedCurrency(c.code)}
                  className={`w-full rounded-2xl p-4 flex items-center gap-4 transition-all duration-200 active:scale-[0.98] ${
                    selectedCurrency === c.code
                      ? 'bg-pastel-mint/50 border-2 border-pastel-mint shadow-md'
                      : 'bg-white border-2 border-transparent shadow-sm'
                  }`}
                >
                  <span className="text-3xl">{c.symbol}</span>
                  <div className="text-left">
                    <span className="font-bold text-cute-brown block">{c.code}</span>
                    <span className="text-sm text-cute-brown/60">{c.name}</span>
                  </div>
                  {selectedCurrency === c.code && (
                    <span className="ml-auto text-2xl">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Payday & Income */}
        {step === 3 && (
          <div className="flex-1 flex flex-col animate-fade-in">
            <h2 className="text-2xl font-bold text-cute-brown mb-2">Income Details 💰</h2>
            <p className="text-cute-brown/60 mb-6">Tell us about your salary schedule</p>
            
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <label className="text-sm font-bold text-cute-brown block mb-3">
                  📅 Payday Date (day of month)
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="1"
                    max="31"
                    value={paydayDate}
                    onChange={(e) => setPaydayDate(parseInt(e.target.value))}
                    className="flex-1 h-3 rounded-full appearance-none bg-gray-200 accent-pastel-pink"
                  />
                  <span className="text-2xl font-bold text-cute-brown min-w-[50px] text-center">
                    {paydayDate}
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <label className="text-sm font-bold text-cute-brown block mb-3">
                  💵 Monthly Income ({selectedCurrency})
                </label>
                <input
                  type="number"
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(e.target.value)}
                  placeholder="e.g. 10000000"
                  className="w-full text-2xl font-bold text-cute-brown bg-pastel-yellow/30 rounded-xl px-4 py-3 border-2 border-transparent focus:border-pastel-pink"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Budget Rule */}
        {step === 4 && (
          <div className="flex-1 flex flex-col animate-fade-in">
            <h2 className="text-2xl font-bold text-cute-brown mb-2">Budget Method 📋</h2>
            <p className="text-cute-brown/60 mb-6">How would you like to allocate your budget?</p>
            <div className="space-y-3">
              {budgetRules.map((b) => (
                <button
                  key={b.rule}
                  onClick={() => setBudgetRule(b.rule)}
                  className={`w-full rounded-2xl p-4 flex items-center gap-4 transition-all duration-200 active:scale-[0.98] ${
                    budgetRule === b.rule
                      ? 'bg-pastel-lavender/40 border-2 border-pastel-lavender shadow-md'
                      : 'bg-white border-2 border-transparent shadow-sm'
                  }`}
                >
                  <span className="text-3xl">{b.icon}</span>
                  <div className="text-left flex-1">
                    <span className="font-bold text-cute-brown block">{b.name}</span>
                    <span className="text-xs text-cute-brown/60">{b.desc}</span>
                  </div>
                  {budgetRule === b.rule && (
                    <span className="text-2xl">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Navigation buttons */}
      <div className="px-6 pb-8 safe-bottom">
        <div className="flex gap-3">
          {step > 0 && (
            <button
              onClick={prevStep}
              className="px-6 py-4 rounded-2xl bg-white border-2 border-gray-200 text-cute-brown font-bold text-base active:scale-95 transition-transform"
            >
              Back
            </button>
          )}
          <button
            onClick={step === totalSteps - 1 ? handleComplete : nextStep}
            className="flex-1 py-4 rounded-2xl bg-pastel-pink text-white font-bold text-base shadow-lg active:scale-95 transition-transform"
          >
            {step === totalSteps - 1 ? "Let's Go! 🎉" : 'Next →'}
          </button>
        </div>
      </div>
    </div>
  );
};
