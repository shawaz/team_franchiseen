import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import Table from '@/components/ui/table/Table';
import TableHead from '@/components/ui/table/TableHead';
import TableBody from '@/components/ui/table/TableBody';
import TableRow from '@/components/ui/table/TableRow';
import TableCell from '@/components/ui/table/TableCell';
import TableHeaderCell from '@/components/ui/table/TableHeaderCell';
import { api } from '@/convex/_generated/api';
import { fetchQuery } from 'convex/nextjs';
import { User } from '@/types/api';

async function UsersDashboard() {
  // Fetch all users from Convex with proper typing
  const users = await fetchQuery(api.myFunctions.listAllUsers, {}) as User[];

  return (
    <div>
      <div className='flex items-center justify-between mb-4'>
        <h1 className='text-2xl font-bold'>Users</h1>
        <Button variant="outline" className="font-semibold">Add User</Button>
      </div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-4">
          <Button variant="outline" className="font-semibold">All</Button>
          <Button variant="ghost">Active</Button>
          <Button variant="ghost">Inactive</Button>
        </div>
        <input
          type="text"
          placeholder="Filter Users"
          className="border rounded-md px-3 py-2 w-64 focus:outline-none focus:ring"
        />
      </div>
      <div className="overflow-x-auto rounded-xl shadow-sm border bg-white dark:bg-stone-800">
        <Table>
          <TableHead className='bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100'>
            <TableRow>
              <TableHeaderCell>
                <input type="checkbox" />
              </TableHeaderCell>
              <TableHeaderCell>User</TableHeaderCell>
              <TableHeaderCell>Email</TableHeaderCell>
              <TableHeaderCell>Phone</TableHeaderCell>
              <TableHeaderCell>Roles</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell className=""></TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => {
              return (
                <TableRow key={user._id} className="hover:bg-gray-50 dark:hover:bg-stone-700 transition align-top">
                  <TableCell className="px-4 py-3 align-middle">
                    <input type="checkbox" />
                  </TableCell>
                  <TableCell className="flex items-center gap-4 px-4 py-3 align-middle">
                    <Image
                      src={user.avatar || '/avatar/avatar-m-1.png'}
                      alt={user.firstName || user.email || 'User'}
                      width={32}
                      height={32}
                      className="rounded-md"
                    />
                    <span className="font-semibold text-black dark:text-white">
                      {user.firstName || ''} {user.familyName || ''}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-3 align-middle">{user.email}</TableCell>
                  <TableCell className="px-4 py-3 align-middle">{user.phone || '—'}</TableCell>
                  <TableCell className="px-4 py-3 align-middle">
                    {user.roles && user.roles.length > 0 ? user.roles.join(', ') : '—'}
                  </TableCell>
                  <TableCell className="px-4 py-3 align-middle text-center">
                    {user.isActivated ? (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-500">Active</span>
                    ) : (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">Inactive</span>
                    )}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-right align-middle">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <span className="sr-only">Open menu</span>
                          <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="5" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="12" cy="19" r="1.5" fill="currentColor"/></svg>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Archive</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default UsersDashboard;
