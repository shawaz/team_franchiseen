import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil',
});

export async function POST(req: NextRequest) {
  const { amount, shares, franchiseId, userEmail, costPerShare } = await req.json();
  console.log('Received:', { amount, shares, franchiseId, userEmail, costPerShare });
  console.log('STRIPE_SECRET_KEY:', process.env.STRIPE_SECRET_KEY ? 'Exists' : 'Missing');

  try {
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: `Franchise Investment - ${shares} Shares`,
              description: `Investment in franchise ID: ${franchiseId}`,
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.nextUrl.origin}/payment-success?session_id={CHECKOUT_SESSION_ID}&franchiseId=${franchiseId}&shares=${shares}&costPerShare=${costPerShare}`,
      cancel_url: `${req.nextUrl.origin}/payment-cancelled`,
      metadata: {
        franchiseId,
        shares,
        costPerShare,
      },
    };
    if (userEmail && typeof userEmail === 'string' && userEmail.trim() !== '') {
      sessionParams.customer_email = userEmail;
    }
    const session = await stripe.checkout.sessions.create(sessionParams);

    return NextResponse.json({ sessionId: session.id });
  } catch (err: unknown) {
    console.error('Stripe error:', err);
    let message = 'Unknown error';
    if (
      err &&
      typeof err === 'object' &&
      'message' in err &&
      typeof (err as { message?: unknown }).message === 'string'
    ) {
      message = (err as { message: string }).message;
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
} 