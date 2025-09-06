"use client";

import { useCallback, useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

interface MobileWalletState {
  isMobile: boolean;
  isPhantomInstalled: boolean;
  connectionMethod: 'browser' | 'app' | 'qr' | null;
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
        // Try browser extension first
        if ((window as any).phantom?.solana) {
          await (window as any).phantom.solana.connect();
        } else {
          // Fallback to wallet adapter
          if (!wallet) {
            const phantomWallet = wallets.find(w => w.adapter.name === 'Phantom');
            if (phantomWallet) {
              select(phantomWallet.adapter.name);
            }
          }
          await connect();
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

  // Improved app connection method
  const connectViaApp = useCallback(async () => {
    const currentUrl = window.location.href;
    
    // Store connection attempt
    localStorage.setItem('wallet_connection_attempt', JSON.stringify({
      timestamp: Date.now(),
      url: currentUrl,
      method: 'app'
    }));

    // Method 1: Try universal link that returns to browser
    const universalLink = `phantom://connect?dapp=${encodeURIComponent(window.location.origin)}&redirect=${encodeURIComponent(currentUrl)}`;
    
    // For iOS, try the universal link first
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
      window.location.href = universalLink;
      return;
    }

    // For Android, use intent URL
    if (/Android/.test(navigator.userAgent)) {
      const intentUrl = `intent://connect?dapp=${encodeURIComponent(window.location.origin)}&redirect=${encodeURIComponent(currentUrl)}#Intent;scheme=phantom;package=app.phantom;end`;
      window.location.href = intentUrl;
      return;
    }

    // Fallback: use the web URL but with better parameters
    const webUrl = `https://phantom.app/ul/browse/${encodeURIComponent(currentUrl)}?ref=franchiseen&connect=true`;
    window.location.href = webUrl;
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
