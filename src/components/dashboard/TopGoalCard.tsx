'use client';

import React, { useState } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency, formatMonthYear } from '@/lib/utils';
import { Target, Laptop, Calendar, Sparkles, Plus, ArrowRight, ShieldCheck, Palmtree } from 'lucide-react';
import Link from 'next/link';

interface TopGoalCardProps {
  onQuickDeposit?: (goalId: string) => void;
}

export const TopGoalCard: React.FC<TopGoalCardProps> = ({ onQuickDeposit }) => {
  const { topGoal, topGoalForecast, addMoneyToGoal } = useFinance();
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState('2000');

  if (!topGoal || !topGoalForecast) {
    return (
      <Card hover className="p-6 h-full flex flex-col justify-center items-center text-center">
        <Target className="w-10 h-10 text-slate-300 mb-2" />
        <h4 className="text-base font-semibold text-slate-800">No active goals yet</h4>
        <p className="text-xs text-slate-500 max-w-xs mt-1 mb-4">
          Set up a target goal like a laptop, emergency fund, or vacation to activate AI forecasting.
        </p>
        <Link href="/goals">
          <Button variant="primary" size="sm">Create Goal</Button>
        </Link>
      </Card>
    );
  }

  const handleQuickAdd = () => {
    const val = parseFloat(depositAmount);
    if (!isNaN(val) && val > 0) {
      addMoneyToGoal(topGoal.id, val, 'Quick dashboard boost');
      setIsDepositOpen(false);
    }
  };

  return (
    <Card hover className="p-6 h-full flex flex-col justify-between relative overflow-hidden">
      <div>
        {/* Top Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              Primary Focus Goal
            </span>
          </div>
          <Badge variant="emerald">
            {topGoalForecast.statusText}
          </Badge>
        </div>

        {/* Goal Title & Target */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Laptop className="w-5 h-5 text-emerald-600 shrink-0" />
              {topGoal.name}
            </h3>
            <p className="text-xs text-slate-500 mt-1 line-clamp-1">
              {topGoal.description}
            </p>
          </div>

          <div className="text-right shrink-0">
            <div className="text-xs text-slate-400 font-medium">Target</div>
            <div className="text-lg font-bold text-slate-900">
              {formatCurrency(topGoal.targetAmount)}
            </div>
          </div>
        </div>

        {/* Visual Progress Stats */}
        <div className="mt-5 p-4 rounded-2xl bg-slate-50/80 border border-slate-100">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-slate-600 font-medium">
              Saved <strong className="text-slate-900">{formatCurrency(topGoal.currentAmount)}</strong>
            </span>
            <span className="font-bold text-emerald-700">
              {topGoalForecast.progress}%
            </span>
          </div>

          <ProgressBar
            value={topGoalForecast.progress}
            barClassName="bg-gradient-to-r from-emerald-500 to-teal-500"
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-200/60 text-xs">
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">Target Date</span>
              <span className="font-semibold text-slate-800">
                {formatMonthYear(topGoal.targetDate)}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">Req. Monthly</span>
              <span className="font-semibold text-slate-800">
                {formatCurrency(topGoalForecast.requiredMonthlySaving)}/mo
              </span>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="text-[11px] text-emerald-600 block font-medium">Predicted Completion</span>
              <span className="font-bold text-emerald-800">
                {topGoalForecast.predictedCompletionDate}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Deposit Inline Accordion */}
        {isDepositOpen && (
          <div className="mt-3 p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/70 animate-fade-in flex items-center gap-2">
            <span className="text-xs font-semibold text-emerald-800 shrink-0">Add ₹</span>
            <input
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              className="w-24 px-2 py-1 text-xs font-bold rounded-lg border border-emerald-300 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <Button size="sm" variant="primary" onClick={handleQuickAdd} className="text-xs py-1 h-auto">
              Deposit
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setIsDepositOpen(false)} className="text-xs py-1 h-auto">
              Cancel
            </Button>
          </div>
        )}
      </div>

      {/* CTA Footer */}
      <div className="flex items-center justify-between gap-3 mt-5 pt-4 border-t border-slate-100">
        <button
          onClick={() => setIsDepositOpen(!isDepositOpen)}
          className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1.5 transition-colors"
        >
          <Plus className="w-4 h-4 text-emerald-600" />
          Deposit Funds
        </button>

        <Link href={`/goals/${topGoal.id}`}>
          <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
            View Goal
          </Button>
        </Link>
      </div>
    </Card>
  );
};
