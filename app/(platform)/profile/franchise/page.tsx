import React from 'react';
import { fetchQuery } from 'convex/nextjs';
import { api } from '@/convex/_generated/api';
import { currentUser } from '@clerk/nextjs/server';
import FranchiseList from '@/components/franchise/FranchiseList';

export default async function ProfileFranchise() {
  const user = await currentUser();
  if (!user?.emailAddresses?.[0]?.emailAddress) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <h1 className="text-2xl font-semibold">No Profile Found</h1>
        <p className="text-gray-600 dark:text-gray-400">Please complete your profile setup to view your franchises.</p>
      </div>
    );
  }
  
  // Get user from Convex
  const convexUser = await fetchQuery(api.myFunctions.getUserByEmail, { 
    email: user.emailAddresses[0].emailAddress 
  });

  if (!convexUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <h1 className="text-2xl font-semibold">No Profile Found</h1>
        <p className="text-gray-600 dark:text-gray-400">Please complete your profile setup to view your franchises.</p>
      </div>
    );
  }

  // If not activated, show the StripeCardholderFormWrapper
  // if (!convexUser.isActivated || !convexUser.stripeCardholderId) {
  //   return (
  //     <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
  //       <StripeCardholderFormWrapper />
  //       <p className="text-gray-600 dark:text-gray-400 text-center">Please activate your account to view your franchises.</p>
  //     </div>
  //   );
  // }

  // Get user's franchise shares
  const shares = await fetchQuery(api.shares.getFranchisesByUser, { 
    userId: convexUser._id 
  });

  if (!shares || shares.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <h1 className="text-2xl font-semibold">No Franchise Shares</h1>
        <p className="text-gray-600 dark:text-gray-400">You don&apos;t own any franchise shares yet.</p>
      </div>
    );
  }

  // Get franchise details for each share
  const franchiseDetails = await Promise.all(
    shares.map(async (share) => {
      const franchise = await fetchQuery(api.franchise.getById, { franchiseId: share.franchiseId });
      const business = franchise ? await fetchQuery(api.businesses.getById, { businessId: franchise.businessId }) : null;
      return {
        share,
        franchise,
        business
      };
    })
  );

  return <FranchiseList franchiseDetails={franchiseDetails} />;
}