import { Metadata } from 'next';
import UnifiedClient from '@/components/UnifiedClient';

export const metadata: Metadata = {
  title: 'WebP to AVIF Converter - Free Online Image Format Converter',
  description: 'Convert WebP to AVIF online for free! Next-generation compression with superior quality. Fast, secure, and completely private conversion.',
  keywords: 'WebP to AVIF, convert WebP, image converter, free online converter, AVIF converter'
};

export default function ConvertWebpToAvifPage() {
  // 英语作为默认语言，直接渲染组件，地址栏不显示 /en 前缀
  return <UnifiedClient pageType="converter" sourceFormat="webp" targetFormat="avif" locale="en" />;
}