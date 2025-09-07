"use client";

import { useCallback, useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

interface MobileWalletState {
  isMobile: boolean;
  isPhantomInstalled: boolean;
  connectionMethod: 'browser' | 'app' | 'qr' | 'auto' | null;
  isConnecting: boolean;
}

export const useMobileWallet = () => {
  const { connect, connected, connecting, wallet, select, wallets } = useWallet();
  const [state, setState] = useState<MobileWalletState>({
    isMobile: false,
    isPhantomInstalled: false,
    connectionMethod: null,
    isConnecting: false,
  });

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const isPhantomInstalled = !!(window as any).phantom?.solana?.isPhantom;
      
      setState(prev => ({
        ...prev,
        isMobile,
        isPhantomInstalled,
      }));
    };

    checkMobile();
    
    // Check again after a delay in case Phantom loads later
    const timer = setTimeout(checkMobile, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Enhanced mobile connection with better UX
  const connectMobileWallet = useCallback(async (method: 'browser' | 'app' | 'auto' = 'auto') => {
    setState(prev => ({ ...prev, isConnecting: true }));

    try {
      if (method === 'auto') {
        // Auto-detect best method
        if (state.isMobile) {
          if (state.isPhantomInstalled) {
            method = 'browser';
          } else {
            method = 'app';
          }
        } else {
          method = 'browser';
        }
      }

      setState(prev => ({ ...prev, connectionMethod: method }));

      if (method === 'browser') {
        // Check if we're on mobile and Phantom is available
        const phantomSolana = (window as any).phantom?.solana;

        if (phantomSolana?.isPhantom) {
          try {
            // Direct connection to Phantom
            const response = await phantomSolana.connect({ onlyIfTrusted: false });
            console.log('Connected to Phantom:', response.publicKey.toString());
          } catch (error: any) {
            console.error('Direct Phantom connection failed:', error);

            // If direct connection fails on mobile, try app method
            if (state.isMobile && error.message?.includes('User rejected')) {
              await connectViaApp();
              return;
            }
            throw error;
          }
        } else {
          // Fallback to wallet adapter for desktop or when Phantom not detected
          if (!wallet) {
            const phantomWallet = wallets.find(w => w.adapter.name === 'Phantom');
            if (phantomWallet) {
              select(phantomWallet.adapter.name);
              // Wait a bit for wallet selection to take effect
              await new Promise(resolve => setTimeout(resolve, 100));
            }
          }

          try {
            await connect();
          } catch (error: any) {
            console.error('Wallet adapter connection failed:', error);

            // On mobile, if wallet adapter fails, try app method
            if (state.isMobile) {
              await connectViaApp();
              return;
            }
            throw error;
          }
        }
      } else if (method === 'app') {
        // Use improved app connection
        await connectViaApp();
      }
    } catch (error) {
      console.error('Mobile wallet connection failed:', error);
      
      // If browser method fails on mobile, try app method
      if (method === 'browser' && state.isMobile) {
        try {
          await connectViaApp();
        } catch (appError) {
          console.error('App connection also failed:', appError);
          throw appError;
        }
      } else {
        throw error;
      }
    } finally {
      setState(prev => ({ ...prev, isConnecting: false }));
    }
  }, [state.isMobile, state.isPhantomInstalled, wallet, wallets, select, connect]);

  // Improved app connection method with proper Phantom deep linking (no webview)
  const connectViaApp = useCallback(async () => {
    const currentUrl = window.location.href;
    const dappUrl = window.location.origin;

    // Store connection attempt
    localStorage.setItem('phantom_connection_attempt', JSON.stringify({
      timestamp: Date.now(),
      url: currentUrl,
      dappUrl: dappUrl,
      method: 'app',
      action: 'connect'
    }));

    // Check if we can detect Phantom app installation
    const userAgent = navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(userAgent);
    const isAndroid = /Android/.test(userAgent);

    try {
      if (isIOS) {
        // For iOS, use proper app scheme for connection (not webview)
        const appScheme = `phantom://v1/connect?dapp_encryption_public_key=&cluster=devnet&app_url=${encodeURIComponent(dappUrl)}`;

        // Try to open the app directly
        window.location.href = appScheme;

        // Fallback to App Store after delay if app doesn't open
        setTimeout(() => {
          if (!document.hidden) {
            window.location.href = 'https://apps.apple.com/app/phantom-solana-wallet/id1598432977';
          }
        }, 2000);

        return;
      }

      if (isAndroid) {
        // For Android, use intent URL with proper connection scheme
        const intentUrl = `intent://v1/connect?dapp_encryption_public_key=&cluster=devnet&app_url=${encodeURIComponent(dappUrl)}#Intent;scheme=phantom;package=app.phantom;S.browser_fallback_url=https://play.google.com/store/apps/details?id=app.phantom;end`;
        window.location.href = intentUrl;
        return;
      }

      // Desktop fallback
      window.open('https://phantom.app/download', '_blank');

    } catch (error) {
      console.error('Error opening Phantom app:', error);

      // Final fallback - direct to download page
      window.open('https://phantom.app/download', '_blank');
    }
  }, []);

  // Check for returning connection
  useEffect(() => {
    const checkReturningConnection = () => {
      const connectionAttempt = localStorage.getItem('wallet_connection_attempt');
      if (connectionAttempt) {
        const attempt = JSON.parse(connectionAttempt);
        const timeDiff = Date.now() - attempt.timestamp;
        
        // If less than 5 minutes ago, try to connect
        if (timeDiff < 5 * 60 * 1000) {
          localStorage.removeItem('wallet_connection_attempt');
          
          // Try to connect automatically
          if ((window as any).phantom?.solana) {
            (window as any).phantom.solana.connect().catch(console.error);
          }
        }
      }
    };

    // Check on page load
    checkReturningConnection();

    // Also check when page becomes visible (user returns from app)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        setTimeout(checkReturningConnection, 1000);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Generate QR code data
  const getQRCodeData = useCallback(() => {
    const currentUrl = window.location.href;
    return {
      url: currentUrl,
      qrUrl: `https://phantom.app/ul/browse/${encodeURIComponent(currentUrl)}?ref=franchiseen`,
    };
  }, []);

  // Get connection instructions based on device
  const getConnectionInstructions = useCallback(() => {
    if (!state.isMobile) {
      return {
        primary: 'Install Phantom browser extension',
        secondary: 'Or scan QR code with Phantom mobile app',
        method: 'browser' as const,
      };
    }

    if (state.isPhantomInstalled) {
      return {
        primary: 'Connect with Phantom',
        secondary: 'Phantom is installed on this device',
        method: 'browser' as const,
      };
    }

    return {
      primary: 'Open in Phantom App',
      secondary: 'This will redirect to Phantom and return to this page',
      method: 'app' as const,
    };
  }, [state.isMobile, state.isPhantomInstalled]);

  return {
    // State
    ...state,
    connected,
    connecting: connecting || state.isConnecting,

    // Actions
    connectMobileWallet,
    connectViaApp,

    // Utilities
    getQRCodeData,
    getConnectionInstructions,
  };
};
