/**
 * 图片优化工具类
 * 提供图片压缩、缓存、懒加载等功能
 */

import { ImageFile } from '@/types/image';

export interface ImageOptimizationOptions {
  quality?: number;
  maxWidth?: number;
  maxHeight?: number;
  format?: 'jpeg' | 'png' | 'webp' | 'avif';
  progressive?: boolean;
  optimizeForWeb?: boolean;
}

export class ImageOptimizer {
  private static cache = new Map<string, string>();
  private static readonly MAX_CACHE_SIZE = 50;

  /**
   * 优化图片尺寸和质量
   */
  static async optimizeImage(
    file: File,
    options: ImageOptimizationOptions = {}
  ): Promise<Blob> {
    const {
      quality = 0.8,
      maxWidth = 1920,
      maxHeight = 1080,
      format = 'jpeg',
      progressive = true,
      optimizeForWeb = true
    } = options;

    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        try {
          // 计算新尺寸
          let { width, height } = img;
          
          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = Math.floor(width * ratio);
            height = Math.floor(height * ratio);
          }

          canvas.width = width;
          canvas.height = height;

          // 绘制优化后的图片
          ctx?.drawImage(img, 0, 0, width, height);

          // 转换为Blob
          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error('Failed to optimize image'));
              }
            },
            `image/${format}`,
            quality
          );
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * 生成图片缩略图
   */
  static async generateThumbnail(
    file: File,
    size: number = 150
  ): Promise<string> {
    const cacheKey = `${file.name}_${size}_${file.lastModified}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        try {
          // 计算缩略图尺寸
          const { width, height } = img;
          const ratio = Math.min(size / width, size / height);
          const newWidth = Math.floor(width * ratio);
          const newHeight = Math.floor(height * ratio);

          canvas.width = newWidth;
          canvas.height = newHeight;

          // 绘制缩略图
          ctx?.drawImage(img, 0, 0, newWidth, newHeight);

          const thumbnail = canvas.toDataURL('image/jpeg', 0.7);
          
          // 缓存缩略图
          this.setCache(cacheKey, thumbnail);
          
          resolve(thumbnail);
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => reject(new Error('Failed to generate thumbnail'));
      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * 批量优化图片
   */
  static async optimizeBatch(
    files: File[],
    options: ImageOptimizationOptions = {}
  ): Promise<Blob[]> {
    const promises = files.map(file => this.optimizeImage(file, options));
    return Promise.all(promises);
  }

  /**
   * 获取图片元数据
   */
  static async getImageMetadata(file: File): Promise<{
    width: number;
    height: number;
    size: number;
    type: string;
    aspectRatio: number;
  }> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        resolve({
          width: img.naturalWidth,
          height: img.naturalHeight,
          size: file.size,
          type: file.type,
          aspectRatio: img.naturalWidth / img.naturalHeight
        });
      };
      
      img.onerror = () => reject(new Error('Failed to load image metadata'));
      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * 检查图片格式支持
   */
  static getSupportedFormats(): string[] {
    const formats = ['image/jpeg', 'image/png', 'image/gif'];
    
    // 检查WebP支持
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    
    if (canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0) {
      formats.push('image/webp');
    }
    
    // 检查AVIF支持
    if (canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0) {
      formats.push('image/avif');
    }
    
    return formats;
  }

  /**
   * 缓存管理
   */
  private static setCache(key: string, value: string): void {
    if (this.cache.size >= this.MAX_CACHE_SIZE) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }

  /**
   * 清理缓存
   */
  static clearCache(): void {
    this.cache.clear();
  }

  /**
   * 获取缓存大小
   */
  static getCacheSize(): number {
    return this.cache.size;
  }
}

/**
 * 图片懒加载组件
 */
export class LazyImageLoader {
  private static observer: IntersectionObserver | null = null;
  private static loadedImages = new Set<string>();

  /**
   * 初始化懒加载
   */
  static init(options: IntersectionObserverInit = {}) {
    if (this.observer) return;

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          this.loadImage(img);
          this.observer?.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px',
      threshold: 0.1,
      ...options
    });
  }

  /**
   * 观察图片元素
   */
  static observe(img: HTMLImageElement) {
    if (!this.observer) this.init();
    this.observer?.observe(img);
  }

  /**
   * 加载图片
   */
  private static loadImage(img: HTMLImageElement) {
    const src = img.dataset.src;
    if (!src || this.loadedImages.has(src)) return;

    const imageLoader = new Image();
    imageLoader.onload = () => {
      img.src = src;
      img.classList.add('loaded');
      this.loadedImages.add(src);
    };
    imageLoader.onerror = () => {
      img.classList.add('error');
    };
    imageLoader.src = src;
  }

  /**
   * 清理观察者
   */
  static disconnect() {
    this.observer?.disconnect();
    this.observer = null;
    this.loadedImages.clear();
  }
}

/**
 * 图片预加载器
 */
export class ImagePreloader {
  private static preloadedImages = new Set<string>();

  /**
   * 预加载图片
   */
  static async preload(src: string): Promise<HTMLImageElement> {
    if (this.preloadedImages.has(src)) {
      const img = new Image();
      img.src = src;
      return Promise.resolve(img);
    }

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.preloadedImages.add(src);
        resolve(img);
      };
      img.onerror = reject;
      img.src = src;
    });
  }

  /**
   * 批量预加载
   */
  static async preloadBatch(srcs: string[]): Promise<HTMLImageElement[]> {
    const promises = srcs.map(src => this.preload(src));
    return Promise.all(promises);
  }

  /**
   * 清理预加载缓存
   */
  static clearPreloaded(): void {
    this.preloadedImages.clear();
  }
}

/**
 * 响应式图片工具
 */
export class ResponsiveImageHelper {
  /**
   * 生成响应式图片srcSet
   */
  static generateSrcSet(
    baseSrc: string,
    widths: number[] = [320, 640, 1024, 1920]
  ): string {
    return widths
      .map(width => `${baseSrc}?w=${width} ${width}w`)
      .join(', ');
  }

  /**
   * 生成响应式图片sizes属性
   */
  static generateSizes(): string {
    return '(max-width: 320px) 100vw, (max-width: 768px) 50vw, 33vw';
  }

  /**
   * 获取最适合的图片尺寸
   */
  static getOptimalSize(
    containerWidth: number,
    devicePixelRatio: number = 1
  ): number {
    const targetWidth = containerWidth * devicePixelRatio;
    const sizes = [320, 640, 1024, 1920, 2560];
    
    return sizes.find(size => size >= targetWidth) || sizes[sizes.length - 1];
  }
}

const imageOptimizationModule = {
  ImageOptimizer,
  LazyImageLoader,
  ImagePreloader,
  ResponsiveImageHelper
};

export default imageOptimizationModule;

