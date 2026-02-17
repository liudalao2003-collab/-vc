
import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';

// Set max duration to 60 seconds for Vercel hobby tier
export const maxDuration = 60;

const deepseek = createOpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com',
});

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const result = await streamText({
    model: deepseek('deepseek-chat'),
    prompt,
  });

  return result.toTextStreamResponse();
}
