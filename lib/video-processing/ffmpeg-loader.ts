/**
 * FFmpeg Loader
 * Handles dynamic loading and initialization of FFmpeg.wasm
 */

import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL } from '@ffmpeg/util';
import type { FFmpegLoadProgress } from './types';

let ffmpegInstance: FFmpeg | null = null;
let isLoading = false;
let loadPromise: Promise<FFmpeg> | null = null;

/**
 * Load FFmpeg.wasm with progress tracking
 */
export async function loadFFmpeg(
  onProgress?: (progress: FFmpegLoadProgress) => void
): Promise<FFmpeg> {
  // If already loaded, return the instance
  if (ffmpegInstance) {
    return ffmpegInstance;
  }
  
  // If currently loading, wait for it to complete
  if (isLoading && loadPromise) {
    return loadPromise;
  }
  
  isLoading = true;
  
  loadPromise = (async () => {
    try {
      console.log('🔄 Starting FFmpeg load...');
      console.log('ℹ️ Using single-thread FFmpeg (no SharedArrayBuffer required)');
      console.log('ℹ️ Detected proxy environment - will try multiple CDN sources');
      
      const ffmpeg = new FFmpeg();
      
      // Listen to log messages and progress
      ffmpeg.on('log', ({ message }) => {
        console.log('[FFmpeg]', message);
      });
      
      ffmpeg.on('progress', ({ progress, time }) => {
        console.log('[FFmpeg Progress]', progress, time);
      });
      
      // Initial progress
      onProgress?.({ loaded: 0, total: 100, percentage: 0 });
      console.log('📥 Starting FFmpeg initialization...');
      await new Promise(resolve => setTimeout(resolve, 100));
      
      onProgress?.({ loaded: 10, total: 100, percentage: 10 });
      console.log('🔧 Preparing FFmpeg core files...');
      await new Promise(resolve => setTimeout(resolve, 100));
      
      try {
        // 直接使用 FFmpeg 默认配置，避免 CDN 和 CORS 问题
        onProgress?.({ loaded: 20, total: 100, percentage: 20 });
        console.log('📥 Using FFmpeg default configuration to avoid CORS issues...');
        
        console.log('🔧 Initializing FFmpeg with default settings...');
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // 直接使用默认配置加载
        console.log('🔄 Loading FFmpeg with default configuration...');
        const loadPromise = ffmpeg.load();
        
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => {
            reject(new Error('FFmpeg load timeout after 600 seconds. Please check your internet connection and try again.'));
          }, 600000); // 10 分钟
        });
        
        console.log('⏳ Waiting for FFmpeg initialization (this may take 2-10 minutes for first load)...');
        console.log('📊 Progress will be updated as FFmpeg initializes...');
        
        await Promise.race([loadPromise, timeoutPromise]);
        
        onProgress?.({ loaded: 90, total: 100, percentage: 90 });
        console.log('✅ FFmpeg.load() completed');
      } catch (loadError: any) {
        console.error('❌ FFmpeg.load() failed:', loadError);
        console.error('Error details:', loadError.message, loadError.stack);
        
        // 提供更详细的错误信息，特别针对代理环境
        if (loadError.message.includes('timeout')) {
          throw new Error('FFmpeg 加载超时。如果您使用代理，请检查代理设置或尝试关闭代理后重试。');
        } else if (loadError.message.includes('CORS') || loadError.message.includes('fetch') || loadError.message.includes('Failed to fetch')) {
          throw new Error('FFmpeg 文件下载失败。代理环境可能需要特殊配置，请尝试：1) 关闭代理 2) 配置代理白名单 3) 使用其他网络环境');
        } else if (loadError.message.includes('network') || loadError.message.includes('ERR_NETWORK')) {
          throw new Error('网络连接失败。请检查代理设置或网络连接，然后重试。');
        } else {
          throw new Error(`FFmpeg 初始化失败: ${loadError.message}。如果您使用代理，请尝试关闭代理后重试。`);
        }
      }
      
      onProgress?.({ loaded: 100, total: 100, percentage: 100 });
      await new Promise(resolve => setTimeout(resolve, 200));
      
      ffmpegInstance = ffmpeg;
      console.log('✅ FFmpeg loaded successfully');
      
      return ffmpeg;
    } catch (error) {
      console.error('❌ Failed to load FFmpeg:', error);
      throw new Error('Failed to load FFmpeg. Please refresh and try again.');
    } finally {
      isLoading = false;
      loadPromise = null;
    }
  })();
  
  return loadPromise;
}

/**
 * Check if FFmpeg is already loaded
 */
export function isFFmpegLoaded(): boolean {
  return ffmpegInstance !== null;
}

/**
 * Get the FFmpeg instance (if loaded)
 */
export function getFFmpegInstance(): FFmpeg | null {
  return ffmpegInstance;
}

/**
 * Unload FFmpeg and free memory
 */
export function unloadFFmpeg(): void {
  if (ffmpegInstance) {
    try {
      ffmpegInstance.terminate();
      console.log('✅ FFmpeg terminated');
    } catch (error) {
      console.error('Error terminating FFmpeg:', error);
    }
    ffmpegInstance = null;
  }
}

/**
 * Preload FFmpeg in the background (optional)
 */
export async function preloadFFmpeg(delay: number = 2000): Promise<void> {
  // Wait for the specified delay to avoid blocking initial page load
  await new Promise(resolve => setTimeout(resolve, delay));
  
  if (!isFFmpegLoaded()) {
    try {
      await loadFFmpeg();
    } catch (error) {
      console.error('Background FFmpeg preload failed:', error);
    }
  }
}

