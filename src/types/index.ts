export type TransactionType = 'income' | 'expense';

export type TransactionCategory =
  | 'Income'
  | 'Food'
  | 'Shopping'
  | 'Transport'
  | 'Bills'
  | 'Entertainment'
  | 'Healthcare'
  | 'Other';

export type PaymentMethod = 'UPI' | 'Credit Card' | 'Debit Card' | 'Net Banking' | 'Cash';

export interface Transaction {
  id: string;
  merchant: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  date: string; // YYYY-MM-DD
  paymentMethod: PaymentMethod;
  notes?: string;
  createdAt: string;
}

export type GoalPriority = 'high' | 'medium' | 'low';
export type GoalCategory =
  | 'Emergency'
  | 'Gadget'
  | 'Travel'
  | 'Education'
  | 'Vehicle'
  | 'Home'
  | 'Retirement'
  | 'Other';

export interface GoalContribution {
  id: string;
  goalId: string;
  amount: number;
  date: string;
  note?: string;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string; // YYYY-MM-DD
  priority: GoalPriority;
  category: GoalCategory;
  description: string;
  icon?: string;
  color?: string;
  createdAt: string;
}

export interface Budget {
  id: string;
  category: TransactionCategory;
  monthlyLimit: number;
}

export type InsightType = 'opportunity' | 'warning' | 'achievement' | 'tip';

export interface AIInsight {
  id: string;
  title: string;
  description: string;
  type: InsightType;
  category?: TransactionCategory;
  potentialSavings?: number;
  actionLabel?: string;
  actionType?: 'reduce_expense' | 'boost_goal' | 'review_budget' | 'view_goal' | 'ask_ai';
  targetGoalId?: string;
  createdAt: string;
  isRead?: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'danger';
  timestamp: string;
  isRead: boolean;
  link?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  currency: string;
  currencySymbol: string;
  monthlyIncome: number;
  defaultSavingsTarget: number; // percentage
  theme: 'light' | 'dark' | 'system';
  notificationsEnabled: boolean;
  budgetAlertsEnabled: boolean;
  goalMilestoneAlertsEnabled: boolean;
  joinedDate: string;
}

export interface SavingsHealth {
  overallScore: number; // 0-100
  consistencyScore: number;
  disciplineScore: number;
  goalProgressScore: number;
  emergencyFundScore: number;
  savingsRateScore: number;
  label: string;
  summary: string;
}

export type GoalStatus = 'on_track' | 'slightly_behind' | 'at_risk' | 'completed';

export interface GoalForecast {
  goalId: string;
  currentAmount: number;
  targetAmount: number;
  remainingAmount: number;
  progress: number; // 0-100
  daysRemaining: number;
  monthsRemaining: number;
  requiredMonthlySaving: number;
  requiredWeeklySaving: number;
  savingsVelocity: number;
  predictedCompletionDate: string;
  status: GoalStatus;
  statusText: string;
  monthsDifference: number; // negative means finishes early, positive means finishes late
}

export interface AICoachMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  dataPoints?: Array<{ label: string; value: string }>;
  suggestedPrompts?: string[];
}
