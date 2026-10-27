import React from 'react';
import { PageType } from '../types';

interface BottomNavProps {
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
}

const navItems: { page: PageType; icon: string; label: string }[] = [
  { page: 'dashboard', icon: '🏠', label: 'Home' },
  { page: 'transactions', icon: '📋', label: 'History' },
  { page: 'statistics', icon: '📊', label: 'Stats' },
  { page: 'settings', icon: '⚙️', label: 'Settings' },
];

export const BottomNav: React.FC<BottomNavProps> = ({ currentPage, onNavigate }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-100 safe-bottom z-40">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto px-2">
        {navItems.map((item) => (
          <button
            key={item.page}
            onClick={() => onNavigate(item.page)}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-200 active:scale-90 ${
              currentPage === item.page
                ? 'bg-pastel-pink/30'
                : ''
            }`}
          >
            <span className={`text-xl transition-transform duration-200 ${
              currentPage === item.page ? 'scale-110' : ''
            }`}>
              {item.icon}
            </span>
            <span className={`text-[10px] font-bold mt-0.5 transition-colors ${
              currentPage === item.page ? 'text-cute-brown' : 'text-cute-brown/40'
            }`}>
              {item.label}
            </span>
            {currentPage === item.page && (
              <div className="w-1 h-1 rounded-full bg-pastel-pink mt-0.5" />
            )}
          </button>
        ))}
      </div>
    </nav>
  );
};
