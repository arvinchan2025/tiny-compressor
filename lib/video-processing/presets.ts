/**
 * Video Compression Presets
 * Pre-configured settings for different quality levels
 */

export const VIDEO_PRESETS = {
  // 低质量 - 快速分享，最小文件大小
  low: {
    name: 'Low Quality (Fast)',
    description: 'Smallest file size, fastest compression. Best for quick sharing.',
    resolution: '480p' as const,
    bitrate: 500000, // 500 Kbps
    crf: 32, // Constant Rate Factor (0-51, lower = better quality)
    preset: 'veryfast', // FFmpeg preset
    audioBitrate: '64k',
    estimatedRatio: 0.85, // 压缩 85%
    estimatedSpeed: 'fast', // 相对速度
  },
  
  // 中等质量 - 平衡质量和文件大小
  medium: {
    name: 'Medium Quality (Balanced)',
    description: 'Good quality with reasonable file size. Balanced compression.',
    resolution: '720p' as const,
    bitrate: 1500000, // 1.5 Mbps
    crf: 26,
    preset: 'medium',
    audioBitrate: '128k',
    estimatedRatio: 0.65, // 压缩 65%
    estimatedSpeed: 'medium',
  },
  
  // 高质量 - 保留细节，较大文件
  high: {
    name: 'High Quality (Slow)',
    description: 'Best quality, larger file size. Preserves details.',
    resolution: '1080p' as const,
    bitrate: 3000000, // 3 Mbps
    crf: 23,
    preset: 'slow',
    audioBitrate: '192k',
    estimatedRatio: 0.45, // 压缩 45%
    estimatedSpeed: 'slow',
  },
} as const;

export const RESOLUTION_CONFIGS = {
  'keep': { width: -1, height: -1, label: 'Original' },
  '1080p': { width: 1920, height: 1080, label: '1080p (1920x1080)' },
  '720p': { width: 1280, height: 720, label: '720p (1280x720)' },
  '480p': { width: 854, height: 480, label: '480p (854x480)' },
  '360p': { width: 640, height: 360, label: '360p (640x360)' },
} as const;

export const CODEC_OPTIONS = {
  h264: {
    name: 'H.264 (AVC)',
    description: 'Most compatible, good quality',
    encoder: 'libx264',
  },
  h265: {
    name: 'H.265 (HEVC)',
    description: 'Better compression, less compatible',
    encoder: 'libx265',
  },
  vp9: {
    name: 'VP9',
    description: 'WebM format, good for web',
    encoder: 'libvpx-vp9',
  },
} as const;

export const FILE_SIZE_LIMIT = 500 * 1024 * 1024; // 500MB

export const SUPPORTED_VIDEO_FORMATS = [
  'video/mp4',
  'video/webm',
  'video/quicktime', // .mov
  'video/x-msvideo', // .avi
  'video/x-matroska', // .mkv
] as const;

export const SUPPORTED_VIDEO_EXTENSIONS = [
  '.mp4',
  '.webm',
  '.mov',
  '.avi',
  '.mkv',
  '.m4v',
  '.3gp',
] as const;

