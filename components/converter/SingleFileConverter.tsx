'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Check, ArrowRight } from 'lucide-react';
import { Locale } from '@/lib/i18n';
import { useModuleTranslation } from '@/hooks/useTranslationNew';
import { ImageFile, ConversionResult } from '@/types/image';
import { stateVariants } from '@/lib/animations/state-transitions';
import UploadArea from '@/components/shared/UploadArea';
import FileInfoCard from '@/components/shared/FileInfoCard';
import ProgressIndicator from '@/components/shared/ProgressIndicator';
import ResultStats from '@/components/shared/ResultStats';
import ActionButtons from '@/components/shared/ActionButtons';
import ModeSelector from '../compressor/components/ModeSelector';

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
  const { t } = useModuleTranslation(`converters/${conversionModule}`, locale);
  
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
    <div className="relative">
      <AnimatePresence mode="wait">
        {/* 状态1: 上传区域 */}
        {state === 'empty' && (
          <motion.div
            key="upload"
            variants={stateVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <UploadArea
              title={`Drop ${sourceFormat.toUpperCase()} image here or click to upload`}
              subtitle={`Maximum file size: 10MB • Will convert to ${targetFormat.toUpperCase()}`}
              buttonText={`Choose ${sourceFormat.toUpperCase()} File`}
              acceptTypes={`image/${sourceFormat}`}
              onFileSelect={handleFileSelect}
              accentColor="purple"
            />
          </motion.div>
        )}

        {/* 状态2: 预览区域 */}
        {state === 'preview' && file && (
          <motion.div
            key="preview"
            variants={stateVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="card-glass p-6 sm:p-8"
          >
            <div className="space-y-6">
            {/* 模式切换器 */}
            <ModeSelector
              isAdvancedMode={isAdvancedMode}
              onModeChange={setIsAdvancedMode}
              locale={locale}
              format={sourceFormat}
            />

            {/* 文件信息 */}
            <FileInfoCard
              fileName={file.name}
              fileSize={file.size}
              fileType="image"
              metadata={{
                dimensions: file.width && file.height ? { width: file.width, height: file.height } : undefined,
                format: sourceFormat.toUpperCase()
              }}
              onRemove={handleReset}
              accentColor="purple"
            />

            {/* 格式转换预览 */}
            <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
              <h4 className="text-lg font-semibold text-text-primary mb-6 text-center">
                Format Conversion
              </h4>
              
              <div className="grid grid-cols-3 gap-4 items-center">
                {/* 源格式 */}
                <div className="text-center">
                  <div className="inline-flex flex-col items-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-lg mb-2">
                    <span className="text-3xl">{getFormatIcon(sourceFormat)}</span>
                    <span className="font-bold text-lg">{sourceFormat.toUpperCase()}</span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Current format
                  </p>
                </div>
                
                {/* 箭头 */}
                <div className="flex justify-center">
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="w-8 h-8 text-purple-500" />
                  </motion.div>
                </div>
                
                {/* 目标格式 */}
                <div className="text-center">
                  <div className="inline-flex flex-col items-center gap-2 px-4 py-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg mb-2">
                    <span className="text-3xl">{getFormatIcon(targetFormat)}</span>
                    <span className="font-bold text-lg">{targetFormat.toUpperCase()}</span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Target format
                  </p>
                </div>
              </div>
            </div>

            {/* Advanced 模式：显示转换设置 */}
            {isAdvancedMode && (
              <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 space-y-4">
                <h4 className="text-lg font-semibold text-text-primary mb-4">
                  {t('operation.settings.advancedTitle') || 'Advanced Settings'}
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
                    <span>10% - Smaller file</span>
                    <span>100% - Best quality</span>
                  </div>
                </div>

                {/* Maintain Quality 选项 */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <div>
                    <label className="text-sm font-medium text-text-primary cursor-pointer">
                      {t('operation.settings.maintainQuality') || 'Maintain Quality'}
                    </label>
                    <p className="text-xs text-text-secondary mt-0.5">
                      Keep original image quality during conversion
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

            {/* 操作按钮 */}
            <ActionButtons
              buttons={[
                {
                  label: `Convert to ${targetFormat.toUpperCase()}`,
                  onClick: handleConvert,
                  variant: 'primary'
                },
                {
                  label: 'Cancel',
                  onClick: handleReset,
                  variant: 'secondary'
                }
              ]}
            />
            </div>
          </motion.div>
        )}

        {/* 状态3: 转换中 */}
        {state === 'converting' && (
          <motion.div
            key="converting"
            variants={stateVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="card-glass p-6 sm:p-8"
          >
            <ProgressIndicator
              progress={progress}
              title="Converting Image..."
              subtitle={`Converting from ${sourceFormat.toUpperCase()} to ${targetFormat.toUpperCase()}`}
              accentColor="purple"
            />
          </motion.div>
        )}

        {/* 状态4: 结果展示 */}
        {state === 'result' && result && (
          <motion.div
            key="result"
            variants={stateVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="card-glass p-6 sm:p-8"
          >
            <div className="space-y-6">
            {/* 成功消息 */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-500/10 dark:to-emerald-500/10 border border-green-200 dark:border-green-500/20 rounded-lg p-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-4">
                <Check className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-green-800 dark:text-green-300 mb-2">
                Conversion Complete!
              </h3>
              <p className="text-green-700 dark:text-green-400">
                Your image has been converted successfully
              </p>
            </div>

            {/* 统计数据 */}
            <ResultStats
              stats={[
                {
                  label: 'Original Format',
                  value: result.fromFormat.toUpperCase(),
                  color: 'gray'
                },
                {
                  label: 'New Format',
                  value: result.toFormat.toUpperCase(),
                  color: 'purple'
                },
                {
                  label: 'File Size',
                  value: formatFileSize(result.originalFile.size),
                  color: 'green'
                }
              ]}
            />

            {/* 操作按钮 */}
            <ActionButtons
              buttons={[
                {
                  label: `Download ${targetFormat.toUpperCase()}`,
                  onClick: handleDownload,
                  icon: Download,
                  variant: 'primary'
                },
                {
                  label: 'Convert Another',
                  onClick: handleReset,
                  variant: 'secondary'
                }
              ]}
            />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 错误提示 */}
      {error && (
        <motion.div
          className="mt-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg p-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-red-800 dark:text-red-300 font-medium">Error</p>
          <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
        </motion.div>
      )}
    </div>
  );
}


