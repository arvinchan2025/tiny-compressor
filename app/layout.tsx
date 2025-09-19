import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { generateAlternatesConfig, generateHreflangTags } from '../lib/i18n';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TinyCompressor - Free Online Image Compression Tool | Compress JPG, PNG, WebP',
  description: 'Compress images online for free! Reduce file sizes by 60-90% while maintaining quality. Support JPG, PNG, WebP formats. No registration required. Fast, secure, and completely private.',
  keywords: 'image compression, compress images, reduce file size, online tool, free, JPG compression, PNG compression, WebP compression, image optimizer, photo compression, batch compression, privacy, secure',
  authors: [{ name: 'TinyCompressor' }],
  robots: 'index, follow',
  icons: {
    icon: [
      { url: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' },
      { url: '/favicon-16x16.svg', sizes: '16x16', type: 'image/svg+xml' },
      { url: '/favicon-32x32.svg', sizes: '32x32', type: 'image/svg+xml' }
    ],
    apple: [
      { url: '/apple-touch-icon.svg', sizes: '180x180', type: 'image/svg+xml' }
    ]
  },
  openGraph: {
    title: 'TinyCompressor - Free Online Image Compression Tool',
    description: 'Compress images online for free! Reduce file sizes by 60-90% while maintaining quality. Support JPG, PNG, WebP formats. No registration required.',
    type: 'website',
    locale: 'en_US',
    siteName: 'TinyCompressor',
    url: 'https://tinycompressor.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TinyCompressor - Free Online Image Compression Tool',
    description: 'Compress images online for free! Reduce file sizes by 60-90% while maintaining quality.',
  },
         alternates: generateAlternatesConfig(),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "TinyCompressor",
    "description": "Free online image compression tool that reduces file sizes by 60-90% while maintaining quality",
    "url": "https://tinycompressor.com",
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "Image compression",
      "Batch processing",
      "Multiple format support",
      "Privacy protection",
      "No registration required"
    ],
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "screenshot": "https://tinycompressor.com/screenshot.jpg"
  };

  return (
    <html>
      <head>
        {/* Favicon */}
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon-16x16.svg" type="image/svg+xml" sizes="16x16" />
        <link rel="icon" href="/favicon-32x32.svg" type="image/svg+xml" sizes="32x32" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.svg" />
        
        {/* hreflang标签 */}
        {generateHreflangTags().map(({ hrefLang, href }) => (
          <link key={hrefLang} rel="alternate" hrefLang={hrefLang} href={href} />
        ))}
        <link rel="alternate" hrefLang="x-default" href="https://tinycompressor.com/" />
        
        {/* Sitemap */}
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
