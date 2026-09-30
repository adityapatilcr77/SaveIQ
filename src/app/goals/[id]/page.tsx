'use client';

import React, { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useFinance } from '@/context/FinanceContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { AddMoneyModal } from '@/components/goals/AddMoneyModal';
import { AddEditGoalModal } from '@/components/goals/AddEditGoalModal';
import { Modal } from '@/components/ui/Modal';
import { formatCurrency, formatMonthYear, formatDate } from '@/lib/utils';
import { simulateGoalScenario } from '@/lib/calculations';
import Link from 'next/link';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  Legend,
} from 'recharts';
import {
  ArrowLeft,
  Calendar,
  Sparkles,
  TrendingUp,
  Clock,
  Zap,
  CheckCircle,
  PlusCircle,
  Edit2,
  Trash2,
  History,
  ShieldCheck,
  Laptop,
  Palmtree,
  GraduationCap,
  Car,
  Home,
  CheckCircle2,
} from 'lucide-react';

export default function GoalDetailPage() {
  const params = useParams();
  const router = useRouter();
  const goalId = params.id as string;

  const {
    goals,
    goalForecasts,
    contributions,
    addMoneyToGoal,
    updateGoal,
    deleteGoal,
  } = useFinance();

  const [extraAmount, setExtraAmount] = useState<number>(2000);
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const goal = goals.find((g) => g.id === goalId);
  const forecast = goal ? goalForecasts[goal.id] : null;

  if (!goal || !forecast) {
    return (
      <div className="py-20 text-center max-w-md mx-auto">
        <h2 className="text-xl font-bold text-slate-900">Goal Not Found</h2>
        <p className="text-xs text-slate-500 mt-2 mb-6">
          The requested savings goal does not exist or has been removed.
        </p>
        <Link href="/goals">
          <Button variant="primary" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to Savings Goals
          </Button>
        </Link>
      </div>
    );
  }

  const goalContributions = contributions.filter((c) => c.goalId === goal.id);
  const simulation = simulateGoalScenario(goal, extraAmount, forecast.savingsVelocity);

  const trajectoryData = useMemo(() => {
    const data = [];
    const baselineV = Math.max(forecast.savingsVelocity, 500);
    const acceleratedV = Math.max(simulation.newVelocity, baselineV);
    const target = goal.targetAmount;
    const current = goal.currentAmount;

    // Number of months to project
    const maxMonths = Math.min(
      24,
      Math.max(
        6,
        Math.ceil((target - current) / Math.max(baselineV, 100)) + 2
      )
    );

    const today = new Date();

    for (let m = 0; m <= maxMonths; m++) {
      const date = new Date(today.getFullYear(), today.getMonth() + m, 1);
      const label = date.toLocaleString('default', { month: 'short', year: '2-digit' });

      const baselineVal = Math.min(target, Math.round(current + baselineV * m));
      const acceleratedVal = Math.min(target, Math.round(current + acceleratedV * m));

      data.push({
        month: label,
        Baseline: baselineVal,
        Accelerated: acceleratedVal,
      });

      if (baselineVal >= target && acceleratedVal >= target && m >= 4) {
        break;
      }
    }
    return data;
  }, [goal.currentAmount, goal.targetAmount, forecast.savingsVelocity, simulation.newVelocity]);

  const scenarioPresets = [
    { label: 'Save ₹2,000 extra/mo', amount: 2000, desc: 'Trim dining & takeout' },
    { label: 'Reduce Shopping by ₹1,500/mo', amount: 1500, desc: 'Pause impulse purchases' },
    { label: 'Increase savings by 10% (+₹1,350)', amount: 1350, desc: 'Automated bank sweep' },
    { label: 'Aggressive Allocation (+₹4,000/mo)', amount: 4000, desc: 'Freelance or side income' },
  ];

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
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

  const isCompleted = goal.currentAmount >= goal.targetAmount;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          href="/goals"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Savings Goals
        </Link>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => setIsEditOpen(true)}
            variant="outline"
            size="sm"
            leftIcon={<Edit2 className="w-3.5 h-3.5" />}
          >
            Edit Goal
          </Button>

          <Button
            onClick={() => setIsDeleteOpen(true)}
            variant="outline"
            size="sm"
            leftIcon={<Trash2 className="w-3.5 h-3.5 text-rose-500" />}
            className="hover:border-rose-300 hover:text-rose-600"
          >
            Delete
          </Button>

          <Button
            onClick={() => setIsDepositOpen(true)}
            variant="primary"
            size="sm"
            leftIcon={<PlusCircle className="w-4 h-4" />}
          >
            Deposit Funds
          </Button>
        </div>
      </div>

      {/* Hero Banner Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-xl bg-white/10 backdrop-blur-sm">
                {getCategoryIcon(goal.category)}
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-400/30">
                {goal.priority.toUpperCase()} PRIORITY • {goal.category}
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/10 text-white">
                {forecast.statusText}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {goal.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">
              {goal.description}
            </p>
          </div>

          <div className="text-left md:text-right shrink-0">
            <span className="text-xs text-slate-400 font-medium block">Current Balance</span>
            <div className="text-3xl font-extrabold text-white mt-0.5">
              {formatCurrency(goal.currentAmount)}
              <span className="text-sm font-normal text-slate-400 ml-1">
                / {formatCurrency(goal.targetAmount)}
              </span>
            </div>
            <span className="text-xs text-emerald-300 font-medium mt-1 inline-flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              Target: {formatMonthYear(goal.targetDate)} ({forecast.daysRemaining} days remaining)
            </span>
          </div>
        </div>

        {/* Progress bar in hero */}
        <div className="mt-6 pt-6 border-t border-slate-700/80">
          <div className="flex justify-between items-center text-xs text-slate-300 mb-2 font-medium">
            <span>{forecast.progress}% Completed</span>
            <span>{formatCurrency(forecast.remainingAmount)} Remaining</span>
          </div>
          <ProgressBar
            value={forecast.progress}
            barClassName="bg-gradient-to-r from-emerald-400 to-teal-400 h-3"
          />
        </div>
      </div>

      {/* 4 Forecasting KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card hover className="p-4">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Required Monthly
          </span>
          <span className="text-xl font-bold text-slate-900 mt-1 block">
            {formatCurrency(forecast.requiredMonthlySaving)}/mo
          </span>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Over {forecast.monthsRemaining} months remaining
          </span>
        </Card>

        <Card hover className="p-4">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Required Weekly
          </span>
          <span className="text-xl font-bold text-slate-900 mt-1 block">
            {formatCurrency(forecast.requiredWeeklySaving)}/wk
          </span>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Target weekly savings allocation
          </span>
        </Card>

        <Card hover className="p-4">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Savings Velocity
          </span>
          <span className="text-xl font-bold text-emerald-700 mt-1 block">
            {formatCurrency(forecast.savingsVelocity)}/mo
          </span>
          <span className="text-[11px] text-emerald-600 mt-1 block font-medium">
            Active goal monthly pace
          </span>
        </Card>

        <Card hover className="p-4">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Predicted Finish Line
          </span>
          <span className="text-xl font-bold text-slate-900 mt-1 block truncate">
            {forecast.predictedCompletionDate}
          </span>
          <span
            className={`text-[11px] font-semibold mt-1 block ${
              forecast.monthsDifference <= 0 ? 'text-emerald-700' : 'text-amber-600'
            }`}
          >
            {forecast.monthsDifference <= 0
              ? 'On or ahead of schedule'
              : `${forecast.monthsDifference} mo after target`}
          </span>
        </Card>
      </div>

      {/* Interactive Scenario Simulator */}
      <Card className="p-6 sm:p-7 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-600">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                What happens if... Goal Acceleration Simulator
              </h3>
              <p className="text-xs text-slate-500">
                Simulate spending adjustments to see your completion date move forward
              </p>
            </div>
          </div>
          <Badge variant="emerald">Live Mathematical Model</Badge>
        </div>

        {/* Preset Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {scenarioPresets.map((sc, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setExtraAmount(sc.amount)}
              className={`p-3.5 rounded-2xl text-left border transition-all ${
                extraAmount === sc.amount
                  ? 'border-emerald-600 bg-emerald-50/80 shadow-xs ring-1 ring-emerald-500'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                <span>{sc.label}</span>
                {extraAmount === sc.amount && <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">{sc.desc}</p>
            </button>
          ))}
        </div>

        {/* Interactive Slider */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700">
              Custom Monthly Acceleration:
            </span>
            <span className="text-base font-bold text-emerald-700">
              +{formatCurrency(extraAmount)}/month
            </span>
          </div>

          <input
            type="range"
            min="0"
            max="12000"
            step="500"
            value={extraAmount}
            onChange={(e) => setExtraAmount(parseInt(e.target.value, 10))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
          />

          <div className="flex justify-between text-[10px] text-slate-400">
            <span>+₹0</span>
            <span>+₹6,000/mo</span>
            <span>+₹12,000/mo</span>
          </div>

          {/* Outcome highlight */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-2">
            <div>
              <span className="text-xs font-semibold text-slate-500 block">
                Estimated Accelerated Completion:
              </span>
              <div className="text-xl font-extrabold text-slate-900 mt-0.5 flex items-center gap-2">
                <span className="text-emerald-700">{simulation.newCompletionDate}</span>
                <span className="text-xs text-slate-400 font-normal line-through">
                  ({forecast.predictedCompletionDate})
                </span>
              </div>
            </div>

            <div className="px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-center shrink-0">
              <span className="text-sm font-extrabold text-emerald-800 block">
                {simulation.monthsSaved > 0
                  ? `${simulation.monthsSaved} Months Faster`
                  : 'Current Pace'}
              </span>
              <span className="text-[11px] text-emerald-600 font-medium">
                (~{simulation.weeksSaved} weeks earlier)
              </span>
            </div>
          </div>

          {/* Interactive Trajectory Projection Chart */}
          <div className="pt-4 border-t border-slate-200/80">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-3">
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Trajectory Projection Curve
                </h4>
                <p className="text-[11px] text-slate-500">
                  Visualizing month-by-month capital accumulation toward {formatCurrency(goal.targetAmount)}
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60 self-start sm:self-auto">
                Target: {formatCurrency(goal.targetAmount)}
              </span>
            </div>

            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trajectoryData} margin={{ top: 12, right: 12, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    formatter={(val: any) => [formatCurrency(Number(val) || 0), '']}
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '12px',
                      color: '#f8fafc',
                      border: 'none',
                      fontSize: '12px',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    }}
                  />
                  <Legend
                    verticalAlign="top"
                    align="right"
                    wrapperStyle={{ paddingBottom: '8px', fontSize: '11px', fontWeight: 600 }}
                  />
                  <ReferenceLine
                    y={goal.targetAmount}
                    stroke="#059669"
                    strokeDasharray="4 4"
                    strokeWidth={1.5}
                    label={{
                      value: 'Target',
                      fill: '#059669',
                      fontSize: 10,
                      position: 'insideTopRight',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Baseline"
                    name="Current Pace"
                    stroke="#94a3b8"
                    strokeWidth={2}
                    dot={false}
                    strokeDasharray="3 3"
                  />
                  <Line
                    type="monotone"
                    dataKey="Accelerated"
                    name={`Accelerated (+₹${extraAmount.toLocaleString('en-IN')}/mo)`}
                    stroke="#059669"
                    strokeWidth={3}
                    dot={{ r: 3, fill: '#059669' }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </Card>

      {/* Contribution History Log */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-slate-700" />
            <h3 className="text-base font-bold text-slate-900">
              Contribution History & Deposits
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            {goalContributions.length} entries
          </span>
        </div>

        {goalContributions.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            No individual contribution records logged yet for this goal.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {goalContributions.map((c) => (
              <div key={c.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-slate-800 text-sm block">
                    {c.note || 'Deposit'}
                  </span>
                  <span className="text-slate-400 text-xs mt-0.5 block">{formatDate(c.date)}</span>
                </div>
                <span className="text-sm font-bold text-emerald-700">
                  +{formatCurrency(c.amount)}
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Deposit Modal */}
      <AddMoneyModal
        goal={goal}
        isOpen={isDepositOpen}
        onClose={() => setIsDepositOpen(false)}
        onAddMoney={addMoneyToGoal}
      />

      {/* Edit Modal */}
      <AddEditGoalModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        initialData={goal}
        onSubmit={(data) => {
          updateGoal(goal.id, data);
          setIsEditOpen(false);
        }}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Delete Savings Goal?"
        description="Are you sure you want to permanently delete this goal? All forecasting calculations will be discontinued."
        maxWidth="sm"
      >
        <div className="flex items-center justify-end gap-2.5 pt-4">
          <Button variant="outline" size="sm" onClick={() => setIsDeleteOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              deleteGoal(goal.id);
              setIsDeleteOpen(false);
              router.push('/goals');
            }}
          >
            Yes, Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}
