"use client";

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Plus,
  Search,
  Bug,
  AlertTriangle,
  XCircle,
  CheckCircle,
  Clock,
  User,
  Calendar,
  ExternalLink,
  Edit,
  MoreHorizontal
} from 'lucide-react';

interface BugReport {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in-progress' | 'resolved' | 'closed' | 'wont-fix';
  priority: 'low' | 'medium' | 'high' | 'critical';
  reporter: string;
  assignee?: string;
  dateReported: string;
  dateUpdated: string;
  category: string;
  reproductionSteps?: string[];
  environment: string;
  browserInfo?: string;
}

const bugReports: BugReport[] = [
  {
    id: 'BUG-001',
    title: 'Login form validation not working on mobile Safari',
    description: 'Email validation fails on mobile Safari browsers, allowing invalid emails to be submitted',
    severity: 'high',
    status: 'open',
    priority: 'high',
    reporter: 'John Doe',
    assignee: 'Shawaz Sharif',
    dateReported: '2024-08-25',
    dateUpdated: '2024-08-25',
    category: 'Authentication',
    environment: 'Production',
    browserInfo: 'Safari 17.0 on iOS 17.0',
    reproductionSteps: [
      'Open login page on mobile Safari',
      'Enter invalid email format',
      'Click submit button',
      'Form submits without validation error'
    ]
  },
  {
    id: 'BUG-002',
    title: 'Dashboard sidebar not responsive on tablet devices',
    description: 'Admin dashboard sidebar overlaps main content on tablet devices in portrait mode',
    severity: 'medium',
    status: 'in-progress',
    priority: 'medium',
    reporter: 'Jane Smith',
    assignee: 'Development Team',
    dateReported: '2024-08-24',
    dateUpdated: '2024-08-26',
    category: 'UI/UX',
    environment: 'Production',
    browserInfo: 'Chrome 116 on iPad',
    reproductionSteps: [
      'Open admin dashboard on iPad',
      'Rotate to portrait mode',
      'Observe sidebar overlapping content'
    ]
  },
  {
    id: 'BUG-003',
    title: 'Payment processing timeout on slow connections',
    description: 'Payment processing fails with timeout error on connections slower than 3G',
    severity: 'critical',
    status: 'open',
    priority: 'critical',
    reporter: 'Mike Johnson',
    dateReported: '2024-08-23',
    dateUpdated: '2024-08-23',
    category: 'Payments',
    environment: 'Production',
    reproductionSteps: [
      'Throttle connection to slow 3G',
      'Attempt to process payment',
      'Wait for timeout error'
    ]
  },
  {
    id: 'BUG-004',
    title: 'User profile image upload fails for files over 2MB',
    description: 'Profile image upload returns 413 error for files larger than 2MB without proper user feedback',
    severity: 'medium',
    status: 'resolved',
    priority: 'medium',
    reporter: 'Sarah Wilson',
    assignee: 'Backend Team',
    dateReported: '2024-08-20',
    dateUpdated: '2024-08-25',
    category: 'File Upload',
    environment: 'Production'
  },
  {
    id: 'BUG-005',
    title: 'Dark mode toggle not persisting across sessions',
    description: 'User preference for dark mode resets to light mode after browser restart',
    severity: 'low',
    status: 'closed',
    priority: 'low',
    reporter: 'Alex Brown',
    assignee: 'Frontend Team',
    dateReported: '2024-08-18',
    dateUpdated: '2024-08-24',
    category: 'UI/UX',
    environment: 'Production'
  },
  {
    id: 'BUG-006',
    title: 'Email notifications not being sent for password resets',
    description: 'Password reset emails are not being delivered to users, causing authentication issues',
    severity: 'high',
    status: 'in-progress',
    priority: 'high',
    reporter: 'Lisa Davis',
    assignee: 'Backend Team',
    dateReported: '2024-08-22',
    dateUpdated: '2024-08-26',
    category: 'Email',
    environment: 'Production'
  },
  {
    id: 'BUG-007',
    title: 'Search functionality returns incorrect results',
    description: 'Search feature in marketplace returns unrelated results for specific keywords',
    severity: 'medium',
    status: 'open',
    priority: 'medium',
    reporter: 'Tom Anderson',
    dateReported: '2024-08-21',
    dateUpdated: '2024-08-21',
    category: 'Search',
    environment: 'Production'
  },
  {
    id: 'BUG-008',
    title: 'Memory leak in real-time notifications',
    description: 'Browser memory usage increases continuously when real-time notifications are enabled',
    severity: 'high',
    status: 'open',
    priority: 'high',
    reporter: 'Chris Lee',
    dateReported: '2024-08-19',
    dateUpdated: '2024-08-19',
    category: 'Performance',
    environment: 'Production'
  }
];

export default function BugsPage() {
  const [bugs, setBugs] = useState<BugReport[]>(bugReports);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved':
      case 'closed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'in-progress':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'wont-fix':
        return <XCircle className="w-4 h-4 text-gray-500" />;
      default:
        return <Bug className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved':
      case 'closed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'wont-fix':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
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

  const filteredBugs = bugs.filter(bug => {
    const matchesSearch = bug.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         bug.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         bug.reporter.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         bug.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || bug.status === statusFilter;
    const matchesSeverity = severityFilter === 'all' || bug.severity === severityFilter;

    return matchesSearch && matchesStatus && matchesSeverity;
  });

  const bugStats = {
    total: bugs.length,
    open: bugs.filter(b => b.status === 'open').length,
    inProgress: bugs.filter(b => b.status === 'in-progress').length,
    resolved: bugs.filter(b => b.status === 'resolved').length,
    closed: bugs.filter(b => b.status === 'closed').length,
    critical: bugs.filter(b => b.severity === 'critical').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Bug Reports</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track and manage all bugs that need to be fixed
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Report Bug
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Bugs</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{bugStats.total}</p>
            </div>
            <Bug className="w-6 h-6 text-red-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Open</p>
              <p className="text-2xl font-bold text-red-600">{bugStats.open}</p>
            </div>
            <AlertTriangle className="w-6 h-6 text-red-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">In Progress</p>
              <p className="text-2xl font-bold text-blue-600">{bugStats.inProgress}</p>
            </div>
            <Clock className="w-6 h-6 text-blue-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Resolved</p>
              <p className="text-2xl font-bold text-green-600">{bugStats.resolved}</p>
            </div>
            <CheckCircle className="w-6 h-6 text-green-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Closed</p>
              <p className="text-2xl font-bold text-gray-600">{bugStats.closed}</p>
            </div>
            <XCircle className="w-6 h-6 text-gray-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Critical</p>
              <p className="text-2xl font-bold text-red-600">{bugStats.critical}</p>
            </div>
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search bugs..."
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
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
              <option value="wont-fix">Won't Fix</option>
            </select>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Severity</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Bug Reports List */}
      <div className="space-y-4">
        {filteredBugs.map((bug) => (
          <Card key={bug.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  {getStatusIcon(bug.status)}
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {bug.title}
                  </h3>
                  <Badge variant="outline" className="text-xs font-mono">
                    {bug.id}
                  </Badge>
                  <Badge variant="outline" className={getStatusColor(bug.status)}>
                    {bug.status.replace('-', ' ')}
                  </Badge>
                  <Badge variant="outline" className={getSeverityColor(bug.severity)}>
                    {bug.severity}
                  </Badge>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {bug.description}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span className="font-medium">Reporter:</span>
                    {bug.reporter}
                  </div>
                  {bug.assignee && (
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span className="font-medium">Assignee:</span>
                      {bug.assignee}
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span className="font-medium">Reported:</span>
                    {new Date(bug.dateReported).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-medium">Category:</span>
                    {bug.category}
                  </div>
                </div>
                {bug.environment && (
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    <span className="font-medium">Environment:</span> {bug.environment}
                    {bug.browserInfo && <span> | {bug.browserInfo}</span>}
                  </div>
                )}
                {bug.reproductionSteps && bug.reproductionSteps.length > 0 && (
                  <div className="mt-3">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Reproduction Steps:
                    </h4>
                    <ol className="list-decimal list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      {bug.reproductionSteps.map((step, index) => (
                        <li key={index}>{step}</li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
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
