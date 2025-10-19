/**
 * PDF库动态加载器
 * 确保PDF库只在浏览器环境中加载
 */

interface PdfLibModule {
  PDFDocument: any;
  rgb: (r: number, g: number, b: number) => any;
  degrees: (angle: number) => any;
}

let pdfLibCache: PdfLibModule | null = null;
let loadingPromise: Promise<PdfLibModule> | null = null;

/**
 * 动态加载PDF库
 */
export async function loadPdfLib(): Promise<PdfLibModule> {
  // 检查是否在浏览器环境
  if (typeof window === 'undefined') {
    throw new Error('PDF library can only be loaded in browser environment');
  }

  // 如果已经缓存，直接返回
  if (pdfLibCache) {
    return pdfLibCache;
  }

  // 如果正在加载，等待加载完成
  if (loadingPromise) {
    return loadingPromise;
  }

  // 开始加载
  loadingPromise = loadPdfLibFromCDN();
  
  try {
    pdfLibCache = await loadingPromise;
    return pdfLibCache;
  } catch (error) {
    loadingPromise = null; // 重置，允许重试
    throw error;
  }
}

/**
 * 从CDN加载PDF库
 */
async function loadPdfLibFromCDN(): Promise<PdfLibModule> {
  const cdnUrls = [
    'https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.min.js',
    'https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js',
    'https://cdn.skypack.dev/pdf-lib@1.17.1'
  ];

  for (const url of cdnUrls) {
    try {
      const pdfLib = await loadScript(url);
      if (pdfLib && pdfLib.PDFDocument) {
        return pdfLib;
      }
    } catch (error) {
      console.warn(`Failed to load PDF library from ${url}:`, error);
      continue;
    }
  }

  throw new Error('Failed to load PDF library from all CDN sources');
}

/**
 * 动态加载脚本
 */
function loadScript(src: string): Promise<any> {
  return new Promise((resolve, reject) => {
    // 检查脚本是否已存在
    const existingScript = document.querySelector(`script[src="${src}"]`);
    if (existingScript) {
      // 脚本已存在，直接使用全局变量
      const pdfLib = (window as any).PDFLib;
      if (pdfLib) {
        resolve(pdfLib);
        return;
      }
    }

    // 创建新的脚本标签
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.crossOrigin = 'anonymous';

    script.onload = () => {
      const pdfLib = (window as any).PDFLib;
      if (pdfLib) {
        resolve(pdfLib);
      } else {
        reject(new Error('PDF library not found on window object'));
      }
    };

    script.onerror = () => {
      reject(new Error(`Failed to load script: ${src}`));
    };

    document.head.appendChild(script);
  });
}

/**
 * 检查PDF库是否已加载
 */
export function isPdfLibLoaded(): boolean {
  return pdfLibCache !== null;
}

/**
 * 获取已缓存的PDF库
 */
export function getCachedPdfLib(): PdfLibModule | null {
  return pdfLibCache;
}

/**
 * 清理PDF库缓存
 */
export function clearPdfLibCache(): void {
  pdfLibCache = null;
  loadingPromise = null;
}

/**
 * 预加载PDF库（可选）
 */
export async function preloadPdfLib(): Promise<void> {
  try {
    await loadPdfLib();
  } catch (error) {
    console.warn('Failed to preload PDF library:', error);
  }
}