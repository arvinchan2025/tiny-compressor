import type { ImageFile, CompressionOptions, CompressionResult, ProcessingProgress } from './types';
import { compressImage } from './compress-image';

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
