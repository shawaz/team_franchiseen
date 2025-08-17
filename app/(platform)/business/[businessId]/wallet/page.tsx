'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id, Doc } from '@/convex/_generated/dataModel';
import Table from '@/components/ui/table/Table';
import TableHead from '@/components/ui/table/TableHead';
import TableBody from '@/components/ui/table/TableBody';
import TableRow from '@/components/ui/table/TableRow';
import TableCell from '@/components/ui/table/TableCell';
import TableHeaderCell from '@/components/ui/table/TableHeaderCell';
import { ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import SolanaWalletWithLocalCurrency from '@/components/wallet/SolanaWalletWithLocalCurrency';

function formatDate(timestamp: number) {
  const date = new Date(timestamp);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
}

export default function TransactionsPage() {
  const params = useParams();
  const businessId = params?.businessId as Id<'businesses'>;
  const invoices = useQuery(api.franchise.listInvoicesByBusiness, businessId ? { businessId } : 'skip') as Doc<'invoice'>[] | undefined;
  const franchises = useQuery(api.franchise.list, {}) as Doc<'franchise'>[] | undefined;
  // Removed business query - not needed for BZC wallet

  // Remove virtual wallet balance - now using only SOL

  // Map franchiseId to franchise name/building
  const franchiseMap = React.useMemo(() => {
    if (!franchises) return {};
    return franchises.reduce((acc, f) => {
      acc[f._id] = f.building || 'Franchise';
      return acc;
    }, {} as Record<string, string>);
  }, [franchises]);

  // SOL wallet handlers
  const handleAddSOL = React.useCallback(() => {
    alert('Add SOL clicked! You can get devnet SOL from the airdrop button or Solana faucet.');
  }, []);

  return (<div>
    <div className=" w-full">
      <SolanaWalletWithLocalCurrency
        onAddMoney={handleAddSOL}
        className="w-full"
      />
    </div>
      <div className="overflow-x-auto rounded-lg">
        <Table className="min-w-full divide-y divide-gray-200 rounded-xl shadow-sm mt-8 p-0 overflow-hidden">
          <TableHead>
            <TableRow className="bg-muted/30">
              <TableHeaderCell>Date</TableHeaderCell>
              <TableHeaderCell>Description</TableHeaderCell>
              <TableHeaderCell>Franchise</TableHeaderCell>
              <TableHeaderCell>Amount</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {invoices === undefined ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6">Loading...</TableCell>
              </TableRow>
            ) : invoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6">No transactions found.</TableCell>
              </TableRow>
            ) : (
              invoices.map((invoice) => {
                // For now, treat all as income (ArrowDownCircle, green)
                const isIncome = true;
                return (
                  <TableRow key={invoice._id} className="hover:bg-muted/20 transition-colors group">
                    <TableCell className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground font-medium">{formatDate(invoice.createdAt)}</TableCell>
                    <TableCell className="px-4 py-3 whitespace-nowrap text-sm text-stone-900 font-medium flex items-center gap-2">
                      {isIncome ? (
                        <ArrowDownCircle size={18} color="#34C759" />
                      ) : (
                        <ArrowUpCircle size={18} color="#FF3B30" />
                      )}
                      Franchise Payment
                    </TableCell>
                    <TableCell className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground font-medium">{franchiseMap[invoice.franchiseId] || invoice.franchiseId}</TableCell>
                    <TableCell className={`px-4 py-3 whitespace-nowrap text-sm font-semibold ${isIncome ? 'text-[#34C759]' : 'text-[#FF3B30]'}`}>{isIncome ? '+' : '-'}₹{Math.abs(invoice.totalAmount).toLocaleString()}</TableCell>
                    <TableCell className={`px-4 py-3 whitespace-nowrap text-sm font-medium flex items-center gap-1 text-[#34C759]`}>Completed</TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
  </div>
    
  );
}