"use client";

import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { toast } from 'sonner';
import {
  Search,
  UserPlus,
  Mail,
  Shield,
  Users,
  Settings,
  Trash2,
  Edit,
  Eye,
  Filter
} from 'lucide-react';

interface TeamMember {
  _id: string;
  email: string;
  first_name?: string;
  family_name?: string;
  avatar?: string;
  roles?: string[];
  isActivated?: boolean;
  verificationStatus?: string;
  created_at: number;
  updated_at?: number;
}

export default function TeamsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  // Get all users (team members)
  const users = useQuery(api.users.listAll, {}) || [];

  // Get available roles
  const availableRoles = useQuery(api.users.getAvailableRoles, {}) || [];

  // Mutations
  const assignUserRoles = useMutation(api.users.assignUserRoles);

  // Filter team members based on search and role
  const filteredMembers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           user.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           user.family_name?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRole = roleFilter === 'all' ||
                         user.roles?.includes(roleFilter) ||
                         (roleFilter === 'no_role' && (!user.roles || user.roles.length === 0));

      return matchesSearch && matchesRole;
    });
  }, [users, searchQuery, roleFilter]);

  // Handle role assignment
  const handleAssignRoles = async (userId: string, roles: string[]) => {
    try {
      await assignUserRoles({
        userId: userId as any,
        roles: roles
      });
      toast.success('Roles updated successfully');
      setSelectedMember(null);
    } catch (error) {
      console.error('Error updating roles:', error);
      toast.error('Failed to update roles');
    }
  };

  // Get role badge color
  const getRoleBadgeColor = (role: string) => {
    const colors: Record<string, string> = {
      super_admin: 'bg-red-100 text-red-800 border-red-200',
      platform_admin: 'bg-purple-100 text-purple-800 border-purple-200',
      admin: 'bg-blue-100 text-blue-800 border-blue-200',
      finance_manager: 'bg-green-100 text-green-800 border-green-200',
      hr_manager: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      marketing_manager: 'bg-pink-100 text-pink-800 border-pink-200',
      sales_manager: 'bg-orange-100 text-orange-800 border-orange-200',
      operations_manager: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      support_manager: 'bg-teal-100 text-teal-800 border-teal-200',
      developer: 'bg-gray-100 text-gray-800 border-gray-200',
      employee: 'bg-slate-100 text-slate-800 border-slate-200',
      user: 'bg-stone-100 text-stone-800 border-stone-200'
    };
    return colors[role] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Team Management</h1>
          <p className="text-stone-600 dark:text-stone-400">
            Manage team members and their access permissions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            {filteredMembers.length} Members
          </Badge>
          <Button onClick={() => setIsInviteModalOpen(true)}>
            <UserPlus className="w-4 h-4 mr-2" />
            Invite Member
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search team members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Roles</option>
              <option value="no_role">No Role Assigned</option>
              {availableRoles.map(({ role }) => (
                <option key={role} value={role}>
                  {role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Team Members List */}
      <div className="grid gap-4">
        {filteredMembers.length === 0 ? (
          <Card className="p-8 text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No team members found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {searchQuery || roleFilter !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'Start by inviting team members to join your organization'
              }
            </p>
          </Card>
        ) : (
          filteredMembers.map((member) => (
            <Card key={member._id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative h-12 w-12 flex-shrink-0">
                    <img
                      src={member.avatar || "/avatar/avatar-m-1.png"}
                      alt={`${member.first_name} ${member.family_name}`}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    {member.verificationStatus === 'verified' && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        {member.first_name} {member.family_name}
                      </h3>
                      {!member.isActivated && (
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                          Pending
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {member.email}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      {member.roles && member.roles.length > 0 ? (
                        member.roles.map((role) => (
                          <Badge
                            key={role}
                            variant="outline"
                            className={getRoleBadgeColor(role)}
                          >
                            {role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </Badge>
                        ))
                      ) : (
                        <Badge variant="outline" className="bg-gray-50 text-gray-500 border-gray-200">
                          No Role Assigned
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedMember(member)}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Manage Roles
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Role Management Modal */}
      {selectedMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-stone-800 rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">
                Manage Roles - {selectedMember.first_name} {selectedMember.family_name}
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedMember(null)}
              >
                ×
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Current Roles
                </h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedMember.roles && selectedMember.roles.length > 0 ? (
                    selectedMember.roles.map((role) => (
                      <Badge
                        key={role}
                        variant="outline"
                        className={getRoleBadgeColor(role)}
                      >
                        {role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-gray-500">No roles assigned</span>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Available Roles
                </h3>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {availableRoles.map(({ role, description, permissions }) => (
                    <div
                      key={role}
                      className="flex items-start gap-3 p-3 border border-gray-200 dark:border-stone-600 rounded-lg"
                    >
                      <input
                        type="checkbox"
                        id={`role-${role}`}
                        checked={selectedRoles.includes(role) || selectedMember.roles?.includes(role)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedRoles([...selectedRoles, role]);
                          } else {
                            setSelectedRoles(selectedRoles.filter(r => r !== role));
                          }
                        }}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <label
                          htmlFor={`role-${role}`}
                          className="text-sm font-medium text-gray-900 dark:text-gray-100 cursor-pointer"
                        >
                          {role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </label>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {description}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {permissions.slice(0, 3).map((permission) => (
                            <Badge
                              key={permission}
                              variant="outline"
                              className="text-xs bg-gray-50 text-gray-600 border-gray-200"
                            >
                              {permission}
                            </Badge>
                          ))}
                          {permissions.length > 3 && (
                            <Badge
                              variant="outline"
                              className="text-xs bg-gray-50 text-gray-600 border-gray-200"
                            >
                              +{permissions.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4 pt-4 border-t">
                <Button
                  onClick={() => {
                    const newRoles = [...(selectedMember.roles || []), ...selectedRoles];
                    const uniqueRoles = [...new Set(newRoles)];
                    handleAssignRoles(selectedMember._id, uniqueRoles);
                  }}
                  disabled={selectedRoles.length === 0}
                >
                  Update Roles
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedMember(null);
                    setSelectedRoles([]);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}