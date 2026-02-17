import { createOpenAI } from '@ai-sdk/openai'; 
import { streamText } from 'ai'; 

// 核心修复：强制使用 Node.js 运行时，并设置 60 秒超时
// 这种方式比 Edge 更稳定，兼容性最好
export const maxDuration = 60; 

const deepseek = createOpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY, 
    baseURL: 'https://api.deepseek.com',
}); 

export async function POST(req: Request) { 
    try { 
        const { prompt } = await req.json(); 
        const result = await streamText({ 
            model: deepseek('deepseek-chat'), 
            prompt: prompt || '你好', 
        }); 
        return result.toTextStreamResponse(); 
    } catch (error) { 
        console.error('API 错误：', error); 
        return new Response(JSON.stringify({ error: '服务器错误', details: error }), { status: 500 }); 
    }
}