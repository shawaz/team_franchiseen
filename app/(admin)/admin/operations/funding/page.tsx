"use client";

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  DollarSign,
  Search,
  TrendingUp,
  TrendingDown,
  PieChart,
  BarChart3,
  Calendar,
  User,
  Building2,
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
  Eye,
  Download,
  Plus
} from 'lucide-react';

interface FundingRequest {
  id: string;
  franchiseName: string;
  brandName: string;
  applicantName: string;
  requestedAmount: number;
  approvedAmount?: number;
  fundingType: 'initial' | 'expansion' | 'working_capital' | 'equipment';
  status: 'pending' | 'approved' | 'disbursed' | 'rejected' | 'under_review';
  applicationDate: string;
  approvalDate?: string;
  disbursementDate?: string;
  purpose: string;
  businessPlan: string;
  collateral: string;
  creditScore: number;
  monthlyRevenue: number;
  existingDebt: number;
  roi: number;
  paybackPeriod: number;
  riskLevel: 'low' | 'medium' | 'high';
}

const fundingRequests: FundingRequest[] = [
  {
    id: 'FND-001',
    franchiseName: 'QuickBite Express - Andheri',
    brandName: 'QuickBite Express',
    applicantName: 'Rohit Sharma',
    requestedAmount: 1500000,
    approvedAmount: 1200000,
    fundingType: 'initial',
    status: 'disbursed',
    applicationDate: '2024-07-15',
    approvalDate: '2024-07-25',
    disbursementDate: '2024-08-01',
    purpose: 'Initial franchise setup and equipment purchase',
    businessPlan: 'Comprehensive business plan with 3-year projections',
    collateral: 'Property worth ₹25,00,000',
    creditScore: 750,
    monthlyRevenue: 0,
    existingDebt: 500000,
    roi: 18.5,
    paybackPeriod: 36,
    riskLevel: 'low'
  },
  {
    id: 'FND-002',
    franchiseName: 'FitZone Gym - Bandra',
    brandName: 'FitZone Gym',
    applicantName: 'Priya Patel',
    requestedAmount: 800000,
    approvedAmount: 600000,
    fundingType: 'expansion',
    status: 'approved',
    applicationDate: '2024-08-10',
    approvalDate: '2024-08-20',
    purpose: 'Expansion to add new equipment and training area',
    businessPlan: 'Expansion plan with market analysis',
    collateral: 'Equipment and fixtures worth ₹12,00,000',
    creditScore: 720,
    monthlyRevenue: 180000,
    existingDebt: 200000,
    roi: 22.3,
    paybackPeriod: 24,
    riskLevel: 'low'
  },
  {
    id: 'FND-003',
    franchiseName: 'TechRepair Hub - Whitefield',
    brandName: 'TechRepair Hub',
    applicantName: 'Amit Kumar',
    requestedAmount: 500000,
    fundingType: 'working_capital',
    status: 'under_review',
    applicationDate: '2024-08-22',
    purpose: 'Working capital for inventory and operational expenses',
    businessPlan: 'Working capital requirement analysis',
    collateral: 'Inventory worth ₹8,00,000',
    creditScore: 680,
    monthlyRevenue: 120000,
    existingDebt: 150000,
    roi: 15.8,
    paybackPeriod: 18,
    riskLevel: 'medium'
  },
  {
    id: 'FND-004',
    franchiseName: 'EduSmart Learning - Koramangala',
    brandName: 'EduSmart Learning',
    applicantName: 'Dr. Sunita Rao',
    requestedAmount: 1000000,
    fundingType: 'equipment',
    status: 'pending',
    applicationDate: '2024-08-25',
    purpose: 'Purchase of advanced learning equipment and technology',
    businessPlan: 'Technology upgrade plan with ROI projections',
    collateral: 'Building lease and equipment worth ₹18,00,000',
    creditScore: 780,
    monthlyRevenue: 250000,
    existingDebt: 300000,
    roi: 20.1,
    paybackPeriod: 30,
    riskLevel: 'low'
  },
  {
    id: 'FND-005',
    franchiseName: 'CleanCare Services - T. Nagar',
    brandName: 'CleanCare Services',
    applicantName: 'Karthik Menon',
    requestedAmount: 300000,
    fundingType: 'working_capital',
    status: 'rejected',
    applicationDate: '2024-08-18',
    purpose: 'Working capital for business revival',
    businessPlan: 'Revival plan with cost reduction strategies',
    collateral: 'Equipment worth ₹4,00,000',
    creditScore: 620,
    monthlyRevenue: 45000,
    existingDebt: 400000,
    roi: 8.2,
    paybackPeriod: 48,
    riskLevel: 'high'
  }
];

export default function FundingPage() {
  const [requests, setRequests] = useState<FundingRequest[]>(fundingRequests);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'disbursed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case 'under_review':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'pending':
        return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <DollarSign className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'disbursed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'approved':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'under_review':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'pending':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.franchiseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         request.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         request.applicantName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    const matchesType = typeFilter === 'all' || request.fundingType === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const fundingStats = {
    totalRequests: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    approved: requests.filter(r => r.status === 'approved').length,
    disbursed: requests.filter(r => r.status === 'disbursed').length,
    rejected: requests.filter(r => r.status === 'rejected').length,
    totalRequested: requests.reduce((sum, r) => sum + r.requestedAmount, 0),
    totalApproved: requests.reduce((sum, r) => sum + (r.approvedAmount || 0), 0),
    totalDisbursed: requests.filter(r => r.status === 'disbursed').reduce((sum, r) => sum + (r.approvedAmount || 0), 0),
    avgROI: requests.reduce((sum, r) => sum + r.roi, 0) / requests.length,
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Franchise Funding</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage franchise funding requests, approvals, and disbursements
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Funding Request
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Requests</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{fundingStats.totalRequests}</p>
            </div>
            <DollarSign className="w-6 h-6 text-blue-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</p>
              <p className="text-2xl font-bold text-orange-600">{fundingStats.pending}</p>
            </div>
            <AlertTriangle className="w-6 h-6 text-orange-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Approved</p>
              <p className="text-2xl font-bold text-blue-600">{fundingStats.approved}</p>
            </div>
            <CheckCircle className="w-6 h-6 text-blue-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Disbursed</p>
              <p className="text-2xl font-bold text-green-600">{fundingStats.disbursed}</p>
            </div>
            <CheckCircle className="w-6 h-6 text-green-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Rejected</p>
              <p className="text-2xl font-bold text-red-600">{fundingStats.rejected}</p>
            </div>
            <XCircle className="w-6 h-6 text-red-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Requested</p>
              <p className="text-lg font-bold text-purple-600">{formatCurrency(fundingStats.totalRequested)}</p>
            </div>
            <TrendingUp className="w-6 h-6 text-purple-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Approved</p>
              <p className="text-lg font-bold text-blue-600">{formatCurrency(fundingStats.totalApproved)}</p>
            </div>
            <CheckCircle className="w-6 h-6 text-blue-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg ROI</p>
              <p className="text-2xl font-bold text-green-600">{fundingStats.avgROI.toFixed(1)}%</p>
            </div>
            <BarChart3 className="w-6 h-6 text-green-500" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search funding requests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="under_review">Under Review</option>
              <option value="approved">Approved</option>
              <option value="disbursed">Disbursed</option>
              <option value="rejected">Rejected</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="initial">Initial</option>
              <option value="expansion">Expansion</option>
              <option value="working_capital">Working Capital</option>
              <option value="equipment">Equipment</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Funding Requests List */}
      <div className="space-y-4">
        {filteredRequests.map((request) => (
          <Card key={request.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  {getStatusIcon(request.status)}
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {request.franchiseName}
                  </h3>
                  <Badge variant="outline" className="text-xs font-mono">
                    {request.id}
                  </Badge>
                  <Badge variant="outline" className={getStatusColor(request.status)}>
                    {request.status.replace('_', ' ')}
                  </Badge>
                  <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                    {request.fundingType.replace('_', ' ')}
                  </Badge>
                  <Badge variant="outline" className={getRiskColor(request.riskLevel)}>
                    {request.riskLevel} risk
                  </Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Applicant</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{request.applicantName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Requested Amount</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{formatCurrency(request.requestedAmount)}</p>
                  </div>
                  {request.approvedAmount && (
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Approved Amount</p>
                      <p className="font-medium text-green-600">{formatCurrency(request.approvedAmount)}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Credit Score</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{request.creditScore}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">ROI</p>
                    <p className="font-medium text-green-600">{request.roi}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Payback Period</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{request.paybackPeriod} months</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Monthly Revenue</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{formatCurrency(request.monthlyRevenue)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Existing Debt</p>
                    <p className="font-medium text-red-600">{formatCurrency(request.existingDebt)}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Purpose</p>
                  <p className="text-gray-700 dark:text-gray-300">{request.purpose}</p>
                </div>

                <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Applied: {new Date(request.applicationDate).toLocaleDateString()}
                  </div>
                  {request.approvalDate && (
                    <div className="flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      Approved: {new Date(request.approvalDate).toLocaleDateString()}
                    </div>
                  )}
                  {request.disbursementDate && (
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      Disbursed: {new Date(request.disbursementDate).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
