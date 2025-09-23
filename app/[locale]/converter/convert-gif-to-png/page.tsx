import { Metadata } from 'next';
import { SupportedLanguage } from '@/types/i18n';
import ConverterPageLayout from '@/components/layout/ConverterPageLayout';

interface ConvertGifToPngPageProps {
  params: {
    locale: SupportedLanguage;
  };
}

export async function generateMetadata({ params }: ConvertGifToPngPageProps): Promise<Metadata> {
  const { locale } = params;
  
  return {
    title: 'GIF to PNG Converter - Convert GIF Images to PNG Online',
    description: 'Free online GIF to PNG converter. Convert GIF images to PNG format with high quality. No registration required.',
    keywords: 'GIF to PNG, convert GIF, GIF converter, PNG converter',
    openGraph: {
      title: 'GIF to PNG Converter - Convert GIF Images to PNG Online',
      description: 'Free online GIF to PNG converter. Convert GIF images to PNG format with high quality.',
      type: 'website',
    },
  };
}

export default function ConvertGifToPngPage({ params }: ConvertGifToPngPageProps) {
  const { locale } = params;
  
  return (
    <ConverterPageLayout
      locale={locale}
      sourceFormat="gif"
      targetFormat="png"
    />
  );
}
