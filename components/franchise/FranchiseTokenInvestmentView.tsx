"use client";

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Coins, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Target,
  Shield,
  Info
} from 'lucide-react';
import { Id } from '@/convex/_generated/dataModel';
import { useGlobalCurrency } from '@/contexts/GlobalCurrencyContext';
import { useGillFranchiseToken } from '@/hooks/useGillFranchiseToken';
import { toast } from 'sonner';

interface Franchise {
  _id: Id<"franchise">;
  businessId: Id<"businesses">;
  owner_id: Id<"users">;
  locationAddress: string;
  building: string;
  carpetArea: number;
  costPerArea: number;
  totalInvestment: number;
  totalShares: number;
  selectedShares: number;
  createdAt: number;
  status: string;
  slug?: string;
  tokenMint?: string;
}

interface Business {
  _id: Id<"businesses">;
  name: string;
  logoUrl?: string;
  industry?: { name: string } | null;
  category?: { name: string } | null;
}

interface FranchiseTokenInvestmentViewProps {
  franchise: Franchise;
  business: Business;
}

export default function FranchiseTokenInvestmentView({ 
  franchise, 
  business 
}: FranchiseTokenInvestmentViewProps) {
  const { formatAmount } = useGlobalCurrency();
  const { 
    buyFranchiseShares, 
    getFranchiseTokenData, 
    connected, 
    loading 
  } = useGillFranchiseToken();

  const [sharesToBuy, setSharesToBuy] = useState(1);
  const [tokenData, setTokenData] = useState<any>(null);
  const [loadingTokenData, setLoadingTokenData] = useState(false);

  // Load token data
  useEffect(() => {
    if (franchise.tokenMint && connected) {
      loadTokenData();
    }
  }, [franchise.tokenMint, connected]);

  const loadTokenData = async () => {
    if (!franchise.slug) return;
    
    setLoadingTokenData(true);
    try {
      const data = await getFranchiseTokenData(franchise.slug);
      setTokenData(data);
    } catch (error) {
      console.error('Error loading token data:', error);
    } finally {
      setLoadingTokenData(false);
    }
  };

  const handleBuyShares = async () => {
    if (!connected) {
      toast.error('Please connect your wallet to buy shares');
      return;
    }

    if (!franchise.slug) {
      toast.error('Franchise slug not found');
      return;
    }

    if (sharesToBuy <= 0) {
      toast.error('Please enter a valid number of shares');
      return;
    }

    try {
      const pricePerShare = franchise.totalInvestment / franchise.totalShares;
      await buyFranchiseShares(franchise.slug, sharesToBuy, pricePerShare);
      
      // Reload token data after purchase
      await loadTokenData();
      setSharesToBuy(1);
    } catch (error) {
      console.error('Error buying shares:', error);
    }
  };

  const sharePrice = franchise.totalInvestment / franchise.totalShares;
  const totalCost = sharePrice * sharesToBuy;
  const availableShares = tokenData ? 
    tokenData.totalSupply - tokenData.circulatingSupply : 
    franchise.totalShares - franchise.selectedShares;

  const fundingProgress = tokenData ? 
    (tokenData.circulatingSupply / tokenData.totalSupply) * 100 : 
    (franchise.selectedShares / franchise.totalShares) * 100;

  return (
    <div className="space-y-6">
      {/* Token Overview */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-yellow-100 rounded-full">
              <Coins className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{business.name} Token</h2>
              <p className="text-stone-600 dark:text-stone-400">
                {franchise.building} • {franchise.locationAddress}
              </p>
            </div>
          </div>
          <Badge 
            variant={franchise.status === 'Approved' ? 'default' : 'secondary'}
            className={franchise.status === 'Approved' ? 'bg-green-100 text-green-800' : ''}
          >
            {franchise.status}
          </Badge>
        </div>

        {/* Token Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-stone-50 dark:bg-stone-800 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {franchise.totalShares.toLocaleString()}
            </div>
            <div className="text-sm text-stone-600 dark:text-stone-400">Total Shares</div>
          </div>
          
          <div className="text-center p-4 bg-stone-50 dark:bg-stone-800 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {tokenData ? tokenData.circulatingSupply.toLocaleString() : franchise.selectedShares.toLocaleString()}
            </div>
            <div className="text-sm text-stone-600 dark:text-stone-400">Shares Sold</div>
          </div>
          
          <div className="text-center p-4 bg-stone-50 dark:bg-stone-800 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {formatAmount(sharePrice)}
            </div>
            <div className="text-sm text-stone-600 dark:text-stone-400">Price per Share</div>
          </div>
          
          <div className="text-center p-4 bg-stone-50 dark:bg-stone-800 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">
              {availableShares.toLocaleString()}
            </div>
            <div className="text-sm text-stone-600 dark:text-stone-400">Available</div>
          </div>
        </div>

        {/* Funding Progress */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Funding Progress</span>
            <span className="text-sm text-stone-600 dark:text-stone-400">
              {fundingProgress.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-stone-200 dark:bg-stone-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(fundingProgress, 100)}%` }}
            />
          </div>
        </div>

        {/* Investment Section */}
        {franchise.status === 'Approved' && (
          <div className="border-t border-stone-200 dark:border-stone-700 pt-6">
            <h3 className="text-lg font-semibold mb-4">Invest in This Franchise</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Investment Calculator */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Number of Shares
                  </label>
                  <Input
                    type="number"
                    min="1"
                    max={availableShares}
                    value={sharesToBuy}
                    onChange={(e) => setSharesToBuy(parseInt(e.target.value) || 1)}
                    className="w-full"
                  />
                  <p className="text-xs text-stone-500 mt-1">
                    Max: {availableShares.toLocaleString()} shares available
                  </p>
                </div>

                <div className="p-4 bg-stone-50 dark:bg-stone-800 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm">Share Price:</span>
                    <span className="font-semibold">{formatAmount(sharePrice)}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm">Quantity:</span>
                    <span className="font-semibold">{sharesToBuy}</span>
                  </div>
                  <div className="border-t border-stone-200 dark:border-stone-600 pt-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Total Cost:</span>
                      <span className="text-lg font-bold text-green-600">
                        {formatAmount(totalCost)}
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleBuyShares}
                  disabled={loading || !connected || sharesToBuy <= 0 || sharesToBuy > availableShares}
                  className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Wallet className="w-4 h-4 mr-2" />
                      Buy {sharesToBuy} Share{sharesToBuy !== 1 ? 's' : ''}
                    </>
                  )}
                </Button>

                {!connected && (
                  <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <Info className="w-5 h-5 text-yellow-600" />
                    <span className="text-sm text-yellow-800">
                      Connect your wallet to invest in this franchise
                    </span>
                  </div>
                )}
              </div>

              {/* Investment Benefits */}
              <div className="space-y-4">
                <h4 className="font-semibold">Investment Benefits</h4>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-sm">Monthly Dividends</div>
                      <div className="text-xs text-stone-600 dark:text-stone-400">
                        Receive monthly profit distributions based on your share percentage
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-sm">Governance Rights</div>
                      <div className="text-xs text-stone-600 dark:text-stone-400">
                        Vote on important franchise decisions and improvements
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-purple-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-sm">Blockchain Security</div>
                      <div className="text-xs text-stone-600 dark:text-stone-400">
                        Your ownership is secured by Solana blockchain technology
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Target className="w-5 h-5 text-orange-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-sm">Capital Appreciation</div>
                      <div className="text-xs text-stone-600 dark:text-stone-400">
                        Share value may increase as the franchise grows
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Token Performance (if approved and has data) */}
      {franchise.status === 'Approved' && tokenData && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Token Performance</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {formatAmount(tokenData.monthlyRevenue)}
              </div>
              <div className="text-sm text-stone-600 dark:text-stone-400">Monthly Revenue</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {formatAmount(tokenData.monthlyExpenses)}
              </div>
              <div className="text-sm text-stone-600 dark:text-stone-400">Monthly Expenses</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {formatAmount(tokenData.reserveFund)}
              </div>
              <div className="text-sm text-stone-600 dark:text-stone-400">Reserve Fund</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {new Date(tokenData.lastPayoutDate).toLocaleDateString()}
              </div>
              <div className="text-sm text-stone-600 dark:text-stone-400">Last Payout</div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
