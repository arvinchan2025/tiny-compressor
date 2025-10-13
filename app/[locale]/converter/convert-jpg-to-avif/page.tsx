import { Metadata } from 'next';
import { SupportedLanguage } from '@/types/i18n';
import ConvertJpgToAvifClient from './ConvertJpgToAvifClient';

interface ConvertJpgToAvifPageProps {
  params: {
    locale: SupportedLanguage;
  };
}

export async function generateMetadata({ params }: ConvertJpgToAvifPageProps): Promise<Metadata> {
  const { locale } = params;
  
  return {
    title: 'JPG to AVIF Converter - Free Online Image Format Converter',
    description: 'Convert JPG to AVIF online for free! Next-generation compression technology with superior quality. Fast, secure, and completely private conversion.',
    keywords: 'JPG to AVIF, convert JPG, image converter, free online converter, AVIF converter'
  };
}

export default function ConvertJpgToAvifPage({ params }: ConvertJpgToAvifPageProps) {
  return (
    <ConvertJpgToAvifClient locale={params.locale} />
  );
}