import React from 'react';

interface FABProps {
  onClick: () => void;
}

export const FAB: React.FC<FABProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-20 right-4 z-50 w-14 h-14 bg-gradient-to-br from-pastel-pink to-pastel-peach rounded-full shadow-lg flex items-center justify-center active:scale-90 transition-transform duration-200"
      style={{ boxShadow: '0 4px 20px rgba(248, 187, 208, 0.5)' }}
    >
      <span className="text-2xl text-white font-bold">+</span>
    </button>
  );
};
