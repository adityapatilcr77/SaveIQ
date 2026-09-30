# SaveIQ

SaveIQ is a personal finance dashboard for tracking spending, monthly budgets, and savings goals. It includes goal forecasts, analytics, and a local financial coach that answers supported questions from the data in your profile.

## Features

- **Dashboard:** View balance, income, expenses, savings rate, savings health, goal progress, and spending charts.
- **Transactions:** Add, edit, delete, search, and filter income and expense records.
- **Savings goals:** Create goals, track contributions and milestones, and review completion forecasts and savings scenarios.
- **Budgets:** Set category limits and monitor spending against each budget.
- **Analytics:** Review spending categories and income, expense, and savings trends.
- **AI Coach:** Ask about balances, income, spending, budgets, savings rates, and goal progress. The coach currently uses local, rule-based responses; it does not call an external AI service or require an API key.
- **Local data:** Finance data and settings are saved in browser `localStorage`. Settings include data export and demo-data reset actions.

## App Pages

| Route | Description |
| --- | --- |
| `/dashboard` | Financial overview and insights |
| `/transactions` | Transaction management |
| `/goals` | Savings goals and forecasts |
| `/goals/[id]` | Goal details |
| `/budget` | Category budgets |
| `/analytics` | Spending and savings charts |
| `/ai-coach` | Financial question-and-answer coach |
| `/settings` | Profile, preferences, and data actions |

## Tech Stack

- Next.js 14 App Router and React 18
- TypeScript
- Tailwind CSS
- Recharts
- Lucide React
- React Context and browser `localStorage`

## Getting Started

### Requirements

- Node.js 18 or later
- npm

### Install and run

```bash
npm install
npm run dev
```

Open the local URL printed by Next.js, usually [http://localhost:3000](http://localhost:3000). If that port is already in use, Next.js selects another available port.

### Build and run for production

```bash
npm run build
npm start
```

### Lint

```bash
npm run lint
```

No environment variables are required for the current app.

## Demo Data

The app starts with sample Indian financial data, including a monthly income of ₹45,000, sample transactions and budgets, and four savings goals: a laptop, emergency fund, Goa trip, and certification. Changes are saved in the browser and remain after a reload until demo data is reset or site storage is cleared.

## Privacy and Disclaimer

SaveIQ is a browser-based demo and does not connect to a bank or transmit finance data to an external AI provider. The AI Coach uses local rules and calculations. Its responses are for educational purposes only and are not professional financial advice.
