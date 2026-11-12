import { useEffect, useRef, useState } from 'react';
import {
  ImageFile,
  CompressionOptions,
  CompressionResult,
} from '@/types/image';
import {
  compressImage as compressImageLib,
  createImageFile,
} from '@/lib/image-processing';
import type { CompressionResult as LibCompressionResult } from '@/lib/image-processing/types';
import { Analytics } from '@/lib/analytics';

import { downloadCompressedResult } from '../utils/download';
import { OperationState, UseSingleFileCompressorOptions } from '../types';

const DEFAULT_SETTINGS: CompressionOptions = {
  quality: 80,
  keepMetadata: false,
  progressive: true,
};

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

function readImageDimensions(url: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => {
      resolve({ width: image.width, height: image.height });
    };

    image.onerror = () => {
      reject(new Error('Unable to read image dimensions.'));
    };

    image.src = url;
  });
}

export function useImageCompressor({
  format,
  defaultSettings,
  initialFile,
  onComplete,
  onReset,
  t,
}: UseSingleFileCompressorOptions) {
  const [state, setState] = useState<OperationState>(
    initialFile ? 'config' : 'empty'
  );
  const [file, setFile] = useState<ImageFile | null>(initialFile ?? null);
  const [settings, setSettings] = useState<CompressionOptions>({
    ...DEFAULT_SETTINGS,
    ...defaultSettings
  });
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<CompressionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Only URLs created by this hook are revoked here. initialFile.url belongs to its caller.
  const ownedObjectUrl = useRef<string | null>(null);

  useEffect(() => {
    if (ownedObjectUrl.current) {
      URL.revokeObjectURL(ownedObjectUrl.current);
      ownedObjectUrl.current = null;
    }
    setFile(initialFile ?? null);
    setState(initialFile ? 'config' : 'empty');
  }, [initialFile]);

  useEffect(() => {
    return () => {
      if (ownedObjectUrl.current) {
        URL.revokeObjectURL(ownedObjectUrl.current);
        ownedObjectUrl.current = null;
      }
    };
  }, []);

  const releaseOwnedObjectUrl = () => {
    if (ownedObjectUrl.current) {
      URL.revokeObjectURL(ownedObjectUrl.current);
      ownedObjectUrl.current = null;
    }
  };

  async function selectFile(selectedFile: File) {
    let objectUrl: string | null = null;

    try {
      releaseOwnedObjectUrl();
      objectUrl = URL.createObjectURL(selectedFile);

      const dimensions = await readImageDimensions(objectUrl);

      const imageFile: ImageFile = {
        id: `file_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`,
        file: selectedFile,
        name: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type,
        url: objectUrl,
        width: dimensions.width,
        height: dimensions.height,
      };

      ownedObjectUrl.current = objectUrl;
      setFile(imageFile);
      setResult(null);
      setState('config');
      setError(null);
      Analytics.ui.upload(format);
    } catch (err) {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      setError(getErrorMessage(err, t('operation.error.unknownError')));
    }
  }

  async function compress() {
    if (!file) return;

    const originalSize = file.size || file.file?.size || 0;

    if (originalSize <= 0) {
      setError(t('operation.error.unknownError'));
      return;
    }

    Analytics.compression.start(format);
    setState('processing');
    setProgress(0);
    setError(null);

    const progressInterval = window.setInterval(() => {
      setProgress((previous) => {
        if (previous >= 90) return 90;
        return Math.min(previous + 10, 90);
      });
    }, 200);

    try {
      const imageFile = await createImageFile(file.file);

      const libResult: LibCompressionResult = await compressImageLib(imageFile, {
        ...settings,
        format: format as any,
      } as any);

      const compressedFile = new File(
        [libResult.compressedFile.data],
        libResult.compressedFile.name,
        { type: libResult.compressedFile.type }
      );

      const compressedSize =
        libResult.compressedSize || compressedFile.size || 0;

      if (compressedSize > originalSize * 1.1) {
        console.warn(
          'Compressed size is larger than original size. This may indicate a compression issue.'
        );
      }

      const compressionResult: CompressionResult = {
        originalFile: file,
        compressedFile,
        compressedSize,
        compressionRatio: libResult.compressionRatio,
        processingTime: libResult.processingTime,
        format,
      };

      setResult(compressionResult);
      setProgress(100);
      setState('result');

      Analytics.compression.complete(format, libResult.compressionRatio);
      onComplete?.(compressionResult);
    } catch (err) {
      const message = getErrorMessage(
        err,
        t('operation.error.compressionFailed')
      );

      setError(message);
      setState('config');
      Analytics.compression.error(format, message);
    } finally {
      window.clearInterval(progressInterval);
    }
  }

  function download() {
    if (!result) return;

    Analytics.download.start(format);

    try {
      downloadCompressedResult(result);
      Analytics.download.complete(format, result.compressedSize);
      setError(null);
    } catch (err) {
      const message = getErrorMessage(err, 'Download failed');
      console.error('Download failed:', err);
      setError(message);
    }
  }

  function reset() {
    releaseOwnedObjectUrl();
    setFile(null);
    setResult(null);
    setError(null);
    setProgress(0);
    setSettings(DEFAULT_SETTINGS);
    setState('empty');
    onReset?.();
  }

  return {
    state,
    file,
    settings,
    setSettings,
    progress,
    result,
    error,
    selectFile,
    compress,
    download,
    reset,
  };
}
