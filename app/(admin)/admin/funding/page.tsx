"use client";

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
  DollarSign,
  Calendar,
  RefreshCw,
  Play,
  Building,
  Users,
  Target,
  Timer,
} from 'lucide-react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useGlobalCurrency } from '@/contexts/GlobalCurrencyContext';
import { toast } from 'sonner';

export default function FundingManagementPage() {
  const { formatAmount } = useGlobalCurrency();
  const [processing, setProcessing] = useState(false);

  // Queries
  const nearingDeadline = useQuery(api.escrow.getFranchisesNearingDeadline, {}) || [];
  const fundingStats = useQuery(api.escrow.getFundingStatistics, {}) || {};

  // Mutations
  const processExpiredFunding = useMutation(api.escrow.processExpiredFunding);

  const handleProcessExpired = async () => {
    setProcessing(true);
    try {
      const result = await processExpiredFunding({});
      toast.success(`Processed ${result.processedCount} expired funding campaigns`);
      
      if (result.processedFranchises.length > 0) {
        const refunded = result.processedFranchises.filter(f => f.refundCount > 0);
        const launched = result.processedFranchises.filter(f => f.status === 'moved_to_launching');
        
        if (refunded.length > 0) {
          toast.info(`${refunded.length} campaigns failed and refunds processed`);
        }
        if (launched.length > 0) {
          toast.success(`${launched.length} campaigns succeeded and moved to launching`);
        }
      }
    } catch (error) {
      console.error('Error processing expired funding:', error);
      toast.error('Failed to process expired funding campaigns');
    } finally {
      setProcessing(false);
    }
  };

  const getStatusBadge = (franchise: any) => {
    const daysRemaining = franchise.daysRemaining || 0;
    const fundingPercentage = franchise.fundingPercentage || 0;

    if (daysRemaining === 0) {
      return <Badge variant="destructive" className="flex items-center gap-1">
        <XCircle className="w-3 h-3" />
        Expired
      </Badge>;
    } else if (fundingPercentage >= 100) {
      return <Badge variant="default" className="bg-green-100 text-green-800 flex items-center gap-1">
        <CheckCircle className="w-3 h-3" />
        Funded
      </Badge>;
    } else if (daysRemaining <= 7) {
      return <Badge variant="destructive" className="flex items-center gap-1">
        <AlertTriangle className="w-3 h-3" />
        At Risk
      </Badge>;
    } else {
      return <Badge variant="secondary" className="flex items-center gap-1">
        <Clock className="w-3 h-3" />
        Active
      </Badge>;
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Funding Management</h1>
          <p className="text-stone-600 dark:text-stone-400">
            Monitor and manage 90-day funding campaigns
          </p>
        </div>
        <Button 
          onClick={handleProcessExpired}
          disabled={processing}
          className="flex items-center gap-2"
        >
          {processing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              Process Expired
            </>
          )}
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Campaigns</p>
              <p className="text-2xl font-bold">{fundingStats.totalCampaigns || 0}</p>
            </div>
            <Target className="h-8 w-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Successful</p>
              <p className="text-2xl font-bold text-green-600">{fundingStats.successfulCampaigns || 0}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">At Risk</p>
              <p className="text-2xl font-bold text-red-600">{fundingStats.atRiskCampaigns || 0}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Avg. Funding</p>
              <p className="text-2xl font-bold">{(fundingStats.averageFundingPercentage || 0).toFixed(1)}%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-500" />
          </div>
        </Card>
      </div>

      {/* Funding Overview */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Funding Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-600">Total Target</span>
              <span className="font-semibold">{formatAmount(fundingStats.totalFundingTarget || 0)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-600">Total Raised</span>
              <span className="font-semibold text-green-600">{formatAmount(fundingStats.totalFundingRaised || 0)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full" 
                style={{ 
                  width: `${Math.min(100, (fundingStats.averageFundingPercentage || 0))}%` 
                }}
              ></div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm">Successful Campaigns: {fundingStats.successfulCampaigns || 0}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm">At Risk Campaigns: {fundingStats.atRiskCampaigns || 0}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
              <span className="text-sm">Expired Campaigns: {fundingStats.expiredCampaigns || 0}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Campaigns Nearing Deadline */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Campaigns Nearing Deadline</h3>
          <Badge variant="outline" className="flex items-center gap-1">
            <Timer className="w-3 h-3" />
            {nearingDeadline.length} campaigns
          </Badge>
        </div>

        {nearingDeadline.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
            <h4 className="text-lg font-semibold mb-2">All Clear!</h4>
            <p className="text-gray-600 dark:text-gray-400">
              No campaigns are nearing their funding deadline.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {nearingDeadline.map((franchise) => (
              <div key={franchise._id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Building className="w-6 h-6 text-blue-600" />
                    <div>
                      <h4 className="font-semibold">{franchise.building}</h4>
                      <p className="text-sm text-gray-600">{franchise.locationAddress}</p>
                    </div>
                  </div>
                  {getStatusBadge(franchise)}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-gray-500">Funding Progress</p>
                    <p className="font-semibold">{franchise.fundingPercentage.toFixed(1)}%</p>
                    <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                      <div 
                        className={`h-1 rounded-full ${
                          franchise.fundingPercentage >= 100 ? 'bg-green-500' : 
                          franchise.fundingPercentage >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${Math.min(100, franchise.fundingPercentage)}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Days Remaining</p>
                    <p className={`font-semibold ${
                      franchise.daysRemaining <= 3 ? 'text-red-600' : 
                      franchise.daysRemaining <= 7 ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {franchise.daysRemaining} days
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Target Amount</p>
                    <p className="font-semibold">{formatAmount(franchise.totalInvestment)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Raised Amount</p>
                    <p className="font-semibold text-green-600">{formatAmount(franchise.totalRaised)}</p>
                  </div>
                </div>

                {franchise.isAtRisk && (
                  <div className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-800">
                    <AlertTriangle className="w-4 h-4" />
                    <span>This campaign is at risk of failing. Consider promotional actions.</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
