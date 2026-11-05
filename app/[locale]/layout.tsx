
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { Inter } from 'next/font/google';
import Script from 'next/script';

import '@/app/globals.css';

import { ClientProviders } from '@/components/providers/ClientProviders';
import PerformanceMonitor from '@/components/performance/PerformanceMonitor';
import { AuthProvider } from '@/components/auth/auth-provider';

import {
  supportedLocales,
  isValidLocale,
  Locale,
} from '@/lib/i18n';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-inter',
  weight: ['400', '500', '600', '700'],
  fallback: [
    'system-ui',
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Roboto',
    'sans-serif',
  ],
  adjustFontFallback: true,
});

const languageInfo = {
  en: {
    direction: 'ltr',
    openGraphLocale: 'en_US',
  },
  zh: {
    direction: 'ltr',
    openGraphLocale: 'zh_CN',
  },
  es: {
    direction: 'ltr',
    openGraphLocale: 'es_ES',
  },
  de: {
    direction: 'ltr',
    openGraphLocale: 'de_DE',
  },
  fr: {
    direction: 'ltr',
    openGraphLocale: 'fr_FR',
  },
  ar: {
    direction: 'rtl',
    openGraphLocale: 'ar_SA',
  },
  ja: {
    direction: 'ltr',
    openGraphLocale: 'ja_JP',
  },
  ko: {
    direction: 'ltr',
    openGraphLocale: 'ko_KR',
  },
  pt: {
    direction: 'ltr',
    openGraphLocale: 'pt_PT',
  },
  ru: {
    direction: 'ltr',
    openGraphLocale: 'ru_RU',
  },
  it: {
    direction: 'ltr',
    openGraphLocale: 'it_IT',
  },
} as const satisfies Record<
  Locale,
  {
    direction: 'ltr' | 'rtl';
    openGraphLocale: string;
  }
>;

interface LocaleLayoutProps {
  children: ReactNode;
  params: {
    locale: string;
  };
}

export function generateStaticParams() {
  return supportedLocales.map((locale) => ({ locale }));
}

// 不允许未声明的语言参数
export const dynamicParams = false;

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  if (!isValidLocale(locale)) {
    notFound();
  }

  const langInfo = languageInfo[locale];

  return {
    metadataBase: new URL('https://tinycompressor.com'),

    title: 'TinyCompressor - Free Online Image Compression Tool',

    description:
      'Compress images online for free! Support JPG, PNG, WebP formats. Fast, secure, and privacy-friendly.',

    keywords:
      'image compression, online compressor, JPG, PNG, WebP, free tool',

    authors: [{ name: 'TinyCompressor Team' }],
    creator: 'TinyCompressor',
    publisher: 'TinyCompressor',

    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },

    openGraph: {
      type: 'website',
      locale: langInfo.openGraphLocale,
      siteName: 'TinyCompressor',
      title: 'TinyCompressor - Free Online Image Compression Tool',
      description:
        'Compress images online for free! Support JPG, PNG, WebP formats.',
      images: [
        {
          url: '/og-image.jpg',
          width: 1200,
          height: 630,
          alt: 'TinyCompressor - Image Compression Tool',
        },
      ],
    },

    twitter: {
      card: 'summary_large_image',
      title: 'TinyCompressor - Free Online Image Compression Tool',
      description: 'Compress images online for free!',
      images: ['/og-image.jpg'],
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    // canonical 和 hreflang 交给具体页面定义
    // 避免子页面继承首页 URL
  };
}

export default function LocaleLayout({
  children,
  params: { locale },
}: LocaleLayoutProps) {
  if (!isValidLocale(locale)) {
    notFound();
  }

  const langInfo = languageInfo[locale];

  return (
    <html
      lang={locale}
      dir={langInfo.direction}
      suppressHydrationWarning
    >
      <head>
        <link
          rel="dns-prefetch"
          href="https://www.googletagmanager.com"
        />
        <link
          rel="preconnect"
          href="https://www.googletagmanager.com"
        />
        <link
          rel="dns-prefetch"
          href="https://cdn.jsdelivr.net"
        />
        <link
          rel="preconnect"
          href="https://cdn.jsdelivr.net"
          crossOrigin="anonymous"
        />
        <link
          rel="dns-prefetch"
          href="https://unpkg.com"
        />

        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link
          rel="icon"
          href="/favicon-16x16.svg"
          type="image/svg+xml"
          sizes="16x16"
        />
        <link
          rel="icon"
          href="/favicon-32x32.svg"
          type="image/svg+xml"
          sizes="32x32"
        />
        <link rel="apple-touch-icon" href="/apple-touch-icon.svg" />
        <link rel="manifest" href="/site.webmanifest" />

        {/* 保留你原来的主题防闪烁脚本 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const STORAGE_KEY = 'tinycompressor-theme';
                  const savedTheme = localStorage.getItem(STORAGE_KEY);
                  const systemDark = window.matchMedia(
                    '(prefers-color-scheme: dark)'
                  ).matches;

                  const theme =
                    savedTheme === 'dark' ||
                    (!savedTheme && systemDark)
                      ? 'dark'
                      : 'light';

                  document.documentElement.classList.add(theme);
                  document.documentElement.setAttribute(
                    'data-theme',
                    theme
                  );
                } catch (e) {
                  document.documentElement.classList.add('light');
                }
              })();
            `,
          }}
        />
      </head>

      <body className={inter.className} suppressHydrationWarning>
        <ClientProviders>
          <AuthProvider>
            {children}
          </AuthProvider>
          <PerformanceMonitor />
        </ClientProviders>

        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-R23Y0Z9XSP"
          strategy="afterInteractive"
        />

        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8179572160013109"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />

        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-R23Y0Z9XSP', {
              page_title: document.title,
              page_location: window.location.href,
              anonymize_ip: true,
              allow_google_signals: true,
              allow_ad_personalization_signals: false
            });
          `}
        </Script>
      </body>
    </html>
  );
}
