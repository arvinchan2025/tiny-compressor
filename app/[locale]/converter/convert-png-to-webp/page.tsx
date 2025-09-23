import { Metadata } from 'next';
import { SupportedLanguage } from '@/types/i18n';
import ConverterPageLayout from '@/components/layout/ConverterPageLayout';

interface ConvertPngToWebpPageProps {
  params: {
    locale: SupportedLanguage;
  };
}

export async function generateMetadata({ params }: ConvertPngToWebpPageProps): Promise<Metadata> {
  const { locale } = params;
  
  return {
    title: 'PNG to WebP Converter - Convert PNG Images to WebP Online',
    description: 'Free online PNG to WebP converter. Convert PNG images to WebP format with high quality. No registration required.',
    keywords: 'PNG to WebP, convert PNG, PNG converter, WebP converter',
    openGraph: {
      title: 'PNG to WebP Converter - Convert PNG Images to WebP Online',
      description: 'Free online PNG to WebP converter. Convert PNG images to WebP format with high quality.',
      type: 'website',
    },
  };
}

export default function ConvertPngToWebpPage({ params }: ConvertPngToWebpPageProps) {
  const { locale } = params;
  
  return (
    <ConverterPageLayout
      locale={locale}
      sourceFormat="png"
      targetFormat="webp"
    />
  );
}
