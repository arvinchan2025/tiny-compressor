/**
 * 统一压缩管理器组件
 * 整合所有格式的压缩功能，通过props配置不同格式的特定设置
 */

'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageFile, CompressionOptions, CompressionResult } from '@/types/image';
import { compressImage, validateImageFile, getImageMetadata } from '@/lib/image-processing/compression';
import ModeSelector from './ModeSelector';
import FileDropZone from './FileDropZone';
import ResultsPanel from './ResultsPanel';
import { useModuleTranslation } from '@/hooks/useTranslationNew';
import { Locale } from '@/lib/i18n';

// 格式特定的设置接口
interface FormatSpecificSettings {
  png?: {
    quality: number;
    lossless: boolean;
    optimizationLevel: number;
  };
  jpeg?: {
    quality: number;
    progressive: boolean;
    colorSpace: 'auto' | 'srgb' | 'adobe';
  };
  webp?: {
    quality: number;
    lossless: boolean;
    alphaQuality: number;
    method: number;
  };
  avif?: {
    quality: number;
    lossless: boolean;
    colorDepth: number;
    hdrMode: boolean;
    alphaQuality: number;
  };
  gif?: {
    quality: number;
    lossless: boolean;
    colorReduction: number;
    frameOptimization: boolean;
    animationSpeed: number;
    interlacing: boolean;
    dithering: boolean;
  };
  bmp?: {
    quality: number;
    lossless: boolean;
    colorDepth: number;
    rleCompression: boolean;
    paletteOptimization: boolean;
    removeMetadata: boolean;
    optimizationLevel: number;
  };
}

interface UnifiedCompressionManagerProps {
  format: 'png' | 'jpeg' | 'webp' | 'avif' | 'gif' | 'bmp';
  locale: string;
  maxFiles?: number;
  onCompressionComplete?: (results: CompressionResult[]) => void;
  onError?: (error: string) => void;
}

export default function UnifiedCompressionManager({
  format,
  locale = 'en',
  maxFiles = 10,
  onCompressionComplete,
  onError
}: UnifiedCompressionManagerProps) {
  const { t } = useModuleTranslation(`compressors/${format}`, locale as Locale);
  const [imageFiles, setImageFiles] = useState<ImageFile[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionProgress, setCompressionProgress] = useState(0);
  const [compressionStatus, setCompressionStatus] = useState<'idle' | 'processing' | 'completed' | 'error'>('idle');
  const [compressionResults, setCompressionResults] = useState<CompressionResult[]>([]);
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetKey, setResetKey] = useState(0); // 用于重置文件输入

  // 获取格式特定的默认设置
  const getDefaultSettings = (format: string): CompressionOptions => {
    const baseSettings: CompressionOptions = {
      quality: 85,
      format: format as any,
      keepMetadata: false,
      maxWidth: 1920,
      maxHeight: 1080
    };

    switch (format) {
      case 'png':
        return {
          ...baseSettings,
          quality: 6,
          pngOptions: {
            quality: 6,
            lossless: true,
            optimizationLevel: 9
          }
        };
      case 'jpeg':
        return {
          ...baseSettings,
          quality: 85,
          jpegOptions: {
            quality: 85,
            progressive: false,
            optimizeHuffman: true,
            colorSpace: 'auto'
          }
        };
      case 'webp':
        return {
          ...baseSettings,
          quality: 85,
          webpOptions: {
            quality: 85,
            lossless: false,
            method: 6
          }
        };
      case 'avif':
        return {
          ...baseSettings,
          quality: 85,
          avifOptions: {
            quality: 85,
            lossless: false,
            colorSpace: 'srgb',
            speed: 8
          }
        };
      case 'gif':
        return {
          ...baseSettings,
          quality: 85,
          gifOptions: {
            quality: 85,
            lossless: false,
            optimizationLevel: 3,
            optimizeFrames: true,
            colors: 256
          }
        };
      case 'bmp':
        return {
          ...baseSettings,
          quality: 85,
          // BMP没有特定的options，使用基础设置
        };
      default:
        return baseSettings;
    }
  };

  const [compressionSettings, setCompressionSettings] = useState<CompressionOptions>(getDefaultSettings(format));

  // 文件选择处理
  const handleFilesSelected = useCallback(async (files: ImageFile | ImageFile[]) => {
    const validFiles: ImageFile[] = [];
    const errors: string[] = [];

    // 确保 files 是数组
    const fileArray = Array.isArray(files) ? files : [files];

    // 验证每个文件
    for (const file of fileArray) {
      const validation = validateImageFile(file.file);
      if (validation.valid) {
        try {
          // 获取图像元数据
          const metadata = await getImageMetadata(file.file);
          validFiles.push({
            ...file,
            width: metadata.width,
            height: metadata.height,
            type: file.type
          });
        } catch (error) {
          errors.push(`${t('operation.error.processingFailed', { fileName: file.name })}: ${error instanceof Error ? error.message : t('operation.error.unknownError')}`);
        }
      } else {
        errors.push(`${file.name}: ${validation.error}`);
      }
    }

    if (errors.length > 0) {
      setError(errors.join(', '));
      onError?.(errors.join(', '));
    }

    setImageFiles(validFiles.slice(0, maxFiles));
    setCompressionStatus('idle');
    setCompressionResults([]);
    setError(null);
  }, [maxFiles, onError]);

  // 移除文件
  const handleRemoveFile = useCallback((fileId: string) => {
    setImageFiles(prev => prev.filter(file => file.id !== fileId));
    setCompressionResults(prev => prev.filter(result => result.originalFile.id !== fileId));
  }, []);

  // 压缩处理
  const handleCompress = useCallback(async () => {
    if (imageFiles.length === 0) return;

    setIsCompressing(true);
    setCompressionStatus('processing');
    setCompressionProgress(0);
    setCompressionResults([]);
    setError(null);

    try {
      const results: CompressionResult[] = [];
      
      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
        if (!file) continue;
        
        const progress = ((i + 1) / imageFiles.length) * 100;
        setCompressionProgress(progress);

        try {
          // 使用实际的压缩逻辑
          const result = await compressImage(file, {
            ...compressionSettings,
            format: format as any
          });
          
          results.push(result);
          setCompressionResults([...results]);

        } catch (error) {
          console.error(`Failed to compress ${file.name}:`, error);
          // 继续处理其他文件，不中断整个流程
        }
      }

      setCompressionStatus('completed');
      onCompressionComplete?.(results);
    } catch (error) {
      const errorMessage = `${t('operation.error.compressionFailed')}: ${error instanceof Error ? error.message : t('operation.error.unknownError')}`;
      console.error(errorMessage);
      setError(errorMessage);
      setCompressionStatus('error');
      onError?.(errorMessage);
    } finally {
      setIsCompressing(false);
    }
  }, [imageFiles, compressionSettings, format, onCompressionComplete, onError]);

  // 模式切换
  const handleModeChange = useCallback((isAdvanced: boolean) => {
    setIsAdvancedMode(isAdvanced);
    if (!isAdvanced) {
      // 切换到简单模式时，重置为默认设置
      setCompressionSettings(getDefaultSettings(format));
    }
  }, [format]);

  // 设置更新
  const handleSettingsChange = useCallback((newSettings: Partial<CompressionOptions>) => {
    setCompressionSettings(prev => ({
      ...prev,
      ...newSettings
    }));
  }, []);

  // 下载结果
  const handleDownloadResult = useCallback((result: CompressionResult) => {
    try {
      const url = URL.createObjectURL(result.compressedFile.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = result.compressedFile.name || result.originalFile.name.replace(/\.(png|PNG|jpg|JPG|jpeg|JPEG|webp|WEBP|avif|AVIF|gif|GIF|bmp|BMP)$/, `_compressed.${format}`);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  }, [format]);

  // 下载所有结果
  const handleDownloadAll = useCallback(() => {
    compressionResults.forEach(result => {
      setTimeout(() => handleDownloadResult(result), 100);
    });
  }, [compressionResults, handleDownloadResult]);

  // 重置
  const handleReset = useCallback(() => {
    setImageFiles([]);
    setCompressionResults([]);
    setCompressionStatus('idle');
    setCompressionProgress(0);
    setIsCompressing(false);
    setError(null);
    setResetKey(prev => prev + 1); // 增加 resetKey 以重置文件输入
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
      {/* 模式选择器 */}
      <div className="p-6 pb-4">
        <ModeSelector 
          isAdvancedMode={isAdvancedMode}
          onModeChange={handleModeChange}
          locale={locale}
        />
      </div>

      {/* 文件上传区域 */}
      <div className="px-6 pb-6">
        <FileDropZone 
          onFileSelect={handleFilesSelected}
          locale={locale}
          format={format}
          resetKey={resetKey}
        />
      </div>

      {/* 错误显示 - 优化友好度 */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mx-6 mb-6"
          >
            <div className="bg-red-50 border-l-4 border-red-500 rounded-xl p-4 shadow-sm">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3 flex-1">
                  <h3 className="text-sm font-semibold text-red-800 mb-1">
                    {t('operation.error.title')}
                  </h3>
                  <div className="text-sm text-red-700 mb-2">{error}</div>
                  {/* 友好提示 */}
                  <div className="text-xs text-red-600 bg-red-100 rounded-lg p-2 mt-2">
                    {t('operation.error.tip')}
                  </div>
                </div>
                <button
                  onClick={() => setError(null)}
                  className="flex-shrink-0 ml-2 text-red-400 hover:text-red-600 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 压缩操作区域 */}
      {imageFiles.length > 0 && (
        <div className="p-6 pt-4 border-t border-slate-200 bg-slate-50">
          {/* 文件预览卡片 - 响应式优化 */}
          <div className="mb-6 max-w-2xl mx-auto">
            {imageFiles.map((file) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl border border-slate-200 p-3 sm:p-4 shadow-sm"
              >
                <div className="flex items-center space-x-3 sm:space-x-4">
                  {/* 图片预览缩略图 */}
                  <div className="flex-shrink-0">
                    {file.url ? (
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 border-slate-200 shadow-sm">
                        <img 
                          src={file.url} 
                          alt={file.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                        <span className="text-2xl sm:text-3xl">🖼️</span>
                      </div>
                    )}
                  </div>
                  
                  {/* 文件信息 - 响应式 */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
                      {file.name}
                    </h4>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                      <span className="flex items-center">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {file.width && file.height ? `${file.width} × ${file.height}` : 'Loading...'}
                      </span>
                      <span className="flex items-center">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                        {format.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  
                  {/* 移除按钮 - 增大触摸区域 */}
                  <button
                    onClick={() => {
                      setImageFiles([]);
                      setError(null);
                    }}
                    className="flex-shrink-0 p-2 sm:p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                    aria-label="Remove file"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-col items-center space-y-6">
            {/* Advanced 设置 - 在压缩按钮之前显示 */}
            <AnimatePresence mode="wait">
              {isAdvancedMode && !isCompressing && (
                <motion.div
                  key="advanced"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="w-full max-w-2xl"
                >
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-white text-sm">⚙️</span>
                      </div>
                      <h3 className="text-base font-semibold text-slate-800">
                        {t('operation.settings.advancedTitle')} - {format.toUpperCase()}
                      </h3>
                    </div>
                    
                    <div className="space-y-4">
                      {/* Quality Slider */}
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                          <label className="text-sm font-medium text-gray-700">
                            {t('operation.settings.quality') || 'Quality'}
                          </label>
                          <span className="text-lg font-bold text-blue-600">
                            {compressionSettings.quality}
                          </span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="100"
                          value={compressionSettings.quality}
                          onChange={(e) => handleSettingsChange({ quality: parseInt(e.target.value) })}
                          className="w-full h-2 bg-gradient-to-r from-red-200 via-yellow-200 to-green-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-2">
                          <span>{t('operation.settings.qualityLow') || 'Low'}</span>
                          <span>{t('operation.settings.qualityMedium') || 'Medium'}</span>
                          <span>{t('operation.settings.qualityHigh') || 'High'}</span>
                        </div>
                      </div>

                      {/* Keep Metadata */}
                      <div className="flex items-center justify-between bg-white rounded-lg p-3 shadow-sm">
                        <div className="flex-1">
                          <label className="text-sm font-medium text-gray-700">
                            {t('operation.settings.metadata') || 'Keep Metadata'}
                          </label>
                          <div className="text-xs text-gray-500 mt-0.5">
                            {t('operation.settings.metadataDesc') || 'EXIF, GPS, camera info'}
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          id="keepMetadata"
                          checked={compressionSettings.keepMetadata}
                          onChange={(e) => handleSettingsChange({ keepMetadata: e.target.checked })}
                          className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 主压缩按钮 - 增强视觉效果和移动端优化 */}
            <motion.button
              onClick={handleCompress}
              disabled={isCompressing}
              className={`
                w-full max-w-2xl py-4 sm:py-4 px-6 sm:px-8 rounded-xl font-bold text-base sm:text-lg transition-all duration-200 relative overflow-hidden
                ${isCompressing
                   ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-2xl active:shadow-lg'
                }
              `}
              whileHover={isCompressing ? {} : { scale: 1.02, y: -2 }}
              whileTap={isCompressing ? {} : { scale: 0.98 }}
            >
              {/* 按钮光泽效果 */}
              {!isCompressing && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-pulse"></div>
              )}
              
              {isCompressing ? (
                <div className="flex items-center justify-center space-x-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  <span>{t('operation.compress.processing', { progress: Math.round(compressionProgress) })}</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <span>{t('operation.compress.start', { format: format.toUpperCase() })}</span>
                </div>
              )}
            </motion.button>

            {/* 进度条 - 增强视觉反馈 */}
            <AnimatePresence>
              {isCompressing && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full max-w-2xl"
                >
                  <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                    <div className="space-y-3">
                      {/* 进度标题和百分比 */}
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">
                          {t('operation.progress.label')}
                        </span>
                        <span className="text-lg font-bold text-blue-600">
                          {Math.round(compressionProgress)}%
                        </span>
                      </div>
                      
                      {/* 进度条 */}
                      <div className="relative w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 rounded-full"
                          initial={{ width: '0%' }}
                          animate={{ width: `${compressionProgress}%` }}
                          transition={{ duration: 0.3, ease: 'easeOut' }}
                        >
                          {/* 进度条光泽动画 */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer"></div>
                        </motion.div>
                      </div>
                      
                      {/* 状态文字 */}
                      <div className="text-xs text-center text-gray-500">
                        {t('operation.progress.compressing', { format: format.toUpperCase() })}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>
      )}

      {/* 结果展示 */}
      {compressionResults.length > 0 && (
        <ResultsPanel
          result={compressionResults[0]}
          originalImageUrl={imageFiles[0]?.url}
          locale={locale}
          format={format}
          onDownload={() => handleDownloadResult(compressionResults[0])}
          onCompressMore={handleReset}
        />
      )}
    </div>
  );
}


