'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { AppNavbar } from './AppNavbar';
import { AppSidebar } from './AppSidebar';
import { ToastContainer } from '@/components/ui/ToastContainer';
import { AddEditTransactionModal } from '@/components/transactions/AddEditTransactionModal';
import { useFinance } from '@/context/FinanceContext';

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAddTxOpen, setIsAddTxOpen] = useState(false);
  const { addTransaction } = useFinance();

  const isLanding = pathname === '/';

  if (isLanding) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
        <AppNavbar
          onOpenAddTransaction={() => setIsAddTxOpen(true)}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
        />
        <main className="flex-1">{children}</main>
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-900 flex">
      {/* Sidebar for Desktop & Mobile drawer */}
      <AppSidebar
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <AppNavbar
          onOpenAddTransaction={() => setIsAddTxOpen(true)}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-fade-in pb-24 lg:pb-8">
          {children}
        </main>

        {/* Mobile Sticky Bottom Navigation Bar */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-2 py-1.5 flex items-center justify-around shadow-lg">
          <Link
            href="/dashboard"
            className={`flex flex-col items-center py-1 px-2 rounded-xl text-[10px] font-semibold transition-colors ${
              pathname === '/dashboard' ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <span className="text-base mb-0.5">📊</span>
            Dashboard
          </Link>

          <Link
            href="/transactions"
            className={`flex flex-col items-center py-1 px-2 rounded-xl text-[10px] font-semibold transition-colors ${
              pathname.startsWith('/transactions') ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <span className="text-base mb-0.5">💳</span>
            Transactions
          </Link>

          <Link
            href="/goals"
            className={`flex flex-col items-center py-1 px-2 rounded-xl text-[10px] font-semibold transition-colors ${
              pathname.startsWith('/goals') ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <span className="text-base mb-0.5">🎯</span>
            Goals
          </Link>

          <Link
            href="/ai-coach"
            className={`flex flex-col items-center py-1 px-2 rounded-xl text-[10px] font-semibold transition-colors ${
              pathname.startsWith('/ai-coach') ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <span className="text-base mb-0.5">🤖</span>
            AI Coach
          </Link>

          <Link
            href="/budget"
            className={`flex flex-col items-center py-1 px-2 rounded-xl text-[10px] font-semibold transition-colors ${
              pathname.startsWith('/budget') ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <span className="text-base mb-0.5">💰</span>
            Budget
          </Link>
        </nav>

        <ToastContainer />

        {/* Global Add Transaction Modal */}
        <AddEditTransactionModal
          isOpen={isAddTxOpen}
          onClose={() => setIsAddTxOpen(false)}
          onSubmit={addTransaction}
        />
      </div>
    </div>
  );
};
