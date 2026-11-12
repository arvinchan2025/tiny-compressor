
import { NextRequest, NextResponse } from 'next/server';

import {
  defaultLocale,
  isValidLocale,
  Locale,
} from '@/lib/i18n';

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

  const prefix = `/${locale}`;

  return pathname.slice(prefix.length) || '/';
}

/**
 * 生成内部默认语言路由。
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
  locale: Locale
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
export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const pathLocale = getPathLocale(pathname);

  let response: NextResponse;
  let locale: Locale;

  // --------------------------------------------------
  // 1. 默认语言英文：移除 /en 前缀
  // --------------------------------------------------
  if (pathLocale === defaultLocale) {
    locale = defaultLocale;

    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = removeLocalePrefix(pathname);

    response = NextResponse.redirect(redirectUrl, 308);

    setLocaleCookie(response, locale);

    return response;
  }

  // --------------------------------------------------
  // 2. 其他语言：保留语言前缀
  // --------------------------------------------------
  if (pathLocale) {
    locale = pathLocale;

    response = NextResponse.next();

    setLocaleCookie(response, locale);

    return response;
  }

  // --------------------------------------------------
  // 3. 无语言前缀：内部 Rewrite 到英文路由
  // --------------------------------------------------
  locale = defaultLocale;

  // 仅根路径根据用户之前主动选择的语言跳转
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

      return response;
    }
  }

  const rewriteUrl = request.nextUrl.clone();
  rewriteUrl.pathname = getInternalPath(pathname);

  response = NextResponse.rewrite(rewriteUrl);

  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap|sw\\.js|manifest.json|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map|woff|woff2|ttf|otf|pdf|txt)$).*)',
  ],
};
