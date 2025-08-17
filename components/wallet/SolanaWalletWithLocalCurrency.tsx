"use client";

import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { CreditCard, Zap, ExternalLink, Wallet, Globe, RefreshCw } from 'lucide-react';
import { useSolana } from '@/hooks/useSolana';
import { useModal } from '@/contexts/ModalContext';
import { coinGeckoService, SUPPORTED_CURRENCIES, formatSol, formatLocalCurrency } from '@/lib/coingecko';

interface SolanaWalletWithLocalCurrencyProps {
  userName?: string;
  onAddMoney?: () => void;
  className?: string;
}

const SolanaWalletWithLocalCurrency: React.FC<SolanaWalletWithLocalCurrencyProps> = ({
  userName = "User",
  onAddMoney,
  className,
}) => {
  const { publicKey, connected, disconnect } = useWallet();
  const { setVisible } = useWalletModal();
  const { getSOLBalance, requestAirdrop, loading: solanaLoading } = useSolana();
  const { openSendSOLModal } = useModal();
  
  // State
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [localCurrency, setLocalCurrency] = useState<string>('usd');
  const [localPrice, setLocalPrice] = useState<number>(0);
  const [priceLoading, setPriceLoading] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Load SOL balance
  const refreshBalance = React.useCallback(async () => {
    if (connected && publicKey) {
      setLoading(true);
      try {
        const solBalance = await getSOLBalance();
        setBalance(solBalance);
      } catch (error) {
        console.error('Error fetching balance:', error);
      } finally {
        setLoading(false);
      }
    }
  }, [connected, publicKey, getSOLBalance]);

  // Load SOL price in local currency
  const refreshPrice = React.useCallback(async () => {
    setPriceLoading(true);
    try {
      const prices = await coinGeckoService.getSolPrices();
      const price = prices[localCurrency as keyof typeof prices];
      setLocalPrice(price || 0);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching SOL price:', error);
    } finally {
      setPriceLoading(false);
    }
  }, [localCurrency]);

  // Auto-detect local currency on mount
  useEffect(() => {
    const detectAndSetCurrency = async () => {
      try {
        const detectedCurrency = await coinGeckoService.detectLocalCurrency();
        setLocalCurrency(detectedCurrency);
      } catch {
        console.log('Using default currency (USD)');
      }
    };
    
    detectAndSetCurrency();
  }, []);

  // Load balance when wallet connects
  useEffect(() => {
    if (connected) {
      refreshBalance();
    } else {
      setBalance(0);
    }
  }, [connected, publicKey, refreshBalance]);

  // Load price when currency changes
  useEffect(() => {
    refreshPrice();
  }, [localCurrency, refreshPrice]);

  // Handle airdrop
  const handleAirdrop = async () => {
    if (!connected || !publicKey) return;
    
    setLoading(true);
    try {
      await requestAirdrop(1); // Request 1 SOL
      await refreshBalance(); // Refresh balance after airdrop
    } catch (error) {
      console.error('Airdrop failed:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get selected currency info
  const selectedCurrency = SUPPORTED_CURRENCIES.find(c => c.code === localCurrency);
  const localValue = balance * localPrice;

  return (
    <div className={`bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <Wallet className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Solana Wallet</h3>
            <p className="text-purple-100 text-sm">{userName}</p>
          </div>
        </div>
        
        {/* Currency Selector */}
        <div className="relative">
          <select
            value={localCurrency}
            onChange={(e) => setLocalCurrency(e.target.value)}
            className="bg-white/20 border border-white/30 rounded-lg px-3 py-1 text-sm text-white appearance-none cursor-pointer hover:bg-white/30 transition"
          >
            {SUPPORTED_CURRENCIES.map((currency) => (
              <option key={currency.code} value={currency.code} className="text-gray-900">
                {currency.flag} {currency.code.toUpperCase()}
              </option>
            ))}
          </select>
          <Globe className="absolute right-2 top-1/2 transform -translate-y-1/2 h-3 w-3 pointer-events-none" />
        </div>
      </div>

      {/* Wallet Status */}
      {!connected ? (
        <div className="text-center py-8">
          <div className="bg-white/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Wallet className="h-8 w-8" />
          </div>
          <h4 className="text-lg font-semibold mb-2">Connect Your Wallet</h4>
          <p className="text-purple-100 mb-4">Connect your Phantom wallet to view your SOL balance</p>
          <button
            onClick={() => setVisible(true)}
            className="bg-white text-purple-600 font-semibold px-6 py-2 rounded-lg hover:bg-purple-50 transition"
          >
            Connect Wallet
          </button>
        </div>
      ) : (
        <>
          {/* Balance Display */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-purple-100 text-sm">SOL Balance</span>
              <button
                onClick={refreshPrice}
                disabled={priceLoading}
                className="text-purple-100 hover:text-white transition"
              >
                <RefreshCw className={`h-4 w-4 ${priceLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>
            
            <div className="space-y-1">
              <div className="text-3xl font-bold">
                {loading ? '...' : formatSol(balance)}
              </div>
              
              {selectedCurrency && localPrice > 0 && (
                <div className="text-purple-100 text-lg">
                  ≈ {formatLocalCurrency(localValue, localCurrency)}
                </div>
              )}
              
              {lastUpdated && (
                <div className="text-purple-200 text-xs">
                  Updated: {lastUpdated.toLocaleTimeString()}
                </div>
              )}
            </div>
          </div>

          {/* Wallet Address */}
          <div className="mb-6 p-3 bg-white/10 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-xs mb-1">Wallet Address</p>
                <p className="font-mono text-sm">
                  {publicKey?.toString().slice(0, 8)}...{publicKey?.toString().slice(-8)}
                </p>
              </div>
              <a
                href={`https://explorer.solana.com/address/${publicKey?.toString()}?cluster=devnet`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-100 hover:text-white transition"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <button
              onClick={onAddMoney || handleAirdrop}
              disabled={loading || solanaLoading}
              className="bg-white/20 text-white font-semibold px-4 py-2 rounded-lg border border-white/30 hover:bg-white/30 transition flex items-center justify-center gap-2"
            >
              <Zap className="h-4 w-4" />
              {onAddMoney ? 'Add SOL' : 'Airdrop'}
            </button>
            
            <button
              onClick={() => openSendSOLModal({
                onSuccess: (signature) => {
                  console.log('SOL sent successfully:', signature);
                  refreshBalance();
                }
              })}
              className="bg-white/20 text-white font-semibold px-4 py-2 rounded-lg border border-white/30 hover:bg-white/30 transition flex items-center justify-center gap-2"
              disabled={!connected || balance === 0}
            >
              <CreditCard className="h-4 w-4" />
              Send SOL
            </button>
          </div>

          {/* Disconnect Button */}
          <button
            onClick={disconnect}
            className="w-full text-purple-100 hover:text-white text-sm transition"
          >
            Disconnect Wallet
          </button>
        </>
      )}
    </div>
  );
};

export default SolanaWalletWithLocalCurrency;
