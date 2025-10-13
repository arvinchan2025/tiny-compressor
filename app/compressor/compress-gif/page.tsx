import { Metadata } from 'next';
import UnifiedClient from '@/components/UnifiedClient';

export const metadata: Metadata = {
  title: 'GIF Compressor - Free Online Image Compression Tool',
  description: 'Compress GIF images online for free! Reduce file size while maintaining quality. Fast, secure, and completely private compression.',
  keywords: 'GIF compressor, compress GIF, image compression, free online tool, GIF optimizer'
};

export default function CompressGifPage() {
  // 英语作为默认语言，直接渲染组件，地址栏不显示 /en 前缀
  return <UnifiedClient pageType="compressor" format="gif" locale="en" />;
}