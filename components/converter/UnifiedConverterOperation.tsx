'use client';

import React, { useState, useCallback } from 'react';
import { Locale } from '@/lib/i18n';
import { ImageFile } from '@/types/image';
import { useModuleTranslation } from '@/hooks/useTranslationNew';
// import { convertImage } from '@/lib/image-processing/compression';

interface ConversionResult {
  originalFile: ImageFile;
  convertedFile: File;
  convertedSize: number;
  filename: string;
}

interface UnifiedConverterOperationProps {
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

export default function UnifiedConverterOperation({
  locale,
  sourceFormat,
  targetFormat,
  imageFiles,
  onFilesSelected,
  onRemoveFile,
  onConvert,
  isConverting,
  conversionProgress,
  conversionStatus,
  conversionResults,
  onDownloadResult,
  onDownloadAll,
  onReset,
  maxFiles = 10
}: UnifiedConverterOperationProps) {
  const conversionModule = `${sourceFormat}-to-${targetFormat}`;
  const { t } = useModuleTranslation(`converters/${conversionModule}`, locale);
  const [error, setError] = useState<string | null>(null);

  // 文件拖放处理
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    
    if (files.length === 0) return;

    try {
      // 检查文件数量限制
      if (files.length > maxFiles) {
        setError(t('operation.errors.maxFiles', { maxFiles }));
        return;
      }

      // 检查每个文件
      for (const file of files) {
        // 检查文件大小 (10MB)
        if (file.size > 10 * 1024 * 1024) {
          setError(t('operation.errors.fileTooLarge', { fileName: file.name }));
          return;
        }

        // 检查文件格式
        const supportedFormats = [sourceFormat];
        const fileExtension = file.name.split('.').pop()?.toLowerCase();
        if (!supportedFormats.includes(fileExtension || '')) {
          setError(t('operation.errors.unsupportedFormat', { fileName: file.name }));
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
      setError(err instanceof Error ? err.message : t('operation.errors.uploadFailed'));
    }
  }, [maxFiles, sourceFormat, t, onFilesSelected]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  return (
    <div className="space-y-6">
      {/* 文件上传区域 */}
      <div
        className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-12 text-center bg-gray-50/50 dark:bg-gray-850/50 hover:border-purple-400 dark:hover:border-purple-500 hover:bg-purple-50/50 dark:hover:bg-purple-500/5 transition-all duration-200 cursor-pointer group backdrop-blur-sm"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <div className="space-y-4">
          <div className="text-gray-400 dark:text-gray-500 group-hover:text-purple-500 dark:group-hover:text-purple-400 transition-colors">
            <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <div>
            <p className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors mb-2">
              {t('operation.upload.title')}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
              {t('operation.upload.subtitle', { 
                sourceFormat: sourceFormat.toUpperCase(), 
                targetFormat: targetFormat.toUpperCase(),
                maxFiles 
              })}
            </p>
            <div className="mt-4">
              <span className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-850 hover:bg-gray-50 dark:hover:bg-gray-800 group-hover:border-purple-400 dark:group-hover:border-purple-500 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-all">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                {t('operation.upload.selectFiles')}
              </span>
            </div>
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
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors">
              {t('operation.files.title')}
            </h3>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-500 dark:text-gray-400 transition-colors">
                {t('operation.files.count', { count: imageFiles.length })}
              </span>
              {onReset && (
                <button
                  onClick={onReset}
                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 underline transition-colors"
                >
                  {t('operation.files.reset')}
                </button>
              )}
            </div>
          </div>
          <div className="space-y-3">
            {imageFiles.map((imageFile) => (
              <div key={imageFile.id} className="flex items-center justify-between p-4 bg-white dark:bg-gray-850 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-purple-300 dark:hover:border-purple-500 hover:shadow-md dark:hover:shadow-xl transition-all duration-200 group">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="relative">
                    <img
                      src={imageFile.url}
                      alt={imageFile.name}
                      className="w-14 h-14 object-cover rounded-lg border-2 border-gray-200 dark:border-gray-700 shadow-sm"
                    />
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-purple-500 dark:bg-purple-600 text-white text-[10px] rounded-full flex items-center justify-center font-bold shadow-md">
                      {sourceFormat.toUpperCase()}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate transition-colors">
                      {imageFile.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors">
                      {t('operation.files.sizeInfo', { 
                        size: (imageFile.size / 1024 / 1024).toFixed(2) 
                      })}
                    </p>
                    <div className="flex items-center mt-1 gap-1">
                      <span className="inline-flex items-center text-xs text-purple-600 dark:text-purple-400 font-medium">
                        {sourceFormat.toUpperCase()}
                        <svg className="w-3 h-3 mx-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        {targetFormat.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => onRemoveFile(imageFile.id)}
                  className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 p-2.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-200 group-hover-button"
                  title={t('operation.files.remove')}
                >
                  <svg className="w-5 h-5 group-hover-button:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 转换按钮和高级选项 */}
      {imageFiles.length > 0 && (
        <div className="space-y-4">
          {/* 高级设置选项 */}
          <div className="bg-gray-50/80 dark:bg-gray-850/50 rounded-xl p-5 space-y-4 border border-gray-200 dark:border-gray-700 backdrop-blur-sm transition-colors">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white transition-colors flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {t('operation.settings.title')}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors">
                <label className="text-sm text-gray-700 dark:text-gray-300 transition-colors">
                  {t('operation.settings.quality')}
                </label>
                <select className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors focus:ring-2 focus:ring-purple-500">
                  <option value="90">{t('operation.settings.qualityHigh')}</option>
                  <option value="80" selected>{t('operation.settings.qualityMedium')}</option>
                  <option value="70">{t('operation.settings.qualityLow')}</option>
                </select>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors">
                <label className="text-sm text-gray-700 dark:text-gray-300 transition-colors">
                  {t('operation.settings.progressive')}
                </label>
                <input type="checkbox" className="rounded border-gray-300 dark:border-gray-600 text-purple-600 focus:ring-purple-500 dark:bg-gray-800" defaultChecked />
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors">
                <label className="text-sm text-gray-700 dark:text-gray-300 transition-colors">
                  {t('operation.settings.optimize')}
                </label>
                <input type="checkbox" className="rounded border-gray-300 dark:border-gray-600 text-purple-600 focus:ring-purple-500 dark:bg-gray-800" defaultChecked />
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors">
                <label className="text-sm text-gray-700 dark:text-gray-300 transition-colors">
                  {t('operation.settings.metadata')}
                </label>
                <input type="checkbox" className="rounded border-gray-300 dark:border-gray-600 text-purple-600 focus:ring-purple-500 dark:bg-gray-800" />
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onConvert}
              disabled={isConverting}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-600 dark:to-purple-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 dark:hover:from-blue-700 dark:hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-100 disabled:hover:shadow-lg"
            >
              {isConverting 
                ? t('operation.convert.processing', { progress: Math.round(conversionProgress) })
                : t('operation.convert.start', { 
                    sourceFormat: sourceFormat.toUpperCase(), 
                    targetFormat: targetFormat.toUpperCase() 
                  })
              }
            </button>
            {onDownloadAll && conversionResults.length > 0 && (
              <button
                onClick={onDownloadAll}
                className="bg-green-600 dark:bg-green-600 text-white py-4 px-5 rounded-xl hover:bg-green-700 dark:hover:bg-green-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 font-semibold"
              >
                {t('operation.downloadAll')}
              </button>
            )}
          </div>

          {/* 转换进度 */}
          {isConverting && (
            <div className="space-y-2">
              <div className="relative bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden shadow-inner">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all duration-500 ease-out relative overflow-hidden"
                  style={{ width: `${conversionProgress}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                </div>
              </div>
              <p className="text-sm text-center text-gray-600 dark:text-gray-400 font-medium transition-colors">
                {Math.round(conversionProgress)}% 完成
              </p>
            </div>
          )}
        </div>
      )}

      {/* 转换结果 */}
      {conversionResults.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors">
              {t('operation.results.title')}
            </h3>
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 dark:bg-green-500/20 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-500/20 transition-colors">
                {t('operation.results.count', { count: conversionResults.length })}
              </span>
            </div>
          </div>
          <div className="space-y-3">
            {conversionResults.map((result, index) => {
              const sizeChange = result.convertedSize - result.originalFile.size;
              const sizeChangePercent = (sizeChange / result.originalFile.size * 100).toFixed(1);
              const isSizeReduced = sizeChange < 0;
              
              return (
                <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50/80 to-emerald-50/80 dark:from-green-500/10 dark:to-emerald-500/10 rounded-xl border border-green-200 dark:border-green-500/20 hover:border-green-300 dark:hover:border-green-500/30 hover:shadow-md dark:hover:shadow-xl backdrop-blur-sm transition-all duration-200 group">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-white border-2 border-green-500 text-green-600 text-xs rounded-full flex items-center justify-center font-bold">
                        {targetFormat.toUpperCase()}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate transition-colors">
                        {result.filename}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <p className="text-xs text-gray-600 dark:text-gray-400 transition-colors">
                          {t('operation.results.sizeInfo', {
                            original: (result.originalFile.size / 1024 / 1024).toFixed(2),
                            converted: (result.convertedSize / 1024 / 1024).toFixed(2),
                            change: sizeChangePercent,
                            changeType: sizeChange >= 0 ? 'increase' : 'decrease'
                          })}
                        </p>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                          isSizeReduced 
                            ? 'bg-green-100 dark:bg-green-500/20 text-green-800 dark:text-green-300' 
                            : 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-800 dark:text-yellow-300'
                        } transition-colors`}>
                          {isSizeReduced ? '↓' : '↑'} {Math.abs(parseFloat(sizeChangePercent))}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => onDownloadResult(result)}
                    className="flex-shrink-0 bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-600 dark:to-emerald-600 text-white px-5 py-2.5 rounded-lg hover:from-green-700 hover:to-emerald-700 dark:hover:from-green-700 dark:hover:to-emerald-700 transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 font-medium"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>{t('operation.results.download')}</span>
                  </button>
                </div>
              );
            })}
          </div>
          
          {/* 批量下载按钮 */}
          {onDownloadAll && conversionResults.length > 1 && (
            <div className="flex justify-center pt-4">
              <button
                onClick={onDownloadAll}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="font-medium">{t('operation.downloadAll')}</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}