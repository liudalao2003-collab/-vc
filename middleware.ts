import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// 定义需要保护的路由（比如只有接口生成才需要登录）
const isProtectedRoute = createRouteMatcher(['/api/generate(.*)']);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!.*\\..*|_next).*)", 
    "/", 
    "/(api|trpc)(.*)"
  ],
};
