import type { ImageFile, CompressionOptions, CompressionResult } from './types';
import { compressPng } from '@/lib/image-processing/compressors/png';
import { compressJpeg } from '@/lib/image-processing/compressors/jpeg';
import { compressWebp } from '@/lib/image-processing/compressors/webp';
import { compressAvif } from '@/lib/image-processing/compressors/avif';
import { compressGif } from '@/lib/image-processing/compressors/gif';
import {compressBmp} from "@/lib/image-processing/compressors";

/**
 * 根据目标格式分发到对应压缩器。
 */
export async function compressImage(
  imageFile: ImageFile,
  options: CompressionOptions
): Promise<CompressionResult> {
  const startTime = Date.now();

  try {
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
      case 'bmp':
        result = await compressBmp(imageFile, options);
        break;
      default:
        throw new Error(`Unsupported format: ${options.format}`);
    }

    result.processingTime = Date.now() - startTime;
    return result;
  } catch (error) {
    throw new Error(
      `Compression failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}
