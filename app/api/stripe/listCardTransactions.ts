import { NextResponse } from 'next/server';

// This route is deprecated - the application now uses SOL-only payments
export async function GET() {
  return NextResponse.json({
    error: 'Stripe card services are no longer supported. Please use SOL wallet.'
  }, { status: 410 });
}