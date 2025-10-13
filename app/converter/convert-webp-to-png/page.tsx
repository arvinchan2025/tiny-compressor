import { Metadata } from 'next';
import UnifiedClient from '@/components/UnifiedClient';

export const metadata: Metadata = {
  title: 'WebP to PNG Converter - Free Online Image Format Converter',
  description: 'Convert WebP to PNG online for free! Add transparency and lossless quality. Fast, secure, and completely private conversion.',
  keywords: 'WebP to PNG, convert WebP, image converter, free online converter, PNG converter'
};

export default function ConvertWebpToPngPage() {
  // 英语作为默认语言，直接渲染组件，地址栏不显示 /en 前缀
  return <UnifiedClient pageType="converter" sourceFormat="webp" targetFormat="png" locale="en" />;
}