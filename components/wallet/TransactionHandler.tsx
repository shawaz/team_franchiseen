"use client";

import { useEffect } from 'react';
import { useTransactionWallet } from '@/hooks/useTransactionWallet';
import { useWallet } from '@solana/wallet-adapter-react';
import { toast } from 'sonner';

/**
 * Component to handle transaction-specific wallet returns
 * This should be included in pages where transactions occur
 */
export default function TransactionHandler() {
  const { checkTransactionReturn } = useTransactionWallet();
  const { connected, connect } = useWallet();

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    const handleTransactionReturn = async () => {
      try {
        // Check if user is returning from a transaction flow
        const transactionContext = checkTransactionReturn();
        
        if (!transactionContext || connected) {
          return;
        }

        console.log('User returned from transaction flow:', transactionContext.action);
        
        // Wait a bit for Phantom to be available
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Check if Phantom is now available
        const phantomSolana = (window as any).phantom?.solana;
        
        if (phantomSolana?.isPhantom) {
          try {
            // Try to connect directly to Phantom for the transaction
            const response = await phantomSolana.connect({ onlyIfTrusted: false });
            
            if (response?.publicKey) {
              console.log('Successfully connected for transaction:', response.publicKey.toString());
              toast.success(`Wallet connected for ${transactionContext.action.replace('_', ' ')}`);
              
              // Store successful connection
              localStorage.setItem('phantom_transaction_ready', JSON.stringify({
                publicKey: response.publicKey.toString(),
                timestamp: Date.now(),
                action: transactionContext.action
              }));
            }
          } catch (error: any) {
            console.log('Transaction connection failed:', error.message);
            
            // Try wallet adapter as fallback
            try {
              await connect();
              toast.success(`Wallet connected for ${transactionContext.action.replace('_', ' ')}`);
            } catch (adapterError: any) {
              console.log('Wallet adapter connection also failed:', adapterError.message);
              
              if (!adapterError.message?.includes('User rejected')) {
                toast.error('Failed to connect wallet for transaction');
              }
            }
          }
        } else {
          console.log('Phantom not detected after transaction return');
          toast.info('Please connect your wallet to complete the transaction');
        }
      } catch (error) {
        console.error('Error handling transaction return:', error);
      }
    };

    // Run the handler after a delay to ensure everything is loaded
    const timeoutId = setTimeout(handleTransactionReturn, 2000);

    return () => clearTimeout(timeoutId);
  }, [checkTransactionReturn, connected, connect]);

  // This component doesn't render anything
  return null;
}
