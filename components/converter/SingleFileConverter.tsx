'use client';

import React, { useState, useCallback } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
import { Download, Check, ArrowRight } from 'lucide-react';
import { Locale } from '@/lib/i18n';
import { useTranslation } from '@/hooks/useTranslation';
import { ImageFile, ConversionResult } from '@/types/image';
// import { stateVariants } from '@/lib/animations/state-transitions';
import UploadArea from '@/components/shared/UploadArea';
import FileInfoCard from '@/components/shared/FileInfoCard';
import ProgressIndicator from '@/components/shared/ProgressIndicator';
import ResultStats from '@/components/shared/ResultStats';
import ActionButtons from '@/components/shared/ActionButtons';
// import ModeSelector from '../compressor/components/ModeSelector';

interface SingleFileConverterProps {
  locale: Locale;
  sourceFormat: string;
  targetFormat: string;
  initialFile?: ImageFile; // 可选的初始文件
  onComplete?: (result: ConversionResult) => void;
  onReset?: () => void;
}

type OperationState = 'empty' | 'preview' | 'converting' | 'result';

export default function SingleFileConverter({
  locale,
  sourceFormat,
  targetFormat,
  initialFile,
  onComplete,
  onReset
}: SingleFileConverterProps) {
  const conversionModule = `${sourceFormat}-to-${targetFormat}`;
  const { t: tConverter } = useTranslation(`converters/${conversionModule}` as any, locale);
  const { t: tCommon } = useTranslation('common/operation' as any, locale);
  
  // 混合翻译函数：优先使用功能页翻译，回退到共用翻译
  const t = (key: string, params?: any) => {
    const converterResult = tConverter(key, params);
    if (converterResult !== key) return converterResult;
    
    const commonResult = tCommon(key, params);
    if (commonResult !== key) return commonResult;
    
    return key;
  };
  
  const [state, setState] = useState<OperationState>(initialFile ? 'preview' : 'empty');
  const [file, setFile] = useState<ImageFile | null>(initialFile || null);
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [maintainQuality, setMaintainQuality] = useState(true);
  const [quality, setQuality] = useState(90);

  // 文件选择处理
  const handleFileSelect = useCallback(async (selectedFile: File) => {
    try {
      const imageFile: ImageFile = {
        id: `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        file: selectedFile,
        name: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type,
        url: URL.createObjectURL(selectedFile)
      };
      
      // 获取图片尺寸
      const img = new Image();
      img.src = imageFile.url;
      await new Promise((resolve) => {
        img.onload = () => {
          imageFile.width = img.width;
          imageFile.height = img.height;
          resolve(null);
        };
      });
      
      setFile(imageFile);
      setState('preview');
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load image');
    }
  }, []);

  // 转换处理
  const handleConvert = useCallback(async () => {
    if (!file) return;
    
    setState('converting');
    setProgress(0);
    
    try {
      // 模拟转换过程
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 80));
        setProgress(i);
      }
      
      // 模拟转换结果
      const mockResult: ConversionResult = {
        originalFile: file,
        convertedFile: file.file, // 实际应该是转换后的文件
        fromFormat: sourceFormat,
        toFormat: targetFormat,
        processingTime: 800
      };
      
      setResult(mockResult);
      setState('result');
      onComplete?.(mockResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Conversion failed');
      setState('preview');
    }
  }, [file, sourceFormat, targetFormat, onComplete]);

  // 下载处理
  const handleDownload = useCallback(() => {
    if (!result) return;
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(result.convertedFile);
    const newName = result.originalFile.name.replace(/\.[^/.]+$/, `.${targetFormat}`);
    link.download = newName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  }, [result, targetFormat]);

  // 重置处理
  const handleReset = useCallback(() => {
    setFile(null);
    setResult(null);
    setError(null);
    setProgress(0);
    setState('empty');
    onReset?.();
  }, [onReset]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const getFormatIcon = (format: string) => {
    const icons: { [key: string]: string } = {
      png: '🖼️',
      jpg: '📷',
      jpeg: '📷',
      webp: '🌐',
      avif: '🚀',
      heic: '📱'
    };
    return icons[format.toLowerCase()] || '🖼️';
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
        {state === 'empty' && (
          <div className="text-center">
            <UploadArea
              title={t('operation.upload.title') || `Upload ${sourceFormat.toUpperCase()} File`}
              subtitle={t('operation.upload.subtitle', { format: sourceFormat.toUpperCase() }) || `Drag and drop your ${sourceFormat.toUpperCase()} file here or click to select`}
              buttonText={t('operation.upload.selectFiles') || 'Select File'}
              acceptTypes={`image/${sourceFormat}`}
              onFileSelect={handleFileSelect}
              accentColor="blue"
              maxFileSize={50}
            />

          </div>
        )}

        {state === 'preview' && file && (
          <div className="card-glass p-6 sm:p-8">
            <div className="space-y-6">

            <FileInfoCard
              fileName={file.name}
              fileSize={file.size}
              fileType="image"
              metadata={{
                ...(file.width && file.height ? { dimensions: { width: file.width, height: file.height } } : {}),
                format: sourceFormat.toUpperCase()
              }}
              onRemove={handleReset}
              accentColor="blue"
            />

            {/* 格式转换预览 */}
            <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
              <h4 className="text-lg font-semibold text-text-primary mb-6 text-center">
                {t('operation.preview.formatConversion') || 'Format Conversion'}
              </h4>
              
              <div className="grid grid-cols-3 gap-4 items-center">
                {/* 源格式 */}
                <div className="text-center">
                  <div className="inline-flex flex-col items-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-lg mb-2">
                    <span className="text-3xl">{getFormatIcon(sourceFormat)}</span>
                    <span className="font-bold text-lg">{sourceFormat.toUpperCase()}</span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {t('operation.preview.currentFormat') || 'Current format'}
                  </p>
                </div>
                
                {/* 箭头 */}
                <div className="flex justify-center">
                  <div>
                    <ArrowRight className="w-8 h-8 text-purple-500" />
                  </div>
                </div>
                
                {/* 目标格式 */}
                <div className="text-center">
                  <div className="inline-flex flex-col items-center gap-2 px-4 py-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg mb-2">
                    <span className="text-3xl">{getFormatIcon(targetFormat)}</span>
                    <span className="font-bold text-lg">{targetFormat.toUpperCase()}</span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {t('operation.preview.targetFormat') || 'Target format'}
                  </p>
                </div>
              </div>
            </div>

            {/* Advanced 模式：显示转换设置 */}
            {isAdvancedMode && (
              <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 space-y-4">
                <h4 className="text-lg font-semibold text-text-primary mb-4">
                  {t('operation.settings.advancedTitle') || 'Advanced Options'}
                </h4>
                
                {/* 质量滑块 */}
                <div>
                  <label className="text-sm text-text-secondary block mb-2">
                    {t('operation.settings.quality') || 'Quality'}: {quality}%
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="5"
                    value={quality}
                    onChange={(e) => setQuality(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
                  />
                  <div className="flex justify-between text-xs text-text-secondary mt-1">
                    <span>{t('operation.settings.qualityLow') || '10% - Smaller file'}</span>
                    <span>{t('operation.settings.qualityHigh') || '100% - Best quality'}</span>
                  </div>
                </div>

                {/* Maintain Quality 选项 */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <div>
                    <label className="text-sm font-medium text-text-primary cursor-pointer">
                      {t('operation.settings.maintainQuality') || 'Maintain Quality'}
                    </label>
                    <p className="text-xs text-text-secondary mt-0.5">
                      {t('operation.settings.maintainQualityDesc') || 'Keep original image quality during conversion'}
                    </p>
                  </div>
                  <button
                    onClick={() => setMaintainQuality(!maintainQuality)}
                    className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                      maintainQuality ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 ${
                      maintainQuality ? 'translate-x-6' : 'translate-x-0.5'
                    }`}></div>
                  </button>
                </div>
              </div>
            )}

            {/* 高级设置开关 */}
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <span className="text-sm font-medium text-text-primary">
                  {t('operation.settings.advanced') || 'Advanced'}
                </span>
              </div>
              <button
                onClick={() => setIsAdvancedMode(!isAdvancedMode)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                  isAdvancedMode ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                }`}
                role="switch"
                aria-checked={isAdvancedMode}
                aria-label="Toggle advanced settings"
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200 ${
                    isAdvancedMode ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            <ActionButtons
              buttons={[
                {
                  label: t('operation.convert.start') || 'Convert',
                  onClick: handleConvert,
                  variant: 'primary'
                },
                {
                  label: t('operation.actions.reset') || 'Reset',
                  onClick: handleReset,
                  variant: 'secondary'
                }
              ]}
            />
            </div>
          </div>
        )}

        {state === 'converting' && (
          <div className="card-glass p-6 sm:p-8 text-center">
            <ProgressIndicator
              progress={progress}
              title="Converting..."
            />
          </div>
        )}

        {state === 'result' && result && (
          <div className="card-glass p-6 sm:p-8 space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-2xl font-semibold text-slate-800 dark:text-gray-200 mb-2">
                {t('operation.results.title') || 'Conversion Complete!'}
              </h2>
              <p className="text-slate-600 dark:text-gray-400">
                {t('operation.results.subtitle') || 'Your image has been successfully converted'}
              </p>
            </div>

            {/* 统计数据 */}
            <ResultStats
              stats={[
                {
                  label: t('operation.results.originalFormat') || 'Original Format',
                  value: result.fromFormat.toUpperCase(),
                  color: 'gray'
                },
                {
                  label: t('operation.results.newFormat') || 'New Format',
                  value: result.toFormat.toUpperCase(),
                  color: 'purple'
                },
                {
                  label: t('operation.results.fileSize') || 'File Size',
                  value: formatFileSize(result.originalFile.size),
                  color: 'green'
                }
              ]}
            />

            {/* 操作按钮 */}
            <ActionButtons
              buttons={[
                {
                  label: t('operation.results.download') || `Download ${targetFormat.toUpperCase()}`,
                  onClick: handleDownload,
                  icon: Download,
                  variant: 'primary'
                },
                {
                  label: t('operation.results.reset') || 'Convert Another',
                  onClick: handleReset,
                  variant: 'secondary'
                }
              ]}
            />
          </div>
        )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mt-6">
          <p className="text-red-700 dark:text-red-400">{error}</p>
        </div>
      )}
    </div>
  );
}