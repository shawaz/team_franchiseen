"use client";

import React, { useMemo, useCallback } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork, WalletError } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';

// Import wallet adapter CSS
import '@solana/wallet-adapter-react-ui/styles.css';

interface SolanaWalletProviderProps {
  children: React.ReactNode;
}

export default function SolanaWalletProvider({ children }: SolanaWalletProviderProps) {
  // Get network from environment variables
  const network = (process.env.NEXT_PUBLIC_SOLANA_NETWORK as WalletAdapterNetwork) || WalletAdapterNetwork.Devnet;

  // Get RPC endpoint from environment or use default
  const endpoint = useMemo(() => {
    if (process.env.NEXT_PUBLIC_SOLANA_RPC_URL) {
      return process.env.NEXT_PUBLIC_SOLANA_RPC_URL;
    }
    return clusterApiUrl(network);
  }, [network]);

  // Detect if we're on mobile
  const isMobile = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }, []);

  // Configure wallets with proper mobile support
  const wallets = useMemo(() => {
    const phantomAdapter = new PhantomWalletAdapter();

    // Override the connect method for better mobile support
    if (isMobile) {
      const originalConnect = phantomAdapter.connect.bind(phantomAdapter);
      phantomAdapter.connect = async () => {
        try {
          // Check if Phantom is installed as an app
          const isPhantomInstalled = window.phantom?.solana?.isPhantom;

          if (!isPhantomInstalled) {
            // Create proper deep link for mobile
            const currentUrl = window.location.href;
            const dappUrl = window.location.origin;

            // Use the correct Phantom deep link format
            const deepLink = `https://phantom.app/ul/browse/${encodeURIComponent(currentUrl)}?ref=${encodeURIComponent(dappUrl)}`;

            // Store connection attempt for when user returns
            localStorage.setItem('phantom_connection_attempt', JSON.stringify({
              timestamp: Date.now(),
              url: currentUrl,
              dappUrl: dappUrl
            }));

            // Redirect to Phantom app
            window.location.href = deepLink;
            return;
          }

          // If Phantom is available, use normal connection
          return await originalConnect();
        } catch (error) {
          console.error('Phantom connection error:', error);
          throw error;
        }
      };
    }

    return [phantomAdapter];
  }, [isMobile]);

  // Handle wallet errors
  const onError = useCallback((error: WalletError) => {
    console.error('Wallet error:', error);

    // Handle specific mobile connection errors
    if (error.message?.includes('User rejected') && isMobile) {
      // User might have cancelled in Phantom app, clear connection attempt
      localStorage.removeItem('phantom_connection_attempt');
    }
  }, [isMobile]);

  // Don't auto-connect on mobile to avoid conflicts with deep linking
  const shouldAutoConnect = useMemo(() => {
    if (typeof window === 'undefined') return false;

    // Check if user is returning from Phantom app
    const connectionAttempt = localStorage.getItem('phantom_connection_attempt');
    if (connectionAttempt && isMobile) {
      try {
        const attempt = JSON.parse(connectionAttempt);
        const timeDiff = Date.now() - attempt.timestamp;

        // If less than 5 minutes ago, try to auto-connect
        if (timeDiff < 5 * 60 * 1000) {
          localStorage.removeItem('phantom_connection_attempt');
          return true;
        }
      } catch (e) {
        localStorage.removeItem('phantom_connection_attempt');
      }
    }

    // Auto-connect on desktop if previously connected
    return !isMobile;
  }, [isMobile]);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider
        wallets={wallets}
        autoConnect={shouldAutoConnect}
        onError={onError}
      >
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
