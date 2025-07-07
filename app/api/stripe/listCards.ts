import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const cardholderId = searchParams.get('cardholderId');
  if (!cardholderId) {
    return NextResponse.json({ error: 'Missing cardholderId' }, { status: 400 });
  }
  try {
    const cards = await stripe.issuing.cards.list({
      cardholder: cardholderId,
      limit: 10,
    });
    return NextResponse.json(cards.data);
  } catch (err: unknown) {
    let errorMessage = 'Unknown error';
    if (err instanceof Error) {
      errorMessage = err.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
} 