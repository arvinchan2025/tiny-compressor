import type { ImageFile, CompressionOptions, CompressionResult } from '@/lib/image-processing/types';
export const compressAvif = async (
  imageFile: ImageFile,
  options: CompressionOptions = {}
): Promise<CompressionResult> => {
  const startTime = Date.now();

  const {
    quality = 80,
    lossless = false,
  } = options;

  if (!Number.isFinite(quality) || quality < 1 || quality > 100) {
    throw new Error('Quality must be between 1 and 100');
  }

  if (lossless) {
    throw new Error(
      'Lossless AVIF compression is not supported by the current Canvas encoder'
    );
  }

  if (!imageFile.data || imageFile.size <= 0) {
    throw new Error('Invalid image file');
  }

  const imageUrl = URL.createObjectURL(imageFile.data);

  try {
    const img = new Image();

    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = imageUrl;
    });

    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Canvas context is not supported');
    }

    ctx.drawImage(img, 0, 0);

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (result) => {
          if (!result || result.size === 0) {
            reject(new Error('AVIF encoding failed'));
            return;
          }

          if (result.type !== 'image/avif') {
            reject(
              new Error('Your browser does not support AVIF encoding')
            );
            return;
          }

          resolve(result);
        },
        'image/avif',
        quality / 100
      );
    });

    const compressionRatio =
      ((imageFile.size - blob.size) / imageFile.size) * 100;

    const isSmaller = blob.size < imageFile.size;

    const file = new File(
      [blob],
      `${imageFile.name.replace(/\.[^.]+$/, '')}.avif`,
      {
        type: 'image/avif',
        lastModified: Date.now(),
      }
    );

    return {
      success: true,
      file,
      originalSize: imageFile.size,
      compressedSize: blob.size,
      compressionRatio,
      processingTime: Date.now() - startTime,
      isSmaller,
      message: isSmaller
        ? 'Image compressed successfully'
        : 'AVIF conversion completed, but the resulting file is larger than the original',
    };
  } finally {
    URL.revokeObjectURL(imageUrl);
  }
};