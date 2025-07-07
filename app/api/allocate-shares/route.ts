import { NextRequest, NextResponse } from 'next/server';
import { api } from '@/convex/_generated/api';
import { ConvexHttpClient } from 'convex/browser';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(req: NextRequest) {
  try {
    const { franchiseId, userId, userName, userImage, numberOfShares, costPerShare } = await req.json();
    if (!franchiseId || !userId || !numberOfShares || !costPerShare) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    // Call the Convex mutation to allocate shares
    try {
      await convex.mutation(api.shares.purchaseFranchiseShares, {
        franchiseId,
        userId,
        userName,
        userImage,
        numberOfShares,
        costPerShare,
      });
      return NextResponse.json({ success: true });
    } catch {
      console.error('Convex share allocation error:');
      return NextResponse.json({ error: 'Unknown error' }, { status: 500 });
    }
  } catch {
    return NextResponse.json({ error: 'Failed to allocate shares' }, { status: 500 });
  }
} 