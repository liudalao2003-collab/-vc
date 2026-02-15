import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-slate-100 mb-2">欢迎回来</h1>
        <div className="p-4 bg-emerald-900/20 border border-emerald-500/30 rounded-lg max-w-md mx-auto">
          <p className="text-emerald-400 text-sm font-medium">
            推荐使用 QQ邮箱、163邮箱 或 Gmail 登录<br/>
            无需密码，接收验证码即可
          </p>
        </div>
      </div>
      <SignIn 
        appearance={{
          elements: {
            formButtonPrimary: 'bg-emerald-600 hover:bg-emerald-500 text-sm normal-case',
            footerActionLink: 'text-emerald-400 hover:text-emerald-300',
            card: 'bg-slate-900 border border-slate-800',
            headerTitle: 'text-slate-100',
            headerSubtitle: 'text-slate-400',
            socialButtonsBlockButton: 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700',
            formFieldLabel: 'text-slate-300',
            formFieldInput: 'bg-slate-950 border-slate-700 text-slate-200',
            dividerLine: 'bg-slate-700',
            dividerText: 'text-slate-500'
          }
        }}
      />
    </div>
  );
}
