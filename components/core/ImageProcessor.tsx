/**
 * 图片处理核心组件
 * 使用 Web Worker 进行图片压缩和转换
 */

'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { ImageFile, CompressionOptions, ProcessingResult } from '@/types';
import { formatFileSize, calculateCompressionRatio } from '@/lib/utils';
import { workerManager } from '@/lib/workers';
import { wasmProcessor, preloadWasmProcessor } from '@/lib/wasm';
import Loading from '@/components/ui/Loading';
import Progress from '@/components/ui/Progress';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

interface ImageProcessorProps {
  files: File[];
  options: CompressionOptions;
  onResults: (results: ProcessingResult[]) => void;
  onError: (error: string) => void;
  onProgress: (progress: number) => void;
  translations: {
    processing: string;
    completed: string;
    error: string;
    retry: string;
    cancel: string;
  };
}

export default function ImageProcessor({
  files,
  options,
  onResults,
  onError,
  onProgress,
  translations
}: ImageProcessorProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentFile, setCurrentFile] = useState<string>('');
  const [results, setResults] = useState<ProcessingResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [workerAvailable, setWorkerAvailable] = useState(false);
  const [wasmAvailable, setWasmAvailable] = useState(false);
  
  const abortControllerRef = useRef<AbortController | null>(null);

  // 初始化 Worker 和 WASM
  useEffect(() => {
    const initProcessors = async () => {
      try {
        // 初始化 Worker
        await workerManager.initialize();
        setWorkerAvailable(true);
      } catch (error) {
        console.error('Failed to initialize worker:', error);
        setWorkerAvailable(false);
      }

      try {
        // 初始化 WASM
        await wasmProcessor.initialize();
        setWasmAvailable(true);
      } catch (error) {
        console.error('Failed to initialize WASM processor:', error);
        setWasmAvailable(false);
      }

      // 预加载 WASM 库
      preloadWasmProcessor();
    };

    initProcessors();

    // 清理函数
    return () => {
      workerManager.destroy();
    };
  }, []);
  
  const processImages = useCallback(async () => {
    if (files.length === 0) return;
    
    setIsProcessing(true);
    setProgress(0);
    setError(null);
    setResults([]);
    
    try {
      const processingResults: ProcessingResult[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file) continue;
        
        setCurrentFile(file.name);
        setProgress((i / files.length) * 100);
        
        try {
          let result: ProcessingResult | undefined;
          
          // 检查是否需要使用 WASM 处理
          const needsWasm = wasmProcessor.isFormatSupported(options.format);
          
          if (needsWasm && wasmAvailable) {
            // 使用 WASM 处理高级格式
            const wasmResult = await wasmProcessor.processImage(file, {
              format: options.format as any,
              quality: options.quality,
              width: options.maxWidth || 1920,
              height: options.maxHeight || 1080
            });
            
            const compressedFile = new File([wasmResult.data as any], file.name, {
              type: wasmResult.mimeType,
              lastModified: Date.now()
            });
            
            result = {
              file: file,
              originalFile: file,
              processedFile: compressedFile,
              compressedFile: compressedFile,
              originalSize: file.size,
              processedSize: compressedFile.size,
              compressedSize: compressedFile.size,
              compressionRatio: calculateCompressionRatio(file.size, compressedFile.size),
              processingTime: 0,
              format: options.format,
              quality: options.quality,
              dimensions: {
                width: options.maxWidth || 1920,
                height: options.maxHeight || 1080
              }
            };
          } else if (workerAvailable) {
            // 使用 Web Worker 处理
            const workerResult = await workerManager.processImage(file, {
              quality: options.quality,
              maxWidth: options.maxWidth || 1920,
              maxHeight: options.maxHeight || 1080,
              format: options.format as 'jpeg' | 'png' | 'webp'
            });
            
            result = {
              file: file,
              originalFile: file,
              processedFile: workerResult.compressedFile,
              compressedFile: workerResult.compressedFile,
              originalSize: workerResult.originalSize,
              processedSize: workerResult.compressedSize,
              compressedSize: workerResult.compressedSize,
              compressionRatio: calculateCompressionRatio(workerResult.originalSize, workerResult.compressedSize),
              processingTime: 0,
              format: options.format,
              quality: options.quality,
              dimensions: {
                width: options.maxWidth || 1920,
                height: options.maxHeight || 1080
              }
            };
          } else {
            // 回退到 Canvas 处理
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            
            await new Promise((resolve, reject) => {
              img.onload = () => {
                let { width, height } = img;
                const maxWidth = options.maxWidth || 1920;
                const maxHeight = options.maxHeight || 1080;
                
                if (width > maxWidth || height > maxHeight) {
                  const ratio = Math.min(maxWidth / width, maxHeight / height);
                  width *= ratio;
                  height *= ratio;
                }
                
                canvas.width = width;
                canvas.height = height;
                ctx?.drawImage(img, 0, 0, width, height);
                
                canvas.toBlob((blob) => {
                  if (blob) {
                    const compressedFile = new File([blob], file.name, {
                      type: `image/${options.format}`,
                      lastModified: Date.now()
                    });
                    
                    result = {
                      file: file,
                      originalFile: file,
                      processedFile: compressedFile,
                      compressedFile: compressedFile,
                      originalSize: file.size,
                      processedSize: compressedFile.size,
                      compressedSize: compressedFile.size,
                      compressionRatio: calculateCompressionRatio(file.size, compressedFile.size),
                      processingTime: 0,
                      format: options.format,
                      quality: options.quality,
                      dimensions: { width, height }
                    };
                    resolve(result);
                  } else {
                    reject(new Error('Canvas conversion failed'));
                  }
                }, `image/${options.format}`, options.quality);
              };
              
              img.onerror = () => reject(new Error('Image loading failed'));
              img.src = URL.createObjectURL(file);
            });
          }
          
          if (result) {
            processingResults.push(result);
            setResults([...processingResults]);
          }
          
        } catch (fileError) {
          console.error(`Failed to process ${file.name}:`, fileError);
          // 继续处理其他文件
        }
      }
      
      setProgress(100);
      setCurrentFile('');
      setResults(processingResults);
      onResults(processingResults);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Processing failed';
      setError(errorMessage);
      onError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  }, [files, options, onResults, onError, workerAvailable]);
  
  const cancelProcessing = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsProcessing(false);
      setProgress(0);
      setCurrentFile('');
    }
  }, []);
  
  const retryProcessing = useCallback(() => {
    setError(null);
    processImages();
  }, [processImages]);
  
  if (isProcessing) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          <div className="text-center">
            <Loading size="lg" text={translations.processing} />
            <div className="mt-2 space-y-1">
              {wasmAvailable && (
                <p className="text-xs text-blue-600">
                  ✓ WASM processor ready for advanced formats
                </p>
              )}
              {workerAvailable && (
                <p className="text-xs text-green-600">
                  ✓ Web Worker available for optimal performance
                </p>
              )}
              {!workerAvailable && !wasmAvailable && (
                <p className="text-xs text-amber-600">
                  ⚠ Using fallback processing mode
                </p>
              )}
            </div>
          </div>
          
          <Progress
            value={progress}
            max={100}
            size="lg"
            showLabel
            label={`${Math.round(progress)}%`}
            animated
          />
          
          {currentFile && (
            <p className="text-sm text-neutral-600 text-center">
              Processing: {currentFile}
            </p>
          )}
          
          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={cancelProcessing}
              disabled={!abortControllerRef.current}
            >
              {translations.cancel}
            </Button>
          </div>
        </div>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center space-y-4">
          <div className="text-red-600">
            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <p className="text-lg font-medium">{translations.error}</p>
            <p className="text-sm text-neutral-600">{error}</p>
          </div>
          
          <div className="flex justify-center space-x-2">
            <Button onClick={retryProcessing}>
              {translations.retry}
            </Button>
            <Button variant="outline" onClick={() => setError(null)}>
              Dismiss
            </Button>
          </div>
        </div>
      </Card>
    );
  }
  
  if (results.length > 0) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-green-600 mb-2">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-lg font-medium">{translations.completed}</p>
            <p className="text-sm text-neutral-600">
              Successfully processed {results.length} file{results.length !== 1 ? 's' : ''}
            </p>
          </div>
          
          <div className="space-y-2">
            {results.map((result, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg"
              >
                <div className="flex-1">
                  <p className="font-medium text-sm">{result.file.name}</p>
                  <p className="text-xs text-neutral-500">
                    {formatFileSize(result.originalSize)} → {formatFileSize(result.processedSize)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-green-600">
                    -{result.compressionRatio}%
                  </p>
                  <p className="text-xs text-neutral-500">
                    {formatFileSize(result.originalSize - result.processedSize)} saved
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Card>
    );
  }
  
  return (
    <Card className="p-6">
      <div className="text-center">
        <p className="text-neutral-600 mb-4">
          Ready to process {files.length} file{files.length !== 1 ? 's' : ''}
        </p>
        <div className="mb-4 space-y-1">
          {wasmAvailable && (
            <p className="text-xs text-blue-600">
              ✓ WASM processor ready for advanced formats (AVIF, HEIC, BMP, TIFF, ICO)
            </p>
          )}
          {workerAvailable && (
            <p className="text-xs text-green-600">
              ✓ Web Worker available for optimal performance
            </p>
          )}
          {!workerAvailable && !wasmAvailable && (
            <p className="text-xs text-amber-600">
              ⚠ Advanced processors unavailable, using fallback mode
            </p>
          )}
        </div>
        <Button onClick={processImages} size="lg">
          Start Processing
        </Button>
      </div>
    </Card>
  );
}
