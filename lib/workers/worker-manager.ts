/**
 * Web Worker 管理器
 * 管理图片处理 Worker 的生命周期和通信
 */

import type { WorkerMessage, WorkerResponse } from './image-processor.worker';

export class WorkerManager {
  private worker: Worker | null = null;
  private messageHandlers = new Map<string, {
    resolve: (value: any) => void;
    reject: (error: Error) => void;
  }>();
  private isInitialized = false;

  /**
   * 初始化 Worker
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // 创建 Worker
      this.worker = new Worker(
        new URL('./image-processor.worker.ts', import.meta.url),
        { type: 'module' }
      );

      // 监听 Worker 消息
      this.worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
        this.handleWorkerMessage(event.data);
      };

      // 监听 Worker 错误
      this.worker.onerror = (error) => {
        console.error('Worker error:', error);
        this.rejectAllPending('Worker error occurred');
      };

      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize worker:', error);
      throw new Error('Failed to initialize image processing worker');
    }
  }

  /**
   * 处理 Worker 消息
   */
  private handleWorkerMessage(response: WorkerResponse) {
    const handler = this.messageHandlers.get(response.id);
    if (!handler) return;

    switch (response.type) {
      case 'success':
        handler.resolve(response.data?.result);
        break;
      case 'error':
        handler.reject(new Error(response.data?.error || 'Unknown error'));
        break;
      case 'progress':
        // 进度更新可以在这里处理
        console.log(`Progress for ${response.id}: ${response.data?.progress}%`);
        break;
    }

    // 清理已完成的处理器
    this.messageHandlers.delete(response.id);
  }

  /**
   * 处理图片
   */
  async processImage(
    file: File,
    options: {
      quality: number;
      maxWidth: number;
      maxHeight: number;
      format: 'jpeg' | 'png' | 'webp';
    }
  ): Promise<{
    compressedFile: File;
    originalSize: number;
    compressedSize: number;
    compressionRatio: number;
  }> {
    if (!this.worker || !this.isInitialized) {
      await this.initialize();
    }

    const id = `process_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return new Promise((resolve, reject) => {
      // 存储处理器
      this.messageHandlers.set(id, { resolve, reject });

      // 发送处理消息
      const message: WorkerMessage = {
        type: 'process',
        id,
        data: { file, options }
      };

      this.worker!.postMessage(message);

      // 设置超时
      setTimeout(() => {
        if (this.messageHandlers.has(id)) {
          this.messageHandlers.delete(id);
          reject(new Error('Processing timeout'));
        }
      }, 30000); // 30秒超时
    });
  }

  /**
   * 取消处理
   */
  cancelProcessing(id: string): void {
    if (!this.worker || !this.isInitialized) return;

    const message: WorkerMessage = {
      type: 'cancel',
      id
    };

    this.worker.postMessage(message);
  }

  /**
   * 拒绝所有待处理的请求
   */
  private rejectAllPending(reason: string): void {
    this.messageHandlers.forEach(({ reject }) => {
      reject(new Error(reason));
    });
    this.messageHandlers.clear();
  }

  /**
   * 销毁 Worker
   */
  destroy(): void {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
    this.messageHandlers.clear();
    this.isInitialized = false;
  }

  /**
   * 检查 Worker 是否可用
   */
  isAvailable(): boolean {
    return this.isInitialized && this.worker !== null;
  }
}

// 单例实例
export const workerManager = new WorkerManager();


