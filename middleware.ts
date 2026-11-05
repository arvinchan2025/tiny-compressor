import {NextRequest, NextResponse} from 'next/server';

import {defaultLocale, isValidLocale, Locale,} from '@/lib/i18n';

import {refreshSupabaseSession} from '@/lib/supabase/middleware';

const LOCALE_COOKIE = 'NEXT_LOCALE';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

/**
 * 获取 URL 中明确指定的语言。
 *
 * /zh/video-compressor -> zh
 * /video-compressor -> null
 * /zh-cn/video-compressor -> null
 */
function getPathLocale(pathname: string): Locale | null {
  const firstSegment = pathname.split('/').filter(Boolean)[0];

  if (!firstSegment || !isValidLocale(firstSegment)) {
    return null;
  }

  return firstSegment;
}

/**
 * 移除 URL 中的语言前缀。
 *
 * /en/video-compressor -> /video-compressor
 * /zh/video-compressor -> /video-compressor
 * /en -> /
 */
function removeLocalePrefix(pathname: string): string {
  const locale = getPathLocale(pathname);

  if (!locale) {
    return pathname || '/';
  }

  return pathname.replace(
    new RegExp(`^/${locale}(?=/|$)`),
    ''
  ) || '/';
}

/**
 * 生成内部英文路由。
 *
 * / -> /en
 * /video-compressor -> /en/video-compressor
 */
function getInternalPath(pathname: string): string {
  return `/${defaultLocale}${pathname === '/' ? '' : pathname}`;
}

/**
 * 设置语言 Cookie。
 */
function setLocaleCookie(
  response: NextResponse,
  locale: Locale,
  request: NextRequest
) {
  response.cookies.set(LOCALE_COOKIE, locale, {
    maxAge: COOKIE_MAX_AGE,
    path: '/',
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });
}

/**
 * Middleware
 */
export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const pathLocale = getPathLocale(pathname);

  let response: NextResponse;
  let locale: Locale;

  // --------------------------------------------------
  // 1. URL 明确指定英文：308 重定向到无前缀 URL
  // --------------------------------------------------
  if (pathLocale === defaultLocale) {
    locale = defaultLocale;

    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = removeLocalePrefix(pathname);

    response = NextResponse.redirect(redirectUrl, 308);

    // 如果你希望访问 /en 后也明确记录英语偏好，可以保留。
    setLocaleCookie(response, locale, request);
  }

    // --------------------------------------------------
    // 2. URL 明确指定其他语言：保留 URL
  // --------------------------------------------------
  else if (pathLocale) {
    locale = pathLocale;

    response = NextResponse.next();

    // URL 明确指定的语言优先，更新用户语言偏好。
    setLocaleCookie(response, locale, request);
  }

    // --------------------------------------------------
    // 3. 无语言前缀：内部 Rewrite 到英文路由
  // --------------------------------------------------
  else {
    locale = defaultLocale;

    // 仅根路径根据用户之前主动选择的语言跳转。
    // 普通无前缀页面始终作为英文页面处理。
    if (pathname === '/') {
      const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;

      if (
        cookieLocale &&
        isValidLocale(cookieLocale) &&
        cookieLocale !== defaultLocale
      ) {
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = `/${cookieLocale}`;

        response = NextResponse.redirect(redirectUrl, 307);
        response = await refreshSupabaseSession(request, response);

        return response;
      }
    }

    const rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname = getInternalPath(pathname);

    response = NextResponse.rewrite(rewriteUrl);
  }

  // --------------------------------------------------
  // 4. Supabase Session 刷新
  // --------------------------------------------------
  // response = await refreshSupabaseSession(request, response);

  return response;
}

export const config = {
  matcher: [
    /*
     * 排除：
     * - API
     * - Next.js 内部静态资源
     * - favicon / robots / sitemap
     * - PWA 资源
     * - 常见静态文件
     */
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap|sw.js|manifest.json|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map|woff|woff2|ttf|otf|pdf|txt)$).*)',
  ],
};
