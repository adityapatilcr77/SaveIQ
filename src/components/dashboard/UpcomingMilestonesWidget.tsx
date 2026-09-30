'use client';

import React from 'react';
import { useFinance } from '@/context/FinanceContext';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency, formatMonthYear } from '@/lib/utils';
import { Flag, Calendar, ArrowRight, ShieldCheck, Laptop, Palmtree, GraduationCap } from 'lucide-react';
import Link from 'next/link';

export const UpcomingMilestonesWidget: React.FC = () => {
  const { goals, goalForecasts } = useFinance();

  const getIcon = (category: string) => {
    switch (category) {
      case 'Emergency':
        return <ShieldCheck className="w-4 h-4 text-sky-600" />;
      case 'Travel':
        return <Palmtree className="w-4 h-4 text-amber-600" />;
      case 'Education':
        return <GraduationCap className="w-4 h-4 text-purple-600" />;
      default:
        return <Laptop className="w-4 h-4 text-emerald-600" />;
    }
  };

  return (
    <Card hover className="p-6 h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Flag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Goal Milestones
              </h3>
              <p className="text-xs text-slate-500">Upcoming target deadlines & status</p>
            </div>
          </div>
          <Link href="/goals">
            <span className="text-xs text-slate-500 hover:text-emerald-700 font-semibold cursor-pointer">
              All Goals ({goals.length})
            </span>
          </Link>
        </div>

        <div className="space-y-3 my-2">
          {goals.map((g) => {
            const forecast = goalForecasts[g.id];
            const isCompleted = g.currentAmount >= g.targetAmount;

            return (
              <Link
                key={g.id}
                href={`/goals/${g.id}`}
                className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100 flex items-center justify-between gap-3 hover:bg-emerald-50/60 hover:border-emerald-200/60 transition-all cursor-pointer block"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 rounded-xl bg-white shadow-xs shrink-0">
                    {getIcon(g.category)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-900 truncate">
                      {g.name}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatMonthYear(g.targetDate)}
                      </span>
                      <span>•</span>
                      <span>{forecast ? `${forecast.daysRemaining} days left` : ''}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs font-bold text-slate-900">
                    {formatCurrency(g.currentAmount)}
                  </div>
                  <Badge
                    variant={isCompleted ? 'emerald' : forecast?.status === 'at_risk' ? 'rose' : 'emerald'}
                    size="sm"
                    className="mt-0.5"
                  >
                    {isCompleted ? '100% Done' : `${forecast?.progress || 0}%`}
                  </Badge>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
        <span>AI dynamically predicts completion timelines</span>
        <Link href="/goals" className="font-semibold text-emerald-700 hover:text-emerald-800">
          View Forecasts &rarr;
        </Link>
      </div>
    </Card>
  );
};
