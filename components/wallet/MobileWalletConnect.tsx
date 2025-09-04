"use client";

import React, { useCallback, useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Button } from '@/components/ui/button';
import { Wallet, Smartphone, ExternalLink } from 'lucide-react';

// Extend Window interface for Phantom
declare global {
  interface Window {
    phantom?: {
      solana?: {
        isPhantom?: boolean;
      };
    };
  }
}

interface MobileWalletConnectProps {
  className?: string;
}

const MobileWalletConnect: React.FC<MobileWalletConnectProps> = ({ className }) => {
  const { connect, connected, connecting, wallet, wallets, select } = useWallet();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect mobile device
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor;
      const isMobileDevice = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
      setIsMobile(isMobileDevice);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleMobileConnect = useCallback(async () => {
    if (!isMobile) {
      // Desktop: use normal wallet adapter flow
      if (!wallet) {
        const phantomWallet = wallets.find(w => w.adapter.name === 'Phantom');
        if (phantomWallet) {
          select(phantomWallet.adapter.name);
        }
      }
      try {
        await connect();
      } catch (error) {
        console.error('Wallet connection failed:', error);
      }
      return;
    }

    // Mobile: use deep link approach
    const isPhantomInstalled = () => {
      return window.phantom?.solana?.isPhantom;
    };

    if (isPhantomInstalled()) {
      // Phantom is installed, try to connect
      try {
        if (!wallet) {
          const phantomWallet = wallets.find(w => w.adapter.name === 'Phantom');
          if (phantomWallet) {
            select(phantomWallet.adapter.name);
          }
        }
        await connect();
      } catch (error) {
        console.error('Mobile wallet connection failed:', error);
        // Fallback to deep link
        openPhantomDeepLink();
      }
    } else {
      // Phantom not installed, redirect to app store or use deep link
      openPhantomDeepLink();
    }
  }, [isMobile, wallet, wallets, select, connect]);

  const openPhantomDeepLink = () => {
    const currentUrl = encodeURIComponent(window.location.href);
    const deepLink = `https://phantom.app/ul/browse/${currentUrl}?ref=franchiseen`;
    
    // Try to open deep link
    window.open(deepLink, '_blank');
    
    // Fallback: redirect to Phantom website after a delay
    setTimeout(() => {
      if (!connected) {
        window.open('https://phantom.app/download', '_blank');
      }
    }, 2000);
  };

  if (connected) {
    return null; // Don't show if already connected
  }

  return (
    <div className={className}>
      {isMobile ? (
        <div className="space-y-3">
          <Button
            onClick={handleMobileConnect}
            disabled={connecting}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
          >
            <Smartphone className="w-4 h-4" />
            {connecting ? 'Connecting...' : 'Connect Phantom Wallet'}
          </Button>
          
          <div className="text-xs text-gray-500 text-center">
            <p>On mobile? This will open Phantom app</p>
            <button
              onClick={openPhantomDeepLink}
              className="text-purple-600 hover:text-purple-700 underline inline-flex items-center gap-1 mt-1"
            >
              Don't have Phantom? Download it
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      ) : (
        <Button
          onClick={handleMobileConnect}
          disabled={connecting}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
        >
          <Wallet className="w-4 h-4" />
          {connecting ? 'Connecting...' : 'Connect Phantom Wallet'}
        </Button>
      )}
    </div>
  );
};

export default MobileWalletConnect;
