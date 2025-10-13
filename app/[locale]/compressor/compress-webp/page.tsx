import { Metadata } from 'next';
import { SupportedLanguage } from '@/types/i18n';
import CompressWebpClient from './CompressWebpClient';

interface CompressWebpPageProps {
  params: {
    locale: SupportedLanguage;
  };
}

export async function generateMetadata({ params }: CompressWebpPageProps): Promise<Metadata> {
  const { locale } = params;
  
  return {
    title: 'WebP Compressor - Compress WebP Images Online',
    description: 'Compress WebP images online with our free WebP compressor. Superior compression with modern web optimization. Fast, secure, and easy to use.',
    keywords: 'WebP compressor, compress WebP, WebP optimization, reduce WebP size, WebP compressor online, free WebP compressor',
    openGraph: {
      title: 'WebP Compressor - Compress WebP Images Online',
      description: 'Compress WebP images online with our free WebP compressor. Superior compression with modern web optimization. Fast, secure, and easy to use.',
      type: 'website',
      locale: locale,
    },
    twitter: {
      card: 'summary_large_image',
      title: 'WebP Compressor - Compress WebP Images Online',
      description: 'Compress WebP images online with our free WebP compressor. Superior compression with modern web optimization. Fast, secure, and easy to use.',
    },
  };
}

export default function CompressWebpPage({ params }: CompressWebpPageProps) {
  return <CompressWebpClient locale={params.locale} />;
}