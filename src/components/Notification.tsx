import React, { useEffect, useState } from 'react';
import { UserProfile } from '../types';
import { Mascot } from './Mascot';

interface NotificationProps {
  profile: UserProfile;
}

export const PaydayNotification: React.FC<NotificationProps> = ({ profile }) => {
  const [showNotification, setShowNotification] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const today = new Date();
    const currentDay = today.getDate();
    
    // Check if today is payday
    if (currentDay === profile.paydayDate) {
      setMessage("It's payday! 🎉 Time to record your salary!");
      setShowNotification(true);
      
      // Auto-dismiss after 5 seconds
      setTimeout(() => setShowNotification(false), 5000);
    }
    
    // Check if budget is getting low (after 25th of month or 80% through)
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const monthProgress = currentDay / daysInMonth;
    if (monthProgress > 0.8 && currentDay !== profile.paydayDate) {
      setMessage("Month ending soon! Check your budget~ 📊");
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 4000);
    }
  }, [profile.paydayDate]);

  if (!showNotification) return null;

  return (
    <div className="fixed top-4 left-4 right-4 z-[60] animate-slide-up">
      <div className="bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3 max-w-sm mx-auto border-2 border-pastel-pink/30">
        <Mascot type={profile.mascot} size={40} animate />
        <div className="flex-1">
          <p className="text-sm font-bold text-cute-brown">{message}</p>
          <p className="text-xs text-cute-brown/50 mt-0.5">Tap to dismiss</p>
        </div>
        <button
          onClick={() => setShowNotification(false)}
          className="text-cute-brown/30 text-lg"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

// Request notification permission
export function requestNotificationPermission() {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }
}

// Send a push notification
export function sendNotification(title: string, body: string) {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, {
      body,
      icon: '/icons/icon-192.svg',
      badge: '/icons/icon-192.svg',
    });
  }
}
