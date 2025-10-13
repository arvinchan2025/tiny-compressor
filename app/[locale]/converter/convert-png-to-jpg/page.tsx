import { Metadata } from 'next';
import { SupportedLanguage } from '@/types/i18n';
import ConvertPngToJpgClient from './ConvertPngToJpgClient';

interface ConvertPngToJpgPageProps {
  params: {
    locale: SupportedLanguage;
  };
}

export async function generateMetadata({ params }: ConvertPngToJpgPageProps): Promise<Metadata> {
  const { locale } = params;
  
  return {
    title: 'PNG to JPG Converter - Free Online Image Format Converter',
    description: 'Convert PNG to JPG online for free! Optimized compression and universal compatibility. Fast, secure, and completely private conversion.',
    keywords: 'PNG to JPG, convert PNG, image converter, free online converter, JPG converter'
  };
}

export default function ConvertPngToJpgPage({ params }: ConvertPngToJpgPageProps) {
  return <ConvertPngToJpgClient locale={params.locale} />;
}