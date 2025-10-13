import { Metadata } from 'next';
import { SupportedLanguage } from '@/types/i18n';
import CompressPngClient from './CompressPngClient';

interface CompressPngPageProps {
  params: {
    locale: SupportedLanguage;
  };
}

export async function generateMetadata({ params }: CompressPngPageProps): Promise<Metadata> {
  const { locale } = params;
  
  return {
    title: 'PNG Compressor - Compress PNG Images Online',
    description: 'Compress PNG images online with our free PNG compressor. Reduce PNG file size while maintaining quality. Fast, secure, and easy to use.',
    keywords: 'PNG compressor, compress PNG, PNG optimization, reduce PNG size, PNG compressor online, free PNG compressor',
    openGraph: {
      title: 'PNG Compressor - Compress PNG Images Online',
      description: 'Compress PNG images online with our free PNG compressor. Reduce PNG file size while maintaining quality. Fast, secure, and easy to use.',
      type: 'website',
      locale: locale,
    },
    twitter: {
      card: 'summary_large_image',
      title: 'PNG Compressor - Compress PNG Images Online',
      description: 'Compress PNG images online with our free PNG compressor. Reduce PNG file size while maintaining quality. Fast, secure, and easy to use.',
    },
  };
}

export default function CompressPngPage({ params }: CompressPngPageProps) {
  return (
    <CompressPngClient locale={params.locale} />
  );
}