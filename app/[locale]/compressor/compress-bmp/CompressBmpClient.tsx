'use client';

import React, { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { SupportedLanguage } from '@/types/i18n';
import { ImageFile, CompressionOptions, CompressionResult } from '@/types/image';
import ModernCompressorPage from '@/components/pages/ModernCompressorPage';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

// 懒加载压缩管理器
const UnifiedCompressionManager = dynamic(
  () => import('@/components/compressor/components/UnifiedCompressionManager'),
  {
    loading: () => (
      <div className="card-glass p-8">
        <LoadingSpinner />
      </div>
    ),
    ssr: false
  }
);

interface CompressBmpClientProps {
  locale: SupportedLanguage;
}

export default function CompressBmpClient({ locale }: CompressBmpClientProps) {
  const [imageFiles, setImageFiles] = useState<ImageFile[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionProgress, setCompressionProgress] = useState(0);
  const [compressionStatus, setCompressionStatus] = useState<'idle' | 'processing' | 'completed' | 'error'>('idle');
  const [compressionResults, setCompressionResults] = useState<CompressionResult[]>([]);
  const [compressionSettings, setCompressionSettings] = useState<CompressionOptions>({
    quality: 85,
    format: 'bmp',
    keepMetadata: false
  });

  const handleFilesSelected = useCallback((files: ImageFile[]) => {
    setImageFiles(files);
    setCompressionStatus('idle');
    setCompressionResults([]);
  }, []);

  const handleRemoveFile = useCallback((fileId: string) => {
    setImageFiles(prev => prev.filter(file => file.id !== fileId));
    setCompressionResults(prev => prev.filter(result => result.originalFile.id !== fileId));
  }, []);

  const handleCompress = useCallback(() => {
    // 这个函数现在由 UnifiedCompressionManager 处理
  }, []);

  const handleDownloadResult = useCallback((result: CompressionResult) => {
    try {
      // 使用压缩后的文件数据（Blob）
      const url = URL.createObjectURL(result.compressedFile.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = result.compressedFile.name || result.originalFile.name.replace(/\.(bmp|BMP)$/, '_compressed.bmp');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  }, []);

  const handleDownloadAll = useCallback(() => {
    compressionResults.forEach(result => {
      setTimeout(() => handleDownloadResult(result), 100);
    });
  }, [compressionResults, handleDownloadResult]);

  const handleSettingsChange = useCallback((newSettings: Partial<CompressionOptions>) => {
    setCompressionSettings(prev => ({
      ...prev,
      ...newSettings
    }));
  }, []);

  const handleReset = useCallback(() => {
    setImageFiles([]);
    setCompressionResults([]);
    setCompressionStatus('idle');
    setCompressionProgress(0);
    setIsCompressing(false);
  }, []);

  const handleCompressionComplete = useCallback((results: CompressionResult[]) => {
    setCompressionResults(results);
    setCompressionStatus('completed');
  }, []);

  const handleError = useCallback((error: string) => {
    setCompressionStatus('error');
    console.error('Compression error:', error);
  }, []);

  return (
    <ModernCompressorPage
      locale={locale}
      format="bmp"
      imageFiles={imageFiles}
      onFilesSelected={handleFilesSelected}
      onRemoveFile={handleRemoveFile}
      onCompress={handleCompress}
      isCompressing={isCompressing}
      compressionProgress={compressionProgress}
      compressionStatus={compressionStatus}
      compressionResults={compressionResults}
      onDownloadResult={handleDownloadResult}
      onDownloadAll={handleDownloadAll}
      onSettingsChange={handleSettingsChange}
      onReset={handleReset}
      compressionSettings={compressionSettings}
      maxFiles={10}
    />
  );
}


