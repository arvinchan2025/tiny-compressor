'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Analytics } from '@/lib/analytics';

type PdfProcessingModule =
  typeof import('@/lib/pdf-processing');

export type PdfFile = Awaited<
  ReturnType<PdfProcessingModule['createPdfFile']>
>;

export type PdfCompressionResult = Awaited<
  ReturnType<PdfProcessingModule['compressPdf']>
>;

export type PdfCompressionOptions = Parameters<
  PdfProcessingModule['compressPdf']
>[1];

export type PdfCompressorState =
  | 'empty'
  | 'config'
  | 'processing'
  | 'result';

interface UsePdfCompressorOptions {
  onComplete?: (result: PdfCompressionResult) => void;
  onReset?: () => void;
}

const DEFAULT_OPTIONS: PdfCompressionOptions = {
  imageQuality: 0.7,
  removeMetadata: true,
  compressImages: true,
  scaleImages: false,
  maxImageDimension: 1920,
};

let modulePromise: Promise<PdfProcessingModule> | null = null;

async function loadPdfModule(): Promise<PdfProcessingModule> {
  if (!modulePromise) {
    modulePromise = import('@/lib/pdf-processing/compression').catch(
      (error) => {
        modulePromise = null;
        throw error;
      }
    );
  }

  return modulePromise;
}

export function usePdfCompressor({
  onComplete,
  onReset,
}: UsePdfCompressorOptions = {}) {
  const [state, setState] = useState<PdfCompressorState>('empty');
  const [file, setFile] = useState<PdfFile | null>(null);
  const [result, setResult] = useState<PdfCompressionResult | null>(null);
  const [options, setOptions] =
    useState<PdfCompressionOptions>(DEFAULT_OPTIONS);

  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);

  const [formatFileSize, setFormatFileSize] = useState<
    PdfProcessingModule['formatFileSize'] | null
  >(null);

  const processingRef = useRef(false);

  // 文件 URL 生命周期管理
  useEffect(() => {
    return () => {
      if (file?.url) {
        URL.revokeObjectURL(file.url);
      }
    };
  }, [file]);

  // 选择文件
  const handleFileSelect = useCallback(async (selectedFile: File) => {
    if (processingRef.current) return;

    setError(null);
    setResult(null);

    try {
      const pdfModule = await loadPdfModule();

      const validation = pdfModule.validatePdfFile(selectedFile);

      if (!validation.valid) {
        setError(validation.error || 'Invalid PDF file');
        return;
      }

      const pdfFile = await pdfModule.createPdfFile(selectedFile);

      setFile(pdfFile);
      setFormatFileSize(() => pdfModule.formatFileSize);
      setProgress(0);
      setState('config');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load PDF'
      );
    }
  }, []);

  // 更新压缩配置
  const updateOptions = useCallback(
    (updates: Partial<PdfCompressionOptions>) => {
      setOptions((current) => ({
        ...current,
        ...updates,
      }));
    },
    []
  );

  // 执行压缩
  const handleCompress = useCallback(async () => {
    if (!file || processingRef.current) return;

    processingRef.current = true;
    setError(null);
    setProgress(0);
    setState('processing');

    Analytics.compression.start('pdf');

    try {
      const pdfModule = await loadPdfModule();

      const compressionResult = await pdfModule.compressPdf(
        file,
        options
      );

      setResult(compressionResult);
      setProgress(100);
      setState('result');

      Analytics.compression.complete(
        'pdf',
        compressionResult.compressionRatio
      );

      onComplete?.(compressionResult);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Compression failed';

      setError(message);
      setState('config');

      Analytics.compression.error('pdf', message);
    } finally {
      processingRef.current = false;
    }
  }, [file, options, onComplete]);

  // 下载压缩文件
  const handleDownload = useCallback(() => {
    if (!result) return;

    const url = URL.createObjectURL(result.compressedFile.data);
    const link = document.createElement('a');

    link.href = url;
    link.download = `${result.compressedFile.name}`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // 延迟释放 URL，避免浏览器尚未开始下载就被回收
    window.setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 1000);
  }, [result]);

  // 重置
  const handleReset = useCallback(() => {
    if (processingRef.current) return;

    setFile(null);
    setResult(null);
    setError(null);
    setProgress(0);
    setState('empty');
    setOptions(DEFAULT_OPTIONS);
    setIsAdvancedMode(false);

    onReset?.();
  }, [onReset]);

  return {
    // 状态
    state,
    file,
    result,
    options,
    error,
    progress,
    isAdvancedMode,
    formatFileSize,

    // 派生状态
    isProcessing: state === 'processing',
    hasFile: file !== null,
    hasResult: result !== null,

    // 状态设置
    setError,
    setIsAdvancedMode,
    setOptions,

    // 操作
    handleFileSelect,
    handleCompress,
    handleDownload,
    handleReset,
    updateOptions,
  };
}