import Table from '@/components/ui/table/Table';
import TableHead from '@/components/ui/table/TableHead';
import TableRow from '@/components/ui/table/TableRow';
import TableCell from '@/components/ui/table/TableCell';
import React from 'react';
import Link from 'next/link';
import TableBody from '@/components/ui/table/TableBody';
import TableHeaderCell from '@/components/ui/table/TableHeaderCell';
import { ArrowDownCircle, ArrowUpCircle, Clock } from 'lucide-react';

const invoices = [
  { id: '#1008', date: '17 April 2020, 10:45pm', amount: 39, status: 'Due' },
  { id: '#1007', date: '17 April 2020, 10:45pm', amount: 39, status: 'Complete' },
  { id: '#1006', date: '17 Feb 2020, 10:45pm', amount: 39, status: 'Complete' },
  { id: '#1005', date: '17 Jan 2020, 10:45pm', amount: 39, status: 'Complete' },
  { id: '#1004', date: '17 Dec 2019, 10:45pm', amount: 39, status: 'Complete' },
  { id: '#1003', date: '17 Nov 2019, 10:45pm', amount: 39, status: 'Complete' },
  { id: '#1002', date: '17 Oct 2019, 10:45pm', amount: 39, status: 'Complete' },
  { id: '#1001', date: '17 Sept 2019, 10:45pm', amount: 39, status: 'Complete' },
];

function DownloadIcon() {
  return (
    <svg width="20" height="20" fill="none" viewBox="0 0 20 20" stroke="currentColor" className="text-purple-500 cursor-pointer hover:text-purple-700">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 10v4m0 0l3-3m-3 3l-3-3m6 3V4m0 0l3 3m-3-3l-3 3" />
    </svg>
  );
}

function InvoicesPage() {
  return (

      <div className="overflow-x-auto rounded-lg">
        <Table className="min-w-full divide-y divide-gray-200 rounded-xl shadow-sm p-0 overflow-hidden">
          <TableHead>
            <TableRow className="bg-muted/30">
              <TableHeaderCell>Date</TableHeaderCell>
              <TableHeaderCell>Description</TableHeaderCell>
              <TableHeaderCell>Amount</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Download</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {invoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6">No invoices found.</TableCell>
              </TableRow>
            ) : (
              invoices.map((invoice) => {
                const isDue = invoice.status === 'Due';
                return (
                  <TableRow key={invoice.id} className="hover:bg-muted/20 transition-colors group">
                    <TableCell className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground font-medium">{invoice.date}</TableCell>
                    <TableCell className="px-4 py-3 whitespace-nowrap text-sm text-stone-900 font-medium flex items-center gap-2">
                      {isDue ? (
                        <ArrowUpCircle size={18} color="#FF3B30" />
                      ) : (
                        <ArrowDownCircle size={18} color="#34C759" />
                      )}
                      <Link href={`./invoices/${invoice.id.replace('#', '')}`}>Invoice {invoice.id}</Link>
                    </TableCell>
                    <TableCell className={`px-4 py-3 whitespace-nowrap text-sm font-semibold ${isDue ? 'text-[#FF3B30]' : 'text-[#34C759]'}`}>{isDue ? '-' : '+'}${invoice.amount.toLocaleString()}</TableCell>
                    <TableCell className={`px-4 py-3 whitespace-nowrap text-sm font-medium flex items-center gap-1 ${isDue ? 'text-[#FFA500]' : 'text-[#34C759]'}`}>{isDue ? <Clock size={16} color="#FFA500" /> : null} {invoice.status}</TableCell>
                    <TableCell className="px-4 py-3">
                      <DownloadIcon />
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
  );
}

export default InvoicesPage;