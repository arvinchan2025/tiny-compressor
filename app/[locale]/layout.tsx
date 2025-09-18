import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../globals.css';
import { notFound } from 'next/navigation';

const inter = Inter({ subsets: ['latin'] });

// 支持的语言列表
const locales = ['en', 'zh'];

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const { locale } = params;
  
  if (!locales.includes(locale)) {
    notFound();
  }

  const isZh = locale === 'zh';
  
  return {
    title: isZh 
      ? 'TinyCompressor - 免费在线图片压缩工具 | 压缩 JPG、PNG、WebP'
      : 'TinyCompressor - Free Online Image Compression Tool | Compress JPG, PNG, WebP',
    description: isZh
      ? '免费在线压缩图片！减少60-90%文件大小同时保持质量。支持JPG、PNG、WebP格式。无需注册。快速、安全、完全私密。'
      : 'Compress images online for free! Reduce file sizes by 60-90% while maintaining quality. Support JPG, PNG, WebP formats. No registration required. Fast, secure, and completely private.',
    keywords: isZh
      ? '图片压缩, 压缩图片, 减少文件大小, 在线工具, 免费, JPG压缩, PNG压缩, WebP压缩, 图片优化, 照片压缩, 批量压缩, 隐私, 安全'
      : 'image compression, compress images, reduce file size, online tool, free, JPG compression, PNG compression, WebP compression, image optimizer, photo compression, batch compression, privacy, secure',
    authors: [{ name: 'TinyCompressor' }],
    robots: 'index, follow',
    icons: {
      icon: [
        { url: '/favicon-16x16.svg', sizes: '16x16', type: 'image/svg+xml' },
        { url: '/favicon-32x32.svg', sizes: '32x32', type: 'image/svg+xml' }
      ],
      apple: [
        { url: '/apple-touch-icon.svg', sizes: '180x180', type: 'image/svg+xml' }
      ]
    },
    openGraph: {
      title: isZh 
        ? 'TinyCompressor - 免费在线图片压缩工具'
        : 'TinyCompressor - Free Online Image Compression Tool',
      description: isZh
        ? '免费在线压缩图片！减少60-90%文件大小同时保持质量。支持JPG、PNG、WebP格式。无需注册。'
        : 'Compress images online for free! Reduce file sizes by 60-90% while maintaining quality. Support JPG, PNG, WebP formats. No registration required.',
      type: 'website',
      locale: isZh ? 'zh_CN' : 'en_US',
      siteName: 'TinyCompressor',
      url: 'https://tinycompressor.com',
    },
    twitter: {
      card: 'summary_large_image',
      title: isZh 
        ? 'TinyCompressor - 免费在线图片压缩工具'
        : 'TinyCompressor - Free Online Image Compression Tool',
      description: isZh
        ? '免费在线压缩图片！减少60-90%文件大小同时保持质量。'
        : 'Compress images online for free! Reduce file sizes by 60-90% while maintaining quality.',
    },
    alternates: {
      canonical: locale === 'en' ? 'https://tinycompressor.com' : `https://tinycompressor.com/${locale}`,
      languages: {
        'en': 'https://tinycompressor.com',
        'zh': 'https://tinycompressor.com/zh',
        'x-default': 'https://tinycompressor.com',
      },
    },
  };
}

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = params;
  
  if (!locales.includes(locale)) {
    notFound();
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "TinyCompressor",
    "description": locale === 'zh' 
      ? "免费在线图片压缩工具，减少60-90%文件大小同时保持质量"
      : "Free online image compression tool that reduces file sizes by 60-90% while maintaining quality",
    "url": "https://tinycompressor.com",
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": locale === 'zh' 
      ? ["图片压缩", "批量处理", "多格式支持", "隐私保护", "无需注册"]
      : ["Image compression", "Batch processing", "Multiple format support", "Privacy protection", "No registration required"],
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "screenshot": "https://tinycompressor.com/screenshot.jpg"
  };

  return (
    <html lang={locale}>
      <head>
        {/* hreflang标签 */}
        <link rel="alternate" hrefLang="en" href="https://tinycompressor.com/" />
        <link rel="alternate" hrefLang="zh" href="https://tinycompressor.com/zh" />
        <link rel="alternate" hrefLang="x-default" href="https://tinycompressor.com/" />
        
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

