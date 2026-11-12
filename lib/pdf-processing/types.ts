/**
 * PDF Processing Types
 */

export interface PdfFile {
  id: string;
  name: string;
  size: number;
  type: string;
  lastModified: number;
  file: File;
  preview?: string;
  metadata?: PdfMetadata;
}

export interface PdfMetadata {
  pageCount: number;
  author?: string;
  title?: string;
  subject?: string;
  creator?: string;
  producer?: string;
  creationDate?: Date;
  modificationDate?: Date;
  hasImages: boolean;
  estimatedImageCount?: number;
}

export interface PdfCompressionOptions {
  imageQuality: number;
  removeMetadata: boolean;
  compressImages: boolean;
  scaleImages: boolean;
  maxImageDimension?: number;
}

/**
 * Keep this result structure compatible with the existing UI.
 */
export interface PdfCompressionResult {
  id: string;
  originalFile: {
    name: string;
    size: number;
    type: string;
  };
  compressedFile: {
    name: string;
    size: number;
    type: string;
    data: Blob;
  };
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  savingsBytes: number;
  savingsPercentage: number;
  processingTime: number;
  settings: PdfCompressionOptions;
  metadata?: PdfMetadata;
}
