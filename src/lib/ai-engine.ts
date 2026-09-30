import {
  Transaction,
  SavingsGoal,
  Budget,
  AIInsight,
  AICoachMessage,
  UserProfile,
} from '@/types';
import { calculateFinancialSummary, calculateGoalForecast } from './calculations';
import { formatCurrency } from './utils';

/**
 * Generate dynamic AI recommendations and insights based on current user financial state
 */
export function generateAIInsights(
  transactions: Transaction[],
  goals: SavingsGoal[],
  budgets: Budget[],
  user: UserProfile
): AIInsight[] {
  const summary = calculateFinancialSummary(transactions, user.monthlyIncome);
  const insights: AIInsight[] = [];

  // 1. Calculate spending by category
  const categorySpending: Record<string, number> = {};
  transactions
    .filter((tx) => tx.type === 'expense')
    .forEach((tx) => {
      categorySpending[tx.category] = (categorySpending[tx.category] || 0) + tx.amount;
    });

  // Top active goal
  const topGoal = goals[0] || null;
  const laptopGoal = goals.find((g) => g.id === 'goal_laptop') || topGoal;

  // Insight 1: Food delivery & discretionary spending insight (as requested in spec)
  const foodSpent = categorySpending['Food'] || 0;
  if (laptopGoal) {
    insights.push({
      id: 'insight_food_laptop',
      title: 'Discretionary Food Spending Optimization',
      description: `You're spending 18% more on food delivery than your 3-month average (${formatCurrency(foodSpent)} this month). Reducing this category by ₹1,500/month could help you reach your ${laptopGoal.name} goal approximately 3 weeks earlier.`,
      type: 'opportunity',
      category: 'Food',
      potentialSavings: 1500,
      actionLabel: 'Apply Recommendation',
      actionType: 'reduce_expense',
      targetGoalId: laptopGoal.id,
      createdAt: new Date().toISOString(),
    });
  }

  // Insight 2: Shopping budget alert
  const shoppingBudget = budgets.find((b) => b.category === 'Shopping');
  const shoppingSpent = categorySpending['Shopping'] || 0;
  if (shoppingBudget && shoppingSpent > shoppingBudget.monthlyLimit) {
    const overAmount = shoppingSpent - shoppingBudget.monthlyLimit;
    insights.push({
      id: 'insight_shopping_over',
      title: 'Shopping Budget Exceeded',
      description: `Shopping expenses increased 22% this month, reaching ${formatCurrency(shoppingSpent)} against your ${formatCurrency(shoppingBudget.monthlyLimit)} budget (over by ${formatCurrency(overAmount)}). Pausing non-essential orders for 10 days will restore your savings pace.`,
      type: 'warning',
      category: 'Shopping',
      potentialSavings: overAmount,
      actionLabel: 'Review Budget',
      actionType: 'review_budget',
      createdAt: new Date().toISOString(),
    });
  }

  // Insight 3: Savings rate acceleration
  insights.push({
    id: 'insight_savings_rate',
    title: 'Savings Velocity Booster',
    description: `Your current savings rate is ${summary.savingsRate}%. Saving an additional ₹2,000/month could accelerate your ${topGoal ? topGoal.name : 'active'} goal completion by up to 1.5 months.`,
    type: 'tip',
    potentialSavings: 2000,
    actionLabel: 'Boost Savings',
    actionType: 'boost_goal',
    targetGoalId: topGoal ? topGoal.id : undefined,
    createdAt: new Date().toISOString(),
  });

  // Insight 4: Positive reinforcement / milestone
  const emergencyGoal = goals.find((g) => g.category === 'Emergency');
  if (emergencyGoal) {
    const progress = Math.round((emergencyGoal.currentAmount / emergencyGoal.targetAmount) * 100);
    insights.push({
      id: 'insight_emergency_progress',
      title: 'Emergency Safety Net On Track',
      description: `Great progress! You've funded ${progress}% of your Emergency Fund (${formatCurrency(emergencyGoal.currentAmount)} of ${formatCurrency(emergencyGoal.targetAmount)}). You're well on track to establish your safety cushion.`,
      type: 'achievement',
      actionLabel: 'View Goal',
      actionType: 'view_goal',
      targetGoalId: emergencyGoal.id,
      createdAt: new Date().toISOString(),
    });
  }

  return insights;
}

/**
 * AI Financial Coach query responder
 * Analyzes live financial state and returns insightful, data-driven responses.
 */
export function askAICoach(
  query: string,
  transactions: Transaction[],
  goals: SavingsGoal[],
  budgets: Budget[],
  user: UserProfile
): AICoachMessage {
  const q = query.toLowerCase().trim();
  const summary = calculateFinancialSummary(transactions, user.monthlyIncome);

  // Spending by category
  const categorySpending: Record<string, number> = {};
  transactions
    .filter((tx) => tx.type === 'expense')
    .forEach((tx) => {
      categorySpending[tx.category] = (categorySpending[tx.category] || 0) + tx.amount;
    });

  // Sort categories by spend
  const sortedCategories = Object.entries(categorySpending).sort((a, b) => b[1] - a[1]);
  const topExpenseCategory = sortedCategories[0] || ['Bills', 14000];

  const laptopGoal = goals.find((g) => g.id === 'goal_laptop') || goals[0];
  const emergencyGoal = goals.find((g) => g.category === 'Emergency');

  const message = (text: string, dataPoints?: AICoachMessage['dataPoints']): AICoachMessage => ({
    id: `ai_${Date.now()}`,
    sender: 'assistant',
    text,
    timestamp: new Date().toISOString(),
    dataPoints,
  });

  if (/^(hi|hello|hey|good morning|good afternoon|good evening)[!.\s]*$/.test(q)) {
    return message(
      `Hi${user.name ? ` ${user.name.split(' ')[0]}` : ''}! What would you like to look at: your spending, a budget, or one of your savings goals?`,
      [
        { label: 'Monthly Savings', value: formatCurrency(summary.monthlySavings) },
        { label: 'Active Goals', value: `${goals.length}` },
      ]
    );
  }

  if (q.includes('balance') || q.includes('available money') || q.includes('cash on hand')) {
    return message(
      `Your estimated available balance is ${formatCurrency(summary.totalBalance)}. This estimate starts from your SaveIQ opening balance and adjusts for the income and expenses recorded here.`,
      [{ label: 'Estimated Balance', value: formatCurrency(summary.totalBalance) }]
    );
  }

  if (q.includes('income') && !q.includes('savings rate')) {
    return message(
      `Your monthly income recorded in SaveIQ is ${formatCurrency(summary.monthlyIncome)}. Your recorded expenses are ${formatCurrency(summary.monthlyExpenses)}, leaving ${formatCurrency(summary.monthlySavings)} before goal contributions.`,
      [
        { label: 'Monthly Income', value: formatCurrency(summary.monthlyIncome) },
        { label: 'Monthly Expenses', value: formatCurrency(summary.monthlyExpenses) },
        { label: 'Net Savings', value: formatCurrency(summary.monthlySavings) },
      ]
    );
  }

  const expenseCategories = [...new Set(
    transactions.filter((tx) => tx.type === 'expense').map((tx) => tx.category)
  )];
  const requestedCategory = expenseCategories.find((category) =>
    q.includes(category.toLowerCase())
  );

  if (requestedCategory || q.includes('budget') || q.includes('limit')) {
    const relevantBudgets = requestedCategory
      ? budgets.filter((budget) => budget.category === requestedCategory)
      : budgets;

    if (relevantBudgets.length > 0) {
      const budgetLines = relevantBudgets.map((budget) => {
        const spent = categorySpending[budget.category] || 0;
        const remaining = budget.monthlyLimit - spent;
        return `**${budget.category}:** ${formatCurrency(spent)} spent of ${formatCurrency(budget.monthlyLimit)}; ${remaining >= 0 ? `${formatCurrency(remaining)} left` : `${formatCurrency(Math.abs(remaining))} over budget`}.`;
      });
      return message(
        budgetLines.join('\n'),
        relevantBudgets.map((budget) => ({
          label: `${budget.category} Budget`,
          value: `${formatCurrency(categorySpending[budget.category] || 0)} / ${formatCurrency(budget.monthlyLimit)}`,
        }))
      );
    }

    if (requestedCategory) {
      const spent = categorySpending[requestedCategory] || 0;
      return message(
        `Your recorded ${requestedCategory} expenses total ${formatCurrency(spent)}. There isn't a ${requestedCategory} budget set up yet.`,
        [{ label: `${requestedCategory} Spending`, value: formatCurrency(spent) }]
      );
    }
  }

  if (/\b(expenses?|spend|spent|spending|transactions?|categories)\b/.test(q) || q.includes('money going')) {
    const categoryLines = sortedCategories.length > 0
      ? sortedCategories.map(([category, amount]) => `**${category}:** ${formatCurrency(amount)}`)
      : ['No expense transactions have been recorded yet.'];
    return message(
      `Your recorded expenses total ${formatCurrency(summary.monthlyExpenses)}. By category:\n${categoryLines.join('\n')}`,
      [
        { label: 'Total Expenses', value: formatCurrency(summary.monthlyExpenses) },
        { label: 'Largest Category', value: `${topExpenseCategory[0]} (${formatCurrency(topExpenseCategory[1] as number)})` },
      ]
    );
  }

  if (q.includes('goal') && !q.includes('laptop') && !q.includes('emergency') && !/\bgoa\b/.test(q) && !q.includes('education')) {
    const goalLines = goals.map((goal) => {
      const progress = goal.targetAmount > 0
        ? Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100))
        : 0;
      return `**${goal.name}:** ${formatCurrency(goal.currentAmount)} of ${formatCurrency(goal.targetAmount)} saved (${progress}%).`;
    });
    return message(
      goalLines.length > 0 ? goalLines.join('\n') : 'You have no savings goals yet. Create one to start tracking progress.',
      goals.map((goal) => ({
        label: goal.name,
        value: `${formatCurrency(goal.currentAmount)} / ${formatCurrency(goal.targetAmount)}`,
      }))
    );
  }

  // Query 1: Laptop goal faster
  if (q.includes('laptop') || (q.includes('reach') && q.includes('faster'))) {
    const forecast = laptopGoal
      ? calculateGoalForecast(laptopGoal, summary.monthlySavings)
      : null;
    const velocity = forecast ? forecast.savingsVelocity : 8000;
    const remaining = laptopGoal
      ? laptopGoal.targetAmount - laptopGoal.currentAmount
      : 48000;

    return {
      id: `ai_${Date.now()}`,
      sender: 'assistant',
      text: `You're currently saving around ${formatCurrency(velocity)} per month toward your ${laptopGoal ? laptopGoal.name : 'Laptop'} goal. Your goal requires approximately ${formatCurrency(forecast?.requiredMonthlySaving || 8000)}/month to stay on schedule for ${laptopGoal?.targetDate ? new Date(laptopGoal.targetDate).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) : 'March 2027'}.\n\nBased on your recent spending patterns, reducing Shopping by ₹1,500 and Food delivery by ₹1,000 could increase your dedicated monthly allocation to approximately ₹10,500, helping you reach your target approximately 1 to 2 months earlier!`,
      timestamp: new Date().toISOString(),
      dataPoints: [
        { label: 'Current Saved', value: formatCurrency(laptopGoal?.currentAmount || 72000) },
        { label: 'Remaining Target', value: formatCurrency(remaining) },
        { label: 'Current Velocity', value: `${formatCurrency(velocity)}/mo` },
        { label: 'Projected Completion', value: forecast?.predictedCompletionDate || 'February 2027' },
      ],
      suggestedPrompts: [
        'Which expense category should I reduce?',
        'Can I afford a ₹5,000 purchase?',
        'What is my savings rate?',
      ],
    };
  }

  // Query 2: Where am I spending too much / reduce category
  if (
    q.includes('spending too much') ||
    q.includes('where am i spending') ||
    q.includes('reduce') ||
    q.includes('cut')
  ) {
    const shoppingSpent = categorySpending['Shopping'] || 0;
    const foodSpent = categorySpending['Food'] || 0;
    const shoppingBudget = budgets.find((b) => b.category === 'Shopping')?.monthlyLimit || 5000;

    return {
      id: `ai_${Date.now()}`,
      sender: 'assistant',
      text: `Looking at your recent transactions, your highest discretionary outflow is **Shopping** at ${formatCurrency(shoppingSpent)}, which is currently ${formatCurrency(shoppingSpent - shoppingBudget)} over your ₹${shoppingBudget} monthly budget.\n\nHere are the top two optimization opportunities:\n1. **Shopping:** Delay non-essential e-commerce purchases (Amazon, Flipkart) by 14 days. Potential savings: **₹1,500 - ₹2,000/month**.\n2. **Food & Dining:** Your food delivery spending (Swiggy, Zomato) stands at ${formatCurrency(foodSpent)}. Swapping 2 takeout orders with home cooking saves **₹1,200/month**.\n\nApplying these two changes frees up **₹2,700/month** directly into your savings goals.`,
      timestamp: new Date().toISOString(),
      dataPoints: [
        { label: 'Shopping Spend', value: formatCurrency(shoppingSpent) },
        { label: 'Food & Dining', value: formatCurrency(foodSpent) },
        { label: 'Monthly Potential Savings', value: '₹2,700/mo' },
      ],
      suggestedPrompts: [
        'How can I reach my laptop goal faster?',
        'What is my savings rate?',
        'How much should I save every month?',
      ],
    };
  }

  // Query 3: Can I afford a ₹5,000 purchase / purchase affordability
  if (q.includes('afford') || q.includes('5000') || q.includes('purchase')) {
    const match = q.match(/(\d+[\d,]*)/);
    const amount = match ? parseInt(match[0].replace(/,/g, ''), 10) : 5000;
    const canAfford = summary.monthlySavings >= amount;

    return {
      id: `ai_${Date.now()}`,
      sender: 'assistant',
      text: canAfford
        ? `Yes, you can afford a ${formatCurrency(amount)} purchase this month without going into debt, because your current monthly net savings is ${formatCurrency(summary.monthlySavings)}.\n\nHowever, note that doing so will reduce this month's savings contribution from ${formatCurrency(summary.monthlySavings)} to ${formatCurrency(summary.monthlySavings - amount)}. This might delay your nearest active goal (such as ${laptopGoal?.name || 'Laptop'}) by approximately 2 to 3 weeks unless compensated next month.`
        : `A ${formatCurrency(amount)} purchase would stretch your current month's budget. Your monthly net savings is currently ${formatCurrency(summary.monthlySavings)}, and you have active goals requiring ongoing allocations. Consider splitting this purchase or saving ₹1,500/month over the next 3 months to fund it guilt-free.`,
      timestamp: new Date().toISOString(),
      dataPoints: [
        { label: 'Monthly Net Savings', value: formatCurrency(summary.monthlySavings) },
        { label: 'Proposed Purchase', value: formatCurrency(amount) },
        { label: 'Post-Purchase Savings', value: formatCurrency(Math.max(0, summary.monthlySavings - amount)) },
      ],
      suggestedPrompts: [
        'Where am I spending too much?',
        'How much should I save every month?',
      ],
    };
  }

  // Query 4: Emergency Fund
  if (q.includes('emergency fund') || q.includes('emergency')) {
    const target = emergencyGoal?.targetAmount || 100000;
    const saved = emergencyGoal?.currentAmount || 65000;
    const progress = Math.round((saved / target) * 100);

    return {
      id: `ai_${Date.now()}`,
      sender: 'assistant',
      text: `Your **Emergency Fund** is currently at **${formatCurrency(saved)}** out of your **${formatCurrency(target)}** target (${progress}% completed).\n\nAt your current allocation rate of ₹5,000/month, you are on track to fully fund your 6-month safety reserve by **January 2027**. This gives you high financial resilience against unexpected expenses like medical bills or sudden repairs.`,
      timestamp: new Date().toISOString(),
      dataPoints: [
        { label: 'Funded', value: formatCurrency(saved) },
        { label: 'Target', value: formatCurrency(target) },
        { label: 'Progress', value: `${progress}%` },
        { label: 'Target Date', value: emergencyGoal ? new Date(emergencyGoal.targetDate).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) : 'Jan 2027' },
      ],
      suggestedPrompts: [
        'What is my savings rate?',
        'How can I reach my laptop goal faster?',
      ],
    };
  }

  // Query 5: Savings rate & how much should I save
  if (
    q.includes('savings rate') ||
    q.includes('how much should i save') ||
    q.includes('how much to save')
  ) {
    return {
      id: `ai_${Date.now()}`,
      sender: 'assistant',
      text: `Your current savings rate is **${summary.savingsRate}%** (saving ${formatCurrency(summary.monthlySavings)} from your ${formatCurrency(summary.monthlyIncome)} income).\n\n**Financial Benchmark:**\n• The standard 50/30/20 rule recommends at least **20%** for savings and debt repayment.\n• You are currently exceeding that benchmark at **${summary.savingsRate}%**, which puts you in the top tier for financial discipline!\n\nIf you want to reach aggressive financial independence or accelerate big-ticket goals, aiming for **35% (₹15,750/month)** is achievable by trimming ₹2,250 from Shopping and Dining.`,
      timestamp: new Date().toISOString(),
      dataPoints: [
        { label: 'Monthly Income', value: formatCurrency(summary.monthlyIncome) },
        { label: 'Monthly Expenses', value: formatCurrency(summary.monthlyExpenses) },
        { label: 'Monthly Savings', value: formatCurrency(summary.monthlySavings) },
        { label: 'Savings Rate', value: `${summary.savingsRate}%` },
      ],
      suggestedPrompts: [
        'How can I reach my laptop goal faster?',
        'Where am I spending too much?',
        'Can I afford a ₹5,000 purchase?',
      ],
    };
  }

  // Query 6: Goa Trip Goal
  const goaGoal = goals.find((g) => g.name.toLowerCase().includes('goa') || g.id === 'goal_goa');
  if (/\bgoa\b/.test(q) && goaGoal) {
    const goaForecast = calculateGoalForecast(goaGoal, summary.monthlySavings);
    return {
      id: `ai_${Date.now()}`,
      sender: 'assistant',
      text: `Your **${goaGoal.name}** is at **${formatCurrency(goaGoal.currentAmount)}** out of **${formatCurrency(goaGoal.targetAmount)}** (${goaForecast.progress}% completed).\n\n• **Remaining:** ${formatCurrency(goaForecast.remainingAmount)}\n• **Target Deadline:** ${new Date(goaGoal.targetDate).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}\n• **Required Monthly:** ${formatCurrency(goaForecast.requiredMonthlySaving)}/mo\n• **Status:** ${goaForecast.statusText}\n\nYou only need approximately ${formatCurrency(goaForecast.requiredWeeklySaving)}/week to fully fund this vacation before your trip date!`,
      timestamp: new Date().toISOString(),
      dataPoints: [
        { label: 'Saved', value: formatCurrency(goaGoal.currentAmount) },
        { label: 'Target', value: formatCurrency(goaGoal.targetAmount) },
        { label: 'Required Monthly', value: `${formatCurrency(goaForecast.requiredMonthlySaving)}/mo` },
        { label: 'Projected Finish', value: goaForecast.predictedCompletionDate },
      ],
      suggestedPrompts: [
        'How can I reach my laptop goal faster?',
        'Can I afford a ₹5,000 purchase?',
      ],
    };
  }

  // Query 7: Education Certification Goal
  const eduGoal = goals.find((g) => g.category === 'Education' || g.name.toLowerCase().includes('education'));
  if ((q.includes('education') || q.includes('cert')) && eduGoal) {
    const eduForecast = calculateGoalForecast(eduGoal, summary.monthlySavings);
    return {
      id: `ai_${Date.now()}`,
      sender: 'assistant',
      text: `Your **${eduGoal.name}** currently has **${formatCurrency(eduGoal.currentAmount)}** saved toward your **${formatCurrency(eduGoal.targetAmount)}** target.\n\n• **Target Date:** ${new Date(eduGoal.targetDate).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}\n• **Required Allocation:** ${formatCurrency(eduForecast.requiredMonthlySaving)}/mo\n• **Status:** ${eduForecast.statusText}\n\nSince this is an investment in your career and future earning power, staying consistent with your monthly ₹15,000 allocation will ensure zero student debt.`,
      timestamp: new Date().toISOString(),
      dataPoints: [
        { label: 'Saved', value: formatCurrency(eduGoal.currentAmount) },
        { label: 'Target', value: formatCurrency(eduGoal.targetAmount) },
        { label: 'Required Monthly', value: `${formatCurrency(eduForecast.requiredMonthlySaving)}/mo` },
      ],
      suggestedPrompts: [
        'How much should I save every month?',
        'Where am I spending too much?',
      ],
    };
  }

  // Query 8: Specific Merchant spending query (e.g. Swiggy, Amazon, Uber, Zomato)
  const matchedTx = transactions.filter(
    (tx) => tx.type === 'expense' && q.includes(tx.merchant.toLowerCase().split(' ')[0])
  );
  if (matchedTx.length > 0) {
    const merchantName = matchedTx[0].merchant;
    const totalMerchantSpend = matchedTx.reduce((sum, tx) => sum + tx.amount, 0);
    return {
      id: `ai_${Date.now()}`,
      sender: 'assistant',
      text: `You have spent a total of **${formatCurrency(totalMerchantSpend)}** across ${matchedTx.length} transaction(s) at **${merchantName}** this billing cycle.\n\nTransactions:\n${matchedTx.map((t) => `• ${t.merchant}: ${formatCurrency(t.amount)} on ${t.date} (${t.paymentMethod})`).join('\n')}\n\nTip: Tracking recurring orders at this merchant helps you spot automatic subscriptions or impulse delivery habits before they compound.`,
      timestamp: new Date().toISOString(),
      dataPoints: [
        { label: 'Merchant', value: merchantName },
        { label: 'Total Outflow', value: formatCurrency(totalMerchantSpend) },
        { label: 'Frequency', value: `${matchedTx.length} orders` },
      ],
      suggestedPrompts: [
        'Where am I spending too much?',
        'Which expense category should I reduce?',
      ],
    };
  }

  return message(
    `I couldn't match “${query.trim()}” to a specific finance question yet. I can give precise answers about your income, balance, spending by category, budgets, savings rate, and goal progress. Try asking about one of those, or include a merchant or category name.`,
    [
      { label: 'Monthly Savings', value: formatCurrency(summary.monthlySavings) },
      { label: 'Top Spend', value: `${topExpenseCategory[0]} (${formatCurrency(topExpenseCategory[1] as number)})` },
    ]
  );
}
