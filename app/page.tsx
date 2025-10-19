import { Locale } from '@/lib/i18n';
import { Metadata } from 'next';
import StandardPageLayout from '@/components/layout/StandardPageLayout';
import ModernHomePage from '@/components/home/ModernHomePage';
import { generateSEOContent } from '@/lib/seo-optimization';

// Generate metadata for SEO
export async function generateMetadata(): Promise<Metadata> {
  const seoContent = generateSEOContent('home', undefined, 'en');
  
  return {
    title: seoContent.title,
    description: seoContent.description,
    keywords: seoContent.keywords,
    openGraph: {
      title: seoContent.title,
      description: seoContent.description,
      url: seoContent.canonicalUrl,
      siteName: 'TinyCompressor',
      images: [
        {
          url: 'https://tinycompressor.com/og-image.jpg',
          width: 1200,
          height: 630,
          alt: 'TinyCompressor - Free Online Image Compression Tools',
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: seoContent.title,
      description: seoContent.description,
      images: ['https://tinycompressor.com/og-image.jpg'],
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
    alternates: {
      canonical: seoContent.canonicalUrl,
      languages: {
        'en': 'https://tinycompressor.com',
        'zh': 'https://tinycompressor.com/zh',
        'es': 'https://tinycompressor.com/es',
        'fr': 'https://tinycompressor.com/fr',
        'de': 'https://tinycompressor.com/de',
        'it': 'https://tinycompressor.com/it',
        'pt': 'https://tinycompressor.com/pt',
        'ru': 'https://tinycompressor.com/ru',
        'ar': 'https://tinycompressor.com/ar',
        'ja': 'https://tinycompressor.com/ja',
        'ko': 'https://tinycompressor.com/ko',
      },
    },
  };
}

export default function RootPage() {
  // English as default language, directly render English content without /en prefix
  // Note: This should be rewritten to /en version through middleware, so this component won't be directly accessed
  const locale: Locale = 'en';
  
  return (
    <StandardPageLayout locale={locale}>
      <ModernHomePage locale={locale} />
    </StandardPageLayout>
  );
}