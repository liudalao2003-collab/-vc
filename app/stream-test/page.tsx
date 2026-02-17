
'use client';

import { useCompletion } from '@ai-sdk/react';
import { useState } from 'react';

export default function StreamTestPage() {
  const { completion, complete, isLoading } = useCompletion({
    api: '/api/test-stream',
  });

  const [inputValue, setInputValue] = useState('');

  const handleSend = () => {
    complete(inputValue);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">DeepSeek 流式测试</h1>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="输入你的问题..."
          className="border p-2 rounded w-full"
          disabled={isLoading}
        />
        <button
          onClick={handleSend}
          disabled={isLoading || !inputValue.trim()}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
        >
          {isLoading ? '发送中...' : '发送'}
        </button>
      </div>
      <div className="whitespace-pre-wrap border p-4 min-h-[100px] bg-gray-50">
        {completion}
      </div>
    </div>
  );
}

