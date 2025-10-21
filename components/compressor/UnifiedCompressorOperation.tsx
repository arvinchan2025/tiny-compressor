'use client';

import React, { useState, useCallback } from 'react';
import { Locale } from '@/lib/i18n';
import { ImageFile, CompressionOptions, CompressionResult } from '@/types/image';
import { useTranslation } from '@/hooks/useTranslation';
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
  const { t } = useTranslation(`compressors/${format}`, locale);
  const [error, setError] = useState<string | null>(null);

  // 文件拖放处理
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    
    if (files.length === 0) return;

    try {
      // 检查文件数量限�?
      if (files.length > maxFiles) {
        setError(t('errors.maxFiles', { maxFiles }));
        return;
      }

      // 检查每个文�?
      for (const file of files) {
        // 检查文件大�?(10MB)
        if (file.size > 10 * 1024 * 1024) {
          setError(t('errors.fileTooLarge', { fileName: file.name }));
          return;
        }

        // 检查文件格�?
        const supportedFormats = [format];
        const fileExtension = file.name.split('.').pop()?.toLowerCase();
        if (!supportedFormats.includes(fileExtension || '')) {
          setError(t('errors.unsupportedFormat', { fileName: file.name }));
          return;
        }
      }

      // 如果没有错误，处理文�?
      const newImageFiles = files.map(file => ({
        id: Math.random().toString(),
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file)
      }));
      
      setError(null); // 清除之前的错�?
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
        className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-12 text-center bg-gray-50/50 dark:bg-gray-850/50 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-500/5 transition-all duration-200 cursor-pointer group backdrop-blur-sm"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <div className="space-y-4">
          <div className="text-gray-400 dark:text-gray-500 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
            <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <div>
            <p className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
              {t('operation.upload.title')}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {t('operation.upload.subtitle', { format: format.toUpperCase(), maxFiles })}
            </p>
          </div>
        </div>
      </div>

      {/* 错误显示 */}
      {error && (
        <div className="bg-red-50/80 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg p-4 backdrop-blur-sm transition-colors">
          <p className="text-sm text-red-700 dark:text-red-300 font-medium">{error}</p>
        </div>
      )}

      {/* 文件列表 */}
      {imageFiles.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors">{t('operation.files.title')}</h3>
          <div className="space-y-3">
            {imageFiles.map((imageFile) => (
              <div key={imageFile.id} className="flex items-center justify-between p-4 bg-white dark:bg-gray-850 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-md dark:hover:shadow-xl transition-all duration-200 group">
                <div className="flex items-center space-x-4">
                  <img
                    src={imageFile.url}
                    alt={imageFile.name}
                    className="w-14 h-14 object-cover rounded-lg border-2 border-gray-200 dark:border-gray-700 shadow-sm"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white transition-colors">{imageFile.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors">
                      {(imageFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onRemoveFile(imageFile.id)}
                  className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 px-3 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
                >
                  {t('operation.files.remove')}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 压缩按钮 */}
      {imageFiles.length > 0 && (
        <div className="space-y-4">
          <button
            onClick={onCompress}
            disabled={isCompressing}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-600 dark:to-blue-700 text-white py-4 px-6 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-blue-800 dark:hover:from-blue-700 dark:hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-100"
          >
            {isCompressing 
              ? t('operation.compress.processing', { progress: Math.round(compressionProgress) })
              : t('operation.compress.start', { format: format.toUpperCase() })
            }
          </button>

          {/* 压缩进度 */}
          {isCompressing && (
            <div className="space-y-2">
              <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden shadow-inner">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300 relative overflow-hidden"
                  style={{ width: `${compressionProgress}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                </div>
              </div>
              <p className="text-sm text-center text-gray-600 dark:text-gray-400 font-medium">
                {Math.round(compressionProgress)}% 完成
              </p>
            </div>
          )}
        </div>
      )}

      {/* 压缩结果 */}
      {compressionResults.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors">{t('operation.results.title')}</h3>
            {onDownloadAll && compressionResults.length > 1 && (
              <button
                onClick={onDownloadAll}
                className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                下载全部
              </button>
            )}
          </div>
          <div className="space-y-3">
            {compressionResults.map((result, index) => {
              const compressionRatio = ((result.originalFile.size - result.compressedSize) / result.originalFile.size * 100).toFixed(1);
              
              return (
                <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50/80 to-emerald-50/80 dark:from-green-500/10 dark:to-emerald-500/10 border border-green-200 dark:border-green-500/20 rounded-xl backdrop-blur-sm transition-colors group">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="flex-shrink-0 w-10 h-10 bg-green-500 dark:bg-green-500/20 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate transition-colors">{result.originalFile.name}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 transition-colors">
                        {t('operation.results.sizeInfo', {
                          original: (result.originalFile.size / 1024 / 1024).toFixed(2),
                          compressed: (result.compressedSize / 1024 / 1024).toFixed(2),
                          ratio: compressionRatio
                        })}
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="inline-flex items-center px-2 py-0.5 bg-green-100 dark:bg-green-500/20 text-green-800 dark:text-green-300 text-xs font-medium rounded-full">
                          -{compressionRatio}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => onDownloadResult(result)}
                    className="flex-shrink-0 bg-green-600 dark:bg-green-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-green-700 dark:hover:bg-green-700 shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95"
                  >
                    {t('operation.results.download')}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
