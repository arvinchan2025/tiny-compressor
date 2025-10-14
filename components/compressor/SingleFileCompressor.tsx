'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Check } from 'lucide-react';
import { Locale } from '@/lib/i18n';
import { useModuleTranslation } from '@/hooks/useTranslationNew';
import { ImageFile, CompressionOptions, CompressionResult } from '@/types/image';
import { stateVariants } from '@/lib/animations/state-transitions';
import { Analytics } from '@/lib/analytics';
import UploadArea from '@/components/shared/UploadArea';
import FileInfoCard from '@/components/shared/FileInfoCard';
import ProgressIndicator from '@/components/shared/ProgressIndicator';
import ResultStats from '@/components/shared/ResultStats';
import ActionButtons from '@/components/shared/ActionButtons';
import ModeSelector from './components/ModeSelector';

interface SingleFileCompressorProps {
  locale: Locale;
  format: string;
  initialFile?: ImageFile; // 可选的初始文件
  onComplete?: (result: CompressionResult) => void;
  onReset?: () => void;
}

type OperationState = 'empty' | 'config' | 'processing' | 'result';

export default function SingleFileCompressor({
  locale,
  format,
  initialFile,
  onComplete,
  onReset
}: SingleFileCompressorProps) {
  const { t, isLoading } = useModuleTranslation(`compressors/${format}`, locale);
  
  
  const [state, setState] = useState<OperationState>(initialFile ? 'config' : 'empty');
  const [file, setFile] = useState<ImageFile | null>(initialFile || null);
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);
  const [settings, setSettings] = useState<CompressionOptions>({
    quality: 80,
    keepMetadata: false,
    progressive: true
  });
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<CompressionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  

  // 文件选择处理
  const handleFileSelect = useCallback(async (selectedFile: File) => {
    try {
      // 创建 ImageFile 对象
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
      setState('config');
      setError(null);
      
      // 跟踪文件上传
      Analytics.ui.upload(format);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('operation.error.unknownError'));
    }
  }, []);

  // 压缩处理
  const handleCompress = useCallback(async () => {
    if (!file) return;
    
    // 确保 file.size 有效
    if (!file.size || file.size === 0) {
      setError(t('operation.error.unknownError'));
      return;
    }
    
    // 跟踪压缩开始
    Analytics.compression.start(format);
    
    setState('processing');
    setProgress(0);
    
    try {
      // 模拟压缩过程
      // 实际项目中这里应该调用真实的压缩函数
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setProgress(i);
      }
      
      // 计算压缩后的大小（确保是有效数字）
      const originalSize = file.size || 0;
      const compressedSize = Math.floor(originalSize * 0.6);
      
      // 模拟压缩结果
      const mockResult: CompressionResult = {
        originalFile: {
          ...file,
          size: file.size // 确保 size 属性正确设置
        },
        compressedFile: file.file, // 实际应该是压缩后的文件
        compressedSize: compressedSize,
        compressionRatio: 40,
        processingTime: 1000,
        format
      };
      
      setResult(mockResult);
      setState('result');
      
      // 跟踪压缩完成
      Analytics.compression.complete(format, 40);
      
      onComplete?.(mockResult);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t('operation.error.compressionFailed');
      setError(errorMessage);
      
      // 跟踪压缩错误
      Analytics.compression.error(format, errorMessage);
      
      setState('config');
    }
  }, [file, format, onComplete]);

  // 下载处理
  const handleDownload = useCallback(() => {
    if (!result) return;
    
    // 跟踪下载开始
    Analytics.download.start(format);
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(result.compressedFile);
    link.download = `compressed_${result.originalFile.name}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
    
    // 跟踪下载完成
    Analytics.download.complete(format, result.compressedSize);
  }, [result, format]);

  // 重置处理
  const handleReset = useCallback(() => {
    setFile(null);
    setResult(null);
    setError(null);
    setProgress(0);
    setState('empty');
    onReset?.();
  }, [onReset]);

  const formatFileSize = (bytes: number | undefined): string => {
    // 处理 undefined、null、NaN 或无效值
    if (bytes === undefined || bytes === null || isNaN(bytes) || bytes < 0) {
      return '0 KB';
    }
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
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
              title={t('operation.upload.title', { format: format.toUpperCase() })}
              subtitle={t('operation.upload.subtitle', { format: format.toUpperCase() })}
              buttonText={t('operation.upload.selectFiles', { format: format.toUpperCase() })}
              acceptTypes={`image/${format}`}
              onFileSelect={handleFileSelect}
              accentColor="blue"
            />
          </motion.div>
        )}

        {/* 状态2: 配置区域 */}
        {state === 'config' && file && (
          <motion.div
            key="config"
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
              format={format}
            />

            {/* 文件信息 */}
            <FileInfoCard
              fileName={file.name}
              fileSize={file.size}
              fileType="image"
              metadata={{
                ...(file.width && file.height ? { dimensions: { width: file.width, height: file.height } } : {}),
                format: format.toUpperCase()
              }}
              onRemove={handleReset}
              accentColor="blue"
            />

            {/* Advanced 模式：显示压缩设置 */}
            {isAdvancedMode && (
              <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 space-y-4">
                <h4 className="text-lg font-semibold text-text-primary mb-4">
                  {t('operation.settings.advancedTitle')}
                </h4>
                
                {/* 质量滑块 */}
                <div>
                  <label className="text-sm text-text-secondary block mb-2">
                    {t('operation.settings.quality')}: {settings.quality}%
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="5"
                    value={settings.quality}
                    onChange={(e) => setSettings({ ...settings, quality: parseInt(e.target.value) })}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-xs text-text-secondary mt-1">
                    <span>{t('operation.settings.qualityLow')}</span>
                    <span>{t('operation.settings.qualityHigh')}</span>
                  </div>
                </div>

                {/* 元数据选项 */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <div>
                    <label className="text-sm font-medium text-text-primary cursor-pointer">
                      {t('operation.settings.keepMetadata')}
                    </label>
                    <p className="text-xs text-text-secondary mt-0.5">
                      {t('operation.settings.metadataDesc')}
                    </p>
                  </div>
                  <button
                    onClick={() => setSettings({ ...settings, keepMetadata: !settings.keepMetadata })}
                    className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                      settings.keepMetadata ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 ${
                      settings.keepMetadata ? 'translate-x-6' : 'translate-x-0.5'
                    }`}></div>
                  </button>
                </div>

                {/* Progressive 选项（JPEG） */}
                {format === 'jpeg' && (
                  <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <div>
                      <label className="text-sm font-medium text-text-primary cursor-pointer">
                        {t('operation.settings.progressive')}
                      </label>
                      <p className="text-xs text-text-secondary mt-0.5">
                        {t('operation.settings.progressiveDesc')}
                      </p>
                    </div>
                    <button
                      onClick={() => setSettings({ ...settings, progressive: !settings.progressive })}
                      className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                        settings.progressive ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    >
                      <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 ${
                        settings.progressive ? 'translate-x-6' : 'translate-x-0.5'
                      }`}></div>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* 操作按钮 */}
            <ActionButtons
              buttons={[
                {
                  label: t('operation.actions.compress'),
                  onClick: handleCompress,
                  variant: 'primary'
                },
                {
                  label: t('operation.actions.cancel'),
                  onClick: handleReset,
                  variant: 'secondary'
                }
              ]}
            />
            </div>
          </motion.div>
        )}

        {/* 状态3: 处理中 */}
        {state === 'processing' && (
          <motion.div
            key="processing"
            variants={stateVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="card-glass p-6 sm:p-8"
          >
            <ProgressIndicator
              progress={progress}
              title={t('operation.status.processing', { progress: progress })}
              subtitle={t('operation.progress.compressing', { format: format.toUpperCase() })}
              accentColor="blue"
            />
          </motion.div>
        )}

        {/* 状态4: 结果展示 */}
        {state === 'result' && result && file && (
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
                {t('operation.results.title')}
              </h3>
              <p className="text-green-700 dark:text-green-400">
                {t('operation.results.subtitle')}
              </p>
            </div>

            {/* 文件信息 */}
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
              <h4 className="text-sm font-semibold text-text-secondary mb-3">
                {t('operation.files.title')}
              </h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-text-secondary">{t('operation.files.name')}:</span>
                  <span className="ml-2 text-text-primary font-medium truncate inline-block max-w-[200px]">{file.name}</span>
                </div>
                {file.width && file.height && (
                  <div>
                    <span className="text-text-secondary">{t('operation.files.dimensions')}:</span>
                    <span className="ml-2 text-text-primary font-medium">
                      {file.width} × {file.height}
                    </span>
                  </div>
                )}
                <div>
                  <span className="text-text-secondary">{t('operation.results.format')}:</span>
                  <span className="ml-2 text-text-primary font-medium uppercase">
                    {format}
                  </span>
                </div>
                <div>
                  <span className="text-text-secondary">{t('operation.settings.quality')}:</span>
                  <span className="ml-2 text-text-primary font-medium">
                    {settings.quality}%
                  </span>
                </div>
              </div>
            </div>

            {/* 大小对比可视化 */}
            <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
              <h4 className="text-lg font-semibold text-text-primary mb-4">
                {t('operation.results.sizeComparison')}
              </h4>
              
              {/* 可视化进度条 */}
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-text-secondary">{t('operation.results.original')}</span>
                    <span className="font-semibold text-text-primary">
                      {formatFileSize(result.originalFile?.size || result.originalFile?.file?.size)}
                    </span>
                  </div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gray-500 dark:bg-gray-400 rounded-full w-full" />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-text-secondary">{t('operation.results.compressed')}</span>
                    <span className="font-semibold text-green-600 dark:text-green-400">
                      {formatFileSize(result.compressedSize)}
                    </span>
                  </div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                      initial={{ width: '100%' }}
                      animate={{ 
                        width: `${((result.compressedSize || 0) / (result.originalFile?.size || result.originalFile?.file?.size || 1)) * 100}%` 
                      }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              </div>

              {/* 节省空间高亮 */}
              <motion.div 
                className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-500/10 dark:to-emerald-500/10 border border-green-200 dark:border-green-500/20 rounded-lg text-center"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.4 }}
              >
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
                  -{Math.abs(result.compressionRatio || 0)}%
                </div>
                <div className="text-sm text-green-700 dark:text-green-300">
                  {t('operation.results.saved')} {formatFileSize((result.originalFile?.size || result.originalFile?.file?.size || 0) - (result.compressedSize || 0))}
                </div>
              </motion.div>
            </div>

            {/* 详细统计 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 text-center">
                <div className="text-lg font-bold text-text-primary mb-1">
                  {formatFileSize(result.originalFile?.size || result.originalFile?.file?.size)}
                </div>
                <div className="text-xs text-text-secondary">{t('operation.results.original')} {t('operation.files.sizeInfo')}</div>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 text-center">
                <div className="text-lg font-bold text-green-600 dark:text-green-400 mb-1">
                  {formatFileSize(result.compressedSize)}
                </div>
                <div className="text-xs text-text-secondary">{t('operation.results.compressed')} {t('operation.files.sizeInfo')}</div>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 text-center">
                <div className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-1">
                  {settings.quality}%
                </div>
                <div className="text-xs text-text-secondary">{t('operation.stats.qualityUsed')}</div>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 text-center">
                <div className="text-lg font-bold text-purple-600 dark:text-purple-400 mb-1">
                  {(result.processingTime / 1000).toFixed(1)}s
                </div>
                <div className="text-xs text-text-secondary">{t('operation.stats.processingTime')}</div>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleDownload}
                className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 text-white rounded-lg font-semibold text-lg hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                {t('operation.results.download')}
              </button>
              <button
                onClick={handleReset}
                className="py-4 px-6 border-2 border-border-default rounded-lg font-semibold text-text-primary hover:bg-gray-50 dark:hover:bg-gray-850 transition-all"
              >
                {t('operation.results.compressMore')}
              </button>
            </div>
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


