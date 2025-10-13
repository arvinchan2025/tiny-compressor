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
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 cursor-pointer group"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <div className="space-y-4">
          <div className="text-gray-500 group-hover:text-blue-500 transition-colors">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <div>
            <p className="text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
              {t('operation.upload.title')}
            </p>
            <p className="text-sm text-gray-500 group-hover:text-blue-500 transition-colors">
              {t('operation.upload.subtitle', { 
                sourceFormat: sourceFormat.toUpperCase(), 
                targetFormat: targetFormat.toUpperCase(),
                maxFiles 
              })}
            </p>
            <div className="mt-3">
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                {t('operation.upload.selectFiles')}
              </button>
            </div>
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
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">
              {t('operation.files.title')}
            </h3>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-500">
                {t('operation.files.count', { count: imageFiles.length })}
              </span>
              {onReset && (
                <button
                  onClick={onReset}
                  className="text-sm text-gray-500 hover:text-gray-700 underline transition-colors"
                >
                  {t('operation.files.reset')}
                </button>
              )}
            </div>
          </div>
          <div className="space-y-2">
            {imageFiles.map((imageFile) => (
              <div key={imageFile.id} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all duration-200">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <img
                      src={imageFile.url}
                      alt={imageFile.name}
                      className="w-14 h-14 object-cover rounded-lg border border-gray-200 shadow-sm"
                    />
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                      {sourceFormat.toUpperCase()}
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {imageFile.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {t('operation.files.sizeInfo', { 
                        size: (imageFile.size / 1024 / 1024).toFixed(2) 
                      })}
                    </p>
                    <div className="flex items-center mt-1">
                      <span className="text-xs text-gray-400">
                        {sourceFormat.toUpperCase()} → {targetFormat.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => onRemoveFile(imageFile.id)}
                  className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-all duration-200 group"
                  title={t('operation.files.remove')}
                >
                  <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
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
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <h4 className="text-sm font-medium text-gray-900">
              {t('operation.settings.title')}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-700">
                  {t('operation.settings.quality')}
                </label>
                <select className="text-sm border border-gray-300 rounded px-2 py-1 bg-white">
                  <option value="90">{t('operation.settings.qualityHigh')}</option>
                  <option value="80" selected>{t('operation.settings.qualityMedium')}</option>
                  <option value="70">{t('operation.settings.qualityLow')}</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-700">
                  {t('operation.settings.progressive')}
                </label>
                <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-700">
                  {t('operation.settings.optimize')}
                </label>
                <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-700">
                  {t('operation.settings.metadata')}
                </label>
                <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onConvert}
              disabled={isConverting}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
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
                className="bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                {t('operation.downloadAll')}
              </button>
            )}
          </div>

          {/* 转换进度 */}
          {isConverting && (
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-700 font-medium">
                  {t('operation.progress.label')}
                </span>
                <span className="text-blue-600 font-semibold">
                  {Math.round(conversionProgress)}%
                </span>
              </div>
              <div className="relative bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-600 to-purple-600 h-full rounded-full transition-all duration-500 ease-out relative"
                  style={{ width: `${conversionProgress}%` }}
                >
                  {/* 进度条光泽效果 */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
                </div>
                {/* 进度条边框高亮 */}
                <div className="absolute inset-0 rounded-full border-2 border-transparent bg-gradient-to-r from-blue-600 to-purple-600 opacity-20 animate-pulse"></div>
              </div>
              <div className="text-xs text-gray-500 text-center">
                {t('operation.progress.status', { progress: Math.round(conversionProgress) })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 转换结果 */}
      {conversionResults.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">
              {t('operation.results.title')}
            </h3>
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
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
                <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200 hover:border-green-300 hover:shadow-md transition-all duration-200">
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
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {result.filename}
                      </p>
                      <div className="flex items-center space-x-4 mt-1">
                        <p className="text-xs text-gray-500">
                          {t('operation.results.sizeInfo', {
                            original: (result.originalFile.size / 1024 / 1024).toFixed(2),
                            converted: (result.convertedSize / 1024 / 1024).toFixed(2),
                            change: sizeChangePercent,
                            changeType: sizeChange >= 0 ? 'increase' : 'decrease'
                          })}
                        </p>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          isSizeReduced 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {isSizeReduced ? '↓' : '↑'} {Math.abs(parseFloat(sizeChangePercent))}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => onDownloadResult(result)}
                    className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="font-medium">{t('operation.results.download')}</span>
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