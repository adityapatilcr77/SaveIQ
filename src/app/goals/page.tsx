'use client';

import React, { useState } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Modal } from '@/components/ui/Modal';
import { AddEditGoalModal } from '@/components/goals/AddEditGoalModal';
import { AddMoneyModal } from '@/components/goals/AddMoneyModal';
import { GoalDetailModal } from '@/components/goals/GoalDetailModal';
import { SavingsGoal, GoalPriority } from '@/types';
import { formatCurrency, formatMonthYear } from '@/lib/utils';
import {
  Target,
  Plus,
  Calendar,
  Sparkles,
  Edit2,
  Trash2,
  PlusCircle,
  ArrowRight,
  ShieldCheck,
  Laptop,
  Palmtree,
  GraduationCap,
  Car,
  Home,
  Clock,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';

export default function GoalsPage() {
  const {
    goals,
    goalForecasts,
    addGoal,
    updateGoal,
    deleteGoal,
    addMoneyToGoal,
    summary,
  } = useFinance();

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<SavingsGoal | null>(null);
  const [depositingGoal, setDepositingGoal] = useState<SavingsGoal | null>(null);
  const [detailGoal, setDetailGoal] = useState<SavingsGoal | null>(null);
  const [deletingGoalId, setDeletingGoalId] = useState<string | null>(null);

  // Filter state
  const [filterPriority, setFilterPriority] = useState<'all' | GoalPriority>('all');

  const filteredGoals = goals.filter((g) => {
    if (filterPriority === 'all') return true;
    return g.priority === filterPriority;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Emergency':
        return <ShieldCheck className="w-5 h-5 text-sky-600" />;
      case 'Travel':
        return <Palmtree className="w-5 h-5 text-amber-600" />;
      case 'Education':
        return <GraduationCap className="w-5 h-5 text-purple-600" />;
      case 'Vehicle':
        return <Car className="w-5 h-5 text-indigo-600" />;
      case 'Home':
        return <Home className="w-5 h-5 text-teal-600" />;
      default:
        return <Laptop className="w-5 h-5 text-emerald-600" />;
    }
  };

  const confirmDelete = () => {
    if (deletingGoalId) {
      deleteGoal(deletingGoalId);
      setDeletingGoalId(null);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Savings Goals
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Turn your financial dreams into milestone-driven actionable targets
          </p>
        </div>

        <Button
          onClick={() => setIsCreateOpen(true)}
          variant="primary"
          size="md"
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Create Goal
        </Button>
      </div>

      {/* Aggregate KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card hover className="p-4">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Total Target
          </span>
          <span className="text-xl font-bold text-slate-900 mt-0.5 block">
            {formatCurrency(summary.totalGoalTarget)}
          </span>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Across {goals.length} active goals
          </span>
        </Card>

        <Card hover className="p-4">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Total Accumulated
          </span>
          <span className="text-xl font-bold text-emerald-700 mt-0.5 block">
            {formatCurrency(summary.totalSavedInGoals)}
          </span>
          <span className="text-[11px] text-emerald-600 mt-1 block font-medium">
            {summary.overallGoalProgress}% achieved
          </span>
        </Card>

        <Card hover className="p-4">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Remaining Target
          </span>
          <span className="text-xl font-bold text-slate-800 mt-0.5 block">
            {formatCurrency(Math.max(0, summary.totalGoalTarget - summary.totalSavedInGoals))}
          </span>
          <span className="text-[11px] text-slate-500 mt-1 block">To be saved</span>
        </Card>

        <Card hover className="p-4">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Monthly Savings Capacity
          </span>
          <span className="text-xl font-bold text-teal-700 mt-0.5 block">
            {formatCurrency(summary.monthlySavings)}/mo
          </span>
          <span className="text-[11px] text-teal-600 mt-1 block font-medium">
            {summary.savingsRate}% of income
          </span>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {(['all', 'high', 'medium', 'low'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setFilterPriority(p)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filterPriority === p
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {p === 'all' ? 'All Goals' : `${p.toUpperCase()} Priority`}
            </button>
          ))}
        </div>
      </div>

      {/* Goals Grid */}
      {filteredGoals.length === 0 ? (
        <Card className="py-16 text-center">
          <Target className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800">No savings goals yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-5">
            Create your first milestone such as an Emergency Fund, New Laptop, or Vacation to get AI-powered forecasting.
          </p>
          <Button
            onClick={() => setIsCreateOpen(true)}
            variant="primary"
            size="md"
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Create your first goal
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredGoals.map((g) => {
            const forecast = goalForecasts[g.id];
            const isCompleted = g.currentAmount >= g.targetAmount;

            const priorityBadgeVariant =
              g.priority === 'high' ? 'rose' : g.priority === 'medium' ? 'amber' : 'slate';

            return (
              <Card
                key={g.id}
                hover
                className="p-6 flex flex-col justify-between relative overflow-hidden group"
              >
                <div>
                  {/* Card Top: Category Icon + Title + Priority & Actions */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 shrink-0">
                        {getCategoryIcon(g.category)}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 tracking-tight group-hover:text-emerald-700 transition-colors">
                          {g.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-slate-400 font-medium">
                            {g.category}
                          </span>
                          <span className="text-slate-300">•</span>
                          <Badge variant={priorityBadgeVariant as any} size="sm">
                            {g.priority} priority
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setEditingGoal(g)}
                        aria-label="Edit goal"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeletingGoalId(g.id)}
                        aria-label="Delete goal"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-500 mt-3 line-clamp-2">
                    {g.description}
                  </p>

                  {/* Amounts & Progress */}
                  <div className="mt-4 p-4 rounded-2xl bg-slate-50/80 border border-slate-100">
                    <div className="flex justify-between items-baseline mb-2">
                      <div>
                        <span className="text-xs text-slate-500">Saved: </span>
                        <span className="text-base font-bold text-slate-900">
                          {formatCurrency(g.currentAmount)}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-slate-400">Target: </span>
                        <span className="text-xs font-semibold text-slate-700">
                          {formatCurrency(g.targetAmount)}
                        </span>
                      </div>
                    </div>

                    <ProgressBar
                      value={forecast?.progress || 0}
                      barClassName={
                        isCompleted
                          ? 'bg-emerald-600'
                          : forecast?.status === 'at_risk'
                          ? 'bg-amber-500'
                          : 'bg-emerald-600'
                      }
                    />

                    <div className="flex justify-between items-center text-xs text-slate-500 mt-2 font-medium">
                      <span>{forecast?.progress || 0}% completed</span>
                      <span>
                        {formatCurrency(Math.max(0, g.targetAmount - g.currentAmount))} remaining
                      </span>
                    </div>
                  </div>

                  {/* Forecast Strip */}
                  <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-100 text-xs">
                    <div>
                      <span className="text-[11px] text-slate-400 block">Deadline</span>
                      <span className="font-semibold text-slate-800">
                        {formatMonthYear(g.targetDate)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 block">Req. Monthly</span>
                      <span className="font-semibold text-slate-800">
                        {formatCurrency(forecast?.requiredMonthlySaving || 0)}/mo
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] text-emerald-600 block font-medium">
                        AI Forecast
                      </span>
                      <span className="font-bold text-emerald-800 truncate block">
                        {forecast?.predictedCompletionDate}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center justify-between gap-2.5 mt-5 pt-4 border-t border-slate-100">
                  <Button
                    onClick={() => setDepositingGoal(g)}
                    variant="outline"
                    size="sm"
                    leftIcon={<PlusCircle className="w-4 h-4 text-emerald-600" />}
                  >
                    Add Money
                  </Button>

                  <Button
                    onClick={() => setDetailGoal(g)}
                    variant="primary"
                    size="sm"
                    rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                  >
                    Forecast & Scenarios
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create Modal */}
      <AddEditGoalModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={addGoal}
      />

      {/* Edit Modal */}
      <AddEditGoalModal
        isOpen={!!editingGoal}
        onClose={() => setEditingGoal(null)}
        initialData={editingGoal}
        onSubmit={(data) => {
          if (editingGoal) {
            updateGoal(editingGoal.id, data);
            setEditingGoal(null);
          }
        }}
      />

      {/* Add Money Modal */}
      <AddMoneyModal
        goal={depositingGoal}
        isOpen={!!depositingGoal}
        onClose={() => setDepositingGoal(null)}
        onAddMoney={addMoneyToGoal}
      />

      {/* Goal Detail & Scenario Simulator Modal */}
      <GoalDetailModal
        goal={detailGoal}
        forecast={detailGoal ? goalForecasts[detailGoal.id] : null}
        isOpen={!!detailGoal}
        onClose={() => setDetailGoal(null)}
        onOpenDeposit={() => {
          if (detailGoal) {
            setDepositingGoal(detailGoal);
          }
        }}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingGoalId}
        onClose={() => setDeletingGoalId(null)}
        title="Delete Goal?"
        description="Are you sure you want to delete this savings goal? This will stop AI forecasting for this milestone."
        maxWidth="sm"
      >
        <div className="flex items-center justify-end gap-2.5 pt-4">
          <Button variant="outline" size="sm" onClick={() => setDeletingGoalId(null)}>
            Cancel
          </Button>
          <Button variant="danger" size="sm" onClick={confirmDelete}>
            Delete Goal
          </Button>
        </div>
      </Modal>
    </div>
  );
}
