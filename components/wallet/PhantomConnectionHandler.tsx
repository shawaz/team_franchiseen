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

        // If less than 10 minutes ago, try to establish connection
        if (timeDiff < 10 * 60 * 1000) {
          console.log('User returned from Phantom app, attempting connection...');

          // Clear the attempt first to avoid loops
          localStorage.removeItem('phantom_connection_attempt');

          // Wait a bit for Phantom to be available
          await new Promise(resolve => setTimeout(resolve, 1000));

          // Check if Phantom is now available
          const phantomSolana = (window as any).phantom?.solana;

          if (phantomSolana?.isPhantom) {
            try {
              // Try to connect directly to Phantom with user interaction
              const response = await phantomSolana.connect({ onlyIfTrusted: false });

              if (response?.publicKey) {
                console.log('Successfully connected to Phantom:', response.publicKey.toString());
                toast.success('Wallet connected successfully!');

                // Store connection state for future use
                localStorage.setItem('phantom_wallet_connected', JSON.stringify({
                  publicKey: response.publicKey.toString(),
                  timestamp: Date.now()
                }));
              }
            } catch (error: any) {
              console.log('Direct connection failed:', error.message);

              // Try wallet adapter as fallback
              if (wallet?.adapter.name === 'Phantom') {
                try {
                  await connect();
                  toast.success('Wallet connected successfully!');
                } catch (adapterError: any) {
                  console.log('Wallet adapter connection also failed:', adapterError.message);

                  if (!adapterError.message?.includes('User rejected')) {
                    toast.error('Failed to connect wallet. Please try again.');
                  }
                }
              }
            }
          } else {
            // Phantom not available yet, show helpful message
            console.log('Phantom not detected, user may need to try connecting again');
            toast.info('Please try connecting your wallet again');
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
    const timeoutId = setTimeout(handleConnectionReturn, 2000);

    return () => clearTimeout(timeoutId);
  }, [connect, connected, connecting, wallet]);

  // This component doesn't render anything
  return null;
}
