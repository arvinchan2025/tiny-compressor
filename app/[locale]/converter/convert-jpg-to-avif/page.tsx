import { Metadata } from 'next';
import { SupportedLanguage } from '@/types/i18n';
import ConverterPageLayout from '@/components/layout/ConverterPageLayout';

interface ConvertJpgToAvifPageProps {
  params: {
    locale: SupportedLanguage;
  };
}

export async function generateMetadata({ params }: ConvertJpgToAvifPageProps): Promise<Metadata> {
  const { locale } = params;
  
  return {
    title: 'JPG to AVIF Converter - Convert JPG Images to AVIF Online',
    description: 'Free online JPG to AVIF converter. Convert JPG images to AVIF format with high quality. No registration required.',
    keywords: 'JPG to AVIF, convert JPG, JPG converter, AVIF converter',
    openGraph: {
      title: 'JPG to AVIF Converter - Convert JPG Images to AVIF Online',
      description: 'Free online JPG to AVIF converter. Convert JPG images to AVIF format with high quality.',
      type: 'website',
    },
  };
}

export default function ConvertJpgToAvifPage({ params }: ConvertJpgToAvifPageProps) {
  const { locale } = params;
  
  return (
    <ConverterPageLayout
      locale={locale}
      sourceFormat="jpg"
      targetFormat="avif"
    />
  );
}
