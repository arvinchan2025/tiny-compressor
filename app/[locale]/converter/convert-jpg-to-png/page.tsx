import { Metadata } from 'next';
import { SupportedLanguage } from '@/types/i18n';
import ConverterPageLayout from '@/components/layout/ConverterPageLayout';

interface ConvertJpgToPngPageProps {
  params: {
    locale: SupportedLanguage;
  };
}

export async function generateMetadata({ params }: ConvertJpgToPngPageProps): Promise<Metadata> {
  const { locale } = params;
  
  return {
    title: 'JPG to PNG Converter - Convert JPG Images to PNG Online',
    description: 'Free online JPG to PNG converter. Convert JPG images to PNG format with high quality. No registration required.',
    keywords: 'JPG to PNG, convert JPG, JPG converter, PNG converter',
    openGraph: {
      title: 'JPG to PNG Converter - Convert JPG Images to PNG Online',
      description: 'Free online JPG to PNG converter. Convert JPG images to PNG format with high quality.',
      type: 'website',
    },
  };
}

export default function ConvertJpgToPngPage({ params }: ConvertJpgToPngPageProps) {
  const { locale } = params;
  
  return (
    <ConverterPageLayout
      locale={locale}
      sourceFormat="jpg"
      targetFormat="png"
    />
  );
}
