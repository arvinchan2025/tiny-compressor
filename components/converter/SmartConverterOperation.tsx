'use client';

import React, { useMemo } from 'react';
import { Locale } from '@/lib/i18n';
import { ImageFile, ConversionResult } from '@/types/image';
import SingleFileConverter from './SingleFileConverter';
import UnifiedConverterOperation from './UnifiedConverterOperation';

interface SmartConverterOperationProps {
  locale: Locale;
  sourceFormat: string;
  targetFormat: string;
  imageFiles: ImageFile[];
  onFilesSelected: (files: ImageFile[]) => void;
  onRemoveFile: (fileId: string) => void;
  onConvert: () => void;
  isConverting: boolean;
  conversionProgress: number;
  conversionStatus: 'idle' | 'processing' | 'completed' | 'error';
  conversionResults: ConversionResult[];
  onDownloadResult: (result: ConversionResult) => void;
  onDownloadAll?: () => void;
  onReset?: () => void;
  maxFiles: number;
}

export default function SmartConverterOperation(props: SmartConverterOperationProps) {
  const { imageFiles, locale, sourceFormat, targetFormat } = props;
  
  // 智能模式选择
  const mode = useMemo(() => {
    if (imageFiles.length === 0) return 'empty';
    if (imageFiles.length === 1) return 'single';
    return 'batch';
  }, [imageFiles.length]);
  
  // 单文件模式
  if (mode === 'single' || mode === 'empty') {
    return (
      <SingleFileConverter
        locale={locale}
        sourceFormat={sourceFormat}
        targetFormat={targetFormat}
        onComplete={(result) => {
          console.log('Conversion complete:', result);
        }}
        onReset={() => {
          props.onReset?.();
        }}
      />
    );
  }
  
  // 批量模式 - 使用现有组件
  return <UnifiedConverterOperation {...props} />;
}



