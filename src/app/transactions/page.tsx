'use client';

import React, { useState, useMemo } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { AddEditTransactionModal } from '@/components/transactions/AddEditTransactionModal';
import { Transaction, TransactionType, TransactionCategory } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import { CATEGORIES } from '@/lib/constants';
import {
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  Edit2,
  Trash2,
  ArrowDownLeft,
  ArrowUpRight,
  Download,
  AlertCircle,
} from 'lucide-react';

export default function TransactionsPage() {
  const { transactions, addTransaction, updateTransaction, deleteTransaction, summary } =
    useFinance();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | TransactionType>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | TransactionCategory>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'this_month' | 'past_30_days'>('all');
  const [methodFilter, setMethodFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date_desc' | 'date_asc' | 'amount_desc' | 'amount_asc'>(
    'date_desc'
  );

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [deletingTxId, setDeletingTxId] = useState<string | null>(null);

  // Filtered & Sorted Transactions
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((tx) => {
        // Search query
        const matchesSearch =
          tx.merchant.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (tx.notes && tx.notes.toLowerCase().includes(searchQuery.toLowerCase())) ||
          tx.category.toLowerCase().includes(searchQuery.toLowerCase());

        // Type filter
        const matchesType = typeFilter === 'all' || tx.type === typeFilter;

        // Category filter
        const matchesCategory =
          categoryFilter === 'all' || tx.category === categoryFilter;

        // Payment method filter
        const matchesMethod =
          methodFilter === 'all' || tx.paymentMethod === methodFilter;

        // Date filter
        let matchesDate = true;
        if (dateFilter === 'this_month') {
          const currentPrefix = new Date().toISOString().substring(0, 7); // e.g. '2026-09'
          matchesDate = tx.date.startsWith(currentPrefix) || tx.date.startsWith('2026-09');
        } else if (dateFilter === 'past_30_days') {
          const txTime = new Date(tx.date).getTime();
          const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
          matchesDate = txTime >= thirtyDaysAgo;
        }

        return matchesSearch && matchesType && matchesCategory && matchesMethod && matchesDate;
      })
      .sort((a, b) => {
        if (sortBy === 'date_desc') {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        }
        if (sortBy === 'date_asc') {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        }
        if (sortBy === 'amount_desc') {
          return b.amount - a.amount;
        }
        if (sortBy === 'amount_asc') {
          return a.amount - b.amount;
        }
        return 0;
      });
  }, [transactions, searchQuery, typeFilter, categoryFilter, methodFilter, dateFilter, sortBy]);

  const confirmDelete = () => {
    if (deletingTxId) {
      deleteTransaction(deletingTxId);
      setDeletingTxId(null);
    }
  };

  const exportCSV = () => {
    const headers = ['Date', 'Merchant', 'Type', 'Category', 'Amount (INR)', 'Payment Method', 'Notes'];
    const rows = filteredTransactions.map((tx) => [
      tx.date,
      `"${tx.merchant.replace(/"/g, '""')}"`,
      tx.type,
      tx.category,
      tx.amount,
      tx.paymentMethod,
      `"${(tx.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `saveiq_transactions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Transactions
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track and categorize every income stream and expense transaction
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            onClick={exportCSV}
            variant="outline"
            size="md"
            leftIcon={<Download className="w-4 h-4" />}
          >
            Export CSV
          </Button>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            variant="primary"
            size="md"
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add Transaction
          </Button>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card hover className="p-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Total Inflow
            </span>
            <span className="text-xl font-bold text-emerald-700">
              +{formatCurrency(summary.monthlyIncome)}
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
            <ArrowDownLeft className="w-5 h-5" />
          </div>
        </Card>

        <Card hover className="p-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Total Outflow
            </span>
            <span className="text-xl font-bold text-rose-600">
              -{formatCurrency(summary.monthlyExpenses)}
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600">
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </Card>

        <Card hover className="p-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Net Savings Balance
            </span>
            <span className="text-xl font-bold text-slate-900">
              {formatCurrency(summary.monthlySavings)}
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
            <ArrowUpDown className="w-5 h-5" />
          </div>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4 space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search Box */}
          <div className="relative w-full md:flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search merchant, tag, note..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
            />
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="w-full md:w-36 px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="all">All Types</option>
              <option value="income">Income (+)</option>
              <option value="expense">Expense (-)</option>
            </select>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as any)}
              className="w-full md:w-36 px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="all">All Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {/* Date Filter */}
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value as any)}
              className="w-full md:w-36 px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="all">All Dates</option>
              <option value="this_month">This Month</option>
              <option value="past_30_days">Past 30 Days</option>
            </select>

            {/* Payment Method Filter */}
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="w-full md:w-36 px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="all">All Methods</option>
              <option value="UPI">UPI</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Debit Card">Debit Card</option>
              <option value="Net Banking">Net Banking</option>
              <option value="Cash">Cash</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full md:w-36 px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="date_desc">Newest First</option>
              <option value="date_asc">Oldest First</option>
              <option value="amount_desc">Highest Amount</option>
              <option value="amount_asc">Lowest Amount</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Transactions List / Table */}
      <Card className="overflow-hidden p-0">
        {filteredTransactions.length === 0 ? (
          <div className="py-16 text-center">
            <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No transactions found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
              Try adjusting your search filters or record a new transaction to track your spending.
            </p>
            <Button
              onClick={() => {
                setSearchQuery('');
                setTypeFilter('all');
                setCategoryFilter('all');
                setDateFilter('all');
                setMethodFilter('all');
              }}
              variant="outline"
              size="sm"
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50/80 text-[11px] uppercase tracking-wider font-semibold text-slate-500 border-b border-slate-100">
                  <tr>
                    <th className="py-3 px-6">Merchant & Notes</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Method</th>
                    <th className="py-3 px-4 text-right">Amount</th>
                    <th className="py-3 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTransactions.map((tx) => {
                    const isIncome = tx.type === 'income';
                    return (
                      <tr
                        key={tx.id}
                        className="hover:bg-slate-50/60 transition-colors group"
                      >
                        <td className="py-3.5 px-6">
                          <div className="flex items-center gap-3">
                            <div
                              className={`p-2 rounded-xl shrink-0 ${
                                isIncome ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {isIncome ? (
                                <ArrowDownLeft className="w-4 h-4" />
                              ) : (
                                <ArrowUpRight className="w-4 h-4" />
                              )}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900">{tx.merchant}</p>
                              {tx.notes && (
                                <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{tx.notes}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <Badge variant={isIncome ? 'emerald' : 'slate'} size="sm">
                            {tx.category}
                          </Badge>
                        </td>
                        <td className="py-3.5 px-4 text-xs text-slate-600 font-medium">
                          {formatDate(tx.date)}
                        </td>
                        <td className="py-3.5 px-4 text-xs text-slate-500">
                          {tx.paymentMethod}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <span
                            className={`font-bold ${
                              isIncome ? 'text-emerald-700' : 'text-slate-900'
                            }`}
                          >
                            {isIncome ? '+' : '-'}{formatCurrency(tx.amount)}
                          </span>
                        </td>
                        <td className="py-3.5 px-6 text-right">
                          <div className="flex items-center justify-end gap-1.5 opacity-80 group-hover:opacity-100">
                            <button
                              onClick={() => setEditingTransaction(tx)}
                              aria-label="Edit transaction"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeletingTxId(tx.id)}
                              aria-label="Delete transaction"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
            <div className="md:hidden divide-y divide-slate-100">
              {filteredTransactions.map((tx) => {
                const isIncome = tx.type === 'income';
                return (
                  <div key={tx.id} className="p-4 flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div
                        className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                          isIncome ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {isIncome ? (
                          <ArrowDownLeft className="w-4 h-4" />
                        ) : (
                          <ArrowUpRight className="w-4 h-4" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">
                          {tx.merchant}
                        </p>
                        <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-400 mt-1">
                          <span>{formatDate(tx.date)}</span>
                          <span>•</span>
                          <span className="text-slate-600 font-medium">{tx.category}</span>
                          <span>•</span>
                          <span>{tx.paymentMethod}</span>
                        </div>
                        {tx.notes && (
                          <p className="text-xs text-slate-500 mt-1 italic line-clamp-1">{tx.notes}</p>
                        )}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span
                        className={`text-sm font-bold block ${
                          isIncome ? 'text-emerald-700' : 'text-slate-900'
                        }`}
                      >
                        {isIncome ? '+' : '-'}{formatCurrency(tx.amount)}
                      </span>
                      <div className="flex items-center justify-end gap-1 mt-2">
                        <button
                          onClick={() => setEditingTransaction(tx)}
                          className="p-1 rounded text-slate-400 hover:text-slate-700"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingTxId(tx.id)}
                          className="p-1 rounded text-slate-400 hover:text-rose-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </Card>

      {/* Add Transaction Modal */}
      <AddEditTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={addTransaction}
      />

      {/* Edit Transaction Modal */}
      <AddEditTransactionModal
        isOpen={!!editingTransaction}
        onClose={() => setEditingTransaction(null)}
        initialData={editingTransaction}
        onSubmit={(data) => {
          if (editingTransaction) {
            updateTransaction(editingTransaction.id, data);
            setEditingTransaction(null);
          }
        }}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingTxId}
        onClose={() => setDeletingTxId(null)}
        title="Delete Transaction?"
        description="Are you sure you want to permanently delete this transaction? This will update your balances and recalculate savings forecasts."
        maxWidth="sm"
      >
        <div className="flex items-center justify-end gap-2.5 pt-4">
          <Button variant="outline" size="sm" onClick={() => setDeletingTxId(null)}>
            Cancel
          </Button>
          <Button variant="danger" size="sm" onClick={confirmDelete}>
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}
