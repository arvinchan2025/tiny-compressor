import { Metadata } from 'next';
import { SupportedLanguage } from '@/types/i18n';
import AvifCompressorNew from './AvifCompressorNew';

interface CompressAvifPageProps {
  params: {
    locale: SupportedLanguage;
  };
}

export async function generateMetadata({ params }: CompressAvifPageProps): Promise<Metadata> {
  const { locale } = params;
  
  return {
    title: 'AVIF Compressor - Compress AVIF Images Online',
    description: 'Free online AVIF image compressor. Reduce AVIF file size while maintaining quality. No registration required.',
    keywords: 'AVIF compressor, compress AVIF, reduce AVIF size, AVIF optimization',
    openGraph: {
      title: 'AVIF Compressor - Compress AVIF Images Online',
      description: 'Free online AVIF image compressor. Reduce AVIF file size while maintaining quality.',
      type: 'website',
    },
  };
}

export default function CompressAvifPage({ params }: CompressAvifPageProps) {
  const { locale } = params;
  
  return <AvifCompressorNew locale={locale} />;
}
