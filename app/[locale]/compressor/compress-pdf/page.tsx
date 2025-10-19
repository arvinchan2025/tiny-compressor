import { Metadata } from 'next';
import { SupportedLanguage } from '@/types/i18n';
import PdfCompressorPage from '@/components/pages/PdfCompressorPage';

// 强制动态渲染
export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface CompressPdfPageProps {
  params: {
    locale: SupportedLanguage;
  };
}

export async function generateMetadata({ params }: CompressPdfPageProps): Promise<Metadata> {
  const { locale } = params;
  
  return {
    title: 'PDF Compressor - Compress PDF Files Online Free',
    description: 'Compress PDF files online with our free PDF compressor. Reduce PDF file size while maintaining quality. Fast, secure, and completely private compression.',
    keywords: 'PDF compressor, compress PDF, PDF compression, free online tool, PDF optimizer, reduce PDF size',
    openGraph: {
      title: 'PDF Compressor - Compress PDF Files Online Free',
      description: 'Compress PDF files online with our free PDF compressor. Reduce PDF file size while maintaining quality. Fast, secure, and completely private compression.',
      type: 'website',
      locale: locale,
    },
    twitter: {
      card: 'summary_large_image',
      title: 'PDF Compressor - Compress PDF Files Online Free',
      description: 'Compress PDF files online with our free PDF compressor. Reduce PDF file size while maintaining quality. Fast, secure, and completely private compression.',
    },
  };
}

export default function CompressPdfPage({ params }: CompressPdfPageProps) {
  return <PdfCompressorPage locale={params.locale} />;
}

