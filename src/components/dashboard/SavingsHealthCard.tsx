'use client';

import React from 'react';
import { useFinance } from '@/context/FinanceContext';
import { Card } from '@/components/ui/Card';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { ShieldCheck, Flame, CheckCircle, Zap } from 'lucide-react';

export const SavingsHealthCard: React.FC = () => {
  const { healthScore } = useFinance();

  const factors = [
    { label: 'Savings Consistency', score: healthScore.consistencyScore, max: 15, pct: Math.round((healthScore.consistencyScore / 15) * 100) },
    { label: 'Spending Discipline', score: healthScore.disciplineScore, max: 20, pct: Math.round((healthScore.disciplineScore / 20) * 100) },
    { label: 'Goal Progress', score: healthScore.goalProgressScore, max: 20, pct: Math.round((healthScore.goalProgressScore / 20) * 100) },
    { label: 'Emergency Fund', score: healthScore.emergencyFundScore, max: 20, pct: Math.round((healthScore.emergencyFundScore / 20) * 100) },
    { label: 'Monthly Savings Rate', score: healthScore.savingsRateScore, max: 25, pct: Math.round((healthScore.savingsRateScore / 25) * 100) },
  ];

  return (
    <Card hover className="p-6 h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              Savings Health Score
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Habit quality & goal execution efficiency
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
            {healthScore.label}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-6 my-4">
          {/* Circular Visualization */}
          <div className="shrink-0">
            <ProgressRing
              value={healthScore.overallScore}
              size={120}
              strokeWidth={9}
              ringColor="#059669"
              trackColor="#f1f5f9"
            >
              <div className="flex flex-col items-center">
                <span className="text-3xl font-extrabold text-slate-900 leading-none">
                  {healthScore.overallScore}
                </span>
                <span className="text-[11px] font-semibold text-slate-400 mt-1 uppercase tracking-wider">
                  / 100
                </span>
              </div>
            </ProgressRing>
          </div>

          {/* Text and Status */}
          <div className="flex-1 text-center sm:text-left">
            <p className="text-sm font-semibold text-slate-800 leading-snug">
              {healthScore.summary}
            </p>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Based on your monthly surplus, adherence to budget categories, and steady milestone velocity.
            </p>
          </div>
        </div>

        {/* 5 Factors Breakdown */}
        <div className="space-y-2 mt-4 pt-4 border-t border-slate-100">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Score Breakdown
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {factors.map((f, i) => (
              <div key={i} className="flex flex-col p-2.5 rounded-xl bg-slate-50/70 border border-slate-100">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-slate-600 font-medium">{f.label}</span>
                  <span className="font-bold text-slate-900">{f.score}/{f.max}</span>
                </div>
                <div className="w-full bg-slate-200/80 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-emerald-600 transition-all duration-700"
                    style={{ width: `${f.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};
