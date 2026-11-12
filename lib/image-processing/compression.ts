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
 * PNG 压缩 - 使用 browser-image-compression 或 Canvas API
 */
async function compressPng(imageFile: ImageFile, options: CompressionOptions): Promise<CompressionResult> {
  // const { pngOptions = {} } = options;
  const { optimizationLevel = 9 } = options;
  
  // 验证 imageFile.data 是否有效
  if (!imageFile.data || (!(imageFile.data instanceof File) && !(imageFile.data instanceof Blob))) {
    throw new Error('Invalid image file data');
  }
  
  const originalSize = imageFile.size;
  console.log('🔄 Starting PNG compression...');
  console.log('📊 Original file size:', originalSize, 'bytes (', (originalSize / 1024).toFixed(2), 'KB)');
  
  // 首先尝试使用 browser-image-compression（它支持 PNG）
  try {
    console.log('📸 Attempting compression with browser-image-compression...');
    
    // 动态加载压缩库
    const imageCompression = await loadImageCompression();
    
    // 配置压缩选项
    // browser-image-compression 对 PNG 的支持有限，但可以尝试
    const compressionOptions = {
      maxSizeMB: 10,
      maxWidthOrHeight: 4096,
      useWebWorker: false,
      fileType: 'image/png',
      // PNG 是无损的，quality 参数对 PNG 无效，但可以设置
      initialQuality: 1.0, // PNG 使用最高质量
      alwaysKeepResolution: true,
      preserveExif: options.keepMetadata || false
    };
    
    console.log('⚙️ Compression options:', compressionOptions);
    
    const compressedFile = await imageCompression(imageFile.data, compressionOptions);
    
    console.log('✅ Compression completed');
    console.log('📊 Compressed size:', compressedFile.size, 'bytes (', (compressedFile.size / 1024).toFixed(2), 'KB)');
    console.log('📉 Compression ratio:', ((originalSize - compressedFile.size) / originalSize * 100).toFixed(1) + '%');
    
    // 如果压缩后文件更大，使用原始文件
    const finalFile = compressedFile.size < originalSize ? compressedFile : imageFile.data;
    const finalSize = compressedFile.size < originalSize ? compressedFile.size : originalSize;
    
    if (compressedFile.size >= originalSize) {
      console.warn(`⚠️ Compressed file is larger (${compressedFile.size} >= ${originalSize}). Using original file.`);
    }
    
    // 确保 finalFile 是 File 或 Blob
    const finalBlob = finalFile instanceof File ? finalFile : (finalFile instanceof Blob ? finalFile : new Blob([finalFile], { type: 'image/png' }));
    
    // 创建预览
    const preview = URL.createObjectURL(finalBlob);
    
    const result: CompressionResult = {
      id: `result_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      originalFile: {
        name: imageFile.name,
        size: originalSize,
        type: imageFile.type
      },
      compressedFile: {
        name: imageFile.name.replace(/\.(png|jpg|jpeg|webp|avif|gif)$/i, '.png'),
        size: finalSize,
        type: 'image/png',
        data: finalBlob
      },
      originalSize: originalSize,
      compressedSize: finalSize,
      compressionRatio: Math.round(((originalSize - finalSize) / originalSize) * 100),
      processingTime: 0,
      settings: options,
      preview,
      metadata: imageFile.metadata
    };
    
    return result;
    
  } catch (compressionError) {
    const errorMessage = compressionError instanceof Error ? compressionError.message : String(compressionError);
    console.error('❌ browser-image-compression failed:', errorMessage);
    console.warn('⚠️ Falling back to Canvas API...');
    
    // 回退到 Canvas API
    try {
      return await compressPngWithCanvas(imageFile, options);
    } catch (canvasError) {
      const canvasErrorMessage = canvasError instanceof Error ? canvasError.message : String(canvasError);
      console.error('❌ Canvas compression also failed:', canvasErrorMessage);
      throw new Error(`PNG compression failed. Compression library: ${errorMessage}. Canvas: ${canvasErrorMessage}`);
    }
  }
}

/**
 * PNG 压缩 - 使用 Canvas API（回退方案）
 */
async function compressPngWithCanvas(imageFile: ImageFile, options: CompressionOptions): Promise<CompressionResult> {
  const { pngOptions = {} } = options;
  
  // 验证 imageFile.data 是否有效
  if (!imageFile.data || !(imageFile.data instanceof File) && !(imageFile.data instanceof Blob)) {
    throw new Error('Invalid image file data');
  }
  
  return new Promise((resolve, reject) => {
    const img = new Image();
    // 使用 imageFile.data 而不是 imageFile.file
    let url: string;
    try {
      url = URL.createObjectURL(imageFile.data);
    } catch (error) {
      reject(new Error(`Failed to create object URL: ${error instanceof Error ? error.message : 'Unknown error'}`));
      return;
    }
    
    img.onload = () => {
      try {
        // 创建 canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          URL.revokeObjectURL(url);
          reject(new Error('Could not get canvas context'));
          return;
        }
        
        canvas.width = img.width;
        canvas.height = img.height;
        
        // 绘制图像
        ctx.drawImage(img, 0, 0);
        
        // 转换为 Blob（PNG 格式）
        canvas.toBlob((blob) => {
          URL.revokeObjectURL(url);
          
          if (!blob) {
            reject(new Error('Failed to create blob'));
            return;
          }
          
          // 创建 File 对象
          const compressedFile = new File([blob], 
            imageFile.name.replace(/\.(png|jpg|jpeg|webp|avif|gif)$/i, '.png'),
            { type: 'image/png' }
          );
          
          // 创建预览
          let preview: string;
          try {
            preview = URL.createObjectURL(blob);
          } catch (error) {
            reject(new Error(`Failed to create preview URL: ${error instanceof Error ? error.message : 'Unknown error'}`));
            return;
          }
          
          console.log('📊 Canvas re-encoded size:', blob.size, 'bytes (', (blob.size / 1024).toFixed(2), 'KB)');
          console.log('📊 Original size:', imageFile.size, 'bytes (', (imageFile.size / 1024).toFixed(2), 'KB)');
          
          // Canvas 重新编码通常不会压缩，如果文件更大，使用原始文件
          const finalBlob = blob.size < imageFile.size ? blob : imageFile.data;
          const finalSize = blob.size < imageFile.size ? blob.size : imageFile.size;
          const finalFileName = blob.size < imageFile.size 
            ? compressedFile.name
            : imageFile.name;
          
          if (blob.size >= imageFile.size) {
            console.warn(`⚠️ Canvas re-encoding resulted in larger file (${blob.size} >= ${imageFile.size}). Using original file.`);
          }
          
          // 如果使用原始文件，需要创建新的预览 URL
          const finalPreview = blob.size < imageFile.size 
            ? preview 
            : (imageFile.preview || URL.createObjectURL(imageFile.data));
          
          const result: CompressionResult = {
            id: `result_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            originalFile: {
              name: imageFile.name,
              size: imageFile.size,
              type: imageFile.type
            },
            compressedFile: {
              name: finalFileName,
              size: finalSize,
              type: 'image/png',
              data: finalBlob instanceof Blob ? finalBlob : new Blob([finalBlob], { type: 'image/png' })
            },
            originalSize: imageFile.size,
            compressedSize: finalSize,
            compressionRatio: Math.round(((imageFile.size - finalSize) / imageFile.size) * 100),
            processingTime: 0,
            settings: options,
            preview: finalPreview,
            metadata: imageFile.metadata
          };
          
          resolve(result);
        }, 'image/png', 1.0); // 使用最高质量（PNG 是无损的）
      } catch (error) {
        URL.revokeObjectURL(url);
        reject(error);
      }
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Could not load image'));
    };
    
    img.src = url;
  });
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
    
    const compressedFile = await imageCompression(imageFile.data, compressionOptions);
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
    
    const compressedFile = await imageCompression(imageFile.data, compressionOptions);
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
  const imgUrl = URL.createObjectURL(imageFile.data);
  
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
  const imgUrl = URL.createObjectURL(imageFile.data);
  
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