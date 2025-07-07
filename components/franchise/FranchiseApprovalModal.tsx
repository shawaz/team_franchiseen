import React, { useState } from 'react';

interface FranchiseApprovalModalProps {
  open: boolean;
  franchise: unknown;
  action: 'accept' | 'reject' | null;
  onClose: (result: 'accepted' | 'rejected' | 'cancel') => void;
}

const digitalAgreementText = `By signing this agreement, you acknowledge and accept the terms and conditions of the franchise. Please review the agreement carefully before signing.`;

export default function FranchiseApprovalModal({ open, franchise, action, onClose }: FranchiseApprovalModalProps) {
  const [loading, setLoading] = useState(false);

  if (!open || !franchise || !action) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white dark:bg-stone-800 rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">
          {action === 'accept' ? 'Sign Digital Agreement' : 'Reject Franchise'}
        </h2>
        {action === 'accept' ? (
          <>
            <p className="mb-4 whitespace-pre-line">{digitalAgreementText}</p>
            <button
              className="w-full py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
              disabled={loading}
              onClick={async () => {
                setLoading(true);
                await new Promise((r) => setTimeout(r, 800)); // Simulate signing
                setLoading(false);
                onClose('accepted');
              }}
            >
              {loading ? 'Signing...' : 'Sign & Accept'}
            </button>
          </>
        ) : (
          <>
            <p className="mb-4">Are you sure you want to reject this franchise? This will refund the initial investment to the user.</p>
            <button
              className="w-full py-2 px-4 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 mb-2"
              disabled={loading}
              onClick={async () => {
                setLoading(true);
                await new Promise((r) => setTimeout(r, 800)); // Simulate refund
                setLoading(false);
                onClose('rejected');
              }}
            >
              {loading ? 'Processing...' : 'Reject & Refund'}
            </button>
          </>
        )}
        <button
          className="w-full py-2 px-4 mt-2 bg-gray-200 dark:bg-stone-700 text-gray-700 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-stone-600"
          onClick={() => onClose('cancel')}
          disabled={loading}
        >
          Cancel
        </button>
      </div>
    </div>
  );
} 