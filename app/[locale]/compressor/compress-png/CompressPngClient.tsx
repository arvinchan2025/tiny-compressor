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

interface CompressPngClientProps {
  locale: SupportedLanguage;
}

export default function CompressPngClient({ locale }: CompressPngClientProps) {
  const [imageFiles, setImageFiles] = useState<ImageFile[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionProgress, setCompressionProgress] = useState(0);
  const [compressionStatus, setCompressionStatus] = useState<'idle' | 'processing' | 'completed' | 'error'>('idle');
  const [compressionResults, setCompressionResults] = useState<CompressionResult[]>([]);
  const [compressionSettings, setCompressionSettings] = useState<CompressionOptions>({
    quality: 6,
    format: 'png',
    keepMetadata: false,
    pngOptions: {
      quality: 6,
      lossless: true,
      optimizationLevel: 9
    }
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
      a.download = result.compressedFile.name || result.originalFile.name.replace(/\.(png|PNG)$/, '_compressed.png');
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
      ...newSettings,
      pngOptions: prev.pngOptions ? {
        ...prev.pngOptions,
        ...newSettings.pngOptions
      } : prev.pngOptions || {
        quality: 6,
        lossless: true,
        optimizationLevel: 9
      }
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
      format="png"
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