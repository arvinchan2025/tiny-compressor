import { Metadata } from 'next';
import UnifiedClient from '@/components/UnifiedClient';

export const metadata: Metadata = {
  title: 'WebP to JPG Converter - Free Online Image Format Converter',
  description: 'Convert WebP to JPG online for free! High-quality conversion with lossy compression. Fast, secure, and completely private conversion.',
  keywords: 'WebP to JPG, convert WebP, image converter, free online converter, JPG converter'
};

export default function ConvertWebpToJpgPage() {
  // 英语作为默认语言，直接渲染组件，地址栏不显示 /en 前缀
  return <UnifiedClient pageType="converter" sourceFormat="webp" targetFormat="jpg" locale="en" />;
}