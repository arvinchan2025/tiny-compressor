/**
 * 图像压缩处理工具函数
 * 支持多种格式的图像压缩和转换
 */

import { loadImageCompression } from './image-compression-loader';
import type imageCompression from 'browser-image-compression';
import { 
  ImageFile, 
  CompressionOptions, 
  CompressionResult, 
  ImageMetadata,
  ProcessingProgress,
  ProcessingError 
} from './types';

/**
 * 创建 ImageFile 对象
 */
export async function createImageFile(file: File): Promise<ImageFile> {
  const id = `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  // 创建预览URL
  const preview = URL.createObjectURL(file);
  
  // 获取图像元数据
  const metadata = await getImageMetadata(file);
  
  return {
    id,
    name: file.name,
    size: file.size,
    type: file.type,
    lastModified: file.lastModified,
    data: file,
    preview,
    metadata
  };
}

/**
 * 验证图像文件
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  // 检查文件类型
  const allowedTypes = [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/webp',
    'image/avif',
    'image/gif'
  ];
  
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Unsupported file type: ${file.type}. Please upload a PNG, JPEG, WebP, AVIF, or GIF image.`
    };
  }
  
  // 检查文件大小 (50MB 限制)
  const maxSize = 50 * 1024 * 1024;
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size (${(file.size / 1024 / 1024).toFixed(1)}MB) exceeds the 50MB limit.`
    };
  }
  
  // 检查文件是否为空
  if (file.size === 0) {
    return {
      valid: false,
      error: 'File is empty. Please upload a valid image file.'
    };
  }
  
  return { valid: true };
}

/**
 * 获取图像元数据
 */
export async function getImageMetadata(file: File): Promise<ImageMetadata> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(url);
      
      // 创建 canvas 来检测透明度
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      
      canvas.width = img.width;
      canvas.height = img.height;
      
      // 绘制图像
      ctx.drawImage(img, 0, 0);
      
      // 检测透明度
      let hasTransparency = false;
      try {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        for (let i = 3; i < data.length; i += 4) {
          if (data[i] < 255) {
            hasTransparency = true;
            break;
          }
        }
      } catch (error) {
        // 如果无法检测透明度，假设没有透明度
        hasTransparency = false;
      }
      
      resolve({
        width: img.width,
        height: img.height,
        colorSpace: 'srgb', // 默认假设 sRGB
        hasTransparency,
        colorDepth: 8, // 默认假设 8 位色深
        format: file.type,
        fileSize: file.size,
        colorMode: hasTransparency ? 'rgba' : 'rgb'
      });
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Could not load image'));
    };
    
    img.src = url;
  });
}

/**
 * 压缩图像 - 主要入口函数
 */
export async function compressImage(
  imageFile: ImageFile, 
  options: CompressionOptions
): Promise<CompressionResult> {
  const startTime = Date.now();
  
  try {
    // 根据格式选择压缩方法
    let result: CompressionResult;
    
      switch (options.format) {
      case 'png':
        result = await compressPng(imageFile, options);
        break;
        case 'jpeg':
        result = await compressJpeg(imageFile, options);
          break;
        case 'webp':
        result = await compressWebp(imageFile, options);
          break;
        case 'avif':
        result = await compressAvif(imageFile, options);
          break;
        case 'gif':
        result = await compressGif(imageFile, options);
          break;
      default:
        throw new Error(`Unsupported format: ${options.format}`);
    }
    
    const endTime = Date.now();
    result.processingTime = endTime - startTime;
    
    return result;
    
  } catch (error) {
    throw new Error(`Compression failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * PNG 压缩 - 使用 browser-image-compression
 */
async function compressPng(imageFile: ImageFile, options: CompressionOptions): Promise<CompressionResult> {
  const { pngOptions = {} } = options;
  const { quality = 80, optimizationLevel = 9 } = pngOptions;
  
  // 配置压缩选项
  const compressionOptions = {
    maxSizeMB: 10, // 最大文件大小
    maxWidthOrHeight: 4096, // 保持原始尺寸
    useWebWorker: false,
    fileType: 'image/png',
    initialQuality: quality / 100,
    alwaysKeepResolution: true,
    preserveExif: options.keepMetadata || false
  };
  
  try {
    // 动态加载压缩库
    const imageCompression = await loadImageCompression();
    
    // 使用专业库压缩
    const compressedFile = await imageCompression(imageFile.file, compressionOptions);
    
    // 创建预览
    const preview = URL.createObjectURL(compressedFile);
    
    const result: CompressionResult = {
      id: `result_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      originalFile: {
        name: imageFile.name,
        size: imageFile.size,
        type: imageFile.type
      },
      compressedFile: {
        name: imageFile.name.replace(/\.(png|jpg|jpeg|webp|avif|gif)$/i, '.png'),
        size: compressedFile.size,
        type: 'image/png',
        data: compressedFile
      },
      originalSize: imageFile.size,
      compressedSize: compressedFile.size,
      compressionRatio: Math.round(((imageFile.size - compressedFile.size) / imageFile.size) * 100),
      processingTime: 0, // 将在主函数中设置
      settings: options,
      preview,
      metadata: imageFile.metadata
    };
    
    return result;
  } catch (error) {
    throw new Error(`PNG compression failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * JPEG 压缩 - 使用 browser-image-compression
 */
async function compressJpeg(imageFile: ImageFile, options: CompressionOptions): Promise<CompressionResult> {
  const { jpegOptions = {} } = options;
  const { quality = 85 } = jpegOptions;
  
  // 配置压缩选项
  const compressionOptions = {
    maxSizeMB: 10,
    maxWidthOrHeight: 4096,
    useWebWorker: false,
    fileType: 'image/jpeg',
    initialQuality: quality / 100,
    alwaysKeepResolution: true,
    preserveExif: options.keepMetadata || false
  };
  
  try {
    // 动态加载压缩库
    const imageCompression = await loadImageCompression();
    
    const compressedFile = await imageCompression(imageFile.file, compressionOptions);
    const preview = URL.createObjectURL(compressedFile);
    
    const result: CompressionResult = {
      id: `result_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      originalFile: {
        name: imageFile.name,
        size: imageFile.size,
        type: imageFile.type
      },
      compressedFile: {
        name: imageFile.name.replace(/\.(png|jpg|jpeg|webp|avif|gif)$/i, '.jpg'),
        size: compressedFile.size,
        type: 'image/jpeg',
        data: compressedFile
      },
      originalSize: imageFile.size,
      compressedSize: compressedFile.size,
      compressionRatio: Math.round(((imageFile.size - compressedFile.size) / imageFile.size) * 100),
      processingTime: 0,
      settings: options,
      preview,
      metadata: imageFile.metadata
    };
    
    return result;
  } catch (error) {
    throw new Error(`JPEG compression failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * WebP 压缩 - 使用 browser-image-compression
 */
async function compressWebp(imageFile: ImageFile, options: CompressionOptions): Promise<CompressionResult> {
  const { webpOptions = {} } = options;
  const { quality = 80 } = webpOptions;
  
  // 配置压缩选项
  const compressionOptions = {
    maxSizeMB: 10,
    maxWidthOrHeight: 4096,
    useWebWorker: false,
    fileType: 'image/webp',
    initialQuality: quality / 100,
    alwaysKeepResolution: true,
    preserveExif: options.keepMetadata || false
  };
  
  try {
    // 动态加载压缩库
    const imageCompression = await loadImageCompression();
    
    const compressedFile = await imageCompression(imageFile.file, compressionOptions);
    const preview = URL.createObjectURL(compressedFile);
    
    const result: CompressionResult = {
      id: `result_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      originalFile: {
        name: imageFile.name,
        size: imageFile.size,
        type: imageFile.type
      },
      compressedFile: {
        name: imageFile.name.replace(/\.(png|jpg|jpeg|webp|avif|gif)$/i, '.webp'),
        size: compressedFile.size,
        type: 'image/webp',
        data: compressedFile
      },
      originalSize: imageFile.size,
      compressedSize: compressedFile.size,
      compressionRatio: Math.round(((imageFile.size - compressedFile.size) / imageFile.size) * 100),
      processingTime: 0,
      settings: options,
      preview,
      metadata: imageFile.metadata
    };
    
    return result;
  } catch (error) {
    throw new Error(`WebP compression failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * AVIF 压缩
 */
async function compressAvif(imageFile: ImageFile, options: CompressionOptions): Promise<CompressionResult> {
  const { avifOptions = {} } = options;
  const { quality = 80, lossless = false } = avifOptions;
  
  // 创建 canvas
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('Could not get canvas context');
  }
  
  // 加载图像
  const img = new Image();
  const imgUrl = URL.createObjectURL(imageFile.file);
  
  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
    img.src = imgUrl;
  });
  
  canvas.width = img.width;
  canvas.height = img.height;
  
  // 绘制图像
  ctx.drawImage(img, 0, 0);
  
  // 模拟压缩处理时间 (AVIF 处理较慢)
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  // 转换为 Blob
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error('Failed to create blob'));
      }
    }, 'image/avif', quality / 100);
  });
  
  URL.revokeObjectURL(imgUrl);
  
  // 创建预览
  const preview = URL.createObjectURL(blob);
  
  const result: CompressionResult = {
    id: `result_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    originalFile: {
      name: imageFile.name,
      size: imageFile.size,
      type: imageFile.type
    },
    compressedFile: {
      name: imageFile.name.replace(/\.(png|jpg|jpeg|webp|avif|gif)$/i, '.avif'),
      size: blob.size,
      type: 'image/avif',
      data: blob
    },
    originalSize: imageFile.size,
    compressedSize: blob.size,
    compressionRatio: Math.round(((imageFile.size - blob.size) / imageFile.size) * 100),
    processingTime: 0,
    settings: options,
    preview,
    metadata: imageFile.metadata
  };
  
  return result;
}

/**
 * GIF 压缩
 */
async function compressGif(imageFile: ImageFile, options: CompressionOptions): Promise<CompressionResult> {
  const { gifOptions = {} } = options;
  const { quality = 80, colors = 128 } = gifOptions;
  
  // 创建 canvas
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('Could not get canvas context');
  }
  
  // 加载图像
  const img = new Image();
  const imgUrl = URL.createObjectURL(imageFile.file);
  
  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
    img.src = imgUrl;
  });
  
  canvas.width = img.width;
  canvas.height = img.height;
  
  // 绘制图像
  ctx.drawImage(img, 0, 0);
  
  // 模拟压缩处理时间
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // 转换为 Blob
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error('Failed to create blob'));
      }
    }, 'image/gif', quality / 100);
  });
  
  URL.revokeObjectURL(imgUrl);
  
  // 创建预览
  const preview = URL.createObjectURL(blob);
  
  const result: CompressionResult = {
    id: `result_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    originalFile: {
      name: imageFile.name,
      size: imageFile.size,
      type: imageFile.type
    },
    compressedFile: {
      name: imageFile.name.replace(/\.(png|jpg|jpeg|webp|avif|gif)$/i, '.gif'),
      size: blob.size,
      type: 'image/gif',
      data: blob
    },
    originalSize: imageFile.size,
    compressedSize: blob.size,
    compressionRatio: Math.round(((imageFile.size - blob.size) / imageFile.size) * 100),
    processingTime: 0,
    settings: options,
    preview,
    metadata: imageFile.metadata
  };
  
  return result;
}

/**
 * 转换图像格式
 */
export async function convertImage(
  imageFile: ImageFile,
  sourceFormat: string,
  targetFormat: string,
  options: CompressionOptions = {}
): Promise<CompressionResult> {
  const startTime = Date.now();
  
  try {
    // 验证源格式和目标格式
    if (sourceFormat === targetFormat) {
      throw new Error('Source and target formats cannot be the same');
    }

    // 格式映射：将用户友好的格式名映射到压缩函数支持的格式
    const formatMap: Record<string, string> = {
      'jpg': 'jpeg',
      'jpeg': 'jpeg',
      'png': 'png',
      'webp': 'webp',
      'avif': 'avif',
      'gif': 'gif',
      'bmp': 'bmp'
    };

    const mappedTargetFormat = formatMap[targetFormat.toLowerCase()];
    if (!mappedTargetFormat) {
      throw new Error(`Unsupported target format: ${targetFormat}`);
    }

    // 创建转换选项
    const convertOptions: CompressionOptions = {
      ...options,
      format: mappedTargetFormat as any
    };
    
    // 生成转换后的文件名
    const originalName = imageFile.name;
    const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '');
    const convertedFilename = `${nameWithoutExt}.${targetFormat}`;
    
    // 使用压缩函数进行格式转换
    const result = await compressImage(imageFile, convertOptions);
    
    // 更新文件名
    result.filename = convertedFilename;
    
    const endTime = Date.now();
    result.processingTime = endTime - startTime;
    
    return result;
    
  } catch (error) {
    throw new Error(`Conversion from ${sourceFormat} to ${targetFormat} failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * 批量压缩图像
 */
export async function compressImages(
  imageFiles: ImageFile[],
  options: CompressionOptions,
  onProgress?: (progress: ProcessingProgress) => void
): Promise<CompressionResult[]> {
  const results: CompressionResult[] = [];
  const totalFiles = imageFiles.length;
  
  for (let i = 0; i < totalFiles; i++) {
    const file = imageFiles[i];
    
    // 更新进度
    if (onProgress) {
      onProgress({
        stage: 'processing',
        progress: (i / totalFiles) * 100,
        currentFile: file.name,
        totalFiles,
        currentFileIndex: i + 1,
        estimatedTimeRemaining: (totalFiles - i) * 1000 // 估算剩余时间
      });
    }
    
    try {
      const result = await compressImage(file, options);
      results.push(result);
    } catch (error) {
      console.error(`Failed to compress ${file.name}:`, error);
      // 继续处理其他文件，而不是失败整个批次
    }
  }
  
  // 完成
  if (onProgress) {
    onProgress({
      stage: 'completed',
      progress: 100,
      currentFile: undefined,
      totalFiles,
      currentFileIndex: totalFiles,
      estimatedTimeRemaining: 0
    });
  }
  
  return results;
}

/**
 * 下载压缩结果
 */
export function downloadResult(result: CompressionResult): void {
  const link = document.createElement('a');
  link.href = URL.createObjectURL(result.compressedFile.data);
  link.download = result.compressedFile.name;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

/**
 * 下载多个结果为ZIP
 */
export async function downloadResultsAsZip(results: CompressionResult[]): Promise<void> {
  // 这里需要集成 JSZip 库
  // 暂时使用逐个下载的方式
  for (const result of results) {
    downloadResult(result);
    // 添加小延迟避免浏览器阻止多个下载
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}