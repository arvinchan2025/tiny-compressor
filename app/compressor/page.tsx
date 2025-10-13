import { Metadata } from 'next';
import UnifiedClient from '@/components/UnifiedClient';

export const metadata: Metadata = {
  title: "Image Compressor - Free Online Compression Tool | TinyCompressor",
  description: "Compress images online for free! Reduce JPG, PNG, WebP, AVIF, GIF file sizes by up to 90% while maintaining quality. Smart compression with batch processing. No registration required.",
  keywords: "image compressor, compress images, reduce file size, JPG compression, PNG compression, WebP compression, AVIF compression, GIF compression, batch compression, online image optimizer, free image compression tool"
};

export default function CompressorPage() {
  // 英语作为默认语言，直接渲染组件，地址栏不显示 /en 前缀
  return <UnifiedClient pageType="navigation" sourceFormat="compressor" locale="en" />;
}
