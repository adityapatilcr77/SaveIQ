'use client';

import React from 'react';
import { useFinance } from '@/context/FinanceContext';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';
import { CreditCard, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const BudgetOverviewWidget: React.FC = () => {
  const { budgets, transactions } = useFinance();

  // Calculate spent per category
  const categorySpent: Record<string, number> = {};
  transactions
    .filter((tx) => tx.type === 'expense')
    .forEach((tx) => {
      categorySpent[tx.category] = (categorySpent[tx.category] || 0) + tx.amount;
    });

  const topBudgets = budgets.slice(0, 4);

  return (
    <Card hover className="p-6 h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Budget Overview
              </h3>
              <p className="text-xs text-slate-500">Monthly limits vs actual spending</p>
            </div>
          </div>
          <Link href="/budget">
            <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
              All Budgets
            </Button>
          </Link>
        </div>

        <div className="space-y-4 my-2">
          {topBudgets.map((b) => {
            const spent = categorySpent[b.category] || 0;
            const pct = Math.round((spent / b.monthlyLimit) * 100);
            const isOver = spent > b.monthlyLimit;
            const remaining = b.monthlyLimit - spent;

            return (
              <div
                key={b.id}
                className={`p-3.5 rounded-2xl border transition-all ${
                  isOver
                    ? 'bg-rose-50/50 border-rose-200/70'
                    : 'bg-slate-50/70 border-slate-100'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-slate-900">{b.category}</span>
                    {isOver ? (
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-rose-600 bg-rose-100/70 px-1.5 py-0.2 rounded-md">
                        <AlertTriangle className="w-2.5 h-2.5" /> Over by {formatCurrency(Math.abs(remaining))}
                      </span>
                    ) : (
                      <span className="text-[10px] font-medium text-slate-500">
                        {formatCurrency(remaining)} left
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-slate-900">{formatCurrency(spent)}</span>
                    <span className="text-slate-400"> / {formatCurrency(b.monthlyLimit)}</span>
                  </div>
                </div>

                <ProgressBar
                  value={pct}
                  barClassName={isOver ? 'bg-rose-500' : pct > 80 ? 'bg-amber-500' : 'bg-emerald-600'}
                />

                <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1">
                  <span>{pct}% utilized</span>
                  <span>Limit: {formatCurrency(b.monthlyLimit)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
        <span>Budgets automatically sync with new transactions</span>
        <Link href="/budget" className="font-semibold text-emerald-700 hover:text-emerald-800">
          Manage &rarr;
        </Link>
      </div>
    </Card>
  );
};
