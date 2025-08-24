"use client";

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Plus,
  Search,
  Filter,
  Calendar,
  User,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  MoreHorizontal,
  Edit,
  Trash2
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'blocked';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignee: string;
  dueDate: string;
  category: string;
  progress: number;
}

const developmentTasks: Task[] = [
  {
    id: '1',
    title: 'Implement User Authentication System',
    description: 'Complete the user authentication flow with email verification and role-based access control',
    status: 'completed',
    priority: 'high',
    assignee: 'Shawaz Sharif',
    dueDate: '2024-08-25',
    category: 'Backend',
    progress: 100
  },
  {
    id: '2',
    title: 'Build Admin Dashboard with Sidebar',
    description: 'Create comprehensive admin dashboard with sidebar navigation and permission-based access',
    status: 'in-progress',
    priority: 'high',
    assignee: 'Shawaz Sharif',
    dueDate: '2024-08-26',
    category: 'Frontend',
    progress: 85
  },
  {
    id: '3',
    title: 'Setup Database Schema',
    description: 'Design and implement complete database schema for users, roles, permissions, and business data',
    status: 'completed',
    priority: 'critical',
    assignee: 'Shawaz Sharif',
    dueDate: '2024-08-24',
    category: 'Database',
    progress: 100
  },
  {
    id: '4',
    title: 'Implement Payment Integration',
    description: 'Integrate Solana Pay for cryptocurrency payments and traditional payment gateways',
    status: 'pending',
    priority: 'high',
    assignee: 'Development Team',
    dueDate: '2024-08-30',
    category: 'Integration',
    progress: 0
  },
  {
    id: '5',
    title: 'Build Franchise Management System',
    description: 'Create comprehensive franchise management with business registration, verification, and monitoring',
    status: 'pending',
    priority: 'high',
    assignee: 'Development Team',
    dueDate: '2024-09-05',
    category: 'Business Logic',
    progress: 0
  },
  {
    id: '6',
    title: 'Implement Real-time Notifications',
    description: 'Add real-time notifications for important events and updates',
    status: 'pending',
    priority: 'medium',
    assignee: 'Development Team',
    dueDate: '2024-09-10',
    category: 'Frontend',
    progress: 0
  },
  {
    id: '7',
    title: 'Setup CI/CD Pipeline',
    description: 'Configure automated testing, building, and deployment pipeline',
    status: 'pending',
    priority: 'medium',
    assignee: 'DevOps Team',
    dueDate: '2024-09-01',
    category: 'DevOps',
    progress: 0
  },
  {
    id: '8',
    title: 'Mobile App Development',
    description: 'Develop React Native mobile application for iOS and Android',
    status: 'pending',
    priority: 'high',
    assignee: 'Mobile Team',
    dueDate: '2024-10-15',
    category: 'Mobile',
    progress: 0
  },
  {
    id: '9',
    title: 'API Documentation',
    description: 'Create comprehensive API documentation with examples and testing interface',
    status: 'pending',
    priority: 'medium',
    assignee: 'Documentation Team',
    dueDate: '2024-09-15',
    category: 'Documentation',
    progress: 0
  },
  {
    id: '10',
    title: 'Security Audit & Testing',
    description: 'Conduct thorough security audit and penetration testing',
    status: 'pending',
    priority: 'critical',
    assignee: 'Security Team',
    dueDate: '2024-09-20',
    category: 'Security',
    progress: 0
  }
];

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(developmentTasks);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'in-progress':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'blocked':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'blocked':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
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

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.assignee.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const taskStats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    pending: tasks.filter(t => t.status === 'pending').length,
    blocked: tasks.filter(t => t.status === 'blocked').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Development Tasks</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track all development tasks to get the app from development to production
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Tasks</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{taskStats.total}</p>
            </div>
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
              <p className="text-2xl font-bold text-green-600">{taskStats.completed}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">In Progress</p>
              <p className="text-2xl font-bold text-blue-600">{taskStats.inProgress}</p>
            </div>
            <Clock className="w-8 h-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{taskStats.pending}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-yellow-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Blocked</p>
              <p className="text-2xl font-bold text-red-600">{taskStats.blocked}</p>
            </div>
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search tasks..."
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
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="blocked">Blocked</option>
            </select>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Priority</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredTasks.map((task) => (
          <Card key={task.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  {getStatusIcon(task.status)}
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {task.title}
                  </h3>
                  <Badge variant="outline" className={getStatusColor(task.status)}>
                    {task.status.replace('-', ' ')}
                  </Badge>
                  <Badge variant="outline" className={getPriorityColor(task.priority)}>
                    {task.priority}
                  </Badge>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {task.description}
                </p>
                <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {task.assignee}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(task.dueDate).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-medium">{task.category}</span>
                  </div>
                </div>
                {task.progress > 0 && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600 dark:text-gray-400">Progress</span>
                      <span className="font-medium">{task.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>
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
