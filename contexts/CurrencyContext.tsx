'use client'

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Currency = {
  code: string;
  label: string;
  symbol: string;
};

const currencies: Currency[] = [
  { code: 'SOL', label: 'Solana', symbol: 'SOL' },
  { code: 'AED', label: 'UAE Dirham', symbol: 'AED' },
  { code: 'USD', label: 'US Dollar', symbol: '$' },
];

type CurrencyContextType = {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatAmount: (amount: number | string) => string;
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState<Currency>(currencies[0]); // Default to SOL
  const [rates, setRates] = useState<{ [code: string]: number }>({ SOL: 1, AED: 20, USD: 5.5 }); // 1 SOL = 20 AED = 5.5 USD

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
    // Set fixed exchange rates for SOL-based system
    // In a real implementation, you might fetch live SOL prices
    setRates({
      SOL: 1,      // Base currency
      AED: 20,     // 1 SOL = 20 AED
      USD: 5.5,    // 1 SOL = 5.5 USD (approximate)
    });
  }, []);

  const formatAmount = (amount: number | string) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    const rate = rates[currency.code] || 1;
    const converted = currency.code === 'SOL' ? numAmount : numAmount * rate;

    if (currency.code === 'SOL') {
      return `${converted.toFixed(4)} SOL`;
    }

    return new Intl.NumberFormat('en', {
      style: 'currency',
      currency: currency.code,
      maximumFractionDigits: currency.code === 'AED' ? 0 : 2,
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