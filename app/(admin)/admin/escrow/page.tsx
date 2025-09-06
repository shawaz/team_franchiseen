"use client";

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { toast } from 'sonner';
import {
  Search,
  Shield,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ExternalLink,
  RefreshCw,
  Calendar,
  User,
  Building,
  Coins,
  ArrowUpRight,
  ArrowDownLeft,
  Eye,
  FileText
} from 'lucide-react';

interface EscrowRecord {
  _id: Id<"escrow">;
  franchiseId: string;
  userId: string;
  businessId: string;
  paymentSignature: string;
  amount: number;
  amountLocal: number;
  currency: string;
  shares: number;
  status: string;
  stage: string;
  createdAt: number;
  expiresAt: number;
  releasedAt?: number;
  refundedAt?: number;
  releaseSignature?: string;
  refundSignature?: string;
  processedById?: string;
  adminNotes?: string;
  contractSignature?: string;
  contractAddress?: string;
  userEmail?: string;
  userWallet: string;
  autoRefundEnabled: boolean;
  manualReleaseRequired: boolean;
  user?: {
    _id: string;
    _creationTime: number;
    privyUserId?: string;
    updated_at?: number;
    avatar?: string;
    first_name?: string;
    family_name?: string;
    email: string;
    created_at: number;
  } | null;
  franchise?: {
    _id: string;
    _creationTime: number;
    slug?: string;
    launchStartDate?: number;
    launchEndDate?: number;
    tokenMint?: string;
    locationAddress: string;
    building: string;
    selectedShares: number;
  } | null;
  business?: {
    _id: string;
    _creationTime: number;
    name: string;
    slug?: string;
  } | null;
  processedBy?: {
    _id: string;
    _creationTime: number;
    privyUserId?: string;
    updated_at?: number;
    avatar?: string;
    first_name?: string;
    family_name?: string;
    email: string;
    created_at: number;
  } | null;
}

const STATUS_COLORS = {
  held: "bg-yellow-100 text-yellow-800 border-yellow-200",
  released: "bg-green-100 text-green-800 border-green-200", 
  refunded: "bg-blue-100 text-blue-800 border-blue-200",
  expired: "bg-red-100 text-red-800 border-red-200"
};

const STAGE_COLORS = {
  pending_approval: "bg-orange-100 text-orange-800 border-orange-200",
  funding: "bg-purple-100 text-purple-800 border-purple-200",
  launching: "bg-indigo-100 text-indigo-800 border-indigo-200",
  active: "bg-green-100 text-green-800 border-green-200"
};

export default function EscrowAdminPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<EscrowRecord | null>(null);
  const [showReleaseModal, setShowReleaseModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');

  // Queries
  const escrowRecords = useQuery(api.escrow.getAllEscrowRecords, {}) || [];
  const hasAccess = useQuery(api.users.hasAdminAccess, {});

  // Mutations
  const releaseEscrowFunds = useMutation(api.escrow.releaseEscrowFunds);
  const refundEscrowFunds = useMutation(api.escrow.refundEscrowFunds);

  // Filter records
  const filteredRecords = escrowRecords.filter((record: EscrowRecord) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      record.user?.email?.toLowerCase().includes(searchLower) ||
      record.business?.name?.toLowerCase().includes(searchLower) ||
      record.franchise?.locationAddress?.toLowerCase().includes(searchLower) ||
      record.paymentSignature.toLowerCase().includes(searchLower) ||
      record.status.toLowerCase().includes(searchLower) ||
      record.stage.toLowerCase().includes(searchLower)
    );
  });

  const handleReleaseFunds = async () => {
    if (!selectedRecord) return;

    try {
      await releaseEscrowFunds({
        escrowId: selectedRecord._id,
        adminNotes: adminNotes || undefined,
      });

      toast.success('Funds released successfully!');
      setShowReleaseModal(false);
      setSelectedRecord(null);
      setAdminNotes('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to release funds');
    }
  };

  const handleRefundFunds = async () => {
    if (!selectedRecord) return;

    try {
      await refundEscrowFunds({
        escrowId: selectedRecord._id,
        adminNotes: adminNotes || undefined,
        isAutomatic: false,
      });

      toast.success('Funds refunded successfully!');
      setShowRefundModal(false);
      setSelectedRecord(null);
      setAdminNotes('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to refund funds');
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    if (currency === 'SOL') {
      return `${amount.toFixed(4)} SOL`;
    }
    return `${amount.toFixed(2)} ${currency}`;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'held': return <Clock className="w-4 h-4" />;
      case 'released': return <CheckCircle className="w-4 h-4" />;
      case 'refunded': return <ArrowDownLeft className="w-4 h-4" />;
      case 'expired': return <XCircle className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const isExpired = (expiresAt: number) => {
    return Date.now() > expiresAt;
  };

  if (!hasAccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Shield className="w-16 h-16 text-gray-400" />
        <h1 className="text-2xl font-semibold">Access Denied</h1>
        <p className="text-gray-600 dark:text-gray-400">You don't have permission to access escrow management.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
            Escrow Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
            Monitor and manage franchise payment escrow accounts
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            {filteredRecords.length} Records
          </Badge>
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            {filteredRecords.filter((r: EscrowRecord) => r.status === 'held').length} Held
          </Badge>
        </div>
      </div>

      {/* Search */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search by user, business, address, or transaction..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Escrow Records */}
      <div className="space-y-4">
        {filteredRecords.map((record: EscrowRecord) => (
          <Card key={record._id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    {record.business?.name} - {record.franchise?.building}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {record.franchise?.locationAddress}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(record.status)}
                <Badge 
                  variant="outline" 
                  className={STATUS_COLORS[record.status as keyof typeof STATUS_COLORS] || ""}
                >
                  {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                </Badge>
                {isExpired(record.expiresAt) && record.status === 'held' && (
                  <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
                    Expired
                  </Badge>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Investor</p>
                  <p className="text-sm font-medium">{record.user?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Coins className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Amount</p>
                  <p className="text-sm font-medium">{formatCurrency(record.amount, record.currency)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Created</p>
                  <p className="text-sm font-medium">{formatDate(record.createdAt)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Expires</p>
                  <p className="text-sm font-medium">{formatDate(record.expiresAt)}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge 
                  variant="outline" 
                  className={STAGE_COLORS[record.stage as keyof typeof STAGE_COLORS] || ""}
                >
                  {record.stage.replace('_', ' ').charAt(0).toUpperCase() + record.stage.replace('_', ' ').slice(1)}
                </Badge>
                <span className="text-sm text-gray-600">{record.shares} shares</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(`https://explorer.solana.com/tx/${record.paymentSignature}?cluster=devnet`, '_blank')}
                >
                  <ExternalLink className="w-4 h-4 mr-1" />
                  View TX
                </Button>
                
                {record.status === 'held' && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedRecord(record);
                        setShowRefundModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <ArrowDownLeft className="w-4 h-4 mr-1" />
                      Refund
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedRecord(record);
                        setShowReleaseModal(true);
                      }}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <ArrowUpRight className="w-4 h-4 mr-1" />
                      Release
                    </Button>
                  </>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredRecords.length === 0 && (
        <div className="text-center py-12">
          <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            No escrow records found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {searchQuery ? 'Try adjusting your search criteria.' : 'Escrow records will appear here when payments are made.'}
          </p>
        </div>
      )}

      {/* Release Modal */}
      {showReleaseModal && selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">Release Escrow Funds</h2>
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800">
                  <strong>Amount:</strong> {formatCurrency(selectedRecord.amount, selectedRecord.currency)}
                </p>
                <p className="text-sm text-green-800">
                  <strong>Investor:</strong> {selectedRecord.user?.email}
                </p>
                <p className="text-sm text-green-800">
                  <strong>Franchise:</strong> {selectedRecord.business?.name}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Admin Notes (Optional)</label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Reason for releasing funds..."
                  className="w-full p-2 border rounded-md h-20 resize-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button onClick={handleReleaseFunds} className="flex-1 bg-green-600 hover:bg-green-700">
                  Release Funds
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowReleaseModal(false);
                    setSelectedRecord(null);
                    setAdminNotes('');
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Refund Modal */}
      {showRefundModal && selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">Refund Escrow Funds</h2>
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Amount:</strong> {formatCurrency(selectedRecord.amount, selectedRecord.currency)}
                </p>
                <p className="text-sm text-blue-800">
                  <strong>Investor:</strong> {selectedRecord.user?.email}
                </p>
                <p className="text-sm text-blue-800">
                  <strong>Franchise:</strong> {selectedRecord.business?.name}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Admin Notes (Optional)</label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Reason for refunding..."
                  className="w-full p-2 border rounded-md h-20 resize-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button onClick={handleRefundFunds} className="flex-1 bg-blue-600 hover:bg-blue-700">
                  Process Refund
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowRefundModal(false);
                    setSelectedRecord(null);
                    setAdminNotes('');
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
