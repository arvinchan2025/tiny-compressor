import { Metadata } from 'next';
import UnifiedClient from '@/components/UnifiedClient';

export const metadata: Metadata = {
  title: 'WebP Compressor - Free Online Image Compression Tool',
  description: 'Compress WebP images online for free! Reduce file size while maintaining quality. Fast, secure, and completely private compression.',
  keywords: 'WebP compressor, compress WebP, image compression, free online tool, WebP optimizer'
};

export default function CompressWebpPage() {
  // 英语作为默认语言，直接渲染组件，地址栏不显示 /en 前缀
  return <UnifiedClient pageType="compressor" format="webp" locale="en" />;
}