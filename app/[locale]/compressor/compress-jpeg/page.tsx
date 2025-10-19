import { Metadata } from 'next';
import { SupportedLanguage } from '@/types/i18n';
import CompressJpegClient from './CompressJpegClient';

// 强制动态渲染
export const dynamic = 'force-dynamic';
export const revalidate = 0;


interface CompressJpegPageProps {
  params: {
    locale: SupportedLanguage;
  };
}

export async function generateMetadata({ params }: CompressJpegPageProps): Promise<Metadata> {
  const { locale } = params;
  
  return {
    title: 'JPEG Compressor - Compress JPEG Images Online',
    description: 'Compress JPEG images online with our free JPEG compressor. Reduce JPEG file size while maintaining quality. Fast, secure, and easy to use.',
    keywords: 'JPEG compressor, compress JPEG, JPEG optimization, reduce JPEG size, JPEG compressor online, free JPEG compressor',
    openGraph: {
      title: 'JPEG Compressor - Compress JPEG Images Online',
      description: 'Compress JPEG images online with our free JPEG compressor. Reduce JPEG file size while maintaining quality. Fast, secure, and easy to use.',
      type: 'website',
      locale: locale,
    },
    twitter: {
      card: 'summary_large_image',
      title: 'JPEG Compressor - Compress JPEG Images Online',
      description: 'Compress JPEG images online with our free JPEG compressor. Reduce JPEG file size while maintaining quality. Fast, secure, and easy to use.',
    },
  };
}

export default function CompressJpegPage({ params }: CompressJpegPageProps) {
  return (
    <CompressJpegClient locale={params.locale} />
  );
}