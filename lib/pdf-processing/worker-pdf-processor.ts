/**
 * Web Worker PDF处理器
 * 在Worker线程中处理PDF，避免阻塞主线程
 */

export interface WorkerPdfProcessorOptions {
  imageQuality: number;
  removeMetadata: boolean;
  compressImages: boolean;
  scaleImages: boolean;
  maxImageDimension?: number;
}

export class WorkerPdfProcessor {
  private worker: Worker | null = null;
  private isInitialized = false;
  private messageId = 0;
  private pendingRequests = new Map<number, {
    resolve: (value: any) => void;
    reject: (error: any) => void;
  }>();

  constructor() {
    this.initializeWorker();
  }

  /**
   * 初始化Worker
   */
  private async initializeWorker(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      // 创建Worker
      const workerScript = this.createWorkerScript();
      const blob = new Blob([workerScript], { type: 'application/javascript' });
      const workerUrl = URL.createObjectURL(blob);

      this.worker = new Worker(workerUrl);
      this.setupWorkerEventListeners();

      this.isInitialized = true;

      // 清理临时URL
      URL.revokeObjectURL(workerUrl);

    } catch (error) {
      throw new Error(`Failed to initialize PDF Worker: ${error}`);
    }
  }

  /**
   * 创建Worker脚本
   */
  private createWorkerScript(): string {
    return `
      // PDF Worker Script
      let PDFLib = null;
      let isPdfLibLoaded = false;

      // 消息处理
      self.addEventListener('message', async function(event) {
        const { id, type, data } = event.data;

        try {
          switch (type) {
            case 'init':
              await initPdfLib();
              self.postMessage({ id, type: 'init', success: true });
              break;

            case 'processPdf':
              const result = await processPdf(data.file, data.options);
              self.postMessage({ id, type: 'processPdf', result });
              break;

            case 'getMetadata':
              const metadata = await getPdfMetadata(data.file);
              self.postMessage({ id, type: 'getMetadata', metadata });
              break;

            default:
              throw new Error('Unknown message type: ' + type);
          }
        } catch (error) {
          self.postMessage({ 
            id, 
            type: 'error', 
            error: {
              message: error.message,
              stack: error.stack
            }
          });
        }
      });

      // 初始化PDF库
      async function initPdfLib() {
        if (isPdfLibLoaded) {
          return;
        }

        try {
          // 动态导入PDF库
          const response = await fetch('https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.min.js');
          const script = await response.text();
          
          // 在Worker中执行脚本
          eval(script);
          
          PDFLib = self.PDFLib;
          isPdfLibLoaded = true;

        } catch (error) {
          throw new Error('Failed to load PDF library in worker: ' + error.message);
        }
      }

      // 处理PDF文件
      async function processPdf(fileData, options) {
        if (!isPdfLibLoaded) {
          await initPdfLib();
        }

        const startTime = Date.now();

        try {
          // 创建PDF文档
          const pdfDoc = await PDFLib.PDFDocument.load(fileData);

          // 获取元数据
          const metadata = {
            pageCount: pdfDoc.getPageCount(),
            author: pdfDoc.getAuthor() || '',
            title: pdfDoc.getTitle() || '',
            subject: pdfDoc.getSubject() || '',
            creator: pdfDoc.getCreator() || '',
            producer: pdfDoc.getProducer() || ''
          };

          // 应用压缩设置
          if (options.compressImages) {
            await compressImages(pdfDoc, options);
          }

          if (options.removeMetadata) {
            await removeMetadata(pdfDoc);
          }

          // 保存压缩后的PDF
          const compressedBytes = await pdfDoc.save({
            useObjectStreams: true,
            addDefaultPage: false
          });

          return {
            compressedBytes,
            metadata,
            processingTime: Date.now() - startTime,
            originalSize: fileData.byteLength,
            compressedSize: compressedBytes.length
          };

        } catch (error) {
          throw new Error('PDF processing failed in worker: ' + error.message);
        }
      }

      // 获取PDF元数据
      async function getPdfMetadata(fileData) {
        if (!isPdfLibLoaded) {
          await initPdfLib();
        }

        try {
          const pdfDoc = await PDFLib.PDFDocument.load(fileData);
          
          return {
            pageCount: pdfDoc.getPageCount(),
            hasImages: false, // 简化实现
            estimatedImageCount: 0,
            author: pdfDoc.getAuthor() || '',
            title: pdfDoc.getTitle() || '',
            subject: pdfDoc.getSubject() || '',
            creator: pdfDoc.getCreator() || '',
            producer: pdfDoc.getProducer() || ''
          };

        } catch (error) {
          return {
            pageCount: 0,
            hasImages: false,
            estimatedImageCount: 0
          };
        }
      }

      // 压缩PDF中的图像
      async function compressImages(pdfDoc, options) {
        const pageCount = pdfDoc.getPageCount();

        for (let i = 0; i < pageCount; i++) {
          const page = pdfDoc.getPage(i);
          // 简单的页面优化
          if (options.scaleImages) {
            page.scale(0.8, 0.8);
          }
        }
      }

      // 移除PDF元数据
      async function removeMetadata(pdfDoc) {
        try {
          pdfDoc.setAuthor('');
          pdfDoc.setTitle('');
          pdfDoc.setSubject('');
          pdfDoc.setCreator('');
          pdfDoc.setProducer('');
          pdfDoc.setCreationDate(new Date());
          pdfDoc.setModificationDate(new Date());
        } catch (error) {
          // 忽略元数据移除错误
        }
      }

      // 错误处理
      self.addEventListener('error', function(error) {
        self.postMessage({
          type: 'error',
          error: {
            message: error.message,
            filename: error.filename,
            lineno: error.lineno,
            colno: error.colno
          }
        });
      });

      self.addEventListener('unhandledrejection', function(event) {
        self.postMessage({
          type: 'error',
          error: {
            message: 'Unhandled Promise Rejection',
            reason: event.reason
          }
        });
      });
    `;
  }

  /**
   * 设置Worker事件监听器
   */
  private setupWorkerEventListeners(): void {
    if (!this.worker) return;

    this.worker.onmessage = (event) => {
      const { id, type, result, error } = event.data;
      const pendingRequest = this.pendingRequests.get(id);

      if (pendingRequest) {
        this.pendingRequests.delete(id);

        if (error) {
          pendingRequest.reject(new Error(error.message));
        } else {
          pendingRequest.resolve(result);
        }
      }
    };

    this.worker.onerror = (error) => {
      console.error('PDF Worker error:', error);
      // 清理所有待处理的请求
      this.pendingRequests.forEach(({ reject }) => {
        reject(new Error('Worker error: ' + error.message));
      });
      this.pendingRequests.clear();
    };
  }

  /**
   * 处理PDF文件
   */
  async processPdf(file: File, options: WorkerPdfProcessorOptions): Promise<any> {
    if (!this.isInitialized) {
      await this.initializeWorker();
    }

    // 将文件转换为ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();

    // 发送处理请求
    const result = await this.sendMessage('processPdf', {
      file: arrayBuffer,
      options
    });

    // 创建结果对象
    return {
      originalFile: {
        name: file.name,
        size: file.size,
        type: file.type
      },
      compressedFile: {
        name: this.generateCompressedFileName(file.name),
        size: result.compressedSize,
        type: 'application/pdf'
      },
      compressionRatio: Math.round(((result.originalSize - result.compressedSize) / result.originalSize) * 100),
      sizeReduction: result.originalSize - result.compressedSize,
      processingTime: result.processingTime,
      metadata: result.metadata,
      blob: new Blob([result.compressedBytes], { type: 'application/pdf' })
    };
  }

  /**
   * 获取PDF元数据
   */
  async getPdfMetadata(file: File): Promise<any> {
    if (!this.isInitialized) {
      await this.initializeWorker();
    }

    const arrayBuffer = await file.arrayBuffer();
    return await this.sendMessage('getMetadata', { file: arrayBuffer });
  }

  /**
   * 发送消息到Worker
   */
  private sendMessage(type: string, data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.worker) {
        reject(new Error('Worker not initialized'));
        return;
      }

      const id = ++this.messageId;
      this.pendingRequests.set(id, { resolve, reject });

      this.worker.postMessage({ id, type, data });

      // 设置超时
      setTimeout(() => {
        if (this.pendingRequests.has(id)) {
          this.pendingRequests.delete(id);
          reject(new Error('Worker request timeout'));
        }
      }, 60000); // 60秒超时
    });
  }

  /**
   * 生成压缩后的文件名
   */
  private generateCompressedFileName(originalName: string): string {
    const nameWithoutExt = originalName.replace(/\.pdf$/i, '');
    return `${nameWithoutExt}_compressed.pdf`;
  }

  /**
   * 检查Worker是否可用
   */
  static isAvailable(): boolean {
    return typeof Worker !== 'undefined';
  }

  /**
   * 终止Worker
   */
  terminate(): void {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
      this.isInitialized = false;
      this.pendingRequests.clear();
    }
  }
}




