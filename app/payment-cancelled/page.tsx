import React from 'react';
import Link from 'next/link';

export default function PaymentCancelled() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Payment Cancelled</h1>
      <p className="mb-2">Your payment was not completed. You can try again or contact support if you need help.</p>
      <Link href="/">Go back home</Link>
    </div>
  );
} 