import { Metadata } from 'next';
import { SupportedLanguage } from '@/types/i18n';
import ConverterPageLayout from '@/components/layout/ConverterPageLayout';

interface ConvertJpgToWebpPageProps {
  params: {
    locale: SupportedLanguage;
  };
}

export async function generateMetadata({ params }: ConvertJpgToWebpPageProps): Promise<Metadata> {
  const { locale } = params;
  
  return {
    title: 'JPG to WebP Converter - Convert JPG Images to WebP Online',
    description: 'Free online JPG to WebP converter. Convert JPG images to WebP format with high quality. No registration required.',
    keywords: 'JPG to WebP, convert JPG, JPG converter, WebP converter',
    openGraph: {
      title: 'JPG to WebP Converter - Convert JPG Images to JPG Online',
      description: 'Free online JPG to WebP converter. Convert JPG images to WebP format with high quality.',
      type: 'website',
    },
  };
}

export default function ConvertJpgToWebpPage({ params }: ConvertJpgToWebpPageProps) {
  const { locale } = params;
  
  return (
    <ConverterPageLayout
      locale={locale}
      sourceFormat="jpg"
      targetFormat="webp"
    />
  );
}
