"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Briefcase, DollarSign, Zap, AlertTriangle, CheckCircle, XCircle, ChevronRight, Terminal, BarChart3, Rocket, Eye, Sparkles, MessageSquare, Send, User, Bot, BookOpen, Mic, Flame, Mail, Layout, PenTool, ArrowRight, Copy, Ghost, Download, FileText, Skull, RefreshCw } from 'lucide-react';
import PaywallModal from './PaywallModal';
import { useCompletion } from '@ai-sdk/react';

// 轻量级 Markdown 渲染组件
const SimpleMarkdown = ({ text }: { text: string }) => {
  if (!text) return null;
  return (
    <div className="whitespace-pre-wrap leading-relaxed font-mono text-sm text-slate-300">
      {text.split(/(\*\*.*?\*\*)/g).map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={index} className="text-emerald-400 font-bold">{part.slice(2, -2)}</strong>;
        }
        return part;
      })}
    </div>
  );
};

const StartupMentor = () => {
  const [showPaywall, setShowPaywall] = useState(false);
  const [jdText, setJdText] = useState('');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  
  // Chat State
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Feature States
  const [pitchLoading, setPitchLoading] = useState<Record<string, boolean>>({}); 
  const [pitches, setPitches] = useState<Record<string, string>>({}); 
  
  // Roast States
  const [roastLoading, setRoastLoading] = useState(false); 
  const [roastItemLoading, setRoastItemLoading] = useState<Record<number, boolean>>({}); 
  const [roastResult, setRoastResult] = useState<any>(null);

  // Phase Tools States
  const [phaseLoading, setPhaseLoading] = useState<Record<number, boolean>>({});
  const [phaseResults, setPhaseResults] = useState<Record<number, string>>({}); 
  
  // Grey Hat States
  const [greyHatLoading, setGreyHatLoading] = useState(false); 
  const [greyHatItemLoading, setGreyHatItemLoading] = useState<Record<number, boolean>>({}); 

  // New Loading States for V5.5
  const [modelRegenLoading, setModelRegenLoading] = useState<Record<string, boolean>>({}); // { direction_a: bool, direction_b: bool }
  const [planRegenLoading, setPlanRegenLoading] = useState(false);

  const { completion, complete, isLoading } = useCompletion({
    api: '/api/generate',
    onFinish: (_, fullCompletion) => {
      parseAndSetResult(fullCompletion);
    },
    onError: (err) => {
      console.error(err);
      if (err.message.includes('429')) {
        setShowPaywall(true);
        setError("Rate limit exceeded");
      } else {
        setError("导师正在整理复杂的商业逻辑，请重试以获取更清晰的报告。");
      }
    },
  });

  const parseAndSetResult = (text: string) => {
    try {
      const sections: any = {};
      const headers = ["深度解码", "商业模式", "灰帽实验室", "执行计划"];
      
      const parts = text.split('## ');

      parts.forEach(part => {
        if (part.trim() === '') return;

        for (const header of headers) {
          if (part.startsWith(header)) {
                        const content = part.substring(header.length).trim().replace(/```json|```/g, '');
            try {
              sections[header] = JSON.parse(content);
            } catch (e) {
              console.error(`Failed to parse JSON for section: ${header}`, e);
              sections[header] = {}; // Assign empty object on parse failure
            }
            break; 
          }
        }
      });

      const finalResult = {
        deep_dive: sections["深度解码"] || {},
        business_model: sections["商业模式"] || {},
        grey_area: sections["灰帽实验室"] || {},
        execution_plan: sections["执行计划"] || [],
      };
      
      // verdict is nested inside deep_dive
      if (sections["深度解码"] && sections["深度解码"].verdict) {
        finalResult.deep_dive.verdict = sections["深度解码"].verdict;
      } else if (finalResult.deep_dive) {
        finalResult.deep_dive.verdict = {};
      }


      setResult(finalResult);
    } catch (e) {
      console.error("Failed to parse completion:", e);
      setError("AI 返回格式解析失败，请稍后重试。");
      setResult({}); // Clear result on major parsing failure
    }
  };

  const handleAnalyze = async () => {
    if (!jdText.trim()) return;
    
    setError('');
    setResult(null);
    setChatHistory([]);
    setPitches({});
    setRoastResult(null);
    setPhaseResults({});
    setRoastItemLoading({});
    setGreyHatItemLoading({});
    setModelRegenLoading({});
    setPlanRegenLoading(false);

    complete(jdText);
  };
  
  const handleChatSubmit = async () => { /* Not implemented */ };
  const regenerateModel = async (dirKey: string) => { /* Not implemented */ };
  const regenerateExecutionPlan = async () => { /* Not implemented */ };
  const generatePhaseTool = async (phaseIndex: number) => { /* Not implemented */ };
  const generatePitch = async (key: string, data: any) => { /* Not implemented */ };
  const generateVcRoast = async () => { /* Not implemented */ };
  const regenerateRoastItem = async (index: number) => { /* Not implemented */ };
  const generateGreyHat = async () => { /* Not implemented */ };
  const regenerateGreyHatItem = async (index: number) => { /* Not implemented */ };
  const handleSaveReport = () => { /* Not implemented */ };

  const SAMPLE_JD = `
岗位：资深 AI 应用工程师 (Remote)
薪资：40k-60k/月 + 期权
职责：
1. 负责公司内部 AI 知识库工具的开发，帮助销售团队快速检索产品资料。
2. 对接 OpenAI/Claude API，优化 Prompt Engineering，提升回答准确率。
3. 解决非结构化数据（PDF/Word）的清洗和向量化存储问题。
要求：
- 熟悉 LangChain, Vector DB (Pinecone/Milvus)。
- 有 RAG (检索增强生成) 实际落地经验。
- 能独立完成从后端 Python 到前端 React 的全栈开发。
  `;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-emerald-500/30 flex flex-col">
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
              <BarChart3 className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-100 tracking-tight">VC 孵化器透视镜 <span className="text-xs bg-emerald-600 text-white px-2 py-0.5 rounded ml-2 shadow-lg shadow-emerald-500/20">V6 Stream</span></h1>
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Streaming & UI Protection
              </p>
            </div>
          </div>
          {result && !isLoading && (
            <button 
              onClick={handleSaveReport}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg transition-colors border border-slate-700"
            >
              <Download className="w-4 h-4" />
              导出全案 HTML
            </button>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 pb-32 flex-grow w-full">
        <PaywallModal isOpen={showPaywall} onClose={() => setShowPaywall(false)} />
        
        {!result && !isLoading && (
          <div className="mb-10 text-center py-16 animate-in fade-in zoom-in-95 duration-700">
            <h2 className="text-5xl font-extrabold text-slate-100 mb-6 tracking-tight leading-tight">
              不仅懂白道，更懂 <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-400 to-slate-200">灰色地带的流量法则</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed mb-10">
              终极形态的 AI 创业导师：包含正规打法 + <span className="text-slate-200 font-medium border-b border-zinc-500/30"> 灰帽手段 </span> + <span className="text-slate-200 font-medium border-b border-zinc-500/30"> 实战工具生成 </span>。
              <br/>支持一键导出精美网页报告，随时复盘。
            </p>
            <button 
              onClick={() => setJdText(SAMPLE_JD)}
              className="text-sm px-6 py-3 rounded-full bg-slate-900 border border-slate-700 hover:border-emerald-500/50 text-slate-400 hover:text-emerald-400 transition-all flex items-center gap-2 mx-auto group"
            >
              <Sparkles className="w-4 h-4 group-hover:text-yellow-400 transition-colors" />
              加载【资深 AI 工程师】案例，体验最终版
            </button>
          </div>
        )}

        <div className="relative group z-10 mb-6">
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative bg-slate-900 rounded-xl border border-slate-800 p-1 shadow-2xl">
            <textarea
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              placeholder="在此处粘贴岗位信息 (JD)..."
              className="w-full h-40 bg-slate-950/50 text-slate-300 placeholder:text-slate-600 p-5 rounded-lg outline-none resize-none focus:bg-slate-950 transition-colors font-mono text-sm"
              disabled={isLoading}
            />
            <div className="flex justify-end items-center px-4 py-3 border-t border-slate-800 bg-slate-900 rounded-b-lg">
              <button
                onClick={handleAnalyze}
                disabled={isLoading || !jdText.trim()}
                className={`flex items-center gap-2 px-8 py-2.5 rounded-lg font-bold text-sm transition-all duration-300 ${
                  isLoading || !jdText.trim()
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/30 hover:shadow-emerald-500/40 transform hover:-translate-y-0.5'
                }`}>
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                    分析中...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 fill-current" />
                    深度解码 & 挖掘灰产
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
        
        {(isLoading || result) && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {isLoading && !result && (
                <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-emerald-500/10 rounded-lg">
                            <Sparkles className="w-5 h-5 text-emerald-400" />
                        </div>
                        <h4 className="font-bold text-slate-200">正在生成...</h4>
                    </div>
                    <SimpleMarkdown text={completion} />
                </div>
            )}

            {result && (
              <>
                {result.deep_dive && (
                  <div className="grid md:grid-cols-3 gap-6">
                     <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl hover:border-cyan-500/30 transition-all">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 bg-cyan-500/10 rounded-lg"><Eye className="w-5 h-5 text-cyan-400" /></div>
                          <h4 className="font-bold text-slate-200">痛点 (Pain)</h4>
                        </div>
                        <SimpleMarkdown text={result.deep_dive.pain_point || ""} />
                     </div>
                     <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl hover:border-amber-500/30 transition-all">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 bg-amber-500/10 rounded-lg"><Briefcase className="w-5 h-5 text-amber-400" /></div>
                          <h4 className="font-bold text-slate-200">供需 (Scarcity)</h4>
                        </div>
                        <SimpleMarkdown text={result.deep_dive.scarcity || ""} />
                     </div>
                     {result.deep_dive.verdict && (
                       <div className={`bg-slate-900/80 border p-6 rounded-2xl transition-all ${
                         result.deep_dive.verdict.status === 'GO' ? 'border-emerald-500/30' : 'border-red-500/30'
                       }`}>
                          <div className="flex items-center gap-3 mb-4">
                            {result.deep_dive.verdict.status === 'GO' ? <CheckCircle className="w-8 h-8 text-emerald-400" /> : <XCircle className="w-8 h-8 text-red-400" />}
                            <h4 className={`font-bold text-lg ${result.deep_dive.verdict.status === 'GO' ? 'text-emerald-400' : 'text-red-400'}`}>{result.deep_dive.verdict.title || ""}</h4>
                          </div>
                          <p className="text-slate-400 text-sm leading-relaxed">{result.deep_dive.verdict.reason || ""}</p>
                       </div>
                     )}
                  </div>
                )}

                {result.grey_area && result.grey_area.tactics &&(
                  <div className="mt-8">
                     <div className="bg-zinc-900/50 border border-zinc-700/50 rounded-2xl p-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                          <Skull className="w-40 h-40 text-zinc-200" />
                        </div>
                        <div className="relative z-10">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <Ghost className="w-6 h-6 text-zinc-400" />
                              <h3 className="text-2xl font-bold text-zinc-200">灰帽增长实验室 (Grey Hat Lab)</h3>
                              <span className="px-2 py-0.5 bg-zinc-800 text-zinc-400 text-[10px] uppercase tracking-widest font-bold rounded">Unconventional</span>
                            </div>
                            <button 
                              onClick={generateGreyHat}
                              disabled={greyHatLoading}
                              className="text-xs flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors border border-zinc-700"
                            >
                               {greyHatLoading ? <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div> : <RefreshCw className="w-3 h-3" />}
                               全部重写
                            </button>
                          </div>
                          <p className="text-zinc-500 text-sm mb-6 max-w-2xl">{result.grey_area.intro || ""} <span className="text-zinc-600 italic">(风险提示：以下手段仅供参考，请在法律允许范围内操作)</span></p>
                          
                          <div className="grid md:grid-cols-3 gap-4">
                            {result.grey_area.tactics.map((tactic: any, idx: number) => (
                              <div key={idx} className="bg-zinc-950/80 border border-zinc-800 p-5 rounded-xl hover:border-zinc-600 transition-colors animate-in fade-in slide-in-from-bottom-2 relative group/card">
                                <button
                                  onClick={() => regenerateGreyHatItem(idx)}
                                  disabled={greyHatItemLoading[idx]}
                                  className="absolute top-3 right-3 p-1.5 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 rounded-md transition-opacity opacity-0 group-hover/card:opacity-100 disabled:opacity-100"
                                  title="换一换这个手段"
                                >
                                  {greyHatItemLoading[idx] ? <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div> : <RefreshCw className="w-3 h-3" />}
                                </button>
                                <h4 className="text-zinc-300 font-bold mb-2 pr-8">
                                  {tactic.title || ""}
                                </h4>
                                <p className="text-zinc-500 text-sm mb-4 leading-relaxed">{tactic.desc || ""}</p>
                                <div className="text-xs bg-red-950/30 text-red-400/80 px-2 py-1 rounded inline-block border border-red-900/30">
                                  风险: {tactic.risk || ""}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                     </div>
                  </div>
                )}

                {result.business_model && result.deep_dive && result.deep_dive.verdict && result.deep_dive.verdict.status === 'GO' && (
                  <>
                    <div>
                      <div className="flex items-center gap-4 mb-8">
                         <h3 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
                          <DollarSign className="w-7 h-7 text-emerald-500" />
                          商业模式与路演
                        </h3>
                        <div className="h-px bg-slate-800 flex-1"></div>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-8">
                        {['direction_a', 'direction_b'].map((dirKey) => (
                          <div key={dirKey} className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 relative overflow-hidden group hover:shadow-2xl hover:shadow-cyan-900/10 transition-all duration-500">
                            <button
                              onClick={() => regenerateModel(dirKey)}
                              disabled={modelRegenLoading[dirKey]}
                              className="absolute top-4 right-4 p-2 bg-slate-800/50 hover:bg-slate-700 text-slate-400 hover:text-emerald-400 rounded-lg transition-colors z-10 border border-slate-700/50"
                              title="换个商业思路"
                            >
                               {modelRegenLoading[dirKey] ? <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div> : <RefreshCw className="w-3 h-3" />}
                            </button>

                            <div className="flex justify-between items-start mb-4">
                              <span className={`px-3 py-1 text-xs font-bold rounded-full border ${
                                dirKey === 'direction_a' 
                                  ? 'bg-cyan-950/30 border-cyan-500/30 text-cyan-400' 
                                  : 'bg-purple-950/30 border-purple-500/30 text-purple-400'
                              }`}>
                                {dirKey === 'direction_a' ? 'SaaS / Product' : 'Service / Agency'}
                              </span>
                            </div>
                            <h4 className="text-xl font-bold text-slate-100 mb-3 pr-8">{result.business_model[dirKey]?.name || ""}</h4>
                            <div className="mb-6 h-20 overflow-y-auto custom-scrollbar">
                               <SimpleMarkdown text={result.business_model[dirKey]?.desc || ""} />
                            </div>
                            
                            <button 
                              onClick={() => generatePitch(dirKey, result.business_model[dirKey])}
                              disabled={pitchLoading[dirKey]}
                              className="w-full py-2.5 border border-slate-700 hover:border-emerald-500 hover:text-emerald-400 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all bg-slate-900/50"
                            >
                              {pitchLoading[dirKey] ? (
                                 <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                              ) : (
                                 pitches[dirKey] ? <RefreshCw className="w-3 h-3" /> : <Mic className="w-3 h-3" />
                              )}
                              {pitches[dirKey] ? '不满意？重写电梯演讲' : '生成 30秒 电梯演讲'}
                            </button>

                            {pitches[dirKey] && (
                              <div className="mt-4 p-4 bg-emerald-950/20 border border-emerald-500/20 rounded-xl animate-in fade-in slide-in-from-top-2">
                                 <div className="flex items-center gap-2 mb-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                                    <Mic className="w-3 h-3" /> Pitch Script
                                 </div>
                                 <div className="border-l-2 border-emerald-500/30 pl-3">
                                   <SimpleMarkdown text={pitches[dirKey]} />
                                 </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {result.execution_plan && (
                      <div>
                         <div className="flex items-center justify-between mb-8 mt-12">
                           <div className="flex items-center gap-4 flex-grow">
                             <h3 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
                              <Rocket className="w-7 h-7 text-cyan-500" />
                              执行与实战工具箱
                            </h3>
                            <div className="h-px bg-slate-800 flex-1"></div>
                           </div>
                           <button 
                              onClick={regenerateExecutionPlan}
                              disabled={planRegenLoading}
                              className="ml-4 text-xs flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded-lg transition-colors border border-slate-700"
                            >
                               {planRegenLoading ? <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div> : <RefreshCw className="w-3 h-3" />}
                               重写全套方案
                            </button>
                        </div>

                        <div className="space-y-8">
                          {result.execution_plan.map((step: any, idx: number) => (
                            <div key={idx} className="flex gap-6 group">
                               <div className="flex flex-col items-center relative">
                                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 z-10 bg-slate-950 ${
                                    idx === 0 ? 'border-slate-600 text-slate-300' :
                                    idx === 1 ? 'border-cyan-600 text-cyan-400' :
                                    'border-emerald-600 text-emerald-400'
                                  }`}>
                                    {idx}
                                  </div>
                                  {idx !== result.execution_plan.length - 1 && (
                                    <div className="w-0.5 h-full bg-slate-800 absolute top-10 bottom-[-32px]"></div>
                                  )}
                               </div>

                               <div className="flex-grow bg-slate-900/40 border border-slate-800 rounded-2xl p-6 hover:bg-slate-900/80 transition-all">
                                  <div className="flex justify-between items-start mb-3">
                                    <h4 className={`text-lg font-bold ${
                                      idx === 0 ? 'text-slate-300' : idx === 1 ? 'text-cyan-400' : 'text-emerald-400'
                                    }`}>{step.phase || ""}</h4>
                                    <button 
                                      onClick={() => generatePhaseTool(idx)}
                                      disabled={phaseLoading[idx]}
                                      className="text-xs bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-400 px-3 py-1.5 rounded-lg transition-all flex items-center gap-2 border border-slate-700 hover:border-emerald-500"
                                    >
                                      {phaseLoading[idx] ? (
                                         <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                      ) : (
                                         phaseResults[idx] ? <RefreshCw className="w-3 h-3" /> : <PenTool className="w-3 h-3" />
                                      )}
                                      {phaseResults[idx] ? '不满意？换一换' : (idx === 0 ? '生成冷启动话术' : idx === 1 ? '生成落地页文案' : '生成引流标题')}
                                    </button>
                                  </div>
                                  <SimpleMarkdown text={step.action || ""} />
                                  {phaseResults[idx] && (
                                    <div className="mt-4 p-4 bg-slate-950 border border-slate-700/50 rounded-xl relative animate-in fade-in slide-in-from-top-2">
                                      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-emerald-500 to-cyan-500 rounded-l-xl"></div>
                                      <SimpleMarkdown text={phaseResults[idx]} />
                                    </div>
                                  )}
                               </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-16">
                       <div className="bg-gradient-to-r from-red-950/20 to-slate-900 border border-red-900/30 rounded-2xl p-1 relative overflow-hidden">
                          <div className="bg-slate-950/80 rounded-xl p-8 relative z-10 backdrop-blur-sm">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                               <div>
                                  <h3 className="text-2xl font-bold text-red-400 flex items-center gap-2">
                                    <Flame className="w-6 h-6 fill-current" />
                                    压力测试 (The VC Roast)
                                  </h3>
                               </div>
                               <button 
                                  onClick={generateVcRoast}
                                  disabled={roastLoading}
                                  className="px-5 py-2.5 bg-red-900/20 hover:bg-red-900/40 border border-red-700/50 hover:border-red-500 text-red-200 rounded-lg font-bold text-sm transition-all flex items-center gap-2"
                                >
                                  {roastLoading ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div> : (roastResult ? <RefreshCw className="w-4 h-4" /> : <Zap className="w-4 h-4 fill-current" />)}
                                  {roastResult ? '全员大换血 (Regenerate All)' : '开始拷问'}
                                </button>
                            </div>
                            {roastResult && roastResult.questions && (
                              <div className="grid gap-4 animate-in fade-in slide-in-from-bottom-4">
                                {roastResult.questions.map((item: any, i: number) => (
                                  <div key={i} className="bg-slate-900 border border-red-900/30 rounded-lg p-4 relative group/card">
                                     <button
                                        onClick={() => regenerateRoastItem(i)}
                                        disabled={roastItemLoading[i]}
                                        className="absolute top-3 right-3 p-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-400 rounded-md transition-opacity opacity-0 group-hover/card:opacity-100 disabled:opacity-100"
                                        title="换一换这个问题"
                                      >
                                        {roastItemLoading[i] ? <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div> : <RefreshCw className="w-3 h-3" />}
                                      </button>
                                     <div className="flex items-start gap-3 mb-2 pr-8">
                                        <span className="bg-red-950 text-red-400 text-xs font-bold px-2 py-1 rounded border border-red-900/50 flex-shrink-0">Q{i+1}</span>
                                        <h4 className="text-red-200 font-medium text-sm">{item.q || ""}</h4>
                                     </div>
                                     <div className="flex items-start gap-3 pl-2 border-l-2 border-emerald-500/30 ml-2 pt-2">
                                        <span className="text-emerald-500 font-bold text-xs pt-0.5">A:</span>
                                        <p className="text-slate-400 text-sm">{item.a || ""}</p>
                                     </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                       </div>
                    </div>
                  </>
                )}

                <div className="mt-16 border-t border-slate-800 pt-10">
                  <div className="bg-slate-900 rounded-2xl border border-slate-800 flex flex-col h-[500px] shadow-2xl">
                    <div className="p-4 border-b border-slate-800 flex items-center gap-3 bg-slate-950/50 rounded-t-2xl">
                       <div className="bg-indigo-500/20 p-2 rounded-lg"><MessageSquare className="w-5 h-5 text-indigo-400" /></div>
                       <div>
                         <h3 className="font-bold text-slate-200">导师问答室 (Mentor Chat)</h3>
                         <p className="text-xs text-slate-500">所有对话均会被【保存全案】功能记录。</p>
                       </div>
                    </div>
                    <div className="flex-grow overflow-y-auto p-6 space-y-6 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-slate-900/50 [&::-webkit-scrollbar-thumb]:bg-emerald-500/30 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-emerald-500/50">
                      {chatHistory.length === 0 && (
                        <div className="text-center text-slate-600 my-20">
                          <p className="text-sm">您可以问：</p>
                          <div className="flex flex-wrap justify-center gap-2 mt-4">
                            <button onClick={() => setChatInput("这个灰色手段具体怎么操作才不会被封号？")} className="px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-xs text-slate-400 transition-colors">询问灰产操作细节</button>
                            <button onClick={() => setChatInput("Landing Page 的 H1 不够吸引人，换一种风格")} className="px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-xs text-slate-400 transition-colors">优化 H1 标题</button>
                          </div>
                        </div>
                      )}
                      {chatHistory.map((msg: any, idx: number) => (
                        <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-slate-700' : 'bg-emerald-600'}`}>
                            {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                          </div>
                          <div className={`p-4 rounded-2xl max-w-[85%] text-sm leading-relaxed ${msg.role === 'user' ? 'bg-slate-800 text-slate-200 rounded-tr-none' : 'bg-emerald-950/30 border border-emerald-500/20 text-slate-200 rounded-tl-none'}`}>
                             <SimpleMarkdown text={msg.content} />
                          </div>
                        </div>
                      ))}
                      {chatLoading && <div className="flex gap-4"><div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center shrink-0"><Bot className="w-4 h-4" /></div><div className="bg-emerald-950/30 border border-emerald-500/20 p-4 rounded-2xl rounded-tl-none"><div className="flex gap-1"><span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></span><span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-100"></span><span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-200"></span></div></div></div>}
                      <div ref={chatEndRef}></div>
                    </div>
                    <div className="p-4 bg-slate-950 rounded-b-2xl border-t border-slate-800">
                      <div className="relative">
                        <input
                          type="text"
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleChatSubmit()}
                          placeholder="继续向导师提问..."
                          disabled={chatLoading}
                          className="w-full bg-slate-900 text-slate-200 border border-slate-700 rounded-xl pl-4 pr-12 py-3 focus:outline-none focus:border-emerald-500 transition-colors placeholder:text-slate-600"
                        />
                        <button onClick={handleChatSubmit} disabled={!chatInput.trim() || chatLoading} className="absolute right-2 top-2 p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors disabled:opacity-50">
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default StartupMentor;
