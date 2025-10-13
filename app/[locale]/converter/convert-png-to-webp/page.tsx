import { Metadata } from 'next';
import { SupportedLanguage } from '@/types/i18n';
import ConvertPngToWebpClient from './ConvertPngToWebpClient';

interface ConvertPngToWebpPageProps {
  params: {
    locale: SupportedLanguage;
  };
}

export async function generateMetadata({ params }: ConvertPngToWebpPageProps): Promise<Metadata> {
  const { locale } = params;
  
  return {
    title: 'PNG to WebP Converter - Free Online Image Format Converter',
    description: 'Convert PNG to WebP online for free! Superior compression and modern web optimization. Fast, secure, and completely private conversion.',
    keywords: 'PNG to WebP, convert PNG, image converter, free online converter, WebP converter'
  };
}

export default function ConvertPngToWebpPage({ params }: ConvertPngToWebpPageProps) {
  return (
    <ConvertPngToWebpClient locale={params.locale} />
  );
}