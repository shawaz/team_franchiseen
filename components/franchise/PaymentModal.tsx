import React, { useState } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';
import { useCurrency } from '@/contexts/CurrencyContext'
import { loadStripe } from '@stripe/stripe-js';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  franchiseData: {
    name: string;
    logo: string;
    address: string;
    totalShares: number;
    soldShares: number;
    costPerShare: number;
    franchiseId: string;
  };
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const PaymentModal = ({ isOpen, onClose, franchiseData }: PaymentModalProps) => {
  const [selectedShares, setSelectedShares] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const availableShares = franchiseData.totalShares - franchiseData.soldShares;
  const { user } = useUser();
  const { formatAmount } = useCurrency();
  
  // Calculate amounts
  const subTotal = selectedShares * franchiseData.costPerShare;
  const serviceFee = subTotal * 0.15; // 15% service fee
  const gst = subTotal * 0.05; // 5% GST
  const totalAmount = subTotal + serviceFee + gst;

  const handleStripePayment = async () => {
    if (!user || !user.emailAddresses || user.emailAddresses.length === 0) {
      toast.error('Please sign in with an email to purchase shares');
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: totalAmount,
          shares: selectedShares,
          franchiseId: franchiseData.franchiseId,
          userEmail: user.emailAddresses[0].emailAddress,
          costPerShare: franchiseData.costPerShare,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to create Stripe session');
      const stripe = await stripePromise;
      await stripe?.redirectToCheckout({ sessionId: data.sessionId });
    } catch (error) {
      console.error('Stripe error:', error);
      toast.error('Failed to initiate payment. Please try again.');
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative dark:bg-stone-800 bg-white rounded-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Buy Shares</h2>
            <button onClick={onClose} className="dark:text-white text-gray-500 hover:text-gray-700">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12 rounded-lg overflow-hidden">
              <Image
                src={franchiseData.logo}
                alt={franchiseData.name}
                fill
                className="object-contain"
              />
            </div>
            <div>
              <h3 className="font-medium">{franchiseData.name}</h3>
              <p className="text-sm dark:text-white text-gray-600">{franchiseData.address}</p>
            </div>
          </div>
        </div>

        {/* Share Selection */}
        <div className="p-6 border-b">
          <div className="mb-4">
            <p className="text-sm dark:text-white text-gray-600">Available Shares</p>
            <p className="text-lg font-semibold">{availableShares} shares</p>
            <p className="text-sm dark:text-white text-gray-600 mt-1">Cost per Share: {formatAmount(franchiseData.costPerShare)}</p>
          </div>

          <div className="space-y-4">
            <label className="block text-sm dark:text-white font-medium text-gray-700">
              Select number of shares
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="1"
                max={availableShares}
                value={selectedShares}
                onChange={(e) => setSelectedShares(Number(e.target.value))}
                className="flex-1 h-2 dark:bg-stone-700 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <span className="font-medium">{selectedShares}</span>
            </div>
          </div>
        </div>

        {/* Payment Details */}
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="dark:text-white text-gray-600">Selected Shares</span>
              <span>{selectedShares}</span>
            </div>
            <div className="flex justify-between">
              <span className="dark:text-white text-gray-600">Amount</span>
              <span>{formatAmount(subTotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="dark:text-white text-gray-600">Service Fee (15%)</span>
              <span>{formatAmount(serviceFee)}</span>
            </div>
            <div className="flex justify-between">
              <span className="dark:text-white text-gray-600">GST (5%)</span>
              <span>{formatAmount(gst)}</span>
            </div>
            <div className="h-px dark:bg-stone-700 bg-gray-200 my-2" />
            <div className="flex justify-between font-semibold">
              <span>Total Amount</span>
              <span>{formatAmount(totalAmount)}</span>
            </div>
          </div>

          <button 
            onClick={handleStripePayment}
            disabled={isLoading}
            className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Processing Payment...' : 'Proceed to Payment'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal; 