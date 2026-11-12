import { PDFDict, PDFName } from 'pdf-lib';

import { loadPdfLib } from './pdf-loader';
import type { PDFDocument, PDFPage } from 'pdf-lib';
import type { PdfMetadata } from './types';

const EMPTY_METADATA: PdfMetadata = {
  pageCount: 0,
  hasImages: false,
  estimatedImageCount: 0,
};

/**
 * Extract basic document metadata.
 * Metadata extraction is best-effort: failures do not block file selection.
 */
export async function getPdfMetadata(file: File): Promise<PdfMetadata> {
  try {
    if (typeof window === 'undefined') {
      return { ...EMPTY_METADATA };
    }

    const { SafePdfProcessor } = await import('./safe-pdf-processor');
    const processor = SafePdfProcessor.getInstance();
    const envCheck = processor.validateEnvironment();

    if (!envCheck.supported) {
      throw new Error(envCheck.reason || 'PDF processing is not supported.');
    }

    const { PDFDocument } = await loadPdfLib();
    const pdfDoc = await PDFDocument.load(await file.arrayBuffer());
    const pages = pdfDoc.getPages();
    const imageInfo = estimatePdfImages(pdfDoc, pages);

    return {
      pageCount: pdfDoc.getPageCount(),
      title: pdfDoc.getTitle() || undefined,
      author: pdfDoc.getAuthor() || undefined,
      subject: pdfDoc.getSubject() || undefined,
      creator: pdfDoc.getCreator() || undefined,
      producer: pdfDoc.getProducer() || undefined,
      creationDate: pdfDoc.getCreationDate() || undefined,
      modificationDate: pdfDoc.getModificationDate() || undefined,
      hasImages: imageInfo.hasImages,
      estimatedImageCount: imageInfo.count,
    };
  } catch (error) {
    console.error('Failed to extract PDF metadata:', error);
    return { ...EMPTY_METADATA };
  }
}

/**
 * Estimate pages containing XObject resources.
 *
 * This is not an exact image count: XObjects can also include Form XObjects.
 */
function estimatePdfImages(
  pdfDoc: PDFDocument,
  pages: PDFPage[]
): { hasImages: boolean; count: number } {
  let count = 0;

  for (const page of pages) {
    try {
      const resources = page.node.Resources();
      if (!resources) continue;

      const xObjects = resources.lookupMaybe(
        PDFName.of('XObject'),
        PDFDict
      );

      if (xObjects && xObjects.size() > 0) {
        count += 1;
      }
    } catch {
      // Ignore malformed or inaccessible page resources.
    }
  }

  return {
    hasImages: count > 0,
    count,
  };
}
