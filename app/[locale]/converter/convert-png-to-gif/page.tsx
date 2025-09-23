import { Metadata } from 'next';
import { SupportedLanguage } from '@/types/i18n';
import ConverterPageLayout from '@/components/layout/ConverterPageLayout';

interface ConvertPngToGifPageProps {
  params: {
    locale: SupportedLanguage;
  };
}

export async function generateMetadata({ params }: ConvertPngToGifPageProps): Promise<Metadata> {
  const { locale } = params;
  
  return {
    title: 'PNG to GIF Converter - Convert PNG Images to GIF Online',
    description: 'Free online PNG to GIF converter. Convert PNG images to GIF format with high quality. No registration required.',
    keywords: 'PNG to GIF, convert PNG, PNG converter, GIF converter',
    openGraph: {
      title: 'PNG to GIF Converter - Convert PNG Images to GIF Online',
      description: 'Free online PNG to GIF converter. Convert PNG images to GIF format with high quality.',
      type: 'website',
    },
  };
}

export default function ConvertPngToGifPage({ params }: ConvertPngToGifPageProps) {
  const { locale } = params;
  
  return (
    <ConverterPageLayout
      locale={locale}
      sourceFormat="png"
      targetFormat="gif"
    />
  );
}
