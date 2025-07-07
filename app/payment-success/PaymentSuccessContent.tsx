'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useUser } from '@clerk/nextjs';

export default function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const franchiseId = searchParams ? searchParams.get('franchiseId') : null;
  const shares = searchParams ? searchParams.get('shares') : null;
  const costPerShare = searchParams ? searchParams.get('costPerShare') : null;
  const { user } = useUser();
  const userEmail = user?.emailAddresses?.[0]?.emailAddress || null;
  const convexUser = useQuery(api.myFunctions.getUserByEmail, userEmail ? { email: userEmail } : 'skip');
  const franchise = useQuery(api.franchise.getById, franchiseId ? { franchiseId: franchiseId as Id<'franchise'> } : 'skip');
  const businessId = franchise?.businessId;
  const [allocationStatus, setAllocationStatus] = React.useState<'pending' | 'success' | 'error'>('pending');

  React.useEffect(() => {
    async function allocateShares() {
      if (franchiseId && convexUser && shares && costPerShare) {
        try {
          const res = await fetch('/api/allocate-shares', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              franchiseId,
              userId: convexUser._id,
              userName: user?.fullName || userEmail || '',
              userImage: user?.imageUrl || '',
              numberOfShares: Number(shares),
              costPerShare: Number(costPerShare),
            }),
          });
          if (!res.ok) throw new Error('Failed to allocate shares');
          setAllocationStatus('success');
        } catch {
          setAllocationStatus('error');
        }
      }
    }
    allocateShares();
  }, [franchiseId, convexUser, shares, costPerShare, user, userEmail]);

  React.useEffect(() => {
    if (allocationStatus === 'success' && franchiseId && businessId) {
      const timeout = setTimeout(() => {
        router.push(`/business/${businessId}/franchise/${franchiseId}`);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [allocationStatus, franchiseId, businessId, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Payment Successful!</h1>
      {allocationStatus === 'pending' && <p className="mb-2">Allocating your shares...</p>}
      {allocationStatus === 'success' && <p className="mb-2">Your shares have been allocated. Thank you for your investment!</p>}
      {allocationStatus === 'error' && <p className="mb-2 text-red-500">There was an error allocating your shares. Please contact support.</p>}
      {!franchise && franchiseId && <p className="mb-2">Loading franchise details...</p>}
      {franchiseId && businessId ? (
        <>
          <p className="mb-2">Redirecting to your franchise page...</p>
          <Link href={`/business/${businessId}/franchise/${franchiseId}`}>Go to Franchise Page Now</Link>
        </>
      ) : !franchise && franchiseId ? (
        <p className="mb-2 text-red-500">Could not find franchise details.</p>
      ) : (
        <Link href="/">Go back home</Link>
      )}
    </div>
  );
} 