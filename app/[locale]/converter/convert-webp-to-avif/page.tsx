import { Metadata } from 'next';
import { SupportedLanguage } from '@/types/i18n';
import ConvertWebpToAvifClient from './ConvertWebpToAvifClient';

interface ConvertWebpToAvifPageProps {
  params: {
    locale: SupportedLanguage;
  };
}

export async function generateMetadata({ params }: ConvertWebpToAvifPageProps): Promise<Metadata> {
  const { locale } = params;
  
  return {
    title: 'WebP to AVIF Converter - Free Online Image Format Converter',
    description: 'Convert WebP to AVIF online for free! Next-generation compression technology with superior quality. Fast, secure, and completely private conversion.',
    keywords: 'WebP to AVIF, convert WebP, image converter, free online converter, AVIF converter'
  };
}

export default function ConvertWebpToAvifPage({ params }: ConvertWebpToAvifPageProps) {
  return (
    <ConvertWebpToAvifClient locale={params.locale} />
  );
}