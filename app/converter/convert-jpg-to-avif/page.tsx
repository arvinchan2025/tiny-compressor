import { Metadata } from 'next';
import UnifiedClient from '@/components/UnifiedClient';

export const metadata: Metadata = {
  title: 'JPG to AVIF Converter - Free Online Image Format Converter',
  description: 'Convert JPG to AVIF online for free! Next-generation compression with superior quality. Fast, secure, and completely private conversion.',
  keywords: 'JPG to AVIF, convert JPG, image converter, free online converter, AVIF converter'
};

export default function ConvertJpgToAvifPage() {
  // 英语作为默认语言，直接渲染组件，地址栏不显示 /en 前缀
  return <UnifiedClient pageType="converter" sourceFormat="jpg" targetFormat="avif" locale="en" />;
}