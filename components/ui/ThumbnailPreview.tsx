'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageFile } from '@/types/image';

interface ThumbnailPreviewProps {
  file: ImageFile;
  size?: 'small' | 'medium' | 'large';
  showInfo?: boolean;
  showActions?: boolean;
  onRemove?: () => void;
  onPreview?: () => void;
  className?: string;
}

export default function ThumbnailPreview({
  file,
  size = 'medium',
  showInfo = true,
  showActions = true,
  onRemove,
  onPreview,
  className = ''
}: ThumbnailPreviewProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // 获取尺寸类
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'w-16 h-16';
      case 'medium':
        return 'w-24 h-24';
      case 'large':
        return 'w-32 h-32';
      default:
        return 'w-24 h-24';
    }
  };

  // 获取信息类
  const getInfoClasses = () => {
    switch (size) {
      case 'small':
        return 'text-xs';
      case 'medium':
        return 'text-sm';
      case 'large':
        return 'text-base';
      default:
        return 'text-sm';
    }
  };

  // 处理图片加载
  const handleImageLoad = () => {
    setIsLoading(false);
    setHasError(false);
    
    if (imgRef.current) {
      setImageDimensions({
        width: imgRef.current.naturalWidth,
        height: imgRef.current.naturalHeight
      });
    }
  };

  // 处理图片错误
  const handleImageError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  // 格式化文件大小
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // 获取文件类型图标
  const getFileTypeIcon = () => {
    const type = file.type.toLowerCase();
    if (type.includes('jpeg') || type.includes('jpg')) return '📷';
    if (type.includes('png')) return '🖼️';
    if (type.includes('webp')) return '🌐';
    if (type.includes('avif')) return '⚡';
    if (type.includes('gif')) return '🎬';
    return '📄';
  };

  // 获取文件类型颜色
  const getFileTypeColor = () => {
    const type = file.type.toLowerCase();
    if (type.includes('jpeg') || type.includes('jpg')) return 'bg-yellow-100 text-yellow-800';
    if (type.includes('png')) return 'bg-blue-100 text-blue-800';
    if (type.includes('webp')) return 'bg-green-100 text-green-800';
    if (type.includes('avif')) return 'bg-purple-100 text-purple-800';
    if (type.includes('gif')) return 'bg-pink-100 text-pink-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.2 }}
      className={`relative group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200 ${className}`}
    >
      {/* 缩略图区域 */}
      <div className={`relative ${getSizeClasses()} flex items-center justify-center bg-gray-50`}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent"></div>
          </div>
        )}
        
        {hasError ? (
          <div className="flex flex-col items-center justify-center text-gray-400">
            <div className="text-2xl mb-1">{getFileTypeIcon()}</div>
            <div className="text-xs">加载失败</div>
          </div>
        ) : (
          <img
            ref={imgRef}
            src={file.url}
            alt={file.name}
            className={`w-full h-full object-cover transition-opacity duration-200 ${
              isLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onLoad={handleImageLoad}
            onError={handleImageError}
            onClick={onPreview}
          />
        )}

        {/* 悬停遮罩 */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
          {onPreview && (
            <button
              onClick={onPreview}
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white bg-opacity-90 rounded-full p-2 hover:bg-opacity-100"
            >
              <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
          )}
        </div>

        {/* 文件类型标识 */}
        <div className={`absolute top-1 right-1 px-1.5 py-0.5 rounded text-xs font-medium ${getFileTypeColor()}`}>
          {file.type.split('/')[1]?.toUpperCase() || 'FILE'}
        </div>
      </div>

      {/* 文件信息 */}
      {showInfo && (
        <div className={`p-2 ${getInfoClasses()}`}>
          <div className="font-medium text-gray-900 truncate" title={file.name}>
            {file.name}
          </div>
          <div className="text-gray-500 text-xs mt-1">
            {formatFileSize(file.size)}
            {imageDimensions && (
              <span className="ml-1">
                • {imageDimensions.width}×{imageDimensions.height}
              </span>
            )}
          </div>
        </div>
      )}

      {/* 操作按钮 */}
      {showActions && (
        <div className="absolute top-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {onRemove && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              className="bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors duration-200"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
}

