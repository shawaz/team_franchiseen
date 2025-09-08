"use client";

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  XCircle,
  Search,
  Calendar,
  MapPin,
  DollarSign,
  TrendingDown,
  AlertTriangle,
  FileText,
  User,
  Clock,
  Eye,
  Download,
  MoreHorizontal,
  Building2
} from 'lucide-react';

interface ClosedFranchise {
  id: string;
  outletName: string;
  brandName: string;
  franchisee: string;
  location: string;
  launchDate: string;
  closureDate: string;
  operationalPeriod: number; // in months
  closureReason: 'budget_empty' | 'poor_performance' | 'market_conditions' | 'personal_reasons' | 'lease_issues' | 'regulatory_issues' | 'brand_issues' | 'other';
  totalInvestment: number;
  totalRevenue: number;
  totalLoss: number;
  lastMonthRevenue: number;
  staffCount: number;
  customerBase: number;
  finalInspectionScore: number;
  assetsRecovered: number;
  liabilities: number;
  settlementAmount: number;
  manager: string;
  contactNumber: string;
  email: string;
  closureNotes: string;
  lessonsLearned: string[];
  documentsStatus: 'complete' | 'pending' | 'partial';
}

const closedFranchises: ClosedFranchise[] = [
  {
    id: 'CLS-001',
    outletName: 'StyleCut Salon - Hyderabad',
    brandName: 'StyleCut Salon',
    franchisee: 'Meera Singh',
    location: 'Hyderabad, Telangana',
    launchDate: '2023-11-20',
    closureDate: '2024-08-15',
    operationalPeriod: 9,
    closureReason: 'budget_empty',
    totalInvestment: 600000,
    totalRevenue: 320000,
    totalLoss: 280000,
    lastMonthRevenue: 25000,
    staffCount: 3,
    customerBase: 45,
    finalInspectionScore: 72,
    assetsRecovered: 180000,
    liabilities: 120000,
    settlementAmount: 60000,
    manager: 'Rajesh Kumar',
    contactNumber: '+91 43210 98765',
    email: 'hyderabad@stylecut.com',
    closureNotes: 'Unable to sustain operations due to insufficient working capital. High competition in the area affected customer acquisition.',
    lessonsLearned: [
      'Market research was insufficient',
      'Working capital underestimated',
      'Competition analysis needed improvement',
      'Marketing budget was inadequate'
    ],
    documentsStatus: 'complete'
  },
  {
    id: 'CLS-002',
    outletName: 'QuickBite Express - Thane',
    brandName: 'QuickBite Express',
    franchisee: 'Suresh Patel',
    location: 'Thane, Maharashtra',
    launchDate: '2024-02-10',
    closureDate: '2024-08-20',
    operationalPeriod: 6,
    closureReason: 'poor_performance',
    totalInvestment: 800000,
    totalRevenue: 180000,
    totalLoss: 620000,
    lastMonthRevenue: 15000,
    staffCount: 4,
    customerBase: 25,
    finalInspectionScore: 58,
    assetsRecovered: 220000,
    liabilities: 150000,
    settlementAmount: 70000,
    manager: 'Priya Sharma',
    contactNumber: '+91 32109 87654',
    email: 'thane@quickbite.com',
    closureNotes: 'Consistently poor performance, unable to meet minimum revenue targets. Location had poor footfall.',
    lessonsLearned: [
      'Location selection was poor',
      'Franchisee lacked experience',
      'Staff training was inadequate',
      'Quality control issues'
    ],
    documentsStatus: 'complete'
  },
  {
    id: 'CLS-003',
    outletName: 'FitZone Gym - Pune',
    brandName: 'FitZone Gym',
    franchisee: 'Amit Desai',
    location: 'Pune, Maharashtra',
    launchDate: '2023-08-15',
    closureDate: '2024-07-30',
    operationalPeriod: 11,
    closureReason: 'lease_issues',
    totalInvestment: 1200000,
    totalRevenue: 850000,
    totalLoss: 350000,
    lastMonthRevenue: 45000,
    staffCount: 6,
    customerBase: 120,
    finalInspectionScore: 85,
    assetsRecovered: 450000,
    liabilities: 200000,
    settlementAmount: 250000,
    manager: 'Karthik Menon',
    contactNumber: '+91 21098 76543',
    email: 'pune@fitzone.com',
    closureNotes: 'Forced closure due to lease termination by landlord. Property was sold to a developer.',
    lessonsLearned: [
      'Lease agreement was not secure',
      'Backup location should have been identified',
      'Legal review of lease was insufficient'
    ],
    documentsStatus: 'complete'
  },
  {
    id: 'CLS-004',
    outletName: 'TechRepair Hub - Gurgaon',
    brandName: 'TechRepair Hub',
    franchisee: 'Rohit Gupta',
    location: 'Gurgaon, Haryana',
    launchDate: '2024-01-20',
    closureDate: '2024-08-10',
    operationalPeriod: 7,
    closureReason: 'personal_reasons',
    totalInvestment: 500000,
    totalRevenue: 280000,
    totalLoss: 220000,
    lastMonthRevenue: 35000,
    staffCount: 2,
    customerBase: 65,
    finalInspectionScore: 78,
    assetsRecovered: 180000,
    liabilities: 80000,
    settlementAmount: 100000,
    manager: 'Sunita Rao',
    contactNumber: '+91 10987 65432',
    email: 'gurgaon@techrepair.com',
    closureNotes: 'Franchisee had to relocate due to family emergency. Business was performing adequately.',
    lessonsLearned: [
      'Franchisee commitment assessment needed',
      'Succession planning was missing',
      'Transfer options should be explored'
    ],
    documentsStatus: 'pending'
  },
  {
    id: 'CLS-005',
    outletName: 'EduSmart Learning - Jaipur',
    brandName: 'EduSmart Learning',
    franchisee: 'Dr. Vikram Singh',
    location: 'Jaipur, Rajasthan',
    launchDate: '2023-06-01',
    closureDate: '2024-08-05',
    operationalPeriod: 14,
    closureReason: 'regulatory_issues',
    totalInvestment: 900000,
    totalRevenue: 720000,
    totalLoss: 180000,
    lastMonthRevenue: 38000,
    staffCount: 8,
    customerBase: 85,
    finalInspectionScore: 88,
    assetsRecovered: 380000,
    liabilities: 150000,
    settlementAmount: 230000,
    manager: 'Meera Patel',
    contactNumber: '+91 09876 54321',
    email: 'jaipur@edusmart.com',
    closureNotes: 'Closure due to new education regulations that required additional certifications and compliance costs.',
    lessonsLearned: [
      'Regulatory compliance monitoring needed',
      'Government policy changes impact assessment',
      'Legal compliance team required'
    ],
    documentsStatus: 'partial'
  }
];

export default function ClosedPage() {
  const [franchises, setFranchises] = useState<ClosedFranchise[]>(closedFranchises);
  const [searchQuery, setSearchQuery] = useState('');
  const [reasonFilter, setReasonFilter] = useState<string>('all');
  const [documentsFilter, setDocumentsFilter] = useState<string>('all');

  const getReasonIcon = (reason: string) => {
    switch (reason) {
      case 'budget_empty':
        return <DollarSign className="w-4 h-4 text-red-500" />;
      case 'poor_performance':
        return <TrendingDown className="w-4 h-4 text-orange-500" />;
      case 'market_conditions':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'personal_reasons':
        return <User className="w-4 h-4 text-blue-500" />;
      case 'lease_issues':
        return <Building2 className="w-4 h-4 text-purple-500" />;
      case 'regulatory_issues':
        return <FileText className="w-4 h-4 text-gray-500" />;
      default:
        return <XCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getReasonColor = (reason: string) => {
    switch (reason) {
      case 'budget_empty':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'poor_performance':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'market_conditions':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'personal_reasons':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'lease_issues':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'regulatory_issues':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDocumentsStatusColor = (status: string) => {
    switch (status) {
      case 'complete':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'partial':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'pending':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredFranchises = franchises.filter(franchise => {
    const matchesSearch = franchise.outletName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         franchise.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         franchise.franchisee.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         franchise.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesReason = reasonFilter === 'all' || franchise.closureReason === reasonFilter;
    const matchesDocuments = documentsFilter === 'all' || franchise.documentsStatus === documentsFilter;

    return matchesSearch && matchesReason && matchesDocuments;
  });

  const closureStats = {
    total: franchises.length,
    budgetEmpty: franchises.filter(f => f.closureReason === 'budget_empty').length,
    poorPerformance: franchises.filter(f => f.closureReason === 'poor_performance').length,
    personalReasons: franchises.filter(f => f.closureReason === 'personal_reasons').length,
    leaseIssues: franchises.filter(f => f.closureReason === 'lease_issues').length,
    regulatoryIssues: franchises.filter(f => f.closureReason === 'regulatory_issues').length,
    totalInvestment: franchises.reduce((sum, f) => sum + f.totalInvestment, 0),
    totalLoss: franchises.reduce((sum, f) => sum + f.totalLoss, 0),
    avgOperationalPeriod: franchises.reduce((sum, f) => sum + f.operationalPeriod, 0) / franchises.length,
    documentsComplete: franchises.filter(f => f.documentsStatus === 'complete').length,
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatReason = (reason: string) => {
    return reason.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Closed Franchises</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track closed franchise outlets and analyze closure reasons for insights
          </p>
        </div>
        <Button>
          <FileText className="w-4 h-4 mr-2" />
          Closure Analysis Report
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Closed</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{closureStats.total}</p>
            </div>
            <XCircle className="w-6 h-6 text-red-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Budget Empty</p>
              <p className="text-2xl font-bold text-red-600">{closureStats.budgetEmpty}</p>
            </div>
            <DollarSign className="w-6 h-6 text-red-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Poor Performance</p>
              <p className="text-2xl font-bold text-orange-600">{closureStats.poorPerformance}</p>
            </div>
            <TrendingDown className="w-6 h-6 text-orange-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Personal Reasons</p>
              <p className="text-2xl font-bold text-blue-600">{closureStats.personalReasons}</p>
            </div>
            <User className="w-6 h-6 text-blue-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Lease Issues</p>
              <p className="text-2xl font-bold text-purple-600">{closureStats.leaseIssues}</p>
            </div>
            <Building2 className="w-6 h-6 text-purple-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Investment</p>
              <p className="text-lg font-bold text-purple-600">{formatCurrency(closureStats.totalInvestment)}</p>
            </div>
            <DollarSign className="w-6 h-6 text-purple-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Loss</p>
              <p className="text-lg font-bold text-red-600">{formatCurrency(closureStats.totalLoss)}</p>
            </div>
            <TrendingDown className="w-6 h-6 text-red-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Duration</p>
              <p className="text-2xl font-bold text-gray-600">{closureStats.avgOperationalPeriod.toFixed(0)}m</p>
            </div>
            <Clock className="w-6 h-6 text-gray-500" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search closed franchises..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={reasonFilter}
              onChange={(e) => setReasonFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Reasons</option>
              <option value="budget_empty">Budget Empty</option>
              <option value="poor_performance">Poor Performance</option>
              <option value="market_conditions">Market Conditions</option>
              <option value="personal_reasons">Personal Reasons</option>
              <option value="lease_issues">Lease Issues</option>
              <option value="regulatory_issues">Regulatory Issues</option>
              <option value="other">Other</option>
            </select>
            <select
              value={documentsFilter}
              onChange={(e) => setDocumentsFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Documents</option>
              <option value="complete">Complete</option>
              <option value="partial">Partial</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Closed Franchises List */}
      <div className="space-y-4">
        {filteredFranchises.map((franchise) => (
          <Card key={franchise.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  {getReasonIcon(franchise.closureReason)}
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {franchise.outletName}
                  </h3>
                  <Badge variant="outline" className="text-xs font-mono">
                    {franchise.id}
                  </Badge>
                  <Badge variant="outline" className={getReasonColor(franchise.closureReason)}>
                    {formatReason(franchise.closureReason)}
                  </Badge>
                  <Badge variant="outline" className={getDocumentsStatusColor(franchise.documentsStatus)}>
                    {franchise.documentsStatus} docs
                  </Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Franchisee</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{franchise.franchisee}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{franchise.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Operational Period</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{franchise.operationalPeriod} months</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Closure Date</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {new Date(franchise.closureDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Investment</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{formatCurrency(franchise.totalInvestment)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Revenue</p>
                    <p className="font-medium text-blue-600">{formatCurrency(franchise.totalRevenue)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Loss</p>
                    <p className="font-medium text-red-600">{formatCurrency(franchise.totalLoss)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Settlement Amount</p>
                    <p className="font-medium text-green-600">{formatCurrency(franchise.settlementAmount)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Assets Recovered</p>
                    <p className="font-medium text-green-600">{formatCurrency(franchise.assetsRecovered)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Liabilities</p>
                    <p className="font-medium text-red-600">{formatCurrency(franchise.liabilities)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Final Inspection</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{franchise.finalInspectionScore}/100</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Last Revenue</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{formatCurrency(franchise.lastMonthRevenue)}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Closure Notes</p>
                  <p className="text-gray-700 dark:text-gray-300">{franchise.closureNotes}</p>
                </div>

                {franchise.lessonsLearned.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-blue-700 dark:text-blue-400 mb-2">Lessons Learned</h4>
                    <div className="flex flex-wrap gap-2">
                      {franchise.lessonsLearned.map((lesson, index) => (
                        <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {lesson}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Launched: {new Date(franchise.launchDate).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    Manager: {franchise.manager}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {franchise.contactNumber}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
