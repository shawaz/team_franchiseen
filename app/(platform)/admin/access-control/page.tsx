"use client";

import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { 
  Search, 
  Shield, 
  Users, 
  CheckCircle,
  XCircle,
  Eye,
  Filter,
  Home,
  Building,
  DollarSign,
  Megaphone,
  TrendingUp,
  Code,
  HelpCircle
} from 'lucide-react';

interface User {
  _id: string;
  email: string;
  first_name?: string;
  family_name?: string;
  avatar?: string;
  roles?: string[];
  isActivated?: boolean;
  verificationStatus?: string;
}

export default function AccessControlPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sectionFilter, setSectionFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Get all users
  const users = useQuery(api.users.listAll, {}) || [];
  
  // Get available roles
  const availableRoles = useQuery(api.users.getAvailableRoles, {}) || [];

  // Define menu sections for access control
  const menuSections = [
    { id: 'home', label: 'Home', icon: Home, permissions: ['home.tasks', 'home.mail', 'home.calendar', 'home.docs', 'home.travels', 'home.handbook'] },
    { id: 'admin', label: 'Admin', icon: Shield, permissions: ['admin.plan', 'admin.strategy', 'admin.activities', 'admin.channels', 'admin.partners', 'admin.resources', 'admin.relations'] },
    { id: 'operations', label: 'Operations', icon: Building, permissions: ['operations.office', 'operations.funding', 'operations.projects', 'operations.ongoing', 'operations.closed'] },
    { id: 'finances', label: 'Finances', icon: DollarSign, permissions: ['finances.wallets', 'finances.banks', 'finances.budget', 'finances.invoices', 'finances.payee', 'finances.transactions'] },
    { id: 'people', label: 'People', icon: Users, permissions: ['people.users', 'people.teams', 'people.openings', 'people.applications', 'people.onboarding', 'people.training', 'people.offboarding'] },
    { id: 'marketing', label: 'Marketing', icon: Megaphone, permissions: ['marketing.market', 'marketing.content', 'marketing.campaign'] },
    { id: 'sales', label: 'Sales', icon: TrendingUp, permissions: ['sales.leads', 'sales.clients', 'sales.company', 'sales.competitions'] },
    { id: 'software', label: 'Software', icon: Code, permissions: ['software.features', 'software.bugs', 'software.databases'] },
    { id: 'support', label: 'Support', icon: HelpCircle, permissions: ['support.tickets', 'support.help-desk'] }
  ];

  // Check if user has access to a section
  const hasAccessToSection = (user: User, sectionPermissions: string[]) => {
    if (!user.roles || user.roles.length === 0) return false;
    
    // Get all permissions for user's roles
    const userPermissions = new Set<string>();
    user.roles.forEach(role => {
      const roleData = availableRoles.find(r => r.role === role);
      if (roleData) {
        roleData.permissions.forEach(permission => {
          if (permission === '*') {
            // Super admin has all permissions
            sectionPermissions.forEach(p => userPermissions.add(p));
          } else if (permission.endsWith('.*')) {
            // Wildcard permission
            const section = permission.replace('.*', '');
            sectionPermissions.forEach(p => {
              if (p.startsWith(section + '.')) {
                userPermissions.add(p);
              }
            });
          } else {
            userPermissions.add(permission);
          }
        });
      }
    });

    // Check if user has any permission in this section
    return sectionPermissions.some(permission => userPermissions.has(permission));
  };

  // Filter users based on search and section access
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           user.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           user.family_name?.toLowerCase().includes(searchQuery.toLowerCase());

      if (sectionFilter === 'all') return matchesSearch;
      
      const section = menuSections.find(s => s.id === sectionFilter);
      if (!section) return matchesSearch;

      const hasAccess = hasAccessToSection(user, section.permissions);
      return matchesSearch && hasAccess;
    });
  }, [users, searchQuery, sectionFilter, availableRoles]);

  // Get access summary for all users
  const accessSummary = useMemo(() => {
    const summary: Record<string, { total: number; withAccess: number }> = {};
    
    menuSections.forEach(section => {
      const total = users.length;
      const withAccess = users.filter(user => hasAccessToSection(user, section.permissions)).length;
      summary[section.id] = { total, withAccess };
    });

    return summary;
  }, [users, availableRoles]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Access Control Dashboard</h1>
          <p className="text-stone-600 dark:text-stone-400">
            Monitor and manage user access to different system sections
          </p>
        </div>
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          {users.length} Total Users
        </Badge>
      </div>

      {/* Access Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {menuSections.map(section => {
          const summary = accessSummary[section.id];
          const percentage = summary.total > 0 ? Math.round((summary.withAccess / summary.total) * 100) : 0;
          
          return (
            <Card key={section.id} className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <section.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">
                    {section.label}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {section.permissions.length} permissions
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium">
                    {summary.withAccess} / {summary.total}
                  </span>
                </div>
                <Badge 
                  variant="outline" 
                  className={`${
                    percentage >= 80 ? 'bg-green-50 text-green-700 border-green-200' :
                    percentage >= 50 ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                    'bg-red-50 text-red-700 border-red-200'
                  }`}
                >
                  {percentage}%
                </Badge>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={sectionFilter}
              onChange={(e) => setSectionFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Users</option>
              {menuSections.map(section => (
                <option key={section.id} value={section.id}>
                  Has {section.label} Access
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Users Access Matrix */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">User Access Matrix</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-medium">User</th>
                {menuSections.map(section => (
                  <th key={section.id} className="text-center py-3 px-2 font-medium">
                    <div className="flex flex-col items-center gap-1">
                      <section.icon className="w-4 h-4" />
                      <span className="text-xs">{section.label}</span>
                    </div>
                  </th>
                ))}
                <th className="text-center py-3 px-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user._id} className="border-b hover:bg-gray-50 dark:hover:bg-stone-800/50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.avatar || "/avatar/avatar-m-1.png"}
                        alt={`${user.first_name} ${user.family_name}`}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">
                          {user.first_name} {user.family_name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  {menuSections.map(section => (
                    <td key={section.id} className="text-center py-3 px-2">
                      {hasAccessToSection(user, section.permissions) ? (
                        <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500 mx-auto" />
                      )}
                    </td>
                  ))}
                  <td className="text-center py-3 px-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedUser(user)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-stone-800 rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">
                Access Details - {selectedUser.first_name} {selectedUser.family_name}
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedUser(null)}
              >
                ×
              </Button>
            </div>

            <div className="space-y-6">
              {/* User Info */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-stone-700 rounded-lg">
                <img
                  src={selectedUser.avatar || "/avatar/avatar-m-1.png"}
                  alt={`${selectedUser.first_name} ${selectedUser.family_name}`}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {selectedUser.first_name} {selectedUser.family_name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">{selectedUser.email}</p>
                  <div className="flex gap-2 mt-2">
                    {selectedUser.roles?.map(role => (
                      <Badge key={role} variant="outline" className="text-xs">
                        {role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Badge>
                    )) || (
                      <Badge variant="outline" className="text-xs bg-gray-50 text-gray-500">
                        No Roles Assigned
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Section Access Details */}
              <div>
                <h3 className="text-lg font-medium mb-4">Section Access</h3>
                <div className="space-y-3">
                  {menuSections.map(section => {
                    const hasAccess = hasAccessToSection(selectedUser, section.permissions);
                    return (
                      <div key={section.id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-stone-600 rounded-lg">
                        <div className="flex items-center gap-3">
                          <section.icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-gray-100">
                              {section.label}
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {section.permissions.length} permissions
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {hasAccess ? (
                            <Badge className="bg-green-100 text-green-800 border-green-200">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Access Granted
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                              <XCircle className="w-3 h-3 mr-1" />
                              No Access
                            </Badge>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
