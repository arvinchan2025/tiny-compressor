'use client';

import React, { useState, useCallback } from 'react';
import { SupportedLanguage } from '@/types/i18n';
import { ImageFile } from '@/types/image';
import UnifiedPageFactory from './pages/UnifiedPageFactory';
import { compressImage, convertImage } from '@/lib/image-processing/compression';

interface UnifiedClientProps {
  locale: SupportedLanguage;
  pageType: 'compressor' | 'converter' | 'navigation';
  format?: string;
  sourceFormat?: string;
  targetFormat?: string;
}

export default function UnifiedClient({
  locale,
  pageType,
  format = '',
  sourceFormat = '',
  targetFormat = ''
}: UnifiedClientProps) {
  const [imageFiles, setImageFiles] = useState<ImageFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingStatus, setProcessingStatus] = useState<'idle' | 'processing' | 'completed' | 'error'>('idle');
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  // 文件选择处理
  const handleFilesSelected = useCallback((files: ImageFile[]) => {
    setImageFiles(files);
    setError(null);
  }, []);

  // 文件移除处理
  const handleRemoveFile = useCallback((fileId: string) => {
    setImageFiles(prev => prev.filter(file => file.id !== fileId));
  }, []);

  // 压缩处理
  const handleCompress = useCallback(async () => {
    if (!format || imageFiles.length === 0) return;

    setIsProcessing(true);
    setProcessingStatus('processing');
    setProcessingProgress(0);
    setError(null);

    try {
      const compressionResults = [];
      const totalFiles = imageFiles.length;

      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
        setProcessingProgress((i / totalFiles) * 100);

        const result = await compressImage(file, format, {
          quality: 80,
          preserveMetadata: false,
          optimizeForWeb: true
        });

        compressionResults.push(result);
      }

      setResults(compressionResults);
      setProcessingStatus('completed');
    } catch (err) {
      setError(err instanceof Error ? err.message : '压缩失败');
      setProcessingStatus('error');
    } finally {
      setIsProcessing(false);
    }
  }, [format, imageFiles]);

  // 转换处理
  const handleConvert = useCallback(async () => {
    if (!sourceFormat || !targetFormat || imageFiles.length === 0) return;

    setIsProcessing(true);
    setProcessingStatus('processing');
    setProcessingProgress(0);
    setError(null);

    try {
      const conversionResults = [];
      const totalFiles = imageFiles.length;

      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
        setProcessingProgress((i / totalFiles) * 100);

        const result = await convertImage(file, sourceFormat, targetFormat, {
          quality: 80,
          preserveMetadata: false,
          optimizeForWeb: true
        });

        conversionResults.push(result);
      }

      setResults(conversionResults);
      setProcessingStatus('completed');
    } catch (err) {
      setError(err instanceof Error ? err.message : '转换失败');
      setProcessingStatus('error');
    } finally {
      setIsProcessing(false);
    }
  }, [sourceFormat, targetFormat, imageFiles]);

  // 下载处理
  const handleDownload = useCallback((result: any) => {
    const url = URL.createObjectURL(result.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = result.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  // 批量下载处理
  const handleDownloadAll = useCallback(() => {
    results.forEach(result => {
      handleDownload(result);
      // 添加小延迟避免浏览器阻止多个下载
      setTimeout(() => {}, 100);
    });
  }, [results, handleDownload]);

  // 重置处理
  const handleReset = useCallback(() => {
    setImageFiles([]);
    setResults([]);
    setProcessingStatus('idle');
    setProcessingProgress(0);
    setError(null);
  }, []);

  // 错误处理
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <h2 className="text-lg font-semibold text-red-800 mb-2">处理失败</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => setError(null)}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            重试
          </button>
        </div>
      </div>
    );
  }

  return (
    <UnifiedPageFactory
      locale={locale}
      pageType={pageType}
      format={format}
      sourceFormat={sourceFormat}
      targetFormat={targetFormat}
      imageFiles={imageFiles}
      onFilesSelected={handleFilesSelected}
      onRemoveFile={handleRemoveFile}
      onCompress={handleCompress}
      onConvert={handleConvert}
      isCompressing={isProcessing && pageType === 'compressor'}
      isConverting={isProcessing && pageType === 'converter'}
      compressionProgress={processingProgress}
      conversionProgress={processingProgress}
      compressionStatus={processingStatus}
      conversionStatus={processingStatus}
      compressionResults={results}
      conversionResults={results}
      onDownloadResult={handleDownload}
      onDownloadAll={handleDownloadAll}
      onReset={handleReset}
      maxFiles={10}
    />
  );
}