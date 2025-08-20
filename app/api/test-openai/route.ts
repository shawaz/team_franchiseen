import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function GET() {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { 
          role: 'system', 
          content: 'You are a helpful assistant for Franchiseen. Respond with a brief greeting.' 
        },
        { 
          role: 'user', 
          content: 'Hello, test the connection' 
        },
      ],
      max_tokens: 100,
      temperature: 0.7,
    });

    const response = completion.choices[0]?.message?.content;

    return NextResponse.json({ 
      success: true, 
      response,
      model: completion.model,
      usage: completion.usage 
    });
  } catch (error: any) {
    console.error('OpenAI test error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to test OpenAI connection',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
