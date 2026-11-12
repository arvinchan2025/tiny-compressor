import type { PDFDocument } from 'pdf-lib';

/**
 * Remove the standard document information dictionary metadata.
 */
export function removePdfMetadata(pdfDoc: PDFDocument): void {
  pdfDoc.setTitle('');
  pdfDoc.setAuthor('');
  pdfDoc.setSubject('');
  pdfDoc.setCreator('');
  pdfDoc.setProducer('');
  pdfDoc.setKeywords([]);
}
