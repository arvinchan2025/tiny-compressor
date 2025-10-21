'use client';

import React, { useState, useCallback, useEffect } from 'react';
// Removed framer-motion for performance optimization
import { useTranslation } from '@/hooks/useTranslation';
import { Locale } from '@/lib/i18n';
import { 
  compressVideo, 
  createVideoFile,
  formatDuration,
  estimateCompressionTime
} from '@/lib/video-processing/compression';
import { 
  isFFmpegLoaded,
  loadFFmpeg,
  preloadFFmpeg 
} from '@/lib/video-processing/ffmpeg-loader';
import { FILE_SIZE_LIMIT, VIDEO_PRESETS } from '@/lib/video-processing/presets';
import type { 
  VideoFile, 
  VideoCompressionOptions,
  VideoCompressionResult,
  CompressionProgress 
} from '@/lib/video-processing/types';
import { Analytics } from '@/lib/analytics';
import UploadArea from '@/components/shared/UploadArea';
import ProgressIndicator from '@/components/shared/ProgressIndicator';
import ResultStats from '@/components/shared/ResultStats';
import ActionButtons from '@/components/shared/ActionButtons';
import ModeSelector from './components/ModeSelector';
import VideoPreviewCard from './VideoPreviewCard';

interface SingleFileVideoCompressorProps {
  locale: Locale;
  initialFile?: VideoFile;
  initialQuality?: 'low' | 'medium' | 'high' | 'custom';
  customOptions?: {
    resolution?: 'keep' | '1080p' | '720p' | '480p' | '360p';
    bitrate?: number;
    fps?: number;
    codec?: 'h264' | 'h265' | 'vp9';
    removeAudio?: boolean;
  };
  onComplete?: (result: VideoCompressionResult) => void;
  onReset?: () => void;
}

export default function SingleFileVideoCompressor({
  locale,
  initialFile,
  initialQuality,
  customOptions,
  onComplete,
  onReset,
}: SingleFileVideoCompressorProps) {
  const { t } = useTranslation('compressors/video' as any, locale);
  
  const [file, setFile] = useState<VideoFile | null>(initialFile || null);
  // 如果�?initialFile，说明是从外部传入的，默认显�?Advanced 模式以显示配�?
  const [isAdvancedMode, setIsAdvancedMode] = useState(!!initialFile);
  const [quality, setQuality] = useState<'low' | 'medium' | 'high' | 'custom'>(initialQuality || 'medium');
  const [isLoadingFFmpeg, setIsLoadingFFmpeg] = useState(false);
  const [ffmpegLoadProgress, setFfmpegLoadProgress] = useState(0);
  const [isCompressing, setIsCompressing] = useState(false);
  const [progress, setProgress] = useState<CompressionProgress | null>(null);
  const [result, setResult] = useState<VideoCompressionResult | null>(null);
  const [error, setError] = useState<string>('');
  
  // 文件选择
  const handleFileSelect = useCallback(async (selectedFile: File) => {
    try {
      setError('');
      
      // 检查文件大�?
      if (selectedFile.size > FILE_SIZE_LIMIT) {
        setError(t('operation.errors.fileTooLarge', { max: '500MB' }));
        return;
      }
      
      // 检查文件类�?
      if (!selectedFile.type.startsWith('video/')) {
        setError(t('operation.errors.unsupportedFormat'));
        return;
      }
      
      // 创建 VideoFile 对象
      const videoFile = await createVideoFile(selectedFile);
      setFile(videoFile);
      
      // 跟踪上传
      Analytics.ui.upload('video');
      
      // 显示大文件警�?
      if (selectedFile.size > 100 * 1024 * 1024) {
        const sizeMB = (selectedFile.size / 1024 / 1024).toFixed(0);
        console.warn(t('operation.warnings.largeFile', { size: sizeMB }));
      }
    } catch (err: any) {
      setError(t('operation.errors.metadataFailed'));
      console.error('File selection error:', err);
    }
  }, [t]);
  
  // 开始压�?
  const handleCompress = useCallback(async () => {
    if (!file) return;
    
    try {
      setError('');
      
      // 跟踪压缩开�?
      Analytics.compression.start('video');
      
      // 检查并加载 FFmpeg
      if (!isFFmpegLoaded()) {
        console.log('🔄 FFmpeg not loaded, starting load process...');
        setIsLoadingFFmpeg(true);
        
        // 小延迟确保状态更新被渲染
        await new Promise(resolve => setTimeout(resolve, 100));
        
        console.log('�?isLoadingFFmpeg state set to true');
        
        await loadFFmpeg((progress) => {
          console.log('📊 FFmpeg load progress:', progress.percentage + '%');
          setFfmpegLoadProgress(progress.percentage);
        });
        
        console.log('�?FFmpeg loaded, setting isLoadingFFmpeg to false');
        setIsLoadingFFmpeg(false);
      } else {
        console.log('�?FFmpeg already loaded, skipping load');
      }
      
      // 开始压�?
      setIsCompressing(true);
      
      // 构建压缩选项
      const options: VideoCompressionOptions = quality === 'custom' && customOptions ? {
        quality: 'custom',
        resolution: customOptions.resolution || 'keep',
        bitrate: customOptions.bitrate || 1500000,
        fps: customOptions.fps || 30,
        codec: customOptions.codec || 'h264',
        removeAudio: customOptions.removeAudio || false,
      } : {
        quality: quality as 'low' | 'medium' | 'high',
      };
      
      const compressionResult = await compressVideo(
        file,
        options,
        (progressData) => setProgress(progressData)
      );
      
      setResult(compressionResult);
      
      // 跟踪压缩完成
      Analytics.compression.complete('video', compressionResult.compressionRatio);
      
      onComplete?.(compressionResult);
    } catch (err: any) {
      const errorMessage = err.message || t('operation.errors.compressionFailed');
      setError(errorMessage);
      
      // 跟踪压缩错误
      Analytics.compression.error('video', errorMessage);
      
      console.error('Compression error:', err);
    } finally {
      setIsCompressing(false);
      setIsLoadingFFmpeg(false);
    }
  }, [file, quality, t, onComplete]);
  
  // 下载压缩后的视频
  const handleDownload = useCallback(() => {
    if (!result || !file) return;
    
    // 跟踪下载开�?
    Analytics.download.start('video');
    
    const url = URL.createObjectURL(result.compressedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name.replace(/\.[^.]+$/, '_compressed.mp4');
    a.click();
    URL.revokeObjectURL(url);
    
    // 跟踪下载完成
    Analytics.download.complete('video', result.compressedSize);
  }, [result, file]);
  
  // 重置
  const handleReset = useCallback(() => {
    setFile(null);
    setResult(null);
    setProgress(null);
    setError('');
    onReset?.();
  }, [onReset]);
  
  // 状态：空（无文件）
  if (!file) {
    return (
      <div
        className="card-glass p-8"
        data-state="empty"
      >
        <UploadArea
          title={t('operation.upload.title')}
          subtitle={t('operation.upload.subtitle')}
          buttonText={t('operation.upload.selectFiles')}
          acceptTypes="video/*"
          onFileSelect={handleFileSelect}
          accentColor="blue"
        />
        
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            💡 {t('operation.info.privacy')}
          </p>
        </div>
      </div>
    );
  }
  
  // 状态：加载 FFmpeg 或压缩中（优先判断）
  if (isLoadingFFmpeg || isCompressing) {
    return (
      <div
        className="card-glass p-8"
        data-state="processing"
      >
        {isLoadingFFmpeg ? (
          <div className="text-center py-12">
            <div className="animate-spin w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-6" />
            <h3 className="text-xl font-medium mb-2 text-gray-900 dark:text-white">
              {t('operation.progress.loadingEngine')}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {t('operation.progress.engineInfo')}
            </p>
            <div className="max-w-md mx-auto bg-gray-100 dark:bg-gray-800 rounded-full h-2.5">
              <div 
                className="bg-blue-500 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${ffmpegLoadProgress}%` }}
              />
            </div>
            <p className="text-sm text-blue-600 dark:text-blue-400 mt-2 font-medium">
              {ffmpegLoadProgress}%
            </p>
          </div>
        ) : (
          <>
            <ProgressIndicator
              title={t('operation.progress.compressing')}
              subtitle={t('operation.status.processing', { 
                progress: progress?.progress || 0 
              })}
              progress={progress?.progress || 0}
              accentColor="blue"
            />
            
            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
              {t('operation.progress.processingInfo')}
            </p>
          </>
        )}
      </div>
    );
  }
  
  // 状态：完成
  if (result) {
    const savedSize = result.originalSize - result.compressedSize;
    const savedMB = (savedSize / 1024 / 1024).toFixed(2);
    
    return (
      <div
        className="space-y-6"
        data-state="result"
      >
        {/* 成功标题 */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
            <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('operation.results.title')}
          </h3>
        </div>
        
        {/* 结果统计 */}
        <div className="mb-8">
          <ResultStats
            stats={[
              {
                label: t('operation.results.originalSize'),
                value: `${(result.originalSize / 1024 / 1024).toFixed(2)} MB`,
                color: 'gray',
              },
              {
                label: t('operation.results.compressedSize'),
                value: `${(result.compressedSize / 1024 / 1024).toFixed(2)} MB`,
                color: 'blue',
              },
              {
                label: t('operation.results.saved'),
                value: `${savedMB} MB`,
                color: 'green',
              },
              {
                label: t('operation.results.compressionRatio'),
                value: `${result.compressionRatio.toFixed(1)}%`,
                color: 'blue',
              },
              {
                label: t('operation.results.processingTime'),
                value: `${(result.processingTime / 1000).toFixed(1)}s`,
                color: 'orange',
              },
              {
                label: t('operation.results.duration'),
                value: file?.metadata?.duration ? formatDuration(file.metadata.duration) : 'N/A',
                color: 'purple',
              },
            ]}
          />
        </div>
        
        {/* 操作按钮 */}
        <ActionButtons
          buttons={[
            {
              label: t('operation.actions.download'),
              onClick: handleDownload,
              variant: 'primary'
            },
            {
              label: t('operation.actions.compressAnother'),
              onClick: handleReset,
              variant: 'secondary'
            }
          ]}
        />
      </div>
    );
  }
  
  // 状态：配置
  if (!isCompressing && !result) {
    return (
      <div
        className="space-y-6"
        data-state="config"
      >
        {/* 模式切换�?*/}
        {/* 高级设置开关 */}
        
        {/* 视频预览 */}
        <VideoPreviewCard
          file={file}
          onRemove={handleReset}
          accentColor="blue"
        />
        
        {/* Simple 模式：显示默认质量信�?*/}
        {!isAdvancedMode && (
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium">
                {t('operation.settings.simpleMode')}
              </span>
            </div>
          </div>
        )}
        
        {/* Advanced 模式：显示质量选择 */}
        {isAdvancedMode && (
          <div className="card-glass p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              {t('operation.settings.qualityLabel')}
            </h3>
            <div className="grid gap-3">
              {Object.entries(VIDEO_PRESETS).map(([key, preset]) => (
                <button
                  key={key}
                  onClick={() => setQuality(key as any)}
                  className={`p-4 rounded-lg border-2 transition-all text-left group ${
                    quality === key
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
                  }`}
                >
                  <div className="font-medium text-gray-900 dark:text-white">
                    {preset.name}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {preset.description}
                  </div>
                  <div className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                    {t('operation.settings.estimatedReduction', { 
                      ratio: Math.round(preset.estimatedRatio * 100)
                    })}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* 错误提示 */}
        <div>
          {error && (
            <div
              className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4"
            >
              <p className="text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}
        </div>
        
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
    );
  }
  
  return null;
}



