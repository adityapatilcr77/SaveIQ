'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { SavingsGoal, GoalForecast } from '@/types';
import { useFinance } from '@/context/FinanceContext';
import { formatCurrency, formatMonthYear, formatDate } from '@/lib/utils';
import { simulateGoalScenario } from '@/lib/calculations';
import {
  Calendar,
  Sparkles,
  TrendingUp,
  Clock,
  Zap,
  Sliders,
  CheckCircle,
  PlusCircle,
  Laptop,
  ShieldCheck,
  Palmtree,
  GraduationCap,
  History,
} from 'lucide-react';

interface GoalDetailModalProps {
  goal: SavingsGoal | null;
  forecast: GoalForecast | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenDeposit: () => void;
}

export const GoalDetailModal: React.FC<GoalDetailModalProps> = ({
  goal,
  forecast,
  isOpen,
  onClose,
  onOpenDeposit,
}) => {
  const { contributions } = useFinance();
  const [extraAmount, setExtraAmount] = useState<number>(2000);

  if (!goal || !forecast) return null;

  // Filter contributions for this goal
  const goalContributions = contributions.filter((c) => c.goalId === goal.id);

  // Run simulation
  const simulation = simulateGoalScenario(goal, extraAmount, forecast.savingsVelocity);

  const scenarioPresets = [
    { label: 'Save ₹2,000 extra/mo', amount: 2000, desc: 'Trim discretionary dining' },
    { label: 'Reduce Shopping by ₹1,500/mo', amount: 1500, desc: 'Pause impulse orders' },
    { label: 'Increase savings by 10% (+₹1,350)', amount: 1350, desc: 'Automatic bank sweep' },
    { label: 'Aggressive Push (+₹4,000/mo)', amount: 4000, desc: 'Freelance or side income' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={goal.name}
      description={goal.description}
      maxWidth="xl"
    >
      <div className="space-y-6">
        {/* Core KPI Banner */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-400/30">
                  {goal.priority.toUpperCase()} PRIORITY • {goal.category}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/10 text-white">
                  {forecast.statusText}
                </span>
              </div>
              <div className="text-3xl font-extrabold tracking-tight mt-1">
                {formatCurrency(goal.currentAmount)}{' '}
                <span className="text-sm font-normal text-slate-400">
                  of {formatCurrency(goal.targetAmount)}
                </span>
              </div>
            </div>

            <div className="text-left sm:text-right shrink-0">
              <span className="text-xs text-slate-400 block font-medium">Target Deadline</span>
              <span className="text-base font-bold text-white flex items-center gap-1.5 sm:justify-end mt-0.5">
                <Calendar className="w-4 h-4 text-emerald-400" />
                {formatMonthYear(goal.targetDate)}
              </span>
              <span className="text-[11px] text-emerald-300 block mt-0.5">
                {forecast.daysRemaining} days remaining
              </span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-700/80">
            <div className="flex justify-between items-center text-xs text-slate-300 mb-1.5 font-medium">
              <span>Progress: {forecast.progress}%</span>
              <span>Remaining: {formatCurrency(forecast.remainingAmount)}</span>
            </div>
            <ProgressBar
              value={forecast.progress}
              barClassName="bg-gradient-to-r from-emerald-400 to-teal-400"
            />
          </div>
        </div>

        {/* Detailed Forecasting Stats (4 cards) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Req. Monthly
            </span>
            <span className="text-base font-bold text-slate-900 block">
              {formatCurrency(forecast.requiredMonthlySaving)}
            </span>
            <span className="text-[10px] text-slate-500">to meet deadline</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Req. Weekly
            </span>
            <span className="text-base font-bold text-slate-900 block">
              {formatCurrency(forecast.requiredWeeklySaving)}
            </span>
            <span className="text-[10px] text-slate-500">weekly contribution</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Current Velocity
            </span>
            <span className="text-base font-bold text-emerald-700 block">
              {formatCurrency(forecast.savingsVelocity)}/mo
            </span>
            <span className="text-[10px] text-slate-500">allocated monthly</span>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-100">
            <span className="text-[10px] uppercase font-bold text-emerald-800 block mb-1">
              Projected Finish
            </span>
            <span className="text-base font-bold text-emerald-800 block truncate">
              {forecast.predictedCompletionDate}
            </span>
            <span className="text-[10px] text-emerald-700 font-medium">
              {forecast.monthsDifference <= 0 ? 'Ahead of schedule!' : `${forecast.monthsDifference} mo behind`}
            </span>
          </div>
        </div>

        {/* Interactive "What happens if..." Simulator */}
        <div className="p-5 rounded-2xl bg-slate-50/90 border border-slate-200/80 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-600 text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  What happens if... Scenario Simulator
                </h4>
                <p className="text-xs text-slate-500">
                  Simulate adjustments to see your estimated finish line update in real-time
                </p>
              </div>
            </div>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              Interactive
            </span>
          </div>

          {/* Quick Preset Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {scenarioPresets.map((sc, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setExtraAmount(sc.amount)}
                className={`p-2.5 rounded-xl text-left border transition-all ${
                  extraAmount === sc.amount
                    ? 'border-emerald-600 bg-emerald-50/80 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <span>{sc.label}</span>
                  {extraAmount === sc.amount && <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">{sc.desc}</div>
              </button>
            ))}
          </div>

          {/* Custom Slider */}
          <div className="pt-2">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-slate-700">
                Custom Extra Monthly Savings:
              </span>
              <span className="text-sm font-bold text-emerald-700">
                +{formatCurrency(extraAmount)}/month
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="10000"
              step="500"
              value={extraAmount}
              onChange={(e) => setExtraAmount(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>+₹0</span>
              <span>+₹5,000</span>
              <span>+₹10,000</span>
            </div>
          </div>

          {/* Simulator Impact Card */}
          <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold text-slate-600">
                Estimated Impact on Completion Date:
              </span>
              <div className="text-lg font-bold text-slate-900 mt-0.5 flex items-center gap-2">
                <span className="text-emerald-700">{simulation.newCompletionDate}</span>
                <span className="text-xs text-slate-400 line-through">
                  ({forecast.predictedCompletionDate})
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200/60 text-center">
                <span className="text-xs font-extrabold text-emerald-800">
                  {simulation.monthsSaved > 0 ? `${simulation.monthsSaved} mo earlier` : 'Same timeline'}
                </span>
                <span className="block text-[10px] text-emerald-600 font-medium">
                  (~{simulation.weeksSaved} weeks saved)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Contribution History Log */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <History className="w-3.5 h-3.5" />
              Contribution History
            </h4>
            <span className="text-xs text-slate-500 font-medium">
              {goalContributions.length} records
            </span>
          </div>

          {goalContributions.length === 0 ? (
            <div className="p-4 rounded-xl bg-slate-50 text-center text-xs text-slate-400">
              No individual contribution records logged yet. Use deposit to add one!
            </div>
          ) : (
            <div className="space-y-2 max-h-36 overflow-y-auto">
              {goalContributions.map((c) => (
                <div
                  key={c.id}
                  className="p-2.5 rounded-xl bg-slate-50 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-semibold text-slate-800">{c.note || 'Contribution'}</span>
                    <span className="text-slate-400 block text-[10px]">{formatDate(c.date)}</span>
                  </div>
                  <span className="font-bold text-emerald-700">+{formatCurrency(c.amount)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              onClose();
              onOpenDeposit();
            }}
            leftIcon={<PlusCircle className="w-4 h-4" />}
          >
            Deposit Funds to Goal
          </Button>
        </div>
      </div>
    </Modal>
  );
};
