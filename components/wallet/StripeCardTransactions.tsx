import React from 'react';

interface StripeCardTransactionsProps {
  cardId: string | null;
}

interface StripeTransaction {
  id: string;
  amount: number;
  currency: string;
  status: string;
  created: number;
  merchant_data?: {
    name?: string;
  };
}

const StripeCardTransactions: React.FC<StripeCardTransactionsProps> = ({ cardId }) => {
  const [transactions, setTransactions] = React.useState<StripeTransaction[]>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (!cardId) return;
    setLoading(true);
    fetch(`/api/stripe/listCardTransactions?cardId=${cardId}`)
      .then(res => res.json())
      .then(setTransactions)
      .finally(() => setLoading(false));
  }, [cardId]);

  if (!cardId) return <div className="my-4">Select a card to view transactions.</div>;
  if (loading) return <div className="my-4">Loading transactions...</div>;
  if (!transactions.length) return <div className="my-4">No transactions found for this card.</div>;

  return (
    <table className="min-w-full divide-y divide-gray-200 rounded-xl shadow-sm mt-4">
      <thead>
        <tr>
          <th>Date</th>
          <th>Merchant</th>
          <th>Amount</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map(tx => (
          <tr key={tx.id}>
            <td>{new Date(tx.created * 1000).toLocaleString()}</td>
            <td>{tx.merchant_data?.name || 'N/A'}</td>
            <td>{(tx.amount / 100).toFixed(2)} {tx.currency?.toUpperCase()}</td>
            <td>{tx.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default StripeCardTransactions; 