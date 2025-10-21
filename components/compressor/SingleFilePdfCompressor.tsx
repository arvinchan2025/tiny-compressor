'use client';

import React, { useState, useCallback, useEffect } from 'react';
// Removed framer-motion for performance optimization
import { Download, Check } from 'lucide-react';
import { Locale } from '@/lib/i18n';
import { useTranslation } from '@/hooks/useTranslation';
import { usePdfProcessor } from '@/hooks/usePdfProcessor';
// Removed stateVariants import as framer-motion was removed
import { Analytics } from '@/lib/analytics';
import UploadArea from '@/components/shared/UploadArea';
import FileInfoCard from '@/components/shared/FileInfoCard';
import ProgressIndicator from '@/components/shared/ProgressIndicator';
import ActionButtons from '@/components/shared/ActionButtons';
import ModeSelector from './components/ModeSelector';
// PDF处理函数将在需要时动态导�?
// import {
//   createPdfFile,
//   validatePdfFile,
//   compressPdf,
//   formatFileSize,
//   PdfFile,
//   PdfCompressionResult,
//   PdfCompressionOptions
// } from '@/lib/pdf-processing/compression';

// 类型定义
interface PdfFile {
  id: string;
  file: File;
  name: string;
  size: number;
  lastModified: number;
  url: string;
}

interface PdfCompressionResult {
  originalFile: PdfFile;
  compressedFile: PdfFile;
  compressionRatio: number;
  sizeReduction: number;
  processingTime: number;
}

interface PdfCompressionOptions {
  quality: number;
  removeMetadata: boolean;
  optimizeImages: boolean;
  removeUnusedObjects: boolean;
}

interface SingleFilePdfCompressorProps {
  locale: Locale;
  onComplete?: (result: PdfCompressionResult) => void;
  onReset?: () => void;
}

       // 动态导入PDF处理函数的辅助函�?
       async function loadPdfProcessingFunctions() {
         const { 
           createPdfFile, 
           validatePdfFile, 
           compressPdf, 
           formatFileSize 
         } = await import('@/lib/pdf-processing/compression');
         
         return { createPdfFile, validatePdfFile, compressPdf, formatFileSize };
       }

       // 验证PDF处理环境的辅助函�?
       async function validatePdfEnvironment() {
         try {
           const { validatePdfEnvironment } = await import('@/lib/pdf-processing/safe-pdf-processor');
           return validatePdfEnvironment();
         } catch (error) {
           return { supported: false, reason: 'Failed to validate environment' };
         }
       }

type OperationState = 'empty' | 'config' | 'processing' | 'result';

export default function SingleFilePdfCompressor({
  locale,
  onComplete,
  onReset
}: SingleFilePdfCompressorProps) {
  const { t } = useTranslation('compressors/pdf' as any, locale);
  
  const [state, setState] = useState<OperationState>('empty');
  const [file, setFile] = useState<PdfFile | null>(null);
  const [formatFileSize, setFormatFileSize] = useState<((size: number) => string) | null>(null);
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);
  const [options, setOptions] = useState<PdfCompressionOptions>({
    imageQuality: 0.7,
    removeMetadata: true,
    compressImages: true,
    scaleImages: false,
    maxImageDimension: 1920
  });
  
  // 使用新的PDF处理器状态管�?
  const {
    isProcessing,
    progress,
    error,
    result,
    metadata,
    processingTime,
    workerType,
    setError,
    setProgress,
    setResult,
    processPdf: processPdfFile,
    reset: resetProcessor,
    checkEnvironmentSupport
  } = usePdfProcessor();

  // 文件选择处理
  const handleFileSelect = useCallback(async (selectedFile: File) => {
    try {
      setError(null);
      
      // 动态加载PDF处理函数
      const { validatePdfFile, createPdfFile, formatFileSize } = await loadPdfProcessingFunctions();
      
      // 存储formatFileSize函数供后续使�?
      setFormatFileSize(() => formatFileSize);
      
      // 验证文件
      const validation = validatePdfFile(selectedFile);
      if (!validation.valid) {
        setError(validation.error || 'Invalid PDF file');
        return;
      }

      // 创建 PDF 文件对象
      const pdfFile = await createPdfFile(selectedFile);
      setFile(pdfFile);
      setState('config');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load PDF');
    }
  }, []);

  // 压缩处理
  const handleCompress = useCallback(async () => {
    if (!file) return;
    
    // 跟踪 PDF 压缩开�?
    Analytics.compression.start('pdf');
    
    setState('processing');
    setProgress(0);
    
    try {
      // 模拟进度（实际应该从 compressPdf 获取�?
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // 动态加载PDF处理函数
      const { compressPdf } = await loadPdfProcessingFunctions();
      
      const compressionResult = await compressPdf(file, options);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      setResult(compressionResult);
      setState('result');
      
      // 跟踪 PDF 压缩完成
      Analytics.compression.complete('pdf', compressionResult.compressionRatio);
      
      onComplete?.(compressionResult);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Compression failed';
      setError(errorMessage);
      
      // 跟踪 PDF 压缩错误
      Analytics.compression.error('pdf', errorMessage);
      
      setState('config');
    }
  }, [file, options, onComplete]);

  // 下载处理
  const handleDownload = useCallback(() => {
    if (!result) return;
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(result.compressedBlob);
    link.download = `compressed_${result.fileName}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  }, [result]);

  // 重置处理
  const handleReset = useCallback(() => {
    setFile(null);
    setResult(null);
    setError(null);
    setProgress(0);
    setState('empty');
    onReset?.();
  }, [onReset]);

  return (
    <div className="relative">
      <div>
        {/* 状�?: 上传区域 */}
        {state === 'empty' && (
          <div
          >
            {/* 错误显示 */}
            {error && (
              <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                  </div>
                </div>
              </div>
            )}
            
            <UploadArea
              title={t('operation.upload.title')}
              subtitle={t('operation.upload.subtitle')}
              buttonText={t('operation.upload.selectFiles')}
              acceptTypes="application/pdf"
              onFileSelect={handleFileSelect}
              accentColor="blue"
            />
          </div>
        )}

        {/* 状�?: 配置区域 */}
        {state === 'config' && file && (
          <div
            className="card-glass p-6 sm:p-8"
          >
            <div className="space-y-6">
            {/* 模式切换�?*/}
            <ModeSelector
              isAdvancedMode={isAdvancedMode}
              onModeChange={setIsAdvancedMode}
              locale={locale}
              format="pdf"
            />

            {/* 文件信息 */}
            <FileInfoCard
              fileName={file.name}
              fileSize={file.size}
              fileType="pdf"
              metadata={{
                pageCount: file.metadata?.pageCount,
                hasImages: file.metadata?.hasImages
              }}
              onRemove={handleReset}
              accentColor="blue"
            />

            {/* Advanced 模式：显示压缩设�?*/}
            {isAdvancedMode && (
              <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 space-y-4">
                <h4 className="text-lg font-semibold text-text-primary mb-4">
                  Advanced Settings
                </h4>
                
                {/* 压缩图片 */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <div>
                    <label className="text-sm font-medium text-text-primary cursor-pointer">
                      Compress Images
                    </label>
                    <p className="text-xs text-text-secondary mt-0.5">
                      Reduce image quality to decrease file size
                    </p>
                  </div>
                  <button
                    onClick={() => setOptions({ ...options, compressImages: !options.compressImages })}
                    className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                      options.compressImages ? 'bg-red-600' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 ${
                      options.compressImages ? 'translate-x-6' : 'translate-x-0.5'
                    }`}></div>
                  </button>
                </div>

                {/* 图片质量滑块 */}
                {options.compressImages && (
                  <div>
                    <label className="text-sm text-text-secondary block mb-2">
                      Image Quality: {Math.round(options.imageQuality * 100)}%
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      step="5"
                      value={options.imageQuality * 100}
                      onChange={(e) => setOptions({ ...options, imageQuality: parseInt(e.target.value) / 100 })}
                      className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-red-600"
                    />
                    <div className="flex justify-between text-xs text-text-secondary mt-1">
                      <span>10% - Smaller file</span>
                      <span>100% - Best quality</span>
                    </div>
                  </div>
                )}

                {/* 移除元数�?*/}
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <div>
                    <label className="text-sm font-medium text-text-primary cursor-pointer">
                      Remove Metadata
                    </label>
                    <p className="text-xs text-text-secondary mt-0.5">
                      Remove document properties and metadata
                    </p>
                  </div>
                  <button
                    onClick={() => setOptions({ ...options, removeMetadata: !options.removeMetadata })}
                    className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                      options.removeMetadata ? 'bg-red-600' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 ${
                      options.removeMetadata ? 'translate-x-6' : 'translate-x-0.5'
                    }`}></div>
                  </button>
                </div>

                {/* 缩放图片 */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <div>
                    <label className="text-sm font-medium text-text-primary cursor-pointer">
                      Scale Images
                    </label>
                    <p className="text-xs text-text-secondary mt-0.5">
                      Resize large images to reduce file size
                    </p>
                  </div>
                  <button
                    onClick={() => setOptions({ ...options, scaleImages: !options.scaleImages })}
                    className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                      options.scaleImages ? 'bg-red-600' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 ${
                      options.scaleImages ? 'translate-x-6' : 'translate-x-0.5'
                    }`}></div>
                  </button>
                </div>
              </div>
            )}

            {/* 操作按钮 */}
            <ActionButtons
              buttons={[
                {
                  label: 'Compress PDF',
                  onClick: handleCompress,
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
          </div>
        )}

        {/* 状�?: 处理�?*/}
        {state === 'processing' && (
          <div
            className="card-glass p-6 sm:p-8"
          >
            <ProgressIndicator
              progress={progress}
              title={t('operation.status.processing', { progress: progress })}
              subtitle={t('operation.progress.compressing')}
              accentColor="blue"
            />
          </div>
        )}

        {/* 状�?: 结果展示 */}
        {state === 'result' && result && file && (
          <div
            className="card-glass p-6 sm:p-8"
          >
            <div className="space-y-6">
            {/* 成功消息 */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-500/10 dark:to-emerald-500/10 border border-green-200 dark:border-green-500/20 rounded-lg p-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-4">
                <Check className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-green-800 dark:text-green-300 mb-2">
                Compression Complete!
              </h3>
              <p className="text-green-700 dark:text-green-400">
                Your PDF has been compressed successfully
              </p>
            </div>

            {/* 文件信息 */}
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
              <h4 className="text-sm font-semibold text-text-secondary mb-3">
                File Information
              </h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-text-secondary">Name:</span>
                  <span className="ml-2 text-text-primary font-medium truncate inline-block max-w-[200px]">{file.name}</span>
                </div>
                {file.metadata?.pageCount && (
                  <div>
                    <span className="text-text-secondary">Pages:</span>
                    <span className="ml-2 text-text-primary font-medium">
                      {file.metadata.pageCount}
                    </span>
                  </div>
                )}
                <div>
                  <span className="text-text-secondary">Format:</span>
                  <span className="ml-2 text-text-primary font-medium">
                    PDF
                  </span>
                </div>
                <div>
                  <span className="text-text-secondary">Has Images:</span>
                  <span className="ml-2 text-text-primary font-medium">
                    {file.metadata?.hasImages ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>

            {/* 大小对比可视�?*/}
            <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
              <h4 className="text-lg font-semibold text-text-primary mb-4">
                Size Comparison
              </h4>
              
              {/* 可视化进度条 */}
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-text-secondary">Original</span>
                    <span className="font-semibold text-text-primary">
                      {formatFileSize ? formatFileSize(result.originalSize) : `${result.originalSize} bytes`}
                    </span>
                  </div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gray-500 dark:bg-gray-400 rounded-full w-full" />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-text-secondary">Compressed</span>
                    <span className="font-semibold text-green-600 dark:text-green-400">
                      {formatFileSize ? formatFileSize(result.compressedSize) : `${result.compressedSize} bytes`}
                    </span>
                  </div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                      style={{ 
                        width: `${(result.compressedSize / result.originalSize) * 100}%` 
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* 节省空间高亮 */}
              <div 
                className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-500/10 dark:to-emerald-500/10 border border-green-200 dark:border-green-500/20 rounded-lg text-center"
              >
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
                  -{result.savingsPercentage}%
                </div>
                <div className="text-sm text-green-700 dark:text-green-300">
                  Saved {formatFileSize ? formatFileSize(result.originalSize - result.compressedSize) : `${result.originalSize - result.compressedSize} bytes`}
                </div>
              </div>
            </div>

            {/* 详细统计 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 text-center">
                <div className="text-lg font-bold text-text-primary mb-1">
                  {formatFileSize ? formatFileSize(result.originalSize) : `${result.originalSize} bytes`}
                </div>
                <div className="text-xs text-text-secondary">Original Size</div>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 text-center">
                <div className="text-lg font-bold text-green-600 dark:text-green-400 mb-1">
                  {formatFileSize ? formatFileSize(result.compressedSize) : `${result.compressedSize} bytes`}
                </div>
                <div className="text-xs text-text-secondary">Compressed Size</div>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 text-center">
                <div className="text-lg font-bold text-red-600 dark:text-red-400 mb-1">
                  {Math.round(options.imageQuality * 100)}%
                </div>
                <div className="text-xs text-text-secondary">Image Quality</div>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 text-center">
                <div className="text-lg font-bold text-purple-600 dark:text-purple-400 mb-1">
                  {file.metadata?.pageCount || 'N/A'}
                </div>
                <div className="text-xs text-text-secondary">Pages</div>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleDownload}
                className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700 text-white rounded-lg font-semibold text-lg hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Download Compressed PDF
              </button>
              <button
                onClick={handleReset}
                className="py-4 px-6 border-2 border-border-default rounded-lg font-semibold text-text-primary hover:bg-gray-50 dark:hover:bg-gray-850 transition-all"
              >
                Compress Another
              </button>
            </div>
            </div>
          </div>
        )}
      </div>

      {/* 错误提示 */}
      {error && (
        <div
          className="mt-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg p-4"
        >
          <p className="text-red-800 dark:text-red-300 font-medium">Error</p>
          <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}




