"use client";

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import Table from '@/components/ui/table/Table';
import TableHead from '@/components/ui/table/TableHead';
import TableBody from '@/components/ui/table/TableBody';
import TableRow from '@/components/ui/table/TableRow';
import TableCell from '@/components/ui/table/TableCell';
import TableHeaderCell from '@/components/ui/table/TableHeaderCell';
import { api } from '@/convex/_generated/api';
import { useQuery, useMutation } from 'convex/react';
import { toast } from 'sonner';
import { Search, CheckCircle, XCircle, AlertTriangle, Eye, FileText, Wallet, Filter } from 'lucide-react';

interface User {
  _id: string;
  email: string;
  first_name?: string;
  family_name?: string;
  avatar?: string;
  phone?: string;
  roles?: string[];
  isActivated?: boolean;
  verificationStatus?: string;
  adminNotes?: string;
  walletAddress?: string;
  seedPhraseVerified?: boolean;
  documents?: {
    identityProof?: {
      url: string;
      status: string;
      adminNotes?: string;
      uploadedAt: number;
    };
    addressProof?: {
      url: string;
      status: string;
      adminNotes?: string;
      uploadedAt: number;
    };
    incomeProof?: {
      url: string;
      status: string;
      adminNotes?: string;
      uploadedAt: number;
    };
  };
  created_at: number;
  updated_at?: number;
}

function UsersDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  // Get all users for admin review
  const users = useQuery(api.users.listAll, {}) || [];

  // Verification mutations
  const updateVerificationStatus = useMutation(api.users.updateVerificationStatus);
  const updateDocumentStatus = useMutation(api.users.updateDocumentStatus);

  // Filter users based on search and status
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           user.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           user.family_name?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'all' ||
                           user.verificationStatus === statusFilter ||
                           (statusFilter === 'pending' && !user.verificationStatus);

      return matchesSearch && matchesStatus;
    });
  }, [users, searchQuery, statusFilter]);

  // Handle user verification
  const handleVerifyUser = async (userId: string, action: 'verify' | 'reject') => {
    setLoading(userId);
    try {
      await updateVerificationStatus({
        userId: userId as any,
        verificationStatus: action === 'verify' ? 'verified' : 'rejected',
      });

      toast.success(`User ${action === 'verify' ? 'verified' : 'rejected'} successfully`);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error updating user verification:', error);
      toast.error(`Failed to ${action} user`);
    } finally {
      setLoading(null);
    }
  };

  // Handle document verification
  const handleDocumentVerification = async (userId: string, documentType: string, action: 'approve' | 'reject') => {
    setLoading(userId);
    try {
      await updateDocumentStatus({
        userId: userId as any,
        documentType,
        status: action === 'approve' ? 'approved' : 'rejected',
      });

      toast.success(`Document ${action === 'approve' ? 'approved' : 'rejected'} successfully`);
    } catch (error) {
      console.error('Error updating document status:', error);
      toast.error(`Failed to ${action} document`);
    } finally {
      setLoading(null);
    }
  };

  // Get verification status badge
  const getVerificationBadge = (verificationStatus?: string) => {
    switch (verificationStatus) {
      case 'verified':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Verified</span>;
      case 'rejected':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />Rejected</span>;
      default:
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><AlertTriangle className="w-3 h-3 mr-1" />Pending</span>;
    }
  };

  // Get document status badge
  const getDocumentBadge = (status?: string) => {
    switch (status) {
      case 'approved':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Approved</span>;
      case 'rejected':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />Rejected</span>;
      default:
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><AlertTriangle className="w-3 h-3 mr-1" />Pending</span>;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-stone-600 dark:text-stone-400">
            Review and verify user registrations
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            {filteredUsers.filter(u => !u.verificationStatus || u.verificationStatus === 'pending').length} Pending
          </Badge>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            {filteredUsers.filter(u => u.verificationStatus === 'verified').length} Verified
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-md text-sm"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending Review</option>
              <option value="verified">Verified</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </Card>
      {/* Users List */}
      <div className="grid gap-6">
        {filteredUsers.length === 0 ? (
          <Card className="p-8 text-center">
            <Eye className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">No Users Found</h3>
            <p className="text-stone-600 dark:text-stone-400">
              No users match your current filters.
            </p>
          </Card>
        ) : (
          filteredUsers.map((user) => (
            <Card key={user._id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-stone-700 flex-shrink-0">
                    <Image
                      src={user.avatar || "/avatar/avatar-m-1.png"}
                      alt={user.first_name || user.email}
                      width={64}
                      height={64}
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold">
                        {user.first_name || user.family_name ?
                          `${user.first_name || ''} ${user.family_name || ''}`.trim() :
                          user.email
                        }
                      </h3>
                      {getVerificationBadge(user.verificationStatus)}
                    </div>
                    <p className="text-stone-600 dark:text-stone-400 mb-3">
                      {user.email}
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Phone:</span>
                        <span>{user.phone || 'Not provided'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Wallet className="w-4 h-4 text-gray-500" />
                        <span>{user.walletAddress ? 'Wallet Connected' : 'No Wallet'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Seed Verified:</span>
                        <span>{user.seedPhraseVerified ? 'Yes' : 'No'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Joined:</span>
                        <span>{new Date(user.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedUser(user)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Review
                  </Button>
                  {(!user.verificationStatus || user.verificationStatus === 'pending') && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => handleVerifyUser(user._id, 'verify')}
                        disabled={loading === user._id}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Verify
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleVerifyUser(user._id, 'reject')}
                        disabled={loading === user._id}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-stone-800 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">User Review: {selectedUser.first_name || selectedUser.email}</h2>
                <Button variant="outline" onClick={() => setSelectedUser(null)}>
                  Close
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Basic Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Name</label>
                      <p className="text-base">
                        {selectedUser.first_name || selectedUser.family_name ?
                          `${selectedUser.first_name || ''} ${selectedUser.family_name || ''}`.trim() :
                          'Not provided'
                        }
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <p className="text-base">{selectedUser.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Phone</label>
                      <p className="text-base">{selectedUser.phone || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Verification Status</label>
                      <div className="mt-1">{getVerificationBadge(selectedUser.verificationStatus)}</div>
                    </div>
                  </div>
                </div>

                {/* Wallet Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Wallet Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Wallet Address</label>
                      <p className="text-base font-mono text-sm">
                        {selectedUser.walletAddress || 'Not connected'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Seed Phrase Verified</label>
                      <p className="text-base">
                        {selectedUser.seedPhraseVerified ?
                          <span className="text-green-600">✓ Verified</span> :
                          <span className="text-red-600">✗ Not verified</span>
                        }
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Registration Date</label>
                      <p className="text-base">{new Date(selectedUser.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Document Verification */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4">Document Verification</h3>
                <div className="grid grid-cols-1 gap-4">
                  {/* Identity Proof */}
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Identity Proof</h4>
                      {selectedUser.documents?.identityProof ?
                        getDocumentBadge(selectedUser.documents.identityProof.status) :
                        <span className="text-sm text-gray-500">Not uploaded</span>
                      }
                    </div>
                    {selectedUser.documents?.identityProof && (
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(selectedUser.documents?.identityProof?.url, '_blank')}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        {selectedUser.documents.identityProof.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleDocumentVerification(selectedUser._id, 'identityProof', 'approve')}
                              disabled={loading === selectedUser._id}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDocumentVerification(selectedUser._id, 'identityProof', 'reject')}
                              disabled={loading === selectedUser._id}
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Address Proof */}
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Address Proof</h4>
                      {selectedUser.documents?.addressProof ?
                        getDocumentBadge(selectedUser.documents.addressProof.status) :
                        <span className="text-sm text-gray-500">Not uploaded</span>
                      }
                    </div>
                    {selectedUser.documents?.addressProof && (
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(selectedUser.documents?.addressProof?.url, '_blank')}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        {selectedUser.documents.addressProof.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleDocumentVerification(selectedUser._id, 'addressProof', 'approve')}
                              disabled={loading === selectedUser._id}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDocumentVerification(selectedUser._id, 'addressProof', 'reject')}
                              disabled={loading === selectedUser._id}
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Income Proof */}
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Income Proof</h4>
                      {selectedUser.documents?.incomeProof ?
                        getDocumentBadge(selectedUser.documents.incomeProof.status) :
                        <span className="text-sm text-gray-500">Not uploaded</span>
                      }
                    </div>
                    {selectedUser.documents?.incomeProof && (
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(selectedUser.documents?.incomeProof?.url, '_blank')}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        {selectedUser.documents.incomeProof.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleDocumentVerification(selectedUser._id, 'incomeProof', 'approve')}
                              disabled={loading === selectedUser._id}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDocumentVerification(selectedUser._id, 'incomeProof', 'reject')}
                              disabled={loading === selectedUser._id}
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {(!selectedUser.verificationStatus || selectedUser.verificationStatus === 'pending') && (
                <div className="flex items-center gap-4 mt-6 pt-6 border-t">
                  <Button
                    onClick={() => handleVerifyUser(selectedUser._id, 'verify')}
                    disabled={loading === selectedUser._id}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Verify User
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleVerifyUser(selectedUser._id, 'reject')}
                    disabled={loading === selectedUser._id}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject User
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UsersDashboard;
