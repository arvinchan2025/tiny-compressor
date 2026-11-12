
import { useCallback, useMemo, useState } from 'react';

import { useTranslation } from '@/hooks/useTranslation';
import { Locale } from '@/lib/i18n';

import {
  compressVideoSimple,
  isSimpleCompressionSupported,
  getSupportedMimeTypes,
  type SimpleVideoFile,
  type SimpleCompressionOptions,
  type SimpleCompressionResult,
} from '@/lib/video-processing/simple-compression';

import {
  isFFmpegLoaded,
  loadFFmpeg,
} from '@/lib/video-processing/ffmpeg-loader';

import {
  compressVideo,
} from '@/lib/video-processing/compression';

import type {
  VideoFile,
  VideoCompressionOptions,
} from '@/lib/video-processing/types';

import { Analytics } from '@/lib/analytics';

type Quality = 'low' | 'medium' | 'high';

type Resolution = 'keep' | '720p' | '480p' | '360p';

type CustomResolution =
  | 'keep'
  | '1080p'
  | '720p'
  | '480p'
  | '360p';

type FfmpegQuality = Quality;

type Codec = 'h264' | 'h265' | 'vp9';

type CompressionEngine = 'simple' | 'ffmpeg';

interface UseVideoCompressorOptions {
  locale: Locale;
  onComplete?: (result: SimpleCompressionResult) => void;
  onReset?: () => void;
}

export function useVideoCompressor({
  locale,
  onComplete,
  onReset,
}: UseVideoCompressorOptions) {
  const { t } = useTranslation(
    'compressors/video' as any,
    locale,
  );

  // --------------------------------------------------
  // File
  // --------------------------------------------------

  const [file, setFile] = useState<SimpleVideoFile | null>(null);

  // --------------------------------------------------
  // Settings
  // --------------------------------------------------

  const [isAdvancedMode, setIsAdvancedMode] = useState(false);

  const [compressionEngine, setCompressionEngine] =
    useState<CompressionEngine>('simple');

  // Simple settings
  const [quality, setQuality] =
    useState<Quality>('medium');

  const [resolution, setResolution] =
    useState<Resolution>('keep');

  // FFmpeg settings
  const [ffmpegQuality, setFfmpegQuality] =
    useState<FfmpegQuality>('medium');

  // 保留这个状态，用于在自定义和预设之间切换，
  // 不会因为切换到 Custom 而丢失之前选择的预设质量。
  const [ffmpegUseCustom, setFfmpegUseCustom] =
    useState(false);

  const [customResolution, setCustomResolution] =
    useState<CustomResolution>('keep');

  const [customBitrate, setCustomBitrate] =
    useState(1500);

  const [customFps, setCustomFps] =
    useState(30);

  const [customCodec, setCustomCodec] =
    useState<Codec>('h264');

  const [removeAudio, setRemoveAudio] =
    useState(false);

  // --------------------------------------------------
  // Processing
  // --------------------------------------------------

  const [isCompressing, setIsCompressing] =
    useState(false);

  const [isLoadingFFmpeg, setIsLoadingFFmpeg] =
    useState(false);

  const [ffmpegLoadProgress, setFfmpegLoadProgress] =
    useState(0);

  const [progress, setProgress] = useState(0);

  const [result, setResult] =
    useState<SimpleCompressionResult | null>(null);

  const [error, setError] = useState('');

  // --------------------------------------------------
  // Browser support
  // --------------------------------------------------

  const isSupported = useMemo(
    () => isSimpleCompressionSupported(),
    [],
  );

  const supportedTypes = useMemo(
    () => getSupportedMimeTypes(),
    [],
  );

  // --------------------------------------------------
  // Select file
  // --------------------------------------------------

  const handleFileSelect = useCallback(
    async (selectedFile: File) => {
      if (isCompressing) return;

      try {
        setError('');

        if (selectedFile.size > 500 * 1024 * 1024) {
          setError(
            t('operation.errors.fileTooLarge', {
              max: '500MB',
            }),
          );
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
        setResult(null);
        setProgress(0);
        setFfmpegLoadProgress(0);

        Analytics.ui.upload('video');
      } catch (err) {
        setError(t('operation.errors.metadataFailed'));
        console.error('File selection error:', err);
      }
    },
    [isCompressing, t],
  );

  // --------------------------------------------------
  // FFmpeg file adapter
  // --------------------------------------------------

  const toFFmpegVideoFile = useCallback(
    (source: SimpleVideoFile): VideoFile => {
      return {
        id: source.id,
        name: source.name,
        size: source.size,
        type: source.type,
        file: source.file,
      };
    },
    [],
  );

  // --------------------------------------------------
  // FFmpeg result adapter
  // --------------------------------------------------

  const toSimpleCompressionResult = useCallback(
    (
      ffmpegResult: Awaited<ReturnType<typeof compressVideo>>,
      originalFile: SimpleVideoFile,
    ): SimpleCompressionResult => {
      return {
        id: ffmpegResult.id,
        originalFile,
        compressedBlob: ffmpegResult.compressedBlob,
        originalSize: ffmpegResult.originalSize,
        compressedSize: ffmpegResult.compressedSize,
        compressionRatio: ffmpegResult.compressionRatio,
        processingTime: ffmpegResult.processingTime,
      };
    },
    [],
  );

  // --------------------------------------------------
  // Build FFmpeg options
  // --------------------------------------------------

  const buildFFmpegOptions = useCallback(
    (): VideoCompressionOptions => {
      if (ffmpegUseCustom) {
        return {
          quality: 'custom',
          resolution: customResolution,
          bitrate: customBitrate * 1000,
          fps: customFps,
          codec: customCodec,
          removeAudio,
        };
      }

      return {
        quality: ffmpegQuality,
      };
    },
    [
      ffmpegUseCustom,
      ffmpegQuality,
      customResolution,
      customBitrate,
      customFps,
      customCodec,
      removeAudio,
    ],
  );

  // --------------------------------------------------
  // Compress
  // --------------------------------------------------

  const handleCompress = useCallback(async () => {
    if (!file || isCompressing) return;

    try {
      setError('');
      setResult(null);
      setProgress(0);
      setFfmpegLoadProgress(0);
      setIsCompressing(true);

      Analytics.compression.start('video');

      let compressionResult: SimpleCompressionResult;

      if (compressionEngine === 'simple') {
        // ------------------------------------------
        // Simple compression
        // ------------------------------------------

        const options: SimpleCompressionOptions = {
          quality,
          resolution,
        };

        compressionResult = await compressVideoSimple(
          file,
          options,
          (progressValue) => {
            setProgress(progressValue);
          },
        );
      } else {
        // ------------------------------------------
        // FFmpeg compression
        // ------------------------------------------

        // 1. Load FFmpeg if necessary
        if (!isFFmpegLoaded()) {
          setIsLoadingFFmpeg(true);

          await loadFFmpeg((loadProgress) => {
            setFfmpegLoadProgress(
              loadProgress.percentage,
            );
          });
        }

        setIsLoadingFFmpeg(false);
        setFfmpegLoadProgress(100);

        // 2. Convert file type
        const ffmpegFile = toFFmpegVideoFile(file);

        // 3. Build options
        const options = buildFFmpegOptions();

        // 4. Execute FFmpeg compression
        const ffmpegResult = await compressVideo(
          ffmpegFile,
          options,
          (progressData) => {
            setProgress(progressData.progress);
          },
        );

        // 5. Convert to common result type
        compressionResult = toSimpleCompressionResult(
          ffmpegResult,
          file,
        );
      }

      // ------------------------------------------
      // Common result handling
      // ------------------------------------------

      setResult(compressionResult);
      setProgress(100);

      Analytics.compression.complete(
        'video',
        compressionResult.compressionRatio,
      );

      onComplete?.(compressionResult);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : t('operation.errors.compressionFailed');

      setError(errorMessage);

      Analytics.compression.error(
        'video',
        errorMessage,
      );

      console.error('Video compression error:', err);
    } finally {
      setIsCompressing(false);
      setIsLoadingFFmpeg(false);
    }
  }, [
    file,
    isCompressing,
    compressionEngine,
    quality,
    resolution,
    buildFFmpegOptions,
    toFFmpegVideoFile,
    toSimpleCompressionResult,
    onComplete,
    t,
  ]);

  // --------------------------------------------------
  // Download
  // --------------------------------------------------

  const handleDownload = useCallback(() => {
    if (!result) return;

    let objectUrl: string | null = null;

    try {
      if (!(result.compressedBlob instanceof Blob)) {
        throw new Error(
          'Compressed video data is unavailable.',
        );
      }

      objectUrl = URL.createObjectURL(
        result.compressedBlob,
      );

      const originalName =
        file?.name.replace(/\.[^.]+$/, '') || 'video';

      const extension =
        result.compressedBlob.type === 'video/mp4'
          ? 'mp4'
          : result.compressedBlob.type === 'video/webm'
            ? 'webm'
            : 'mp4';

      const link = document.createElement('a');

      link.href = objectUrl;
      link.download = `compressed_${originalName}.${extension}`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      Analytics.download.start('video');
      Analytics.download.complete('video');
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Failed to download video.';

      setError(message);
      console.error('Video download error:', err);
    } finally {
      if (objectUrl) {
        window.setTimeout(() => {
          URL.revokeObjectURL(objectUrl!);
        }, 1000);
      }
    }
  }, [result, file]);

  // --------------------------------------------------
  // Reset
  // --------------------------------------------------

  const handleReset = useCallback(() => {
    if (isCompressing) return;

    setFile(null);
    setResult(null);
    setError('');

    setProgress(0);
    setIsLoadingFFmpeg(false);
    setFfmpegLoadProgress(0);

    setCompressionEngine('simple');
    setIsAdvancedMode(false);

    onReset?.();
  }, [isCompressing, onReset]);

  return {
    t,

    // File
    file,

    // Settings
    isAdvancedMode,
    setIsAdvancedMode,

    compressionEngine,
    setCompressionEngine,

    quality,
    setQuality,

    resolution,
    setResolution,

    ffmpegQuality,
    setFfmpegQuality,

    ffmpegUseCustom,
    setFfmpegUseCustom,

    customResolution,
    setCustomResolution,

    customBitrate,
    setCustomBitrate,

    customFps,
    setCustomFps,

    customCodec,
    setCustomCodec,

    removeAudio,
    setRemoveAudio,

    // Processing
    isCompressing,
    isLoadingFFmpeg,
    ffmpegLoadProgress,
    progress,
    result,
    error,

    // Support
    isSupported,
    supportedTypes,

    // Actions
    handleFileSelect,
    handleCompress,
    handleDownload,
    handleReset,
  };
}
