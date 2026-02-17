
'use client';
import { useState } from 'react';

export default function StreamTestPage() {
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSend() {
    setOutput('');
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/test-stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: '你好，请做一个详细的自我介绍，介绍你的功能和特点。' }),
      });

      if (!response.ok) throw new Error(await response.text());

      // 原生流式读取器
      const reader = response.body?.getReader();
      if (!reader) throw new Error('Failed to get readable stream.');

      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        // 解析 SSE 格式 (data: {...})
        const lines = chunk.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6).trim();
            if (data === '[DONE]') break;
            try {
              const json = JSON.parse(data);
              const content = json.choices[0]?.delta?.content || '';
              setOutput((prev) => prev + content);
            } catch (e) {
              // 忽略空行或解析错误
            }
          }
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">DeepSeek 原生流式测试</h1>
        <p className="mb-4 text-gray-600">本页面完全放弃 Vercel AI SDK，使用原生 `fetch` 和 `ReadableStream` 来处理 SSE 事件流，旨在解决 SDK 可能存在的 404 错误。</p>
        <button
            onClick={handleSend}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
            {loading ? '思考中...' : '发送测试请求'}
        </button>
        <div className="mt-6 p-4 border-2 border-dashed border-gray-300 rounded min-h-[200px] whitespace-pre-wrap bg-gray-50 font-mono text-sm">
            {output || '等待输出...'}
        </div>
        {error && (
            <div className="mt-4 p-4 bg-red-100 text-red-700 border border-red-400 rounded">
                <strong>请求失败:</strong> {error}
            </div>
        )}
    </div>
  );
}
