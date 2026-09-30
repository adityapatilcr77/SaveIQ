'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { ProgressRing } from '@/components/ui/ProgressRing';
import {
  Sparkles,
  ArrowRight,
  Target,
  ShieldCheck,
  TrendingUp,
  PieChart,
  Bot,
  Zap,
  CheckCircle2,
  Lock,
  Laptop,
  Check,
  Calendar,
  Wallet,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="bg-white overflow-hidden text-slate-900">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 lg:pt-24 lg:pb-32 overflow-hidden bg-gradient-to-b from-emerald-50/40 via-white to-white">
        {/* Decorative backdrop gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-emerald-300/20 via-teal-200/20 to-sky-200/20 blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            {/* Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-800 text-xs font-semibold mb-6 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Next-Generation AI Financial Tracker</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Save smarter.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700">
                Reach your goals faster.
              </span>
            </h1>

            {/* Subheading */}
            <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              SaveIQ uses your spending patterns and savings goals to create personalized, actionable financial insights. Turn vague wishes into mathematically sound, achievable plans.
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button variant="primary" size="lg" className="w-full sm:w-auto" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Get Started Free
                </Button>
              </Link>

              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  View Live Demo
                </Button>
              </Link>
            </div>

            <div className="mt-6 flex items-center justify-center gap-6 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600" /> No credit card required
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600" /> Local demo privacy
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600" /> Real-time forecasting
              </span>
            </div>
          </div>

          {/* Interactive Hero Fintech Card Mockup */}
          <div className="mt-14 max-w-4xl mx-auto">
            <div className="p-3 sm:p-5 rounded-3xl bg-slate-900/5 backdrop-blur-xl border border-slate-200/80 shadow-2xl">
              <div className="rounded-2xl bg-white p-5 sm:p-7 shadow-lg border border-slate-100">
                {/* Header inside preview */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-100 gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-sm">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">MacBook / Laptop Goal</span>
                        <Badge variant="emerald" size="sm">On Track</Badge>
                      </div>
                      <span className="text-xs text-slate-400">Target Date: March 2027 • ₹8,000/mo velocity</span>
                    </div>
                  </div>
                  <div className="text-right sm:text-right">
                    <span className="text-xs text-slate-400 block font-medium">Saved so far</span>
                    <span className="text-xl font-extrabold text-emerald-700">₹72,000 / ₹1,20,000</span>
                  </div>
                </div>

                {/* Progress bar inside preview */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-slate-500 mb-1.5 font-medium">
                    <span>60% achieved</span>
                    <span>₹48,000 remaining</span>
                  </div>
                  <ProgressBar value={60} barClassName="bg-gradient-to-r from-emerald-500 to-teal-500 h-3" />
                </div>

                {/* Highlighted AI insight teaser */}
                <div className="mt-5 p-4 rounded-xl bg-emerald-50/80 border border-emerald-200/80 flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="text-left text-xs leading-relaxed text-emerald-950">
                    <strong>AI Recommendation:</strong> Reducing food delivery by ₹1,500/month accelerates this goal by approximately <strong>3 weeks</strong>, shifting projected completion from March to February 2027.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. HOW SAVEIQ WORKS */}
      <section id="how-it-works" className="py-20 bg-slate-50/60 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/60">
              The SaveIQ Methodology
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-3">
              How SaveIQ Works
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              A continuous, automated loop connecting every rupee spent to your ultimate life milestones.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs relative">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm mb-4">
                01
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Track Inflows & Outflows</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Log income streams and categorized expenses (Food, Shopping, Bills, Transport). SaveIQ continuously monitors monthly net surplus.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs relative">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-sm mb-4">
                02
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Set Milestone Targets</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Define target amounts and deadlines for what matters: Emergency Fund, Tech upgrades, vacations, or education.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs relative">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm mb-4">
                03
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">AI Accelerated Execution</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                SaveIQ computes required monthly contributions, alerts on budget leaks, and suggests realistic trims that bring your finish line closer.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. AI-POWERED INSIGHTS */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/60">
                Actionable Intelligence
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-3">
                AI Insights that actually move the needle
              </h2>
              <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                Most finance apps show you boring bar charts of what already happened. SaveIQ analyzes future consequences:
              </p>

              <div className="space-y-4 mt-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 shrink-0 mt-0.5">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Discretionary Leaks Detection</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Identifies when Swiggy, Zomato, or Amazon outpaces historical averages and shows the exact goal acceleration if adjusted.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-teal-50 text-teal-600 shrink-0 mt-0.5">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Dynamic Savings Velocity</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Continuously computes your true monthly goal funding rate and dynamically recalculates projected completion dates.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 shrink-0 mt-0.5">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Discipline Health Scoring</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      A holistic 0-100 habit rating combining consistency, emergency fund coverage, and category budget compliance.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Link href="/dashboard">
                  <Button variant="primary" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Explore Live Dashboard
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right: Card showcasing AI recommendation */}
            <div className="space-y-4">
              <Card className="p-5 border-emerald-200/80 bg-emerald-50/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                    Optimization Opportunity
                  </span>
                  <span className="text-xs font-bold text-emerald-700 bg-white px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Save ₹1,500/mo
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Food Delivery vs Laptop Goal</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  "You are spending 18% more on food delivery than your 3-month average. Reducing this category by ₹1,500/month helps you reach your Laptop goal 3 weeks earlier."
                </p>
              </Card>

              <Card className="p-5 border-amber-200/80 bg-amber-50/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">
                    Budget Warning
                  </span>
                  <span className="text-xs font-bold text-rose-700 bg-white px-2.5 py-0.5 rounded-full border border-amber-200">
                    Over by ₹1,200
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Shopping Budget Exceeded</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  "Shopping expenses reached ₹6,200 against your ₹5,000 monthly limit. Pausing non-essential e-commerce orders for 10 days will restore your savings pace."
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* 4. GOAL FORECASTING & WHAT-IF SIMULATOR */}
      <section id="forecasting" className="py-20 bg-slate-900 text-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-400/30">
              Deterministic Forecasting
            </span>
            <h2 className="text-3xl font-extrabold text-white tracking-tight mt-3">
              Mathematical Goal Forecasting & "What-If" Simulator
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Know exactly when you'll reach each milestone with dynamic velocity models.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700">
              <span className="text-xs text-slate-400 block font-medium uppercase tracking-wider">
                Required Monthly
              </span>
              <div className="text-2xl font-bold text-emerald-400 mt-2">
                remaining ÷ months
              </div>
              <p className="text-xs text-slate-400 mt-2">
                Precise amount to allocate per cycle to meet target date
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700">
              <span className="text-xs text-slate-400 block font-medium uppercase tracking-wider">
                Savings Velocity
              </span>
              <div className="text-2xl font-bold text-teal-400 mt-2">
                ₹8,000 / mo
              </div>
              <p className="text-xs text-slate-400 mt-2">
                Actual current average monthly momentum allocated
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700">
              <span className="text-xs text-slate-400 block font-medium uppercase tracking-wider">
                Predicted Finish
              </span>
              <div className="text-2xl font-bold text-white mt-2">
                February 2027
              </div>
              <p className="text-xs text-slate-400 mt-2">
                Ahead of March 2027 target deadline
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700">
              <span className="text-xs text-slate-400 block font-medium uppercase tracking-wider">
                What-If Simulator
              </span>
              <div className="text-2xl font-bold text-amber-400 mt-2">
                +3 Weeks Earlier
              </div>
              <p className="text-xs text-slate-400 mt-2">
                Simulate cutting ₹1,500/mo to see finish line adjust
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. AI FINANCIAL COACH PREVIEW */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 p-2 rounded-2xl bg-emerald-50 text-emerald-700 mb-4">
            <Bot className="w-5 h-5" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Meet your 24/7 AI Financial Coach
          </h2>
          <p className="text-sm text-slate-600 max-w-xl mx-auto mt-2">
            Ask conversational questions like "Can I afford a ₹5,000 purchase?" or "How can I reach my laptop goal faster?" and receive immediate, data-backed answers.
          </p>

          <div className="mt-10 p-6 rounded-3xl bg-slate-50 border border-slate-200/80 text-left space-y-4 shadow-sm">
            <div className="flex items-start gap-3 ml-auto max-w-md bg-emerald-600 text-white p-3.5 rounded-2xl text-xs">
              <span>How can I reach my laptop goal faster?</span>
            </div>

            <div className="flex items-start gap-3 mr-auto max-w-lg bg-white border border-slate-200 p-4 rounded-2xl text-xs text-slate-700 shadow-xs leading-relaxed">
              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                You're currently saving around <strong>₹8,000/month</strong> toward your goal. Reducing Shopping by ₹1,500 and Food delivery by ₹1,000 could increase monthly allocation to <strong>₹10,500</strong> and help you achieve your MacBook 1 to 2 months earlier!
              </div>
            </div>
          </div>

          <div className="mt-8">
            <Link href="/ai-coach">
              <Button variant="primary" size="md">
                Chat with AI Coach
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 6. SECURITY & PRIVACY */}
      <section id="security" className="py-16 bg-slate-50 border-t border-slate-100">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <Lock className="w-8 h-8 text-emerald-600 mx-auto mb-3" />
          <h3 className="text-xl font-bold text-slate-900">Privacy-First Architecture</h3>
          <p className="text-xs text-slate-600 mt-2 leading-relaxed">
            Your financial data is stored locally in this demo application using browser LocalStorage. No real bank logins or sensitive Aadhaar/PAN cards are required.
          </p>
          <p className="text-[11px] text-slate-400 mt-2 italic">
            SaveIQ is an educational financial planning tool. AI-generated insights are estimates and should not be considered professional financial advice.
          </p>
        </div>
      </section>

      {/* 7. FINAL CTA */}
      <section className="py-20 bg-gradient-to-tr from-emerald-800 to-teal-900 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to turn your savings goals into reality?
          </h2>
          <p className="text-emerald-100 text-sm max-w-xl mx-auto mt-3">
            Join SaveIQ today and experience intelligent savings tracking built for modern financial independence.
          </p>
          <div className="mt-8">
            <Link href="/dashboard">
              <Button variant="emerald" size="lg" className="shadow-xl shadow-emerald-900/30">
                Launch SaveIQ Dashboard &rarr;
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-slate-950 text-slate-400 text-xs text-center border-t border-slate-900">
        <p>© 2026 SaveIQ. Built with Next.js, TypeScript, Tailwind CSS & Recharts.</p>
        <p className="mt-1 text-[11px] text-slate-600">
          Turn your savings goals into achievable plans.
        </p>
      </footer>
    </div>
  );
}
