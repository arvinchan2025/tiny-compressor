import { Metadata } from 'next';
import UnifiedClient from '@/components/UnifiedClient';

export const metadata: Metadata = {
  title: 'HEIC to JPG Converter - Free Online Image Format Converter',
  description: 'Convert HEIC to JPG online for free! Convert iPhone photos to universal JPG format. Fast, secure, and completely private conversion.',
  keywords: 'HEIC to JPG, convert HEIC, image converter, free online converter, JPG converter'
};

export default function ConvertHeicToJpgPage() {
  // 英语作为默认语言，直接渲染组件，地址栏不显示 /en 前缀
  return <UnifiedClient pageType="converter" sourceFormat="heic" targetFormat="jpg" locale="en" />;
}