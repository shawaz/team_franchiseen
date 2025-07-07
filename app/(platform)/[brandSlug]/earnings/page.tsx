'use client'

import React from 'react'
import Table from '@/components/ui/table/Table';
import TableHead from '@/components/ui/table/TableHead';
import TableBody from '@/components/ui/table/TableBody';
import TableRow from '@/components/ui/table/TableRow';
import TableCell from '@/components/ui/table/TableCell';
import TableHeaderCell from '@/components/ui/table/TableHeaderCell';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useParams } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id, Doc } from '@/convex/_generated/dataModel';

function EarningsPage() {
  const params = useParams();
  const businessId = params?.businessId as Id<'businesses'>;
  const franchises = useQuery(api.franchise.list, {}) as Doc<'franchise'>[] | undefined;

  // Filter franchises by businessId
  const filteredFranchises = React.useMemo(() => {
    if (!franchises) return [];
    return franchises.filter(f => f.businessId === businessId);
  }, [franchises, businessId]);

  return (
    <div className=" min-h-screen">
      {/* Earnings Summary Card */}
      <div className="bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 shadow p-6 mb-6 flex flex-col md:flex-row gap-6">
        <div className="flex-1 flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M7 10v4h10v-4H7zm0 0V7a5 5 0 0 1 10 0v3" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div>
              <div className="text-3xl font-bold">$3,210</div>
              <div className="text-gray-500 dark:text-gray-400 text-sm">Your total earnings</div>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="bg-green-100 dark:bg-green-900 text-green-600 px-2 py-1 rounded text-xs font-medium">+32%</span>
            <span className="text-xs text-gray-400 dark:text-gray-500">from last month</span>
          </div>
          <div className="text-xs text-gray-400 dark:text-gray-500 mt-4">Update your payout method in settings.</div>
        </div>
        {/* Graph Placeholder */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full h-32 md:h-40 dark:stroke-white dark:fill-white">
            {/* Replace with chart library later */}
            <svg viewBox="0 0 300 100" className="w-full h-full dark:stroke-white dark:fill-white">
              <polyline
                fill="none"
                stroke="#111827"
                strokeWidth="3"
                points="0,80 30,60 60,70 90,40 120,60 150,30 180,60 210,40 240,70 270,30 300,80"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 shadow p-6 flex flex-col">
          <div className="text-2xl font-bold mb-1">$3,210</div>
          <div className="text-gray-500  dark:text-gray-400 text-sm mb-2">Earning this month</div>
          <div className="h-1 bg-stone-700 rounded-full">
            <div className="h-1 bg-red-400 rounded-full w-1/2"></div>
          </div>
        </div>
        <div className="bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 shadow p-6 flex flex-col">
          <div className="text-2xl font-bold mb-1">$3,800</div>
          <div className="text-gray-500 dark:text-gray-400 text-sm mb-2">Account Balance</div>
          <div className="h-1 bg-stone-700 rounded-full">
            <div className="h-1 bg-blue-400 rounded-full w-1/2"></div>
          </div>
        </div>
        <div className="bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 shadow p-6 flex flex-col">
          <div className="text-2xl font-bold mb-1">$10,800</div>
          <div className="text-gray-500 dark:text-gray-400 text-sm mb-2">Life Time Sales</div>
          <div className="h-1 bg-stone-700 rounded-full">
            <div className="h-1 bg-green-400 rounded-full w-1/2"></div>
          </div>
        </div>
      </div>

      {/* Best Selling Franchises Table */}
      <div className="bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700">
        <div className="overflow-x-auto rounded-lg">
          <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800 rounded-xl shadow-sm p-0 overflow-hidden">
            <TableHead>
              <TableRow className="bg-muted/30">
                <TableHeaderCell>Franchise</TableHeaderCell>
                <TableHeaderCell>Sales</TableHeaderCell>
                <TableHeaderCell>Amount</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {franchises === undefined ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-6">Loading...</TableCell>
                </TableRow>
              ) : filteredFranchises.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-6">No franchises found.</TableCell>
                </TableRow>
              ) : (
                filteredFranchises.map(franchise => (
                  <TableRow key={franchise._id} className="hover:bg-muted/20 transition-colors group">
                    <TableCell className="py-3 px-4 flex items-center gap-3 whitespace-nowrap">
                      <Avatar>
                        {/* If you have a logoUrl, use it here. Otherwise fallback to first letter. */}
                        {/* <AvatarImage src={franchise.logoUrl} alt={franchise.building} /> */}
                        <AvatarFallback>{franchise.building?.[0] || 'F'}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{franchise.building}</span>
                    </TableCell>
                    <TableCell className="py-3 px-4 whitespace-nowrap text-sm text-muted-foreground font-medium">--</TableCell>
                    <TableCell className="py-3 px-4 whitespace-nowrap text-sm font-semibold text-green-600">--</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}

export default EarningsPage  