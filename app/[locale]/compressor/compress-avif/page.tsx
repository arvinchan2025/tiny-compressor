import { Metadata } from 'next';
import { SupportedLanguage } from '@/types/i18n';
import CompressAvifClient from './CompressAvifClient';

interface CompressAvifPageProps {
  params: {
    locale: SupportedLanguage;
  };
}

export async function generateMetadata({ params }: CompressAvifPageProps): Promise<Metadata> {
  const { locale } = params;
  
  return {
    title: 'AVIF Compressor - Compress AVIF Images Online',
    description: 'Compress AVIF images online with our free AVIF compressor. Next-generation compression technology with superior quality. Fast, secure, and easy to use.',
    keywords: 'AVIF compressor, compress AVIF, AVIF optimization, reduce AVIF size, AVIF compressor online, free AVIF compressor',
    openGraph: {
      title: 'AVIF Compressor - Compress AVIF Images Online',
      description: 'Compress AVIF images online with our free AVIF compressor. Next-generation compression technology with superior quality. Fast, secure, and easy to use.',
      type: 'website',
      locale: locale,
    },
    twitter: {
      card: 'summary_large_image',
      title: 'AVIF Compressor - Compress AVIF Images Online',
      description: 'Compress AVIF images online with our free AVIF compressor. Next-generation compression technology with superior quality. Fast, secure, and easy to use.',
    },
  };
}

export default function CompressAvifPage({ params }: CompressAvifPageProps) {
  return (
    <CompressAvifClient locale={params.locale} />
  );
}