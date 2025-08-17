"use client";

import React, { createContext, useContext, ReactNode } from 'react';

/**
 * SOL-Only Context
 * 
 * This context provides SOL formatting utilities for the entire application.
 * All prices and amounts are displayed in SOL only, with no currency conversion.
 */

interface SolOnlyContextType {
  // SOL formatting
  formatSol: (amount: number) => string;
  formatSolInput: (amount: number) => string;
  
  // Currency info
  currency: {
    code: 'SOL';
    symbol: 'SOL';
    label: 'Solana';
  };
}

// Create context
const SolOnlyContext = createContext<SolOnlyContextType | undefined>(undefined);

// Provider component
export const SolOnlyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // SOL formatting functions
  const formatSol = (amount: number): string => {
    return `${amount.toFixed(4)} SOL`;
  };

  const formatSolInput = (amount: number): string => {
    return amount.toString();
  };

  const value: SolOnlyContextType = {
    formatSol,
    formatSolInput,
    currency: {
      code: 'SOL',
      symbol: 'SOL',
      label: 'Solana',
    },
  };

  return (
    <SolOnlyContext.Provider value={value}>
      {children}
    </SolOnlyContext.Provider>
  );
};

// Hook to use SOL context
export const useSolOnly = (): SolOnlyContextType => {
  const context = useContext(SolOnlyContext);
  if (!context) {
    throw new Error('useSolOnly must be used within a SolOnlyProvider');
  }
  return context;
};

// Export types
export type { SolOnlyContextType };
