import { Metadata } from 'next';
import { SupportedLanguage } from '@/types/i18n';
import GifCompressorNew from './GifCompressorNew';

interface CompressGifPageProps {
  params: {
    locale: SupportedLanguage;
  };
}

export async function generateMetadata({ params }: CompressGifPageProps): Promise<Metadata> {
  const { locale } = params;
  
  return {
    title: 'GIF Compressor - Compress GIF Images Online',
    description: 'Free online GIF image compressor. Reduce GIF file size while maintaining quality. No registration required.',
    keywords: 'GIF compressor, compress GIF, reduce GIF size, GIF optimization',
    openGraph: {
      title: 'GIF Compressor - Compress GIF Images Online',
      description: 'Free online GIF image compressor. Reduce GIF file size while maintaining quality.',
      type: 'website',
    },
  };
}

export default function CompressGifPage({ params }: CompressGifPageProps) {
  const { locale } = params;
  
  return <GifCompressorNew locale={locale} />;
}
