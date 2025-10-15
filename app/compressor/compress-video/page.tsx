import { Metadata } from 'next';
import VideoCompressorPage from '@/components/pages/VideoCompressorPage';

export const metadata: Metadata = {
  title: 'Video Compressor - Free Online Video Compression Tool',
  description: 'Compress video files online for free! Reduce file size up to 85% while maintaining quality. Support MP4, WebM, AVI, MOV, MKV formats. Fast, secure, and completely private compression.',
  keywords: 'video compressor, compress video, video compression, reduce video size, MP4 compressor, video optimizer, online video tool, free video compression',
};

export default function CompressVideoPage() {
  return <VideoCompressorPage locale="en" />;
}

