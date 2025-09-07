"use client";

import React, { useState } from 'react';
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
  Calendar,
  CheckCircle,
  XCircle,
  Crown,
  Briefcase
} from 'lucide-react';


const PLATFORM_ROLES = {
  super_admin: { name: "Super Admin", color: "bg-red-100 text-red-800 border-red-200" },
  platform_admin: { name: "Platform Admin", color: "bg-purple-100 text-purple-800 border-purple-200" },
  admin: { name: "Admin", color: "bg-blue-100 text-blue-800 border-blue-200" },
  developer: { name: "Developer", color: "bg-green-100 text-green-800 border-green-200" },
  support: { name: "Support", color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  marketing: { name: "Marketing", color: "bg-pink-100 text-pink-800 border-pink-200" },
  sales: { name: "Sales", color: "bg-orange-100 text-orange-800 border-orange-200" }
};

const DEPARTMENTS = [
  "executive", "engineering", "operations", "marketing", "sales", "support", "finance"
];

export default function PlatformTeamsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    email: '',
    role: 'team_member',
    departments: ['home'], // Support multiple departments
    position: '',
    message: ''
  });

  // Queries
  const teamMembers = useQuery(api.platformTeam.listPlatformTeamMembers, {}) || [];
  const currentUser = useQuery(api.platformTeam.getCurrentPlatformUser, {});
  const hasAccess = useQuery(api.platformTeam.hasPlatformAccess, {});
  const availableRoles = useQuery(api.platformTeam.getAvailableRoles, {}) || [];
  const availableDepartments = useQuery(api.platformTeam.getAvailableDepartments, {}) || [];

  // Mutations
  const inviteTeamMember = useMutation(api.platformTeam.invitePlatformTeamMember);

  // Filter team members
  const filteredMembers = teamMembers.filter((member) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      member.user?.email?.toLowerCase().includes(searchLower) ||
      member.user?.first_name?.toLowerCase().includes(searchLower) ||
      member.user?.family_name?.toLowerCase().includes(searchLower) ||
      member.role.toLowerCase().includes(searchLower) ||
      member.departments?.some((dept: string) => dept.toLowerCase().includes(searchLower)) ||
      member.position.toLowerCase().includes(searchLower)
    );
  });

  const handleDepartmentToggle = (deptId: string, checked: boolean) => {
    let newDepartments = [...inviteForm.departments];

    if (checked) {
      if (!newDepartments.includes(deptId)) {
        newDepartments.push(deptId);
      }
    } else {
      // Don't allow removing 'home' department
      if (deptId === 'home') {
        toast.error('Home department cannot be removed');
        return;
      }
      newDepartments = newDepartments.filter(d => d !== deptId);
    }

    // Ensure home is always included
    if (!newDepartments.includes('home')) {
      newDepartments.unshift('home');
    }

    setInviteForm({
      ...inviteForm,
      departments: newDepartments
    });
  };

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inviteForm.email || !inviteForm.position) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (inviteForm.departments.length === 0) {
      toast.error('At least one department must be selected');
      return;
    }

    try {
      await inviteTeamMember({
        email: inviteForm.email,
        role: inviteForm.role,
        departments: inviteForm.departments,
        position: inviteForm.position,
        message: inviteForm.message || undefined,
      });

      toast.success('Team invitation sent successfully!');
      setShowInviteModal(false);
      setInviteForm({
        email: '',
        role: 'team_member',
        departments: ['home'],
        position: '',
        message: ''
      });
    } catch (error: any) {
      toast.error(error.message || 'Failed to send invitation');
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'super_admin': return <Crown className="w-4 h-4" />;
      case 'platform_admin': return <Shield className="w-4 h-4" />;
      case 'admin': return <Settings className="w-4 h-4" />;
      case 'developer': return <Briefcase className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  if (!hasAccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Shield className="w-16 h-16 text-gray-400" />
        <h1 className="text-2xl font-semibold">Access Denied</h1>
        <p className="text-gray-600 dark:text-gray-400">You don't have permission to access team management.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
            Franchiseen Team
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
            Manage platform team members and access control
          </p>
        </div>
        <Button onClick={() => setShowInviteModal(true)} className="w-full sm:w-auto">
          <UserPlus className="w-4 h-4 mr-2" />
          Invite Team Member
        </Button>
      </div>

      {/* Search */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search team members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((member) => (
          <Card key={member._id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {member.user?.first_name?.[0] || member.user?.email?.[0]?.toUpperCase() || '?'}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    {member.user?.first_name && member.user?.family_name
                      ? `${member.user.first_name} ${member.user.family_name}`
                      : member.user?.email
                    }
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {member.position}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getRoleIcon(member.role)}
                {member.isActive ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-600" />
                )}
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {member.user?.email}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-gray-400" />
                <div className="flex flex-wrap gap-1">
                  {member.departments?.map((dept, index) => (
                    <span key={dept} className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                      {dept}{index < member.departments.length - 1 ? ',' : ''}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Joined {formatDate(member.joinedAt)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Badge
                variant="outline"
                className={PLATFORM_ROLES[member.role as keyof typeof PLATFORM_ROLES]?.color || ""}
              >
                {PLATFORM_ROLES[member.role as keyof typeof PLATFORM_ROLES]?.name || member.role}
              </Badge>
              <Badge variant={member.isActive ? "default" : "secondary"}>
                {member.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
          </Card>
        ))}
      </div>

      {filteredMembers.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            No team members found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {searchQuery ? 'Try adjusting your search criteria.' : 'Start by inviting your first team member.'}
          </p>
        </div>
      )}

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">Invite Team Member</h2>
            <form onSubmit={handleInviteSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Email Address</label>
                <Input
                  type="email"
                  value={inviteForm.email}
                  onChange={(e) => setInviteForm({...inviteForm, email: e.target.value})}
                  placeholder="colleague@franchiseen.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Position</label>
                <Input
                  value={inviteForm.position}
                  onChange={(e) => setInviteForm({...inviteForm, position: e.target.value})}
                  placeholder="e.g., Senior Developer, Marketing Manager"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Role</label>
                  <select
                    value={inviteForm.role}
                    onChange={(e) => setInviteForm({...inviteForm, role: e.target.value})}
                    className="w-full p-2 border rounded-md"
                  >
                    {availableRoles.map((role) => (
                      <option key={role.id} value={role.id}>{role.name}</option>
                    ))}
                  </select>
                </div>


                <div>
                  <label className="block text-sm font-medium mb-2">Departments</label>
                  <div className="border rounded-md p-2 max-h-32 overflow-y-auto">
                    {availableDepartments.map((dept) => (
                      <label key={dept.id} className={`flex items-center gap-2 p-2 hover:bg-gray-50 rounded transition-colors ${
                        dept.id === 'home' ? 'bg-blue-50 border border-blue-200' : ''
                      }`}>
                        <input
                          type="checkbox"
                          checked={inviteForm.departments.includes(dept.id)}
                          onChange={(e) => handleDepartmentToggle(dept.id, e.target.checked)}
                          disabled={dept.id === 'home'} // Home is always required
                          className="rounded"
                        />
                        <span className={`text-sm ${dept.id === 'home' ? 'font-medium text-blue-700' : ''}`}>
                          {dept.name}
                        </span>
                        {dept.id === 'home' && (
                          <span className="text-xs text-blue-600 font-medium">(Required)</span>
                        )}
                        {dept.accessLevel === 'closed' && dept.id !== 'home' && (
                          <span className="text-xs text-gray-500">(Closed)</span>
                        )}
                      </label>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    💡 <strong>Home</strong> is required for all team members. Select additional departments as needed.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Welcome Message (Optional)</label>
                <textarea
                  value={inviteForm.message}
                  onChange={(e) => setInviteForm({...inviteForm, message: e.target.value})}
                  placeholder="Welcome to the Franchiseen team!"
                  className="w-full p-2 border rounded-md h-20 resize-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1">
                  Send Invitation
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowInviteModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}