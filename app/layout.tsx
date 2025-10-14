import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ClientProviders } from '@/components/providers/ClientProviders';
// import { ToastProvider } from '@/components/ui/Toast'; // 移除Toast，改用进度条

const inter = Inter({ subsets: ['latin'] });

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
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon-16x16.svg" type="image/svg+xml" sizes="16x16" />
        <link rel="icon" href="/favicon-32x32.svg" type="image/svg+xml" sizes="32x32" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.svg" />
        <link rel="manifest" href="/site.webmanifest" />
        {/* Google Analytics */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-R23Y0Z9XSP"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
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
            `,
          }}
        />
        
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
        </ClientProviders>
      </body>
    </html>
  );
}