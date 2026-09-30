'use client';

import React from 'react';
import { useFinance } from '@/context/FinanceContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useFinance();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => {
        const icons = {
          success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
          warning: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />,
          error: <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />,
          info: <Info className="w-5 h-5 text-sky-600 shrink-0" />,
        };

        const bgStyles = {
          success: 'bg-white border-emerald-200/80 shadow-emerald-500/10',
          warning: 'bg-white border-amber-200/80 shadow-amber-500/10',
          error: 'bg-white border-rose-200/80 shadow-rose-500/10',
          info: 'bg-white border-sky-200/80 shadow-sky-500/10',
        };

        return (
          <div
            key={toast.id}
            className={cn(
              'pointer-events-auto flex items-center justify-between p-4 rounded-2xl border shadow-lg transition-all duration-200 animate-fade-in backdrop-blur-md',
              bgStyles[toast.type]
            )}
          >
            <div className="flex items-center gap-3 pr-2">
              {icons[toast.type]}
              <span className="text-sm font-medium text-slate-800 leading-snug">
                {toast.message}
              </span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Dismiss toast"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
