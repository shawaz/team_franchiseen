import React from 'react';
import { ArrowDownCircle, ArrowUpCircle, Clock } from 'lucide-react';
import Table from '@/components/ui/table/Table';
import TableHead from '@/components/ui/table/TableHead';
import TableBody from '@/components/ui/table/TableBody';
import TableRow from '@/components/ui/table/TableRow';
import TableCell from '@/components/ui/table/TableCell';
import TableHeaderCell from '@/components/ui/table/TableHeaderCell';

const transactions = [
  {
    id: 1,
    date: '2024-06-01',
    description: 'Design assets purchase',
    category: 'Design',
    amount: -1200,
    status: 'Completed',
    type: 'expense',
  },
  {
    id: 2,
    date: '2024-06-03',
    description: 'SEO tools subscription',
    category: 'SEO',
    amount: -300,
    status: 'Completed',
    type: 'expense',
  },
  {
    id: 3,
    date: '2024-06-05',
    description: 'Development milestone payment',
    category: 'Development',
    amount: -5000,
    status: 'Pending',
    type: 'expense',
  },
  {
    id: 4,
    date: '2024-06-07',
    description: 'Budget adjustment',
    category: 'Extra',
    amount: 2000,
    status: 'Completed',
    type: 'income',
  },
];

const TransactionsCard: React.FC = () => {
  return (
        <Table className="min-w-full divide-y divide-gray-200 rounded-xl shadow-sm mt-8 p-0 overflow-hidden">
          <TableHead>
            <TableRow className="bg-muted/30">
              <TableHeaderCell>Date</TableHeaderCell>
              <TableHeaderCell>Description</TableHeaderCell>
              <TableHeaderCell>Category</TableHeaderCell>
              <TableHeaderCell>Amount</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((tx) => (
              <TableRow key={tx.id} className="hover:bg-muted/20 transition-colors group">
                <TableCell className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground font-medium">{tx.date}</TableCell>
                <TableCell className="px-4 py-3 whitespace-nowrap text-sm text-stone-900 font-medium flex items-center gap-2">
                  {tx.type === 'expense' ? (
                    <ArrowUpCircle size={18} color="#FF3B30" />
                  ) : (
                    <ArrowDownCircle size={18} color="#34C759" />
                  )}
                  {tx.description}
                </TableCell>
                <TableCell className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground font-medium">{tx.category}</TableCell>
                <TableCell className={`px-4 py-3 whitespace-nowrap text-sm font-semibold ${tx.amount < 0 ? 'text-[#FF3B30]' : 'text-[#34C759]'}`}>{tx.amount < 0 ? '-' : '+'}${Math.abs(tx.amount).toLocaleString()}</TableCell>
                <TableCell className={`px-4 py-3 whitespace-nowrap text-sm font-medium flex items-center gap-1 ${tx.status === 'Completed' ? 'text-[#34C759]' : 'text-[#FFA500]'}`}>{tx.status === 'Completed' ? null : <Clock size={16} color="#FFA500" />} {tx.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
  );
};

export default TransactionsCard; 