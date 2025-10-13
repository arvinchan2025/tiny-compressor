'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ImageFile } from '@/types/image';
import { formatFileSize } from '@/lib/utils';
import { useFeatureAccess } from '@/hooks/useFeatureAccess';
import StandardButton from '@/components/ui/StandardButton';
import StandardCard from '@/components/ui/StandardCard';
import StandardContainer from '@/components/ui/StandardContainer';
import FileUploader from '@/components/core/FileUploader';
import SmartOperationPanel from '@/components/processing/SmartOperationPanel';
import { useTranslation } from '@/hooks/useTranslation';
import { transitions, commonVariants } from '@/lib/micro-interactions';

interface SimplifiedOperationPanelProps {
  locale: string;
  pageType: 'compressor' | 'converter';
  format: string;
  sourceFormat: string;
  targetFormat: string;
  imageFiles: ImageFile[];
  onFilesSelected: (files: ImageFile[]) => void;
  onRemoveFile: (fileId: string) => void;
  onProcess: () => void;
  maxFiles: number;
  isProcessing: boolean;
  processingProgress: number;
  processingStatus: 'idle' | 'processing' | 'completed' | 'error';
  processingResults: any[];
  onDownloadResult: (result: any) => void;
  }
export default function SimplifiedOperationPanel({
  locale,
  pageType,
  format,
  sourceFormat,
  targetFormat,
  imageFiles,
  onFilesSelected,
  onRemoveFile,
  onProcess,
  maxFiles,
  isProcessing = false,
  processingProgress = 0,
  processingStatus = 'idle',
  processingResults = [],
  onDownloadResult
}: SimplifiedOperationPanelProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [compressionQuality, setCompressionQuality] = useState<'high' | 'medium' | 'low'>('medium');
  const { canUse } = useFeatureAccess();
  
  // 根据页面类型和格式确定翻译模块
  const translationModule = format ? `compressors/${format}` : (pageType === 'compressor' ? 'compressor' : 'converter');
  const { t } = useTranslation(translationModule);

  const config = useMemo(() => {
    if (pageType === 'compressor') {
      return {
        title: t('operation.title', 'PNG Compression Tool'),
        description: t('operation.description', 'Upload your PNG images and compress them with lossless optimization'),
        icon: '',
        color: 'blue',
        buttonText: t('operation.results.download', 'Compress Images'),
        processingText: t('operation.processing.starting', 'Compressing...')
      };
    } else {
      return {
        title: t('operation.title', 'Format Conversion'),
        description: t('operation.description', 'Convert between different image formats'),
        icon: '',
        color: 'green',
        buttonText: t('operation.results.download', 'Convert Images'),
        processingText: t('operation.processing.starting', 'Converting...')
      };
    }
  }, [pageType, t]);

  // Fixed comment
  const handleFilesRemoved = (fileIds: string[]) => {
    fileIds.forEach(fileId => onRemoveFile(fileId));
  };

  // Fixed comment
  const handleDownloadResults = (results: any[]) => {
    results.forEach(result => onDownloadResult(result));
  };

  return (
    <StandardContainer variant="content" size="lg">
      <SmartOperationPanel
        locale={locale}
        pageType={pageType}
        format={format || 'jpg'}
        sourceFormat={sourceFormat || 'jpg'}
        targetFormat={targetFormat || 'png'}
        onFilesSelected={onFilesSelected}
        onFilesRemoved={handleFilesRemoved}
        onProcess={onProcess}
        isProcessing={isProcessing}
        processingProgress={processingProgress}
        processingStatus={processingStatus}
        processingResults={processingResults}
        onDownloadResults={handleDownloadResults}
        translations={{
          title: config.title,
          description: config.description,
          buttonText: config.buttonText,
          processingText: config.processingText
        }}
      />
    </StandardContainer>
  );
  }