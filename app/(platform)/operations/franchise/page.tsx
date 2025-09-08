"use client";

import React, { useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import StatusBadge from '@/components/shared/StatusBadge';
import FilterPanel, { FilterOption, FilterValue } from '@/components/shared/FilterPanel';
import DataTable, { Column } from '@/components/shared/DataTable';
import ExportButton from '@/components/shared/ExportButton';
import { 
  Building2, 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  Plus,
  MapPin,
  DollarSign,
  TrendingUp,
  Users,
  Calendar,
  MoreHorizontal,
  Eye,
  Edit,
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import { useGlobalCurrency } from '@/contexts/GlobalCurrencyContext';

type ViewMode = 'gallery' | 'database';

export default function FranchiseOperationsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('gallery');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterValue>({});
  const [showFilters, setShowFilters] = useState(false);

  const { formatAmount } = useGlobalCurrency();

  // Fetch franchise operations data
  const franchiseOperations = useQuery(api.franchiseOperations.listWithFranchiseDetails, {
    limit: 50,
  });

  const franchises = useQuery(api.franchise.list);

  const filterOptions: FilterOption[] = [
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'Pending Approval', label: 'Pending Approval' },
        { value: 'Approved', label: 'Approved' },
        { value: 'Funding', label: 'Funding' },
        { value: 'Launching', label: 'Launching' },
        { value: 'Active', label: 'Active' },
        { value: 'Closed', label: 'Closed' },
        { value: 'Suspended', label: 'Suspended' },
      ],
    },
    {
      key: 'operationalStatus',
      label: 'Operational Status',
      type: 'select',
      options: [
        { value: 'setup', label: 'Setup' },
        { value: 'training', label: 'Training' },
        { value: 'operational', label: 'Operational' },
        { value: 'maintenance', label: 'Maintenance' },
        { value: 'suspended', label: 'Suspended' },
      ],
    },
    {
      key: 'investmentRange',
      label: 'Investment Range',
      type: 'range',
      min: 0,
      max: 10000000,
    },
    {
      key: 'complianceScore',
      label: 'Compliance Score',
      type: 'range',
      min: 0,
      max: 100,
    },
  ];

  // Filter and search logic
  const filteredFranchises = (franchises || []).filter(franchise => {
    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        franchise.building.toLowerCase().includes(searchLower) ||
        franchise.locationAddress.toLowerCase().includes(searchLower) ||
        franchise.status.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }

    // Status filter
    if (filters.status && franchise.status !== filters.status) {
      return false;
    }

    // Investment range filter
    if (filters.investmentRange) {
      const range = filters.investmentRange;
      if (range.min && franchise.totalInvestment < parseInt(range.min)) return false;
      if (range.max && franchise.totalInvestment > parseInt(range.max)) return false;
    }

    return true;
  });

  const FranchiseCard = ({ franchise }: { franchise: any }) => {
    const operations = franchiseOperations?.find(op => op.franchiseId === franchise._id);
    
    return (
      <Card className="group relative overflow-hidden bg-white dark:bg-gray-800 hover:shadow-lg transition-all duration-200 cursor-pointer">
        <Link href={`/operations/franchise/${franchise._id}/manage`}>
          {/* Cover Image */}
          <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 relative overflow-hidden">
            {franchise.coverImage ? (
              <Image
                src={franchise.coverImage}
                alt={franchise.building}
                fill
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Building2 className="h-12 w-12 text-white/80" />
              </div>
            )}
            
            {/* Status Badge - Top Right */}
            <div className="absolute top-3 right-3">
              <StatusBadge status={franchise.status} />
            </div>

            {/* Operational Status - Top Left */}
            {operations && (
              <div className="absolute top-3 left-3">
                <StatusBadge status={operations.operationalStatus} size="sm" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                  {franchise.building}
                </h3>
              </div>
              
              <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>

            {/* Location */}
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {franchise.locationAddress}
              </span>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  {formatAmount(franchise.totalInvestment)}
                </div>
                <div className="text-xs text-gray-500">Investment</div>
              </div>
              
              {operations && (
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    {operations.complianceScore}%
                  </div>
                  <div className="text-xs text-gray-500">Compliance</div>
                </div>
              )}
            </div>

            {/* Performance Indicators */}
            {operations && (
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  <span>{formatAmount(operations.performanceMetrics.monthlyRevenue)}/mo</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  <span>{operations.performanceMetrics.staffCount} staff</span>
                </div>
              </div>
            )}
          </div>
        </Link>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Building2 className="h-8 w-8 text-green-600" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Franchise
              </h1>
            </div>

            <div className="flex items-center gap-3">
              {/* View Mode Toggle */}
              <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <Button
                  variant={viewMode === 'gallery' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('gallery')}
                  className="h-8 px-3"
                >
                  <Grid3X3 className="h-4 w-4" />
                  Gallery
                </Button>
                <Button
                  variant={viewMode === 'database' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('database')}
                  className="h-8 px-3"
                >
                  <List className="h-4 w-4" />
                  Database
                </Button>
              </div>

              {/* Action Buttons */}
              <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search franchises..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mb-6">
            <FilterPanel
              filters={filterOptions}
              values={filters}
              onChange={setFilters}
              onReset={() => setFilters({})}
              showSearch={false}
            />
          </div>
        )}

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredFranchises.length} of {franchises?.length || 0} franchises
          </p>
        </div>

        {/* Gallery View */}
        {viewMode === 'gallery' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredFranchises.map((franchise) => (
              <FranchiseCard key={franchise._id} franchise={franchise} />
            ))}
          </div>
        )}

        {/* Database View */}
        {viewMode === 'database' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <DataTable
              data={filteredFranchises}
              columns={[
                {
                  key: 'building',
                  label: 'Franchise Name',
                  sortable: true,
                  render: (value, row) => (
                    <div className="flex items-center gap-3">
                      <Building2 className="h-5 w-5 text-gray-500" />
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {value}
                        </div>
                        <div className="text-sm text-gray-500">
                          {row.locationAddress}
                        </div>
                      </div>
                    </div>
                  ),
                },
                {
                  key: 'status',
                  label: 'Status',
                  sortable: true,
                  filterable: true,
                  render: (value) => <StatusBadge status={value} />,
                },
                {
                  key: 'totalInvestment',
                  label: 'Investment',
                  sortable: true,
                  align: 'right',
                  render: (value) => formatAmount(value),
                },
                {
                  key: 'carpetArea',
                  label: 'Area (sq ft)',
                  sortable: true,
                  align: 'right',
                  render: (value) => value.toLocaleString(),
                },
                {
                  key: 'createdAt',
                  label: 'Created',
                  sortable: true,
                  render: (value) => new Date(value).toLocaleDateString(),
                },
                {
                  key: 'actions',
                  label: 'Actions',
                  render: (_, row) => (
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/operations/franchise/${row._id}/manage`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  ),
                },
              ]}
              searchable={false} // We handle search externally
              onRowClick={(row) => window.open(`/operations/franchise/${row._id}/manage`, '_blank')}
              onExport={() => {
                // Export functionality
                console.log('Exporting franchise data...');
              }}
            />
          </div>
        )}

        {/* Empty State */}
        {filteredFranchises.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No franchises found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {searchTerm || Object.keys(filters).length > 0
                ? "Try adjusting your search or filters"
                : "Get started by creating your first franchise"
              }
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Franchise
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
