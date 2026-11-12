import {loadPdfLib} from './pdf-loader';
import {removePdfMetadata} from './metadata-cleanup';
import {calculateCompressionStats, createPdfBlob,} from './compression-utils';

import type {PdfCompressionOptions, PdfCompressionResult, PdfFile,} from './types';

export async function compressPdf(
  pdfFile: PdfFile,
  options: PdfCompressionOptions
): Promise<PdfCompressionResult> {
  if (typeof window === 'undefined') {
    throw new Error(
      'PDF compression is only available in a browser environment.'
    );
  }

  if (!pdfFile?.file) {
    throw new Error('Invalid PDF file.');
  }

  const startTime = Date.now();

  try {
    const { SafePdfProcessor } = await import('./safe-pdf-processor');
    const processor = SafePdfProcessor.getInstance();
    const envCheck = processor.validateEnvironment();

    if (!envCheck.supported) {
      throw new Error(envCheck.reason || 'PDF processing is not supported.');
    }

    const { PDFDocument } = await loadPdfLib();
    const pdfDoc = await PDFDocument.load(
      await pdfFile.file.arrayBuffer()
    );

    if (options.removeMetadata) {
      removePdfMetadata(pdfDoc);
    }

    const serializedBytes = await pdfDoc.save({
      useObjectStreams: true,
      addDefaultPage: false,
      objectsPerTick: 50,
    });

    const generatedBlob = createPdfBlob(serializedBytes);
    const originalSize = pdfFile.size;

    // Keep the original file if the generated PDF is not strictly smaller.
    const useGeneratedFile = generatedBlob.size < originalSize;
    const outputBlob: Blob = useGeneratedFile
      ? generatedBlob
      : pdfFile.file;

    const compressedSize = outputBlob.size;
    const { savingsBytes, savingsPercentage } =
      calculateCompressionStats(originalSize, compressedSize);

    const outputFileName = useGeneratedFile
      ? pdfFile.name.replace(/\.pdf$/i, '_compressed.pdf')
      : pdfFile.name;

    const result: PdfCompressionResult = {
      id: `result_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`,

      originalFile: {
        name: pdfFile.name,
        size: originalSize,
        type: pdfFile.type || 'application/pdf',
      },

      compressedFile: {
        name: outputFileName,
        size: compressedSize,
        type: 'application/pdf',
        data: outputBlob,
      },

      originalSize,
      compressedSize,
      compressionRatio: savingsPercentage,
      savingsBytes,
      savingsPercentage,
      processingTime: Date.now() - startTime,
      settings: { ...options },
      metadata: pdfFile.metadata,
    };

    return result;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unknown error';

    throw new Error(`PDF compression failed: ${message}`);
  }
}