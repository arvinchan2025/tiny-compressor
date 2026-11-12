/**
 * Create an independent PDF Blob from pdf-lib's serialized bytes.
 */
export function createPdfBlob(bytes: Uint8Array): Blob {
  const buffer = new Uint8Array(bytes.byteLength);
  buffer.set(bytes);

  return new Blob([buffer.buffer], {
    type: 'application/pdf',
  });
}

/**
 * Format a byte count for display.
 */
export function formatFileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return '0 Bytes';
  }

  const units = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const index = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1
  );

  const size = bytes / Math.pow(1024, index);
  return `${Number(size.toFixed(2))} ${units[index]}`;
}

/**
 * Calculate non-negative compression savings.
 */
export function calculateCompressionStats(
  originalSize: number,
  outputSize: number
): {
  savingsBytes: number;
  savingsPercentage: number;
} {
  const savingsBytes = Math.max(0, originalSize - outputSize);
  const savingsPercentage =
    originalSize > 0
      ? Math.round((savingsBytes / originalSize) * 100)
      : 0;

  return { savingsBytes, savingsPercentage };
}
