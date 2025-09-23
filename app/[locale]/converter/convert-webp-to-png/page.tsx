import { Metadata } from 'next';
import { SupportedLanguage } from '@/types/i18n';
import ConverterPageLayout from '@/components/layout/ConverterPageLayout';

interface ConvertWebpToPngPageProps {
  params: {
    locale: SupportedLanguage;
  };
}

export async function generateMetadata({ params }: ConvertWebpToPngPageProps): Promise<Metadata> {
  const { locale } = params;
  
  return {
    title: 'WebP to PNG Converter - Convert WebP Images to PNG Online',
    description: 'Free online WebP to PNG converter. Convert WebP images to PNG format with high quality. No registration required.',
    keywords: 'WebP to PNG, convert WebP, WebP converter, PNG converter',
    openGraph: {
      title: 'WebP to PNG Converter - Convert WebP Images to PNG Online',
      description: 'Free online WebP to PNG converter. Convert WebP images to PNG format with high quality.',
      type: 'website',
    },
  };
}

export default function ConvertWebpToPngPage({ params }: ConvertWebpToPngPageProps) {
  const { locale } = params;
  
  return (
    <ConverterPageLayout
      locale={locale}
      sourceFormat="webp"
      targetFormat="png"
    />
  );
}
