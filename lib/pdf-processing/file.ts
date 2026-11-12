import type { PdfFile } from './types';
import { getPdfMetadata } from './metadata';

const MAX_PDF_SIZE = 100 * 1024 * 1024;

/**
 * Create the application-level PDF file object.
 * Preview URLs are intentionally not created here; the UI owns their lifecycle.
 */
export async function createPdfFile(file: File): Promise<PdfFile> {
  const validation = validatePdfFile(file);

  if (!validation.valid) {
    throw new Error(validation.error || 'Invalid PDF file.');
  }

  const metadata = await getPdfMetadata(file);

  return {
    id: `pdf_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`,
    name: file.name,
    size: file.size,
    type: file.type || 'application/pdf',
    lastModified: file.lastModified,
    file,
    metadata,
  };
}

/**
 * Validate the selected file before parsing it.
 * PDFDocument.load() remains responsible for validating the actual PDF structure.
 */
export function validatePdfFile(
  file: File
): { valid: boolean; error?: string } {
  if (typeof File !== 'undefined' && !(file instanceof File)) {
    return { valid: false, error: 'Invalid file.' };
  }

  if (!file) {
    return { valid: false, error: 'Please select a PDF file.' };
  }

  const isPdf =
    file.type === 'application/pdf' ||
    /\.pdf$/i.test(file.name);

  if (!isPdf) {
    return {
      valid: false,
      error: 'Please upload a PDF file.',
    };
  }

  if (file.size === 0) {
    return {
      valid: false,
      error: 'File is empty. Please upload a valid PDF file.',
    };
  }

  if (file.size > MAX_PDF_SIZE) {
    return {
      valid: false,
      error: 'File size exceeds the 100MB limit.',
    };
  }

  return { valid: true };
}
