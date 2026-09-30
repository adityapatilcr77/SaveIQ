'use client';

import React, { useState, useRef, useEffect, Suspense } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AICoachMessage } from '@/types';
import { askAICoach } from '@/lib/ai-engine';
import { useSearchParams } from 'next/navigation';
import {
  Bot,
  Send,
  Sparkles,
  User,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  HelpCircle,
  RotateCcw,
} from 'lucide-react';

function AICoachContent() {
  const { transactions, goals, budgets, user } = useFinance();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q');

  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial welcome message
  const [messages, setMessages] = useState<AICoachMessage[]>([
    {
      id: 'msg_welcome',
      sender: 'assistant',
      text: `Hello ${user.name}! I'm your **SaveIQ AI Financial Coach**.\n\nI monitor your spending patterns across categories, track goal milestones, and calculate optimal savings trajectories.\n\nHow can I help you optimize your money today? Pick a suggested question below or type anything!`,
      timestamp: new Date().toISOString(),
      dataPoints: [
        { label: 'Monthly Surplus', value: `₹${(user.monthlyIncome - 31500).toLocaleString('en-IN')}` },
        { label: 'Active Goals', value: `${goals.length} tracked` },
      ],
      suggestedPrompts: [
        'How can I reach my laptop goal faster?',
        'Where am I spending too much?',
        'Can I afford a ₹5,000 purchase?',
        'What is my savings rate?',
      ],
    },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Handle URL prefilled query (e.g. from Dashboard "Ask AI" button)
  useEffect(() => {
    if (initialQuery) {
      handleSendMessage(initialQuery);
    }
  }, [initialQuery]);

  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query) return;

    const userMsg: AICoachMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    // Simulate AI thinking and generating response
    setTimeout(() => {
      const response = askAICoach(query, transactions, goals, budgets, user);
      setMessages((prev) => [...prev, response]);
      setIsTyping(false);
    }, 600);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const suggestedQuestions = [
    'How can I reach my laptop goal faster?',
    'Where am I spending too much?',
    'How much should I save every month?',
    'Can I afford a ₹5,000 purchase?',
    'Which expense category should I reduce?',
    'When will I reach my emergency fund goal?',
    'What is my savings rate?',
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-4 pb-12 flex flex-col h-[calc(100vh-6.5rem)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-sm">
              <Bot className="w-5 h-5" />
            </div>
            SaveIQ AI Coach
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Ask questions about your spending, savings velocity, and goal optimization.
          </p>
        </div>

        <button
          onClick={() => {
            setMessages([messages[0]]);
          }}
          className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1.5 self-start sm:self-auto py-1 px-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Chat
        </button>
      </div>

      {/* Suggested Prompts Pill Carousel */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 shrink-0 no-scrollbar">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 shrink-0">
          Suggested:
        </span>
        {suggestedQuestions.map((q, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(q)}
            className="shrink-0 px-3 py-1.5 rounded-full text-xs font-medium bg-white text-slate-700 border border-slate-200/90 hover:border-emerald-500 hover:text-emerald-700 hover:bg-emerald-50/50 transition-all shadow-xs"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Chat Messages Box */}
      <Card className="flex-1 flex flex-col overflow-hidden p-0 border-slate-200 shadow-sm relative">
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {messages.map((m) => {
            const isUser = m.sender === 'user';
            return (
              <div
                key={m.id}
                className={`flex gap-3 max-w-2xl ${
                  isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold shadow-xs ${
                    isUser
                      ? 'bg-slate-900 text-white'
                      : 'bg-gradient-to-tr from-emerald-600 to-teal-500 text-white'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div
                  className={`rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-xs ${
                    isUser
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-50/90 text-slate-800 border border-slate-100'
                  }`}
                >
                  <div className="whitespace-pre-wrap font-normal">
                    {m.text}
                  </div>

                  {/* Render Data Points if any */}
                  {m.dataPoints && m.dataPoints.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-200/60">
                      {m.dataPoints.map((dp, idx) => (
                        <div key={idx} className="p-2 rounded-lg bg-white border border-slate-100">
                          <span className="text-[10px] text-slate-400 font-semibold block uppercase">
                            {dp.label}
                          </span>
                          <span className="text-xs font-bold text-slate-900 block mt-0.5">
                            {dp.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Render suggested follow-up prompts */}
                  {m.suggestedPrompts && (
                    <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex flex-wrap gap-1.5">
                      {m.suggestedPrompts.map((sp, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(sp)}
                          className="text-[11px] font-semibold text-emerald-700 bg-white hover:bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/60 transition-colors flex items-center gap-1"
                        >
                          {sp} <ArrowRight className="w-2.5 h-2.5" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3 max-w-sm">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-100">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask anything about your goals, expenses, or savings plans..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 px-4 py-3 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
            />
            <Button
              onClick={() => handleSendMessage()}
              disabled={!inputQuery.trim() || isTyping}
              variant="primary"
              size="md"
              className="px-4 py-3 shrink-0"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Mandatory Disclaimer */}
      <div className="flex items-center justify-center gap-1.5 text-center text-[11px] text-slate-500 shrink-0">
        <ShieldAlert className="w-3.5 h-3.5 text-amber-500 shrink-0" />
        <span>
          AI insights are for educational purposes and are not professional financial advice.
        </span>
      </div>
    </div>
  );
}

export default function AICoachPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-slate-400 text-xs">
          Loading AI Coach...
        </div>
      }
    >
      <AICoachContent />
    </Suspense>
  );
}
