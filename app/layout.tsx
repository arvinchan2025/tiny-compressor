import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
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
      'ar': 'https://tinycompressor.com/ar'
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
    <html>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon-16x16.svg" type="image/svg+xml" sizes="16x16" />
        <link rel="icon" href="/favicon-32x32.svg" type="image/svg+xml" sizes="32x32" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}