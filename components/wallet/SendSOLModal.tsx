"use client";

import React, { useState } from 'react';
import { X, Send } from 'lucide-react';
import { useSolana } from '@/hooks/useSolana';

interface SendSOLModalProps {
  onClose: () => void;
  onSuccess?: (signature: string) => void;
}

const SendSOLModal: React.FC<SendSOLModalProps> = ({ onClose, onSuccess }) => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const { sendSOL } = useSolana();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!recipient || !amount) {
      alert('Please fill in all fields');
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    setLoading(true);
    try {
      const result = await sendSOL(recipient, amountNum);
      
      if (result.success && result.signature) {
        alert(`SOL sent successfully! Transaction: ${result.signature.slice(0, 8)}...`);
        onSuccess?.(result.signature);
        onClose();
        setRecipient('');
        setAmount('');
      } else {
        alert(`Transfer failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Transfer error:', error);
      alert('Transfer failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-stone-900 rounded-2xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-stone-900 dark:text-white">Send SOL</h2>
          <button
            onClick={onClose}
            className="text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
              Recipient Address
            </label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="Enter Solana wallet address"
              className="w-full px-3 py-2 border border-stone-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-800 text-stone-900 dark:text-white placeholder-stone-500"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
              Amount (SOL)
            </label>
            <input
              type="number"
              step="0.0001"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.0000"
              className="w-full px-3 py-2 border border-stone-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-800 text-stone-900 dark:text-white placeholder-stone-500"
              disabled={loading}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-stone-300 dark:border-stone-600 text-stone-700 dark:text-stone-300 rounded-lg hover:bg-stone-50 dark:hover:bg-stone-800 transition"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition flex items-center justify-center gap-2"
              disabled={loading || !recipient || !amount}
            >
              {loading ? (
                'Sending...'
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send SOL
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SendSOLModal;
