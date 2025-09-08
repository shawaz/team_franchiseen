"use client";

import React, { useState, use } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StatsCard from '@/components/shared/StatsCard';
import StatusBadge from '@/components/shared/StatusBadge';
import ProgressBar from '@/components/shared/ProgressBar';
import { 
  ArrowLeft,
  Building2, 
  TrendingUp,
  DollarSign,
  Users,
  Shield,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  Mail,
  Edit,
  Settings,
  FileText,
  BarChart3,
  Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useGlobalCurrency } from '@/contexts/GlobalCurrencyContext';

interface FranchiseManagePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function FranchiseManagePage({ params }: FranchiseManagePageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { formatAmount } = useGlobalCurrency();
  const [activeTab, setActiveTab] = useState('overview');

  const franchiseId = id as Id<"franchise">;

  // Fetch franchise data
  const franchise = useQuery(api.franchise.getById, { franchiseId });
  const operations = useQuery(api.franchiseOperations.getByFranchiseId, { franchiseId });
  const business = useQuery(
    api.businesses.getById,
    franchise ? { businessId: franchise.businessId } : "skip"
  );

  // Mutations
  const updateOperationalStatus = useMutation(api.franchiseOperations.updateOperationalStatus);
  const updatePerformanceMetrics = useMutation(api.franchiseOperations.updatePerformanceMetrics);

  if (!franchise || !business) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading franchise details...</p>
        </div>
      </div>
    );
  }

  const performanceMetrics: {
    monthlyRevenue: number;
    monthlyExpenses: number;
    customerSatisfaction: number;
    staffCount: number;
    operationalEfficiency: number;
  } = (operations && 'performanceMetrics' in operations)
    ? operations.performanceMetrics as any
    : {
        monthlyRevenue: 0,
        monthlyExpenses: 0,
        customerSatisfaction: 0,
        staffCount: 0,
        operationalEfficiency: 0,
      };

  const complianceScore: number = (operations && 'complianceScore' in operations) ? operations.complianceScore as number : 0;
  const operationalStatus: string = (operations && 'operationalStatus' in operations) ? operations.operationalStatus as string : 'setup';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/operations/franchise')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Franchises
              </Button>
              
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />
              
              <div className="flex items-center gap-3">
                <Building2 className="h-6 w-6 text-blue-600" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                    {franchise.building}
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {business.name}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <StatusBadge status={franchise.status} />
              <StatusBadge status={operationalStatus} />
              
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="operations">Operations</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard
                title="Monthly Revenue"
                value={formatAmount(performanceMetrics.monthlyRevenue)}
                icon={DollarSign}
                color="green"
                trend={{
                  value: 12.5,
                  isPositive: true,
                  label: "vs last month"
                }}
              />
              
              <StatsCard
                title="Monthly Expenses"
                value={formatAmount(performanceMetrics.monthlyExpenses)}
                icon={TrendingUp}
                color="red"
                trend={{
                  value: 3.2,
                  isPositive: false,
                  label: "vs last month"
                }}
              />
              
              <StatsCard
                title="Staff Count"
                value={performanceMetrics.staffCount}
                icon={Users}
                color="blue"
              />
              
              <StatsCard
                title="Compliance Score"
                value={`${complianceScore}%`}
                icon={Shield}
                color={complianceScore >= 80 ? 'green' : complianceScore >= 60 ? 'amber' : 'red'}
              />
            </div>

            {/* Franchise Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Franchise Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {franchise.locationAddress}
                      </p>
                      <p className="text-sm text-gray-500">Location</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Building2 className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {franchise.carpetArea} sq ft
                      </p>
                      <p className="text-sm text-gray-500">Carpet Area</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {formatAmount(franchise.totalInvestment)}
                      </p>
                      <p className="text-sm text-gray-500">Total Investment</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {new Date(franchise.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-500">Created Date</p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Performance Overview
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Customer Satisfaction
                      </span>
                      <span className="text-sm text-gray-500">
                        {performanceMetrics.customerSatisfaction}%
                      </span>
                    </div>
                    <ProgressBar
                      value={performanceMetrics.customerSatisfaction}
                      color="green"
                      size="sm"
                    />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Operational Efficiency
                      </span>
                      <span className="text-sm text-gray-500">
                        {performanceMetrics.operationalEfficiency}%
                      </span>
                    </div>
                    <ProgressBar
                      value={performanceMetrics.operationalEfficiency}
                      color="blue"
                      size="sm"
                    />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Compliance Score
                      </span>
                      <span className="text-sm text-gray-500">
                        {complianceScore}%
                      </span>
                    </div>
                    <ProgressBar
                      value={complianceScore}
                      color={complianceScore >= 80 ? 'green' : complianceScore >= 60 ? 'amber' : 'red'}
                      size="sm"
                    />
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Financial Performance
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {formatAmount(performanceMetrics.monthlyRevenue)}
                  </div>
                  <div className="text-sm text-gray-500">Monthly Revenue</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {formatAmount(performanceMetrics.monthlyExpenses)}
                  </div>
                  <div className="text-sm text-gray-500">Monthly Expenses</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {formatAmount(performanceMetrics.monthlyRevenue - performanceMetrics.monthlyExpenses)}
                  </div>
                  <div className="text-sm text-gray-500">Net Profit</div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Compliance Tab */}
          <TabsContent value="compliance" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Compliance Status
              </h3>
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  {complianceScore}%
                </div>
                <p className="text-gray-500">Overall Compliance Score</p>
                <ProgressBar
                  value={complianceScore}
                  color={complianceScore >= 80 ? 'green' : complianceScore >= 60 ? 'amber' : 'red'}
                  className="mt-4"
                />
              </div>
            </Card>
          </TabsContent>

          {/* Operations Tab */}
          <TabsContent value="operations" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Operational Status
              </h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Current Status</p>
                  <StatusBadge status={operationalStatus} size="md" />
                </div>
                <Button variant="outline">
                  Update Status
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
