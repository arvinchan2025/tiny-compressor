import type { ImageFile, CompressionOptions, CompressionResult } from '@/lib/image-processing/types';
import { loadImageCompression } from '@/lib/image-processing/image-compression-loader';

/**
 * JPEG 压缩 - 使用 browser-image-compression
 */
export async function compressJpeg(imageFile: ImageFile, options: CompressionOptions): Promise<CompressionResult> {
  // const { jpegOptions = {} } = options;
  const { quality = 85 } = options;
  
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
