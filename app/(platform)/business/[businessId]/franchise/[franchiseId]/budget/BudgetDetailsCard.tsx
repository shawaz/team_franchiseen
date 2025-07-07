import React from 'react';
import Table from '@/components/ui/table/Table';
import TableHead from '@/components/ui/table/TableHead';
import TableBody from '@/components/ui/table/TableBody';
import TableRow from '@/components/ui/table/TableRow';
import TableCell from '@/components/ui/table/TableCell';
import TableHeaderCell from '@/components/ui/table/TableHeaderCell';

// Define the type for trend
interface BudgetRow {
  type: string;
  color: string;
  total: number;
  expenses: number;
  percent: number;
  trend: 'up' | 'down';
  remaining: number;
}

const budgetData: BudgetRow[] = [
  { type: 'Concept', color: '#000', total: 12000, expenses: 6500, percent: 52, trend: 'up', remaining: 5500 },
  { type: 'Design', color: '#FFA500', total: 18000, expenses: 8000, percent: 45, trend: 'down', remaining: 10000 },
  { type: 'Development', color: '#FF3B30', total: 64000, expenses: 38000, percent: 54, trend: 'down', remaining: 26000 },
  { type: 'SEO', color: '#007AFF', total: 8000, expenses: 3000, percent: 65, trend: 'down', remaining: 5000 },
  { type: 'Extra', color: '#00A3FF', total: 2000, expenses: 1500, percent: 85, trend: 'up', remaining: 500 },
  { type: 'Marketing', color: '#34C759', total: 34500, expenses: 24500, percent: 88, trend: 'up', remaining: 10000 },
];

const arrow = (trend: 'up' | 'down') => (
  <span style={{ color: trend === 'up' ? '#FF3B30' : '#34C759', marginLeft: 4 }}>
    {trend === 'up' ? '↑' : '↓'}
  </span>
);

const BudgetDetailsCard: React.FC = () => {
  return (
    <div>
      <Table className="min-w-full divide-y  divide-gray-200 rounded-xl shadow-sm -0 overflow-hidden">
        <TableHead>
          <TableRow className="bg-muted/30">
            <TableHeaderCell>Type</TableHeaderCell>
            <TableHeaderCell>Total Budget</TableHeaderCell>
            <TableHeaderCell>Expenses (USD)</TableHeaderCell>
            <TableHeaderCell>Expenses(%)</TableHeaderCell>
            <TableHeaderCell>Remaining(USD)</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {budgetData.map((row) => (
            <TableRow key={row.type} className="hover:bg-muted/20 transition-colors group">
              <TableCell className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground font-medium">
                <span className={`inline-block w-2 h-2 rounded-full  ${row.color}`} />
                <span className="text-stone-900 font-bold">{row.type}</span>
              </TableCell>
              <TableCell className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground font-medium">${row.total.toLocaleString()}</TableCell>
              <TableCell className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground font-medium">${row.expenses.toLocaleString()}</TableCell>
              <TableCell className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground font-medium">
                {row.percent}% {arrow(row.trend)}
              </TableCell>
              <TableCell className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground font-medium">${row.remaining.toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default BudgetDetailsCard; 