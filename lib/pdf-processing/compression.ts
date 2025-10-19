/**
 * PDF压缩处理工具函数
 * 基于 pdf-lib 实现纯前端 PDF 压缩
 */

import { loadPdfLib } from './pdf-loader';
import type { PDFDocument, PDFImage, PDFPage } from 'pdf-lib';

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
  imageQuality: number;           // 0.1-1.0 (10%-100%)
  removeMetadata: boolean;
  compressImages: boolean;
  scaleImages: boolean;
  maxImageDimension?: number;     // 最大图片尺寸
}

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

/**
 * 创建 PdfFile 对象
 */
export async function createPdfFile(file: File): Promise<PdfFile> {
  const id = `pdf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  // 获取 PDF 元数据
  const metadata = await getPdfMetadata(file);
  
  return {
    id,
    name: file.name,
    size: file.size,
    type: file.type,
    lastModified: file.lastModified,
    file,
    metadata
  };
}

/**
 * 验证 PDF 文件
 */
export function validatePdfFile(file: File): { valid: boolean; error?: string } {
  // 检查文件类型
  if (file.type !== 'application/pdf') {
    return {
      valid: false,
      error: `Invalid file type: ${file.type}. Please upload a PDF file.`
    };
  }
  
  // 检查文件大小 (100MB 限制)
  const maxSize = 100 * 1024 * 1024;
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size (${(file.size / 1024 / 1024).toFixed(1)}MB) exceeds the 100MB limit.`
    };
  }
  
  // 检查文件是否为空
  if (file.size === 0) {
    return {
      valid: false,
      error: 'File is empty. Please upload a valid PDF file.'
    };
  }
  
  return { valid: true };
}

/**
 * 获取 PDF 元数据
 */
export async function getPdfMetadata(file: File): Promise<PdfMetadata> {
  try {
    // 检查是否在浏览器环境中
    if (typeof window === 'undefined') {
      return {
        pageCount: 0,
        hasImages: false
      };
    }

    // 使用安全的PDF处理器
    const { SafePdfProcessor } = await import('./safe-pdf-processor');
    const processor = SafePdfProcessor.getInstance();
    
    // 验证环境
    const envCheck = processor.validateEnvironment();
    if (!envCheck.supported) {
      throw new Error(envCheck.reason);
    }
    
    // 动态加载 pdf-lib
    const { loadPdfLib } = await import('./pdf-loader');
    const { PDFDocument } = await loadPdfLib();
    
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    
    const pageCount = pdfDoc.getPageCount();
    const title = pdfDoc.getTitle();
    const author = pdfDoc.getAuthor();
    const subject = pdfDoc.getSubject();
    const creator = pdfDoc.getCreator();
    const producer = pdfDoc.getProducer();
    const creationDate = pdfDoc.getCreationDate();
    const modificationDate = pdfDoc.getModificationDate();
    
    // 估算图片数量（简单方法：检查资源）
    let hasImages = false;
    let estimatedImageCount = 0;
    
    // 检查页面是否包含图片（简化版本）
    const pages = pdfDoc.getPages();
    for (const page of pages) {
      const resources = page.node.Resources();
      if (resources && resources.lookup(pdfDoc.context.obj('XObject'))) {
        hasImages = true;
        estimatedImageCount++;
      }
    }
    
    return {
      pageCount,
      title: title || undefined,
      author: author || undefined,
      subject: subject || undefined,
      creator: creator || undefined,
      producer: producer || undefined,
      creationDate: creationDate || undefined,
      modificationDate: modificationDate || undefined,
      hasImages,
      estimatedImageCount: hasImages ? estimatedImageCount : 0
    };
  } catch (error) {
    console.error('Failed to extract PDF metadata:', error);
    return {
      pageCount: 0,
      hasImages: false
    };
  }
}

/**
 * 压缩 PDF - 主要入口函数
 */
export async function compressPdf(
  pdfFile: PdfFile,
  options: PdfCompressionOptions
): Promise<PdfCompressionResult> {
  // 检查是否在浏览器环境中
  if (typeof window === 'undefined') {
    throw new Error('PDF compression is only available in browser environment');
  }

  // 使用安全的PDF处理器
  const { SafePdfProcessor } = await import('./safe-pdf-processor');
  const processor = SafePdfProcessor.getInstance();
  
  // 验证环境
  const envCheck = processor.validateEnvironment();
  if (!envCheck.supported) {
    throw new Error(envCheck.reason);
  }
  
  const startTime = Date.now();
  
  try {
    // 动态加载 pdf-lib
    const { loadPdfLib } = await import('./pdf-loader');
    const { PDFDocument } = await loadPdfLib();
    
    // 加载 PDF
    const arrayBuffer = await pdfFile.file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    
    // 1. 移除元数据
    if (options.removeMetadata) {
      removeMetadata(pdfDoc);
    }
    
    // 2. 压缩图片（注意：pdf-lib 的图片压缩功能有限）
    // 这是一个简化版本，实际压缩效果取决于 PDF 的结构
    if (options.compressImages) {
      await compressImagesInPdf(pdfDoc, options);
    }
    
    // 3. 保存压缩后的 PDF
    const compressedBytes = await pdfDoc.save({
      useObjectStreams: true,      // 使用对象流压缩
      addDefaultPage: false,
      objectsPerTick: 50
    });
    
    // 创建 Blob
    const compressedBlob = new Blob([compressedBytes], { type: 'application/pdf' });
    
    const endTime = Date.now();
    const originalSize = pdfFile.size;
    const compressedSize = compressedBlob.size;
    const savingsBytes = originalSize - compressedSize;
    const savingsPercentage = Math.round((savingsBytes / originalSize) * 100);
    
    const result: PdfCompressionResult = {
      id: `result_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      originalFile: {
        name: pdfFile.name,
        size: pdfFile.size,
        type: pdfFile.type
      },
      compressedFile: {
        name: pdfFile.name.replace(/\.pdf$/i, '_compressed.pdf'),
        size: compressedSize,
        type: 'application/pdf',
        data: compressedBlob
      },
      originalSize,
      compressedSize,
      compressionRatio: savingsPercentage,
      savingsBytes,
      savingsPercentage,
      processingTime: endTime - startTime,
      settings: options,
      metadata: pdfFile.metadata
    };
    
    return result;
    
  } catch (error) {
    throw new Error(`PDF compression failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * 移除 PDF 元数据
 */
function removeMetadata(pdfDoc: PDFDocument): void {
  try {
    pdfDoc.setTitle('');
    pdfDoc.setAuthor('');
    pdfDoc.setSubject('');
    pdfDoc.setCreator('');
    pdfDoc.setProducer('');
    pdfDoc.setKeywords([]);
  } catch (error) {
    console.warn('Failed to remove some metadata:', error);
  }
}

/**
 * 压缩 PDF 中的图片
 * 注意：这是一个简化实现，pdf-lib 对图片压缩的支持有限
 * 更好的方案可能需要提取图片、压缩、然后重新插入
 */
async function compressImagesInPdf(
  pdfDoc: PDFDocument,
  options: PdfCompressionOptions
): Promise<void> {
  try {
    // 注意：pdf-lib 不直接支持图片压缩
    // 这里我们只能做一些有限的优化
    // 实际效果主要来自 useObjectStreams 等保存选项
    
    // 如果需要真正的图片压缩，需要：
    // 1. 提取 PDF 中的所有图片
    // 2. 使用 canvas 压缩图片
    // 3. 重新嵌入到 PDF
    // 这会更复杂，暂时使用简化版本
    
    console.log('Image compression in PDF is limited by pdf-lib capabilities');
  } catch (error) {
    console.warn('Failed to compress images in PDF:', error);
  }
}

/**
 * 格式化文件大小
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * 下载压缩结果
 */
export function downloadPdfResult(result: PdfCompressionResult): void {
  const link = document.createElement('a');
  link.href = URL.createObjectURL(result.compressedFile.data);
  link.download = result.compressedFile.name;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}


