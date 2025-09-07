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

  // Configure wallets with proper mobile deep link support
  const wallets = useMemo(() => {
    const phantomAdapter = new PhantomWalletAdapter();

    // Override the connect method for mobile deep linking
    if (isMobile) {
      const originalConnect = phantomAdapter.connect.bind(phantomAdapter);
      phantomAdapter.connect = async () => {
        try {
          // Check if Phantom is installed as an app
          const isPhantomInstalled = window.phantom?.solana?.isPhantom;

          if (!isPhantomInstalled) {
            // Store connection attempt for when user returns
            localStorage.setItem('phantom_connection_attempt', JSON.stringify({
              timestamp: Date.now(),
              url: window.location.href,
              dappUrl: window.location.origin,
              action: 'connect'
            }));

            // Use proper deep link to Phantom app (not webview)
            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
            const isAndroid = /Android/.test(navigator.userAgent);

            if (isIOS) {
              // iOS: Try app scheme first, fallback to App Store
              const appScheme = `phantom://v1/connect?dapp_encryption_public_key=&cluster=devnet&app_url=${encodeURIComponent(window.location.origin)}`;

              // Try to open the app
              window.location.href = appScheme;

              // Fallback to App Store after delay if app doesn't open
              setTimeout(() => {
                if (!document.hidden) {
                  window.location.href = 'https://apps.apple.com/app/phantom-solana-wallet/id1598432977';
                }
              }, 2000);
            } else if (isAndroid) {
              // Android: Use intent with fallback to Play Store
              const intentUrl = `intent://v1/connect?dapp_encryption_public_key=&cluster=devnet&app_url=${encodeURIComponent(window.location.origin)}#Intent;scheme=phantom;package=app.phantom;S.browser_fallback_url=https://play.google.com/store/apps/details?id=app.phantom;end`;
              window.location.href = intentUrl;
            } else {
              // Desktop or unknown mobile - redirect to download page
              window.open('https://phantom.app/download', '_blank');
            }

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

  // Smart auto-connect logic - only when appropriate
  const shouldAutoConnect = useMemo(() => {
    if (typeof window === 'undefined') return false;

    // Check if user is returning from Phantom app for connection
    const connectionAttempt = localStorage.getItem('phantom_connection_attempt');
    if (connectionAttempt) {
      try {
        const attempt = JSON.parse(connectionAttempt);
        const timeDiff = Date.now() - attempt.timestamp;

        // If less than 10 minutes ago and it's a connection attempt, try to auto-connect
        if (timeDiff < 10 * 60 * 1000 && attempt.action === 'connect') {
          return true;
        } else {
          // Clean up old attempts
          localStorage.removeItem('phantom_connection_attempt');
        }
      } catch (e) {
        localStorage.removeItem('phantom_connection_attempt');
      }
    }

    // Check if user is returning from transaction flow
    const transactionContext = localStorage.getItem('phantom_transaction_context');
    if (transactionContext) {
      try {
        const context = JSON.parse(transactionContext);
        const timeDiff = Date.now() - context.timestamp;

        // If less than 10 minutes ago, try to auto-connect for transaction
        if (timeDiff < 10 * 60 * 1000) {
          return true;
        } else {
          localStorage.removeItem('phantom_transaction_context');
        }
      } catch (e) {
        localStorage.removeItem('phantom_transaction_context');
      }
    }

    // Check if wallet was previously connected (desktop only)
    if (!isMobile) {
      const wasConnected = localStorage.getItem('phantom_wallet_connected');
      if (wasConnected) {
        try {
          const connection = JSON.parse(wasConnected);
          const timeDiff = Date.now() - connection.timestamp;

          // If connected within last 24 hours, auto-connect
          return timeDiff < 24 * 60 * 60 * 1000;
        } catch (e) {
          localStorage.removeItem('phantom_wallet_connected');
        }
      }
    }

    return false;
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
