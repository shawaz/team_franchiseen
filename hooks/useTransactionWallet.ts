"use client";

import { useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { toast } from 'sonner';

interface TransactionWalletOptions {
  action: 'payment' | 'franchise_creation' | 'transaction';
  amount?: number;
  description?: string;
}

export const useTransactionWallet = () => {
  const { connected, connect, disconnect, publicKey, signTransaction, sendTransaction } = useWallet();

  // Connect wallet specifically for transactions
  const connectForTransaction = useCallback(async (options: TransactionWalletOptions) => {
    if (connected && publicKey) {
      return true; // Already connected
    }

    try {
      // Store transaction context for when user returns from Phantom
      localStorage.setItem('phantom_transaction_context', JSON.stringify({
        timestamp: Date.now(),
        action: options.action,
        amount: options.amount,
        description: options.description,
        url: window.location.href,
        dappUrl: window.location.origin
      }));

      // Check if Phantom is available in browser
      const phantomSolana = (window as any).phantom?.solana;
      
      if (phantomSolana?.isPhantom) {
        // Direct connection to Phantom
        const response = await phantomSolana.connect({ onlyIfTrusted: false });
        
        if (response?.publicKey) {
          toast.success('Wallet connected for transaction');
          return true;
        }
      } else {
        // Mobile deep link for transaction
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        if (isMobile) {
          const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
          const isAndroid = /Android/.test(navigator.userAgent);
          
          if (isIOS) {
            // iOS: Use app scheme for transaction
            const appScheme = `phantom://v1/connect?dapp_encryption_public_key=&cluster=devnet&app_url=${encodeURIComponent(window.location.origin)}`;
            window.location.href = appScheme;
          } else if (isAndroid) {
            // Android: Use intent for transaction
            const intentUrl = `intent://v1/connect?dapp_encryption_public_key=&cluster=devnet&app_url=${encodeURIComponent(window.location.origin)}#Intent;scheme=phantom;package=app.phantom;S.browser_fallback_url=https://play.google.com/store/apps/details?id=app.phantom;end`;
            window.location.href = intentUrl;
          }
          
          return false; // Will return from app
        } else {
          // Desktop: Try wallet adapter
          await connect();
          return connected;
        }
      }
    } catch (error: any) {
      console.error('Transaction wallet connection failed:', error);
      
      if (!error.message?.includes('User rejected')) {
        toast.error('Failed to connect wallet for transaction');
      }
      
      return false;
    }

    return false;
  }, [connected, publicKey, connect]);

  // Check if user returned from transaction flow
  const checkTransactionReturn = useCallback(() => {
    const transactionContext = localStorage.getItem('phantom_transaction_context');
    
    if (transactionContext) {
      try {
        const context = JSON.parse(transactionContext);
        const timeDiff = Date.now() - context.timestamp;
        
        // If less than 10 minutes ago, this might be a transaction return
        if (timeDiff < 10 * 60 * 1000) {
          localStorage.removeItem('phantom_transaction_context');
          return context;
        } else {
          localStorage.removeItem('phantom_transaction_context');
        }
      } catch (error) {
        localStorage.removeItem('phantom_transaction_context');
      }
    }
    
    return null;
  }, []);

  // Execute transaction with proper wallet handling
  const executeTransaction = useCallback(async (
    transactionCallback: () => Promise<any>,
    options: TransactionWalletOptions
  ) => {
    try {
      // Ensure wallet is connected
      const isConnected = await connectForTransaction(options);
      
      if (!isConnected) {
        throw new Error('Wallet connection required for transaction');
      }

      // Execute the transaction
      const result = await transactionCallback();
      
      toast.success(`${options.action.replace('_', ' ')} completed successfully`);
      return result;
    } catch (error: any) {
      console.error('Transaction execution failed:', error);
      
      if (error.message?.includes('User rejected')) {
        toast.error('Transaction cancelled by user');
      } else {
        toast.error(`Failed to complete ${options.action.replace('_', ' ')}`);
      }
      
      throw error;
    }
  }, [connectForTransaction]);

  return {
    connected,
    publicKey,
    connectForTransaction,
    checkTransactionReturn,
    executeTransaction,
    disconnect
  };
};
