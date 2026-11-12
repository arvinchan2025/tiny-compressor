import type { ImageFile, CompressionOptions, CompressionResult } from '@/lib/image-processing/types';

/**
 * GIF 压缩
 */
export async function compressGif(imageFile: ImageFile, options: CompressionOptions): Promise<CompressionResult> {
  // const { gifOptions = {} } = options;
  const { quality = 80, colors = 128 } = options;
  
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
