import { Metadata } from 'next';
import { SupportedLanguage } from '@/types/i18n';
import CompressBmpClient from './CompressBmpClient';

interface CompressBmpPageProps {
  params: {
    locale: SupportedLanguage;
  };
}

export async function generateMetadata({ params }: CompressBmpPageProps): Promise<Metadata> {
  const { locale } = params;
  
  return {
    title: 'BMP Compressor - Compress BMP Bitmap Images Online',
    description: 'Compress BMP images online with advanced optimization. Reduce file size while preserving quality and supporting various color depths.',
    keywords: ['BMP compressor', 'bitmap compression', 'BMP optimization', 'image compression', 'online tool'],
    openGraph: {
      title: 'BMP Compressor - Compress BMP Bitmap Images Online',
      description: 'Compress BMP images online with advanced optimization. Reduce file size while preserving quality and supporting various color depths.',
      type: 'website',
    },
  };
}

export default function CompressBmpPage({ params }: CompressBmpPageProps) {
  const { locale } = params;
  
  return <CompressBmpClient locale={locale} />;
}







