import { Metadata } from 'next';
import { SupportedLanguage } from '@/types/i18n';
import VideoCompressorPage from '@/components/pages/VideoCompressorPage';

// 强制动态渲染
export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface CompressVideoPageProps {
  params: {
    locale: SupportedLanguage;
  };
}

export async function generateMetadata({ params }: CompressVideoPageProps): Promise<Metadata> {
  const { locale } = params;
  
  return {
    title: 'Video Compressor - Compress Video Files Online Free',
    description: 'Compress video files online with our free video compressor. Reduce file size up to 85% while maintaining quality. Support MP4, WebM, AVI, MOV, MKV formats. Fast, secure, and completely private.',
    keywords: 'video compressor, compress video, video compression, reduce video size, MP4 compressor, online video tool, free video compression',
    openGraph: {
      title: 'Video Compressor - Compress Video Files Online Free',
      description: 'Compress video files online with our free video compressor. Reduce file size up to 85% while maintaining quality. 100% client-side processing.',
      type: 'website',
      locale: locale,
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Video Compressor - Compress Video Files Online Free',
      description: 'Compress video files online with our free video compressor. Reduce file size up to 85% while maintaining quality.',
    },
  };
}

export default function CompressVideoPage({ params }: CompressVideoPageProps) {
  return <VideoCompressorPage locale={params.locale} />;
}

