"use client";

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Database,
  Server,
  Activity,
  HardDrive,
  Users,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Zap,
  Shield,
  RefreshCw
} from 'lucide-react';

interface DatabaseInfo {
  id: string;
  name: string;
  type: string;
  status: 'healthy' | 'warning' | 'critical' | 'maintenance';
  size: string;
  tables: number;
  connections: number;
  maxConnections: number;
  uptime: string;
  lastBackup: string;
  version: string;
  location: string;
}

interface DatabaseMetric {
  name: string;
  value: string;
  change: number;
  status: 'good' | 'warning' | 'critical';
  icon: React.ComponentType<any>;
}

const databases: DatabaseInfo[] = [
  {
    id: 'convex-main',
    name: 'Convex Main Database',
    type: 'Convex',
    status: 'healthy',
    size: '2.4 GB',
    tables: 12,
    connections: 45,
    maxConnections: 100,
    uptime: '99.9%',
    lastBackup: '2024-08-26T02:00:00Z',
    version: '1.0.0',
    location: 'US-East'
  },
  {
    id: 'redis-cache',
    name: 'Redis Cache',
    type: 'Redis',
    status: 'healthy',
    size: '512 MB',
    tables: 0,
    connections: 12,
    maxConnections: 50,
    uptime: '99.8%',
    lastBackup: '2024-08-26T01:00:00Z',
    version: '7.0.0',
    location: 'US-East'
  },
  {
    id: 'analytics-db',
    name: 'Analytics Database',
    type: 'PostgreSQL',
    status: 'warning',
    size: '1.8 GB',
    tables: 8,
    connections: 28,
    maxConnections: 30,
    uptime: '99.5%',
    lastBackup: '2024-08-25T23:00:00Z',
    version: '15.0',
    location: 'US-West'
  }
];

const metrics: DatabaseMetric[] = [
  {
    name: 'Total Storage Used',
    value: '4.7 GB',
    change: 12.5,
    status: 'good',
    icon: HardDrive
  },
  {
    name: 'Active Connections',
    value: '85',
    change: -5.2,
    status: 'good',
    icon: Users
  },
  {
    name: 'Queries per Second',
    value: '1,247',
    change: 18.3,
    status: 'good',
    icon: Zap
  },
  {
    name: 'Average Response Time',
    value: '45ms',
    change: -8.1,
    status: 'good',
    icon: Clock
  },
  {
    name: 'Error Rate',
    value: '0.02%',
    change: -15.4,
    status: 'good',
    icon: AlertTriangle
  },
  {
    name: 'Cache Hit Rate',
    value: '94.2%',
    change: 2.1,
    status: 'good',
    icon: TrendingUp
  }
];

export default function DatabasesPage() {
  const [selectedDatabase, setSelectedDatabase] = useState<string>('all');
  const [refreshing, setRefreshing] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'critical':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'maintenance':
        return <Clock className="w-4 h-4 text-blue-500" />;
      default:
        return <Database className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'maintenance':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getMetricStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'text-green-600';
      case 'warning':
        return 'text-yellow-600';
      case 'critical':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setRefreshing(false);
  };

  const filteredDatabases = selectedDatabase === 'all' 
    ? databases 
    : databases.filter(db => db.id === selectedDatabase);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Database Reports</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor database performance, health, and usage statistics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={selectedDatabase}
            onChange={(e) => setSelectedDatabase(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Databases</option>
            {databases.map(db => (
              <option key={db.id} value={db.id}>{db.name}</option>
            ))}
          </select>
          <Button onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((metric, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <metric.icon className="w-5 h-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {metric.name}
                </span>
              </div>
              <div className={`flex items-center gap-1 text-sm ${getMetricStatusColor(metric.status)}`}>
                {metric.change > 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                {Math.abs(metric.change)}%
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {metric.value}
            </div>
          </Card>
        ))}
      </div>

      {/* Database Status Cards */}
      <div className="grid gap-6">
        {filteredDatabases.map((database) => (
          <Card key={database.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Database className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    {database.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {database.type} • {database.version} • {database.location}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(database.status)}
                <Badge variant="outline" className={getStatusColor(database.status)}>
                  {database.status}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center p-3 bg-gray-50 dark:bg-stone-800 rounded-lg">
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {database.size}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Storage Used</div>
              </div>
              <div className="text-center p-3 bg-gray-50 dark:bg-stone-800 rounded-lg">
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {database.tables}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Tables</div>
              </div>
              <div className="text-center p-3 bg-gray-50 dark:bg-stone-800 rounded-lg">
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {database.connections}/{database.maxConnections}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Connections</div>
              </div>
              <div className="text-center p-3 bg-gray-50 dark:bg-stone-800 rounded-lg">
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {database.uptime}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Uptime</div>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Shield className="w-4 h-4" />
                Last Backup: {new Date(database.lastBackup).toLocaleString()}
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <BarChart3 className="w-4 h-4 mr-1" />
                  View Details
                </Button>
                <Button variant="outline" size="sm">
                  <Server className="w-4 h-4 mr-1" />
                  Manage
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
