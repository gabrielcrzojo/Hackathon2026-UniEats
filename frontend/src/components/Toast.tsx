import React from 'react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-[#001e40] text-white shadow-2xl border border-white/10 animate-in fade-in slide-in-from-bottom-5 duration-200">
      <span className="material-symbols-outlined text-[#80fd88] text-xl">check_circle</span>
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
};
