'use client'

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Currency = {
  code: string;
  label: string;
  symbol: string;
};

const currencies: Currency[] = [
  { code: 'USD', label: 'US Dollar', symbol: '$' },
  { code: 'INR', label: 'Indian Rupee', symbol: '₹' },
  { code: 'EUR', label: 'Euro', symbol: '€' },
  { code: 'CAD', label: 'Canadian Dollar', symbol: 'CA$' },
  { code: 'AED', label: 'UAE Dirham', symbol: 'AED' },
];

type CurrencyContextType = {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatAmount: (amount: number | string) => string;
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState<Currency>(currencies[0]);
  const [rates, setRates] = useState<{ [code: string]: number }>({ INR: 1 });

  useEffect(() => {
    // Load saved currency preference from localStorage
    const savedCurrency = localStorage.getItem('selectedCurrency');
    if (savedCurrency) {
      const parsed = JSON.parse(savedCurrency);
      const found = currencies.find(c => c.code === parsed.code);
      if (found) {
        setCurrency(found);
      }
    }
  }, []);

  useEffect(() => {
    // Fetch exchange rates (base INR)
    async function fetchRates() {
      try {
        const res = await fetch('https://api.exchangerate-api.com/v4/latest/INR');
        const data = await res.json();
        setRates(data.rates);
      } catch (e) {
        // fallback: keep INR as 1, others as 1 (no conversion)
        setRates({ INR: 1 });
      }
    }
    fetchRates();
  }, []);

  const formatAmount = (amount: number | string) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    const rate = rates[currency.code] || 1;
    const converted = currency.code === 'INR' ? numAmount : numAmount * rate;
    return new Intl.NumberFormat('en', {
      style: 'currency',
      currency: currency.code,
      maximumFractionDigits: 0,
    }).format(converted);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatAmount }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}

export const currencies_list = currencies; 