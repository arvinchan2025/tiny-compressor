import { Metadata } from 'next';
import { SupportedLanguage } from '@/types/i18n';
import ConvertJpgToWebpClient from './ConvertJpgToWebpClient';

interface ConvertJpgToWebpPageProps {
  params: {
    locale: SupportedLanguage;
  };
}

export async function generateMetadata({ params }: ConvertJpgToWebpPageProps): Promise<Metadata> {
  const { locale } = params;
  
  return {
    title: 'JPG to WebP Converter - Free Online Image Format Converter',
    description: 'Convert JPG to WebP online for free! Superior compression and modern web optimization. Fast, secure, and completely private conversion.',
    keywords: 'JPG to WebP, convert JPG, image converter, free online converter, WebP converter'
  };
}

export default function ConvertJpgToWebpPage({ params }: ConvertJpgToWebpPageProps) {
  return (
    <ConvertJpgToWebpClient locale={params.locale} />
  );
}