
import {
  useState,
  useCallback,
  useEffect,
  useRef,
} from 'react';

import {
  ImageFile,
  ConversionResult,
} from '@/types/image';

interface UseSingleFileConverterOptions {
  sourceFormat: string;
  targetFormat: string;
  initialFile?: ImageFile;
  onComplete?: (result: ConversionResult) => void;
  onReset?: () => void;
}

interface ConversionOptions {
  quality: number;
  maintainQuality: boolean;
}

type OperationState =
  | 'empty'
  | 'preview'
  | 'converting'
  | 'result';

function loadImageMetadata(
  url: string,
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => {
      resolve({
        width: image.width,
        height: image.height,
      });
    };

    image.onerror = () => {
      reject(new Error('Failed to load image.'));
    };

    image.src = url;
  });
}

export function useFileConverter({
  sourceFormat,
  targetFormat,
  initialFile,
  onComplete,
  onReset,
}: any) {
  // -----------------------------------------------
  // State
  // -----------------------------------------------

  const [state, setState] = useState<OperationState>(
    initialFile ? 'preview' : 'empty',
  );

  const [file, setFile] = useState<ImageFile | null>(
    initialFile || null,
  );

  const [isAdvancedMode, setIsAdvancedMode] = useState(false);

  const [progress, setProgress] = useState(0);

  const [result, setResult] = useState<ConversionResult | null>(null);

  const [error, setError] = useState<string | null>(null);

  const [quality, setQuality] = useState(90);

  const [maintainQuality, setMaintainQuality] = useState(true);

  // -----------------------------------------------
  // Refs
  // -----------------------------------------------

  const previewUrlRef = useRef<string | null>(null);

  const isConvertingRef = useRef(false);

  const selectionIdRef = useRef(0);

  const mountedRef = useRef(false);

  // -----------------------------------------------
  // Object URL
  // -----------------------------------------------

  const releasePreviewUrl = useCallback(() => {
    if (!previewUrlRef.current) return;

    URL.revokeObjectURL(previewUrlRef.current);
    previewUrlRef.current = null;
  }, []);

  // -----------------------------------------------
  // Lifecycle
  // -----------------------------------------------

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      selectionIdRef.current += 1;
      releasePreviewUrl();
    };
  }, [releasePreviewUrl]);

  // -----------------------------------------------
  // Initial file synchronization
  // -----------------------------------------------

  useEffect(() => {
    if (isConvertingRef.current) return;

    selectionIdRef.current += 1;

    releasePreviewUrl();

    setFile(initialFile || null);
    setState(initialFile ? 'preview' : 'empty');

    setProgress(0);
    setResult(null);
    setError(null);
  }, [initialFile, releasePreviewUrl]);

  // -----------------------------------------------
  // File selection
  // -----------------------------------------------

  const handleFileSelect = useCallback(
    async (selectedFile: File) => {
      if (isConvertingRef.current) return;

      const selectionId = ++selectionIdRef.current;

      setError(null);
      setResult(null);
      setProgress(0);

      const previewUrl = URL.createObjectURL(selectedFile);

      try {
        const metadata = await loadImageMetadata(previewUrl);

        if (
          !mountedRef.current ||
          selectionId !== selectionIdRef.current
        ) {
          URL.revokeObjectURL(previewUrl);
          return;
        }

        const imageFile: ImageFile = {
          id: `file_${Date.now()}_${Math.random()
            .toString(36)
            .slice(2, 11)}`,
          file: selectedFile,
          name: selectedFile.name,
          size: selectedFile.size,
          type: selectedFile.type,
          url: previewUrl,
          width: metadata.width,
          height: metadata.height,
        };

        releasePreviewUrl();

        previewUrlRef.current = previewUrl;

        setFile(imageFile);
        setState('preview');
      } catch (err) {
        URL.revokeObjectURL(previewUrl);

        if (
          !mountedRef.current ||
          selectionId !== selectionIdRef.current
        ) {
          return;
        }

        setError(
          err instanceof Error
            ? err.message
            : 'Failed to load image',
        );
      }
    },
    [releasePreviewUrl],
  );

  // -----------------------------------------------
  // Conversion
  // -----------------------------------------------

  const handleConvert = useCallback(async () => {
    if (!file || isConvertingRef.current) return;

    isConvertingRef.current = true;

    setState('converting');
    setProgress(0);
    setError(null);
    setResult(null);

    try {
      const startTime = Date.now();

      const options: ConversionOptions = {
        quality,
        maintainQuality,
      };

      /*
       * TODO:
       * Replace this mock with the actual image converter.
       *
       * Example:
       * const convertedBlob = await convertImage(
       *   file.file,
       *   targetFormat,
       *   options,
       *   setProgress,
       * );
       */

      for (let value = 0; value <= 100; value += 10) {
        await new Promise((resolve) => setTimeout(resolve, 80));

        if (!mountedRef.current) return;

        setProgress(value);
      }

      const convertedResult: ConversionResult = {
        originalFile: file,

        // Mock only: this is still the original file.
        convertedFile: file.file,

        fromFormat: sourceFormat,
        toFormat: targetFormat,
        processingTime: Date.now() - startTime,
      };

      if (!mountedRef.current) return;

      setResult(convertedResult);
      setState('result');

      onComplete?.(convertedResult);
    } catch (err) {
      if (!mountedRef.current) return;

      setError(
        err instanceof Error
          ? err.message
          : 'Conversion failed',
      );

      setState('preview');
    } finally {
      isConvertingRef.current = false;
    }
  }, [
    file,
    sourceFormat,
    targetFormat,
    quality,
    maintainQuality,
    onComplete,
  ]);

  // -----------------------------------------------
  // Download
  // -----------------------------------------------

  const handleDownload = useCallback(() => {
    if (!result) return;

    const objectUrl = URL.createObjectURL(
      result.convertedFile,
    );

    try {
      const link = document.createElement('a');

      const newName = result.originalFile.name.replace(
        /\.[^/.]+$/,
        `.${targetFormat}`,
      );

      link.href = objectUrl;
      link.download = newName;

      document.body.appendChild(link);
      link.click();
      link.remove();
    } finally {
      window.setTimeout(() => {
        URL.revokeObjectURL(objectUrl);
      }, 1000);
    }
  }, [result, targetFormat]);

  // -----------------------------------------------
  // Reset
  // -----------------------------------------------

  const handleReset = useCallback(() => {
    if (isConvertingRef.current) return;

    selectionIdRef.current += 1;

    releasePreviewUrl();

    setFile(null);
    setResult(null);
    setError(null);
    setProgress(0);
    setState('empty');

    onReset?.();
  }, [onReset, releasePreviewUrl]);

  // -----------------------------------------------
  // Settings
  // -----------------------------------------------

  const toggleAdvancedMode = useCallback(() => {
    setIsAdvancedMode((previous) => !previous);
  }, []);

  const toggleMaintainQuality = useCallback(() => {
    setMaintainQuality((previous) => !previous);
  }, []);

  const updateQuality = useCallback((value: number) => {
    setQuality(value);
  }, []);

  return {
    // State
    state,
    file,
    isAdvancedMode,
    progress,
    result,
    error,
    quality,
    maintainQuality,

    // Actions
    handleFileSelect,
    handleConvert,
    handleDownload,
    handleReset,
    toggleAdvancedMode,
    toggleMaintainQuality,
    updateQuality,
  };
}
