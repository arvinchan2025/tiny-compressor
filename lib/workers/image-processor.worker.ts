/**
 * 图片处理 Web Worker
 * 在后台线程中处理图片压缩和转换
 */

import imageCompression from 'browser-image-compression';

// Worker 消息类型
interface WorkerMessage {
  type: 'process' | 'cancel';
  id: string;
  data?: {
    file: File;
    options: {
      quality: number;
      maxWidth: number;
      maxHeight: number;
      format: 'jpeg' | 'png' | 'webp';
    };
  };
}

interface WorkerResponse {
  type: 'success' | 'error' | 'progress';
  id: string;
  data?: {
    result?: {
      compressedFile: File;
      originalSize: number;
      compressedSize: number;
      compressionRatio: number;
    };
    error?: string;
    progress?: number;
  };
}

// 处理中的任务
const processingTasks = new Map<string, AbortController>();

// 监听主线程消息
self.onmessage = async (event: MessageEvent<WorkerMessage>) => {
  const { type, id, data } = event.data;
  
  switch (type) {
    case 'process':
      if (data) {
        await processImage(id, data.file, data.options);
      }
      break;
      
    case 'cancel':
      cancelProcessing(id);
      break;
  }
};

/**
 * 处理图片
 */
async function processImage(
  id: string,
  file: File,
  options: {
    quality: number;
    maxWidth: number;
    maxHeight: number;
    format: 'jpeg' | 'png' | 'webp';
  }
) {
  try {
    // 创建 AbortController
    const abortController = new AbortController();
    processingTasks.set(id, abortController);
    
    // 发送进度更新
    self.postMessage({
      type: 'progress',
      id,
      data: { progress: 0 }
    } as WorkerResponse);
    
    // 配置压缩选项
    const compressionOptions = {
      maxSizeMB: options.quality < 0.5 ? 0.3 : 0.5,
      maxWidthOrHeight: Math.max(options.maxWidth, options.maxHeight),
      useWebWorker: false, // 避免嵌套 Worker
      fileType: `image/${options.format}`,
      initialQuality: options.quality,
      alwaysKeepResolution: false,
      preserveExif: false,
      signal: abortController.signal
    };
    
    // 处理图片
    const compressedFile = await imageCompression(file, compressionOptions);
    
    // 计算压缩比例
    const compressionRatio = Math.round(
      ((file.size - compressedFile.size) / file.size) * 100
    );
    
    // 发送成功结果
    self.postMessage({
      type: 'success',
      id,
      data: {
        result: {
          compressedFile,
          originalSize: file.size,
          compressedSize: compressedFile.size,
          compressionRatio
        }
      }
    } as WorkerResponse);
    
    // 清理任务
    processingTasks.delete(id);
    
  } catch (error) {
    // 发送错误结果
    self.postMessage({
      type: 'error',
      id,
      data: {
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    } as WorkerResponse);
    
    // 清理任务
    processingTasks.delete(id);
  }
}

/**
 * 取消处理
 */
function cancelProcessing(id: string) {
  const abortController = processingTasks.get(id);
  if (abortController) {
    abortController.abort();
    processingTasks.delete(id);
  }
}

// 导出类型供主线程使用
export type { WorkerMessage, WorkerResponse };


