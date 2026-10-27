import React, { useState, useEffect } from 'react';

export const InstallPrompt: React.FC = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) return;
    
    // Check if user dismissed before
    if (localStorage.getItem('cute-finance-dismissed-install')) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Show prompt after 3 seconds
      setTimeout(() => setShowPrompt(true), 3000);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('cute-finance-dismissed-install', 'true');
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-24 left-4 right-4 z-50 animate-slide-up">
      <div className="bg-white rounded-2xl shadow-xl p-4 max-w-sm mx-auto border-2 border-pastel-pink/20">
        <div className="flex items-start gap-3">
          <span className="text-3xl">📲</span>
          <div className="flex-1">
            <p className="text-sm font-bold text-cute-brown">Install CuteFinance!</p>
            <p className="text-xs text-cute-brown/60 mt-0.5">
              Add to your home screen for quick access & offline support
            </p>
          </div>
        </div>
        <div className="flex gap-2 mt-3">
          <button
            onClick={handleDismiss}
            className="flex-1 py-2 rounded-xl bg-gray-100 text-cute-brown/60 font-bold text-xs active:scale-95"
          >
            Not now
          </button>
          <button
            onClick={handleInstall}
            className="flex-1 py-2 rounded-xl bg-pastel-pink text-white font-bold text-xs active:scale-95 shadow-sm"
          >
            Install 🐾
          </button>
        </div>
      </div>
    </div>
  );
};
