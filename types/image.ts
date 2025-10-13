/**
 * 图片处理相关类型定义
 */

export interface ImageFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  url: string;
  width?: number;
  height?: number;
  compressedSize?: number;
  compressionRatio?: number;
  quality?: number;
}

export interface CompressionOptions {
  quality: number;
  maxWidth?: number;
  maxHeight?: number;
  format?: 'jpeg' | 'png' | 'webp' | 'avif' | 'gif' | 'heic';
  keepMetadata?: boolean;
  progressive?: boolean;
  // JPEG specific options
  jpegOptions?: {
    quality: number;
    progressive: boolean;
    optimizeHuffman: boolean;
    colorSpace: 'auto' | 'srgb' | 'adobe';
  };
  // PNG specific options
  pngOptions?: {
    quality: number;
    lossless: boolean;
    optimizationLevel: number;
  };
  // WebP specific options
  webpOptions?: {
    quality: number;
    lossless: boolean;
    method: number;
  };
  // AVIF specific options
  avifOptions?: {
    quality: number;
    lossless: boolean;
    colorSpace: 'srgb' | 'p3' | 'rec2020';
    speed: number;
  };
  // GIF specific options
  gifOptions?: {
    quality: number;
    lossless: boolean;
    optimizationLevel: number;
    optimizeFrames: boolean;
    colors: number;
  };
  // HEIC specific options
  heicOptions?: {
    quality: number;
    lossless: boolean;
    colorSpace: 'srgb' | 'p3' | 'rec2020';
    speed: number;
  };
}

export interface CompressionResult {
  originalFile: ImageFile;
  compressedFile: File;
  compressedSize: number;
  compressionRatio: number;
  processingTime: number;
  format: string;
}

export interface BatchCompressionResult {
  results: CompressionResult[];
  totalOriginalSize: number;
  totalCompressedSize: number;
  totalCompressionRatio: number;
  processingTime: number;
}

export interface ImageFormat {
  name: string;
  extension: string;
  mimeType: string;
  description: string;
  features: string[];
  supported: boolean;
}

export interface ConversionOptions {
  fromFormat: string;
  toFormat: string;
  quality?: number;
  lossless?: boolean;
  preserveTransparency?: boolean;
}

export interface ConversionResult {
  originalFile: ImageFile;
  convertedFile: File;
  fromFormat: string;
  toFormat: string;
  processingTime: number;
}

export const SUPPORTED_FORMATS: ImageFormat[] = [
  {
    name: 'JPEG',
    extension: '.jpg',
    mimeType: 'image/jpeg',
    description: 'Lossy compression, good for photos',
    features: ['Lossy', 'Small file size', 'Wide compatibility'],
    supported: true
  },
  {
    name: 'PNG',
    extension: '.png',
    mimeType: 'image/png',
    description: 'Lossless compression, supports transparency',
    features: ['Lossless', 'Transparency', 'High quality'],
    supported: true
  },
  {
    name: 'WebP',
    extension: '.webp',
    mimeType: 'image/webp',
    description: 'Modern format, better compression than JPEG/PNG',
    features: ['Lossy/Lossless', 'Small file size', 'Transparency'],
    supported: true
  },
  {
    name: 'AVIF',
    extension: '.avif',
    mimeType: 'image/avif',
    description: 'Next-gen format, excellent compression',
    features: ['Lossy/Lossless', 'Smallest file size', 'Modern browsers'],
    supported: true
  },
  {
    name: 'GIF',
    extension: '.gif',
    mimeType: 'image/gif',
    description: 'Animation support, limited colors',
    features: ['Animation', 'Transparency', 'Limited colors'],
    supported: true
  },
  {
    name: 'HEIC',
    extension: '.heic',
    mimeType: 'image/heic',
    description: 'Apple\'s efficient image format',
    features: ['Lossy/Lossless', 'Small file size', 'Apple devices'],
    supported: true
  }
];

export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
export const MAX_FILES_COUNT = 20;
