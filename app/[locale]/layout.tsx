import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../globals.css';
import { notFound } from 'next/navigation';
import { SUPPORTED_LANGUAGES, isRTLLanguage, generateAlternatesConfig, generateHreflangTags, getLanguageInfo, isValidLanguage, SupportedLanguage } from '../../lib/i18n';
import { loadTranslations } from '../../lib/translations';

const inter = Inter({ subsets: ['latin'] });

// 支持的语言列表
const locales = SUPPORTED_LANGUAGES;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const { locale } = params;
  
  if (!isValidLanguage(locale)) {
    notFound();
  }

  // 确保locale是有效的语言代码
  const validLocale = isValidLanguage(locale) ? locale : 'en';
  const langInfo = getLanguageInfo(validLocale as SupportedLanguage);
  const translations = await loadTranslations(validLocale);
  
  return {
    title: translations.metadata.title,
    description: translations.metadata.description,
    keywords: translations.metadata.keywords,
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
      title: translations.metadata.openGraphTitle,
      description: translations.metadata.openGraphDescription,
      type: 'website',
      locale: langInfo.locale,
      siteName: 'TinyCompressor',
      url: 'https://tinycompressor.com',
    },
    twitter: {
      card: 'summary_large_image',
      title: translations.metadata.twitterTitle,
      description: translations.metadata.twitterDescription,
    },
    alternates: {
      ...generateAlternatesConfig(),
      canonical: locale === 'en' ? 'https://tinycompressor.com' : `https://tinycompressor.com/${locale}`,
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
  
  if (!isValidLanguage(locale)) {
    notFound();
  }

  // 确保locale是有效的语言代码，避免服务端和客户端不一致
  const validLocale = isValidLanguage(locale) ? locale : 'en';

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "TinyCompressor",
    "description": validLocale === 'zh' 
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

  // 检查是否为RTL语言
  const isRTL = isRTLLanguage(validLocale as SupportedLanguage);
  
  return (
    <html lang={validLocale} dir={isRTL ? 'rtl' : 'ltr'}>
             <head>
               {/* hreflang标签 */}
               {generateHreflangTags().map(({ hrefLang, href }) => (
                 <link key={hrefLang} rel="alternate" hrefLang={hrefLang} href={href} />
               ))}
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

