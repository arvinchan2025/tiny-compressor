'use client';

import React from 'react';
import { Locale } from '@/lib/i18n';
import { ImageFile } from '@/types/image';
import CompressorPage from './CompressorPage';
import ConverterPage from './ConverterPage';
import UnifiedNavigation from '../navigation/UnifiedNavigation';

interface UnifiedPageFactoryProps {
  locale: Locale;
  pageType: 'compressor' | 'converter' | 'navigation';
  format: string;
  sourceFormat: string;
  targetFormat: string;
  
  // 操作相关 props (仅在非导航页面使用)
  imageFiles: ImageFile[];
  onFilesSelected: (files: ImageFile[]) => void;
  onRemoveFile: (fileId: string) => void;
  onCompress: () => void;
  onConvert: () => void;
  isCompressing: boolean;
  isConverting: boolean;
  compressionProgress: number;
  conversionProgress: number;
  compressionStatus: 'idle' | 'processing' | 'completed' | 'error';
  conversionStatus: 'idle' | 'processing' | 'completed' | 'error';
  compressionResults: {
    originalFile: ImageFile;
    compressedFile: File;
    compressedSize: number;
  }[];
  conversionResults: {
    originalFile: ImageFile;
    convertedFile: File;
    convertedSize: number;
  }[];
  onDownloadResult: (result: any) => void;
  onDownloadAll?: () => void;
  onReset?: () => void;
  maxFiles: number;
}

export default function UnifiedPageFactory(props: UnifiedPageFactoryProps) {
  const { pageType } = props;

  // 导航页面
  if (pageType === 'navigation') {
    return (
      <UnifiedNavigation 
        locale={props.locale} 
        pageType={props.sourceFormat === 'compressor' ? 'compressor' : 'converter'}
      />
    );
  }

  // 压缩器页面
  if (pageType === 'compressor' && props.format) {
    return (
      <CompressorPage
        locale={props.locale}
        format={props.format as any}
        imageFiles={props.imageFiles || []}
        onFilesSelected={props.onFilesSelected || (() => {})}
        onRemoveFile={props.onRemoveFile || (() => {})}
        onCompress={props.onCompress || (() => {})}
        isCompressing={props.isCompressing || false}
        compressionProgress={props.compressionProgress || 0}
        compressionStatus={props.compressionStatus || 'idle'}
        compressionResults={props.compressionResults || []}
        onDownloadResult={props.onDownloadResult || (() => {})}
        onDownloadAll={props.onDownloadAll}
        onReset={props.onReset}
        maxFiles={props.maxFiles || 10}
      />
    );
  }

  // 转换器页面
  if (pageType === 'converter' && props.sourceFormat && props.targetFormat) {
    return (
      <ConverterPage
        locale={props.locale}
        sourceFormat={props.sourceFormat}
        targetFormat={props.targetFormat}
        maxFiles={props.maxFiles || 10}
      />
    );
  }

  // 默认情况：显示导航页面
  return (
    <UnifiedNavigation 
      locale={props.locale} 
      pageType={props.sourceFormat === 'compressor' ? 'compressor' : 'converter'}
    />
  );
}