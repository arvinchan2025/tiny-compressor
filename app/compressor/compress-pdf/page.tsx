import { Metadata } from 'next';
import PdfCompressorPage from '@/components/pages/PdfCompressorPage';

export const metadata: Metadata = {
  title: 'PDF Compressor - Free Online PDF Compression Tool',
  description: 'Compress PDF files online for free! Reduce file size while maintaining quality. Fast, secure, and completely private compression.',
  keywords: 'PDF compressor, compress PDF, PDF compression, free online tool, PDF optimizer, reduce PDF size'
};

export default function CompressPdfPage() {
  return <PdfCompressorPage locale="en" />;
}


