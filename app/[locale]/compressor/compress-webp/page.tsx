import { Metadata } from 'next';
import { SupportedLanguage } from '@/types/i18n';
import WebpCompressorNew from './WebpCompressorNew';

interface CompressWebpPageProps {
  params: {
    locale: SupportedLanguage;
  };
}

export async function generateMetadata({ params }: CompressWebpPageProps): Promise<Metadata> {
  const { locale } = params;
  
  return {
    title: 'WebP Compressor - Compress WebP Images Online',
    description: 'Free online WebP image compressor. Reduce WebP file size while maintaining quality. No registration required.',
    keywords: 'WebP compressor, compress WebP, reduce WebP size, WebP optimization',
    openGraph: {
      title: 'WebP Compressor - Compress WebP Images Online',
      description: 'Free online WebP image compressor. Reduce WebP file size while maintaining quality.',
      type: 'website',
    },
  };
}

export default function CompressWebpPage({ params }: CompressWebpPageProps) {
  const { locale } = params;
  
  return <WebpCompressorNew locale={locale} />;
}
