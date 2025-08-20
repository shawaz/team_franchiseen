import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    if (!process.env.VAPI_PRIVATE_KEY) {
      return NextResponse.json(
        { error: 'Vapi private key not configured' },
        { status: 500 }
      );
    }

    if (!process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY) {
      return NextResponse.json(
        { error: 'Vapi public key not configured' },
        { status: 500 }
      );
    }

    // Test the Vapi API by creating a simple assistant
    const assistantConfig = {
      name: 'Test Assistant',
      model: {
        provider: 'openai',
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a test assistant. Respond briefly to confirm the connection is working.'
          }
        ],
        temperature: 0.7,
        maxTokens: 100,
      },
      voice: {
        provider: 'playht',
        voiceId: 'jennifer',
      },
      firstMessage: "Hello! This is a test of the Vapi connection.",
    };

    const response = await fetch('https://api.vapi.ai/assistant', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.VAPI_PRIVATE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(assistantConfig),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Vapi API error:', response.status, errorText);
      return NextResponse.json(
        { 
          error: 'Failed to test Vapi connection',
          status: response.status,
          details: errorText 
        },
        { status: response.status }
      );
    }

    const assistant = await response.json();

    // Clean up - delete the test assistant
    if (assistant.id) {
      await fetch(`https://api.vapi.ai/assistant/${assistant.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${process.env.VAPI_PRIVATE_KEY}`,
        },
      }).catch(console.error); // Don't fail if cleanup fails
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Vapi connection successful',
      assistantId: assistant.id,
      publicKey: process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY?.substring(0, 8) + '...',
    });
  } catch (error: any) {
    console.error('Vapi test error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to test Vapi connection',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
