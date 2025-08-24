"use client";

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Activity,
  Search,
  MapPin,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  Star,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Eye,
  Edit,
  MoreHorizontal,
  Phone,
  Mail,
  Clock
} from 'lucide-react';

interface LiveOutlet {
  id: string;
  outletName: string;
  brandName: string;
  franchisee: string;
  location: string;
  address: string;
  launchDate: string;
  status: 'excellent' | 'good' | 'average' | 'poor' | 'critical';
  monthlyRevenue: number;
  monthlyTarget: number;
  revenueGrowth: number;
  customerRating: number;
  totalCustomers: number;
  staffCount: number;
  operatingHours: string;
  contactNumber: string;
  email: string;
  manager: string;
  lastInspection: string;
  inspectionScore: number;
  issues: string[];
  achievements: string[];
  monthlyExpenses: number;
  profitMargin: number;
}

const liveOutlets: LiveOutlet[] = [
  {
    id: 'OUT-001',
    outletName: 'QuickBite Express - Andheri West',
    brandName: 'QuickBite Express',
    franchisee: 'Rohit Sharma',
    location: 'Andheri West, Mumbai',
    address: 'Shop 12, Lokhandwala Complex, Andheri West, Mumbai - 400053',
    launchDate: '2024-08-10',
    status: 'excellent',
    monthlyRevenue: 485000,
    monthlyTarget: 450000,
    revenueGrowth: 12.5,
    customerRating: 4.7,
    totalCustomers: 1250,
    staffCount: 8,
    operatingHours: '10:00 AM - 11:00 PM',
    contactNumber: '+91 98765 43210',
    email: 'andheri@quickbite.com',
    manager: 'Priya Patel',
    lastInspection: '2024-08-20',
    inspectionScore: 95,
    issues: [],
    achievements: ['Exceeded monthly target', 'Customer satisfaction above 4.5', 'Zero safety incidents'],
    monthlyExpenses: 320000,
    profitMargin: 34.0
  },
  {
    id: 'OUT-002',
    outletName: 'FitZone Gym - Bandra',
    brandName: 'FitZone Gym',
    franchisee: 'Priya Patel',
    location: 'Bandra, Mumbai',
    address: '2nd Floor, Hill Road, Bandra West, Mumbai - 400050',
    launchDate: '2024-07-15',
    status: 'good',
    monthlyRevenue: 280000,
    monthlyTarget: 300000,
    revenueGrowth: 8.2,
    customerRating: 4.3,
    totalCustomers: 180,
    staffCount: 6,
    operatingHours: '6:00 AM - 10:00 PM',
    contactNumber: '+91 87654 32109',
    email: 'bandra@fitzone.com',
    manager: 'Amit Kumar',
    lastInspection: '2024-08-18',
    inspectionScore: 88,
    issues: ['Equipment maintenance needed', 'AC repair required'],
    achievements: ['New member acquisition target met', 'Staff training completed'],
    monthlyExpenses: 195000,
    profitMargin: 30.4
  },
  {
    id: 'OUT-003',
    outletName: 'EduSmart Learning - Koramangala',
    brandName: 'EduSmart Learning',
    franchisee: 'Dr. Sunita Rao',
    location: 'Koramangala, Bangalore',
    address: '1st Floor, Forum Mall, Koramangala, Bangalore - 560034',
    launchDate: '2024-06-01',
    status: 'excellent',
    monthlyRevenue: 420000,
    monthlyTarget: 380000,
    revenueGrowth: 15.8,
    customerRating: 4.8,
    totalCustomers: 95,
    staffCount: 12,
    operatingHours: '9:00 AM - 8:00 PM',
    contactNumber: '+91 65432 10987',
    email: 'koramangala@edusmart.com',
    manager: 'Karthik Menon',
    lastInspection: '2024-08-22',
    inspectionScore: 97,
    issues: [],
    achievements: ['Highest customer satisfaction', 'Revenue growth above 15%', 'Perfect inspection score'],
    monthlyExpenses: 285000,
    profitMargin: 32.1
  },
  {
    id: 'OUT-004',
    outletName: 'CleanCare Services - T. Nagar',
    brandName: 'CleanCare Services',
    franchisee: 'Karthik Menon',
    location: 'T. Nagar, Chennai',
    address: 'Ground Floor, Pondy Bazaar, T. Nagar, Chennai - 600017',
    launchDate: '2024-05-20',
    status: 'poor',
    monthlyRevenue: 85000,
    monthlyTarget: 150000,
    revenueGrowth: -8.5,
    customerRating: 3.2,
    totalCustomers: 45,
    staffCount: 4,
    operatingHours: '8:00 AM - 6:00 PM',
    contactNumber: '+91 54321 09876',
    email: 'tnagar@cleancare.com',
    manager: 'Meera Singh',
    lastInspection: '2024-08-15',
    inspectionScore: 65,
    issues: ['Low customer retention', 'Staff shortage', 'Equipment issues', 'Marketing needed'],
    achievements: [],
    monthlyExpenses: 95000,
    profitMargin: -11.8
  },
  {
    id: 'OUT-005',
    outletName: 'TechRepair Hub - Whitefield',
    brandName: 'TechRepair Hub',
    franchisee: 'Amit Kumar',
    location: 'Whitefield, Bangalore',
    address: 'Shop 5, ITPL Main Road, Whitefield, Bangalore - 560066',
    launchDate: '2024-07-01',
    status: 'average',
    monthlyRevenue: 125000,
    monthlyTarget: 140000,
    revenueGrowth: 3.2,
    customerRating: 4.0,
    totalCustomers: 85,
    staffCount: 3,
    operatingHours: '10:00 AM - 8:00 PM',
    contactNumber: '+91 76543 21098',
    email: 'whitefield@techrepair.com',
    manager: 'Rajesh Kumar',
    lastInspection: '2024-08-10',
    inspectionScore: 78,
    issues: ['Slow service delivery', 'Inventory management'],
    achievements: ['Customer base growing steadily'],
    monthlyExpenses: 98000,
    profitMargin: 21.6
  }
];

export default function OngoingPage() {
  const [outlets, setOutlets] = useState<LiveOutlet[]>(liveOutlets);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [locationFilter, setLocationFilter] = useState<string>('all');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'good':
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case 'average':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'poor':
        return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case 'critical':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'good':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'average':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'poor':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredOutlets = outlets.filter(outlet => {
    const matchesSearch = outlet.outletName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         outlet.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         outlet.franchisee.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         outlet.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || outlet.status === statusFilter;
    const matchesLocation = locationFilter === 'all' || outlet.location.includes(locationFilter);

    return matchesSearch && matchesStatus && matchesLocation;
  });

  const outletStats = {
    total: outlets.length,
    excellent: outlets.filter(o => o.status === 'excellent').length,
    good: outlets.filter(o => o.status === 'good').length,
    average: outlets.filter(o => o.status === 'average').length,
    poor: outlets.filter(o => o.status === 'poor').length,
    critical: outlets.filter(o => o.status === 'critical').length,
    totalRevenue: outlets.reduce((sum, o) => sum + o.monthlyRevenue, 0),
    totalTarget: outlets.reduce((sum, o) => sum + o.monthlyTarget, 0),
    avgRating: outlets.reduce((sum, o) => sum + o.customerRating, 0) / outlets.length,
    totalCustomers: outlets.reduce((sum, o) => sum + o.totalCustomers, 0),
  };

  const locations = [...new Set(outlets.map(o => o.location.split(',')[1]?.trim() || o.location))];

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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Ongoing Live Outlets</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor performance and operations of all active franchise outlets
          </p>
        </div>
        <Button>
          <Activity className="w-4 h-4 mr-2" />
          Performance Report
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Outlets</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{outletStats.total}</p>
            </div>
            <Activity className="w-6 h-6 text-blue-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Excellent</p>
              <p className="text-2xl font-bold text-green-600">{outletStats.excellent}</p>
            </div>
            <CheckCircle className="w-6 h-6 text-green-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Good</p>
              <p className="text-2xl font-bold text-blue-600">{outletStats.good}</p>
            </div>
            <CheckCircle className="w-6 h-6 text-blue-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Average</p>
              <p className="text-2xl font-bold text-yellow-600">{outletStats.average}</p>
            </div>
            <AlertTriangle className="w-6 h-6 text-yellow-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Poor</p>
              <p className="text-2xl font-bold text-orange-600">{outletStats.poor}</p>
            </div>
            <AlertTriangle className="w-6 h-6 text-orange-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
              <p className="text-lg font-bold text-green-600">{formatCurrency(outletStats.totalRevenue)}</p>
            </div>
            <DollarSign className="w-6 h-6 text-green-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Rating</p>
              <p className="text-2xl font-bold text-yellow-600">{outletStats.avgRating.toFixed(1)}</p>
            </div>
            <Star className="w-6 h-6 text-yellow-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Customers</p>
              <p className="text-2xl font-bold text-purple-600">{outletStats.totalCustomers}</p>
            </div>
            <Users className="w-6 h-6 text-purple-500" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search outlets..."
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
              <option value="excellent">Excellent</option>
              <option value="good">Good</option>
              <option value="average">Average</option>
              <option value="poor">Poor</option>
              <option value="critical">Critical</option>
            </select>
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Locations</option>
              {locations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Outlets List */}
      <div className="space-y-4">
        {filteredOutlets.map((outlet) => (
          <Card key={outlet.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  {getStatusIcon(outlet.status)}
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {outlet.outletName}
                  </h3>
                  <Badge variant="outline" className="text-xs font-mono">
                    {outlet.id}
                  </Badge>
                  <Badge variant="outline" className={getStatusColor(outlet.status)}>
                    {outlet.status}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">{outlet.customerRating}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Franchisee</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{outlet.franchisee}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Manager</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{outlet.manager}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{outlet.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Launch Date</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {new Date(outlet.launchDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Monthly Revenue</p>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900 dark:text-gray-100">{formatCurrency(outlet.monthlyRevenue)}</p>
                      <div className="flex items-center gap-1">
                        {outlet.revenueGrowth >= 0 ? (
                          <TrendingUp className="w-4 h-4 text-green-500" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-500" />
                        )}
                        <span className={`text-sm font-medium ${
                          outlet.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {outlet.revenueGrowth > 0 ? '+' : ''}{outlet.revenueGrowth}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Target Achievement</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {((outlet.monthlyRevenue / outlet.monthlyTarget) * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Profit Margin</p>
                    <p className={`font-medium ${
                      outlet.profitMargin >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {outlet.profitMargin}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Customers</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{outlet.totalCustomers}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Staff Count</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{outlet.staffCount}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Operating Hours</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{outlet.operatingHours}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Last Inspection</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {new Date(outlet.lastInspection).toLocaleDateString()} ({outlet.inspectionScore}/100)
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Contact</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{outlet.contactNumber}</p>
                  </div>
                </div>

                {outlet.issues.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-red-700 dark:text-red-400 mb-2">Issues</h4>
                    <div className="flex flex-wrap gap-2">
                      {outlet.issues.map((issue, index) => (
                        <Badge key={index} variant="outline" className="bg-red-50 text-red-700 border-red-200">
                          {issue}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {outlet.achievements.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-green-700 dark:text-green-400 mb-2">Achievements</h4>
                    <div className="flex flex-wrap gap-2">
                      {outlet.achievements.map((achievement, index) => (
                        <Badge key={index} variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          {achievement}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {outlet.address}
                  </div>
                  <div className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    {outlet.email}
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
