'use client';

import React from 'react';
import { useFinance } from '@/context/FinanceContext';
import { FinancialSummaryCards } from '@/components/dashboard/FinancialSummaryCards';
import { SavingsHealthCard } from '@/components/dashboard/SavingsHealthCard';
import { TopGoalCard } from '@/components/dashboard/TopGoalCard';
import { AIInsightCard } from '@/components/dashboard/AIInsightCard';
import { SpendingCharts } from '@/components/dashboard/SpendingCharts';
import { BudgetOverviewWidget } from '@/components/dashboard/BudgetOverviewWidget';
import { RecentTransactionsWidget } from '@/components/dashboard/RecentTransactionsWidget';
import { UpcomingMilestonesWidget } from '@/components/dashboard/UpcomingMilestonesWidget';
import { Button } from '@/components/ui/Button';
import { Sparkles, ArrowRight, Zap, Target, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, insights, resetDemoData } = useFinance();

  const currentDateStr = new Intl.DateTimeFormat('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  return (
    <div className="space-y-8 pb-12">
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Financial Overview
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Sync
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Hello, {user.name} • {currentDateStr}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href="/ai-coach">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Sparkles className="w-4 h-4 text-emerald-600" />}
            >
              Ask AI Coach
            </Button>
          </Link>
          <Link href="/goals">
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Target className="w-4 h-4" />}
            >
              Manage Goals
            </Button>
          </Link>
        </div>
      </div>

      {/* 1. Financial Summary Cards (5 cards) */}
      <section aria-label="Financial Summary">
        <FinancialSummaryCards />
      </section>

      {/* 2. Top Savings Goal & Savings Health Score */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch" aria-label="Goals and Health">
        <div className="lg:col-span-7">
          <TopGoalCard />
        </div>
        <div className="lg:col-span-5">
          <SavingsHealthCard />
        </div>
      </section>

      {/* 3. Highlighted AI Insight Card */}
      <section aria-label="AI Insights">
        <AIInsightCard />
      </section>

      {/* 4. Spending & Savings Charts */}
      <section aria-label="Spending Analytics">
        <SpendingCharts />
      </section>

      {/* 5. Budget, Milestones & Recent Activity */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" aria-label="Widgets">
        <BudgetOverviewWidget />
        <UpcomingMilestonesWidget />
        <div className="md:col-span-2 lg:col-span-1">
          <RecentTransactionsWidget />
        </div>
      </section>

      {/* 6. AI Recommendations List */}
      <section className="p-6 rounded-3xl bg-white border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)]" aria-label="AI Recommendations">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Prioritized AI Recommendations
              </h3>
              <p className="text-xs text-slate-500">
                Actionable interventions to accelerate goal milestones
              </p>
            </div>
          </div>
          <Link href="/ai-coach">
            <span className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 cursor-pointer">
              Explore in AI Coach &rarr;
            </span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {insights.map((rec) => (
            <div
              key={rec.id}
              className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100 flex flex-col justify-between hover:bg-slate-100/70 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    {rec.type}
                  </span>
                  {rec.potentialSavings && (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/50">
                      Save ₹{rec.potentialSavings.toLocaleString('en-IN')}/mo
                    </span>
                  )}
                </div>
                <h4 className="text-sm font-bold text-slate-900 mb-1.5">{rec.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{rec.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                <Link
                  href={rec.targetGoalId ? `/goals` : `/ai-coach`}
                  className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                >
                  {rec.actionLabel || 'Learn More'} <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
