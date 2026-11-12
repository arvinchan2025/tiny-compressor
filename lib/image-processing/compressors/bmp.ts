
import { decode, encode } from '@nktkas/bmp';

import type {
  ImageFile,
  CompressionOptions,
  CompressionResult,
} from '../types';

type BmpCandidate = {
  data: Uint8Array;
  name: string;
  description: string;
};

const BMP_MIME_TYPE = 'image/bmp';

/**
 * 判断输入是否为 BMP 文件。
 *
 * 同时检查 MIME、扩展名和 BMP 文件签名。
 */
function isBmpInput(
  imageFile: ImageFile,
  bytes: Uint8Array
): boolean {
  const mime = (imageFile.type || '').toLowerCase();
  const name = imageFile.name.toLowerCase();

  const hasBmpSignature =
    bytes.length >= 2 &&
    bytes[0] === 0x42 &&
    bytes[1] === 0x4d;

  return (
    hasBmpSignature ||
    mime === 'image/bmp' ||
    mime === 'image/x-ms-bmp' ||
    name.endsWith('.bmp')
  );
}

/**
 * 将输入像素转换为 RGB。
 *
 * 1 channel: 灰度转 RGB
 * 3 channels: RGB
 * 4 channels: RGBA 合成到白色背景
 */
function normalizeToRgb(
  raw: ReturnType<typeof decode>
): Uint8Array {
  const pixelCount = raw.width * raw.height;
  const rgb = new Uint8Array(pixelCount * 3);

  if (raw.channels === 3) {
    rgb.set(raw.data);
    return rgb;
  }

  if (raw.channels === 1) {
    for (let i = 0; i < pixelCount; i++) {
      const gray = raw.data[i];
      const offset = i * 3;

      rgb[offset] = gray;
      rgb[offset + 1] = gray;
      rgb[offset + 2] = gray;
    }

    return rgb;
  }

  // RGBA -> RGB
  // BMP RLE8 不支持 Alpha，因此使用白色背景合成。
  for (let i = 0; i < pixelCount; i++) {
    const sourceOffset = i * 4;
    const targetOffset = i * 3;

    const alpha = raw.data[sourceOffset + 3] / 255;
    const inverseAlpha = 1 - alpha;

    rgb[targetOffset] = Math.round(
      raw.data[sourceOffset] * alpha +
      255 * inverseAlpha
    );

    rgb[targetOffset + 1] = Math.round(
      raw.data[sourceOffset + 1] * alpha +
      255 * inverseAlpha
    );

    rgb[targetOffset + 2] = Math.round(
      raw.data[sourceOffset + 2] * alpha +
      255 * inverseAlpha
    );
  }

  return rgb;
}

/**
 * 判断 RGBA 数据是否存在透明像素。
 */
function hasTransparency(
  raw: ReturnType<typeof decode>
): boolean {
  if (raw.channels !== 4) {
    return false;
  }

  for (let i = 3; i < raw.data.length; i += 4) {
    if (raw.data[i] < 255) {
      return true;
    }
  }

  return false;
}

/**
 * 生成 BMP 编码候选。
 *
 * 通过比较不同编码方式的实际文件大小，
 * 选择最小的有效输出。
 */
function createBmpCandidates(
  raw: ReturnType<typeof decode>
): BmpCandidate[] {
  const candidates: BmpCandidate[] = [];

  const transparent = hasTransparency(raw);

  // 带透明度时，先尝试保留 RGBA / 32-bit BMP。
  if (transparent) {
    const rgbaBmp = encode(raw, {
      bitsPerPixel: 32,
      compression: 0,
      headerType: 'BITMAPV4HEADER',
    });

    candidates.push({
      data: rgbaBmp,
      name: '32-bit BMP',
      description: '32-bit BI_RGB',
    });

    // 不尝试 RLE8，避免丢失 Alpha。
    return candidates;
  }

  const rgb = normalizeToRgb(raw);

  const rgbRaw = {
    width: raw.width,
    height: raw.height,
    channels: 3 as const,
    data: rgb,
  };

  // 候选 1：标准 24-bit BMP。
  const standardBmp = encode(rgbRaw, {
    bitsPerPixel: 24,
    compression: 0,
  });

  candidates.push({
    data: standardBmp,
    name: '24-bit BMP',
    description: '24-bit BI_RGB',
  });

  // 候选 2：8-bit 索引色 BMP + RLE8。
  // 自动生成最多 256 色的调色板。
  const rle8Bmp = encode(rgbRaw, {
    bitsPerPixel: 8,
    compression: 1,
  });

  candidates.push({
    data: rle8Bmp,
    name: '8-bit RLE BMP',
    description: '8-bit BI_RLE8',
  });

  return candidates;
}

/**
 * 选择体积最小的有效候选。
 */
function selectSmallestCandidate(
  candidates: BmpCandidate[]
): BmpCandidate {
  if (candidates.length === 0) {
    throw new Error('No valid BMP encoding candidate');
  }

  return candidates.reduce((smallest, current) => {
    return current.data.byteLength < smallest.data.byteLength
      ? current
      : smallest;
  });
}

/**
 * 创建统一的 CompressionResult。
 */
function createResult(
  imageFile: ImageFile,
  options: CompressionOptions,
  outputBlob: Blob,
  outputName: string,
  processingTime: number
): CompressionResult {
  const preview = URL.createObjectURL(outputBlob);

  return {
    id: `result_${Date.now()}_${Math.random()
      .toString(36)
      .slice(2, 11)}`,

    originalFile: {
      name: imageFile.name,
      size: imageFile.size,
      type: imageFile.type,
    },

    compressedFile: {
      name: outputName,
      size: outputBlob.size,
      type: BMP_MIME_TYPE,
      data: outputBlob,
    },

    originalSize: imageFile.size,
    compressedSize: outputBlob.size,

    compressionRatio: imageFile.size > 0
      ? Math.round(
          ((imageFile.size - outputBlob.size) /
            imageFile.size) * 100
        )
      : 0,

    processingTime,

    settings: options,

    preview,

    metadata: imageFile.metadata,
  };
}

/**
 * BMP 压缩。
 *
 * 对 BMP 输入：
 * - 输出必须保持 BMP 格式。
 * - 只有文件实际变小时才使用新文件。
 * - 否则返回原始 BMP。
 *
 * 对其他格式输入：
 * - 输出 BMP。
 * - 即使输出比原文件大，也不能回退为原格式。
 * - 主要用于 convertImage 的 BMP 目标格式。
 */
export async function compressBmp(
  imageFile: ImageFile,
  options: CompressionOptions
): Promise<CompressionResult> {
  const startTime = Date.now();

  if (!imageFile.data) {
    throw new Error('Invalid image file data');
  }

  if (!(imageFile.data instanceof Blob)) {
    throw new Error('Image data must be a File or Blob');
  }

  if (imageFile.size <= 0) {
    throw new Error('Image file is empty');
  }

  try {
    // 读取文件数据。
    const inputBytes = new Uint8Array(
      await imageFile.data.arrayBuffer()
    );

    // 判断输入是不是 BMP。
    const bmpSource = isBmpInput(imageFile, inputBytes);

    // 解码 BMP。
    // 非 BMP 输入不能直接使用 BMP decoder，
    // 需要先通过浏览器解码为像素数据。
    let raw: ReturnType<typeof decode>;

    if (bmpSource) {
      raw = decode(inputBytes);
    } else {
      raw = await decodeImageBlob(imageFile.data);
    }

    // 生成候选 BMP。
    const candidates = createBmpCandidates(raw);

    // 选择最小文件。
    const selected = selectSmallestCandidate(candidates);

    const compressedBlob = new Blob(
      [selected.data],
      { type: BMP_MIME_TYPE }
    );

    let finalBlob: Blob;
    let finalName: string;

    if (bmpSource && compressedBlob.size >= imageFile.size) {
      // BMP 压缩没有收益，保留原始文件。
      finalBlob = imageFile.data;
      finalName = imageFile.name;
    } else {
      // BMP 输入有压缩收益，或者这是其他格式转 BMP。
      finalBlob = compressedBlob;
      finalName = imageFile.name.replace(/\.[^/.]+$/, '') + '.bmp';
    }

    return createResult(
      imageFile,
      options,
      finalBlob,
      finalName,
      Date.now() - startTime
    );
  } catch (error) {
    throw new Error(
      `BMP compression failed: ${
        error instanceof Error
          ? error.message
          : 'Unknown error'
      }`
    );
  }
}

/**
 * 使用浏览器解码非 BMP 图片。
 *
 * 供 PNG/JPEG/WebP/AVIF/GIF -> BMP 使用。
 */
async function decodeImageBlob(
  blob: Blob
): Promise<ReturnType<typeof decode>> {
  const url = URL.createObjectURL(blob);

  try {
    const image = new Image();

    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(
        new Error('Failed to decode source image')
      );

      image.src = url;
    });

    const canvas = document.createElement('canvas');

    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;

    const context = canvas.getContext('2d');

    if (!context) {
      throw new Error('Could not create canvas context');
    }

    context.drawImage(image, 0, 0);

    const imageData = context.getImageData(
      0,
      0,
      canvas.width,
      canvas.height
    );

    return {
      width: imageData.width,
      height: imageData.height,
      channels: 4,
      data: new Uint8Array(imageData.data),
    };
  } finally {
    URL.revokeObjectURL(url);
  }
}
