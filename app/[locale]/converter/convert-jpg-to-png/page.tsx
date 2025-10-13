import { Metadata } from 'next';
import { SupportedLanguage } from '@/types/i18n';
import ConvertJpgToPngClient from './ConvertJpgToPngClient';

interface ConvertJpgToPngPageProps {
  params: {
    locale: SupportedLanguage;
  };
}

export async function generateMetadata({ params }: ConvertJpgToPngPageProps): Promise<Metadata> {
  const { locale } = params;
  
  return {
    title: 'JPG to PNG Converter - Free Online Image Format Converter',
    description: 'Convert JPG to PNG online for free! Preserve image quality and transparency. Fast, secure, and completely private conversion.',
    keywords: 'JPG to PNG, convert JPG, image converter, free online converter, PNG converter'
  };
}

export default function ConvertJpgToPngPage({ params }: ConvertJpgToPngPageProps) {
  return (
    <ConvertJpgToPngClient locale={params.locale} />
  );
}