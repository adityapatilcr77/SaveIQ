'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { SavingsGoal, GoalPriority, GoalCategory } from '@/types';

interface AddEditGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<SavingsGoal, 'id' | 'createdAt'>) => void;
  initialData?: SavingsGoal | null;
}

export const AddEditGoalModal: React.FC<AddEditGoalModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('0');
  const [targetDate, setTargetDate] = useState('');
  const [priority, setPriority] = useState<GoalPriority>('high');
  const [category, setCategory] = useState<GoalCategory>('Gadget');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setTargetAmount(initialData.targetAmount.toString());
      setCurrentAmount(initialData.currentAmount.toString());
      setTargetDate(initialData.targetDate);
      setPriority(initialData.priority);
      setCategory(initialData.category);
      setDescription(initialData.description || '');
    } else {
      setName('');
      setTargetAmount('');
      setCurrentAmount('0');
      // Default date: 1 year from now
      const defaultDate = new Date();
      defaultDate.setFullYear(defaultDate.getFullYear() + 1);
      setTargetDate(defaultDate.toISOString().split('T')[0]);
      setPriority('high');
      setCategory('Gadget');
      setDescription('');
    }
    setError('');
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const target = parseFloat(targetAmount);
    const current = parseFloat(currentAmount) || 0;

    if (!name.trim()) {
      setError('Please provide a goal name.');
      return;
    }
    if (isNaN(target) || target <= 0) {
      setError('Target amount must be greater than ₹0.');
      return;
    }
    if (current < 0) {
      setError('Current saved amount cannot be negative.');
      return;
    }
    if (current > target) {
      setError('Initial saved amount cannot exceed target amount.');
      return;
    }
    if (!targetDate) {
      setError('Please specify a target completion deadline.');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    if (targetDate <= today) {
      setError('Target date must be in the future.');
      return;
    }

    onSubmit({
      name: name.trim(),
      targetAmount: Math.round(target),
      currentAmount: Math.round(current),
      targetDate,
      priority,
      category,
      description: description.trim() || `${name} savings milestone target.`,
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Savings Goal' : 'Create New Savings Goal'}
      description="Define a target amount and date. SaveIQ AI will calculate your required monthly savings and predict your finish line."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Goal Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Goal Name *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. MacBook Pro, Emergency Fund, Goa Trip"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError('');
            }}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
          />
        </div>

        {/* Target Amount & Initial Saved */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Target Amount (₹) *
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-slate-400 font-semibold text-sm">₹</span>
              <input
                type="number"
                required
                min="1"
                placeholder="100000"
                value={targetAmount}
                onChange={(e) => {
                  setTargetAmount(e.target.value);
                  setError('');
                }}
                className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Already Saved (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-slate-400 font-semibold text-sm">₹</span>
              <input
                type="number"
                min="0"
                placeholder="0"
                value={currentAmount}
                onChange={(e) => {
                  setCurrentAmount(e.target.value);
                  setError('');
                }}
                className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Category & Priority */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as GoalCategory)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
            >
              <option value="Emergency">Emergency Fund</option>
              <option value="Gadget">Gadgets & Tech</option>
              <option value="Travel">Travel & Vacation</option>
              <option value="Education">Education & Courses</option>
              <option value="Vehicle">Vehicle / Car / Bike</option>
              <option value="Home">Home & Renovation</option>
              <option value="Retirement">Retirement / Long Term</option>
              <option value="Other">Other Milestone</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as GoalPriority)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
            >
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>
        </div>

        {/* Target Date */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Target Date (Deadline) *
          </label>
          <input
            type="date"
            required
            value={targetDate}
            onChange={(e) => {
              setTargetDate(e.target.value);
              setError('');
            }}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Description / Why this goal matters
          </label>
          <textarea
            rows={2}
            placeholder="e.g. Upgrading my primary workstation for development projects."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors resize-none"
          />
        </div>

        {/* Error */}
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200/80 text-xs font-medium text-rose-700">
            {error}
          </div>
        )}

        {/* Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm">
            {initialData ? 'Update Goal' : 'Create Goal'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
