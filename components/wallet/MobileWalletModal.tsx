"use client";

import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Wallet, Smartphone, QrCode, ExternalLink, Copy, CheckCircle } from 'lucide-react';
import WalletQRCode from './WalletQRCode';

interface MobileWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileWalletModal: React.FC<MobileWalletModalProps> = ({ isOpen, onClose }) => {
  const { connect, connected, connecting } = useWallet();
  const [connectionMethod, setConnectionMethod] = useState<'choose' | 'app' | 'qr' | 'browser'>('choose');
  const [copied, setCopied] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
  }, []);

  useEffect(() => {
    if (connected) {
      onClose();
    }
  }, [connected, onClose]);

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handlePhantomApp = () => {
    const dappUrl = window.location.origin;

    // Store connection attempt for when user returns
    localStorage.setItem('phantom_connection_attempt', JSON.stringify({
      timestamp: Date.now(),
      url: currentUrl,
      dappUrl: dappUrl,
      method: 'modal',
      action: 'connect'
    }));

    // Use proper deep link to Phantom app (not webview)
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);

    if (isIOS) {
      // iOS: Use app scheme for direct connection
      const appScheme = `phantom://v1/connect?dapp_encryption_public_key=&cluster=devnet&app_url=${encodeURIComponent(dappUrl)}`;
      window.location.href = appScheme;

      // Fallback to App Store after delay
      setTimeout(() => {
        if (!document.hidden) {
          window.location.href = 'https://apps.apple.com/app/phantom-solana-wallet/id1598432977';
        }
      }, 2000);
    } else if (isAndroid) {
      // Android: Use intent with proper connection scheme
      const intentUrl = `intent://v1/connect?dapp_encryption_public_key=&cluster=devnet&app_url=${encodeURIComponent(dappUrl)}#Intent;scheme=phantom;package=app.phantom;S.browser_fallback_url=https://play.google.com/store/apps/details?id=app.phantom;end`;
      window.location.href = intentUrl;
    } else {
      // Desktop fallback
      window.open('https://phantom.app/download', '_blank');
    }
  };

  const handleBrowserWallet = async () => {
    try {
      await connect();
    } catch (error) {
      console.error('Browser wallet connection failed:', error);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const renderChooseMethod = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <Wallet className="w-12 h-12 mx-auto mb-3 text-purple-600" />
        <h3 className="text-lg font-semibold mb-2">Connect Your Wallet</h3>
        <p className="text-gray-600 text-sm">Choose how you'd like to connect your Phantom wallet</p>
      </div>

      <div className="space-y-3">
        {isMobile && (
          <Button
            onClick={() => setConnectionMethod('app')}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-3 p-4 h-auto"
          >
            <Smartphone className="w-5 h-5" />
            <div className="text-left">
              <div className="font-semibold">Phantom Mobile App</div>
              <div className="text-xs opacity-90">Recommended for mobile users</div>
            </div>
          </Button>
        )}

        <Button
          onClick={handleBrowserWallet}
          disabled={connecting}
          variant="outline"
          className="w-full flex items-center gap-3 p-4 h-auto"
        >
          <Wallet className="w-5 h-5" />
          <div className="text-left">
            <div className="font-semibold">
              {connecting ? 'Connecting...' : 'Browser Extension'}
            </div>
            <div className="text-xs text-gray-600">Use Phantom browser extension</div>
          </div>
        </Button>

        <Button
          onClick={() => setConnectionMethod('qr')}
          variant="outline"
          className="w-full flex items-center gap-3 p-4 h-auto"
        >
          <QrCode className="w-5 h-5" />
          <div className="text-left">
            <div className="font-semibold">QR Code</div>
            <div className="text-xs text-gray-600">Scan with Phantom app</div>
          </div>
        </Button>
      </div>

      <div className="text-center pt-4 border-t">
        <p className="text-xs text-gray-500 mb-2">Don't have Phantom wallet?</p>
        <Button
          onClick={() => window.open('https://phantom.app/download', '_blank')}
          variant="ghost"
          size="sm"
          className="text-purple-600 hover:text-purple-700"
        >
          Download Phantom <ExternalLink className="w-3 h-3 ml-1" />
        </Button>
      </div>
    </div>
  );

  const renderAppMethod = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <Smartphone className="w-12 h-12 mx-auto mb-3 text-purple-600" />
        <h3 className="text-lg font-semibold mb-2">Open in Phantom App</h3>
        <p className="text-gray-600 text-sm">This will open Phantom app and return you to this page</p>
      </div>

      <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
        <div className="flex items-start gap-3">
          <div className="bg-purple-100 dark:bg-purple-800 rounded-full p-1 mt-1">
            <CheckCircle className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-sm">
            <p className="font-medium mb-1">Better Mobile Experience</p>
            <p className="text-gray-600">This method keeps you in your mobile browser instead of Phantom's in-app browser.</p>
          </div>
        </div>
      </div>

      <Button
        onClick={handlePhantomApp}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white"
      >
        Open Phantom App
      </Button>

      <Button
        onClick={() => setConnectionMethod('choose')}
        variant="ghost"
        className="w-full"
      >
        Back to options
      </Button>
    </div>
  );

  const renderQRMethod = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <QrCode className="w-12 h-12 mx-auto mb-3 text-purple-600" />
        <h3 className="text-lg font-semibold mb-2">Scan QR Code</h3>
        <p className="text-gray-600 text-sm">Open Phantom app and scan this QR code</p>
      </div>

      <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg text-center">
        <div className="flex justify-center mb-4">
          <WalletQRCode
            url={currentUrl}
            size={200}
            className="border border-gray-200 rounded-lg"
          />
        </div>
        
        <div className="text-sm text-gray-600 mb-3">
          Or copy this link to open in Phantom:
        </div>

        <div className="flex items-center gap-2 bg-white dark:bg-gray-700 p-2 rounded border">
          <input
            type="text"
            value={`https://phantom.app/ul/browse/${encodeURIComponent(currentUrl)}?ref=${encodeURIComponent(window.location.origin)}`}
            readOnly
            className="flex-1 bg-transparent text-xs"
          />
          <Button
            onClick={() => copyToClipboard(`https://phantom.app/ul/browse/${encodeURIComponent(currentUrl)}?ref=${encodeURIComponent(window.location.origin)}`)}
            size="sm"
            variant="ghost"
            className="p-1"
          >
            {copied ? <CheckCircle className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      <Button
        onClick={() => setConnectionMethod('choose')}
        variant="ghost"
        className="w-full"
      >
        Back to options
      </Button>
    </div>
  );

  const getContent = () => {
    switch (connectionMethod) {
      case 'app':
        return renderAppMethod();
      case 'qr':
        return renderQRMethod();
      default:
        return renderChooseMethod();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="sr-only">Connect Wallet</DialogTitle>
        </DialogHeader>
        {getContent()}
      </DialogContent>
    </Dialog>
  );
};

export default MobileWalletModal;
