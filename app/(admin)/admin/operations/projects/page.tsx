"use client";

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Briefcase,
  Search,
  Calendar,
  MapPin,
  User,
  DollarSign,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  PlayCircle,
  PauseCircle,
  Eye,
  Edit,
  MoreHorizontal,
  TrendingUp,
  Building2
} from 'lucide-react';

interface FranchiseProject {
  id: string;
  projectName: string;
  brandName: string;
  franchisee: string;
  location: string;
  stage: 'planning' | 'site_selection' | 'construction' | 'setup' | 'training' | 'soft_launch' | 'grand_opening' | 'operational' | 'on_hold' | 'cancelled';
  startDate: string;
  expectedLaunchDate: string;
  actualLaunchDate?: string;
  totalInvestment: number;
  spentAmount: number;
  remainingBudget: number;
  progress: number;
  milestones: {
    name: string;
    status: 'completed' | 'in_progress' | 'pending' | 'delayed';
    dueDate: string;
    completedDate?: string;
  }[];
  teamLead: string;
  contactNumber: string;
  email: string;
  notes: string;
}

const franchiseProjects: FranchiseProject[] = [
  {
    id: 'PRJ-001',
    projectName: 'QuickBite Express - Andheri West',
    brandName: 'QuickBite Express',
    franchisee: 'Rohit Sharma',
    location: 'Andheri West, Mumbai',
    stage: 'operational',
    startDate: '2024-06-01',
    expectedLaunchDate: '2024-08-15',
    actualLaunchDate: '2024-08-10',
    totalInvestment: 1500000,
    spentAmount: 1450000,
    remainingBudget: 50000,
    progress: 100,
    milestones: [
      { name: 'Site Selection', status: 'completed', dueDate: '2024-06-15', completedDate: '2024-06-12' },
      { name: 'Construction', status: 'completed', dueDate: '2024-07-15', completedDate: '2024-07-10' },
      { name: 'Equipment Setup', status: 'completed', dueDate: '2024-07-30', completedDate: '2024-07-28' },
      { name: 'Staff Training', status: 'completed', dueDate: '2024-08-05', completedDate: '2024-08-03' },
      { name: 'Soft Launch', status: 'completed', dueDate: '2024-08-08', completedDate: '2024-08-07' },
      { name: 'Grand Opening', status: 'completed', dueDate: '2024-08-15', completedDate: '2024-08-10' }
    ],
    teamLead: 'Priya Patel',
    contactNumber: '+91 98765 43210',
    email: 'rohit@quickbite.com',
    notes: 'Successfully launched ahead of schedule. Excellent performance in first month.'
  },
  {
    id: 'PRJ-002',
    projectName: 'FitZone Gym - Bandra',
    brandName: 'FitZone Gym',
    franchisee: 'Priya Patel',
    location: 'Bandra, Mumbai',
    stage: 'setup',
    startDate: '2024-07-01',
    expectedLaunchDate: '2024-09-15',
    totalInvestment: 1200000,
    spentAmount: 800000,
    remainingBudget: 400000,
    progress: 75,
    milestones: [
      { name: 'Site Selection', status: 'completed', dueDate: '2024-07-15', completedDate: '2024-07-12' },
      { name: 'Construction', status: 'completed', dueDate: '2024-08-15', completedDate: '2024-08-18' },
      { name: 'Equipment Setup', status: 'in_progress', dueDate: '2024-08-30', completedDate: undefined },
      { name: 'Staff Training', status: 'pending', dueDate: '2024-09-05', completedDate: undefined },
      { name: 'Soft Launch', status: 'pending', dueDate: '2024-09-10', completedDate: undefined },
      { name: 'Grand Opening', status: 'pending', dueDate: '2024-09-15', completedDate: undefined }
    ],
    teamLead: 'Amit Kumar',
    contactNumber: '+91 87654 32109',
    email: 'priya@fitzone.com',
    notes: 'Construction completed slightly behind schedule. Equipment installation in progress.'
  },
  {
    id: 'PRJ-003',
    projectName: 'EduSmart Learning - Koramangala',
    brandName: 'EduSmart Learning',
    franchisee: 'Dr. Sunita Rao',
    location: 'Koramangala, Bangalore',
    stage: 'construction',
    startDate: '2024-08-01',
    expectedLaunchDate: '2024-10-30',
    totalInvestment: 1800000,
    spentAmount: 600000,
    remainingBudget: 1200000,
    progress: 40,
    milestones: [
      { name: 'Site Selection', status: 'completed', dueDate: '2024-08-10', completedDate: '2024-08-08' },
      { name: 'Construction', status: 'in_progress', dueDate: '2024-09-20', completedDate: undefined },
      { name: 'Equipment Setup', status: 'pending', dueDate: '2024-10-05', completedDate: undefined },
      { name: 'Staff Training', status: 'pending', dueDate: '2024-10-20', completedDate: undefined },
      { name: 'Soft Launch', status: 'pending', dueDate: '2024-10-25', completedDate: undefined },
      { name: 'Grand Opening', status: 'pending', dueDate: '2024-10-30', completedDate: undefined }
    ],
    teamLead: 'Karthik Menon',
    contactNumber: '+91 65432 10987',
    email: 'sunita@edusmart.com',
    notes: 'Construction progressing well. All permits approved.'
  },
  {
    id: 'PRJ-004',
    projectName: 'TechRepair Hub - Whitefield',
    brandName: 'TechRepair Hub',
    franchisee: 'Amit Kumar',
    location: 'Whitefield, Bangalore',
    stage: 'site_selection',
    startDate: '2024-08-15',
    expectedLaunchDate: '2024-11-15',
    totalInvestment: 800000,
    spentAmount: 100000,
    remainingBudget: 700000,
    progress: 15,
    milestones: [
      { name: 'Site Selection', status: 'in_progress', dueDate: '2024-09-01', completedDate: undefined },
      { name: 'Construction', status: 'pending', dueDate: '2024-10-01', completedDate: undefined },
      { name: 'Equipment Setup', status: 'pending', dueDate: '2024-10-20', completedDate: undefined },
      { name: 'Staff Training', status: 'pending', dueDate: '2024-11-05', completedDate: undefined },
      { name: 'Soft Launch', status: 'pending', dueDate: '2024-11-10', completedDate: undefined },
      { name: 'Grand Opening', status: 'pending', dueDate: '2024-11-15', completedDate: undefined }
    ],
    teamLead: 'Meera Singh',
    contactNumber: '+91 76543 21098',
    email: 'amit@techrepair.com',
    notes: 'Evaluating multiple site options. Negotiations ongoing.'
  },
  {
    id: 'PRJ-005',
    projectName: 'CleanCare Services - T. Nagar',
    brandName: 'CleanCare Services',
    franchisee: 'Karthik Menon',
    location: 'T. Nagar, Chennai',
    stage: 'on_hold',
    startDate: '2024-07-15',
    expectedLaunchDate: '2024-10-01',
    totalInvestment: 600000,
    spentAmount: 150000,
    remainingBudget: 450000,
    progress: 25,
    milestones: [
      { name: 'Site Selection', status: 'completed', dueDate: '2024-08-01', completedDate: '2024-07-30' },
      { name: 'Construction', status: 'delayed', dueDate: '2024-09-01', completedDate: undefined },
      { name: 'Equipment Setup', status: 'pending', dueDate: '2024-09-15', completedDate: undefined },
      { name: 'Staff Training', status: 'pending', dueDate: '2024-09-25', completedDate: undefined },
      { name: 'Soft Launch', status: 'pending', dueDate: '2024-09-28', completedDate: undefined },
      { name: 'Grand Opening', status: 'pending', dueDate: '2024-10-01', completedDate: undefined }
    ],
    teamLead: 'Rajesh Kumar',
    contactNumber: '+91 54321 09876',
    email: 'karthik@cleancare.com',
    notes: 'Project on hold due to funding issues. Awaiting resolution.'
  }
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<FranchiseProject[]>(franchiseProjects);
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('all');

  const getStageIcon = (stage: string) => {
    switch (stage) {
      case 'operational':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'grand_opening':
      case 'soft_launch':
        return <PlayCircle className="w-4 h-4 text-blue-500" />;
      case 'setup':
      case 'training':
      case 'construction':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'on_hold':
        return <PauseCircle className="w-4 h-4 text-orange-500" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Briefcase className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'operational':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'grand_opening':
      case 'soft_launch':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'setup':
      case 'training':
      case 'construction':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'site_selection':
      case 'planning':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'on_hold':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getMilestoneStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'delayed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.franchisee.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStage = stageFilter === 'all' || project.stage === stageFilter;

    return matchesSearch && matchesStage;
  });

  const projectStats = {
    total: projects.length,
    operational: projects.filter(p => p.stage === 'operational').length,
    inProgress: projects.filter(p => ['construction', 'setup', 'training', 'soft_launch', 'grand_opening'].includes(p.stage)).length,
    planning: projects.filter(p => ['planning', 'site_selection'].includes(p.stage)).length,
    onHold: projects.filter(p => p.stage === 'on_hold').length,
    cancelled: projects.filter(p => p.stage === 'cancelled').length,
    totalInvestment: projects.reduce((sum, p) => sum + p.totalInvestment, 0),
    totalSpent: projects.reduce((sum, p) => sum + p.spentAmount, 0),
    avgProgress: projects.reduce((sum, p) => sum + p.progress, 0) / projects.length,
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Franchise Projects</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track franchise project launching stages and milestones
          </p>
        </div>
        <Button>
          <Briefcase className="w-4 h-4 mr-2" />
          New Project
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Projects</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{projectStats.total}</p>
            </div>
            <Briefcase className="w-6 h-6 text-blue-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Operational</p>
              <p className="text-2xl font-bold text-green-600">{projectStats.operational}</p>
            </div>
            <CheckCircle className="w-6 h-6 text-green-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">In Progress</p>
              <p className="text-2xl font-bold text-blue-600">{projectStats.inProgress}</p>
            </div>
            <Clock className="w-6 h-6 text-blue-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Planning</p>
              <p className="text-2xl font-bold text-purple-600">{projectStats.planning}</p>
            </div>
            <Building2 className="w-6 h-6 text-purple-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">On Hold</p>
              <p className="text-2xl font-bold text-orange-600">{projectStats.onHold}</p>
            </div>
            <PauseCircle className="w-6 h-6 text-orange-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Cancelled</p>
              <p className="text-2xl font-bold text-red-600">{projectStats.cancelled}</p>
            </div>
            <XCircle className="w-6 h-6 text-red-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Investment</p>
              <p className="text-lg font-bold text-purple-600">{formatCurrency(projectStats.totalInvestment)}</p>
            </div>
            <DollarSign className="w-6 h-6 text-purple-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Progress</p>
              <p className="text-2xl font-bold text-green-600">{projectStats.avgProgress.toFixed(0)}%</p>
            </div>
            <TrendingUp className="w-6 h-6 text-green-500" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Stages</option>
              <option value="planning">Planning</option>
              <option value="site_selection">Site Selection</option>
              <option value="construction">Construction</option>
              <option value="setup">Setup</option>
              <option value="training">Training</option>
              <option value="soft_launch">Soft Launch</option>
              <option value="grand_opening">Grand Opening</option>
              <option value="operational">Operational</option>
              <option value="on_hold">On Hold</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Projects List */}
      <div className="space-y-4">
        {filteredProjects.map((project) => (
          <Card key={project.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  {getStageIcon(project.stage)}
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {project.projectName}
                  </h3>
                  <Badge variant="outline" className="text-xs font-mono">
                    {project.id}
                  </Badge>
                  <Badge variant="outline" className={getStageColor(project.stage)}>
                    {project.stage.replace('_', ' ')}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Franchisee</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{project.franchisee}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{project.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Team Lead</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{project.teamLead}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Expected Launch</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {new Date(project.expectedLaunchDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Investment</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{formatCurrency(project.totalInvestment)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Spent Amount</p>
                    <p className="font-medium text-red-600">{formatCurrency(project.spentAmount)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Remaining Budget</p>
                    <p className="font-medium text-green-600">{formatCurrency(project.remainingBudget)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Progress</p>
                    <p className="font-medium text-blue-600">{project.progress}%</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">Project Progress</span>
                    <span className="font-medium">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        project.progress === 100 ? 'bg-green-600' : 'bg-blue-600'
                      }`}
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                {/* Milestones */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Milestones</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.milestones.map((milestone, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className={`text-xs ${getMilestoneStatusColor(milestone.status)}`}
                      >
                        {milestone.name}: {milestone.status.replace('_', ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>

                {project.notes && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Notes</p>
                    <p className="text-gray-700 dark:text-gray-300">{project.notes}</p>
                  </div>
                )}

                <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Started: {new Date(project.startDate).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {project.contactNumber}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {project.email}
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
