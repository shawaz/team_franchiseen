"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Wallet, Smartphone, ExternalLink } from 'lucide-react';
import { useMobileWallet } from '@/hooks/useMobileWallet';
import MobileWalletModal from './MobileWalletModal';

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
  const {
    connected,
    connecting,
    isMobile,
    connectMobileWallet,
    getConnectionInstructions
  } = useMobileWallet();
  const [showModal, setShowModal] = useState(false);

  const instructions = getConnectionInstructions();

  const handleConnect = async () => {
    if (isMobile) {
      setShowModal(true);
    } else {
      try {
        await connectMobileWallet('browser');
      } catch (error) {
        console.error('Wallet connection failed:', error);
        setShowModal(true); // Show modal as fallback
      }
    }
  };

  const handleQuickConnect = async () => {
    try {
      await connectMobileWallet('auto');
    } catch (error) {
      console.error('Quick connect failed:', error);
    }
  };

  if (connected) {
    return null; // Don't show if already connected
  }

  return (
    <>
      <div className={className}>
        {isMobile ? (
          <div className="space-y-3">
            <Button
              onClick={handleConnect}
              disabled={connecting}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
            >
              <Smartphone className="w-4 h-4" />
              {connecting ? 'Connecting...' : instructions.primary}
            </Button>

            <div className="text-xs text-gray-500 text-center">
              <p>Connect once, use everywhere</p>
              <p className="mt-1 text-gray-400">Phantom will only open for payments</p>
              <div className="mt-2">
                <button
                  onClick={handleQuickConnect}
                  className="text-purple-600 hover:text-purple-700 underline inline-flex items-center gap-1"
                >
                  Quick Connect
                </button>
                <span className="mx-2">•</span>
                <button
                  onClick={() => window.open('https://phantom.app/download', '_blank')}
                  className="text-purple-600 hover:text-purple-700 underline inline-flex items-center gap-1"
                >
                  Get Phantom
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <Button
            onClick={handleConnect}
            disabled={connecting}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
          >
            <Wallet className="w-4 h-4" />
            {connecting ? 'Connecting...' : instructions.primary}
          </Button>
        )}
      </div>

      <MobileWalletModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
};

export default MobileWalletConnect;
