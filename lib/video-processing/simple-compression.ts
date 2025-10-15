/**
 * Simple Video Compression using Browser Native APIs
 * 使用浏览器原生 API 进行简单的视频压缩
 */

export interface SimpleVideoFile {
  id: string;
  name: string;
  size: number;
  type: string;
  file: File;
  duration?: number;
}

export interface SimpleCompressionOptions {
  quality: 'low' | 'medium' | 'high';
  resolution?: 'keep' | '720p' | '480p' | '360p';
}

export interface SimpleCompressionResult {
  id: string;
  originalFile: SimpleVideoFile;
  compressedBlob: Blob;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  processingTime: number;
}

export async function compressVideoSimple(
  videoFile: SimpleVideoFile,
  options: SimpleCompressionOptions,
  onProgress?: (progress: number) => void
): Promise<SimpleCompressionResult> {
  const startTime = Date.now();
  
  return new Promise((resolve, reject) => {
    try {
      const video = document.createElement('video');
      video.src = URL.createObjectURL(videoFile.file);
      
      video.addEventListener('loadedmetadata', () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }
        
        // 设置分辨率
        let targetWidth = video.videoWidth;
        let targetHeight = video.videoHeight;
        
        if (options.resolution && options.resolution !== 'keep') {
          const resolutions = {
            '720p': { width: 1280, height: 720 },
            '480p': { width: 854, height: 480 },
            '360p': { width: 640, height: 360 }
          };
          
          const targetRes = resolutions[options.resolution];
          const aspectRatio = video.videoWidth / video.videoHeight;
          
          if (aspectRatio > targetRes.width / targetRes.height) {
            targetWidth = targetRes.width;
            targetHeight = targetRes.width / aspectRatio;
          } else {
            targetHeight = targetRes.height;
            targetWidth = targetRes.height * aspectRatio;
          }
        }
        
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        
        // 设置压缩质量
        const qualityMap = {
          'low': 0.3,
          'medium': 0.6,
          'high': 0.8
        };
        
        const quality = qualityMap[options.quality];
        
        // 使用 MediaRecorder API 进行压缩
        const stream = canvas.captureStream(30); // 30 FPS
        
        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: 'video/webm;codecs=vp9',
          videoBitsPerSecond: quality * 1000000 // 根据质量设置比特率
        });
        
        const chunks: Blob[] = [];
        
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunks.push(event.data);
          }
        };
        
        mediaRecorder.onstop = () => {
          const compressedBlob = new Blob(chunks, { type: 'video/webm' });
          const processingTime = Date.now() - startTime;
          
          resolve({
            id: videoFile.id,
            originalFile: videoFile,
            compressedBlob,
            originalSize: videoFile.size,
            compressedSize: compressedBlob.size,
            compressionRatio: (1 - compressedBlob.size / videoFile.size) * 100,
            processingTime
          });
        };
        
        mediaRecorder.onerror = (error) => {
          reject(new Error(`MediaRecorder error: ${error}`));
        };
        
        // 开始录制
        mediaRecorder.start();
        
        // 播放视频并绘制到 canvas
        video.currentTime = 0;
        video.play();
        
        const drawFrame = () => {
          if (video.currentTime >= video.duration) {
            mediaRecorder.stop();
            URL.revokeObjectURL(video.src);
            return;
          }
          
          ctx.drawImage(video, 0, 0, targetWidth, targetHeight);
          
          // 更新进度
          const progress = (video.currentTime / video.duration) * 100;
          onProgress?.(progress);
          
          requestAnimationFrame(drawFrame);
        };
        
        video.addEventListener('play', drawFrame);
      });
      
      video.addEventListener('error', (error) => {
        reject(new Error(`Video loading error: ${error}`));
      });
      
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * 检查浏览器是否支持简单的视频压缩
 */
export function isSimpleCompressionSupported(): boolean {
  return !!(
    document.createElement('canvas').getContext('2d') &&
    window.MediaRecorder &&
    MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
  );
}

/**
 * 获取支持的 MIME 类型
 */
export function getSupportedMimeTypes(): string[] {
  const types = [
    'video/webm;codecs=vp9',
    'video/webm;codecs=vp8',
    'video/webm',
    'video/mp4'
  ];
  
  return types.filter(type => MediaRecorder.isTypeSupported(type));
}
