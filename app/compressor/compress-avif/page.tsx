import { Metadata } from 'next';
import UnifiedClient from '@/components/UnifiedClient';

// 强制动态渲染以避免预渲染错误
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'AVIF Compressor - Free Online Image Compression Tool',
  description: 'Compress AVIF images online for free! Reduce file size while maintaining quality. Fast, secure, and completely private compression.',
  keywords: 'AVIF compressor, compress AVIF, image compression, free online tool, AVIF optimizer'
};

export default function CompressAvifPage() {
  // 英语作为默认语言，直接渲染组件，地址栏不显示 /en 前缀
  return <UnifiedClient pageType="compressor" format="avif" locale="en" />;
}