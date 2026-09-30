'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useFinance } from '@/context/FinanceContext';
import { NotificationCenter } from './NotificationCenter';
import {
  Sparkles,
  Plus,
  Menu,
  X,
  PiggyBank,
  Wallet,
  TrendingUp,
  Target,
  Bot,
  Settings as SettingsIcon,
  PieChart,
  Sun,
  Moon,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

interface AppNavbarProps {
  onOpenAddTransaction: () => void;
  onOpenMobileMenu: () => void;
}

export const AppNavbar: React.FC<AppNavbarProps> = ({
  onOpenAddTransaction,
  onOpenMobileMenu,
}) => {
  const pathname = usePathname();
  const { user, summary, toggleTheme } = useFinance();

  const isLanding = pathname === '/';

  if (isLanding) {
    return (
      <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-lg text-slate-900 tracking-tight">SaveIQ</span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/50">
                AI Savings
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <a href="#how-it-works" className="hover:text-emerald-600 transition-colors">How It Works</a>
            <a href="#features" className="hover:text-emerald-600 transition-colors">AI Insights</a>
            <a href="#forecasting" className="hover:text-emerald-600 transition-colors">Goal Forecasting</a>
            <a href="#security" className="hover:text-emerald-600 transition-colors">Security</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                View Demo
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="primary" size="sm">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-30 w-full bg-white/90 backdrop-blur-md border-b border-slate-100/90 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Mobile menu toggle + Logo on mobile */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link href="/dashboard" className="flex items-center gap-2.5 lg:hidden">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-bold text-base text-slate-900 tracking-tight">SaveIQ</span>
          </Link>
        </div>

        {/* Center / Right: Balance pill, Quick Add, Notifications, Profile */}
        <div className="flex items-center gap-3 sm:gap-4 ml-auto">
          {/* Quick Balance indicator */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200/60">
            <span className="text-xs text-slate-500 font-medium">Balance:</span>
            <span className="text-xs font-bold text-emerald-700">
              {formatCurrency(summary.totalBalance)}
            </span>
          </div>

          {/* Quick Add Transaction Button */}
          <Button
            onClick={onOpenAddTransaction}
            variant="primary"
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
          >
            <span className="hidden sm:inline">Add Transaction</span>
            <span className="sm:hidden">Add</span>
          </Button>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle dark/light theme"
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-colors"
            title={user.theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {user.theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>

          {/* Notifications Center */}
          <NotificationCenter />

          {/* User Profile avatar */}
          <Link
            href="/settings"
            className="flex items-center gap-2.5 pl-2 border-l border-slate-100 hover:opacity-80 transition-opacity"
            title="Account Settings"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
              {user.name.split(' ').map((n) => n[0]).join('')}
            </div>
            <div className="hidden xl:block text-left">
              <p className="text-xs font-semibold text-slate-800 leading-none">{user.name}</p>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-none">Fintech Pro</p>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
};
