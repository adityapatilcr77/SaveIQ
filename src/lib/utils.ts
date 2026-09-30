import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a number into Indian Rupee style (e.g. ₹1,20,000 or ₹45,000)
 */
export function formatCurrency(
  amount: number,
  currencySymbol: string = '₹',
  includeSymbol: boolean = true
): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return includeSymbol ? `${currencySymbol}0` : '0';
  }

  const rounded = Math.round(amount);
  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(Math.abs(rounded));

  const sign = rounded < 0 ? '-' : '';
  return includeSymbol ? `${sign}${currencySymbol}${formatted}` : `${sign}${formatted}`;
}

export function formatPercentage(value: number, decimals: number = 1): string {
  if (isNaN(value) || value === null || value === undefined) return '0%';
  return `${value.toFixed(decimals).replace(/\.0$/, '')}%`;
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
}

export function formatMonthYear(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('en-IN', {
      month: 'long',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
}

export function getDaysRemaining(targetDateStr: string): number {
  const target = new Date(targetDateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  const diffTime = target.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

export function getMonthsRemaining(targetDateStr: string): number {
  const days = getDaysRemaining(targetDateStr);
  return Math.max(0.5, +(days / 30.4375).toFixed(1));
}

export function generateId(prefix: string = 'id'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
}
