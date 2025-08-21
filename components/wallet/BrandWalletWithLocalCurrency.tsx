"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { CreditCard, Zap, Wallet, RefreshCw } from 'lucide-react';
import { useSolana } from '@/hooks/useSolana';
import { useModal } from '@/contexts/ModalContext';
import { formatSol } from '@/lib/coingecko';
import { useGlobalCurrency } from '@/contexts/GlobalCurrencyContext';

interface Business {
  _id: string;
  name: string;
  logoUrl?: string;
  industry?: { name: string } | null;
  category?: { name: string } | null;
}

interface BrandWalletWithLocalCurrencyProps {
  onAddMoney?: () => void;
  className?: string;
  business: Business;
}

const BrandWalletWithLocalCurrency: React.FC<BrandWalletWithLocalCurrencyProps> = ({
  onAddMoney,
  className,
  business,
}) => {
  const { publicKey, connected } = useWallet();
  const { setVisible } = useWalletModal();
  const { getSOLBalance, requestAirdrop, loading: solanaLoading } = useSolana();
  const { openSendSOLModal } = useModal();

  // State
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Use global currency context
  const { selectedCurrency, convertFromSOL, formatAmount, refreshRates, loading: currencyLoading } = useGlobalCurrency();

  // Fetch balance when wallet connects
  useEffect(() => {
    if (connected && publicKey) {
      fetchBalance();
    }
  }, [connected, publicKey]);

  const fetchBalance = async () => {
    if (!publicKey) return;

    setLoading(true);
    try {
      const solBalance = await getSOLBalance();
      setBalance(solBalance);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching balance:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    await refreshRates();
    if (connected && publicKey) {
      await fetchBalance();
    }
  };

  const handleAirdrop = async () => {
    if (!publicKey) return;

    try {
      await requestAirdrop(1);
      // Refresh balance after airdrop
      setTimeout(() => fetchBalance(), 2000);
    } catch (error) {
      console.error('Airdrop failed:', error);
    }
  };

  const handleSendSOL = () => {
    if (connected && publicKey) {
      openSendSOLModal();
    }
  };

  return (
    <div >
      <div className="p-3 sm:p-4 bg-white border border-gray-200 dark:border-stone-700">
         <div className="flex items-center gap-3">
            {/* Brand Logo */}
            <div className="w-10 h-10 rounded overflow-hidden bg-white/20 flex items-center justify-center">
              {business?.logoUrl ? (
                <Image
                  src={business.logoUrl}
                  alt="Brand Logo"
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-white font-semibold text-sm">
                  {business?.name?.charAt(0) || 'B'}
                </div>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-md">
                {business?.name || 'Brand'}
              </h3>
              {connected && publicKey && (
                <p className=" text-sm font-mono">
                  {publicKey.toString().slice(0, 4)}...{publicKey.toString().slice(-4)}
                </p>
              )}
            </div>
          </div>

      </div>
    <div className={`bg-gradient-to-br border border-gray-200 dark:border-stone-700 from-yellow-600 via-yellow-700 to-yellow-800 text-white overflow-hidden ${className}`}>
      {/* Header with Brand Logo and Controls */}
      <div className="p-3 sm:p-4">
        

        {/* Wallet Status */}
        {!connected ? (
          <div className="text-center py-4">
            <div className="bg-white/10 rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
              <Wallet className="h-6 w-6" />
            </div>
            <h4 className="text-sm font-semibold mb-2">Connect Your Wallet</h4>
            <p className="text-purple-100 text-xs mb-3">Connect your Phantom wallet to manage brand finances</p>
            <button
              onClick={() => setVisible(true)}
              className="bg-white text-purple-600 font-semibold px-4 py-2 rounded-lg hover:bg-purple-50 transition text-sm"
            >
              Connect Wallet
            </button>
          </div>
        ) : (
          <>
            {/* Balance Display - Split Layout */}
            <div className="mb-4">
              <div className="grid grid-cols-2 gap-4">
                {/* SOL Balance - Left */}
                <div>
                  <div className="text-purple-100 text-xs mb-1">SOL Balance</div>
                  <div className="text-xl sm:text-2xl font-bold">
                    {loading ? '...' : formatSol(balance)}
                  </div>
                  {lastUpdated && (
                    <div className="text-purple-200 text-xs mt-1">
                      Updated: {lastUpdated.toLocaleTimeString()}
                    </div>
                  )}
                </div>

                {/* Local Currency Balance - Right */}
                <div className="text-right">
                  <div className="text-purple-100 text-xs mb-1">
                    {selectedCurrency.toUpperCase()} Balance
                  </div>
                  <div className="text-xl sm:text-2xl font-bold">
                    {loading ? '...' : formatAmount(balance)}
                  </div>
                  <div className="text-purple-200 text-xs mt-1">
                    {convertFromSOL(1).toFixed(2)} {selectedCurrency.toUpperCase()}/SOL
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={handleAirdrop}
                disabled={solanaLoading}
                className="bg-white/20  border border-white/30 p-2 hover:bg-white/30 transition flex justify-center items-center gap-2 disabled:opacity-50"
              >
                <Zap className="h-4 w-4" />
                <span className="text-md font-medium">
                  {solanaLoading ? 'Loading...' : 'SWAP'}
                </span>
              </button>

              <button
                onClick={onAddMoney}
                className="bg-white/20 border border-white/30 p-2 hover:bg-white/30 transition flex justify-center items-center gap-4"
              >
                <CreditCard className="h-4 w-4" />
                <span className="text-md font-medium">BUY</span>
              </button>
              
              <button
                onClick={handleSendSOL}
                className="bg-white/20 border border-white/30 p-2 hover:bg-white/30 transition flex justify-center items-center gap-4"
              >
                <Zap className="h-4 w-4" />
                <span className="text-md font-medium">WITHDRAW</span>
              </button>
              
              
            </div>
          </>
        )}
      </div>
    </div>
    </div>
  );
};

export default BrandWalletWithLocalCurrency;
