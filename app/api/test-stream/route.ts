
import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const runtime = 'edge';

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
