import { Metadata } from 'next';
import UnifiedClient from '@/components/UnifiedClient';

export const metadata: Metadata = {
  title: 'JPEG Compressor - Free Online Image Compression Tool',
  description: 'Compress JPEG images online for free! Reduce file size while maintaining quality. Fast, secure, and completely private compression.',
  keywords: 'JPEG compressor, compress JPEG, image compression, free online tool, JPEG optimizer'
};

export default function CompressJpegPage() {
  // 英语作为默认语言，直接渲染组件，地址栏不显示 /en 前缀
  return <UnifiedClient pageType="compressor" format="jpeg" locale="en" />;
}