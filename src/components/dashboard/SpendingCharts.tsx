'use client';

import React, { useState, useEffect } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { Card } from '@/components/ui/Card';
import { formatCurrency } from '@/lib/utils';
import { CATEGORY_COLORS } from '@/lib/constants';
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
} from 'recharts';

export const SpendingCharts: React.FC = () => {
  const { transactions, summary } = useFinance();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 1. Monthly Bar Chart Data (Income vs Expense vs Savings)
  const monthlyData = [
    { month: 'Apr', income: 42000, expenses: 31000, savings: 11000 },
    { month: 'May', income: 42000, expenses: 30500, savings: 11500 },
    { month: 'Jun', income: 44000, expenses: 32000, savings: 12000 },
    { month: 'Jul', income: 44000, expenses: 33000, savings: 11000 },
    { month: 'Aug', income: 45000, expenses: 33200, savings: 11800 },
    {
      month: 'Sep (Now)',
      income: summary.monthlyIncome,
      expenses: summary.monthlyExpenses,
      savings: summary.monthlySavings,
    },
  ];

  // 2. Category Donut Data
  const categoryTotals: Record<string, number> = {};
  transactions
    .filter((tx) => tx.type === 'expense')
    .forEach((tx) => {
      categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + tx.amount;
    });

  const categoryData = Object.entries(categoryTotals)
    .filter(([_, val]) => val > 0)
    .map(([name, value]) => ({
      name,
      value,
      color: CATEGORY_COLORS[name as keyof typeof CATEGORY_COLORS] || '#64748b',
    }))
    .sort((a, b) => b.value - a.value);

  // 3. Trends Data (Last 6 Months)
  const trendData = [
    { month: 'Apr', spending: 31000, savings: 11000, savingsRate: 26.2 },
    { month: 'May', spending: 30500, savings: 11500, savingsRate: 27.4 },
    { month: 'Jun', spending: 32000, savings: 12000, savingsRate: 27.3 },
    { month: 'Jul', spending: 33000, savings: 11000, savingsRate: 25.0 },
    { month: 'Aug', spending: 33200, savings: 11800, savingsRate: 26.2 },
    {
      month: 'Sep',
      spending: summary.monthlyExpenses,
      savings: summary.monthlySavings,
      savingsRate: summary.savingsRate,
    },
  ];

  if (!mounted) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[350px]">
        <div className="h-80 bg-slate-100 rounded-2xl animate-pulse" />
        <div className="h-80 bg-slate-100 rounded-2xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income vs Expenses vs Savings Bar Chart */}
        <Card hover className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Income vs Expenses vs Savings
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Monthly cashflow distribution over the last 6 months
              </p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              INR (₹)
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyData}
                margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
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
                <Legend
                  wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                  iconType="circle"
                />
                <Bar dataKey="income" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" name="Expenses" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="savings" name="Savings" fill="#0284c7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Expense Categories Donut Chart */}
        <Card hover className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Expense Categories
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Breakdown of spending this month ({formatCurrency(summary.monthlyExpenses)})
              </p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
              {categoryData.length} Categories
            </span>
          </div>

          <div className="h-72 w-full flex flex-col sm:flex-row items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => [formatCurrency(Number(val)), 'Amount']}
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                    border: '1px solid #e2e8f0',
                    fontSize: '12px',
                  }}
                />
                <Legend
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                  wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                  iconType="circle"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Spending & Savings Trend Line Chart */}
      <Card hover className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              6-Month Spending & Savings Trend
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Historical progression showing consistency and savings acceleration
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-xs font-medium text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
              Monthly Savings
            </span>
            <span className="flex items-center gap-1 text-xs font-medium text-slate-600 ml-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
              Expenses
            </span>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={trendData}
              margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
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
              <Line
                type="monotone"
                dataKey="savings"
                name="Savings"
                stroke="#059669"
                strokeWidth={3}
                dot={{ r: 4, fill: '#059669' }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="spending"
                name="Expenses"
                stroke="#f43f5e"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={{ r: 3, fill: '#f43f5e' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};
