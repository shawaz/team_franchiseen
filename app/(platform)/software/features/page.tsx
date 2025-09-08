"use client";

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Plus,
  Search,
  ExternalLink,
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
  Zap,
  Globe,
  Code,
  Users,
  Shield,
  DollarSign
} from 'lucide-react';

interface Feature {
  id: string;
  name: string;
  description: string;
  status: 'live' | 'development' | 'testing' | 'planned' | 'deprecated';
  category: string;
  url?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  completionPercentage: number;
  lastUpdated: string;
}

const websiteFeatures: Feature[] = [
  {
    id: '1',
    name: 'User Authentication & Registration',
    description: 'Complete user authentication system with email verification, role-based access control, and secure login/logout functionality',
    status: 'live',
    category: 'Authentication',
    url: '/auth/signin',
    priority: 'critical',
    completionPercentage: 100,
    lastUpdated: '2024-08-25'
  },
  {
    id: '2',
    name: 'Admin Dashboard',
    description: 'Comprehensive admin dashboard with sidebar navigation, permission-based access, and management tools',
    status: 'development',
    category: 'Admin',
    url: '/admin/dashboard',
    priority: 'high',
    completionPercentage: 85,
    lastUpdated: '2024-08-26'
  },
  {
    id: '3',
    name: 'Business Registration Portal',
    description: 'Complete business registration system with document upload, verification workflow, and approval process',
    status: 'planned',
    category: 'Business',
    url: '/register',
    priority: 'high',
    completionPercentage: 20,
    lastUpdated: '2024-08-20'
  },
  {
    id: '4',
    name: 'Franchise Marketplace',
    description: 'Marketplace for browsing and investing in franchise opportunities with detailed business profiles',
    status: 'development',
    category: 'Marketplace',
    url: '/marketplace',
    priority: 'high',
    completionPercentage: 60,
    lastUpdated: '2024-08-24'
  },
  {
    id: '5',
    name: 'Payment Integration (Solana Pay)',
    description: 'Cryptocurrency payment system using Solana Pay for secure and fast transactions',
    status: 'planned',
    category: 'Payments',
    priority: 'critical',
    completionPercentage: 0,
    lastUpdated: '2024-08-15'
  },
  {
    id: '6',
    name: 'User Profile Management',
    description: 'Complete user profile system with personal information, preferences, and account settings',
    status: 'live',
    category: 'User Management',
    url: '/profile',
    priority: 'medium',
    completionPercentage: 100,
    lastUpdated: '2024-08-23'
  },
  {
    id: '7',
    name: 'Team Management System',
    description: 'Role-based team management with user permissions, access control, and team collaboration tools',
    status: 'live',
    category: 'Admin',
    url: '/admin/teams',
    priority: 'high',
    completionPercentage: 100,
    lastUpdated: '2024-08-26'
  },
  {
    id: '8',
    name: 'Real-time Notifications',
    description: 'Push notifications for important events, updates, and user interactions',
    status: 'planned',
    category: 'Communication',
    priority: 'medium',
    completionPercentage: 0,
    lastUpdated: '2024-08-10'
  },
  {
    id: '9',
    name: 'Analytics Dashboard',
    description: 'Comprehensive analytics and reporting dashboard with charts, metrics, and insights',
    status: 'testing',
    category: 'Analytics',
    url: '/admin/analytics',
    priority: 'medium',
    completionPercentage: 75,
    lastUpdated: '2024-08-22'
  },
  {
    id: '10',
    name: 'Mobile Responsive Design',
    description: 'Fully responsive design optimized for mobile devices and tablets',
    status: 'live',
    category: 'UI/UX',
    priority: 'high',
    completionPercentage: 95,
    lastUpdated: '2024-08-25'
  },
  {
    id: '11',
    name: 'Dark Mode Support',
    description: 'Complete dark mode theme with automatic detection and manual toggle',
    status: 'live',
    category: 'UI/UX',
    priority: 'low',
    completionPercentage: 100,
    lastUpdated: '2024-08-24'
  },
  {
    id: '12',
    name: 'Multi-language Support',
    description: 'Internationalization support with multiple language options',
    status: 'planned',
    category: 'Localization',
    priority: 'medium',
    completionPercentage: 0,
    lastUpdated: '2024-08-05'
  }
];

export default function FeaturesPage() {
  const [features, setFeatures] = useState<Feature[]>(websiteFeatures);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'live':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'development':
        return <Code className="w-4 h-4 text-blue-500" />;
      case 'testing':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'planned':
        return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case 'deprecated':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'development':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'testing':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'planned':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'deprecated':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'authentication':
        return <Shield className="w-4 h-4" />;
      case 'admin':
        return <Users className="w-4 h-4" />;
      case 'payments':
        return <DollarSign className="w-4 h-4" />;
      case 'ui/ux':
        return <Zap className="w-4 h-4" />;
      default:
        return <Globe className="w-4 h-4" />;
    }
  };

  const filteredFeatures = features.filter(feature => {
    const matchesSearch = feature.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         feature.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         feature.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || feature.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || feature.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const featureStats = {
    total: features.length,
    live: features.filter(f => f.status === 'live').length,
    development: features.filter(f => f.status === 'development').length,
    testing: features.filter(f => f.status === 'testing').length,
    planned: features.filter(f => f.status === 'planned').length,
    deprecated: features.filter(f => f.status === 'deprecated').length,
  };

  const categories = [...new Set(features.map(f => f.category))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Website Features</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Complete list of all website features with their current status and links
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Feature
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{featureStats.total}</p>
            </div>
            <Zap className="w-6 h-6 text-blue-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Live</p>
              <p className="text-2xl font-bold text-green-600">{featureStats.live}</p>
            </div>
            <CheckCircle className="w-6 h-6 text-green-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Development</p>
              <p className="text-2xl font-bold text-blue-600">{featureStats.development}</p>
            </div>
            <Code className="w-6 h-6 text-blue-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Testing</p>
              <p className="text-2xl font-bold text-yellow-600">{featureStats.testing}</p>
            </div>
            <Clock className="w-6 h-6 text-yellow-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Planned</p>
              <p className="text-2xl font-bold text-orange-600">{featureStats.planned}</p>
            </div>
            <AlertTriangle className="w-6 h-6 text-orange-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Deprecated</p>
              <p className="text-2xl font-bold text-red-600">{featureStats.deprecated}</p>
            </div>
            <XCircle className="w-6 h-6 text-red-500" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search features..."
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
              <option value="live">Live</option>
              <option value="development">Development</option>
              <option value="testing">Testing</option>
              <option value="planned">Planned</option>
              <option value="deprecated">Deprecated</option>
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

      {/* Features List */}
      <div className="grid gap-4">
        {filteredFeatures.map((feature) => (
          <Card key={feature.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  {getStatusIcon(feature.status)}
                  {getCategoryIcon(feature.category)}
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {feature.name}
                  </h3>
                  <Badge variant="outline" className={getStatusColor(feature.status)}>
                    {feature.status}
                  </Badge>
                  <Badge variant="outline" className={getPriorityColor(feature.priority)}>
                    {feature.priority}
                  </Badge>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {feature.description}
                </p>
                <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400 mb-3">
                  <div className="flex items-center gap-1">
                    <span className="font-medium">Category:</span>
                    {feature.category}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-medium">Last Updated:</span>
                    {new Date(feature.lastUpdated).toLocaleDateString()}
                  </div>
                  {feature.url && (
                    <div className="flex items-center gap-1">
                      <Globe className="w-4 h-4" />
                      <a
                        href={feature.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1"
                      >
                        View Feature
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
                {feature.completionPercentage > 0 && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600 dark:text-gray-400">Completion</span>
                      <span className="font-medium">{feature.completionPercentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          feature.completionPercentage === 100 ? 'bg-green-600' : 'bg-blue-600'
                        }`}
                        style={{ width: `${feature.completionPercentage}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
