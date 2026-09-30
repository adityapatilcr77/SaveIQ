'use client';

import React, { useState } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import {
  User,
  Shield,
  Bell,
  Coins,
  Download,
  RotateCcw,
  Sparkles,
  Lock,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function SettingsPage() {
  const {
    user,
    updateUserProfile,
    resetDemoData,
    exportData,
    transactions,
    goals,
  } = useFinance();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [monthlyIncome, setMonthlyIncome] = useState(user.monthlyIncome.toString());
  const [defaultSavingsTarget, setDefaultSavingsTarget] = useState(
    user.defaultSavingsTarget.toString()
  );
  const [currency, setCurrency] = useState(user.currency);
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    user.notificationsEnabled
  );
  const [budgetAlertsEnabled, setBudgetAlertsEnabled] = useState(
    user.budgetAlertsEnabled
  );
  const [goalMilestoneAlertsEnabled, setGoalMilestoneAlertsEnabled] = useState(
    user.goalMilestoneAlertsEnabled
  );

  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const incomeNum = parseFloat(monthlyIncome);
    const targetNum = parseFloat(defaultSavingsTarget);

    updateUserProfile({
      name: name.trim(),
      email: email.trim(),
      monthlyIncome: !isNaN(incomeNum) && incomeNum > 0 ? Math.round(incomeNum) : user.monthlyIncome,
      defaultSavingsTarget: !isNaN(targetNum) ? targetNum : user.defaultSavingsTarget,
      currency,
      notificationsEnabled,
      budgetAlertsEnabled,
      goalMilestoneAlertsEnabled,
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Settings & Preferences
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Manage your profile, benchmark savings ratios, privacy, and local demo data
        </p>
      </div>

      {/* Profile & Financial Baselines */}
      <form onSubmit={handleSaveProfile}>
        <Card className="p-6 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-600">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Personal Profile & Baselines
              </h2>
              <p className="text-xs text-slate-500">
                These numbers drive your AI insights and savings velocity
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Monthly Net Income (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-slate-400 font-semibold text-sm">₹</span>
                <input
                  type="number"
                  min="1000"
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(e.target.value)}
                  className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Target Savings Rate (%)
              </label>
              <input
                type="number"
                min="5"
                max="90"
                value={defaultSavingsTarget}
                onChange={(e) => setDefaultSavingsTarget(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                <option value="INR">INR (₹) - Indian Rupee (Default)</option>
                <option value="USD">USD ($) - US Dollar</option>
                <option value="EUR">EUR (€) - Euro</option>
                <option value="GBP">GBP (£) - British Pound</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" variant="primary" size="sm">
              Save Preferences
            </Button>
          </div>
        </Card>
      </form>

      {/* Notifications Preferences */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
          <div className="p-2.5 rounded-2xl bg-sky-50 text-sky-600">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Notification Preferences
            </h2>
            <p className="text-xs text-slate-500">
              Control when SaveIQ alerts you about budgets and goal milestones
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50/80 border border-slate-100 cursor-pointer">
            <div>
              <span className="text-xs font-semibold text-slate-800 block">
                Category Budget Threshold Alerts
              </span>
              <span className="text-[11px] text-slate-500">
                Notify immediately when any category spend reaches 100% of its limit
              </span>
            </div>
            <input
              type="checkbox"
              checked={budgetAlertsEnabled}
              onChange={(e) => {
                setBudgetAlertsEnabled(e.target.checked);
                updateUserProfile({ budgetAlertsEnabled: e.target.checked });
              }}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50/80 border border-slate-100 cursor-pointer">
            <div>
              <span className="text-xs font-semibold text-slate-800 block">
                Goal Milestone & Delay Warnings
              </span>
              <span className="text-[11px] text-slate-500">
                Alert when a goal hits 50%, 75%, 100% or is projected to miss its target date
              </span>
            </div>
            <input
              type="checkbox"
              checked={goalMilestoneAlertsEnabled}
              onChange={(e) => {
                setGoalMilestoneAlertsEnabled(e.target.checked);
                updateUserProfile({ goalMilestoneAlertsEnabled: e.target.checked });
              }}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
            />
          </label>
        </div>
      </Card>

      {/* Privacy & Security Section */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
          <div className="p-2.5 rounded-2xl bg-teal-50 text-teal-600">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Security & Privacy Policy
            </h2>
            <p className="text-xs text-slate-500">
              Transparent, privacy-first data handling
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 space-y-2 leading-relaxed">
          <p className="font-semibold text-slate-900 flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-emerald-600" />
            Your financial data is stored locally in this demo application.
          </p>
          <p>
            SaveIQ runs locally in your browser session using persistent HTML5 LocalStorage. No real bank credentials, account numbers, or government IDs are requested or stored.
          </p>
          <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/80 text-amber-900 text-[11px] font-medium mt-2">
            <strong>Disclaimer:</strong> SaveIQ is an educational/demo financial planning tool. AI-generated insights are estimates and should not be considered professional financial advice.
          </div>
        </div>
      </Card>

      {/* Data Management Section */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
          <div className="p-2.5 rounded-2xl bg-purple-50 text-purple-600">
            <RotateCcw className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Data Management & Backup
            </h2>
            <p className="text-xs text-slate-500">
              Export your records or restore the original demo dataset
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
          <div className="text-xs text-slate-500">
            Currently tracking {transactions.length} transactions and {goals.length} active goals.
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              onClick={exportData}
              variant="outline"
              size="sm"
              leftIcon={<Download className="w-4 h-4" />}
            >
              Export JSON Backup
            </Button>

            <Button
              onClick={() => setIsResetConfirmOpen(true)}
              variant="danger"
              size="sm"
              leftIcon={<RotateCcw className="w-4 h-4" />}
            >
              Reset Demo Data
            </Button>
          </div>
        </div>
      </Card>

      {/* Reset Confirmation Modal */}
      <Modal
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        title="Reset Demo Data?"
        description="This will restore all default transactions (Salary, Swiggy, Amazon, Uber), goals (MacBook, Emergency Fund, Goa Trip), and default budgets. Any custom data added in this browser session will be reset."
        maxWidth="sm"
      >
        <div className="flex items-center justify-end gap-2.5 pt-4">
          <Button variant="outline" size="sm" onClick={() => setIsResetConfirmOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              resetDemoData();
              setIsResetConfirmOpen(false);
            }}
          >
            Yes, Reset All
          </Button>
        </div>
      </Modal>
    </div>
  );
}
