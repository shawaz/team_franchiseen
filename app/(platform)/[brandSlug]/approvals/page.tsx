'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { useUser } from '@clerk/nextjs';
import { useRouter, useParams } from 'next/navigation';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import type { Franchise, FranchiseStatus } from '@/types/api';
import FranchiseApprovalModal from '@/components/franchise/FranchiseApprovalModal';
import FullScreenLoader from '@/components/ui/FullScreenLoader';
import { ErrorBoundary, ErrorComponent } from '@/components/error';
import { useSolOnly } from '@/contexts/SolOnlyContext';


// Loading component for suspense fallback
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 dark:border-gray-100"></div>
  </div>
);

// Error fallback component
function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <ErrorComponent 
      title="Something went wrong"
      message={error.message}
      retry={resetErrorBoundary}
    />
  );
}

// Main component with error boundary and suspense
function ApprovalsPageContent() {
  const { businessId } = useParams<{ businessId: string }>();
  const { user } = useUser();
  const router = useRouter();
  const { formatSol } = useSolOnly();
  const convexUser = useQuery(api.myFunctions.getUserByEmail, {
    email: user?.emailAddresses?.[0]?.emailAddress || ''
  });

  const handleStatusUpdate = async (franchiseId: string, status: FranchiseStatus, reason?: string) => {
    if (!franchiseId || !status) return;
    
    setIsStatusUpdating(true);
    try {
      await updateFranchiseStatus({
        franchiseId: franchiseId as Id<'franchise'>,
        status: status as string, // Cast to string to match the expected type
        ...(reason && { rejectionReason: reason })
      });
      // Trigger a refetch by updating the key
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      console.error('Error updating franchise status:', error);
    } finally {
      setIsStatusUpdating(false);
    }
  };
  const business = useQuery(api.businesses.getById, { businessId: businessId as Id<'businesses'> });
  const allFranchises = useQuery(api.franchise.list, {});
  const updateFranchiseStatus = useMutation(api.franchise.updateStatus);
  const [approvalModal, setApprovalModal] = useState<{
    open: boolean;
    franchise: Franchise | null;
    action: 'accept' | 'reject' | null;
  }>({ open: false, franchise: null, action: null });
  const [isStatusUpdating, setIsStatusUpdating] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Only show franchises with Pending Approval for this business
  // Create a type for the Convex franchise document
  type ConvexFranchise = {
    _id: Id<'franchise'>;
    _creationTime: number;
    businessId: Id<'businesses'>;
    owner_id: Id<'users'>;
    building: string;
    locationAddress: string; // Make required to match expected type
    status: string;
    launchStartDate: number; // Make required to match expected type
    launchEndDate: number;   // Make required to match expected type
    createdAt: number;
    costPerArea: number;
    totalInvestment: number; // Make required to match expected type
    carpetArea: number;      // Make required to match expected type
    selectedShares: number;  // Make required to match expected type
    totalShares: number;     // Make required to match expected type
    [key: string]: unknown;
  };

  const pendingFranchises = useMemo(() => {
    if (!allFranchises) return [];
    // Use type assertion to handle Convex document types
    return allFranchises.filter((f) => 
      f.businessId === businessId && f.status === 'Pending Approval'
    ) as unknown as ConvexFranchise[];
  }, [allFranchises, businessId]);

  // Map status to badge classes
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending Approval':
        return 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Handle loading states
  if (!allFranchises || !business) {
    return <LoadingFallback />;
  }

  // Handle error states
  if (allFranchises === null || business === null) {
    return (
      <ErrorComponent 
        title="Failed to load data"
        message="Unable to load franchise data. Please try again later."
        retry={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="lg:col-span-3 space-y-8" key={refreshKey}>
      <section className="bg-white dark:bg-stone-800 rounded-xl shadow-sm">
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-bold">Franchise Approvals</h2>
          <p className="text-gray-500 mt-1">Approve or reject new franchise requests for your business.</p>
        </div>
        <div>
          {pendingFranchises.length === 0 && (
            <div className="p-6 text-center text-gray-500">No franchises pending approval.</div>
          )}
          {pendingFranchises.map((franchise) => (
            <div
              key={franchise._id}
              className="border-t p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-stone-700/50 transition-colors duration-200"
              onClick={() => router.push(`/business/${businessId}/franchise/${franchise._id}`)}
            >
              <div className="flex items-center space-x-4 z-0">
                <div className="flex-grow">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="font-medium text-lg">{franchise.building}</h2>
                    {franchise.status && (
                      <span className={`ml-2 px-4 py-2 rounded-full text-sm font-semibold ${getStatusBadge(franchise.status)}`}>
                        {franchise.status}
                      </span>
                    )}
                  </div>
                  <div className='flex items-center justify-between mb-2'>
                    <div>
                      <p className="text-sm text-gray-500">{franchise.locationAddress}</p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm dark:text-gray-400 text-gray-500">Area:</span>
                          <span className="text-sm font-semibold dark:text-gray-100 text-gray-900">
                            {franchise.carpetArea} sq ft
                          </span>
                          <span className="text-sm dark:text-gray-400 text-gray-500">•</span>
                          <span className="text-sm dark:text-gray-400 text-gray-500">Investment:</span>
                          <span className="text-sm font-semibold dark:text-gray-100 text-gray-900">
                            {formatSol(Number(franchise.totalInvestment))}
                          </span>
                        </div>
                      </div>
                    </div>
                    {convexUser && business?.owner_id === convexUser._id && (
                      <div className="flex gap-2 mt-2">
                        <button
                          className="px-4 cursor-pointer py-2 border border-stone-200 dark:border-stone-700 text-sm font-medium rounded-md text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 hover:bg-green-600 hover:text-white dark:hover:bg-green-700 transition-colors duration-200"
                          onClick={e => {
                            e.stopPropagation();
                            setApprovalModal({ open: true, franchise, action: 'accept' });
                          }}
                        >
                          Accept
                        </button>
                        <button
                          className="px-4 cursor-pointer py-2 border border-stone-200 dark:border-stone-700 text-sm font-medium rounded-md text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-600 hover:text-white dark:hover:bg-red-700 transition-colors duration-200"
                          onClick={e => {
                            e.stopPropagation();
                            setApprovalModal({ open: true, franchise, action: 'reject' });
                          }}
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* Approval Modal */}
      <FranchiseApprovalModal
        open={approvalModal.open}
        franchise={approvalModal.franchise}
        action={approvalModal.action}
        onClose={async (result) => {
          setApprovalModal({ open: false, franchise: null, action: null });
          if (result === 'accepted' && approvalModal.franchise) {
            setIsStatusUpdating(true);
            const allSharesSold = (approvalModal.franchise.selectedShares || 0) >= (approvalModal.franchise.totalShares || 0);
            await handleStatusUpdate(approvalModal.franchise._id, allSharesSold ? 'Launching' : 'Funding');
          } else if (result === 'rejected' && approvalModal.franchise) {
            await handleStatusUpdate(approvalModal.franchise._id, 'Closed');
          }
        }}
      />
      {isStatusUpdating && <FullScreenLoader />}
    </div>
  );
}

function ApprovalsPage() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={<LoadingFallback />}>
        <ApprovalsPageContent />
      </Suspense>
    </ErrorBoundary>
  );
}

export default ApprovalsPage;