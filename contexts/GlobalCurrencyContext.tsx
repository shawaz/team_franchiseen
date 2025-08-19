"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { SUPPORTED_CURRENCIES, coinGeckoService, formatLocalCurrency } from '@/lib/coingecko';

interface Currency {
  code: string;
  name: string;
  flag: string;
}

interface GlobalCurrencyContextType {
  selectedCurrency: string;
  setSelectedCurrency: (currency: string) => void;
  currencies: Currency[];
  exchangeRates: { [key: string]: number };
  formatAmount: (amount: number, currency?: string) => string;
  convertFromSOL: (solAmount: number, targetCurrency?: string) => number;
  loading: boolean;
  refreshRates: () => Promise<void>;
}

const GlobalCurrencyContext = createContext<GlobalCurrencyContextType | undefined>(undefined);

export function GlobalCurrencyProvider({ children }: { children: React.ReactNode }) {
  const [selectedCurrency, setSelectedCurrency] = useState<string>('usd');
  const [exchangeRates, setExchangeRates] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState<boolean>(false);

  // Load saved currency preference
  useEffect(() => {
    const savedCurrency = localStorage.getItem('selectedGlobalCurrency');
    if (savedCurrency) {
      setSelectedCurrency(savedCurrency);
    }
  }, []);

  // Save currency preference
  useEffect(() => {
    localStorage.setItem('selectedGlobalCurrency', selectedCurrency);
  }, [selectedCurrency]);

  // Fetch exchange rates
  const refreshRates = async () => {
    setLoading(true);
    try {
      const rates: { [key: string]: number } = {};
      
      for (const currency of SUPPORTED_CURRENCIES) {
        try {
          const prices = await coinGeckoService.getSolPrices();
          const price = prices[currency.code as keyof typeof prices];
          rates[currency.code] = price;
        } catch (error) {
          console.warn(`Failed to fetch ${currency.code} rate:`, error);
          // Fallback rates
          rates[currency.code] = currency.code === 'usd' ? 100 : 
                                currency.code === 'aed' ? 367 : 
                                currency.code === 'sar' ? 375 : 100;
        }
      }
      
      setExchangeRates(rates);
    } catch (error) {
      console.error('Failed to fetch exchange rates:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initial rate fetch
  useEffect(() => {
    refreshRates();
    
    // Refresh rates every 5 minutes
    const interval = setInterval(refreshRates, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Format amount in selected currency
  const formatAmount = (amount: number, currency?: string) => {
    const targetCurrency = currency || selectedCurrency;
    const rate = exchangeRates[targetCurrency] || 1;
    const convertedAmount = amount * rate;
    
    return formatLocalCurrency(convertedAmount, targetCurrency);
  };

  // Convert SOL amount to target currency
  const convertFromSOL = (solAmount: number, targetCurrency?: string) => {
    const currency = targetCurrency || selectedCurrency;
    const rate = exchangeRates[currency] || 1;
    return solAmount * rate;
  };

  const value: GlobalCurrencyContextType = {
    selectedCurrency,
    setSelectedCurrency,
    currencies: SUPPORTED_CURRENCIES,
    exchangeRates,
    formatAmount,
    convertFromSOL,
    loading,
    refreshRates,
  };

  return (
    <GlobalCurrencyContext.Provider value={value}>
      {children}
    </GlobalCurrencyContext.Provider>
  );
}

export function useGlobalCurrency() {
  const context = useContext(GlobalCurrencyContext);
  if (context === undefined) {
    throw new Error('useGlobalCurrency must be used within a GlobalCurrencyProvider');
  }
  return context;
}
