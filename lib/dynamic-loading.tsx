/**
 * 动态加载工具
 * 提供组件和库的动态加载功能
 */

import { ComponentType, lazy, Suspense, useState, useCallback, useEffect } from 'react';
import Loading from '@/components/ui/Loading';

// 动态加载配置
interface DynamicLoadConfig {
  fallback?: ComponentType;
  delay?: number;
  timeout?: number;
  retries?: number;
}

// 默认配置
const DEFAULT_CONFIG: Required<DynamicLoadConfig> = {
  fallback: Loading,
  delay: 200,
  timeout: 10000,
  retries: 3
};

/**
 * 创建动态加载的组件
 */
export function createDynamicComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  config: DynamicLoadConfig = {}
) {
  const { fallback, delay, timeout, retries } = { ...DEFAULT_CONFIG, ...config };
  
  const LazyComponent = lazy(() => 
    Promise.all([
      importFn(),
      new Promise(resolve => setTimeout(resolve, delay))
    ]).then(([module]) => module)
  );
  
  return (props: any) => {
    const FallbackComponent = fallback;
    return (
      <Suspense fallback={<FallbackComponent />}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
}

/**
 * 懒加载器
 */
export class LazyLoader {
  private static cache = new Map<string, Promise<any>>();

  static async load<T>(key: string, loader: () => Promise<T>): Promise<T> {
    if (this.cache.has(key)) {
      return this.cache.get(key)!;
    }

    const promise = loader();
    this.cache.set(key, promise);
    return promise;
  }

  static preload<T>(key: string, loader: () => Promise<T>): void {
    if (!this.cache.has(key)) {
      this.cache.set(key, loader());
    }
  }
}

/**
 * 动态加载库
 */
export class DynamicLoader {
  private static cache = new Map<string, Promise<any>>();
  private static retryCount = new Map<string, number>();
  
  /**
   * 加载库
   */
  static async load<T = any>(
    name: string,
    importFn: () => Promise<T>,
    config: DynamicLoadConfig = {}
  ): Promise<T> {
    const { timeout, retries } = { ...DEFAULT_CONFIG, ...config };
    
    // 检查缓存
    if (this.cache.has(name)) {
      return this.cache.get(name)!;
    }
    
    // 创建加载 Promise
    const loadPromise = this.loadWithRetry(name, importFn, retries, timeout);
    
    // 缓存结果
    this.cache.set(name, loadPromise);
    
    return loadPromise;
  }
  
  /**
   * 带重试的加载
   */
  private static async loadWithRetry<T>(
    name: string,
    importFn: () => Promise<T>,
    retries: number,
    timeout: number
  ): Promise<T> {
    const currentRetries = this.retryCount.get(name) || 0;
    
    try {
      const result = await Promise.race([
        importFn(),
        new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error(`Timeout loading ${name}`)), timeout)
        )
      ]);
      
      // 重置重试计数
      this.retryCount.delete(name);
      return result;
      
    } catch (error) {
      if (currentRetries < retries) {
        this.retryCount.set(name, currentRetries + 1);
        console.warn(`Retrying load of ${name} (${currentRetries + 1}/${retries})`);
        return this.loadWithRetry(name, importFn, retries, timeout);
      }
      
      // 清理缓存和重试计数
      this.cache.delete(name);
      this.retryCount.delete(name);
      throw error;
    }
  }
  
  /**
   * 预加载库
   */
  static preload<T = any>(
    name: string,
    importFn: () => Promise<T>
  ): void {
    if (!this.cache.has(name)) {
      this.cache.set(name, importFn());
    }
  }
  
  /**
   * 清理缓存
   */
  static clearCache(): void {
    this.cache.clear();
    this.retryCount.clear();
  }
  
  /**
   * 获取缓存状态
   */
  static getCacheStatus(): { name: string; loaded: boolean; retries: number }[] {
    return Array.from(this.cache.keys()).map(name => ({
      name,
      loaded: this.cache.has(name),
      retries: this.retryCount.get(name) || 0
    }));
  }
}

/**
 * 图片处理库动态加载
 */
export const ImageProcessingLoader = {
  // 基础压缩库
  browserImageCompression: () => 
    DynamicLoader.load('browser-image-compression', () => import('browser-image-compression')),
  
  // JSZip 库
  jszip: () => 
    DynamicLoader.load('jszip', () => import('jszip')),
  
  // Squoosh WASM 库 (暂时注释，需要安装 @squoosh/lib)
  // squoosh: () => 
  //   DynamicLoader.load('@squoosh/lib', () => import('@squoosh/lib')),
  
  // 预加载所有库
  preloadAll: () => {
    DynamicLoader.preload('browser-image-compression', () => import('browser-image-compression'));
    DynamicLoader.preload('jszip', () => import('jszip'));
    // DynamicLoader.preload('@squoosh/lib', () => import('@squoosh/lib'));
  }
};

/**
 * 组件动态加载
 */
export const ComponentLoader = {
  // 图片编辑器 (暂时注释，组件未实现)
  // ImageEditor: () => 
  //   createDynamicComponent(() => import('@/components/features/ImageEditor')),
  
  // 批量处理器 (暂时注释，组件未实现)
  // BatchProcessor: () => 
  //   createDynamicComponent(() => import('@/components/features/BatchProcessor')),
  
  // 高级转换器 (暂时注释，组件未实现)
  // AdvancedConverter: () => 
  //   createDynamicComponent(() => import('@/components/features/AdvancedConverter')),
  
  // 设置面板 (暂时注释，组件未实现)
  // SettingsPanel: () => 
  //   createDynamicComponent(() => import('@/components/features/SettingsPanel'))
};

/**
 * 性能监控
 */
export class PerformanceMonitor {
  private static metrics = new Map<string, number>();
  
  /**
   * 开始计时
   */
  static startTiming(name: string): void {
    this.metrics.set(name, performance.now());
  }
  
  /**
   * 结束计时
   */
  static endTiming(name: string): number {
    const startTime = this.metrics.get(name);
    if (!startTime) return 0;
    
    const duration = performance.now() - startTime;
    this.metrics.delete(name);
    
    console.log(`Performance: ${name} took ${duration.toFixed(2)}ms`);
    return duration;
  }
  
  /**
   * 测量异步函数性能
   */
  static async measureAsync<T>(
    name: string,
    fn: () => Promise<T>
  ): Promise<T> {
    this.startTiming(name);
    try {
      const result = await fn();
      this.endTiming(name);
      return result;
    } catch (error) {
      this.endTiming(name);
      throw error;
    }
  }
  
  /**
   * 获取性能指标
   */
  static getMetrics(): Record<string, number> {
    return Object.fromEntries(this.metrics);
  }
}

/**
 * 内存管理
 */
export class MemoryManager {
  private static fileCache = new Map<string, string>();
  private static maxCacheSize = 50 * 1024 * 1024; // 50MB
  private static currentCacheSize = 0;
  
  /**
   * 添加文件到缓存
   */
  static addFile(key: string, file: File): string {
    const url = URL.createObjectURL(file);
    
    // 检查缓存大小
    if (this.currentCacheSize + file.size > this.maxCacheSize) {
      this.cleanupOldest();
    }
    
    this.fileCache.set(key, url);
    this.currentCacheSize += file.size;
    
    return url;
  }
  
  /**
   * 获取文件 URL
   */
  static getFile(key: string): string | undefined {
    return this.fileCache.get(key);
  }
  
  /**
   * 移除文件
   */
  static removeFile(key: string): void {
    const url = this.fileCache.get(key);
    if (url) {
      URL.revokeObjectURL(url);
      this.fileCache.delete(key);
      // 注意：这里无法准确计算文件大小，实际应用中需要维护文件大小映射
    }
  }
  
  /**
   * 清理最旧的文件
   */
  private static cleanupOldest(): void {
    const firstKey = this.fileCache.keys().next().value;
    if (firstKey) {
      this.removeFile(firstKey);
    }
  }
  
  /**
   * 清理所有缓存
   */
  static clearAll(): void {
    this.fileCache.forEach(url => URL.revokeObjectURL(url));
    this.fileCache.clear();
    this.currentCacheSize = 0;
  }
  
  /**
   * 获取缓存状态
   */
  static getCacheStatus(): { size: number; count: number; maxSize: number } {
    return {
      size: this.currentCacheSize,
      count: this.fileCache.size,
      maxSize: this.maxCacheSize
    };
  }
}

/**
 * 懒加载 Hook
 */
export function useLazyLoad<T>(
  importFn: () => Promise<T>,
  deps: any[] = []
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<T | null>(null);
  
  const load = useCallback(async () => {
    if (loading || data) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await importFn();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [importFn, loading, data]);
  
  useEffect(() => {
    load();
  }, deps);
  
  return { data, loading, error, reload: load };
}

