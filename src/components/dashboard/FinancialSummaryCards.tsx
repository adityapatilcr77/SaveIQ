'use client';

import React from 'react';
import { useFinance } from '@/context/FinanceContext';
import { Card } from '@/components/ui/Card';
import { formatCurrency, formatPercentage } from '@/lib/utils';
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  PiggyBank,
  Percent,
  TrendingUp,
} from 'lucide-react';

export const FinancialSummaryCards: React.FC = () => {
  const { summary } = useFinance();

  const cards = [
    {
      title: 'Total Balance',
      value: formatCurrency(summary.totalBalance),
      subtext: 'Available liquid capital',
      icon: Wallet,
      color: 'text-slate-700 bg-slate-100',
      badge: '+₹13.5k this mo',
      badgeColor: 'text-emerald-700 bg-emerald-50',
    },
    {
      title: 'Monthly Income',
      value: formatCurrency(summary.monthlyIncome),
      subtext: 'Regular payroll & credits',
      icon: ArrowDownLeft,
      color: 'text-emerald-600 bg-emerald-50',
      badge: 'Fixed Salary',
      badgeColor: 'text-emerald-700 bg-emerald-50',
    },
    {
      title: 'Monthly Expenses',
      value: formatCurrency(summary.monthlyExpenses),
      subtext: 'Across 7 active categories',
      icon: ArrowUpRight,
      color: 'text-rose-600 bg-rose-50',
      badge: `${Math.round((summary.monthlyExpenses / (summary.monthlyIncome || 1)) * 100)}% of income`,
      badgeColor: 'text-amber-700 bg-amber-50',
    },
    {
      title: 'Monthly Savings',
      value: formatCurrency(summary.monthlySavings),
      subtext: 'Net cash surplus',
      icon: PiggyBank,
      color: 'text-teal-600 bg-teal-50',
      badge: 'Healthy Buffer',
      badgeColor: 'text-teal-700 bg-teal-50',
    },
    {
      title: 'Savings Rate',
      value: formatPercentage(summary.savingsRate),
      subtext: 'Target benchmark: 30%',
      icon: Percent,
      color: 'text-indigo-600 bg-indigo-50',
      badge: summary.savingsRate >= 30 ? 'Exceeding Target' : 'Progressing',
      badgeColor: 'text-indigo-700 bg-indigo-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <Card
            key={i}
            hover
            className="p-5 flex flex-col justify-between border-slate-100/90 relative overflow-hidden"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {c.title}
                </span>
                <div className={`p-2 rounded-xl ${c.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-900 tracking-tight">
                {c.value}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-normal truncate max-w-[120px]">{c.subtext}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${c.badgeColor}`}>
                {c.badge}
              </span>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
