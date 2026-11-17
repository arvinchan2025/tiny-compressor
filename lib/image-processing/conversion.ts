
import type {
  ImageFile,
  ConversionResult,
} from '@/types/image';

const FORMAT_MIME_TYPES: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  avif: 'image/avif',
};

function normalizeFormat(format: string): string {
  return format.toLowerCase().replace(/^\./, '');
}

function getMimeType(format: string): string {
  const mimeType = FORMAT_MIME_TYPES[normalizeFormat(format)];

  if (!mimeType) {
    throw new Error(`Unsupported image format: ${format}`);
  }

  return mimeType;
}

function createCanvasBlob(
  canvas: HTMLCanvasElement,
  mimeType: string,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Failed to encode image.'));
          return;
        }

        // Browser may silently fall back to PNG
        // when the requested format is unsupported.
        if (blob.type !== mimeType) {
          reject(
            new Error(
              `Your browser does not support ${mimeType} encoding.`,
            ),
          );
          return;
        }

        resolve(blob);
      },
      mimeType,
    );
  });
}

/**
 * Convert image format without compression settings.
 */
export async function convertImage(
  imageFile: ImageFile,
  sourceFormat: string,
  targetFormat: string,
): Promise<ConversionResult> {
  const startTime = Date.now();

  const source = normalizeFormat(sourceFormat);
  const target = normalizeFormat(targetFormat);

  if (source === target) {
    throw new Error(
      'Source and target formats cannot be the same.',
    );
  }

  const mimeType = getMimeType(target);

  // Canvas conversion does not preserve GIF animation.
  if (
    imageFile.type === 'image/gif' ||
    imageFile.file.type === 'image/gif'
  ) {
    throw new Error(
      'Animated GIF conversion is not supported. ' +
      'Converting GIF through Canvas would lose animation.',
    );
  }

  let bitmap: ImageBitmap | null = null;

  try {
    bitmap = await createImageBitmap(imageFile.file);

    const canvas = document.createElement('canvas');

    canvas.width = bitmap.width;
    canvas.height = bitmap.height;

    const context = canvas.getContext('2d');

    if (!context) {
      throw new Error('Unable to initialize image canvas.');
    }

    // JPEG does not support transparency.
    // Use a white background for transparent source images.
    if (target === 'jpg' || target === 'jpeg') {
      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, canvas.width, canvas.height);
    }

    context.drawImage(bitmap, 0, 0);

    const blob = await createCanvasBlob(canvas, mimeType);

    const filename = imageFile.name.replace(
      /\.[^/.]+$/,
      `.${target}`,
    );

    const convertedFile = new File(
      [blob],
      filename,
      {
        type: mimeType,
        lastModified: Date.now(),
      },
    );
    return {
      originalFile: imageFile,
      convertedFile,
      fromFormat: source,
      toFormat: target,
      processingTime: Date.now() - startTime,
    };
  } catch (error) {
    throw new Error(
      `Conversion from ${sourceFormat} to ${targetFormat} failed: ${
        error instanceof Error
          ? error.message
          : 'Unknown error'
      }`,
    );
  } finally {
    bitmap?.close();
  }
}
