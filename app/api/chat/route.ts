import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    // System message to define Franny's personality and role
    const systemMessage = {
      role: 'system',
      content: `You are Franny, the friendly AI assistant for Franchiseen - a franchise management platform. You help users with:

1. Franchise management questions
2. Business operations and strategy
3. Investment tracking and financial insights
4. Team management and collaboration
5. Platform features and navigation
6. General business advice for franchise owners

Keep your responses helpful, professional, and concise. Always be encouraging and supportive. If you don't know something specific about the platform, acknowledge it and suggest they contact support or check the documentation.

Your personality is:
- Friendly and approachable
- Professional but not overly formal
- Knowledgeable about franchise business
- Helpful and solution-oriented
- Encouraging and positive`
    };

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [systemMessage, ...messages],
      max_tokens: 500,
      temperature: 0.7,
    });

    const response = completion.choices[0]?.message?.content;

    if (!response) {
      return NextResponse.json(
        { error: 'No response generated' },
        { status: 500 }
      );
    }

    return NextResponse.json({ response });

  } catch (error: any) {
    console.error('OpenAI API error:', error);
    
    if (error.code === 'insufficient_quota') {
      return NextResponse.json(
        { error: 'OpenAI API quota exceeded. Please check your billing.' },
        { status: 429 }
      );
    }
    
    if (error.code === 'invalid_api_key') {
      return NextResponse.json(
        { error: 'Invalid OpenAI API key. Please check your configuration.' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to generate response. Please try again.' },
      { status: 500 }
    );
  }
}
