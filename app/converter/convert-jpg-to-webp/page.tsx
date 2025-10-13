import { Metadata } from 'next';
import UnifiedClient from '@/components/UnifiedClient';

export const metadata: Metadata = {
  title: 'JPG to WebP Converter - Free Online Image Format Converter',
  description: 'Convert JPG to WebP online for free! Superior compression and modern web optimization. Fast, secure, and completely private conversion.',
  keywords: 'JPG to WebP, convert JPG, image converter, free online converter, WebP converter'
};

export default function ConvertJpgToWebpPage() {
  // 英语作为默认语言，直接渲染组件，地址栏不显示 /en 前缀
  return <UnifiedClient pageType="converter" sourceFormat="jpg" targetFormat="webp" locale="en" />;
}