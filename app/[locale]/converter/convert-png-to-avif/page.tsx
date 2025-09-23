import { Metadata } from 'next';
import { SupportedLanguage } from '@/types/i18n';
import ConverterPageLayout from '@/components/layout/ConverterPageLayout';

interface ConvertPngToAvifPageProps {
  params: {
    locale: SupportedLanguage;
  };
}

export async function generateMetadata({ params }: ConvertPngToAvifPageProps): Promise<Metadata> {
  const { locale } = params;
  
  return {
    title: 'PNG to AVIF Converter - Convert PNG Images to AVIF Online',
    description: 'Free online PNG to AVIF converter. Convert PNG images to AVIF format with high quality. No registration required.',
    keywords: 'PNG to AVIF, convert PNG, PNG converter, AVIF converter',
    openGraph: {
      title: 'PNG to AVIF Converter - Convert PNG Images to AVIF Online',
      description: 'Free online PNG to AVIF converter. Convert PNG images to AVIF format with high quality.',
      type: 'website',
    },
  };
}

export default function ConvertPngToAvifPage({ params }: ConvertPngToAvifPageProps) {
  const { locale } = params;
  
  return (
    <ConverterPageLayout
      locale={locale}
      sourceFormat="png"
      targetFormat="avif"
    />
  );
}
