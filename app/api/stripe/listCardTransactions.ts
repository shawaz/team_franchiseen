import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const cardId = searchParams.get('cardId');
  if (!cardId) {
    return NextResponse.json({ error: 'Missing cardId' }, { status: 400 });
  }
  try {
    const transactions = await stripe.issuing.transactions.list({
      card: cardId,
      limit: 20,
    });
    return NextResponse.json(transactions.data);
  } catch (err: unknown) {
    let errorMessage = 'Unknown error';
    if (err instanceof Error) {
      errorMessage = err.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
} 