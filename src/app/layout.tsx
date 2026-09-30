import type { Metadata } from 'next';
import './globals.css';
import { FinanceProvider } from '@/context/FinanceContext';
import { AppLayout } from '@/components/layout/AppLayout';

export const metadata: Metadata = {
  title: 'SaveIQ – AI Savings Goal Tracker',
  description:
    'Turn your savings goals into achievable plans. SaveIQ uses your spending patterns and savings goals to create personalized, actionable financial insights.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full antialiased selection:bg-emerald-500 selection:text-white">
        <FinanceProvider>
          <AppLayout>{children}</AppLayout>
        </FinanceProvider>
      </body>
    </html>
  );
}
