
export const maxDuration = 60;
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    console.log("正在请求 DeepSeek 接口...");

    // 直接请求 DeepSeek 官方标准的 chat 接口
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: prompt || '你好' }],
        stream: true, // 必须开启流式
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("DeepSeek 原生报错:", errorText);
      return new Response(`DeepSeek Error: ${response.status} - ${errorText}`, { status: response.status });
    }

    // 直接把 DeepSeek 的流转发给前端
    return new Response(response.body, {
      headers: { 'Content-Type': 'text/event-stream' },
    });

  } catch (error: any) {
    console.error("服务器错误：", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
