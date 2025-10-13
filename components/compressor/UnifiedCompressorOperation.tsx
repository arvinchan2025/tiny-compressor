'use client';

import React, { useState, useCallback } from 'react';
import { Locale } from '@/lib/i18n';
import { ImageFile, CompressionOptions, CompressionResult } from '@/types/image';
import { useModuleTranslation } from '@/hooks/useTranslationNew';
import UnifiedFileManager from '@/components/ui/UnifiedFileManager';

interface UnifiedCompressorOperationProps {
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

export default function UnifiedCompressorOperation({
  locale,
  format,
  imageFiles,
  onFilesSelected,
  onRemoveFile,
  onCompress,
  isCompressing,
  compressionProgress,
  compressionStatus,
  compressionResults,
  onDownloadResult,
  onDownloadAll,
  onSettingsChange,
  onReset,
  compressionSettings,
  maxFiles = 10
}: UnifiedCompressorOperationProps) {
  const { t } = useModuleTranslation(`compressors/${format}`, locale);
  const [error, setError] = useState<string | null>(null);

  // 文件拖放处理
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    
    if (files.length === 0) return;

    try {
      // 检查文件数量限制
      if (files.length > maxFiles) {
        setError(t('errors.maxFiles', { maxFiles }));
        return;
      }

      // 检查每个文件
      for (const file of files) {
        // 检查文件大小 (10MB)
        if (file.size > 10 * 1024 * 1024) {
          setError(t('errors.fileTooLarge', { fileName: file.name }));
          return;
        }

        // 检查文件格式
        const supportedFormats = [format];
        const fileExtension = file.name.split('.').pop()?.toLowerCase();
        if (!supportedFormats.includes(fileExtension || '')) {
          setError(t('errors.unsupportedFormat', { fileName: file.name }));
          return;
        }
      }

      // 如果没有错误，处理文件
      const newImageFiles = files.map(file => ({
        id: Math.random().toString(),
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file)
      }));
      
      setError(null); // 清除之前的错误
      onFilesSelected(newImageFiles);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errors.uploadFailed'));
    }
  }, [maxFiles, format, t, onFilesSelected]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  return (
    <div className="space-y-6">
      {/* 文件上传区域 */}
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <div className="space-y-4">
          <div className="text-gray-500">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <div>
            <p className="text-lg font-medium text-gray-900">
              {t('operation.upload.title')}
            </p>
            <p className="text-sm text-gray-500">
              {t('operation.upload.subtitle', { format: format.toUpperCase(), maxFiles })}
            </p>
          </div>
        </div>
      </div>

      {/* 错误显示 */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* 文件列表 */}
      {imageFiles.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-medium">{t('operation.files.title')}</h3>
          {imageFiles.map((imageFile) => (
            <div key={imageFile.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <img
                  src={imageFile.url}
                  alt={imageFile.name}
                  className="w-12 h-12 object-cover rounded"
                />
                <div>
                  <p className="text-sm font-medium">{imageFile.name}</p>
                  <p className="text-xs text-gray-500">
                    {(imageFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                onClick={() => onRemoveFile(imageFile.id)}
                className="text-red-500 hover:text-red-700"
              >
                {t('operation.files.remove')}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 压缩按钮 */}
      {imageFiles.length > 0 && (
        <div className="space-y-4">
          <button
            onClick={onCompress}
            disabled={isCompressing}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCompressing 
              ? t('operation.compress.processing', { progress: Math.round(compressionProgress) })
              : t('operation.compress.start', { format: format.toUpperCase() })
            }
          </button>

          {/* 压缩进度 */}
          {isCompressing && (
            <div className="space-y-2">
              <div className="bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${compressionProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* 压缩结果 */}
      {compressionResults.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-medium">{t('operation.results.title')}</h3>
          {compressionResults.map((result, index) => {
            const compressionRatio = ((result.originalFile.size - result.compressedSize) / result.originalFile.size * 100).toFixed(1);
            
            return (
              <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="text-green-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{result.originalFile.name}</p>
                    <p className="text-xs text-gray-500">
                      {t('operation.results.sizeInfo', {
                        original: (result.originalFile.size / 1024 / 1024).toFixed(2),
                        compressed: (result.compressedSize / 1024 / 1024).toFixed(2),
                        ratio: compressionRatio
                      })}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onDownloadResult(result)}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  {t('operation.results.download')}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}