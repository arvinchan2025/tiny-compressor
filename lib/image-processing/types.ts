/**
 * 图像处理相关类型定义
 */

export interface CompressionOptions {
  format: 'png' | 'jpeg' | 'webp' | 'avif' | 'gif'|'bmp';
  quality?: number;
  keepMetadata?: boolean;
  progressive?: boolean;

  
  // PNG 特定选项
  lossless?: boolean;
  optimizationLevel: number;

  pngOptions?: {
    quality: number;
    lossless: boolean;
    optimizationLevel: number;
  };
  
  // JPEG 特定选项
  optimizeHuffman?: boolean;
  colorSpace?: 'auto' | 'srgb' | 'ycbcr';
  jpegOptions?: {
    quality: number;
    progressive: boolean;
    optimizeHuffman: boolean;
    colorSpace: 'auto' | 'srgb' | 'ycbcr';
  };
  
  // WebP 特定选项
  method?: number;
  webpOptions?: {
    quality: number;
    lossless: boolean;
    method: number;
  };
  
  // AVIF 特定选项
  speed: number;
  avifOptions?: {
    quality: number;
    lossless: boolean;
    colorSpace: 'srgb' | 'rec2020' | 'p3';
    speed: number;
  };
  
  // GIF 特定选项
  optimizeFrames: boolean;
  colors: number;
  gifOptions?: {
    quality: number;
    lossless: boolean;
    optimizationLevel: number;
    optimizeFrames: boolean;
    colors: number;
  };
}

export interface CompressionResult {
  id: string;
  originalFile: {
    name: string;
    size: number;
    type: string;
  };
  compressedFile: {
    name: string;
    size: number;
    type: string;
    data: Blob;
  };
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  processingTime: number;
  settings: CompressionOptions;
  preview?: string;
  metadata?: {
    width: number;
    height: number;
    colorSpace?: string;
    hasTransparency?: boolean;
    colorDepth?: number;
  };
}

export interface ConversionResult {
  id: string;
  originalFile: {
    name: string;
    size: number;
    type: string;
  };
  convertedFile: {
    name: string;
    size: number;
    type: string;
    data: Blob;
  };
  originalSize: number;
  convertedSize: number;
  conversionRatio: number;
  processingTime: number;
  settings: {
    sourceFormat: string;
    targetFormat: string;
    quality: number;
    backgroundColor?: string;
    keepMetadata: boolean;
    optimizationLevel: number;
    progressive?: boolean;
  };
  preview?: string;
  metadata?: {
    width: number;
    height: number;
    colorSpace?: string;
    hasTransparency?: boolean;
    colorDepth?: number;
  };
}

export interface ImageMetadata {
  width: number;
  height: number;
  colorSpace: string;
  hasTransparency: boolean;
  colorDepth: number;
  format: string;
  fileSize: number;
  colorMode: 'rgb' | 'rgba' | 'grayscale' | 'grayscale-alpha' | 'palette' | 'palette-alpha';
}

export interface ProcessingProgress {
  stage: 'analyzing' | 'processing' | 'optimizing' | 'finalizing' | 'completed';
  progress: number; // 0-100
  currentFile?: string;
  totalFiles?: number;
  currentFileIndex?: number;
  estimatedTimeRemaining?: number;
}

export interface ProcessingError {
  code: string;
  message: string;
  file?: string;
  details?: any;
}

export interface BatchProcessingResult {
  results: CompressionResult[];
  totalFiles: number;
  successfulFiles: number;
  failedFiles: number;
  totalOriginalSize: number;
  totalCompressedSize: number;
  totalProcessingTime: number;
  errors: ProcessingError[];
}

export interface CompressionPreset {
  name: string;
  description: string;
  settings: Partial<CompressionOptions>;
  category: 'web' | 'print' | 'storage' | 'quality' | 'speed';
}

export interface FormatCapabilities {
  format: string;
  supportsTransparency: boolean;
  supportsAnimation: boolean;
  supportsLossless: boolean;
  supportsLossy: boolean;
  maxDimensions: {
    width: number;
    height: number;
  };
  maxFileSize: number;
  colorSpaces: string[];
  compressionMethods: string[];
}

export interface ProcessingStats {
  startTime: number;
  endTime?: number;
  totalTime?: number;
  filesProcessed: number;
  bytesProcessed: number;
  bytesSaved: number;
  averageCompressionRatio: number;
  errors: number;
  warnings: number;
}

export interface WorkerMessage {
  type: 'start' | 'progress' | 'complete' | 'error' | 'abort';
  data?: any;
  id?: string;
}

export interface CompressionWorkerMessage extends WorkerMessage {
  type: 'start' | 'progress' | 'complete' | 'error' | 'abort';
  data?: {
    file?: ImageFile;
    options?: CompressionOptions;
    result?: CompressionResult;
    error?: ProcessingError;
    progress?: ProcessingProgress;
  };
}

// 重新导出 ImageFile 类型（如果不存在的话）
export interface ImageFile {
  id: string;
  name: string;
  size: number;
  type: string;
  lastModified: number;
  data: File;
  preview?: string;
  metadata?: ImageMetadata;
}
