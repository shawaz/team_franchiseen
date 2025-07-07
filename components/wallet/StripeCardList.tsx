import React from 'react';

interface StripeCardListProps {
  cardholderId: string | null | undefined;
  onSelectCard: (cardId: string) => void;
  selectedCardId: string | null;
}

interface StripeCard {
  id: string;
  brand: string;
  last4: string;
  status: string;
  type: string;
  exp_month: number;
  exp_year: number;
}

const StripeCardList: React.FC<StripeCardListProps> = ({ cardholderId, onSelectCard, selectedCardId }) => {
  const [cards, setCards] = React.useState<StripeCard[]>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (!cardholderId) return;
    setLoading(true);
    fetch(`/api/stripe/listCards?cardholderId=${cardholderId}`)
      .then(res => res.json())
      .then(setCards)
      .finally(() => setLoading(false));
  }, [cardholderId]);

  if (!cardholderId) return <div className="my-4">No cardholder ID found.</div>;
  if (loading) return <div className="my-4">Loading cards...</div>;
  if (!cards.length) return <div className="my-4">No cards found.</div>;

  return (
    <div className="flex flex-wrap gap-4 my-4">
      {cards.map(card => (
        <div
          key={card.id}
          className={`p-4 rounded-lg border cursor-pointer ${selectedCardId === card.id ? 'border-blue-500' : 'border-gray-300'}`}
          onClick={() => onSelectCard(card.id)}
        >
          <div className="font-bold">{card.brand} •••• {card.last4}</div>
          <div className="text-xs">Status: {card.status}</div>
          <div className="text-xs">Type: {card.type}</div>
          <div className="text-xs">Exp: {card.exp_month}/{card.exp_year}</div>
        </div>
      ))}
    </div>
  );
};

export default StripeCardList; 