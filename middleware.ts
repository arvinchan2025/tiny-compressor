import { NextRequest, NextResponse } from 'next/server';

// 支持的语言列表
const locales = ['en', 'zh', 'es', 'de', 'fr'];
const defaultLocale = 'en';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // 检查路径是否已经包含语言前缀
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // 如果路径没有语言前缀，重写为英文路径（不重定向）
  if (!pathnameHasLocale) {
    const newUrl = new URL(`/en${pathname}`, request.url);
    return NextResponse.rewrite(newUrl);
  }

  // 如果路径有语言前缀，继续处理
  return NextResponse.next();
}

export const config = {
  matcher: [
    // 匹配所有路径，除了：
    // - api 路由
    // - _next/static (静态文件)
    // - _next/image (图片优化)
    // - 所有静态文件 (favicon, apple-touch-icon, robots.txt, sitemap.xml, logo.svg等)
    '/((?!api|_next/static|_next/image|favicon|apple-touch-icon|robots.txt|sitemap|google-site-verification|logo\\.svg).*)',
  ],
};
