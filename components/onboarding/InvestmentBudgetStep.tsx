"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { 
  DollarSign, 
  TrendingUp, 
  Target, 
  PieChart,
  Shield,
  Zap,
  BarChart3,
  CheckCircle
} from 'lucide-react';

interface InvestmentData {
  monthlyBudget: number;
  currency: string;
  riskTolerance: 'low' | 'medium' | 'high';
  investmentGoals: string[];
}

interface InvestmentBudgetStepProps {
  data: InvestmentData;
  onUpdate: (data: InvestmentData) => void;
}

const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' }
];

const RISK_LEVELS = [
  {
    value: 'low',
    title: 'Conservative',
    description: 'Lower risk, steady returns',
    icon: Shield,
    color: 'text-green-600',
    bgColor: 'bg-green-100 dark:bg-green-900',
    expectedReturn: '5-8%'
  },
  {
    value: 'medium',
    title: 'Balanced',
    description: 'Moderate risk, balanced growth',
    icon: BarChart3,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100 dark:bg-blue-900',
    expectedReturn: '8-12%'
  },
  {
    value: 'high',
    title: 'Aggressive',
    description: 'Higher risk, potential for higher returns',
    icon: Zap,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100 dark:bg-orange-900',
    expectedReturn: '12-20%'
  }
];

const INVESTMENT_GOALS = [
  { id: 'wealth_building', label: 'Long-term Wealth Building', icon: TrendingUp },
  { id: 'passive_income', label: 'Generate Passive Income', icon: DollarSign },
  { id: 'retirement', label: 'Retirement Planning', icon: Target },
  { id: 'diversification', label: 'Portfolio Diversification', icon: PieChart },
  { id: 'franchise_ownership', label: 'Franchise Ownership', icon: Target },
  { id: 'real_estate', label: 'Real Estate Investment', icon: Target }
];

const BUDGET_RANGES = [
  { min: 100, max: 500, label: '$100 - $500' },
  { min: 500, max: 1000, label: '$500 - $1,000' },
  { min: 1000, max: 2500, label: '$1,000 - $2,500' },
  { min: 2500, max: 5000, label: '$2,500 - $5,000' },
  { min: 5000, max: 10000, label: '$5,000 - $10,000' },
  { min: 10000, max: 999999, label: '$10,000+' }
];

export default function InvestmentBudgetStep({ data, onUpdate }: InvestmentBudgetStepProps) {
  const selectedCurrency = CURRENCIES.find(c => c.code === data.currency) || CURRENCIES[0];

  const handleBudgetChange = (value: number) => {
    onUpdate({
      ...data,
      monthlyBudget: value
    });
  };

  const handleCurrencyChange = (currencyCode: string) => {
    onUpdate({
      ...data,
      currency: currencyCode
    });
  };

  const handleRiskToleranceChange = (risk: 'low' | 'medium' | 'high') => {
    onUpdate({
      ...data,
      riskTolerance: risk
    });
  };

  const handleGoalToggle = (goalId: string) => {
    const currentGoals = data.investmentGoals;
    const updatedGoals = currentGoals.includes(goalId)
      ? currentGoals.filter(g => g !== goalId)
      : [...currentGoals, goalId];
    
    onUpdate({
      ...data,
      investmentGoals: updatedGoals
    });
  };

  const handleBudgetRangeSelect = (min: number, max: number) => {
    const midpoint = min === 10000 ? 15000 : Math.floor((min + max) / 2);
    handleBudgetChange(midpoint);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <DollarSign className="h-8 w-8 text-purple-600 dark:text-purple-400" />
        </motion.div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Set Your Investment Preferences
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Help us understand your investment goals and risk tolerance
        </p>
      </div>

      {/* Monthly Budget */}
      <Card className="p-6">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <DollarSign className="h-5 w-5 mr-2" />
          Monthly Investment Budget *
        </h4>
        
        {/* Currency Selection */}
        <div className="mb-6">
          <Label className="text-sm font-medium mb-2 block">Currency</Label>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {CURRENCIES.map((currency) => (
              <button
                key={currency.code}
                onClick={() => handleCurrencyChange(currency.code)}
                className={`p-2 rounded-lg border-2 transition-all duration-200 text-center ${
                  data.currency === currency.code
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
                    : 'border-gray-200 dark:border-stone-700 hover:border-gray-300 dark:hover:border-stone-600'
                }`}
              >
                <div className="font-semibold text-sm">{currency.symbol}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{currency.code}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Quick Budget Selection */}
        <div className="mb-6">
          <Label className="text-sm font-medium mb-2 block">Quick Select</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {BUDGET_RANGES.map((range) => (
              <button
                key={range.label}
                onClick={() => handleBudgetRangeSelect(range.min, range.max)}
                className="p-3 rounded-lg border-2 border-gray-200 dark:border-stone-700 hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-200 text-sm font-medium"
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Amount Input */}
        <div className="space-y-4">
          <Label htmlFor="customBudget">Custom Amount</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
              {selectedCurrency.symbol}
            </span>
            <Input
              id="customBudget"
              type="number"
              placeholder="0"
              value={data.monthlyBudget || ''}
              onChange={(e) => handleBudgetChange(Number(e.target.value))}
              className="h-12 pl-8 text-lg font-semibold"
              min="0"
              step="50"
            />
          </div>
          
          {data.monthlyBudget > 0 && (
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <p className="text-lg font-semibold text-purple-700 dark:text-purple-300">
                {selectedCurrency.symbol}{data.monthlyBudget.toLocaleString()} per month
              </p>
              <p className="text-sm text-purple-600 dark:text-purple-400">
                {selectedCurrency.symbol}{(data.monthlyBudget * 12).toLocaleString()} annually
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Risk Tolerance */}
      <Card className="p-6">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <BarChart3 className="h-5 w-5 mr-2" />
          Risk Tolerance *
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {RISK_LEVELS.map((risk) => {
            const Icon = risk.icon;
            const isSelected = data.riskTolerance === risk.value;
            
            return (
              <button
                key={risk.value}
                onClick={() => handleRiskToleranceChange(risk.value as any)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                  isSelected
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                    : 'border-gray-200 dark:border-stone-700 hover:border-gray-300 dark:hover:border-stone-600'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg ${risk.bgColor} flex items-center justify-center mb-3`}>
                  <Icon className={`h-5 w-5 ${risk.color}`} />
                </div>
                <h5 className="font-semibold text-gray-900 dark:text-white mb-1">
                  {risk.title}
                </h5>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {risk.description}
                </p>
                <p className="text-xs font-medium text-purple-600 dark:text-purple-400">
                  Expected: {risk.expectedReturn}
                </p>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Investment Goals */}
      <Card className="p-6">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Target className="h-5 w-5 mr-2" />
          Investment Goals * (Select all that apply)
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {INVESTMENT_GOALS.map((goal) => {
            const Icon = goal.icon;
            const isSelected = data.investmentGoals.includes(goal.id);
            
            return (
              <button
                key={goal.id}
                onClick={() => handleGoalToggle(goal.id)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 flex items-center space-x-3 text-left ${
                  isSelected
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
                    : 'border-gray-200 dark:border-stone-700 hover:border-gray-300 dark:hover:border-stone-600'
                }`}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span className="font-medium">{goal.label}</span>
                {isSelected && (
                  <CheckCircle className="h-4 w-4 text-purple-500 ml-auto" />
                )}
              </button>
            );
          })}
        </div>
      </Card>

      {/* Summary Card */}
      {data.monthlyBudget > 0 && data.investmentGoals.length > 0 && (
        <Card className="p-4 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <div className="flex items-start space-x-3">
            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
            <div>
              <h5 className="font-medium text-green-900 dark:text-green-100 mb-1">
                Investment Profile Summary
              </h5>
              <p className="text-sm text-green-700 dark:text-green-300">
                Monthly Budget: {selectedCurrency.symbol}{data.monthlyBudget.toLocaleString()} • 
                Risk Level: {RISK_LEVELS.find(r => r.value === data.riskTolerance)?.title} • 
                Goals: {data.investmentGoals.length} selected
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
