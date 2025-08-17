import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const {
      transactionSignature,
      amount,
      amountINR,
      shares,
      franchiseId,
      userEmail,
      costPerShare,
      userWallet,
      companyWallet,
      currency = 'USDC', // Default to USDC
    } = await req.json();

    console.log('Recording crypto payment:', {
      transactionSignature,
      amount,
      amountINR,
      shares,
      franchiseId,
      userEmail,
      costPerShare,
      userWallet,
      companyWallet,
      currency,
    });

    // TODO: Implement your database logic here
    // For now, we'll just log the transaction
    // You can integrate with Convex or your preferred database

    // Example of what you might want to store:
    // - Transaction signature
    // - User email/ID
    // - Franchise ID
    // - Number of shares purchased
    // - Amount in USDC/SOL and INR
    // - Currency type (USDC, SOL, etc.)
    // - Timestamp
    // - User wallet address
    // - Company wallet address
    // - Payment status

    // Verify the transaction on Solana blockchain (optional but recommended)
    // You can use @solana/web3.js to verify the transaction exists and is confirmed

    return NextResponse.json({ 
      success: true, 
      message: 'Payment recorded successfully',
      transactionSignature 
    });
  } catch (error) {
    console.error('Error recording SOL payment:', error);
    return NextResponse.json(
      { error: 'Failed to record payment' }, 
      { status: 500 }
    );
  }
}
