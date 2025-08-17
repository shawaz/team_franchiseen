"use client";

import React, { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { CreditCard, Zap, ExternalLink, Wallet } from 'lucide-react';
import { useSolana } from '@/hooks/useSolana';
import { useModal } from '@/contexts/ModalContext';

interface SolanaWalletCardProps {
  userName?: string;
  onAddMoney?: () => void;
  className?: string;
}

const SolanaWalletCard: React.FC<SolanaWalletCardProps> = ({
  userName = "User",
  onAddMoney,
  className,
}) => {
  const { publicKey, connected, disconnect } = useWallet();
  const { setVisible } = useWalletModal();
  const { getSOLBalance, requestAirdrop, loading: solanaLoading } = useSolana();
  const { openSendSOLModal } = useModal();
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  // Load balance when wallet connects
  useEffect(() => {
    const loadBalance = async () => {
      if (connected && publicKey) {
        setLoading(true);
        try {
          const solBalance = await getSOLBalance();
          setBalance(solBalance);
        } catch (error) {
          console.error('Error loading SOL balance:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setBalance(0);
      }
    };

    loadBalance();
  }, [connected, publicKey, getSOLBalance]);

  // Format address for display
  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  // Open Solana explorer
  const openInExplorer = () => {
    if (publicKey) {
      const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet';
      const baseUrl = network === 'mainnet-beta' 
        ? 'https://explorer.solana.com' 
        : `https://explorer.solana.com?cluster=${network}`;
      window.open(`${baseUrl}/address/${publicKey.toString()}`, '_blank');
    }
  };

  // Refresh balance
  const refreshBalance = async () => {
    if (connected && publicKey) {
      setLoading(true);
      try {
        const solBalance = await getSOLBalance();
        setBalance(solBalance);
      } catch (error) {
        console.error('Error refreshing SOL balance:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle SOL airdrop
  const handleAirdrop = async () => {
    const result = await requestAirdrop(1); // Request 1 SOL
    if (result.success) {
      alert('SOL airdrop successful! Check your balance.');
      // Refresh balance
      await refreshBalance();
    } else {
      alert(`SOL airdrop failed: ${result.error}`);
    }
  };

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 p-6 text-white shadow-xl ${className}`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10"></div>
      <div className="absolute -bottom-6 -left-6 h-32 w-32 rounded-full bg-white/5"></div>
      
      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-white/20 p-2">
              <CreditCard className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Solana Wallet</h3>
              <p className="text-sm opacity-80">{userName}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">
              {loading ? '...' : balance.toFixed(4)} SOL
            </div>
            <div className="text-xs opacity-70">
              ≈ ${(balance * 20).toFixed(2)} USD
            </div>
          </div>
        </div>

        {/* Wallet Address */}
        {connected && publicKey && (
          <div className="flex items-center gap-2 mb-6">
            <div className="text-sm opacity-70">
              {formatAddress(publicKey.toString())}
            </div>
            <button
              onClick={openInExplorer}
              className="text-white/70 hover:text-white transition-colors"
              title="View in Solana Explorer"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Connection Status & Actions */}
        {!connected ? (
          <div className="text-center">
            <p className="text-sm opacity-80 mb-4">Connect your Phantom wallet to view SOL balance</p>
            <button
              onClick={() => setVisible(true)}
              className="bg-white/90 text-purple-700 font-semibold px-6 py-3 rounded-lg shadow hover:bg-white transition flex items-center justify-center gap-2 w-full"
            >
              <Wallet className="w-5 h-5" />
              Connect Wallet
            </button>
            <div className="text-xs opacity-60 mt-3">
              Solana (SOL) is used for all transactions and franchise investments
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-end justify-between gap-3">
              <button
                onClick={onAddMoney}
                className="bg-white/90 text-purple-700 font-semibold px-4 py-2 rounded-lg shadow hover:bg-white transition flex-1"
                disabled={!connected}
              >
                Add SOL
              </button>
              <button
                onClick={() => openSendSOLModal({
                  onSuccess: (signature) => {
                    console.log('SOL sent successfully:', signature);
                    refreshBalance(); // Refresh balance after successful send
                  }
                })}
                className="bg-white/20 text-white font-semibold px-4 py-2 rounded-lg border border-white/30 hover:bg-white/30 transition flex-1"
                disabled={!connected || balance === 0}
              >
                Send SOL
              </button>
            </div>
            
            {/* Devnet Airdrop Button */}
            {process.env.NEXT_PUBLIC_SOLANA_NETWORK !== 'mainnet-beta' && (
              <button
                onClick={handleAirdrop}
                className="bg-yellow-500/20 text-white font-semibold px-4 py-2 rounded-lg border border-yellow-400/30 hover:bg-yellow-500/30 transition flex items-center justify-center gap-2 w-full"
                disabled={!connected || solanaLoading}
              >
                <Zap className="w-4 h-4" />
                {solanaLoading ? 'Requesting...' : 'Request 1 SOL (Devnet)'}
              </button>
            )}
            
            <button
              onClick={refreshBalance}
              className="w-full bg-white/10 text-white font-semibold px-4 py-2 rounded-lg border border-white/20 hover:bg-white/20 transition"
              disabled={loading}
            >
              {loading ? 'Refreshing...' : 'Refresh Balance'}
            </button>
            
            <button
              onClick={disconnect}
              className="w-full bg-red-500/20 text-white font-semibold px-4 py-2 rounded-lg border border-red-400/30 hover:bg-red-500/30 transition"
            >
              Disconnect Wallet
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SolanaWalletCard;
