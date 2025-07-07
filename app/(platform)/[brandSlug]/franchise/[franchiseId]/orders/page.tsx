"use client"

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import FranchiseHeader from '@/components/franchise/FranchiseHeader';

const mockOrders = [
  {
    id: '#GK0001',
    customer: 'Moyna Gawkes',
    date: '4 Jan, 2023 3:14 AM',
    items: 3,
    payment: 'Failed',
    total: 838.0,
    status: 'Shipped',
  },
  {
    id: '#GK0002',
    customer: 'Aldous Rea',
    date: '14 Jun, 2023 1:37 PM',
    items: 4,
    payment: 'Refunded',
    total: 871.0,
    status: 'Cancelled',
  },
  {
    id: '#GK0003',
    customer: 'Cobby Long',
    date: '13 Sep, 2023 10:44 PM',
    items: 4,
    payment: 'Pending',
    total: 956.0,
    status: 'Shipped',
  },
  {
    id: '#GK0004',
    customer: 'Willdon Beven',
    date: '4 Sep, 2023 8:16 PM',
    items: 10,
    payment: 'Pending',
    total: 386.0,
    status: 'Return',
  },
  {
    id: '#GK0005',
    customer: 'Charley Avraham',
    date: '12 May, 2023 7:52 PM',
    items: 4,
    payment: 'Refunded',
    total: 658.0,
    status: 'Cancelled',
  },
  {
    id: '#GK0006',
    customer: 'Kaylee Tabord',
    date: '11 Oct, 2022 1:36 AM',
    items: 4,
    payment: 'Failed',
    total: 549.0,
    status: 'Cancelled',
  },
  {
    id: '#GK0007',
    customer: 'Querida Wallhead',
    date: '3 Nov, 2022 1:45 AM',
    items: 6,
    payment: 'Failed',
    total: 844.0,
    status: 'Return',
  },
  {
    id: '#GK0008',
    customer: 'Danell Caras',
    date: '29 Jan, 2023 4:29 AM',
    items: 6,
    payment: 'Paid',
    total: 578.0,
    status: 'Cancelled',
  },
  {
    id: '#GK0009',
    customer: 'Chrisy Weller',
    date: '17 Feb, 2023 9:42 PM',
    items: 10,
    payment: 'Pending',
    total: 169.0,
    status: 'Shipped',
  },
  {
    id: '#GK0010',
    customer: 'Cymbre Shildrick',
    date: '25 Feb, 2023 12:44 AM',
    items: 4,
    payment: 'Pending',
    total: 434.0,
    status: 'Cancelled',
  },
];

const paymentColors: Record<string, string> = {
  Failed: 'text-red-600 bg-red-100',
  Refunded: 'text-gray-600 bg-gray-100',
  Pending: 'text-yellow-700 bg-yellow-100',
  Paid: 'text-green-700 bg-green-100',
};

const statusColors: Record<string, string> = {
  Shipped: 'text-sky-700 bg-sky-100',
  Cancelled: 'text-red-600 bg-red-100',
  Return: 'text-gray-600 bg-gray-200',
};

function FranchiseOrders() {
  const [activeTab, setActiveTab] = useState('All Orders');
  const [search, setSearch] = useState('');

  const filteredOrders = mockOrders.filter(order => {
    const matchesTab =
      activeTab === 'All Orders' || order.status === activeTab;
    const matchesSearch =
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.customer.toLowerCase().includes(search.toLowerCase()) ||
      order.status.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div>
       <FranchiseHeader />
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-4">
          <Button
            variant={activeTab === 'All Orders' ? 'outline' : 'ghost'}
            className="font-semibold"
            onClick={() => setActiveTab('All Orders')}
          >
            All
          </Button>
          <Button
            variant={activeTab === 'Shipped' ? 'outline' : 'ghost'}
            onClick={() => setActiveTab('Shipped')}
          >
            Shipped
          </Button>
          <Button
            variant={activeTab === 'Cancelled' ? 'outline' : 'ghost'}
            onClick={() => setActiveTab('Cancelled')}
          >
            Cancelled
          </Button>
          <Button
            variant={activeTab === 'Return' ? 'outline' : 'ghost'}
            onClick={() => setActiveTab('Return')}
          >
            Return
          </Button>
        </div>
        <input
          type="text"
          placeholder="Filter Orders"
          className="border rounded-md px-3 py-2 w-64 focus:outline-none focus:ring"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      <div className="overflow-x-auto rounded-xl shadow border bg-white dark:bg-stone-800">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 dark:bg-stone-700">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Order</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Items</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Order Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-stone-800 divide-y divide-gray-100 dark:divide-stone-700">
            {filteredOrders.map(order => (
              <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-stone-700 transition">
                <td className="px-4 py-3 font-semibold">{order.id}</td>
                <td className="px-4 py-3">{order.customer}</td>
                <td className="px-4 py-3">{order.date}</td>
                <td className="px-4 py-3">{order.items} Items</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${paymentColors[order.payment] || ''}`}>{order.payment}</span>
                </td>
                <td className="px-4 py-3 font-semibold">${order.total.toFixed(2)}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status] || ''}`}>{order.status}</span>
                </td>
                <td className="px-4 py-3 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <span className="sr-only">Open menu</span>
                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="5" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="12" cy="19" r="1.5" fill="currentColor"/></svg>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View</DropdownMenuItem>
                      <DropdownMenuItem>Refund</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">Cancel</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default FranchiseOrders;