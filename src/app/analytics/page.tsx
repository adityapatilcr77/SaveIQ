'use client';

import React, { useState, useEffect } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { formatCurrency, formatPercentage } from '@/lib/utils';
import { CATEGORIES, CATEGORY_COLORS } from '@/lib/constants';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
  AreaChart,
  Area,
} from 'recharts';
import {
  PieChart as PieIcon,
  TrendingUp,
  ShieldCheck,
  Percent,
  ArrowDownLeft,
  ArrowUpRight,
  Flame,
  CheckCircle,
} from 'lucide-react';

export default function AnalyticsPage() {
  const { summary, healthScore, transactions, goals } = useFinance();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Compute category totals
  const categoryTotals: Record<string, number> = {};
  transactions
    .filter((tx) => tx.type === 'expense')
    .forEach((tx) => {
      categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + tx.amount;
    });

  const totalExpense = summary.monthlyExpenses || 1;

  const categoryData = CATEGORIES.map((cat) => {
    const val = categoryTotals[cat] || 0;
    const pct = Math.round((val / totalExpense) * 100);
    return {
      name: cat,
      value: val,
      percentage: pct,
      color: CATEGORY_COLORS[cat] || '#64748b',
    };
  }).sort((a, b) => b.value - a.value);

  // 6 Month Data
  const monthlyData = [
    { month: 'Apr', income: 42000, expenses: 31000, savings: 11000, rate: 26.2 },
    { month: 'May', income: 42000, expenses: 30500, savings: 11500, rate: 27.4 },
    { month: 'Jun', income: 44000, expenses: 32000, savings: 12000, rate: 27.3 },
    { month: 'Jul', income: 44000, expenses: 33000, savings: 11000, rate: 25.0 },
    { month: 'Aug', income: 45000, expenses: 33200, savings: 11800, rate: 26.2 },
    {
      month: 'Sep',
      income: summary.monthlyIncome,
      expenses: summary.monthlyExpenses,
      savings: summary.monthlySavings,
      rate: summary.savingsRate,
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Financial Analytics
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Deep-dive into income streams, expense patterns, and long-term savings velocity
        </p>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card hover className="p-4">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Average Savings Rate
          </span>
          <span className="text-2xl font-bold text-slate-900 mt-0.5 block">
            {summary.savingsRate}%
          </span>
          <span className="text-[11px] text-emerald-600 mt-1 block font-medium">
            +4% vs 3-month trailing avg
          </span>
        </Card>

        <Card hover className="p-4">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Discretionary Ratio
          </span>
          <span className="text-2xl font-bold text-amber-600 mt-0.5 block">
            {Math.round(((categoryTotals['Food'] + categoryTotals['Shopping'] + (categoryTotals['Entertainment'] || 0)) / totalExpense) * 100)}%
          </span>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Food, shopping & leisure
          </span>
        </Card>

        <Card hover className="p-4">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Fixed Essentials Ratio
          </span>
          <span className="text-2xl font-bold text-slate-900 mt-0.5 block">
            {Math.round(((categoryTotals['Bills'] + categoryTotals['Healthcare'] + (categoryTotals['Transport'] || 0)) / totalExpense) * 100)}%
          </span>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Rent, utilities & commute
          </span>
        </Card>

        <Card hover className="p-4">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Health Index
          </span>
          <span className="text-2xl font-bold text-emerald-700 mt-0.5 block">
            {healthScore.overallScore} / 100
          </span>
          <span className="text-[11px] text-emerald-600 mt-1 block font-medium">
            {healthScore.label} financial grade
          </span>
        </Card>
      </div>

      {/* Main Charts */}
      {mounted && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Income vs Expenses Stacked Area Chart */}
          <Card hover className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                  Income & Net Savings Area
                </h3>
                <p className="text-xs text-slate-500">6-Month historical cash retention</p>
              </div>
              <Badge variant="emerald">Cashflow</Badge>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={monthlyData}
                  margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0284c7" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#0284c7" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    tickLine={false}
                    axisLine={{ stroke: '#e2e8f0' }}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    tickLine={false}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tickFormatter={(val) => `₹${val / 1000}k`}
                  />
                  <Tooltip
                    formatter={(val: any) => [formatCurrency(Number(val)), '']}
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                      border: '1px solid #e2e8f0',
                      fontSize: '12px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="income"
                    name="Income"
                    stroke="#10b981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorIncome)"
                  />
                  <Area
                    type="monotone"
                    dataKey="savings"
                    name="Net Savings"
                    stroke="#0284c7"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorSavings)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Monthly Savings Rate Trend Line Chart */}
          <Card hover className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                  Monthly Savings Rate (%)
                </h3>
                <p className="text-xs text-slate-500">Benchmark target vs actual execution</p>
              </div>
              <Badge variant="indigo">Target 30%</Badge>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={monthlyData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    tickLine={false}
                    axisLine={{ stroke: '#e2e8f0' }}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    tickLine={false}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tickFormatter={(val) => `${val}%`}
                    domain={[15, 35]}
                  />
                  <Tooltip
                    formatter={(val: any) => [`${val}%`, 'Savings Rate']}
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                      border: '1px solid #e2e8f0',
                      fontSize: '12px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="rate"
                    name="Savings Rate"
                    stroke="#6366f1"
                    strokeWidth={3}
                    dot={{ r: 5, fill: '#6366f1' }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      )}

      {/* Category In-depth Breakdown Table & Cards */}
      <Card className="p-6">
        <h3 className="text-base font-bold text-slate-900 tracking-tight mb-1">
          Category-by-Category Expense Audit
        </h3>
        <p className="text-xs text-slate-500 mb-6">
          Detailed proportional distribution of outflow for the current billing cycle
        </p>

        <div className="space-y-4">
          {categoryData.map((cat) => (
            <div key={cat.name} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="font-bold text-slate-900">{cat.name}</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-slate-900">{formatCurrency(cat.value)}</span>
                  <span className="text-slate-400 ml-1.5">({cat.percentage}%)</span>
                </div>
              </div>
              <ProgressBar
                value={cat.percentage}
                color={cat.color}
                barClassName="h-2 rounded-full"
              />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
