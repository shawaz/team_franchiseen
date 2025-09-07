"use client";

import { useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { toast } from 'sonner';

/**
 * Component to handle Phantom wallet connection state when users return from the app
 * This should be included in the main layout or app component
 */
export default function PhantomConnectionHandler() {
  const { connect, connected, connecting, wallet } = useWallet();

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    const handleConnectionReturn = async () => {
      try {
        // Check if user is returning from Phantom app
        const connectionAttempt = localStorage.getItem('phantom_connection_attempt');
        
        if (!connectionAttempt || connected || connecting) {
          return;
        }

        const attempt = JSON.parse(connectionAttempt);
        const timeDiff = Date.now() - attempt.timestamp;
        
        // If less than 5 minutes ago, try to establish connection
        if (timeDiff < 5 * 60 * 1000) {
          console.log('User returned from Phantom app, attempting connection...');
          
          // Clear the attempt first to avoid loops
          localStorage.removeItem('phantom_connection_attempt');
          
          // Check if Phantom is now available
          const phantomSolana = (window as any).phantom?.solana;
          
          if (phantomSolana?.isPhantom) {
            try {
              // Try to connect directly to Phantom
              const response = await phantomSolana.connect({ onlyIfTrusted: true });
              
              if (response?.publicKey) {
                console.log('Successfully connected to Phantom:', response.publicKey.toString());
                toast.success('Successfully connected to Phantom wallet!');
              }
            } catch (error: any) {
              console.log('Auto-connection failed, user needs to manually connect:', error.message);
              
              // Don't show error toast for user rejection, as this is expected behavior
              if (!error.message?.includes('User rejected')) {
                toast.error('Failed to connect to Phantom wallet');
              }
            }
          } else {
            // If Phantom still not available, try wallet adapter
            try {
              if (wallet?.adapter.name === 'Phantom') {
                await connect();
                toast.success('Successfully connected to Phantom wallet!');
              }
            } catch (error: any) {
              console.log('Wallet adapter connection failed:', error.message);
              
              if (!error.message?.includes('User rejected')) {
                toast.error('Failed to connect to wallet');
              }
            }
          }
        } else {
          // Clean up old connection attempts
          localStorage.removeItem('phantom_connection_attempt');
        }
      } catch (error) {
        console.error('Error handling connection return:', error);
        localStorage.removeItem('phantom_connection_attempt');
      }
    };

    // Run the handler after a short delay to ensure everything is loaded
    const timeoutId = setTimeout(handleConnectionReturn, 1000);

    return () => clearTimeout(timeoutId);
  }, [connect, connected, connecting, wallet]);

  // This component doesn't render anything
  return null;
}
