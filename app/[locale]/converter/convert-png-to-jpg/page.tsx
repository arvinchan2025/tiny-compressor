import { Metadata } from 'next';
import { SupportedLanguage } from '@/types/i18n';
import ConverterPageLayout from '@/components/layout/ConverterPageLayout';

interface ConvertPngToJpgPageProps {
  params: {
    locale: SupportedLanguage;
  };
}

export async function generateMetadata({ params }: ConvertPngToJpgPageProps): Promise<Metadata> {
  const { locale } = params;
  
  return {
    title: 'PNG to JPG Converter - Convert PNG Images to JPG Online',
    description: 'Free online PNG to JPG converter. Convert PNG images to JPG format with high quality. No registration required.',
    keywords: 'PNG to JPG, convert PNG, PNG converter, JPG converter',
    openGraph: {
      title: 'PNG to JPG Converter - Convert PNG Images to JPG Online',
      description: 'Free online PNG to JPG converter. Convert PNG images to JPG format with high quality.',
      type: 'website',
    },
  };
}

export default function ConvertPngToJpgPage({ params }: ConvertPngToJpgPageProps) {
  const { locale } = params;
  
  return (
    <ConverterPageLayout
      locale={locale}
      sourceFormat="png"
      targetFormat="jpg"
    />
  );
}
