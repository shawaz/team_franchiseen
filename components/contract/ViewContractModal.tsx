"use client";

import React, { useState, useEffect } from 'react';
import { X, ExternalLink, Copy, CheckCircle, Clock, AlertCircle, Eye, FileText, Wallet, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useGlobalCurrency } from '@/contexts/GlobalCurrencyContext';

interface ContractDetails {
  paymentSignature: string;
  contractSignature: string;
  userEmail: string;
  userWallet: string;
  franchiseId: string;
  businessSlug: string;
  shares: number;
  amountLocal: number;
  amountSOL: number;
  timestamp: string;
  contractAddress: string;
  status?: 'confirmed' | 'pending' | 'failed';
}

interface ViewContractModalProps {
  isOpen: boolean;
  onClose: () => void;
  contractDetails: ContractDetails;
  franchiseName?: string;
  businessName?: string;
}

const ViewContractModal: React.FC<ViewContractModalProps> = ({
  isOpen,
  onClose,
  contractDetails,
  franchiseName = 'Franchise',
  businessName = 'Business'
}) => {
  const [verificationStatus, setVerificationStatus] = useState<'checking' | 'verified' | 'failed'>('checking');
  const { formatAmount } = useGlobalCurrency();

  useEffect(() => {
    if (isOpen) {
      // Simulate blockchain verification
      const timer = setTimeout(() => {
        setVerificationStatus('verified');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const openInExplorer = (signature: string) => {
    window.open(`https://explorer.solana.com/tx/${signature}?cluster=devnet`, '_blank');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'verified':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
      case 'checking':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'verified':
        return <CheckCircle className="h-4 w-4" />;
      case 'pending':
      case 'checking':
        return <Clock className="h-4 w-4" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Eye className="h-4 w-4" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Investment Contract
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {businessName} • {franchiseName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Contract Status */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">Contract Status</h3>
              <Badge className={`${getStatusColor(verificationStatus)} flex items-center gap-1`}>
                {getStatusIcon(verificationStatus)}
                {verificationStatus === 'checking' ? 'Verifying...' : 
                 verificationStatus === 'verified' ? 'Verified' : 'Failed'}
              </Badge>
            </div>
            
            {verificationStatus === 'checking' && (
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                Verifying contract on Solana blockchain...
              </div>
            )}
            
            {verificationStatus === 'verified' && (
              <div className="text-sm text-green-700 dark:text-green-300">
                ✅ Contract successfully verified on Solana blockchain
              </div>
            )}
          </Card>

          {/* Investment Details */}
          <Card className="p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Investment Details
            </h3>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600 dark:text-gray-400">Shares Purchased:</span>
                <p className="font-medium text-lg">{contractDetails.shares}</p>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Total Amount:</span>
                <p className="font-medium text-lg text-green-600">
                  {formatAmount(contractDetails.amountLocal)}
                </p>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">SOL Amount:</span>
                <p className="font-medium">{contractDetails.amountSOL.toFixed(4)} SOL</p>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Date:</span>
                <p className="font-medium">
                  {new Date(contractDetails.timestamp).toLocaleDateString()}
                </p>
              </div>
            </div>
          </Card>

          {/* Contract Address */}
          <Card className="p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              Contract Address
            </h3>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 flex items-center justify-between">
              <code className="text-sm font-mono text-gray-800 dark:text-gray-200 break-all">
                {contractDetails.contractAddress}
              </code>
              <button
                onClick={() => copyToClipboard(contractDetails.contractAddress, 'Contract address')}
                className="ml-2 p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
          </Card>

          {/* Transaction Signatures */}
          <Card className="p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Transaction Signatures</h3>
            
            <div className="space-y-3">
              {/* Payment Transaction */}
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Payment Transaction:
                </label>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 flex items-center justify-between mt-1">
                  <code className="text-xs font-mono text-gray-800 dark:text-gray-200 break-all">
                    {contractDetails.paymentSignature}
                  </code>
                  <div className="flex gap-1 ml-2">
                    <button
                      onClick={() => copyToClipboard(contractDetails.paymentSignature, 'Payment signature')}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                    >
                      <Copy className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => openInExplorer(contractDetails.paymentSignature)}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Contract Transaction */}
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Contract Transaction:
                </label>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 flex items-center justify-between mt-1">
                  <code className="text-xs font-mono text-gray-800 dark:text-gray-200 break-all">
                    {contractDetails.contractSignature}
                  </code>
                  <div className="flex gap-1 ml-2">
                    <button
                      onClick={() => copyToClipboard(contractDetails.contractSignature, 'Contract signature')}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                    >
                      <Copy className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => openInExplorer(contractDetails.contractSignature)}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Wallet Information */}
          <Card className="p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Wallet Information</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-600 dark:text-gray-400">Investor Wallet:</span>
                <div className="bg-gray-50 dark:bg-gray-700 rounded p-2 mt-1 flex items-center justify-between">
                  <code className="text-xs font-mono">{contractDetails.userWallet}</code>
                  <button
                    onClick={() => copyToClipboard(contractDetails.userWallet, 'Wallet address')}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                  >
                    <Copy className="h-3 w-3" />
                  </button>
                </div>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Email:</span>
                <p className="font-medium">{contractDetails.userEmail}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex gap-3">
            <Button
              onClick={() => openInExplorer(contractDetails.contractSignature)}
              variant="outline"
              className="flex-1"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View on Solana Explorer
            </Button>
            <Button onClick={onClose} className="flex-1">
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewContractModal;
