import type { ImageFile, CompressionOptions, CompressionResult } from '@/lib/image-processing/types';
import { loadImageCompression } from '@/lib/image-processing/image-compression-loader';

/**
 * PNG 压缩 - 使用 browser-image-compression 或 Canvas API
 */
export async function compressPng(imageFile: ImageFile, options: CompressionOptions): Promise<CompressionResult> {
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
export async function compressPngWithCanvas(imageFile: ImageFile, options: CompressionOptions): Promise<CompressionResult> {
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
