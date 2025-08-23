"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Search, CheckCircle, XCircle, AlertTriangle, Eye, FileText, Upload } from "lucide-react";
import Table from "@/components/ui/table/Table";
import TableHead from "@/components/ui/table/TableHead";
import TableBody from "@/components/ui/table/TableBody";
import TableRow from "@/components/ui/table/TableRow";
import TableCell from "@/components/ui/table/TableCell";
import TableHeaderCell from "@/components/ui/table/TableHeaderCell";
import { api } from "@/convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import { toast } from "sonner";
import { AdminTableSkeleton } from "@/components/skeletons/TableSkeleton";

type BusinessStatus = "all" | "Active" | "Inactive" | "Rejected" | "Deleted";

type Industry = { _id: string; name: string };
type Category = { _id: string; name: string; industry_id: string };
type Business = {
  _id: string;
  name: string;
  logoUrl?: string;
  industry: Industry | null;
  category: Category | null;
  costPerArea?: number;
  min_area?: number;
  status: string;
  verificationStatus?: string;
  adminNotes?: string;
  documents?: {
    businessLicense?: {
      url: string;
      status: string;
      adminNotes?: string;
      uploadedAt: number;
    };
    taxCertificate?: {
      url: string;
      status: string;
      adminNotes?: string;
      uploadedAt: number;
    };
    ownershipProof?: {
      url: string;
      status: string;
      adminNotes?: string;
      uploadedAt: number;
    };
  };
  _creationTime: number;
  updatedAt: number;
};

type Franchise = {
  _id: string;
  businessId: string;
  building: string;
  status: string;
};

function AdminBusiness() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<BusinessStatus>("all");
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  // Fetch all data using useQuery for real-time updates
  const businessesData = useQuery(api.businesses.listAll, {}) || [];
  const franchisesDataRaw = useQuery(api.franchise.list, {});

  // Wrap franchisesData in useMemo to prevent dependency issues
  const franchisesData = useMemo(
    () => franchisesDataRaw || [],
    [franchisesDataRaw],
  );

  // Cast the businesses data to the correct type
  const businesses = businessesData as unknown as Business[];

  // Verification mutations
  const updateVerificationStatus = useMutation(api.businesses.updateVerificationStatus);
  const updateDocumentStatus = useMutation(api.businesses.updateDocumentStatus);

  // Handle business verification
  const handleVerifyBusiness = async (businessId: string, action: 'verify' | 'reject') => {
    setLoading(businessId);
    try {
      await updateVerificationStatus({
        businessId: businessId as any,
        verificationStatus: action === 'verify' ? 'verified' : 'rejected',
        status: action === 'verify' ? 'Active' : 'Inactive'
      });

      toast.success(`Business ${action === 'verify' ? 'verified' : 'rejected'} successfully`);
      setSelectedBusiness(null);
    } catch (error) {
      console.error('Error updating business verification:', error);
      toast.error(`Failed to ${action} business`);
    } finally {
      setLoading(null);
    }
  };

  // Handle document verification
  const handleDocumentVerification = async (businessId: string, documentType: string, action: 'approve' | 'reject') => {
    setLoading(businessId);
    try {
      await updateDocumentStatus({
        businessId: businessId as any,
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

  // Filter and sort businesses
  const filteredBusinesses = useMemo(() => {
    return businesses
      .filter((business) => {
        // Filter by status
        if (statusFilter !== "all" && business.status !== statusFilter) {
          return false;
        }

        // Filter by search query
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          const industryName = business.industry?.name?.toLowerCase() || "";
          const categoryName = business.category?.name?.toLowerCase() || "";

          const matchesSearch =
            business.name.toLowerCase().includes(query) ||
            industryName.includes(query) ||
            categoryName.includes(query);

          if (!matchesSearch) return false;
        }

        return true;
      })
      .sort((a, b) => {
        // Sort by most recent first (using _creationTime)
        return b.updatedAt - a.updatedAt;
      });
  }, [businesses, statusFilter, searchQuery]);

  // Group franchises by businessId and then by status
  const franchisesByBusiness = useMemo(() => {
    const result: Record<string, Franchise[]> = {};
    const franchises = franchisesData || [];
    franchises.forEach((f) => {
      if (!result[f.businessId]) result[f.businessId] = [];
      result[f.businessId].push({
        _id: f._id,
        businessId: f.businessId,
        building: f.building,
        status: f.status,
      });
    });
    return result;
  }, [franchisesData]);

  const statusBadge = (status: string) => {
    switch (status) {
      case "Pending Approval":
        return "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200";
      case "Funding":
        return "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-500";
      case "Launching":
        return "bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-500";
      case "Active":
        return "bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-500";
      case "Closed":
        return "bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-500";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const statusFilters: { value: BusinessStatus; label: string }[] = [
    { value: "all", label: "All" },
    { value: "Active", label: "Active" },
    { value: "Inactive", label: "Inactive" },
    { value: "Rejected", label: "Rejected" },
    { value: "Deleted", label: "Deleted" },
  ];

  // Check if data is loading
  const isLoading = businessesData === undefined || franchisesDataRaw === undefined;

  if (isLoading) {
    return <AdminTableSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Businesses</h1>
          {/* <p className="text-sm text-gray-500 mt-1">
            {filteredBusinesses.length} {filteredBusinesses.length === 1 ? 'business' : 'businesses'} found
            {statusFilter !== 'all' ? ` in ${statusFilter}` : ''}
            {searchQuery ? ` matching "${searchQuery}"` : ''}
          </p> */}
        </div>
        <Button className="font-semibold">Add Business</Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex flex-wrap gap-2">
          {statusFilters.map((filter) => (
            <Button
              key={filter.value}
              variant={statusFilter === filter.value ? "outline" : "default"}
              className={`${statusFilter === filter.value ? "" : "bg-stone-900 text-white hover:bg-stone-800"}`}
              onClick={() => setStatusFilter(filter.value)}
            >
              {filter.label}
              {statusFilter === filter.value && (
                <span className="ml-2 text-xs bg-white/20 px-2 py-0.5 rounded-full">
                  {filter.value === "all"
                    ? businesses.length
                    : businesses.filter((b) => b.status === filter.value)
                        .length}
                </span>
              )}
            </Button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search businesses..."
            className="pl-10 w-full"
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchQuery(e.target.value)
            }
          />
        </div>
      </div>
      <div className="overflow-x-auto rounded-xl shadow-sm border bg-white dark:bg-stone-800">
        <Table>
          <TableHead className="bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100">
            <TableRow>
              <TableHeaderCell>
                <input type="checkbox" />
              </TableHeaderCell>
              <TableHeaderCell>Business</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Verification</TableHeaderCell>
              <TableHeaderCell>Approval</TableHeaderCell>
              <TableHeaderCell>Fundraising</TableHeaderCell>
              <TableHeaderCell>Launching</TableHeaderCell>
              <TableHeaderCell>Active</TableHeaderCell>
              <TableHeaderCell>Closed</TableHeaderCell>
              <TableHeaderCell className=""></TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBusinesses.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="text-center py-8 text-gray-500"
                >
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <Search className="h-8 w-8 text-gray-400" />
                    <p>No businesses found</p>
                    <p className="text-sm text-gray-400">
                      Try adjusting your search or filter criteria
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredBusinesses.map((business) => {
                const businessFranchises =
                  franchisesByBusiness[business._id] || [];
                // Count franchises by status
                const statusCounts: Record<string, number> = {
                  Approval: 0,
                  Funding: 0,
                  Launching: 0,
                  Active: 0,
                  Closed: 0,
                };
                businessFranchises.forEach((f) => {
                  if (statusCounts[f.status] !== undefined)
                    statusCounts[f.status]++;
                });
                // Determine business status
                const businessStatus = business.status;
                return (
                  <TableRow
                    key={business._id}
                    className="hover:bg-gray-50 dark:hover:bg-stone-700 transition align-top"
                  >
                    <TableCell className="px-4 py-3 align-middle">
                      <input type="checkbox" />
                    </TableCell>

                    <TableCell className="flex items-center gap-4 px-4 py-3 align-middle">
                      <Image
                        src={business.logoUrl || "/logo/logo-2.svg"}
                        alt={business.name}
                        width={32}
                        height={32}
                        className="rounded-md"
                      />
                      <span className="font-semibold text-black dark:text-white">
                        {business.name}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-3 align-middle text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${statusBadge(businessStatus)}`}
                      >
                        {businessStatus}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-3 align-middle text-center">
                      {getVerificationBadge(business.verificationStatus)}
                    </TableCell>
                    {[
                      "Pending Approval",
                      "Funding",
                      "Launching",
                      "Active",
                      "Closed",
                    ].map((status) => (
                      <TableCell
                        key={status}
                        className="px-4 py-3 align-middle text-center"
                      >
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${statusBadge(status)}`}
                        >
                          {statusCounts[status]}
                        </span>
                      </TableCell>
                    ))}
                    <TableCell className="px-4 py-3 text-right align-middle">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <span className="sr-only">Open menu</span>
                            <svg
                              width="20"
                              height="20"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                cx="12"
                                cy="5"
                                r="1.5"
                                fill="currentColor"
                              />
                              <circle
                                cx="12"
                                cy="12"
                                r="1.5"
                                fill="currentColor"
                              />
                              <circle
                                cx="12"
                                cy="19"
                                r="1.5"
                                fill="currentColor"
                              />
                            </svg>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setSelectedBusiness(business)}>
                            <Eye className="w-4 h-4 mr-2" />
                            Review Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setSelectedBusiness(business)}>
                            <FileText className="w-4 h-4 mr-2" />
                            View Documents
                          </DropdownMenuItem>
                          {(!business.verificationStatus || business.verificationStatus === 'pending') && (
                            <>
                              <DropdownMenuItem
                                onClick={() => handleVerifyBusiness(business._id, 'verify')}
                                disabled={loading === business._id}
                                className="text-green-600"
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Verify Business
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleVerifyBusiness(business._id, 'reject')}
                                disabled={loading === business._id}
                                className="text-red-600"
                              >
                                <XCircle className="w-4 h-4 mr-2" />
                                Reject Business
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Business Detail Modal */}
      {selectedBusiness && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-stone-800 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Business Review: {selectedBusiness.name}</h2>
                <Button variant="outline" onClick={() => setSelectedBusiness(null)}>
                  Close
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Basic Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Business Name</label>
                      <p className="text-base">{selectedBusiness.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Category</label>
                      <p className="text-base">{selectedBusiness.category?.name || 'Not specified'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Industry</label>
                      <p className="text-base">{selectedBusiness.industry?.name || 'Not specified'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Current Status</label>
                      <p className="text-base">{selectedBusiness.status}</p>
                    </div>
                  </div>
                </div>

                {/* Verification Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Verification Status</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Verification Status</label>
                      <div className="mt-1">{getVerificationBadge(selectedBusiness.verificationStatus)}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Cost per Area</label>
                      <p className="text-base">${selectedBusiness.costPerArea || 'Not set'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Minimum Area</label>
                      <p className="text-base">{selectedBusiness.min_area || 'Not set'} sq ft</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Created</label>
                      <p className="text-base">{new Date(selectedBusiness._creationTime).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Document Verification */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4">Document Verification</h3>
                <div className="grid grid-cols-1 gap-4">
                  {/* Business License */}
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Business License</h4>
                      {selectedBusiness.documents?.businessLicense ?
                        getDocumentBadge(selectedBusiness.documents.businessLicense.status) :
                        <span className="text-sm text-gray-500">Not uploaded</span>
                      }
                    </div>
                    {selectedBusiness.documents?.businessLicense && (
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(selectedBusiness.documents?.businessLicense?.url, '_blank')}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        {selectedBusiness.documents.businessLicense.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleDocumentVerification(selectedBusiness._id, 'businessLicense', 'approve')}
                              disabled={loading === selectedBusiness._id}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDocumentVerification(selectedBusiness._id, 'businessLicense', 'reject')}
                              disabled={loading === selectedBusiness._id}
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Tax Certificate */}
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Tax Certificate</h4>
                      {selectedBusiness.documents?.taxCertificate ?
                        getDocumentBadge(selectedBusiness.documents.taxCertificate.status) :
                        <span className="text-sm text-gray-500">Not uploaded</span>
                      }
                    </div>
                    {selectedBusiness.documents?.taxCertificate && (
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(selectedBusiness.documents?.taxCertificate?.url, '_blank')}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        {selectedBusiness.documents.taxCertificate.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleDocumentVerification(selectedBusiness._id, 'taxCertificate', 'approve')}
                              disabled={loading === selectedBusiness._id}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDocumentVerification(selectedBusiness._id, 'taxCertificate', 'reject')}
                              disabled={loading === selectedBusiness._id}
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Ownership Proof */}
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Ownership Proof</h4>
                      {selectedBusiness.documents?.ownershipProof ?
                        getDocumentBadge(selectedBusiness.documents.ownershipProof.status) :
                        <span className="text-sm text-gray-500">Not uploaded</span>
                      }
                    </div>
                    {selectedBusiness.documents?.ownershipProof && (
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(selectedBusiness.documents?.ownershipProof?.url, '_blank')}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        {selectedBusiness.documents.ownershipProof.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleDocumentVerification(selectedBusiness._id, 'ownershipProof', 'approve')}
                              disabled={loading === selectedBusiness._id}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDocumentVerification(selectedBusiness._id, 'ownershipProof', 'reject')}
                              disabled={loading === selectedBusiness._id}
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

              {/* Admin Notes */}
              {selectedBusiness.adminNotes && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2">Admin Notes</h3>
                  <p className="text-base bg-gray-50 dark:bg-stone-700 p-3 rounded">{selectedBusiness.adminNotes}</p>
                </div>
              )}

              {/* Action Buttons */}
              {(!selectedBusiness.verificationStatus || selectedBusiness.verificationStatus === 'pending') && (
                <div className="flex items-center gap-4 mt-6 pt-6 border-t">
                  <Button
                    onClick={() => handleVerifyBusiness(selectedBusiness._id, 'verify')}
                    disabled={loading === selectedBusiness._id}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Verify Business
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleVerifyBusiness(selectedBusiness._id, 'reject')}
                    disabled={loading === selectedBusiness._id}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject Business
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

export default AdminBusiness;
