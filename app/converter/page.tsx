import { Metadata } from 'next';
import UnifiedClient from '@/components/UnifiedClient';

export const metadata: Metadata = {
  title: "Image Converter - Free Online Format Converter | TinyCompressor",
  description: "Convert images between JPG, PNG, WebP, AVIF, GIF, HEIC formats instantly. High-quality format conversion with batch processing. Free online image converter tool. No registration required.",
  keywords: "image converter, convert images, JPG to PNG, PNG to JPG, WebP converter, AVIF converter, GIF converter, HEIC converter, image format converter, online image converter, free image converter tool, batch image conversion"
};

export default function ConverterPage() {
  // 英语作为默认语言，直接渲染组件，地址栏不显示 /en 前缀
  return <UnifiedClient pageType="navigation" sourceFormat="converter" locale="en" />;
}
