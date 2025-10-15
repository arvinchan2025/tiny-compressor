/**
 * Video Compression Core Logic
 * Handles video compression using FFmpeg.wasm
 */

import { loadFFmpeg } from './ffmpeg-loader';
import { fetchFile } from '@ffmpeg/util';
import type { 
  VideoFile, 
  VideoCompressionOptions, 
  VideoCompressionResult,
  CompressionProgress,
  VideoMetadata
} from './types';
import { VIDEO_PRESETS, RESOLUTION_CONFIGS } from './presets';

/**
 * Compress a video file
 */
export async function compressVideo(
  videoFile: VideoFile,
  options: VideoCompressionOptions,
  onProgress?: (progress: CompressionProgress) => void
): Promise<VideoCompressionResult> {
  const startTime = Date.now();
  
  // 1. Load FFmpeg
  onProgress?.({
    stage: 'loading',
    progress: 0,
    currentTime: 0,
    totalDuration: videoFile.metadata?.duration || 0,
    estimatedTimeRemaining: 0,
  });
  
  const ffmpeg = await loadFFmpeg();
  
  // 2. Prepare input file
  const inputFileName = 'input' + getFileExtension(videoFile.name);
  const outputFileName = 'output.mp4';
  
  await ffmpeg.writeFile(inputFileName, await fetchFile(videoFile.file));
  
  // 3. Build FFmpeg command
  const preset = options.quality !== 'custom' 
    ? VIDEO_PRESETS[options.quality] 
    : null;
  
  const ffmpegArgs = buildFFmpegCommand(inputFileName, outputFileName, options, preset);
  
  console.log('FFmpeg command:', ffmpegArgs.join(' '));
  
  // 4. Listen to progress
  let lastProgress = 0;
  ffmpeg.on('progress', ({ progress, time }) => {
    const currentProgress = Math.round(progress * 100);
    if (currentProgress > lastProgress) {
      lastProgress = currentProgress;
      
      const duration = videoFile.metadata?.duration || 0;
      const currentTime = time / 1000000; // microseconds to seconds
      const elapsedTime = Date.now() - startTime;
      const estimatedTotal = currentProgress > 0 ? (elapsedTime / currentProgress) * 100 : 0;
      const estimatedTimeRemaining = Math.max(0, estimatedTotal - elapsedTime);
      
      onProgress?.({
        stage: 'processing',
        progress: currentProgress,
        currentTime,
        totalDuration: duration,
        estimatedTimeRemaining,
      });
    }
  });
  
  // 5. Execute compression
  try {
    await ffmpeg.exec(ffmpegArgs);
  } catch (error) {
    console.error('FFmpeg execution failed:', error);
    throw new Error('Video compression failed. Please try a different quality setting.');
  }
  
  // 6. Read output
  onProgress?.({
    stage: 'finalizing',
    progress: 95,
    currentTime: videoFile.metadata?.duration || 0,
    totalDuration: videoFile.metadata?.duration || 0,
    estimatedTimeRemaining: 1000,
  });
  
  const data = await ffmpeg.readFile(outputFileName);
  const compressedBlob = new Blob([data], { type: 'video/mp4' });
  
  // 7. Cleanup
  try {
    await ffmpeg.deleteFile(inputFileName);
    await ffmpeg.deleteFile(outputFileName);
  } catch (error) {
    console.error('Cleanup error:', error);
  }
  
  const processingTime = Date.now() - startTime;
  
  onProgress?.({
    stage: 'completed',
    progress: 100,
    currentTime: videoFile.metadata?.duration || 0,
    totalDuration: videoFile.metadata?.duration || 0,
    estimatedTimeRemaining: 0,
  });
  
  return {
    id: videoFile.id,
    originalFile: videoFile,
    compressedBlob,
    originalSize: videoFile.size,
    compressedSize: compressedBlob.size,
    compressionRatio: ((videoFile.size - compressedBlob.size) / videoFile.size) * 100,
    processingTime,
  };
}

/**
 * Build FFmpeg command arguments
 */
function buildFFmpegCommand(
  input: string,
  output: string,
  options: VideoCompressionOptions,
  preset?: typeof VIDEO_PRESETS[keyof typeof VIDEO_PRESETS]
): string[] {
  const args = ['-i', input];
  
  if (preset) {
    // Use preset configuration
    const resolution = RESOLUTION_CONFIGS[preset.resolution as keyof typeof RESOLUTION_CONFIGS];
    
    // Scale video if not keeping original resolution
    if (resolution && resolution.width > 0) {
      args.push('-vf', `scale=${resolution.width}:${resolution.height}`);
    }
    
    // Video codec and quality settings
    args.push(
      '-c:v', 'libx264',           // H.264 codec
      '-crf', preset.crf.toString(), // Quality (0-51, lower = better)
      '-preset', preset.preset,     // Encoding speed
    );
    
    // Audio settings
    args.push(
      '-c:a', 'aac',                // AAC audio codec
      '-b:a', preset.audioBitrate,  // Audio bitrate
    );
    
    // Optimize for streaming
    args.push('-movflags', '+faststart');
  } else {
    // Custom options
    if (options.resolution && options.resolution !== 'keep') {
      const res = RESOLUTION_CONFIGS[options.resolution];
      args.push('-vf', `scale=${res.width}:${res.height}`);
    }
    
    if (options.bitrate) {
      args.push('-b:v', `${options.bitrate}`);
    }
    
    if (options.fps) {
      args.push('-r', options.fps.toString());
    }
    
    if (options.removeAudio) {
      args.push('-an');
    } else {
      args.push('-c:a', 'aac', '-b:a', '128k');
    }
    
    if (options.customCommand && options.customCommand.length > 0) {
      args.push(...options.customCommand);
    }
  }
  
  args.push(output);
  return args;
}

/**
 * Get video metadata from file
 */
export async function getVideoMetadata(file: File): Promise<VideoMetadata> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    
    video.onloadedmetadata = () => {
      resolve({
        duration: video.duration,
        width: video.videoWidth,
        height: video.videoHeight,
        fps: 30, // Browser can't get actual FPS
        bitrate: 0, // Would need FFmpeg to get accurate bitrate
        codec: 'unknown',
        hasAudio: true, // Assume true, browser can't detect reliably
      });
      URL.revokeObjectURL(video.src);
    };
    
    video.onerror = () => {
      reject(new Error('Failed to load video metadata'));
    };
    
    video.src = URL.createObjectURL(file);
  });
}

/**
 * Create VideoFile object from File
 */
export async function createVideoFile(file: File): Promise<VideoFile> {
  const metadata = await getVideoMetadata(file);
  
  return {
    id: `video-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: file.name,
    size: file.size,
    type: file.type,
    duration: metadata.duration,
    file,
    metadata,
  };
}

/**
 * Get file extension from filename
 */
function getFileExtension(filename: string): string {
  const ext = filename.toLowerCase().match(/\.[^.]+$/);
  return ext ? ext[0] : '.mp4';
}

/**
 * Format duration to human readable string
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Estimate compression time based on file size and quality
 */
export function estimateCompressionTime(
  fileSize: number,
  quality: 'low' | 'medium' | 'high'
): number {
  // Very rough estimation: ~1MB per second for medium quality
  const baseMB = fileSize / (1024 * 1024);
  const multiplier = quality === 'low' ? 0.5 : quality === 'medium' ? 1 : 2;
  return Math.round(baseMB * multiplier * 1000); // Return in milliseconds
}

