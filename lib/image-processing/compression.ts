/**
 * 图片压缩核心功能
 */

import imageCompression from 'browser-image-compression';
import { ImageFile, CompressionOptions, CompressionResult, ImageFormat } from '@/types/image';

/**
 * 获取图片信息
 */
export async function getImageInfo(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight
      });
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };
    
    img.src = url;
  });
}

/**
 * 创建图片文件对象
 */
export async function createImageFile(file: File): Promise<ImageFile> {
  const imageInfo = await getImageInfo(file);
  
  return {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    file,
    name: file.name,
    size: file.size,
    type: file.type,
    url: URL.createObjectURL(file),
    width: imageInfo.width,
    height: imageInfo.height
  };
}

/**
 * 压缩单张图片
 */
export async function compressImage(
  imageFile: ImageFile, 
  options: CompressionOptions
): Promise<CompressionResult> {
  const startTime = Date.now();
  
  try {
    const compressionOptions: any = {
      maxSizeMB: options.quality / 100,
      useWebWorker: true,
      initialQuality: options.quality / 100,
      alwaysKeepResolution: false,
      exifOrientation: options.keepMetadata ? 1 : 0
    };

    // 只有当maxWidth或maxHeight存在时才添加
    if (options.maxWidth || options.maxHeight) {
      compressionOptions.maxWidthOrHeight = options.maxWidth || options.maxHeight;
    }

    // 根据格式设置文件类型
    if (options.format) {
      switch (options.format) {
        case 'jpeg':
          compressionOptions.fileType = 'image/jpeg';
          break;
        case 'png':
          compressionOptions.fileType = 'image/png';
          break;
        case 'webp':
          compressionOptions.fileType = 'image/webp';
          break;
        case 'avif':
          compressionOptions.fileType = 'image/avif';
          break;
        case 'gif':
          compressionOptions.fileType = 'image/gif';
          break;
      }
    }

    const compressedFile = await imageCompression(imageFile.file, compressionOptions);
    const processingTime = Date.now() - startTime;
    const compressionRatio = ((imageFile.size - compressedFile.size) / imageFile.size) * 100;

    return {
      originalFile: imageFile,
      compressedFile,
      compressedSize: compressedFile.size,
      compressionRatio,
      processingTime,
      format: compressedFile.type
    };
  } catch (error) {
    throw new Error(`Compression failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * 批量压缩图片
 */
export async function batchCompressImages(
  imageFiles: ImageFile[],
  options: CompressionOptions
): Promise<CompressionResult[]> {
  const results: CompressionResult[] = [];
  
  for (const imageFile of imageFiles) {
    try {
      const result = await compressImage(imageFile, options);
      results.push(result);
    } catch (error) {
      console.error(`Failed to compress ${imageFile.name}:`, error);
      // 继续处理其他文件
    }
  }
  
  return results;
}

/**
 * 智能压缩（根据文件类型选择最佳压缩方式）
 */
export async function smartCompress(
  imageFile: ImageFile,
  targetSizeKB?: number
): Promise<CompressionResult> {
  const format = getOptimalFormat(imageFile.type);
  
  let quality = 85; // 默认质量
  if (targetSizeKB && imageFile.size > targetSizeKB * 1024) {
    // 根据目标大小估算质量
    quality = Math.max(10, Math.min(95, (targetSizeKB * 1024 / imageFile.size) * 100));
  }

  const options: CompressionOptions = {
    quality,
    format: format as any,
    keepMetadata: false,
    progressive: true
  };

  return compressImage(imageFile, options);
}

/**
 * 获取最佳格式
 */
function getOptimalFormat(mimeType: string): string {
  if (mimeType.includes('png')) {
    return 'webp'; // PNG 转 WebP 通常有更好的压缩
  }
  if (mimeType.includes('jpeg') || mimeType.includes('jpg')) {
    return 'jpeg'; // 保持 JPEG 格式
  }
  return 'webp'; // 默认使用 WebP
}

/**
 * 验证文件类型
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const supportedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];
  
  if (!supportedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Unsupported file format. Please use JPEG, PNG, WebP, GIF, or AVIF.'
    };
  }
  
  const maxSize = 50 * 1024 * 1024; // 50MB
  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'File size too large. Please use files smaller than 50MB.'
    };
  }
  
  return { valid: true };
}

/**
 * 格式化文件大小
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * 计算压缩比例
 */
export function calculateCompressionRatio(originalSize: number, compressedSize: number): number {
  return Math.round(((originalSize - compressedSize) / originalSize) * 100);
}
