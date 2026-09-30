'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { SavingsGoal } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { PlusCircle, Sparkles } from 'lucide-react';

interface AddMoneyModalProps {
  goal: SavingsGoal | null;
  isOpen: boolean;
  onClose: () => void;
  onAddMoney: (goalId: string, amount: number, note?: string) => void;
}

export const AddMoneyModal: React.FC<AddMoneyModalProps> = ({
  goal,
  isOpen,
  onClose,
  onAddMoney,
}) => {
  const [amount, setAmount] = useState('5000');
  const [note, setNote] = useState('Monthly savings allocation');
  const [error, setError] = useState('');

  if (!goal) return null;

  const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);

  const presets = [1000, 2000, 5000, 10000];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) {
      setError('Amount must be greater than ₹0.');
      return;
    }

    onAddMoney(goal.id, Math.round(val), note.trim() || undefined);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Add Money to ${goal.name}`}
      description={`Currently saved: ${formatCurrency(goal.currentAmount)} of ${formatCurrency(goal.targetAmount)} (${formatCurrency(remaining)} remaining).`}
      maxWidth="sm"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Presets */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            Quick Select
          </label>
          <div className="grid grid-cols-4 gap-2">
            {presets.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => {
                  setAmount(p.toString());
                  setError('');
                }}
                className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                  amount === p.toString()
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                +₹{p >= 1000 ? `${p / 1000}k` : p}
              </button>
            ))}
          </div>
        </div>

        {/* Amount Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Deposit Amount (₹) *
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-2.5 text-slate-400 font-semibold text-sm">₹</span>
            <input
              type="number"
              required
              min="1"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setError('');
              }}
              className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
            />
          </div>
        </div>

        {/* Note */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Contribution Note
          </label>
          <input
            type="text"
            placeholder="e.g. Salary sweep, bonus deposit..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
          />
        </div>

        {error && (
          <div className="p-2.5 rounded-xl bg-rose-50 text-xs font-medium text-rose-700">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            leftIcon={<Sparkles className="w-4 h-4 text-emerald-200" />}
          >
            Confirm Deposit
          </Button>
        </div>
      </form>
    </Modal>
  );
};
