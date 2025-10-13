import { Metadata } from 'next';
import UnifiedClient from '@/components/UnifiedClient';

export const metadata: Metadata = {
  title: 'BMP Compressor - Free Online Image Compression Tool',
  description: 'Compress BMP images online for free! Reduce file size while maintaining quality. Fast, secure, and completely private compression.',
  keywords: 'BMP compressor, compress BMP, image compression, free online tool, BMP optimizer'
};

export default function CompressBmpPage() {
  // 英语作为默认语言，直接渲染组件，地址栏不显示 /en 前缀
  return <UnifiedClient pageType="compressor" format="bmp" locale="en" />;
}