import { notFound } from 'next/navigation';
import { SupportedLanguage } from '@/types/i18n';

// 支持的语言列表
const locales = ['en', 'zh', 'es', 'de', 'fr', 'ar'];

// 语言信息
const languageInfo = {
  en: { name: 'English', nativeName: 'English', flag: '🇺🇸', direction: 'ltr', locale: 'en_US' },
  zh: { name: 'Chinese', nativeName: '中文', flag: '🇨🇳', direction: 'ltr', locale: 'zh_CN' },
  es: { name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', direction: 'ltr', locale: 'es_ES' },
  de: { name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', direction: 'ltr', locale: 'de_DE' },
  fr: { name: 'French', nativeName: 'Français', flag: '🇫🇷', direction: 'ltr', locale: 'fr_FR' },
  ar: { name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', direction: 'rtl', locale: 'ar_SA' }
} as const;

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: {
    locale: string;
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params: { locale }
}: {
  params: { locale: string };
}) {
  // 验证语言是否支持
  const validLocale: SupportedLanguage = locales.includes(locale) ? (locale as SupportedLanguage) : 'en';
  
  const langInfo = languageInfo[validLocale];
  const isRTL = langInfo.direction === 'rtl';

  // 基础元数据
  const baseMetadata = {
    title: 'TinyCompressor - Free Online Image Compression Tool',
    description: 'Compress images online for free! Support JPG, PNG, WebP formats. Fast, secure, and privacy-friendly.',
    keywords: 'image compression, online compressor, JPG, PNG, WebP, free tool',
    authors: [{ name: 'TinyCompressor Team' }],
    creator: 'TinyCompressor',
    publisher: 'TinyCompressor',
    robots: 'index, follow',
    openGraph: {
      type: 'website',
      locale: langInfo.locale,
      url: validLocale === 'en' ? 'https://tinycompressor.com' : `https://tinycompressor.com/${validLocale}`,
      siteName: 'TinyCompressor',
      title: 'TinyCompressor - Free Online Image Compression Tool',
      description: 'Compress images online for free! Support JPG, PNG, WebP formats.',
      images: [
        {
          url: '/og-image.jpg',
          width: 1200,
          height: 630,
          alt: 'TinyCompressor - Image Compression Tool'
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: 'TinyCompressor - Free Online Image Compression Tool',
      description: 'Compress images online for free!',
      images: ['/og-image.jpg']
    },
    alternates: {
      canonical: validLocale === 'en' ? 'https://tinycompressor.com' : `https://tinycompressor.com/${validLocale}`,
      languages: {
        'en': 'https://tinycompressor.com',
        'zh': 'https://tinycompressor.com/zh',
        'es': 'https://tinycompressor.com/es',
        'de': 'https://tinycompressor.com/de',
        'fr': 'https://tinycompressor.com/fr',
        'ar': 'https://tinycompressor.com/ar'
      }
    }
  };

  return baseMetadata;
}

export default async function LocaleLayout({
  children,
  params: { locale }
}: LocaleLayoutProps) {
  // 验证语言是否支持
  const validLocale: SupportedLanguage = locales.includes(locale) ? (locale as SupportedLanguage) : 'en';
  
  if (!locales.includes(locale)) {
    notFound();
  }

  const langInfo = languageInfo[validLocale];
  const isRTL = langInfo.direction === 'rtl';

  return (
    <html lang={validLocale} dir={isRTL ? 'rtl' : 'ltr'}>
      <body>
        {children}
      </body>
    </html>
  );
}