import { Metadata } from 'next';
import { SupportedLanguage } from '@/types/i18n';
import ConvertPngToAvifClient from './ConvertPngToAvifClient';

interface ConvertPngToAvifPageProps {
  params: {
    locale: SupportedLanguage;
  };
}

export async function generateMetadata({ params }: ConvertPngToAvifPageProps): Promise<Metadata> {
  const { locale } = params;
  
  return {
    title: 'PNG to AVIF Converter - Free Online Image Format Converter',
    description: 'Convert PNG to AVIF online for free! Next-generation compression technology with superior quality. Fast, secure, and completely private conversion.',
    keywords: 'PNG to AVIF, convert PNG, image converter, free online converter, AVIF converter'
  };
}

export default function ConvertPngToAvifPage({ params }: ConvertPngToAvifPageProps) {
  return (
    <ConvertPngToAvifClient locale={params.locale} />
  );
}