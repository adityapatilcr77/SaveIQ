'use client';

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import {
  UserProfile,
  Transaction,
  SavingsGoal,
  Budget,
  AIInsight,
  NotificationItem,
  GoalContribution,
  SavingsHealth,
  GoalForecast,
  TransactionCategory,
} from '@/types';
import {
  INITIAL_USER,
  INITIAL_GOALS,
  INITIAL_TRANSACTIONS,
  INITIAL_BUDGETS,
  INITIAL_NOTIFICATIONS,
  INITIAL_CONTRIBUTIONS,
} from '@/lib/constants';
import {
  calculateFinancialSummary,
  calculateGoalForecast,
  calculateSavingsHealth,
  FinancialSummary,
} from '@/lib/calculations';
import { generateAIInsights } from '@/lib/ai-engine';
import { generateId } from '@/lib/utils';
import confetti from 'canvas-confetti';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface FinanceContextType {
  user: UserProfile;
  transactions: Transaction[];
  goals: SavingsGoal[];
  budgets: Budget[];
  notifications: NotificationItem[];
  insights: AIInsight[];
  contributions: GoalContribution[];
  summary: FinancialSummary;
  healthScore: SavingsHealth;
  topGoal: SavingsGoal | null;
  topGoalForecast: GoalForecast | null;
  goalForecasts: Record<string, GoalForecast>;
  unreadNotificationsCount: number;
  isLoaded: boolean;
  toasts: Toast[];

  // Actions
  addTransaction: (data: Omit<Transaction, 'id' | 'createdAt'>) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;

  addGoal: (data: Omit<SavingsGoal, 'id' | 'createdAt'>) => void;
  updateGoal: (id: string, updates: Partial<SavingsGoal>) => void;
  deleteGoal: (id: string) => void;
  addMoneyToGoal: (goalId: string, amount: number, note?: string) => void;

  updateBudget: (category: TransactionCategory, monthlyLimit: number) => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;

  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  dismissNotification: (id: string) => void;

  resetDemoData: () => void;
  exportData: () => void;
  toggleTheme: () => void;
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER: 'saveiq_user_v1',
  TRANSACTIONS: 'saveiq_transactions_v1',
  GOALS: 'saveiq_goals_v1',
  BUDGETS: 'saveiq_budgets_v1',
  NOTIFICATIONS: 'saveiq_notifications_v1',
  CONTRIBUTIONS: 'saveiq_contributions_v1',
};

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [goals, setGoals] = useState<SavingsGoal[]>(INITIAL_GOALS);
  const [budgets, setBudgets] = useState<Budget[]>(INITIAL_BUDGETS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [contributions, setContributions] = useState<GoalContribution[]>(INITIAL_CONTRIBUTIONS);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize from LocalStorage
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem(STORAGE_KEYS.USER);
      const savedTx = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      const savedGoals = localStorage.getItem(STORAGE_KEYS.GOALS);
      const savedBudgets = localStorage.getItem(STORAGE_KEYS.BUDGETS);
      const savedNotifs = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      const savedContrib = localStorage.getItem(STORAGE_KEYS.CONTRIBUTIONS);

      if (savedUser) setUser(JSON.parse(savedUser));
      if (savedTx) setTransactions(JSON.parse(savedTx));
      if (savedGoals) setGoals(JSON.parse(savedGoals));
      if (savedBudgets) setBudgets(JSON.parse(savedBudgets));
      if (savedNotifs) setNotifications(JSON.parse(savedNotifs));
      if (savedContrib) setContributions(JSON.parse(savedContrib));
    } catch (e) {
      console.warn('Error reading from localStorage:', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to LocalStorage on updates
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
      localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
      localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(budgets));
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
      localStorage.setItem(STORAGE_KEYS.CONTRIBUTIONS, JSON.stringify(contributions));
    } catch (e) {
      console.warn('Error writing to localStorage:', e);
    }
  }, [isLoaded, user, transactions, goals, budgets, notifications, contributions]);

  // Apply theme to document
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (user.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [user.theme]);

  const toggleTheme = () => {
    const nextTheme = user.theme === 'dark' ? 'light' : 'dark';
    setUser((prev) => ({ ...prev, theme: nextTheme }));
    showToast(`Switched to ${nextTheme === 'dark' ? 'Dark' : 'Light'} theme`, 'info');
  };

  // Toast manager
  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = generateId('toast');
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Centralized calculations
  const summary = useMemo(() => {
    const s = calculateFinancialSummary(transactions, user.monthlyIncome);
    const totalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0);
    const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);
    return {
      ...s,
      totalSavedInGoals: totalSaved,
      totalGoalTarget: totalTarget,
      overallGoalProgress: totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0,
    };
  }, [transactions, user.monthlyIncome, goals]);

  const healthScore = useMemo(() => {
    return calculateSavingsHealth(summary, goals, budgets, transactions);
  }, [summary, goals, budgets, transactions]);

  const goalForecasts = useMemo(() => {
    const forecasts: Record<string, GoalForecast> = {};
    goals.forEach((g) => {
      forecasts[g.id] = calculateGoalForecast(g, summary.monthlySavings);
    });
    return forecasts;
  }, [goals, summary.monthlySavings]);

  const topGoal = useMemo(() => {
    if (goals.length === 0) return null;
    // Prefer highest priority uncompleted goal or MacBook goal
    const uncompleted = goals.filter((g) => g.currentAmount < g.targetAmount);
    if (uncompleted.length === 0) return goals[0];
    const laptop = uncompleted.find((g) => g.id === 'goal_laptop');
    if (laptop) return laptop;
    return uncompleted.sort((a, b) => {
      const pMap = { high: 3, medium: 2, low: 1 };
      return pMap[b.priority] - pMap[a.priority];
    })[0];
  }, [goals]);

  const topGoalForecast = useMemo(() => {
    if (!topGoal) return null;
    return goalForecasts[topGoal.id] || calculateGoalForecast(topGoal, summary.monthlySavings);
  }, [topGoal, goalForecasts, summary.monthlySavings]);

  const insights = useMemo(() => {
    return generateAIInsights(transactions, goals, budgets, user);
  }, [transactions, goals, budgets, user]);

  const unreadNotificationsCount = useMemo(() => {
    return notifications.filter((n) => !n.isRead).length;
  }, [notifications]);

  // Transaction Actions
  const addTransaction = (data: Omit<Transaction, 'id' | 'createdAt'>) => {
    const newTx: Transaction = {
      ...data,
      id: generateId('tx'),
      createdAt: new Date().toISOString(),
    };
    setTransactions((prev) => [newTx, ...prev]);
    showToast(`Transaction added: ${data.merchant} (₹${data.amount.toLocaleString('en-IN')})`, 'success');

    // Check budget threshold
    if (data.type === 'expense') {
      const targetBudget = budgets.find((b) => b.category === data.category);
      if (targetBudget) {
        const currentCategorySpend = transactions
          .filter((t) => t.type === 'expense' && t.category === data.category)
          .reduce((sum, t) => sum + t.amount, 0) + data.amount;

        if (currentCategorySpend > targetBudget.monthlyLimit) {
          const over = currentCategorySpend - targetBudget.monthlyLimit;
          const notif: NotificationItem = {
            id: generateId('notif'),
            title: `${data.category} Budget Alert`,
            message: `Your ${data.category} expenses reached ₹${currentCategorySpend.toLocaleString('en-IN')}, exceeding your ₹${targetBudget.monthlyLimit.toLocaleString('en-IN')} budget by ₹${over.toLocaleString('en-IN')}.`,
            type: 'warning',
            timestamp: new Date().toISOString(),
            isRead: false,
            link: '/budget',
          };
          setNotifications((prev) => [notif, ...prev]);
        }
      }
    }
  };

  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    setTransactions((prev) =>
      prev.map((tx) => (tx.id === id ? { ...tx, ...updates } : tx))
    );
    showToast('Transaction updated successfully', 'info');
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((tx) => tx.id !== id));
    showToast('Transaction removed', 'info');
  };

  // Goal Actions
  const addGoal = (data: Omit<SavingsGoal, 'id' | 'createdAt'>) => {
    const newGoal: SavingsGoal = {
      ...data,
      id: generateId('goal'),
      createdAt: new Date().toISOString(),
    };
    setGoals((prev) => [...prev, newGoal]);
    showToast(`Goal created: ${data.name}`, 'success');
  };

  const updateGoal = (id: string, updates: Partial<SavingsGoal>) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, ...updates } : g))
    );
    showToast('Goal updated successfully', 'info');
  };

  const deleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
    showToast('Goal deleted', 'info');
  };

  const addMoneyToGoal = (goalId: string, amount: number, note?: string) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id === goalId) {
          const newCurrent = g.currentAmount + amount;
          const reached = newCurrent >= g.targetAmount;
          if (reached) {
            try {
              confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
            } catch {
              // ignore
            }
            const completionNotif: NotificationItem = {
              id: generateId('notif'),
              title: `🎉 Goal Completed: ${g.name}!`,
              message: `Congratulations! You've achieved your savings target of ₹${g.targetAmount.toLocaleString('en-IN')} for ${g.name}.`,
              type: 'success',
              timestamp: new Date().toISOString(),
              isRead: false,
              link: '/goals',
            };
            setNotifications((n) => [completionNotif, ...n]);
          }
          return { ...g, currentAmount: newCurrent };
        }
        return g;
      })
    );

    // Record contribution
    const newContrib: GoalContribution = {
      id: generateId('contrib'),
      goalId,
      amount,
      date: new Date().toISOString().split('T')[0],
      note: note || 'Manual deposit',
    };
    setContributions((prev) => [newContrib, ...prev]);

    showToast(`Added ₹${amount.toLocaleString('en-IN')} to goal!`, 'success');
  };

  // Budget Actions
  const updateBudget = (category: TransactionCategory, monthlyLimit: number) => {
    setBudgets((prev) => {
      const exists = prev.some((b) => b.category === category);
      if (exists) {
        return prev.map((b) => (b.category === category ? { ...b, monthlyLimit } : b));
      }
      return [...prev, { id: generateId('budget'), category, monthlyLimit }];
    });
    showToast(`Updated ${category} budget to ₹${monthlyLimit.toLocaleString('en-IN')}`, 'info');
  };

  // Profile
  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...updates }));
    showToast('Settings saved successfully', 'success');
  };

  // Notifications
  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    showToast('All notifications marked as read', 'info');
  };

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Reset Demo Data
  const resetDemoData = () => {
    setUser(INITIAL_USER);
    setTransactions(INITIAL_TRANSACTIONS);
    setGoals(INITIAL_GOALS);
    setBudgets(INITIAL_BUDGETS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setContributions(INITIAL_CONTRIBUTIONS);
    try {
      localStorage.removeItem(STORAGE_KEYS.USER);
      localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
      localStorage.removeItem(STORAGE_KEYS.GOALS);
      localStorage.removeItem(STORAGE_KEYS.BUDGETS);
      localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
      localStorage.removeItem(STORAGE_KEYS.CONTRIBUTIONS);
    } catch {
      // ignore
    }
    showToast('Demo data reset to default state', 'info');
  };

  // Export Data JSON
  const exportData = () => {
    const data = {
      user,
      transactions,
      goals,
      budgets,
      contributions,
      exportDate: new Date().toISOString(),
      appName: 'SaveIQ',
    };
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `saveiq_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Financial data exported to JSON file', 'success');
  };

  return (
    <FinanceContext.Provider
      value={{
        user,
        transactions,
        goals,
        budgets,
        notifications,
        insights,
        contributions,
        summary,
        healthScore,
        topGoal,
        topGoalForecast,
        goalForecasts,
        unreadNotificationsCount,
        isLoaded,
        toasts,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        addGoal,
        updateGoal,
        deleteGoal,
        addMoneyToGoal,
        updateBudget,
        updateUserProfile,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        dismissNotification,
        resetDemoData,
        exportData,
        toggleTheme,
        showToast,
        removeToast,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
