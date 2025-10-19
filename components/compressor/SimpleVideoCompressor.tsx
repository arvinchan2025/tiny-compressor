'use client';

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useModuleTranslation } from '@/hooks/useTranslationNew';
import { Locale } from '@/lib/i18n';
import { 
  compressVideoSimple,
  isSimpleCompressionSupported,
  getSupportedMimeTypes,
  type SimpleVideoFile,
  type SimpleCompressionOptions,
  type SimpleCompressionResult
} from '@/lib/video-processing/simple-compression';
import { VIDEO_PRESETS } from '@/lib/video-processing/presets';
import { Analytics } from '@/lib/analytics';
import UploadArea from '@/components/shared/UploadArea';
import ProgressIndicator from '@/components/shared/ProgressIndicator';
import ResultStats from '@/components/shared/ResultStats';
import ActionButtons from '@/components/shared/ActionButtons';
import ModeSelector from './components/ModeSelector';
import VideoPreviewCard from './VideoPreviewCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

// 动态导入 FFmpeg 压缩组件
const SingleFileVideoCompressor = React.lazy(() => import('./SingleFileVideoCompressor'));

interface SimpleVideoCompressorProps {
  locale: Locale;
  onComplete?: (result: SimpleCompressionResult) => void;
  onReset?: () => void;
}

export default function SimpleVideoCompressor({
  locale,
  onComplete,
  onReset,
}: SimpleVideoCompressorProps) {
  const { t } = useModuleTranslation('compressors/video', locale);
  
  const [file, setFile] = useState<SimpleVideoFile | null>(null);
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);
  const [compressionEngine, setCompressionEngine] = useState<'simple' | 'ffmpeg'>('simple');
  const [showFFmpegCompressor, setShowFFmpegCompressor] = useState(false); // 新增：控制是否显示 FFmpeg 组件
  // Simple 引擎的配置
  const [quality, setQuality] = useState<'low' | 'medium' | 'high'>('medium');
  const [resolution, setResolution] = useState<'keep' | '720p' | '480p' | '360p'>('keep');
  // FFmpeg 引擎的配置
  const [ffmpegQuality, setFfmpegQuality] = useState<'low' | 'medium' | 'high' | 'custom'>('medium');
  const [ffmpegUseCustom, setFfmpegUseCustom] = useState(false);
  // FFmpeg 自定义参数
  const [customResolution, setCustomResolution] = useState<'keep' | '1080p' | '720p' | '480p' | '360p'>('keep');
  const [customBitrate, setCustomBitrate] = useState<number>(1500); // Kbps
  const [customFps, setCustomFps] = useState<number>(30);
  const [customCodec, setCustomCodec] = useState<'h264' | 'h265' | 'vp9'>('h264');
  const [removeAudio, setRemoveAudio] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<SimpleCompressionResult | null>(null);
  const [error, setError] = useState<string>('');
  
  // 检查浏览器支持
  const isSupported = isSimpleCompressionSupported();
  const supportedTypes = getSupportedMimeTypes();
  
  // 文件选择
  const handleFileSelect = useCallback(async (selectedFile: File) => {
    try {
      setError('');
      if (selectedFile.size > 500 * 1024 * 1024) {
        setError(t('operation.errors.fileTooLarge', { max: '500MB' }));
        return;
      }
      
      const videoFile: SimpleVideoFile = {
        id: `video-${Date.now()}`,
        name: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type,
        file: selectedFile,
      };
      
      setFile(videoFile);
      Analytics.ui.upload('video');
    } catch (err) {
      setError(t('operation.errors.metadataFailed'));
      console.error('File selection error:', err);
    }
  }, [t]);
  
  // 开始压缩
  const handleCompress = useCallback(async () => {
    if (!file) return;
    
    // 如果选择 FFmpeg 引擎，切换到 FFmpeg 组件
    if (compressionEngine === 'ffmpeg' && isAdvancedMode) {
      setShowFFmpegCompressor(true);
      return;
    }
    
    try {
      setError('');
      Analytics.compression.start('video');
      
      setIsCompressing(true);
      setProgress(0);
      
      // 使用简单压缩
      const options: SimpleCompressionOptions = { quality, resolution };
      const compressionResult = await compressVideoSimple(
        file,
        options,
        (progressValue) => setProgress(progressValue)
      );
      
      setResult(compressionResult);
      Analytics.compression.complete('video', compressionResult.compressionRatio);
      onComplete?.(compressionResult);
    } catch (err: any) {
      const errorMessage = err.message || t('operation.errors.compressionFailed');
      setError(errorMessage);
      Analytics.compression.error('video', errorMessage);
      console.error('Compression error:', err);
    } finally {
      setIsCompressing(false);
    }
  }, [file, quality, resolution, compressionEngine, isAdvancedMode, t, onComplete]);
  
  // 下载压缩后的视频
  const handleDownload = useCallback(() => {
    if (!result) return;
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(result.compressedBlob);
    link.download = `compressed_${file?.name || 'video.webm'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
    
    Analytics.download.start('video');
    Analytics.download.complete('video');
  }, [result, file]);
  
  // 重置
  const handleReset = useCallback(() => {
    setFile(null);
    setResult(null);
    setError('');
    setProgress(0);
    setShowFFmpegCompressor(false); // 重置 FFmpeg 显示状态
    setCompressionEngine('simple'); // 重置引擎选择
    setIsAdvancedMode(false); // 重置模式
    onReset?.();
  }, [onReset]);
  
  // 检查浏览器支持
  if (!isSupported) {
    return (
      <div className="card-glass p-8 text-center">
        <div className="text-6xl mb-4">⚠️</div>
        <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
          Browser Not Supported
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Your browser doesn't support video compression. Please use a modern browser like Chrome, Edge, or Firefox.
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500">
          Supported formats: {supportedTypes.join(', ')}
        </p>
      </div>
    );
  }
  
  // 状态：空（无文件）
  if (!file) {
    return (
      <motion.div
        className="card-glass p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
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
          <p className="text-sm text-blue-800 dark:text-blue-200 mt-2">
            ✨ {t('operation.info.nativeCompression')}
          </p>
        </div>
      </motion.div>
    );
  }
  
  // 状态：压缩中
  if (isCompressing) {
    return (
      <motion.div
        className="card-glass p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        data-state="processing"
      >
        <ProgressIndicator
          title={t('operation.progress.compressing')}
          subtitle={`Processing... ${Math.round(progress)}%`}
          progress={progress}
          accentColor="blue"
        />
        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
          {t('operation.info.processingNative')}
        </p>
      </motion.div>
    );
  }
  
  // 状态：完成
  if (result) {
    const savedMB = ((result.originalSize - result.compressedSize) / 1024 / 1024).toFixed(2);
    
    return (
      <motion.div
        className="card-glass p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        data-state="result"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
            <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('operation.results.title')}
          </h3>
        </div>
        
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
            ]}
          />
        </div>
        
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
      </motion.div>
    );
  }
  
  // 如果用户点击了 FFmpeg 压缩按钮，显示 FFmpeg 组件
  if (showFFmpegCompressor && file) {
    // 需要将 SimpleVideoFile 转换为 VideoFile 格式
    const videoFile = {
      id: file.id,
      name: file.name,
      size: file.size,
      type: file.type,
      file: file.file,
      metadata: undefined, // FFmpeg 组件会自动提取 metadata
    };
    
    return (
      <div className="space-y-6">
        {/* 返回按钮 */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setShowFFmpegCompressor(false);
              setCompressionEngine('simple');
            }}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {t('operation.actions.backToSimple') || 'Back to Simple Compression'}
          </button>
        </div>
        
        {/* FFmpeg 组件 */}
        <React.Suspense fallback={<LoadingSpinner />}>
          <SingleFileVideoCompressor 
            locale={locale}
            initialFile={videoFile as any}
            initialQuality={ffmpegUseCustom ? 'custom' : ffmpegQuality}
            customOptions={ffmpegUseCustom ? {
              resolution: customResolution,
              bitrate: customBitrate * 1000, // Convert to bps
              fps: customFps,
              codec: customCodec,
              removeAudio: removeAudio
            } as any : undefined}
            onComplete={(result) => {
              // 将 FFmpeg 的结果转换为 Simple 结果格式
              const simpleResult: SimpleCompressionResult = {
                id: result.id,
                originalFile: file,
                compressedBlob: result.compressedBlob,
                originalSize: result.originalSize,
                compressedSize: result.compressedSize,
                compressionRatio: result.compressionRatio,
                processingTime: result.processingTime,
              };
              setResult(simpleResult);
              setShowFFmpegCompressor(false); // 完成后隐藏 FFmpeg 组件
              onComplete?.(simpleResult);
            }}
            onReset={() => {
              // 返回到简单压缩配置界面
              setShowFFmpegCompressor(false);
              setCompressionEngine('simple');
            }}
          />
        </React.Suspense>
      </div>
    );
  }

  // 状态：配置（简单压缩）
  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      data-state="config"
    >
      {/* 模式选择器 */}
      <ModeSelector
        isAdvancedMode={isAdvancedMode}
        onModeChange={setIsAdvancedMode}
        locale={locale}
        format="video"
      />

      <VideoPreviewCard
        file={file}
        onRemove={handleReset}
        accentColor="blue"
        locale={locale}
      />

      {/* 压缩设置 */}
      {isAdvancedMode && (
        <div className="card-glass p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            {t('operation.settings.advancedTitle')}
          </h3>
          
          {/* 压缩引擎选择 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              {t('operation.settings.compressionEngine')}
            </label>
            <div className="grid md:grid-cols-2 gap-4">
              <button
                onClick={() => setCompressionEngine('simple')}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  compressionEngine === 'simple'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-2xl">⚡</div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {t('operation.settings.simpleCompression')}
                  </div>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {t('operation.settings.simpleCompressionDesc')}
                </div>
              </button>
              
              <button
                onClick={() => setCompressionEngine('ffmpeg')}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  compressionEngine === 'ffmpeg'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-2xl">🔧</div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {t('operation.settings.ffmpegCompression')}
                  </div>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {t('operation.settings.ffmpegCompressionDesc')}
                </div>
              </button>
            </div>
            
            {compressionEngine === 'ffmpeg' && (
              <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  ⚠️ {t('operation.settings.ffmpegWarning')}
                </p>
              </div>
            )}
          </div>
          
          {/* 只有选择 Simple 引擎时才显示简单压缩的配置 */}
          {compressionEngine === 'simple' && (
            <div className="grid md:grid-cols-2 gap-6">
              {/* 质量设置 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('operation.settings.quality')}
                </label>
                <select
                  value={quality}
                  onChange={(e) => setQuality(e.target.value as any)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="low">{t('operation.settings.low')}</option>
                  <option value="medium">{t('operation.settings.medium')}</option>
                  <option value="high">{t('operation.settings.high')}</option>
                </select>
              </div>
              
              {/* 分辨率设置 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('operation.settings.resolution')}
                </label>
                <select
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value as any)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="keep">{t('operation.settings.resolutionKeep')}</option>
                  <option value="720p">{t('operation.settings.resolution720p')}</option>
                  <option value="480p">{t('operation.settings.resolution480p')}</option>
                  <option value="360p">{t('operation.settings.resolution360p')}</option>
                </select>
              </div>
            </div>
          )}
          
          {/* 选择 FFmpeg 引擎时显示 FFmpeg 配置 */}
          {compressionEngine === 'ffmpeg' && (
            <div className="space-y-4">
              <h4 className="text-base font-semibold text-gray-900 dark:text-white">
                {t('operation.settings.qualityLabel') || 'Quality Preset'}
              </h4>
              
              {/* 预设/自定义切换 */}
              <div className="flex gap-2">
                <button
                  onClick={() => setFfmpegUseCustom(false)}
                  className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    !ffmpegUseCustom
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {t('operation.settings.presets')}
                </button>
                <button
                  onClick={() => setFfmpegUseCustom(true)}
                  className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    ffmpegUseCustom
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {t('operation.settings.custom')}
                </button>
              </div>
              
              {/* 预设选项 */}
              {!ffmpegUseCustom && (
                <div className="grid gap-3">
                  {Object.entries(VIDEO_PRESETS).map(([key, preset]) => (
                    <button
                      key={key}
                      onClick={() => setFfmpegQuality(key as any)}
                      className={`p-4 rounded-lg border-2 transition-all text-left group ${
                        ffmpegQuality === key
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
                      }`}
                    >
                      <div className="font-medium text-gray-900 dark:text-white">
                        {t(`operation.settings.${key}`) || preset.name}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {t(`operation.settings.${key}Desc`) || preset.description}
                      </div>
                      <div className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                        {t('operation.settings.estimatedReduction', { 
                          ratio: Math.round(preset.estimatedRatio * 100)
                        }) || `Estimated size reduction: ${Math.round(preset.estimatedRatio * 100)}%`}
                      </div>
                    </button>
                  ))}
                </div>
              )}
              
              {/* 自定义参数 */}
              {ffmpegUseCustom && (
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* 分辨率 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('operation.settings.resolution')}
                      </label>
                      <select
                        value={customResolution}
                        onChange={(e) => setCustomResolution(e.target.value as any)}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      >
                        <option value="keep">{t('operation.settings.resolutionKeep')}</option>
                        <option value="1080p">{t('operation.settings.resolution1080p')}</option>
                        <option value="720p">{t('operation.settings.resolution720p')}</option>
                        <option value="480p">{t('operation.settings.resolution480p')}</option>
                        <option value="360p">{t('operation.settings.resolution360p')}</option>
                      </select>
                    </div>
                    
                    {/* 编码器 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('operation.settings.codec')}
                      </label>
                      <select
                        value={customCodec}
                        onChange={(e) => setCustomCodec(e.target.value as any)}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      >
                        <option value="h264">{t('operation.settings.codecH264')}</option>
                        <option value="h265">{t('operation.settings.codecH265')}</option>
                        <option value="vp9">{t('operation.settings.codecVP9')}</option>
                      </select>
                    </div>
                    
                    {/* 码率 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('operation.settings.bitrate')}: {t('operation.settings.bitrateValue', { value: customBitrate })}
                      </label>
                      <input
                        type="range"
                        min="500"
                        max="5000"
                        step="100"
                        value={customBitrate}
                        onChange={(e) => setCustomBitrate(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-blue-600"
                      />
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                        <span>500 Kbps</span>
                        <span>5000 Kbps</span>
                      </div>
                    </div>
                    
                    {/* 帧率 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('operation.settings.frameRate')}: {t('operation.settings.frameRateValue', { value: customFps })}
                      </label>
                      <input
                        type="range"
                        min="15"
                        max="60"
                        step="5"
                        value={customFps}
                        onChange={(e) => setCustomFps(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-blue-600"
                      />
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                        <span>15 FPS</span>
                        <span>60 FPS</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* 移除音频 */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                        {t('operation.settings.removeAudio')}
                      </label>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {t('operation.settings.removeAudioDesc')}
                      </p>
                    </div>
                    <button
                      onClick={() => setRemoveAudio(!removeAudio)}
                      className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                        removeAudio ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    >
                      <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 ${
                        removeAudio ? 'translate-x-6' : 'translate-x-0.5'
                      }`}></div>
                    </button>
                  </div>
                </div>
              )}
              
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  ⚠️ {t('operation.settings.ffmpegDownloadNote')}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Simple 模式信息 */}
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
      
      {/* 错误信息 */}
      {error && (
        <motion.div
          className="card-glass p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </motion.div>
      )}
      
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
    </motion.div>
  );
}
