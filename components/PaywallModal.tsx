import React from 'react';
import Image from 'next/image';
import { X, Lock, Copy } from 'lucide-react';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PaywallModal: React.FC<PaywallModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText('qaz531380')
      .then(() => alert('微信号 qaz531380 已复制，请去微信添加！'))
      .catch(() => alert('复制失败，请手动输入 qaz531380'));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Decorative background element */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 text-center">
          <div className="mx-auto w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-6 border border-slate-700">
            <Lock className="w-8 h-8 text-emerald-400" />
          </div>
          
          <h2 className="text-2xl font-bold text-slate-100 mb-2">
            🎁 免费额度已用完
          </h2>
          
          <p className="text-slate-400 mb-6 leading-relaxed text-sm">
            为了保证服务质量，每位用户初始拥有 5 次免费体验机会。<br/>
            如果您觉得好用，可以免费申请更多额度！
          </p>

          <div className="flex flex-col items-center mb-6">
            <div className="bg-white p-2 rounded-lg shadow-md mb-2">
              <Image 
                src="/qrcode.png" 
                alt="WeChat QR Code" 
                width={200} 
                height={200} 
                className="rounded-lg"
              />
            </div>
            <p className="text-xs text-slate-500">微信号：qaz531380</p>
          </div>
          
          <div className="space-y-3">
            <button 
              onClick={handleCopy}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-900/20 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <Copy className="w-4 h-4" />
              复制微信号，备注“加油”
            </button>
            
            <button 
              onClick={onClose}
              className="w-full py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl transition-colors"
            >
              残酷离开
            </button>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default PaywallModal;
