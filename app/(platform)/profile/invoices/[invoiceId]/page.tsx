'use client';

import React from 'react';
import { useParams } from 'next/navigation';

export default function InvoiceDetailsPage() {
  // For now, use static data. In a real app, fetch invoice details using invoiceId from params.
  const params = useParams();
  const invoiceId = params?.invoiceId || '1001';

  return (

      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center gap-4">
            <div className="bg-indigo-100 rounded-full p-3">
              {/* Placeholder avatar icon */}
              <svg width="48" height="48" fill="none" viewBox="0 0 48 48" stroke="currentColor">
                <circle cx="24" cy="24" r="22" stroke="#6366F1" strokeWidth="4" fill="#EEF2FF" />
                <ellipse cx="24" cy="20" rx="8" ry="8" fill="#6366F1" />
                <ellipse cx="24" cy="36" rx="14" ry="8" fill="#6366F1" />
              </svg>
            </div>
            <div>
              <div className="text-xl font-bold">Geeks Courses</div>
              <div className="text-gray-500 text-sm">INVOICE ID: <span className="font-medium">#{invoiceId}</span></div>
            </div>
          </div>
          <button className="flex items-center gap-2 text-gray-400 hover:text-gray-700 text-sm">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
            </svg>
            Print
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <div className="text-gray-500 text-sm mb-1">Invoice From</div>
            <div className="font-semibold">Darlene Wilson</div>
            <div className="text-gray-500 text-sm leading-tight">
              4333 Edwards Rd<br />
              undefined Erie, Oklahoma<br />
              14355 United States
            </div>
            <div className="mt-4 text-gray-500 text-xs">INVOICED ID</div>
            <div className="font-semibold text-sm">#{invoiceId}</div>
          </div>
          <div>
            <div className="text-gray-500 text-sm mb-1">Invoice To</div>
            <div className="font-semibold">Jorge Fisher</div>
            <div className="text-gray-500 text-sm leading-tight">
              775 Rolling Green Rd<br />
              undefined Orange, Oklahoma<br />
              45785 United States
            </div>
            <div className="mt-4 text-gray-500 text-xs">Due Date</div>
            <div className="font-semibold text-sm">20 April 2020</div>
          </div>
        </div>
        <div className="overflow-x-auto rounded-lg mb-8">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr className="text-left text-gray-700 font-semibold text-base border-b">
                <th className="py-3 px-4">Item</th>
                <th className="py-3 px-4">Quantity</th>
                <th className="py-3 px-4">Unit Price</th>
                <th className="py-3 px-4">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-3 px-4">
                  Monthly <span className="text-gray-400 text-xs">(1 Jan,2020 to 1 Feb, 2020)</span>
                </td>
                <td className="py-3 px-4">1</td>
                <td className="py-3 px-4">$39.00</td>
                <td className="py-3 px-4">$39.00</td>
              </tr>
              <tr>
                <td className="py-3 px-4" colSpan={2}></td>
                <td className="py-3 px-4 text-gray-500">Total</td>
                <td className="py-3 px-4">$39.00</td>
              </tr>
              <tr>
                <td className="py-3 px-4" colSpan={2}></td>
                <td className="py-3 px-4 text-gray-500">Net Amount</td>
                <td className="py-3 px-4">$37.00</td>
              </tr>
              <tr>
                <td className="py-3 px-4" colSpan={2}></td>
                <td className="py-3 px-4 text-gray-500">Tax*</td>
                <td className="py-3 px-4">$2.00</td>
              </tr>
              <tr className="border-t-2">
                <td className="py-3 px-4" colSpan={2}></td>
                <td className="py-3 px-4 font-bold">Grand Total</td>
                <td className="py-3 px-4 font-bold text-lg">$478.50</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="text-gray-400 text-xs mt-8">
          Notes: Invoice was created on a computer and is valid without the signature and seal.
        </div>
      </div>

  );
} 