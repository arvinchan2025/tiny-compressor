/**
 * Video Processing Types
 * Types for video compression functionality
 */

export interface VideoFile {
  id: string;
  name: string;
  size: number;
  type: string;
  duration?: number;
  file: File;
  metadata?: VideoMetadata;
}

export interface VideoMetadata {
  duration: number;
  width: number;
  height: number;
  fps: number;
  bitrate: number;
  codec: string;
  hasAudio: boolean;
}

export interface VideoCompressionOptions {
  quality: 'low' | 'medium' | 'high' | 'custom';
  resolution?: 'keep' | '1080p' | '720p' | '480p' | '360p';
  bitrate?: number;
  fps?: number;
  codec?: 'h264' | 'h265' | 'vp9';
  removeAudio?: boolean;
  customCommand?: string[];
}

export interface VideoCompressionResult {
  id: string;
  originalFile: VideoFile;
  compressedBlob: Blob;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  processingTime: number;
  metadata?: VideoMetadata;
}

export interface CompressionProgress {
  stage: 'loading' | 'processing' | 'finalizing' | 'completed';
  progress: number; // 0-100
  currentTime: number;
  totalDuration: number;
  estimatedTimeRemaining: number;
}

export interface FFmpegLoadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

