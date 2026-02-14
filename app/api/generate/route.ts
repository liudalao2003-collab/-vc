import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { checkRateLimit } from '@/lib/rate-limit';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com',
});

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const email = user.emailAddresses[0]?.emailAddress;
    if (!email) {
      return new NextResponse("Email not found", { status: 400 });
    }

    const { success } = await checkRateLimit(email);
    if (!success) {
      return new NextResponse("达到免费限制 (Rate limit exceeded)", { status: 429 });
    }

    const body = await req.json();
    const { prompt } = body;

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const completion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'deepseek-chat',
    });

    const text = completion.choices[0].message.content;
    return NextResponse.json({ text });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
