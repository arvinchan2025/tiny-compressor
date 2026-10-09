import {NextRequest, NextResponse} from 'next/server'
import {createClient} from '@/lib/supabase/server'
import {
  getSupportedLocales,
  defaultLocale,
  getLocaleFromPath,
  isMissingLocale,
  isValidLocale,
  getLocalizedPath
} from '@/lib/i18n'
import {refreshSupabaseSession} from "@/lib/supabase/middleware";
import Any = jasmine.Any;

// Get locale from request
function getLocale(request: NextRequest): string {
  const pathname = request.nextUrl.pathname
  const supportedLocales = getSupportedLocales()

  // 1. Get language from URL path (highest priority)
  if (!isMissingLocale(pathname)) {
    const locale = getLocaleFromPath(pathname)
    return isValidLocale(locale) ? locale : defaultLocale
  }

  // 2. Get language preference from cookie (user manually selected language)
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value
  if (cookieLocale && isValidLocale(cookieLocale)) {
    return cookieLocale
  }

  // 3. Default to English (no browser language detection)
  return defaultLocale
}


export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Skip static resources and API routes
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname.includes('.') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/robots.txt') ||
    pathname.startsWith('/sitemap') ||
    pathname.startsWith('/sw.js') ||
    pathname.startsWith('/manifest.json')
  ) {
    return NextResponse.next()
  }

  const locale = getLocale(request)

  // If URL is missing language prefix, redirect to URL with language prefix
  let response = NextResponse.next()
  if (isMissingLocale(pathname) && locale !== defaultLocale) {
    // For other languages, redirect to URL with language prefix
    const newPath = getLocalizedPath(pathname, locale)
    const newUrl = new URL(newPath, request.url)
    response = NextResponse.redirect(newUrl)
  }else{
    response.headers.set('x-locale', locale)
  }
  response = await refreshSupabaseSession(request, response)
  response.cookies.set('NEXT_LOCALE', locale, {
    maxAge: 60 * 60 * 24 * 365, // 1 year
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  })
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - robots.txt (robots file)
     * - sitemap.xml (sitemap file)
     * - sw.js (service worker)
     * - manifest.json (PWA manifest)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap|sw.js|manifest.json).*)',
  ],
}