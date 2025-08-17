"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Local currency interface
export interface LocalCurrency {
  code: string;
  label: string;
  symbol: string;
  country: string;
  solRate: number; // How many local currency units per 1 SOL
}

// Supported local currencies
const localCurrencies: LocalCurrency[] = [
  { code: 'AED', label: 'UAE Dirham', symbol: 'AED', country: 'AE', solRate: 20 },
  { code: 'USD', label: 'US Dollar', symbol: '$', country: 'US', solRate: 5.5 },
  { code: 'EUR', label: 'Euro', symbol: '€', country: 'EU', solRate: 5.2 },
  { code: 'GBP', label: 'British Pound', symbol: '£', country: 'GB', solRate: 4.3 },
  { code: 'CAD', label: 'Canadian Dollar', symbol: 'CA$', country: 'CA', solRate: 7.4 },
  { code: 'AUD', label: 'Australian Dollar', symbol: 'AU$', country: 'AU', solRate: 8.2 },
  { code: 'INR', label: 'Indian Rupee', symbol: '₹', country: 'IN', solRate: 460 },
  { code: 'JPY', label: 'Japanese Yen', symbol: '¥', country: 'JP', solRate: 820 },
  { code: 'SGD', label: 'Singapore Dollar', symbol: 'S$', country: 'SG', solRate: 7.4 },
  { code: 'SAR', label: 'Saudi Riyal', symbol: 'SAR', country: 'SA', solRate: 20.6 },
];

// Context interface
interface LocalCurrencyContextType {
  // Current local currency
  localCurrency: LocalCurrency;
  
  // Available currencies
  availableCurrencies: LocalCurrency[];
  
  // Currency actions
  setLocalCurrency: (currency: LocalCurrency) => void;
  
  // Conversion functions
  solToLocal: (solAmount: number) => number;
  localToSol: (localAmount: number) => number;
  formatLocalAmount: (amount: number) => string;
  formatSolAmount: (amount: number) => string;
  
  // Detection
  isDetecting: boolean;
  detectedCountry: string | null;
}

// Create context
const LocalCurrencyContext = createContext<LocalCurrencyContextType | undefined>(undefined);

// Provider component
export const LocalCurrencyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [localCurrency, setLocalCurrency] = useState<LocalCurrency>(localCurrencies[0]); // Default to AED
  const [isDetecting, setIsDetecting] = useState(true);
  const [detectedCountry, setDetectedCountry] = useState<string | null>(null);

  // Detect user's location and set appropriate currency
  useEffect(() => {
    const detectLocation = async () => {
      try {
        // Try to get user's location from IP
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        
        if (data.country_code) {
          setDetectedCountry(data.country_code);
          
          // Find matching currency for the country
          const matchingCurrency = localCurrencies.find(
            currency => currency.country === data.country_code
          );
          
          if (matchingCurrency) {
            setLocalCurrency(matchingCurrency);
          } else {
            // Default to USD for unsupported countries
            const usdCurrency = localCurrencies.find(c => c.code === 'USD');
            if (usdCurrency) setLocalCurrency(usdCurrency);
          }
        }
      } catch (error) {
        console.log('Could not detect location, using default currency');
        // Keep default AED currency
      } finally {
        setIsDetecting(false);
      }
    };

    // Check if user has previously selected a currency
    const savedCurrency = localStorage.getItem('preferred_local_currency');
    if (savedCurrency) {
      try {
        const parsed = JSON.parse(savedCurrency);
        const currency = localCurrencies.find(c => c.code === parsed.code);
        if (currency) {
          setLocalCurrency(currency);
          setIsDetecting(false);
          return;
        }
      } catch (error) {
        console.log('Invalid saved currency, detecting location');
      }
    }

    detectLocation();
  }, []);

  // Save currency preference when changed
  const handleSetLocalCurrency = (currency: LocalCurrency) => {
    setLocalCurrency(currency);
    localStorage.setItem('preferred_local_currency', JSON.stringify(currency));
  };

  // Conversion functions
  const solToLocal = (solAmount: number): number => {
    return solAmount * localCurrency.solRate;
  };

  const localToSol = (localAmount: number): number => {
    return localAmount / localCurrency.solRate;
  };

  const formatLocalAmount = (amount: number): string => {
    if (localCurrency.code === 'JPY' || localCurrency.code === 'INR') {
      // No decimal places for JPY and INR
      return `${localCurrency.symbol}${amount.toLocaleString('en', { maximumFractionDigits: 0 })}`;
    }
    
    return new Intl.NumberFormat('en', {
      style: 'currency',
      currency: localCurrency.code,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatSolAmount = (amount: number): string => {
    return `${amount.toFixed(4)} SOL`;
  };

  const value: LocalCurrencyContextType = {
    localCurrency,
    availableCurrencies: localCurrencies,
    setLocalCurrency: handleSetLocalCurrency,
    solToLocal,
    localToSol,
    formatLocalAmount,
    formatSolAmount,
    isDetecting,
    detectedCountry,
  };

  return (
    <LocalCurrencyContext.Provider value={value}>
      {children}
    </LocalCurrencyContext.Provider>
  );
};

// Hook to use local currency context
export const useLocalCurrency = (): LocalCurrencyContextType => {
  const context = useContext(LocalCurrencyContext);
  if (!context) {
    throw new Error('useLocalCurrency must be used within a LocalCurrencyProvider');
  }
  return context;
};

// Export types for use in components
export type { LocalCurrencyContextType };
