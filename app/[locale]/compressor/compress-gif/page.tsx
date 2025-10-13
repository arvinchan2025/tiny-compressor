import { Metadata } from 'next';
import { SupportedLanguage } from '@/types/i18n';
import CompressGifClient from './CompressGifClient';

interface CompressGifPageProps {
  params: {
    locale: SupportedLanguage;
  };
}

export async function generateMetadata({ params }: CompressGifPageProps): Promise<Metadata> {
  const { locale } = params;
  
  return {
    title: 'GIF Compressor - Free Online Image Compressor',
    description: 'Compress GIF images and animations online for free! Advanced optimization for smaller file sizes.',
    keywords: 'GIF compressor, compress GIF, image compressor, free online compressor, GIF optimizer',
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function CompressGifPage({ params }: CompressGifPageProps) {
  const { locale } = params;
  
  return <CompressGifClient locale={locale} />;
}

