'use client';

import React, { useRef, useEffect, useState } from 'react';
import { X, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatDuration } from '@/lib/video-processing/compression';

interface VideoPreviewCardProps {
  file: {
    name: string;
    size: number;
    file: File;
    metadata?: {
      duration: number;
      width: number;
      height: number;
      fps: number;
      hasAudio: boolean;
    };
  };
  onRemove?: () => void;
  accentColor?: string;
}

export default function VideoPreviewCard({
  file,
  onRemove,
  accentColor = 'purple'
}: VideoPreviewCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [videoUrl, setVideoUrl] = useState<string>('');
  
  useEffect(() => {
    const url = URL.createObjectURL(file.file);
    setVideoUrl(url);
    
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file.file]);
  
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };
  
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };
  
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };
  
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  return (
    <motion.div
      className="card-glass overflow-hidden"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* 视频预览 */}
      <div className="relative bg-black aspect-video">
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full h-full object-contain"
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => setIsPlaying(false)}
          muted={isMuted}
        />
        
        {/* 播放控制覆盖层 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 opacity-0 hover:opacity-100 transition-opacity">
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={togglePlay}
              className="w-16 h-16 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
            >
              {isPlaying ? (
                <Pause className="w-8 h-8 text-gray-900" />
              ) : (
                <Play className="w-8 h-8 text-gray-900 ml-1" />
              )}
            </button>
          </div>
          
          {/* 音量控制 */}
          <div className="absolute top-4 right-4">
            <button
              onClick={toggleMute}
              className="p-2 bg-black/50 hover:bg-black/70 rounded-lg transition-colors"
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5 text-white" />
              ) : (
                <Volume2 className="w-5 h-5 text-white" />
              )}
            </button>
          </div>
        </div>
        
        {/* 进度条 */}
        {file.metadata?.duration && (
          <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
            <div className="flex items-center gap-2 text-white text-xs">
              <span>{formatDuration(currentTime)}</span>
              <input
                type="range"
                min="0"
                max={file.metadata.duration}
                step="0.1"
                value={currentTime}
                onChange={handleSeek}
                className="flex-1 h-1 bg-white/30 rounded-full appearance-none cursor-pointer accent-purple-500"
              />
              <span>{formatDuration(file.metadata.duration)}</span>
            </div>
          </div>
        )}
      </div>
      
      {/* 文件信息 */}
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className={`p-3 bg-${accentColor}-500/10 dark:bg-${accentColor}-500/20 rounded-lg flex-shrink-0`}>
            <svg className={`w-8 h-8 text-${accentColor}-600 dark:text-${accentColor}-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 truncate">
              {file.name}
            </h4>
            
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-500 dark:text-gray-400">Size:</span>
                <span className="ml-2 text-gray-900 dark:text-white font-medium">
                  {formatFileSize(file.size)}
                </span>
              </div>
              
              {file.metadata?.duration && (
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Duration:</span>
                  <span className="ml-2 text-gray-900 dark:text-white font-medium">
                    {formatDuration(file.metadata.duration)}
                  </span>
                </div>
              )}
              
              {file.metadata && (
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Resolution:</span>
                  <span className="ml-2 text-gray-900 dark:text-white font-medium">
                    {file.metadata.width}×{file.metadata.height}
                  </span>
                </div>
              )}
              
              {file.metadata?.fps && (
                <div>
                  <span className="text-gray-500 dark:text-gray-400">FPS:</span>
                  <span className="ml-2 text-gray-900 dark:text-white font-medium">
                    {file.metadata.fps}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          {onRemove && (
            <button
              onClick={onRemove}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors flex-shrink-0"
              aria-label="Remove file"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

