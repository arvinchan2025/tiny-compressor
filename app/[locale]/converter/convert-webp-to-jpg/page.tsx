import { Metadata } from 'next';
import { SupportedLanguage } from '@/types/i18n';
import ConvertWebpToJpgClient from './ConvertWebpToJpgClient';

interface ConvertWebpToJpgPageProps {
  params: {
    locale: SupportedLanguage;
  };
}

export async function generateMetadata({ params }: ConvertWebpToJpgPageProps): Promise<Metadata> {
  const { locale } = params;
  
  return {
    title: 'WebP to JPG Converter - Free Online Image Format Converter',
    description: 'Convert WebP to JPG online for free! Universal compatibility and broader support. Fast, secure, and completely private conversion.',
    keywords: 'WebP to JPG, convert WebP, image converter, free online converter, JPG converter'
  };
}

export default function ConvertWebpToJpgPage({ params }: ConvertWebpToJpgPageProps) {
  return (
    <ConvertWebpToJpgClient locale={params.locale} />
  );
}