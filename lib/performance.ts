/**
 * 性能优化工具类
 * 提供性能监控、优化和缓存功能
 */

import React from 'react';

// 性能监控
export class PerformanceMonitor {
  private static metrics: Map<string, number> = new Map();
  private static observers: PerformanceObserver[] = [];

  // 开始计时
  static startTiming(name: string): void {
    this.metrics.set(`${name}_start`, performance.now());
  }

  // 结束计时
  static endTiming(name: string): number {
    const startTime = this.metrics.get(`${name}_start`);
    if (!startTime) return 0;

    const duration = performance.now() - startTime;
    this.metrics.set(`${name}_duration`, duration);
    return duration;
  }

  // 获取性能指标
  static getMetrics(): Record<string, number> {
    const result: Record<string, number> = {};
    this.metrics.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }

  // 清理指标
  static clearMetrics(): void {
    this.metrics.clear();
  }

  // 监控长任务
  static observeLongTasks(callback: (task: PerformanceEntry) => void): void {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach(callback);
      });
      observer.observe({ entryTypes: ['longtask'] });
      this.observers.push(observer);
    }
  }

  // 监控内存使用
  static getMemoryInfo(): any {
    if ('memory' in performance) {
      return (performance as any).memory;
    }
    return null;
  }

  // 清理所有观察者
  static disconnect(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// 缓存管理
export class CacheManager {
  private static cache: Map<string, { data: any; timestamp: number; ttl: number }> = new Map();
  private static maxSize: number = 100;

  // 设置缓存
  static set(key: string, data: any, ttl: number = 300000): void { // 默认5分钟
    // 清理过期缓存
    this.cleanup();

    // 如果缓存已满，删除最旧的项
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey!);
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  // 获取缓存
  static get(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;

    // 检查是否过期
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  // 删除缓存
  static delete(key: string): boolean {
    return this.cache.delete(key);
  }

  // 清理过期缓存
  static cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key);
      }
    }
  }

  // 清空所有缓存
  static clear(): void {
    this.cache.clear();
  }

  // 获取缓存大小
  static size(): number {
    return this.cache.size;
  }
}

// 防抖函数
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// 节流函数
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// 图片预加载
export function preloadImages(urls: string[]): Promise<void[]> {
  return Promise.all(
    urls.map(url => 
      new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = reject;
        img.src = url;
      })
    )
  );
}

// 懒加载图片
export function lazyLoadImages(
  selector: string = 'img[data-src]',
  options: IntersectionObserverInit = {}
): void {
  const images = document.querySelectorAll(selector);
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          const src = img.dataset['src'];
          if (src) {
            img.src = src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        }
      });
    }, options);

    images.forEach((img) => imageObserver.observe(img));
  } else {
    // 降级处理：直接加载所有图片
    images.forEach((img) => {
      const htmlImg = img as HTMLImageElement;
      const src = htmlImg.dataset['src'];
      if (src) {
        htmlImg.src = src;
        htmlImg.removeAttribute('data-src');
      }
    });
  }
}

// 资源预加载
export function preloadResources(resources: Array<{
  href: string;
  as: string;
  type?: string;
}>): void {
  resources.forEach(({ href, as, type }) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as;
    if (type) link.type = type;
    document.head.appendChild(link);
  });
}

// 代码分割工具
export function createAsyncComponent<T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback?: React.ComponentType
): React.LazyExoticComponent<T> {
  return React.lazy(importFunc);
}

// 批量处理
export async function batchProcess<T, R>(
  items: T[],
  processor: (item: T) => Promise<R>,
  batchSize: number = 5
): Promise<R[]> {
  const results: R[] = [];
  
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(processor));
    results.push(...batchResults);
  }
  
  return results;
}

// 内存优化
export class MemoryOptimizer {
  private static cleanupFunctions: (() => void)[] = [];

  // 注册清理函数
  static registerCleanup(cleanup: () => void): void {
    this.cleanupFunctions.push(cleanup);
  }

  // 执行所有清理
  static cleanup(): void {
    this.cleanupFunctions.forEach(cleanup => {
      try {
        cleanup();
      } catch (error) {
        console.warn('Cleanup function failed:', error);
      }
    });
    this.cleanupFunctions = [];
  }

  // 强制垃圾回收（仅在开发环境）
  static forceGC(): void {
    if (process.env.NODE_ENV === 'development' && 'gc' in window) {
      (window as any).gc();
    }
  }
}

// 性能分析工具
export class PerformanceAnalyzer {
  // 分析组件渲染性能
  static analyzeComponentPerformance(
    componentName: string,
    renderFunction: () => void
  ): void {
    PerformanceMonitor.startTiming(`component_${componentName}_render`);
    renderFunction();
    const duration = PerformanceMonitor.endTiming(`component_${componentName}_render`);
    
    if (duration > 16) { // 超过一帧的时间
      console.warn(`Slow render detected in ${componentName}: ${duration.toFixed(2)}ms`);
    }
  }

  // 分析网络请求性能
  static analyzeNetworkPerformance(): void {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'resource') {
            const resource = entry as PerformanceResourceTiming;
            if (resource.duration > 1000) { // 超过1秒的请求
              console.warn(`Slow network request: ${resource.name} (${resource.duration.toFixed(2)}ms)`);
            }
          }
        });
      });
      observer.observe({ entryTypes: ['resource'] });
    }
  }
}

// 导出所有工具
export const performanceUtils = {
  monitor: PerformanceMonitor,
  cache: CacheManager,
  memory: MemoryOptimizer,
  analyzer: PerformanceAnalyzer,
  debounce,
  throttle,
  preloadImages,
  lazyLoadImages,
  preloadResources,
  createAsyncComponent,
  batchProcess,
};

