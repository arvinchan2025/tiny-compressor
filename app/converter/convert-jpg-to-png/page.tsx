import { Metadata } from 'next';
import UnifiedClient from '@/components/UnifiedClient';

export const metadata: Metadata = {
  title: 'JPG to PNG Converter - Free Online Image Format Converter',
  description: 'Convert JPG to PNG online for free! Add transparency and lossless quality. Fast, secure, and completely private conversion.',
  keywords: 'JPG to PNG, convert JPG, image converter, free online converter, PNG converter'
};

export default function ConvertJpgToPngPage() {
  // 英语作为默认语言，直接渲染组件，地址栏不显示 /en 前缀
  return <UnifiedClient pageType="converter" sourceFormat="jpg" targetFormat="png" locale="en" />;
}