/**
 * 统一转换管理器组件
 * 整合所有格式的转换功能，通过props配置不同格式的特定设置
 */

'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageFile, CompressionOptions, CompressionResult } from '@/types/image';
import { convertImage, validateImageFile, getImageMetadata } from '@/lib/image-processing/compression';
import { useModuleTranslation } from '@/hooks/useTranslationNew';
import { Locale } from '@/lib/i18n';
import ConversionResultsPanel from './ConversionResultsPanel';
import ModeSelector from '@/components/compressor/components/ModeSelector';
import ConversionModeSelector from './ConversionModeSelector';

// 转换特定的设置接口
interface ConversionSpecificSettings {
  quality: number;
  progressive?: boolean;
  optimizeForWeb: boolean;
  preserveMetadata: boolean;
  colorSpace?: 'auto' | 'srgb' | 'adobe';
}

interface UnifiedConversionManagerProps {
  sourceFormat: string;
  targetFormat: string;
  locale: Locale;
  maxFiles?: number;
  onConversionComplete?: (results: CompressionResult[]) => void;
  onError?: (error: string) => void;
}

export default function UnifiedConversionManager({
  sourceFormat,
  targetFormat,
  locale,
  maxFiles = 10,
  onConversionComplete,
  onError
}: UnifiedConversionManagerProps) {
  const { t } = useModuleTranslation(`converters/${sourceFormat}-to-${targetFormat}`, locale);
  
  // 状态管理
  const [imageFiles, setImageFiles] = useState<ImageFile[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [conversionProgress, setConversionProgress] = useState(0);
  const [conversionResults, setConversionResults] = useState<CompressionResult[]>([]);
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetKey, setResetKey] = useState(0); // 用于重置文件输入
  const [settings, setSettings] = useState<ConversionSpecificSettings>({
    quality: 80,
    progressive: true,
    optimizeForWeb: true,
    preserveMetadata: false,
    colorSpace: 'auto'
  });

  // 文件拖放处理
  const handleDrop = useCallback(async (files: File[]) => {
    if (files.length > maxFiles) {
      setError(t('operation.errors.maxFiles', { maxFiles }));
      return;
    }

    try {
      const newImageFiles: ImageFile[] = [];
      
      for (const file of files) {
        // 验证文件
        const validation = validateImageFile(file);
        if (!validation.valid) {
          setError(validation.error || t('operation.errors.unsupportedFormat', { fileName: file.name }));
          return;
        }

        // 检查文件格式
        if (!file.type.includes(sourceFormat)) {
          setError(t('operation.errors.unsupportedFormat', { fileName: file.name }));
          return;
        }

        // 创建 ImageFile 对象
        const imageFile: ImageFile = {
          id: Math.random().toString(),
          file,
          name: file.name,
          size: file.size,
          type: file.type,
          url: URL.createObjectURL(file),
          lastModified: file.lastModified,
          data: file
        };

        newImageFiles.push(imageFile);
      }
      
      setImageFiles(prev => [...prev, ...newImageFiles]);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('operation.errors.uploadFailed'));
    }
  }, [maxFiles, sourceFormat, t]);

  // 文件移除处理
  const handleRemoveFile = useCallback((fileId: string) => {
    setImageFiles(prev => prev.filter(file => file.id !== fileId));
  }, []);

  // 转换处理
  const handleConvert = useCallback(async () => {
    if (imageFiles.length === 0) return;

    setIsConverting(true);
    setConversionProgress(0);
    setError(null);

    try {
      const results: CompressionResult[] = [];
      const totalFiles = imageFiles.length;

      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
        setConversionProgress((i / totalFiles) * 100);

        // 转换选项
        const convertOptions: CompressionOptions = {
          quality: settings.quality,
          preserveMetadata: settings.preserveMetadata,
          optimizeForWeb: settings.optimizeForWeb,
          progressive: settings.progressive,
          colorSpace: settings.colorSpace
        };

        const result = await convertImage(file, sourceFormat, targetFormat, convertOptions);
        results.push(result);
      }

      setConversionResults(results);
      setConversionProgress(100);
      
      if (onConversionComplete) {
        onConversionComplete(results);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t('operation.errors.conversionFailed');
      setError(errorMessage);
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setIsConverting(false);
    }
  }, [imageFiles, sourceFormat, targetFormat, settings, t, onConversionComplete, onError]);

  // 下载处理
  const handleDownload = useCallback((result: CompressionResult) => {
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
    conversionResults.forEach((result, index) => {
      setTimeout(() => {
        handleDownload(result);
      }, index * 100); // 避免浏览器阻止多个下载
    });
  }, [conversionResults, handleDownload]);

  // 重置处理
  const handleReset = useCallback(() => {
    setImageFiles([]);
    setConversionResults([]);
    setConversionProgress(0);
    setError(null);
    setResetKey(prev => prev + 1); // 增加 resetKey 以重置文件输入
  }, []);

  // 设置更新处理
  const handleSettingsChange = useCallback((newSettings: Partial<ConversionSpecificSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  return (
    <div className="space-y-6">
      {/* 模式选择器 */}
      <ConversionModeSelector
        isAdvancedMode={isAdvancedMode}
        onModeChange={setIsAdvancedMode}
        locale={locale}
        sourceFormat={sourceFormat}
        targetFormat={targetFormat}
      />

      {/* 文件上传区域 */}
      <div 
        className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
        onDragOver={(e) => {
          e.preventDefault();
          e.currentTarget.classList.add('border-blue-500', 'bg-blue-50');
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50');
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50');
          const files = Array.from(e.dataTransfer.files);
          handleDrop(files);
        }}
        onClick={() => {
          document.getElementById('file-upload')?.click();
        }}
      >
        <div className="space-y-4">
          <div className="text-gray-600">
            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              {t('operation.upload.title')}
            </h3>
            <p className="text-sm text-gray-500">
              {t('operation.upload.subtitle', { 
                sourceFormat: sourceFormat.toUpperCase(), 
                targetFormat: targetFormat.toUpperCase(),
                maxFiles 
              })}
            </p>
          </div>
          <div>
            <span className="mt-2 inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              {t('operation.upload.selectFiles')}
            </span>
            <input
              key={resetKey}
              id="file-upload"
              name="file-upload"
              type="file"
              className="sr-only"
              multiple
              accept={`image/${sourceFormat}`}
              onChange={(e) => {
                if (e.target.files) {
                  handleDrop(Array.from(e.target.files));
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* 错误显示 */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-red-50 border border-red-200 rounded-md p-4"
          >
            <p className="text-sm text-red-600">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 文件列表 */}
      <AnimatePresence>
        {imageFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                {t('operation.files.title')}
              </h3>
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-500">
                  {t('operation.files.count', { count: imageFiles.length })}
                </span>
                <button
                  onClick={handleReset}
                  className="text-sm text-gray-500 hover:text-gray-700 underline transition-colors"
                >
                  {t('operation.files.reset')}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              {imageFiles.map((imageFile) => (
                <motion.div
                  key={imageFile.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all duration-200"
                >
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
                    onClick={() => handleRemoveFile(imageFile.id)}
                    className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-all duration-200 group"
                    title={t('operation.files.remove')}
                  >
                    <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 转换按钮 */}
      <AnimatePresence>
        {imageFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {/* Advanced 设置 - 在转换按钮之前显示 */}
            <AnimatePresence mode="wait">
              {isAdvancedMode && !isConverting && (
                <motion.div
                  key="advanced"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-white text-sm">⚙️</span>
                    </div>
                    <h4 className="text-base font-semibold text-slate-800">
                      {t('operation.settings.advancedTitle') || 'Advanced Settings'}
                    </h4>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Quality Slider */}
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-sm font-medium text-gray-700">
                          {t('operation.settings.quality') || 'Quality'}
                        </label>
                        <span className="text-lg font-bold text-blue-600">
                          {settings.quality}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="60"
                        max="100"
                        value={settings.quality}
                        onChange={(e) => handleSettingsChange({ quality: parseInt(e.target.value) })}
                        className="w-full h-2 bg-gradient-to-r from-red-200 via-yellow-200 to-green-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-2">
                        <span>{t('operation.settings.qualityLow') || 'Low (60)'}</span>
                        <span>{t('operation.settings.qualityMedium') || 'Medium (80)'}</span>
                        <span>{t('operation.settings.qualityHigh') || 'High (100)'}</span>
                      </div>
                    </div>

                    {/* Progressive (只对 JPEG 有效) */}
                    {(targetFormat === 'jpeg' || targetFormat === 'jpg') && (
                      <div className="flex items-center justify-between bg-white rounded-lg p-3 shadow-sm">
                        <div className="flex-1">
                          <label className="text-sm font-medium text-gray-700">
                            {t('operation.settings.progressive') || 'Progressive JPEG'}
                          </label>
                          <div className="text-xs text-gray-500 mt-0.5">
                            {t('operation.settings.progressiveDesc') || 'Better for web'}
                          </div>
                        </div>
                        <input 
                          type="checkbox" 
                          className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          checked={settings.progressive}
                          onChange={(e) => handleSettingsChange({ progressive: e.target.checked })}
                        />
                      </div>
                    )}

                    {/* Preserve Metadata */}
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
                        className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        checked={settings.preserveMetadata}
                        onChange={(e) => handleSettingsChange({ preserveMetadata: e.target.checked })}
                      />
                    </div>

                    {/* Optimize for Web */}
                    <div className="flex items-center justify-between bg-white rounded-lg p-3 shadow-sm">
                      <div className="flex-1">
                        <label className="text-sm font-medium text-gray-700">
                          {t('operation.settings.optimizeForWeb') || 'Optimize for Web'}
                        </label>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {t('operation.settings.optimizeDesc') || 'Smaller file size'}
                        </div>
                      </div>
                      <input 
                        type="checkbox" 
                        className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        checked={settings.optimizeForWeb}
                        onChange={(e) => handleSettingsChange({ optimizeForWeb: e.target.checked })}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 转换按钮 - 增强视觉效果 */}
            <motion.button
              onClick={handleConvert}
              disabled={isConverting}
              className={`
                w-full py-4 px-8 rounded-xl font-bold text-lg transition-all duration-200 relative overflow-hidden
                ${isConverting
                   ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-2xl active:shadow-lg'
                }
              `}
              whileHover={isConverting ? {} : { scale: 1.02, y: -2 }}
              whileTap={isConverting ? {} : { scale: 0.98 }}
            >
              {/* 按钮光泽效果 */}
              {!isConverting && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-pulse"></div>
              )}
              
              {isConverting ? (
                <div className="flex items-center justify-center space-x-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  <span>{t('operation.convert.processing', { progress: Math.round(conversionProgress) })}</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                  <span>
                    {t('operation.convert.start', { 
                      sourceFormat: sourceFormat.toUpperCase(), 
                      targetFormat: targetFormat.toUpperCase() 
                    }) || `Convert to ${targetFormat.toUpperCase()}`}
                  </span>
                </div>
              )}
            </motion.button>

            {/* 转换进度 - 优化视觉反馈 */}
            <AnimatePresence>
              {isConverting && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200"
                >
                  <div className="space-y-4">
                    {/* 进度环和百分比 */}
                    <div className="flex items-center justify-center">
                      <div className="relative w-24 h-24">
                        {/* 背景圆环 */}
                        <svg className="w-24 h-24 transform -rotate-90">
                          <circle
                            cx="48"
                            cy="48"
                            r="40"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="none"
                            className="text-gray-200"
                          />
                          {/* 进度圆环 */}
                          <motion.circle
                            cx="48"
                            cy="48"
                            r="40"
                            stroke="url(#gradient)"
                            strokeWidth="8"
                            fill="none"
                            strokeLinecap="round"
                            initial={{ strokeDasharray: "0 251.2" }}
                            animate={{ strokeDasharray: `${(conversionProgress / 100) * 251.2} 251.2` }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                          />
                          <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#3B82F6" />
                              <stop offset="100%" stopColor="#8B5CF6" />
                            </linearGradient>
                          </defs>
                        </svg>
                        {/* 百分比文字 */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-2xl font-bold text-blue-600">
                            {Math.round(conversionProgress)}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 进度条 */}
                    <div className="relative bg-white rounded-full h-4 overflow-hidden shadow-inner">
                      <motion.div
                        className="bg-gradient-to-r from-blue-600 to-purple-600 h-full rounded-full relative overflow-hidden"
                        initial={{ width: 0 }}
                        animate={{ width: `${conversionProgress}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                      >
                        {/* 进度条光泽动画 */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer"></div>
                      </motion.div>
                    </div>
                    
                    {/* 状态文字 */}
                    <div className="text-xs text-center text-gray-500">
                      {t('operation.progress.status', { progress: Math.round(conversionProgress) }) || `Converting... ${Math.round(conversionProgress)}%`}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 转换结果 - 使用优化的结果面板 */}
      {conversionResults.length > 0 && (
        <ConversionResultsPanel
          result={conversionResults[0]}
          originalImageUrl={imageFiles[0]?.url}
          sourceFormat={sourceFormat}
          targetFormat={targetFormat}
          locale={locale}
          onDownload={() => handleDownload(conversionResults[0])}
          onConvertMore={handleReset}
        />
      )}
    </div>
  );
}
