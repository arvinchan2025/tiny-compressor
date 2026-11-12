import type { PdfCompressionResult } from './types';

/**
 * Download the output file represented by PdfCompressionResult.
 */
export function downloadPdfResult(result: PdfCompressionResult): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    throw new Error('Download is only available in a browser.');
  }

  const blob = result?.compressedFile?.data;

  if (!(blob instanceof Blob)) {
    throw new Error('Invalid compressed PDF data.');
  }

  if (blob.size === 0) {
    throw new Error('The PDF file is empty.');
  }

  const url = URL.createObjectURL(blob);

  try {
    const link = document.createElement('a');
    link.href = url;
    link.download = result.compressedFile.name || 'compressed.pdf';

    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    URL.revokeObjectURL(url);
    throw error;
  }

  // Give the browser time to start the download before releasing the URL.
  window.setTimeout(() => URL.revokeObjectURL(url), 5000);
}
