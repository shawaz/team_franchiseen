"use client";

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Building2,
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  MapPin,
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
  Eye,
  Edit,
  MoreHorizontal
} from 'lucide-react';

interface Brand {
  id: string;
  name: string;
  category: string;
  status: 'active' | 'pending' | 'suspended' | 'closed';
  registrationDate: string;
  totalOutlets: number;
  activeOutlets: number;
  totalInvestment: number;
  monthlyRevenue: number;
  location: string;
  franchiseModel: string;
  contactPerson: string;
  email: string;
  phone: string;
}

const registeredBrands: Brand[] = [
  {
    id: 'BRD-001',
    name: 'QuickBite Express',
    category: 'Food & Beverage',
    status: 'active',
    registrationDate: '2024-01-15',
    totalOutlets: 12,
    activeOutlets: 10,
    totalInvestment: 2500000,
    monthlyRevenue: 450000,
    location: 'Mumbai, India',
    franchiseModel: 'Master Franchise',
    contactPerson: 'Rajesh Kumar',
    email: 'rajesh@quickbite.com',
    phone: '+91 98765 43210'
  },
  {
    id: 'BRD-002',
    name: 'FitZone Gym',
    category: 'Fitness & Wellness',
    status: 'active',
    registrationDate: '2024-02-20',
    totalOutlets: 8,
    activeOutlets: 7,
    totalInvestment: 1800000,
    monthlyRevenue: 320000,
    location: 'Delhi, India',
    franchiseModel: 'Unit Franchise',
    contactPerson: 'Priya Sharma',
    email: 'priya@fitzone.com',
    phone: '+91 87654 32109'
  },
  {
    id: 'BRD-003',
    name: 'TechRepair Hub',
    category: 'Technology Services',
    status: 'pending',
    registrationDate: '2024-03-10',
    totalOutlets: 0,
    activeOutlets: 0,
    totalInvestment: 500000,
    monthlyRevenue: 0,
    location: 'Bangalore, India',
    franchiseModel: 'Area Development',
    contactPerson: 'Amit Patel',
    email: 'amit@techrepair.com',
    phone: '+91 76543 21098'
  },
  {
    id: 'BRD-004',
    name: 'EduSmart Learning',
    category: 'Education',
    status: 'active',
    registrationDate: '2024-01-30',
    totalOutlets: 15,
    activeOutlets: 14,
    totalInvestment: 3200000,
    monthlyRevenue: 580000,
    location: 'Pune, India',
    franchiseModel: 'Master Franchise',
    contactPerson: 'Dr. Sunita Rao',
    email: 'sunita@edusmart.com',
    phone: '+91 65432 10987'
  },
  {
    id: 'BRD-005',
    name: 'CleanCare Services',
    category: 'Home Services',
    status: 'suspended',
    registrationDate: '2024-02-05',
    totalOutlets: 5,
    activeOutlets: 2,
    totalInvestment: 800000,
    monthlyRevenue: 85000,
    location: 'Chennai, India',
    franchiseModel: 'Unit Franchise',
    contactPerson: 'Karthik Menon',
    email: 'karthik@cleancare.com',
    phone: '+91 54321 09876'
  },
  {
    id: 'BRD-006',
    name: 'StyleCut Salon',
    category: 'Beauty & Personal Care',
    status: 'closed',
    registrationDate: '2023-11-20',
    totalOutlets: 3,
    activeOutlets: 0,
    totalInvestment: 600000,
    monthlyRevenue: 0,
    location: 'Hyderabad, India',
    franchiseModel: 'Unit Franchise',
    contactPerson: 'Meera Singh',
    email: 'meera@stylecut.com',
    phone: '+91 43210 98765'
  }
];

export default function OfficePage() {
  const [brands, setBrands] = useState<Brand[]>(registeredBrands);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'suspended':
        return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case 'closed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Building2 className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'suspended':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'closed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredBrands = brands.filter(brand => {
    const matchesSearch = brand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         brand.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         brand.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         brand.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || brand.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || brand.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const brandStats = {
    total: brands.length,
    active: brands.filter(b => b.status === 'active').length,
    pending: brands.filter(b => b.status === 'pending').length,
    suspended: brands.filter(b => b.status === 'suspended').length,
    closed: brands.filter(b => b.status === 'closed').length,
    totalOutlets: brands.reduce((sum, b) => sum + b.totalOutlets, 0),
    activeOutlets: brands.reduce((sum, b) => sum + b.activeOutlets, 0),
    totalInvestment: brands.reduce((sum, b) => sum + b.totalInvestment, 0),
    monthlyRevenue: brands.reduce((sum, b) => sum + b.monthlyRevenue, 0),
  };

  const categories = [...new Set(brands.map(b => b.category))];

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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Operations Office</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage all registered brands and franchise operations on the platform
          </p>
        </div>
        <Button>
          <Building2 className="w-4 h-4 mr-2" />
          Register New Brand
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Brands</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{brandStats.total}</p>
            </div>
            <Building2 className="w-6 h-6 text-blue-500" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active</p>
              <p className="text-2xl font-bold text-green-600">{brandStats.active}</p>
            </div>
            <CheckCircle className="w-6 h-6 text-green-500" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{brandStats.pending}</p>
            </div>
            <Clock className="w-6 h-6 text-yellow-500" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Suspended</p>
              <p className="text-2xl font-bold text-orange-600">{brandStats.suspended}</p>
            </div>
            <AlertTriangle className="w-6 h-6 text-orange-500" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Closed</p>
              <p className="text-2xl font-bold text-red-600">{brandStats.closed}</p>
            </div>
            <XCircle className="w-6 h-6 text-red-500" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Outlets</p>
              <p className="text-2xl font-bold text-blue-600">{brandStats.totalOutlets}</p>
            </div>
            <MapPin className="w-6 h-6 text-blue-500" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Outlets</p>
              <p className="text-2xl font-bold text-green-600">{brandStats.activeOutlets}</p>
            </div>
            <CheckCircle className="w-6 h-6 text-green-500" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Investment</p>
              <p className="text-lg font-bold text-purple-600">{formatCurrency(brandStats.totalInvestment)}</p>
            </div>
            <DollarSign className="w-6 h-6 text-purple-500" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search brands..."
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
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
              <option value="closed">Closed</option>
            </select>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Brands List */}
      <div className="space-y-4">
        {filteredBrands.map((brand) => (
          <Card key={brand.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  {getStatusIcon(brand.status)}
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {brand.name}
                  </h3>
                  <Badge variant="outline" className="text-xs font-mono">
                    {brand.id}
                  </Badge>
                  <Badge variant="outline" className={getStatusColor(brand.status)}>
                    {brand.status}
                  </Badge>
                  <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                    {brand.category}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Contact Person</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{brand.contactPerson}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{brand.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Franchise Model</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{brand.franchiseModel}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Registration Date</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {new Date(brand.registrationDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">
                      {brand.activeOutlets}/{brand.totalOutlets} Outlets Active
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">
                      Investment: {formatCurrency(brand.totalInvestment)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">
                      Monthly Revenue: {formatCurrency(brand.monthlyRevenue)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">
                      {brand.email} | {brand.phone}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4" />
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
