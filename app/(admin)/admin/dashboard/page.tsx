import React from 'react';
import { Card } from '@/components/ui/card';
import { api } from '@/convex/_generated/api';
import { fetchQuery } from 'convex/nextjs';
import ActivityCard from '@/components/dashboard/ActivityCard';
import { User, Business, Franchise } from '@/types/api';

export default async function AdminDashboard() {
  // Fetch all users, businesses, and franchises
  const users = await fetchQuery(api.myFunctions.listAllUsers, {}) as User[];
  const businesses = await fetchQuery(api.businesses.listAll, {}) as Business[];
  const franchises = await fetchQuery(api.franchise.list, {}) as Franchise[];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Users</div>
          <div className="text-3xl font-bold">{users.length}</div>
        </Card>
        <Card>
          <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Businesses</div>
          <div className="text-3xl font-bold">{businesses.length}</div>
        </Card>
        <Card>
          <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Franchises</div>
          <div className="text-3xl font-bold">{franchises.length}</div>
        </Card>
        <Card>
          <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Teams</div>
          <div className="text-3xl font-bold">0</div>
        </Card>
      </div>
      {/* Activity Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
        <ActivityCard />
        <ActivityCard />
        <ActivityCard />
        <ActivityCard />
      </div>
    </div>
  );
}