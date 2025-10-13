import { Metadata } from 'next';
import { SupportedLanguage } from '@/types/i18n';
import ConvertHeicToJpgClient from './ConvertHeicToJpgClient';

interface ConvertHeicToJpgPageProps {
  params: {
    locale: SupportedLanguage;
  };
}

export async function generateMetadata({ params }: ConvertHeicToJpgPageProps): Promise<Metadata> {
  const { locale } = params;
  
  return {
    title: 'HEIC to JPG Converter - Free Online Image Format Converter',
    description: 'Convert HEIC to JPG online for free! Improve compatibility with all devices and platforms. Fast, secure, and completely private conversion.',
    keywords: 'HEIC to JPG, convert HEIC, image converter, free online converter, HEIC converter'
  };
}

export default function ConvertHeicToJpgPage({ params }: ConvertHeicToJpgPageProps) {
  return (
    <ConvertHeicToJpgClient locale={params.locale} />
  );
}