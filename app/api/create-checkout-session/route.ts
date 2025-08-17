import { NextResponse } from 'next/server';

// This route is deprecated - the application now uses SOL-only payments
export async function POST() {
  return NextResponse.json({
    error: 'This payment method is no longer supported. Please use SOL payments.'
  }, { status: 410 });
}