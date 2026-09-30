'use client';

import React from 'react';
import { useFinance } from '@/context/FinanceContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Sparkles, ArrowRight, CheckCircle2, Bot, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const AIInsightCard: React.FC = () => {
  const { insights, updateBudget, showToast } = useFinance();
  const router = useRouter();

  // Find primary insight
  const primaryInsight = insights[0] || {
    id: 'default',
    title: 'AI Savings Optimization',
    description:
      'You are spending 18% more on food delivery than your 3-month average. Reducing this category by ₹1,500/month could help you reach your Laptop goal approximately 3 weeks earlier.',
    type: 'opportunity',
    category: 'Food',
    potentialSavings: 1500,
  };

  const handleApplyRecommendation = () => {
    if (primaryInsight.category === 'Food') {
      updateBudget('Food', 4500); // reduced from 6000 by 1500
      showToast('Recommendation Applied: Food budget updated to ₹4,500/mo. Saved ₹1,500/mo toward your goal!', 'success');
    } else if (primaryInsight.category === 'Shopping') {
      updateBudget('Shopping', 5000);
      showToast('Recommendation Applied: Shopping budget enforced at ₹5,000/mo.', 'success');
    } else if (primaryInsight.actionType === 'review_budget') {
      router.push('/budget');
    } else if (primaryInsight.targetGoalId) {
      router.push(`/goals/${primaryInsight.targetGoalId}`);
    } else {
      showToast('Recommendation applied! Monthly savings allocation updated.', 'success');
    }
  };

  const handleAskAI = () => {
    const q = primaryInsight.category === 'Food'
      ? 'How can I reach my laptop goal faster?'
      : `How can I optimize my ${primaryInsight.category || 'spending'}?`;
    router.push(`/ai-coach?q=${encodeURIComponent(q)}`);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-6 sm:p-7 shadow-xl border border-emerald-500/20">
      {/* Background glow effects */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-2.5">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold tracking-wide border border-emerald-400/30 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
              SaveIQ AI Intelligence
            </span>
            <span className="text-[11px] text-slate-400">
              Generated in real-time
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-tight">
            {primaryInsight.title}
          </h3>

          <p className="text-sm sm:text-base text-slate-300 mt-2 leading-relaxed">
            {primaryInsight.description}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
          <Button
            onClick={handleApplyRecommendation}
            variant="emerald"
            size="md"
            leftIcon={<CheckCircle2 className="w-4 h-4 text-emerald-100" />}
            className="w-full sm:w-auto shadow-lg shadow-emerald-500/20 font-semibold"
          >
            Apply Recommendation
          </Button>

          <Button
            onClick={handleAskAI}
            variant="outline"
            size="md"
            leftIcon={<Bot className="w-4 h-4 text-slate-300" />}
            className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border-white/20 hover:border-white/30 backdrop-blur-sm"
          >
            Ask AI
          </Button>
        </div>
      </div>
    </div>
  );
};
