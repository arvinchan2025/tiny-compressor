import { Metadata } from 'next';
import UnifiedClient from '@/components/UnifiedClient';

export const metadata: Metadata = {
  title: 'PNG to JPG Converter - Free Online Image Format Converter',
  description: 'Convert PNG to JPG online for free! High-quality conversion with lossy compression. Fast, secure, and completely private conversion.',
  keywords: 'PNG to JPG, convert PNG, image converter, free online converter, JPG converter'
};

export default function ConvertPngToJpgPage() {
  // 英语作为默认语言，直接渲染组件，地址栏不显示 /en 前缀
  return <UnifiedClient pageType="converter" sourceFormat="png" targetFormat="jpg" locale="en" />;
}