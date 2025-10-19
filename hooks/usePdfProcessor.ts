/**
 * PDF处理器状态管理Hook
 * 统一管理PDF处理的各个状态和错误处理
 */

import { useState, useCallback, useRef } from 'react';

export interface PdfProcessingState {
  isProcessing: boolean;
  progress: number;
  error: string | null;
  result: any | null;
  metadata: any | null;
  processingTime: number;
  workerType: 'worker' | 'main-thread' | null;
}

export interface PdfProcessingOptions {
  imageQuality: number;
  removeMetadata: boolean;
  compressImages: boolean;
  scaleImages: boolean;
  maxImageDimension?: number;
  enableWorker?: boolean;
  fallbackToMainThread?: boolean;
  maxFileSize?: number;
}

export function usePdfProcessor() {
  const [state, setState] = useState<PdfProcessingState>({
    isProcessing: false,
    progress: 0,
    error: null,
    result: null,
    metadata: null,
    processingTime: 0,
    workerType: null
  });

  const processorRef = useRef<any | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  /**
   * 初始化处理器
   */
  const initializeProcessor = useCallback(async (options: Partial<PdfProcessingOptions> = {}) => {
    try {
      // 动态导入PDF处理器
      const { SafePdfProcessor } = await import('@/lib/pdf-processing/safe-pdf-processor');
      const processor = SafePdfProcessor.getInstance({
        enableWorker: options.enableWorker ?? true,
        fallbackToMainThread: options.fallbackToMainThread ?? true,
        maxFileSize: options.maxFileSize ?? 100 * 1024 * 1024,
        debugMode: process.env.NODE_ENV === 'development'
      });

      processorRef.current = processor;

      // 验证环境
      const envCheck = processor.validateEnvironment();
      if (!envCheck.supported) {
        throw new Error(envCheck.reason);
      }

      return processor;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: `Failed to initialize PDF processor: ${error.message}`
      }));
      throw error;
    }
  }, []);

  /**
   * 处理PDF文件
   */
  const processPdf = useCallback(async (
    file: File,
    options: PdfProcessingOptions
  ): Promise<any> => {
    // 重置状态
    setState({
      isProcessing: true,
      progress: 0,
      error: null,
      result: null,
      metadata: null,
      processingTime: 0,
      workerType: null
    });

    // 创建取消控制器
    abortControllerRef.current = new AbortController();

    try {
      // 初始化处理器
      const processor = processorRef.current || await initializeProcessor(options);

      // 验证文件
      const fileCheck = processor.validateFile(file);
      if (!fileCheck.valid) {
        throw new Error(fileCheck.reason);
      }

      // 更新进度
      setState(prev => ({ ...prev, progress: 10 }));

      // 获取元数据
      const metadata = await processor.processPdf(file, {
        imageQuality: options.imageQuality,
        removeMetadata: options.removeMetadata,
        compressImages: options.compressImages,
        scaleImages: options.scaleImages,
        maxImageDimension: options.maxImageDimension
      });

      setState(prev => ({ ...prev, progress: 50, metadata }));

      // 处理PDF
      const result = await processor.processPdf(file, options);

      setState(prev => ({ 
        ...prev, 
        progress: 100,
        result,
        processingTime: result.processingTime || 0,
        workerType: processor.getStatus().workerSupported ? 'worker' : 'main-thread'
      }));

      return result;

    } catch (error) {
      if (error.name === 'AbortError') {
        setState(prev => ({
          ...prev,
          isProcessing: false,
          error: 'Processing was cancelled'
        }));
      } else {
        setState(prev => ({
          ...prev,
          isProcessing: false,
          error: error.message || 'Unknown error occurred'
        }));
      }
      throw error;
    }
  }, [initializeProcessor]);

  /**
   * 取消处理
   */
  const cancelProcessing = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    setState(prev => ({
      ...prev,
      isProcessing: false,
      progress: 0,
      error: 'Processing cancelled by user'
    }));
  }, []);

  /**
   * 重置状态
   */
  const reset = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    setState({
      isProcessing: false,
      progress: 0,
      error: null,
      result: null,
      metadata: null,
      processingTime: 0,
      workerType: null
    });

    processorRef.current = null;
  }, []);

  /**
   * 获取处理器状态
   */
  const getProcessorStatus = useCallback(() => {
    if (processorRef.current) {
      return processorRef.current.getStatus();
    }
    return null;
  }, []);

  /**
   * 检查环境支持
   */
  const checkEnvironmentSupport = useCallback(async () => {
    try {
      const processor = await initializeProcessor();
      return processor.validateEnvironment();
    } catch (error) {
      return {
        supported: false,
        reason: error.message
      };
    }
  }, [initializeProcessor]);

  /**
   * 设置错误状态
   */
  const setError = useCallback((error: string | null) => {
    setState(prev => ({
      ...prev,
      error
    }));
  }, []);

  /**
   * 设置进度状态
   */
  const setProgress = useCallback((progress: number | ((prev: number) => number)) => {
    setState(prev => ({
      ...prev,
      progress: typeof progress === 'function' ? progress(prev.progress) : progress
    }));
  }, []);

  /**
   * 设置结果状态
   */
  const setResult = useCallback((result: any) => {
    setState(prev => ({
      ...prev,
      result
    }));
  }, []);

  return {
    // 状态
    ...state,
    
    // 方法
    processPdf,
    cancelProcessing,
    reset,
    setError,
    setProgress,
    setResult,
    initializeProcessor,
    getProcessorStatus,
    checkEnvironmentSupport
  };
}
