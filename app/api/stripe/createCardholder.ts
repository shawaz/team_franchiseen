import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(req: NextRequest) {
  const { userId, email, name, phone, address, govIdFrontUrl, govIdBackUrl } = await req.json();
  if (!userId || !email || !name || !address) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  try {
    // 1. Create Stripe cardholder
    const cardholder = await stripe.issuing.cardholders.create({
      name,
      email,
      phone_number: phone,
      type: "individual",
      billing: { address },
      individual: govIdFrontUrl && govIdBackUrl ? {
        verification: {
          document: {
            front: govIdFrontUrl,
            back: govIdBackUrl,
          },
        },
      } : undefined,
    });

    // 2. Save cardholder ID and activate user in Convex
    await convex.mutation(api.myFunctions.setStripeCardholderId, {
      userId,
      stripeCardholderId: cardholder.id,
    });
    await convex.mutation(api.myFunctions.activateUser, {
      userId,
    });

    return NextResponse.json({ cardholderId: cardholder.id });
  } catch (err: unknown) {
    let errorMessage = 'Unknown error';
    if (err instanceof Error) {
      errorMessage = err.message;
    }
    console.error('Stripe cardholder creation error:', err);
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
} 