import { NextRequest, NextResponse } from 'next/server';

const SUPPORTED_LOCALES = ['en', 'zh', 'es', 'de', 'fr', 'ar'];
const DEFAULT_LOCALE = 'en';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // 跳过API路由和静态文件
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // 检查是否已有语言前缀
  const hasLocale = SUPPORTED_LOCALES.some(locale => 
    pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  
  if (!hasLocale) {
    // 重写到默认语言版本
    return NextResponse.rewrite(new URL(`/${DEFAULT_LOCALE}${pathname}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  // 匹配所有路径，除了静态文件和API路由
  matcher: [
    // 匹配所有路径，但排除API路由、静态文件和Next.js内部文件
    '/((?!api|_next|_vercel|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)'
  ]
};