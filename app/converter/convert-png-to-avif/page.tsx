import { Metadata } from 'next';
import UnifiedClient from '@/components/UnifiedClient';

export const metadata: Metadata = {
  title: 'PNG to AVIF Converter - Free Online Image Format Converter',
  description: 'Convert PNG to AVIF online for free! Next-generation compression with superior quality. Fast, secure, and completely private conversion.',
  keywords: 'PNG to AVIF, convert PNG, image converter, free online converter, AVIF converter'
};

export default function ConvertPngToAvifPage() {
  // 英语作为默认语言，直接渲染组件，地址栏不显示 /en 前缀
  return <UnifiedClient pageType="converter" sourceFormat="png" targetFormat="avif" locale="en" />;
}