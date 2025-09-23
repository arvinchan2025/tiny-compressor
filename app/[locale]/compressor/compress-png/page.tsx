import { Metadata } from 'next';
import { SupportedLanguage } from '@/types/i18n';
import PngCompressorNew from './PngCompressorNew';

interface CompressPngPageProps {
  params: {
    locale: SupportedLanguage;
  };
}

export async function generateMetadata({ params }: CompressPngPageProps): Promise<Metadata> {
  const { locale } = params;
  
  return {
    title: 'PNG Compressor - Compress PNG Images Online',
    description: 'Free online PNG image compressor. Reduce PNG file size while maintaining quality. No registration required.',
    keywords: 'PNG compressor, compress PNG, reduce PNG size, PNG optimization',
    openGraph: {
      title: 'PNG Compressor - Compress PNG Images Online',
      description: 'Free online PNG image compressor. Reduce PNG file size while maintaining quality.',
      type: 'website',
    },
  };
}

export default function CompressPngPage({ params }: CompressPngPageProps) {
  const { locale } = params;
  
  return <PngCompressorNew locale={locale} />;
}
