import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { ClientProviders } from '@/components/providers/ClientProviders';
import PerformanceMonitor from '@/components/performance/PerformanceMonitor';
// import { ToastProvider } from '@/components/ui/Toast'; // 移除Toast，改用进度条

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap', // 字体加载时使用系统字体，避免阻塞渲染
  preload: true,
  variable: '--font-inter',
  weight: ['400', '500', '600', '700'], // 仅加载需要的字重
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
  adjustFontFallback: true, // 优化字体回退
});

export const metadata: Metadata = {
  title: 'TinyCompressor - Free Online Image Compression Tool',
  description: 'Compress images online for free! Reduce file sizes by 60-90% while maintaining quality. Support JPG, PNG, WebP formats. No registration required.',
  keywords: 'image compression, compress images, reduce file size, online tool, free, JPG compression, PNG compression, WebP compression',
  authors: [{ name: 'TinyCompressor Team' }],
  creator: 'TinyCompressor',
  publisher: 'TinyCompressor',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://tinycompressor.com'),
  alternates: {
    canonical: 'https://tinycompressor.com',
    languages: {
      'en': 'https://tinycompressor.com',
      'zh': 'https://tinycompressor.com/zh',
      'es': 'https://tinycompressor.com/es',
      'de': 'https://tinycompressor.com/de',
      'fr': 'https://tinycompressor.com/fr',
      'ar': 'https://tinycompressor.com/ar',
      'ja': 'https://tinycompressor.com/ja',
      'ko': 'https://tinycompressor.com/ko',
      'pt': 'https://tinycompressor.com/pt',
      'ru': 'https://tinycompressor.com/ru',
      'it': 'https://tinycompressor.com/it'
    }
  },
  openGraph: {
    title: 'TinyCompressor - Free Online Image Compression Tool',
    description: 'Compress images online for free! Reduce file sizes by 60-90% while maintaining quality. Support JPG, PNG, WebP formats.',
    url: 'https://tinycompressor.com',
    siteName: 'TinyCompressor',
    images: [
      {
        url: 'https://tinycompressor.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'TinyCompressor - Free Online Image Compression Tool',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TinyCompressor - Free Online Image Compression Tool',
    description: 'Compress images online for free! Reduce file sizes by 60-90% while maintaining quality.',
    images: ['https://tinycompressor.com/twitter-image.jpg'],
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
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* DNS 预解析和预连接 */}
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://cdn.jsdelivr.net" />
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://unpkg.com" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon-16x16.svg" type="image/svg+xml" sizes="16x16" />
        <link rel="icon" href="/favicon-32x32.svg" type="image/svg+xml" sizes="32x32" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.svg" />
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* 防闪烁脚本 - 必须在页面渲染前执行 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const STORAGE_KEY = 'tinycompressor-theme';
                  const getSystemTheme = () => {
                    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  };
                  
                  const savedTheme = localStorage.getItem(STORAGE_KEY);
                  let themeToApply = 'light';
                  
                  if (savedTheme === 'dark') {
                    themeToApply = 'dark';
                  } else if (savedTheme === 'light') {
                    themeToApply = 'light';
                  } else {
                    // 默认跟随系统
                    themeToApply = getSystemTheme();
                  }
                  
                  // 立即应用主题
                  document.documentElement.classList.add(themeToApply);
                  document.documentElement.setAttribute('data-theme', themeToApply);
                } catch (e) {
                  // 如果出错，默认亮色模式
                  document.documentElement.classList.add('light');
                }
              })();
            `,
          }}
        />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <ClientProviders>
          {children}
          <PerformanceMonitor />
        </ClientProviders>
        
        {/* Google Analytics - 延迟加载，不阻塞首屏 */}
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