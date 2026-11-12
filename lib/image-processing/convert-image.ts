import type { ImageFile, CompressionOptions, CompressionResult } from './types';
import { compressImage } from './compress-image';

/**
 * 转换图像格式
 */
export async function convertImage(
  imageFile: ImageFile,
  sourceFormat: string,
  targetFormat: string,
  options: any = {}
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
      'gif': 'gif'
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
    const result: any = await compressImage(imageFile, convertOptions);
    
    // 更新文件名
    result.filename = convertedFilename;
    
    const endTime = Date.now();
    result.processingTime = endTime - startTime;
    
    return result;
    
  } catch (error) {
    throw new Error(`Conversion from ${sourceFormat} to ${targetFormat} failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
