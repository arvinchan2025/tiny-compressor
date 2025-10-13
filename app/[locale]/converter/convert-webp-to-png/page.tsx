import { Metadata } from 'next';
import { SupportedLanguage } from '@/types/i18n';
import ConvertWebpToPngClient from './ConvertWebpToPngClient';

interface ConvertWebpToPngPageProps {
  params: {
    locale: SupportedLanguage;
  };
}

export async function generateMetadata({ params }: ConvertWebpToPngPageProps): Promise<Metadata> {
  const { locale } = params;
  
  return {
    title: 'WebP to PNG Converter - Free Online Image Format Converter',
    description: 'Convert WebP to PNG online for free! Preserve image quality and transparency. Fast, secure, and completely private conversion.',
    keywords: 'WebP to PNG converter, convert WebP, WebP converter, PNG conversion, online image converter, free WebP tool'
  };
}

export default function ConvertWebpToPngPage({ params }: ConvertWebpToPngPageProps) {
  return (
    <ConvertWebpToPngClient locale={params.locale} />
  );
}
