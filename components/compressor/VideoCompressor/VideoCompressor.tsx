'use client';

import {motion} from 'framer-motion';
import {Locale} from '@/lib/i18n';
import type {SimpleCompressionResult} from '@/lib/video-processing/simple-compression';

import {useVideoCompressor} from './hooks/useVideoCompressor';

import VideoPreviewCard from './components/VideoPreviewCard';
import VideoCompressionUpload from './components/VideoCompressionUpload';
import VideoCompressionProgress from './components/VideoCompressionProgress';
import VideoCompressionResultView from './components/VideoCompressionResult';
import VideoCompressionSettings from './components/VideoCompressionSettings';
import FfmpegCompressorView from './components/FfmpegCompressorView';
import FfmpegCompressionSettings from './components/FfmpegCompressorSettings';

interface SimpleVideoCompressorProps {
  locale: Locale;
  onComplete?: (result: SimpleCompressionResult) => void;
  onReset?: () => void;
}

export default function VideoCompressor({
                                          locale,
                                          onComplete,
                                          onReset,
                                        }: SimpleVideoCompressorProps) {
  const compressor = useVideoCompressor({
    locale,
    onComplete,
    onReset,
  });

  const {t} = compressor;

  // Browser compatibility
  if (!compressor.isSupported) {
    return (
      <div className="card-glass p-8 text-center">
        <div className="text-6xl mb-4">⚠️</div>

        <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
          Browser Not Supported
        </h3>

        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Your browser doesn't support video compression. Please use a
          modern browser like Chrome, Edge, or Firefox.
        </p>

        <p className="text-sm text-gray-500 dark:text-gray-500">
          Supported formats: {compressor.supportedTypes.join(', ')}
        </p>
      </div>
    );
  }

  // Empty state
  if (!compressor.file) {
    return (
      <VideoCompressionUpload
        t={t}
        onFileSelect={compressor.handleFileSelect}
      />
    );
  }

  // Processing state
  if (compressor.isCompressing) {
    return (
      <VideoCompressionProgress
        t={t}
        progress={compressor.progress}
        isLoadingFFmpeg={compressor.isLoadingFFmpeg}
        ffmpegLoadProgress={compressor.ffmpegLoadProgress}
      />
    );
  }

  // Result state
  if (compressor.result) {
    return (
      <VideoCompressionResultView
        t={t}
        result={compressor.result}
        onDownload={compressor.handleDownload}
        onReset={compressor.handleReset}
      />
    );
  }

  // FFmpeg compressor
  // if (compressor.showFFmpegCompressor) {
  //   return (
  //     <FfmpegCompressorView
  //       locale={locale}
  //       file={compressor.file}
  //       quality={compressor.ffmpegQuality}
  //       useCustom={compressor.ffmpegUseCustom}
  //       customResolution={compressor.customResolution}
  //       customBitrate={compressor.customBitrate}
  //       customFps={compressor.customFps}
  //       customCodec={compressor.customCodec}
  //       removeAudio={compressor.removeAudio}
  //       t={t}
  //       onBack={compressor.handleBackToSimple}
  //       onComplete={compressor.handleFfmpegComplete}
  //       onReset={compressor.handleBackToSimple}
  //     />
  //   );
  // }

  // Configuration state
  return (
    <motion.div
      className="space-y-6"
      initial={{opacity: 0, y: 20}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.3}}
      data-state="config"
    >
      <VideoPreviewCard
        file={compressor.file}
        onRemove={compressor.handleReset}
        accentColor="blue"
        locale={locale}
      />
      <VideoCompressionSettings
        t={t}
        isAdvancedMode={compressor.isAdvancedMode}
        compressionEngine={compressor.compressionEngine}
        setCompressionEngine={compressor.setCompressionEngine}
        quality={compressor.quality}
        setQuality={compressor.setQuality}
        resolution={compressor.resolution}
        setResolution={compressor.setResolution}
        ffmpegQuality={compressor.ffmpegQuality}
        setFfmpegQuality={compressor.setFfmpegQuality}
        ffmpegUseCustom={compressor.ffmpegUseCustom}
        setFfmpegUseCustom={compressor.setFfmpegUseCustom}
        customResolution={compressor.customResolution}
        setCustomResolution={compressor.setCustomResolution}
        customBitrate={compressor.customBitrate}
        setCustomBitrate={compressor.setCustomBitrate}
        customFps={compressor.customFps}
        setCustomFps={compressor.setCustomFps}
        customCodec={compressor.customCodec}
        setCustomCodec={compressor.setCustomCodec}
        removeAudio={compressor.removeAudio}
        setRemoveAudio={compressor.setRemoveAudio}
      />

      {/* Advanced mode toggle */}
      <div
        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
        <span className="text-sm font-medium text-text-primary">
          {t('operation.settings.advanced') || 'Advanced'}
        </span>

        <button
          type="button"
          onClick={() =>
            compressor.setIsAdvancedMode((value) => !value)
          }
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
            compressor.isAdvancedMode
              ? 'bg-blue-600'
              : 'bg-gray-300 dark:bg-gray-600'
          }`}
          role="switch"
          aria-checked={compressor.isAdvancedMode}
          aria-label="Toggle advanced settings"
        >
          <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200 ${
              compressor.isAdvancedMode
                ? 'translate-x-6'
                : 'translate-x-0.5'
            }`}
          />
        </button>
      </div>

      {/* Error message */}
      {compressor.error && (
        <motion.div
          className="card-glass p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
          initial={{opacity: 0, y: -10}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.3}}
        >
          <p className="text-red-800 dark:text-red-200">
            {compressor.error}
          </p>
        </motion.div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={compressor.handleCompress}
          className="flex-1 rounded-lg px-5 py-3 font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
        >
          {t('operation.actions.compress')}
        </button>

        <button
          type="button"
          onClick={compressor.handleReset}
          className="flex-1 rounded-lg px-5 py-3 font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          {t('operation.actions.cancel')}
        </button>
      </div>
    </motion.div>
  );
}
