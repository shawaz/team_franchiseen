import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Table from '@/components/ui/table/Table';
import TableHead from '@/components/ui/table/TableHead';
import TableBody from '@/components/ui/table/TableBody';
import TableRow from '@/components/ui/table/TableRow';
import TableCell from '@/components/ui/table/TableCell';
import TableHeaderCell from '@/components/ui/table/TableHeaderCell';

// Simple Badge component for status
const Badge = ({ children, color }: { children: React.ReactNode; color: 'green' | 'yellow' | 'red' }) => {
  const colorMap = {
    green: 'bg-green-100 text-green-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    red: 'bg-red-100 text-red-800',
  };
  return (
    <span className={`px-2 py-1 rounded text-xs font-semibold ${colorMap[color]}`}>{children}</span>
  );
};

const payouts = [
  { id: '#1060', method: 'Amex', status: 'Pending', amount: '₹1,200', date: 'June 9, 2020' },
  { id: '#1038', method: 'Mastercard', status: 'Paid', amount: '₹2,000', date: 'June 9, 2020' },
  { id: '#1016', method: 'PayPal', status: 'Paid', amount: '₹3,590', date: 'June 8, 2020' },
  { id: '#1008', method: 'Visa', status: 'Paid', amount: '₹4,500', date: 'June 9, 2020' },
  { id: '#1002', method: 'Mastercard', status: 'Paid', amount: '₹1,232', date: 'June 7, 2020' },
  { id: '#982', method: 'PayPal', status: 'Cancel', amount: '₹4,500', date: 'June 8, 2020' },
  { id: '#970', method: 'Visa', status: 'Paid', amount: '₹1,232', date: 'June 6, 2020' },
  { id: '#965', method: 'PayPal', status: 'Paid', amount: '₹4,235', date: 'June 8, 2020' },
  { id: '#953', method: 'Visa', status: 'Paid', amount: '₹1,231', date: 'June 6, 2020' },
  { id: '#943', method: 'Visa', status: 'Paid', amount: '₹5,435', date: 'June 5, 2020' },
];

function PayoutsPage() {
  return (
    <div >
      {/* <Card className='mb-8'>
        <CardContent className="flex flex-col items-center justify-center gap-4">
          <div className="w-24 h-16 bg-muted rounded mb-2" />
          <div className="text-center">
            <div className="text-muted-foreground text-sm mb-1">Your Earning this month</div>
            <div className="text-3xl font-bold mb-1">₹3,210</div>
            <div className="text-muted-foreground text-xs mb-4">Update your payout method in settings</div>
          </div>
        </CardContent>
      </Card> */}
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b">
          <div>
          <div className="text-muted-foreground text-sm mb-1">Your Earning this month</div>
          <div className="text-3xl font-bold mb-1">₹3,210</div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button>Withdraw Earning</Button>
            
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto p-0">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>ID</TableHeaderCell>
                <TableHeaderCell>Method</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Amount</TableHeaderCell>
                <TableHeaderCell>Date</TableHeaderCell>
                <TableHeaderCell></TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {payouts.map((payout) => (
                <TableRow key={payout.id}>
                  <TableCell className="font-mono text-xs">{payout.id}</TableCell>
                  <TableCell>{payout.method}</TableCell>
                  <TableCell>
                    {payout.status === 'Paid' && <Badge color="green">Paid</Badge>}
                    {payout.status === 'Pending' && <Badge color="yellow">Pending</Badge>}
                    {payout.status === 'Cancel' && <Badge color="red">Cancel</Badge>}
                  </TableCell>
                  <TableCell>{payout.amount}</TableCell>
                  <TableCell>{payout.date}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" aria-label="More options">
                      <span className="material-icons">more_vert</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export default PayoutsPage;