/**
 * 安全的PDF处理器 - 解决静态生成问题
 * 采用条件化加载，确保只在浏览器环境中执行
 */

export interface SafePdfProcessorOptions {
  enableWorker?: boolean;
  fallbackToMainThread?: boolean;
  maxFileSize?: number;
  debugMode?: boolean;
}

export class SafePdfProcessor {
  private static instance: SafePdfProcessor | null = null;
  private isBrowser = false;
  private workerSupported = false;
  private options: SafePdfProcessorOptions;

  constructor(options: SafePdfProcessorOptions = {}) {
    this.options = {
      enableWorker: true,
      fallbackToMainThread: true,
      maxFileSize: 100 * 1024 * 1024, // 100MB
      debugMode: process.env.NODE_ENV === 'development',
      ...options
    };

    this.initializeEnvironment();
  }

  /**
   * 获取单例实例
   */
  static getInstance(options?: SafePdfProcessorOptions): SafePdfProcessor {
    if (!SafePdfProcessor.instance) {
      SafePdfProcessor.instance = new SafePdfProcessor(options);
    }
    return SafePdfProcessor.instance;
  }

  /**
   * 初始化环境检测
   */
  private initializeEnvironment() {
    // 检查是否在浏览器环境
    this.isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';
    
    if (this.isBrowser) {
      // 检查Worker支持
      this.workerSupported = typeof Worker !== 'undefined';
      
      if (this.options.debugMode) {
        console.log('[SafePdfProcessor] Environment initialized:', {
          isBrowser: this.isBrowser,
          workerSupported: this.workerSupported,
          userAgent: navigator.userAgent
        });
      }
    }
  }

  /**
   * 验证环境是否支持PDF处理
   */
  validateEnvironment(): { supported: boolean; reason?: string } {
    if (!this.isBrowser) {
      return { 
        supported: false, 
        reason: 'PDF processing requires browser environment' 
      };
    }

    if (!this.workerSupported && !this.options.fallbackToMainThread) {
      return { 
        supported: false, 
        reason: 'Worker not supported and fallback disabled' 
      };
    }

    return { supported: true };
  }

  /**
   * 验证文件是否可处理
   */
  validateFile(file: File): { valid: boolean; reason?: string } {
    // 检查文件类型
    if (file.type !== 'application/pdf') {
      return { 
        valid: false, 
        reason: 'File must be a PDF document' 
      };
    }

    // 检查文件大小
    if (file.size > this.options.maxFileSize!) {
      return { 
        valid: false, 
        reason: `File size exceeds limit (${Math.round(this.options.maxFileSize! / 1024 / 1024)}MB)` 
      };
    }

    // 检查文件是否为空
    if (file.size === 0) {
      return { 
        valid: false, 
        reason: 'File is empty' 
      };
    }

    return { valid: true };
  }

  /**
   * 处理PDF文件（主要入口）
   */
  async processPdf(
    file: File, 
    options: any
  ): Promise<any> {
    // 1. 环境验证
    const envCheck = this.validateEnvironment();
    if (!envCheck.supported) {
      throw new Error(envCheck.reason);
    }

    // 2. 文件验证
    const fileCheck = this.validateFile(file);
    if (!fileCheck.valid) {
      throw new Error(fileCheck.reason);
    }

    // 3. 选择处理方式
    if (this.options.enableWorker && this.workerSupported) {
      return this.processWithWorker(file, options);
    } else {
      return this.processWithMainThread(file, options);
    }
  }

  /**
   * 使用Worker处理PDF
   */
  private async processWithWorker(file: File, options: any): Promise<any> {
    try {
      // 动态导入Worker处理器
      const { WorkerPdfProcessor } = await import('./worker-pdf-processor');
      
      // 检查Worker支持
      if (!WorkerPdfProcessor.isAvailable()) {
        throw new Error('Web Worker not supported');
      }
      
      const processor = new WorkerPdfProcessor();
      
      if (this.options.debugMode) {
        console.log('[SafePdfProcessor] Using Worker for PDF processing');
      }

      const result = await processor.processPdf(file, options);
      
      // 清理Worker资源
      processor.terminate();
      
      return result;
    } catch (error) {
      if (this.options.debugMode) {
        console.warn('[SafePdfProcessor] Worker processing failed, falling back to main thread:', error);
      }

      if (this.options.fallbackToMainThread) {
        return this.processWithMainThread(file, options);
      } else {
        throw error;
      }
    }
  }

  /**
   * 使用主线程处理PDF
   */
  private async processWithMainThread(file: File, options: any): Promise<any> {
    try {
      // 动态导入主线程处理器
      const { MainThreadPdfProcessor } = await import('./main-thread-pdf-processor');
      const processor = new MainThreadPdfProcessor();
      
      if (this.options.debugMode) {
        console.log('[SafePdfProcessor] Using main thread for PDF processing');
      }

      return await processor.processPdf(file, options);
    } catch (error) {
      if (this.options.debugMode) {
        console.error('[SafePdfProcessor] Main thread processing failed:', error);
      }
      throw error;
    }
  }

  /**
   * 获取处理器状态信息
   */
  getStatus() {
    return {
      isBrowser: this.isBrowser,
      workerSupported: this.workerSupported,
      options: this.options,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * 清理资源
   */
  destroy() {
    SafePdfProcessor.instance = null;
  }
}

// 导出便捷函数
export async function safeProcessPdf(file: File, options: any = {}) {
  const processor = SafePdfProcessor.getInstance();
  return processor.processPdf(file, options);
}

export function validatePdfEnvironment() {
  const processor = SafePdfProcessor.getInstance();
  return processor.validateEnvironment();
}

export function getPdfProcessorStatus() {
  const processor = SafePdfProcessor.getInstance();
  return processor.getStatus();
}
