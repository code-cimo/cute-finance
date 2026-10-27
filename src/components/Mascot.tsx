import React from 'react';
import { MascotType } from '../types';

interface MascotProps {
  type: MascotType;
  size?: number;
  animate?: boolean;
  mood?: 'happy' | 'excited' | 'neutral' | 'sad';
}

export const Mascot: React.FC<MascotProps> = ({ type, size = 80, animate = false, mood = 'happy' }) => {
  const animClass = animate ? 'animate-bounce-soft' : '';
  
  const getEyes = () => {
    switch (mood) {
      case 'excited': return '◕ ◕';
      case 'happy': return '◕ ◕';
      case 'neutral': return '• •';
      case 'sad': return '╥ ╥';
      default: return '◕ ◕';
    }
  };

  const getMouth = () => {
    switch (mood) {
      case 'excited': return 'ω';
      case 'happy': return 'ω';
      case 'neutral': return '—';
      case 'sad': return '︵';
      default: return 'ω';
    }
  };

  switch (type) {
    case 'panda':
      return (
        <div className={`${animClass} inline-block`} style={{ width: size, height: size }}>
          <svg viewBox="0 0 100 100" width={size} height={size}>
            {/* Ears */}
            <circle cx="25" cy="22" r="14" fill="#333" />
            <circle cx="75" cy="22" r="14" fill="#333" />
            {/* Head */}
            <circle cx="50" cy="50" r="35" fill="white" stroke="#eee" strokeWidth="1" />
            {/* Eye patches */}
            <ellipse cx="35" cy="45" rx="12" ry="10" fill="#333" />
            <ellipse cx="65" cy="45" rx="12" ry="10" fill="#333" />
            {/* Eyes */}
            <circle cx="35" cy="44" r="5" fill="white" />
            <circle cx="65" cy="44" r="5" fill="white" />
            <circle cx="36" cy="43" r="2.5" fill="#333" />
            <circle cx="66" cy="43" r="2.5" fill="#333" />
            {/* Eye sparkle */}
            <circle cx="37" cy="42" r="1" fill="white" />
            <circle cx="67" cy="42" r="1" fill="white" />
            {/* Nose */}
            <ellipse cx="50" cy="56" rx="4" ry="3" fill="#333" />
            {/* Mouth */}
            {mood === 'happy' || mood === 'excited' ? (
              <path d="M 44 60 Q 50 67 56 60" fill="none" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
            ) : (
              <path d="M 45 62 Q 50 60 55 62" fill="none" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
            )}
            {/* Blush */}
            <circle cx="28" cy="55" r="5" fill="#FFB6C1" opacity="0.5" />
            <circle cx="72" cy="55" r="5" fill="#FFB6C1" opacity="0.5" />
            {/* Bamboo */}
            <rect x="82" y="60" width="3" height="25" rx="1" fill="#81C784" />
            <ellipse cx="83" cy="58" rx="5" ry="3" fill="#A5D6A7" />
          </svg>
        </div>
      );

    case 'shiba':
      return (
        <div className={`${animClass} inline-block`} style={{ width: size, height: size }}>
          <svg viewBox="0 0 100 100" width={size} height={size}>
            {/* Ears */}
            <polygon points="20,15 30,40 10,35" fill="#E8A849" />
            <polygon points="80,15 70,40 90,35" fill="#E8A849" />
            <polygon points="22,18 30,38 14,34" fill="#FFD54F" />
            <polygon points="78,18 70,38 86,34" fill="#FFD54F" />
            {/* Head */}
            <circle cx="50" cy="52" r="33" fill="#E8A849" />
            {/* Face white area */}
            <ellipse cx="50" cy="60" rx="22" ry="20" fill="#FFF8E1" />
            {/* Eyes */}
            <circle cx="38" cy="48" r="4" fill="#333" />
            <circle cx="62" cy="48" r="4" fill="#333" />
            <circle cx="39" cy="47" r="1.5" fill="white" />
            <circle cx="63" cy="47" r="1.5" fill="white" />
            {/* Nose */}
            <ellipse cx="50" cy="58" rx="4" ry="3" fill="#333" />
            {/* Mouth */}
            {mood === 'happy' || mood === 'excited' ? (
              <>
                <path d="M 44 62 Q 50 68 56 62" fill="none" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M 47 62 L 50 66 L 53 62" fill="#FF8A80" opacity="0.7" />
              </>
            ) : (
              <path d="M 46 63 Q 50 61 54 63" fill="none" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
            )}
            {/* Blush */}
            <circle cx="30" cy="56" r="5" fill="#FFB6C1" opacity="0.4" />
            <circle cx="70" cy="56" r="5" fill="#FFB6C1" opacity="0.4" />
            {/* Tongue for excited */}
            {mood === 'excited' && (
              <ellipse cx="50" cy="68" rx="4" ry="5" fill="#FF8A80" />
            )}
          </svg>
        </div>
      );

    case 'bunny':
      return (
        <div className={`${animClass} inline-block`} style={{ width: size, height: size }}>
          <svg viewBox="0 0 100 100" width={size} height={size}>
            {/* Ears */}
            <ellipse cx="35" cy="18" rx="8" ry="22" fill="white" stroke="#eee" strokeWidth="0.5" />
            <ellipse cx="65" cy="18" rx="8" ry="22" fill="white" stroke="#eee" strokeWidth="0.5" />
            <ellipse cx="35" cy="18" rx="4" ry="16" fill="#FFB6C1" />
            <ellipse cx="65" cy="18" rx="4" ry="16" fill="#FFB6C1" />
            {/* Head */}
            <circle cx="50" cy="55" r="30" fill="white" stroke="#eee" strokeWidth="0.5" />
            {/* Eyes */}
            <circle cx="38" cy="50" r="5" fill="#333" />
            <circle cx="62" cy="50" r="5" fill="#333" />
            <circle cx="39" cy="49" r="2" fill="white" />
            <circle cx="63" cy="49" r="2" fill="white" />
            {/* Nose */}
            <ellipse cx="50" cy="60" rx="3" ry="2.5" fill="#FFB6C1" />
            {/* Mouth */}
            {mood === 'happy' || mood === 'excited' ? (
              <path d="M 44 64 Q 50 70 56 64" fill="none" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
            ) : (
              <path d="M 46 65 Q 50 63 54 65" fill="none" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
            )}
            {/* Whiskers */}
            <line x1="15" y1="58" x2="32" y2="60" stroke="#ddd" strokeWidth="1" />
            <line x1="15" y1="63" x2="32" y2="63" stroke="#ddd" strokeWidth="1" />
            <line x1="68" y1="60" x2="85" y2="58" stroke="#ddd" strokeWidth="1" />
            <line x1="68" y1="63" x2="85" y2="63" stroke="#ddd" strokeWidth="1" />
            {/* Blush */}
            <circle cx="30" cy="58" r="5" fill="#FFB6C1" opacity="0.4" />
            <circle cx="70" cy="58" r="5" fill="#FFB6C1" opacity="0.4" />
            {/* Carrot accessory */}
            <polygon points="78,70 82,85 74,85" fill="#FF8A65" />
            <path d="M 76 70 Q 78 65 80 70" fill="#81C784" />
          </svg>
        </div>
      );

    case 'capybara':
      return (
        <div className={`${animClass} inline-block`} style={{ width: size, height: size }}>
          <svg viewBox="0 0 100 100" width={size} height={size}>
            {/* Ears */}
            <ellipse cx="28" cy="30" rx="7" ry="5" fill="#8D6E63" />
            <ellipse cx="72" cy="30" rx="7" ry="5" fill="#8D6E63" />
            {/* Head */}
            <ellipse cx="50" cy="52" rx="32" ry="28" fill="#A1887F" />
            {/* Face lighter area */}
            <ellipse cx="50" cy="58" rx="20" ry="16" fill="#BCAAA4" />
            {/* Eyes */}
            <circle cx="38" cy="46" r="4" fill="#333" />
            <circle cx="62" cy="46" r="4" fill="#333" />
            <circle cx="39" cy="45" r="1.5" fill="white" />
            <circle cx="63" cy="45" r="1.5" fill="white" />
            {/* Nose */}
            <ellipse cx="50" cy="56" rx="6" ry="4" fill="#5D4037" />
            <circle cx="47" cy="55" r="1.5" fill="#333" />
            <circle cx="53" cy="55" r="1.5" fill="#333" />
            {/* Mouth */}
            {mood === 'happy' || mood === 'excited' ? (
              <path d="M 43 62 Q 50 68 57 62" fill="none" stroke="#5D4037" strokeWidth="1.5" strokeLinecap="round" />
            ) : (
              <path d="M 45 63 Q 50 61 55 63" fill="none" stroke="#5D4037" strokeWidth="1.5" strokeLinecap="round" />
            )}
            {/* Blush */}
            <circle cx="28" cy="55" r="5" fill="#FFB6C1" opacity="0.4" />
            <circle cx="72" cy="55" r="5" fill="#FFB6C1" opacity="0.4" />
            {/* Flower on head */}
            <circle cx="68" cy="28" r="4" fill="#FFD54F" />
            <circle cx="64" cy="25" r="3" fill="#FFF176" />
            <circle cx="72" cy="25" r="3" fill="#FFF176" />
            <circle cx="66" cy="31" r="3" fill="#FFF176" />
            <circle cx="70" cy="31" r="3" fill="#FFF176" />
          </svg>
        </div>
      );

    case 'cat':
      return (
        <div className={`${animClass} inline-block`} style={{ width: size, height: size }}>
          <svg viewBox="0 0 100 100" width={size} height={size}>
            {/* Ears */}
            <polygon points="22,15 32,38 12,35" fill="#78909C" />
            <polygon points="78,15 68,38 88,35" fill="#78909C" />
            <polygon points="24,18 32,35 16,33" fill="#FFB6C1" />
            <polygon points="76,18 68,35 84,33" fill="#FFB6C1" />
            {/* Head */}
            <circle cx="50" cy="52" r="30" fill="#90A4AE" />
            {/* Face white */}
            <ellipse cx="50" cy="58" rx="18" ry="15" fill="#ECEFF1" />
            {/* Eyes */}
            <ellipse cx="38" cy="48" rx="5" ry="5.5" fill="#66BB6A" />
            <ellipse cx="62" cy="48" rx="5" ry="5.5" fill="#66BB6A" />
            <ellipse cx="38" cy="48" rx="2" ry="4.5" fill="#333" />
            <ellipse cx="62" cy="48" rx="2" ry="4.5" fill="#333" />
            <circle cx="39" cy="46" r="1.5" fill="white" />
            <circle cx="63" cy="46" r="1.5" fill="white" />
            {/* Nose */}
            <polygon points="50,56 47,59 53,59" fill="#FFB6C1" />
            {/* Mouth */}
            {mood === 'happy' || mood === 'excited' ? (
              <>
                <path d="M 44 62 Q 47 66 50 62" fill="none" stroke="#333" strokeWidth="1.2" strokeLinecap="round" />
                <path d="M 50 62 Q 53 66 56 62" fill="none" stroke="#333" strokeWidth="1.2" strokeLinecap="round" />
              </>
            ) : (
              <path d="M 46 63 Q 50 61 54 63" fill="none" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
            )}
            {/* Whiskers */}
            <line x1="12" y1="55" x2="32" y2="58" stroke="#B0BEC5" strokeWidth="1" />
            <line x1="12" y1="60" x2="32" y2="61" stroke="#B0BEC5" strokeWidth="1" />
            <line x1="12" y1="65" x2="32" y2="63" stroke="#B0BEC5" strokeWidth="1" />
            <line x1="68" y1="58" x2="88" y2="55" stroke="#B0BEC5" strokeWidth="1" />
            <line x1="68" y1="61" x2="88" y2="60" stroke="#B0BEC5" strokeWidth="1" />
            <line x1="68" y1="63" x2="88" y2="65" stroke="#B0BEC5" strokeWidth="1" />
            {/* Blush */}
            <circle cx="28" cy="58" r="4" fill="#FFB6C1" opacity="0.4" />
            <circle cx="72" cy="58" r="4" fill="#FFB6C1" opacity="0.4" />
          </svg>
        </div>
      );

    default:
      return null;
  }
};

export const MascotMessage: React.FC<{ type: MascotType; message: string }> = ({ type, message }) => {
  const bubbleColors: Record<MascotType, string> = {
    panda: 'bg-white',
    shiba: 'bg-pastel-cream',
    bunny: 'bg-pastel-pink/30',
    capybara: 'bg-pastel-mint/50',
    cat: 'bg-pastel-lavender/30',
  };

  return (
    <div className="flex items-end gap-2">
      <div className={`${bubbleColors[type]} rounded-2xl rounded-bl-sm px-4 py-2 shadow-sm max-w-[200px]`}>
        <p className="text-sm text-cute-brown font-semibold">{message}</p>
      </div>
      <Mascot type={type} size={50} animate />
    </div>
  );
};
