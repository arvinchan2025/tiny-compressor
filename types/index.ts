/**
 * 全局类型定义
 * 遵循严格 TypeScript 标准
 */

// 支持的语言类型
export type SupportedLanguage = 'en' | 'zh' | 'es' | 'de' | 'fr' | 'ar';

// 图片格式类型
export type ImageFormat = 'jpeg' | 'png' | 'webp' | 'avif' | 'heic' | 'bmp' | 'tiff' | 'ico' | 'svg' | 'gif';

// 压缩模式类型
export type CompressionMode = 'quick' | 'custom';

// 压缩质量类型
export type CompressionQuality = 0.1 | 0.2 | 0.3 | 0.4 | 0.5 | 0.6 | 0.7 | 0.8 | 0.9 | 1.0;

// 文件大小类型（字节）
export type FileSize = number;

// 图片文件接口
export interface ImageFile {
  readonly file: File;
  readonly preview: string;
  readonly size: FileSize;
  readonly type: string;
  readonly name: string;
  readonly lastModified: number;
}

// 压缩选项接口
export interface CompressionOptions {
  readonly quality: CompressionQuality;
  readonly maxWidth?: number;
  readonly maxHeight?: number;
  readonly format: ImageFormat;
  readonly preserveMetadata?: boolean;
}

// 转换选项接口
export interface ConversionOptions {
  readonly fromFormat: ImageFormat;
  readonly toFormat: ImageFormat;
  readonly quality: CompressionQuality;
  readonly maxWidth?: number;
  readonly maxHeight?: number;
}

// 处理结果接口
export interface ProcessingResult {
  readonly file: File;
  readonly originalFile: File;
  readonly processedFile: File;
  readonly compressedFile: File;
  readonly originalSize: FileSize;
  readonly processedSize: FileSize;
  readonly compressedSize: FileSize;
  readonly compressionRatio: number;
  readonly processingTime: number;
  readonly quality?: CompressionQuality;
  readonly format?: string;
  readonly dimensions?: {
    readonly width: number;
    readonly height: number;
  };
}

// 批量处理结果接口
export interface BatchProcessingResult {
  readonly results: readonly ProcessingResult[];
  readonly totalOriginalSize: FileSize;
  readonly totalProcessedSize: FileSize;
  readonly totalCompressionRatio: number;
  readonly totalProcessingTime: number;
}

// 错误类型
export interface ProcessingError {
  readonly code: string;
  readonly message: string;
  readonly details?: unknown;
}

// 组件 Props 基础接口
export interface BaseComponentProps {
  readonly className?: string;
  readonly children?: React.ReactNode;
}

// 语言信息接口
export interface LanguageInfo {
  readonly name: string;
  readonly nativeName: string;
  readonly flag: string;
  readonly direction: 'ltr' | 'rtl';
  readonly locale: string;
}

// API 响应接口
export interface ApiResponse<T = unknown> {
  readonly success: boolean;
  readonly data?: T;
  readonly error?: string;
  readonly message?: string;
}

// 分页接口
export interface Pagination {
  readonly page: number;
  readonly limit: number;
  readonly total: number;
  readonly totalPages: number;
}

// 排序接口
export interface SortOptions {
  readonly field: string;
  readonly direction: 'asc' | 'desc';
}

// 过滤接口
export interface FilterOptions {
  readonly search?: string;
  readonly format?: ImageFormat;
  readonly sizeRange?: {
    readonly min: FileSize;
    readonly max: FileSize;
  };
  readonly dateRange?: {
    readonly start: Date;
    readonly end: Date;
  };
}

// 类型已通过接口定义导出，无需重复导出
