import type { ImageFile, ImageMetadata } from './types';

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
