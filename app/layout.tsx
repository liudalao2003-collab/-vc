import type { Metadata } from "next";
import { Inter } from "next/font/google";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs';
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Startup Mentor",
  description: "AI Powered Startup Mentor",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="zh-CN">
        <body className={inter.className}>
          <header className="flex justify-end p-4 bg-slate-900 border-b border-slate-800">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="px-4 py-2 text-sm font-bold text-slate-200 bg-emerald-600 rounded-lg hover:bg-emerald-500 transition-colors">
                  登录 / 注册
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </header>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
