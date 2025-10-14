'use client';

import React, { useMemo } from 'react';
import { Locale } from '@/lib/i18n';
import { ImageFile, CompressionOptions, CompressionResult } from '@/types/image';
import SingleFileCompressor from './SingleFileCompressor';
import UnifiedCompressorOperation from './UnifiedCompressorOperation';

interface SmartCompressorOperationProps {
  locale: Locale;
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

export default function SmartCompressorOperation(props: SmartCompressorOperationProps) {
  const { imageFiles, locale, format } = props;
  
  // 智能模式选择
  const mode = useMemo(() => {
    if (imageFiles.length === 0) return 'empty';
    if (imageFiles.length === 1) return 'single';
    return 'batch';
  }, [imageFiles.length]);
  
  // 单文件模式
  if (mode === 'single' || mode === 'empty') {
    return (
      <SingleFileCompressor
        locale={locale}
        format={format}
        onComplete={(result) => {
          // 可以在这里处理完成事件
          console.log('Compression complete:', result);
        }}
        onReset={() => {
          // 重置时清空文件
          props.onReset?.();
        }}
      />
    );
  }
  
  // 批量模式 - 使用现有组件
  return <UnifiedCompressorOperation {...props} />;
}



