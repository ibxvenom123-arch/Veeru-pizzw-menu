import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toast } = useApp();

  if (!toast) return null;

  const iconMap = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />,
  };

  const borderMap = {
    success: 'border-emerald-200 bg-emerald-50 text-emerald-900',
    error: 'border-rose-200 bg-rose-50 text-rose-900',
    warning: 'border-amber-200 bg-amber-50 text-amber-900',
    info: 'border-blue-200 bg-blue-50 text-blue-900',
  };

  return (
    <div
      id="app-toast"
      className="fixed bottom-6 right-6 z-50 max-w-sm w-full transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 shadow-xl"
    >
      <div
        className={`flex items-start gap-3 p-4 rounded-xl border ${borderMap[toast.type]} shadow-lg backdrop-blur-md`}
      >
        {iconMap[toast.type]}
        <div className="flex-1 text-sm font-medium leading-snug">{toast.message}</div>
      </div>
    </div>
  );
};
