"use client";

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  RefreshCw,
  AlertTriangle,
  DollarSign,
  Users,
  Calendar,
  Building,
  FileText,
  CheckCircle,
  Clock,
  TrendingDown,
  BarChart3,
  PieChart,
  Download,
  Filter,
} from 'lucide-react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useGlobalCurrency } from '@/contexts/GlobalCurrencyContext';
import { Id } from '@/convex/_generated/dataModel';
import { toast } from 'sonner';

export default function RefundsPage() {
  const { formatAmount } = useGlobalCurrency();
  const [selectedPeriod, setSelectedPeriod] = useState<string>('month');
  const [isProcessingRefund, setIsProcessingRefund] = useState(false);
  const [selectedFranchise, setSelectedFranchise] = useState<string | null>(null);
  const [refundReason, setRefundReason] = useState('');
  const [adminNotes, setAdminNotes] = useState('');

  // Queries
  const refundStatistics = useQuery(api.escrow.getRefundStatistics, { period: selectedPeriod });
  const pendingRefunds = useQuery(api.escrow.getPendingRefunds, {});
  const fundingStatistics = useQuery(api.escrow.getFundingStatistics, {});

  // Mutations
  const processManualRefund = useMutation(api.escrow.processManualRefund);
  const processExpiredFunding = useMutation(api.escrow.processExpiredFunding);

  const handleProcessRefund = async () => {
    if (!selectedFranchise || !refundReason.trim()) {
      toast.error('Please select a franchise and provide a reason');
      return;
    }

    setIsProcessingRefund(true);
    try {
      const result = await processManualRefund({
        franchiseId: selectedFranchise as Id<"franchise">,
        reason: refundReason,
        adminNotes: adminNotes || undefined,
      });

      toast.success(result.message);
      setSelectedFranchise(null);
      setRefundReason('');
      setAdminNotes('');
    } catch (error) {
      console.error('Error processing refund:', error);
      toast.error('Failed to process refund');
    } finally {
      setIsProcessingRefund(false);
    }
  };

  const handleProcessExpiredCampaigns = async () => {
    try {
      const result = await processExpiredFunding({});
      toast.success(`Processed ${result.processedCount} expired campaigns`);
    } catch (error) {
      console.error('Error processing expired campaigns:', error);
      toast.error('Failed to process expired campaigns');
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">Refund Management</h1>
          <p className="text-stone-600 dark:text-stone-400">
            Monitor and process refunds for failed funding campaigns and rejected franchises
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="quarter">Quarter</SelectItem>
              <SelectItem value="year">Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleProcessExpiredCampaigns} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Process Expired
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Refunds</p>
              <p className="text-2xl font-bold">{refundStatistics?.statistics.totalRefunds || 0}</p>
            </div>
            <TrendingDown className="h-6 w-6 text-red-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Refunded</p>
              <p className="text-2xl font-bold text-red-600">
                {formatAmount(refundStatistics?.statistics.totalRefundAmount || 0)}
              </p>
            </div>
            <DollarSign className="h-6 w-6 text-red-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Average Refund</p>
              <p className="text-2xl font-bold">
                {formatAmount(refundStatistics?.statistics.averageRefundAmount || 0)}
              </p>
            </div>
            <BarChart3 className="h-6 w-6 text-blue-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Pending Refunds</p>
              <p className="text-2xl font-bold text-orange-600">{pendingRefunds?.length || 0}</p>
            </div>
            <Clock className="h-6 w-6 text-orange-500" />
          </div>
        </Card>
      </div>

      {/* Pending Refunds */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Pending Refunds</h3>
          <Badge variant="destructive" className="text-sm">
            {pendingRefunds?.length || 0} requiring attention
          </Badge>
        </div>

        {pendingRefunds && pendingRefunds.length > 0 ? (
          <div className="space-y-4">
            {pendingRefunds.map((pending) => (
              <div key={pending.franchise._id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Building className="w-6 h-6 text-blue-600" />
                    <div>
                      <h4 className="font-semibold">{pending.franchise.building}</h4>
                      <p className="text-sm text-gray-600">{pending.franchise.locationAddress}</p>
                      {pending.franchise.rejectionReason && (
                        <p className="text-sm text-red-600 mt-1">
                          Reason: {pending.franchise.rejectionReason}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="destructive">Rejected</Badge>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          size="sm"
                          onClick={() => setSelectedFranchise(pending.franchise._id)}
                        >
                          Process Refund
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Process Manual Refund</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <p className="font-semibold">{pending.franchise.building}</p>
                            <p className="text-sm text-gray-600">{pending.franchise.locationAddress}</p>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <div>
                              <p className="text-sm text-gray-600">Total Amount</p>
                              <p className="font-semibold">{formatAmount(pending.totalAmount)}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Investors</p>
                              <p className="font-semibold">{pending.investorCount}</p>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label>Refund Reason</Label>
                            <Input
                              value={refundReason}
                              onChange={(e) => setRefundReason(e.target.value)}
                              placeholder="Enter reason for refund"
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Admin Notes (Optional)</Label>
                            <Textarea
                              value={adminNotes}
                              onChange={(e) => setAdminNotes(e.target.value)}
                              placeholder="Additional notes for internal tracking"
                              rows={3}
                            />
                          </div>

                          <div className="flex gap-2 pt-4">
                            <Button 
                              onClick={handleProcessRefund}
                              disabled={isProcessingRefund || !refundReason.trim()}
                              className="flex-1"
                            >
                              {isProcessingRefund ? (
                                <>
                                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                  Processing...
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Process Refund
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Refund Amount</p>
                    <p className="font-semibold text-red-600">{formatAmount(pending.totalAmount)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Affected Investors</p>
                    <p className="font-semibold">{pending.investorCount}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Escrow Records</p>
                    <p className="font-semibold">{pending.escrowRecords}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Days Since Rejection</p>
                    <p className="font-semibold">
                      {pending.franchise.rejectedAt 
                        ? Math.floor((Date.now() - pending.franchise.rejectedAt) / (24 * 60 * 60 * 1000))
                        : 'N/A'
                      } days
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold mb-2">No Pending Refunds</h3>
            <p className="text-gray-600 dark:text-gray-400">
              All rejected franchises have been processed for refunds
            </p>
          </div>
        )}
      </Card>

      {/* Refund Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Refunds by Reason */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Refunds by Reason</h3>
          <div className="space-y-3">
            {refundStatistics?.refundsByReason && Object.entries(refundStatistics.refundsByReason).map(([reason, data]) => (
              <div key={reason} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <p className="font-semibold">{reason}</p>
                  <p className="text-sm text-gray-600">{data.count} refunds</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatAmount(data.amount)}</p>
                  <p className="text-sm text-gray-600">
                    {((data.amount / (refundStatistics?.statistics.totalRefundAmount || 1)) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Campaign Health Overview */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Campaign Health Overview</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <span>Successful Campaigns</span>
              <span className="font-semibold text-green-600">{fundingStatistics?.successfulCampaigns || 0}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <span>At Risk Campaigns</span>
              <span className="font-semibold text-yellow-600">{fundingStatistics?.atRiskCampaigns || 0}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <span>Expired Campaigns</span>
              <span className="font-semibold text-red-600">{fundingStatistics?.expiredCampaigns || 0}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <span>Total Active</span>
              <span className="font-semibold text-blue-600">{fundingStatistics?.totalCampaigns || 0}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
