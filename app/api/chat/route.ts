import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are a helpful AI assistant for Franchiseen, a comprehensive franchise management platform. You help franchise owners, investors, and operators with questions about:

1. **Platform Features:**
   - Franchise investment and funding
   - Revenue distribution and dividend claims
   - Team management and operations
   - Financial reporting and analytics
   - Solana Pay integration for payments
   - Multi-location management

2. **Franchise Operations:**
   - Setting up new franchise locations
   - Managing staff and scheduling
   - Inventory and supply chain management
   - Customer experience optimization
   - Performance tracking and KPIs

3. **Investment & Finance:**
   - How the tokenized investment system works
   - Understanding franchise shares and ownership
   - Revenue sharing (50% capital recovery, 50% dividends)
   - SOL-based payments and transactions
   - Financial planning and budgeting

4. **Technical Support:**
   - Platform navigation and features
   - Account setup and management
   - Integration with existing systems
   - Mobile app usage
   - Troubleshooting common issues

**Key Platform Information:**
- Franchiseen uses Solana blockchain for payments and tokenization
- Each franchise issues 1000 tokens representing 100% ownership
- Revenue is split: 50% for capital recovery, 50% for dividends
- Platform supports global operations across 50+ countries
- 99.9% uptime guarantee with 24/7 support

Always provide helpful, accurate, and actionable advice. If you're unsure about specific technical details, recommend contacting support or checking the documentation. Keep responses concise but comprehensive.`;

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages,
      ],
      max_tokens: 1000,
      temperature: 0.7,
      stream: false,
    });

    const response = completion.choices[0]?.message?.content;

    if (!response) {
      return NextResponse.json(
        { error: 'No response generated' },
        { status: 500 }
      );
    }

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    );
  }
}
