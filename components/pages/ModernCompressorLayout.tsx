/**
 * ModernCompressorPage - 现代化压缩器页面组件
 *
 * 这是一个完整的、现代化的压缩器页面组件
 * 支持所有图像格式的压缩，具有统一的现代化设计
 * 使用增强的翻译系统，支持懒加载和多语言
 */

// 'use client';

import React from 'react';
import {CompressionOptions, CompressionResult, ImageFile} from '@/types/image';
import {CompressorOperationSection} from "components/pages/sections";
import ModernPageLayout, {getPageStaticProps} from "@/components/pages/ModernPageLayout";

// 懒加载压缩管理器组件 - LCP优化版本
const category = 'compressors'
export async function getCompressorStaticProps({params, format}: any) {
  return await getPageStaticProps({
    params,
    category,
    format,
    pathname: `/compressor/compress-${format}`
  })
}

interface ModernCompressorPageProps {
  locale: string;
  format: string;
  imageFiles: ImageFile[];
  onFilesSelected: (files: ImageFile[]) => void;
  onRemoveFile: (fileId: string) => void;
  onCompress: () => void;
  isCompressing: boolean;
  compressionProgress: number;
  compressionStatus: 'idle' | 'processing' | 'completed' | 'error';
  compressionResults: CompressionResult[];
  onDownloadResult: (result: CompressionResult) => void;
  onDownloadAll?: () => void;
  onSettingsChange?: (settings: Partial<CompressionOptions>) => void;
  onReset?: () => void;
  compressionSettings?: CompressionOptions;
  maxFiles: number;
}

export default async function ModernCompressorLayout(props: any) {
  return (
    <ModernPageLayout
      category={'compressors'}
      operation={CompressorOperationSection}
      {...props}
    />
  );
}