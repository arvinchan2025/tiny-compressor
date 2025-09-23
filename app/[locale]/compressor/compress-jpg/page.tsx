import { Metadata } from 'next';
import { SupportedLanguage } from '@/types/i18n';
import JpegCompressorNew from './JpegCompressorNew';

interface CompressJpgPageProps {
  params: {
    locale: SupportedLanguage;
  };
}

export async function generateMetadata({ params }: CompressJpgPageProps): Promise<Metadata> {
  const { locale } = params;
  
  return {
    title: 'JPEG Compressor - Compress JPG Images Online',
    description: 'Free online JPEG image compressor. Reduce JPG file size while maintaining quality. No registration required.',
    keywords: 'JPEG compressor, compress JPG, reduce JPG size, JPEG optimization',
    openGraph: {
      title: 'JPEG Compressor - Compress JPG Images Online',
      description: 'Free online JPEG image compressor. Reduce JPG file size while maintaining quality.',
      type: 'website',
    },
  };
}

export default function CompressJpgPage({ params }: CompressJpgPageProps) {
  const { locale } = params;
  
  return <JpegCompressorNew locale={locale} />;
}
