import { Metadata } from 'next';
import { SupportedLanguage } from '@/types/i18n';
import ConverterPageLayout from '@/components/layout/ConverterPageLayout';

interface ConvertWebpToJpgPageProps {
  params: {
    locale: SupportedLanguage;
  };
}

export async function generateMetadata({ params }: ConvertWebpToJpgPageProps): Promise<Metadata> {
  const { locale } = params;
  
  return {
    title: 'WebP to JPG Converter - Convert WebP Images to JPG Online',
    description: 'Free online WebP to JPG converter. Convert WebP images to JPG format with high quality. No registration required.',
    keywords: 'WebP to JPG, convert WebP, WebP converter, JPG converter',
    openGraph: {
      title: 'WebP to JPG Converter - Convert WebP Images to JPG Online',
      description: 'Free online WebP to JPG converter. Convert WebP images to JPG format with high quality.',
      type: 'website',
    },
  };
}

export default function ConvertWebpToJpgPage({ params }: ConvertWebpToJpgPageProps) {
  const { locale } = params;
  
  return (
    <ConverterPageLayout
      locale={locale}
      sourceFormat="webp"
      targetFormat="jpg"
    />
  );
}
