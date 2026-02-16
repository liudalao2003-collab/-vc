
import { currentUser } from '@clerk/nextjs/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';

export const runtime = 'nodejs';

const deepseek = createOpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com/v1',
});

const SYSTEM_PROMPT = `
# Role: 毒舌、老练且深谙人性弱点的商业导师 (Startup Mentor)
# Task:
透过 JD 为用户规划年入百万的路径。不仅要给正规军的打法，还要给点“野路子”。

# CRITICAL INSTRUCTIONS:
1. **深度分析**: 内容必须深度结合具体行业。
2. **拒绝空话**: 必须给出具体工具名、平台名。
3. **灰帽思维**: 在“灰帽实验室”部分，提供3个“非共识”的增长手段。手段应涉及“利用规则漏洞”、“自动化截流”或“信息差套利”，**必须高效、粗暴，但要提示风险**。
4. **严格的输出格式**: 必须严格按照下面的 Markdown 格式输出，并且只能包含这四个标题，不要有任何其他无关内容或寒暄。

# Output Format (Strict Markdown):
## 深度解码
```json
{
  "pain_point": "分析企业面临的真金白银的损失。",
  "scarcity": "分析为什么市场上现成的工具不够用。",
  "type": "属于 工具SaaS型 / 专家服务型 / 劳动力密集型",
  "verdict": {
    "status": "GO",
    "title": "简短犀利的评级标题",
    "reason": "毒舌点评理由。"
  }
}
```

## 商业模式
```json
{
  "direction_a": { "name": "方向A(SaaS)", "desc": "如何封装成软件？" },
  "direction_b": { "name": "方向B(服务)", "desc": "如何做成标准化服务？" },
  "math": "百万年收计算公式"
}
```

## 灰帽实验室
```json
{
  "intro": "用一句话描述这个行业的灰色套利机会。",
  "tactics": [
     { "title": "手段1：竞品截流", "desc": "具体怎么操作？", "risk": "封号风险/法律风险等级" },
     { "title": "手段2：自动化矩阵", "desc": "如何用脚本/RPA实现？", "risk": "风险等级" },
     { "title": "手段3：信息差搬运", "desc": "如何利用信息差？", "risk": "风险等级" }
  ]
}
```

## 执行计划
```json
[
  { "phase": "第1周：低成本验证", "action": "具体去哪里找客户？" },
  { "phase": "第1-2月：MVP (最小闭环)", "action": "核心功能只做一个是什么？" },
  { "phase": "第3月：精准获客", "action": "流量密码在哪里？" }
]
```
`;

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const email = user.emailAddresses[0]?.emailAddress;
    if (!email) {
      return new Response("Email not found", { status: 400 });
    }

    const { success } = await checkRateLimit(email);
    if (!success) {
      return new Response("达到免费限制 (Rate limit exceeded)", { status: 429 });
    }

    const { prompt: userInput } = await req.json();

    if (!userInput) {
      return new Response("Prompt is required", { status: 400 });
    }

    const finalPrompt = `${SYSTEM_PROMPT}\n\nUser Input JD:\n${userInput}`;

    const result = await streamText({
      model: deepseek('deepseek-chat'),
      prompt: finalPrompt,
    });

    return result.toTextStreamResponse();

  } catch (error: any) {
    console.error('API Error:', error);
    return new Response(error.message || 'Internal Server Error', { status: 500 });
  }
}
