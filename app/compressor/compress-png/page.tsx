import { Metadata } from 'next';
import UnifiedClient from '@/components/UnifiedClient';

export const metadata: Metadata = {
  title: 'PNG Compressor - Free Online Image Compression Tool',
  description: 'Compress PNG images online for free! Reduce file size while maintaining quality. Fast, secure, and completely private compression.',
  keywords: 'PNG compressor, compress PNG, image compression, free online tool, PNG optimizer'
};

export default function CompressPngPage() {
  // 英语作为默认语言，直接渲染组件，地址栏不显示 /en 前缀
  return <UnifiedClient pageType="compressor" format="png" locale="en" />;
}