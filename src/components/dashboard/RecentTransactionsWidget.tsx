'use client';

import React from 'react';
import { useFinance } from '@/context/FinanceContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency, formatDate } from '@/lib/utils';
import { ArrowLeftRight, ArrowDownLeft, ArrowUpRight, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const RecentTransactionsWidget: React.FC = () => {
  const { transactions } = useFinance();
  const recent = transactions.slice(0, 6);

  return (
    <Card hover className="p-6 h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-slate-100 text-slate-700">
              <ArrowLeftRight className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Recent Transactions
              </h3>
              <p className="text-xs text-slate-500">Latest activity across accounts</p>
            </div>
          </div>
          <Link href="/transactions">
            <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
              View All
            </Button>
          </Link>
        </div>

        {recent.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            No transactions found. Add your first transaction above!
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recent.map((tx) => {
              const isIncome = tx.type === 'income';
              return (
                <div
                  key={tx.id}
                  className="py-3 flex items-center justify-between gap-3 group hover:bg-slate-50/50 px-2 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`p-2 rounded-xl shrink-0 ${
                        isIncome ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {isIncome ? (
                        <ArrowDownLeft className="w-4 h-4" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-900 truncate">
                        {tx.merchant}
                      </p>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                        <span>{formatDate(tx.date)}</span>
                        <span>•</span>
                        <span>{tx.category}</span>
                        <span>•</span>
                        <span>{tx.paymentMethod}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span
                      className={`text-xs font-bold tracking-tight ${
                        isIncome ? 'text-emerald-700' : 'text-slate-900'
                      }`}
                    >
                      {isIncome ? '+' : '-'}{formatCurrency(tx.amount)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
        <span>Showing latest {recent.length} transactions</span>
        <Link href="/transactions" className="font-semibold text-emerald-700 hover:text-emerald-800">
          Manage Transactions &rarr;
        </Link>
      </div>
    </Card>
  );
};
