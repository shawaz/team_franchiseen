import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { action, ...data } = await request.json();

    if (!process.env.VAPI_PRIVATE_KEY) {
      return NextResponse.json(
        { error: 'Vapi API key not configured' },
        { status: 500 }
      );
    }

    const vapiBaseUrl = 'https://api.vapi.ai';
    
    switch (action) {
      case 'create-assistant':
        return await createAssistant();
      case 'create-call':
        return await createCall(data);
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Vapi API error:', error);
    return NextResponse.json(
      { error: 'Failed to process Vapi request' },
      { status: 500 }
    );
  }
}

async function createAssistant() {
  const assistantConfig = {
    name: 'Franchiseen Support Assistant',
    model: {
      provider: 'openai',
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a helpful voice assistant for Franchiseen, a franchise management platform.

Key information about Franchiseen:
- Comprehensive franchise management platform
- Uses Solana blockchain for payments and tokenization
- Supports franchise investment, operations, and revenue sharing
- Serves 10,000+ franchises across 50+ countries
- 99.9% uptime with 24/7 support

You help users with:
1. Platform navigation and features
2. Franchise investment and funding questions
3. Operations management
4. Technical support
5. Account and billing inquiries

Keep responses conversational, helpful, and concise since this is voice interaction. If you need to provide detailed information, break it into digestible chunks and ask if they want more details.

Always be friendly and professional. If you can't answer something, offer to connect them with human support.`
        }
      ],
      temperature: 0.7,
      maxTokens: 500,
    },
    voice: {
      provider: 'playht',
      voiceId: 'jennifer',
      speed: 1.0,
      stability: 0.8,
      similarityBoost: 0.8,
    },
    firstMessage: "Hi! I'm your Franchiseen support assistant. How can I help you today?",
    endCallMessage: "Thanks for using Franchiseen support. Have a great day!",
    recordingEnabled: false,
    hipaaEnabled: false,
    silenceTimeoutSeconds: 30,
    maxDurationSeconds: 600, // 10 minutes max
    backgroundSound: 'office',
    backchannelingEnabled: true,
    backgroundDenoisingEnabled: true,
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
    throw new Error(`Vapi API error: ${response.status} ${response.statusText}`);
  }

  const assistant = await response.json();
  return NextResponse.json(assistant);
}

async function createCall(data: any) {
  const callConfig = {
    type: 'webCall',
    assistantId: data.assistantId,
    assistantOverrides: data.assistantOverrides || {},
  };

  const response = await fetch('https://api.vapi.ai/call', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.VAPI_PRIVATE_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(callConfig),
  });

  if (!response.ok) {
    throw new Error(`Vapi API error: ${response.statusText}`);
  }

  const call = await response.json();
  return NextResponse.json(call);
}
