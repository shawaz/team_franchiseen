"use client";

import React, { useState } from 'react';
import { ChevronDown, Globe, Check } from 'lucide-react';
import { useGlobalCurrency } from '@/contexts/GlobalCurrencyContext';

interface LocalCurrencySelectorProps {
  className?: string;
  showLabel?: boolean;
  compact?: boolean;
}

const LocalCurrencySelector: React.FC<LocalCurrencySelectorProps> = ({ 
  className = "", 
  showLabel = true,
  compact = false 
}) => {
  const { 
    selectedCurrency, 
    currencies, 
    setSelectedCurrency, 
    loading 
  } = useGlobalCurrency();
  
  const [isOpen, setIsOpen] = useState(false);

  const handleCurrencySelect = (currencyCode: string) => {
    setSelectedCurrency(currencyCode);
    setIsOpen(false);
  };

  if (loading) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Globe className="h-4 w-4 animate-spin text-gray-400" />
        {!compact && <span className="text-sm text-gray-500">Loading currencies...</span>}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {showLabel && !compact && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Currency
        </label>
      )}
      
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`
            ${compact ? 'px-2 py-1' : 'px-3 py-2'} 
            bg-white dark:bg-stone-700 border border-gray-300 dark:border-stone-600 
            rounded-lg focus:ring-2 focus:ring-primary focus:border-primary 
            flex items-center justify-between w-full text-left
            hover:bg-gray-50 dark:hover:bg-stone-600 transition-colors
          `}
        >
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-gray-500" />
            <span className={`${compact ? 'text-sm' : ''} text-gray-900 dark:text-white`}>
              {compact ? selectedCurrency.toUpperCase() : `${currencies.find(c => c.code === selectedCurrency)?.flag || '💰'} ${selectedCurrency.toUpperCase()}`}
            </span>
          </div>
          <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown */}
            <div className="absolute z-20 w-full mt-1 bg-white dark:bg-stone-700 border border-gray-300 dark:border-stone-600 rounded-lg shadow-lg max-h-60 overflow-auto">
              {currencies.map((currency) => (
                <button
                  key={currency.code}
                  type="button"
                  onClick={() => handleCurrencySelect(currency.code)}
                  className={`
                    w-full px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-stone-600 
                    flex items-center justify-between transition-colors
                    ${currency.code === selectedCurrency ? 'bg-primary/10 text-primary' : 'text-gray-900 dark:text-white'}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{currency.flag}</span>
                    <div>
                      <div className="font-medium">{currency.code.toUpperCase()}</div>
                      <div className="text-xs text-gray-500">
                        {currency.name}
                      </div>
                    </div>
                  </div>
                  {currency.code === selectedCurrency && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
      
      {!compact && (
        <div className="mt-1 text-xs text-gray-500">
          Selected: {selectedCurrency.toUpperCase()}
        </div>
      )}
    </div>
  );
};

export default LocalCurrencySelector;
