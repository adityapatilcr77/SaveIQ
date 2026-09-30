'use client';

import React, { useState } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Modal } from '@/components/ui/Modal';
import { formatCurrency } from '@/lib/utils';
import { CATEGORIES } from '@/lib/constants';
import { TransactionCategory, Budget } from '@/types';
import {
  CreditCard,
  Edit2,
  AlertTriangle,
  CheckCircle,
  TrendingDown,
  Sparkles,
  Plus,
} from 'lucide-react';

export default function BudgetPage() {
  const { budgets, updateBudget, transactions, summary } = useFinance();
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [newLimit, setNewLimit] = useState('');
  const [isAddBudgetOpen, setIsAddBudgetOpen] = useState(false);
  const [selectedCat, setSelectedCat] = useState<TransactionCategory>('Food');
  const [addLimit, setAddLimit] = useState('');

  // Calculate actual spending per category
  const categorySpent: Record<string, number> = {};
  transactions
    .filter((tx) => tx.type === 'expense')
    .forEach((tx) => {
      categorySpent[tx.category] = (categorySpent[tx.category] || 0) + tx.amount;
    });

  const totalBudgeted = budgets.reduce((acc, b) => acc + b.monthlyLimit, 0);
  const totalActual = summary.monthlyExpenses;

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBudget) return;
    const val = parseFloat(newLimit);
    if (!isNaN(val) && val > 0) {
      updateBudget(editingBudget.category, Math.round(val));
      setEditingBudget(null);
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(addLimit);
    if (!isNaN(val) && val > 0) {
      updateBudget(selectedCat, Math.round(val));
      setIsAddBudgetOpen(false);
      setAddLimit('');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Category Budgets
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Enforce spending discipline by setting monthly guardrails for each category
          </p>
        </div>

        <Button
          onClick={() => setIsAddBudgetOpen(true)}
          variant="primary"
          size="md"
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Set Category Budget
        </Button>
      </div>

      {/* Aggregate KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card hover className="p-4">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Total Monthly Budget
          </span>
          <span className="text-xl font-bold text-slate-900 mt-0.5 block">
            {formatCurrency(totalBudgeted)}
          </span>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Allocated across {budgets.length} categories
          </span>
        </Card>

        <Card hover className="p-4">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Actual Spent
          </span>
          <span className="text-xl font-bold text-slate-900 mt-0.5 block">
            {formatCurrency(totalActual)}
          </span>
          <span className="text-[11px] text-slate-500 mt-1 block">
            {Math.round((totalActual / (totalBudgeted || 1)) * 100)}% of total budget
          </span>
        </Card>

        <Card hover className="p-4">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Net Budget Surplus
          </span>
          <span
            className={`text-xl font-bold mt-0.5 block ${
              totalBudgeted >= totalActual ? 'text-emerald-700' : 'text-rose-600'
            }`}
          >
            {formatCurrency(totalBudgeted - totalActual)}
          </span>
          <span className="text-[11px] text-slate-500 mt-1 block">
            {totalBudgeted >= totalActual ? 'Under overall allocation' : 'Budget exceeded'}
          </span>
        </Card>
      </div>

      {/* Budget Category Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {budgets.map((b) => {
          const spent = categorySpent[b.category] || 0;
          const limit = b.monthlyLimit;
          const remaining = limit - spent;
          const isOver = spent > limit;
          const pct = Math.round((spent / limit) * 100);

          return (
            <Card
              key={b.id}
              hover
              className={`p-5 flex flex-col justify-between border transition-all ${
                isOver ? 'border-rose-200/90 bg-rose-50/20' : 'border-slate-100'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-base">{b.category}</span>
                    {isOver ? (
                      <Badge variant="rose" size="sm">
                        Over Budget
                      </Badge>
                    ) : pct >= 80 ? (
                      <Badge variant="amber" size="sm">
                        Near Limit
                      </Badge>
                    ) : (
                      <Badge variant="emerald" size="sm">
                        On Track
                      </Badge>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      setEditingBudget(b);
                      setNewLimit(b.monthlyLimit.toString());
                    }}
                    aria-label={`Edit ${b.category} budget`}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Numbers */}
                <div className="flex items-baseline justify-between mb-2">
                  <div>
                    <span className="text-xs text-slate-500">Spent: </span>
                    <span className="text-lg font-bold text-slate-900">
                      {formatCurrency(spent)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400">Limit: </span>
                    <span className="text-xs font-semibold text-slate-700">
                      {formatCurrency(limit)}
                    </span>
                  </div>
                </div>

                {/* Progress */}
                <ProgressBar
                  value={pct}
                  barClassName={
                    isOver ? 'bg-rose-500' : pct > 80 ? 'bg-amber-500' : 'bg-emerald-600'
                  }
                />

                {/* Details Footer */}
                <div className="flex items-center justify-between text-xs mt-3 pt-2 border-t border-slate-100">
                  <span className="text-slate-400 font-medium">{pct}% used</span>
                  {isOver ? (
                    <span className="font-bold text-rose-600 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      Over by {formatCurrency(Math.abs(remaining))}
                    </span>
                  ) : (
                    <span className="font-semibold text-emerald-700 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-emerald-600" />
                      {formatCurrency(remaining)} remaining
                    </span>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Edit Budget Modal */}
      <Modal
        isOpen={!!editingBudget}
        onClose={() => setEditingBudget(null)}
        title={`Edit ${editingBudget?.category} Budget`}
        description="Adjust your monthly ceiling. SaveIQ will automatically recalculate discipline scores."
        maxWidth="sm"
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Monthly Limit (₹) *
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-slate-400 font-semibold text-sm">₹</span>
              <input
                type="number"
                required
                min="1"
                value={newLimit}
                onChange={(e) => setNewLimit(e.target.value)}
                className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <Button type="button" variant="outline" size="sm" onClick={() => setEditingBudget(null)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Save Limit
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add / Adjust Budget Modal */}
      <Modal
        isOpen={isAddBudgetOpen}
        onClose={() => setIsAddBudgetOpen(false)}
        title="Set Category Budget Limit"
        description="Choose a category to set or revise its monthly spending limit."
        maxWidth="sm"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Category *
            </label>
            <select
              value={selectedCat}
              onChange={(e) => setSelectedCat(e.target.value as TransactionCategory)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Monthly Limit (₹) *
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-slate-400 font-semibold text-sm">₹</span>
              <input
                type="number"
                required
                min="100"
                placeholder="e.g. 5000"
                value={addLimit}
                onChange={(e) => setAddLimit(e.target.value)}
                className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsAddBudgetOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Save Budget
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
