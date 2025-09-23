'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageFile } from '@/types/image';
import ThumbnailPreview from './ThumbnailPreview';

interface ThumbnailGridProps {
  files: ImageFile[];
  onRemoveFile?: (fileId: string) => void;
  onPreviewFile?: (file: ImageFile) => void;
  onSelectFile?: ((fileId: string) => void) | undefined;
  selectedFiles?: string[];
  size?: 'small' | 'medium' | 'large';
  showInfo?: boolean;
  showActions?: boolean;
  maxFiles?: number;
  className?: string;
}

export default function ThumbnailGrid({
  files,
  onRemoveFile,
  onPreviewFile,
  onSelectFile,
  selectedFiles = [],
  size = 'medium',
  showInfo = true,
  showActions = true,
  maxFiles = 20,
  className = ''
}: ThumbnailGridProps) {
  const [hoveredFile, setHoveredFile] = useState<string | null>(null);

  // 获取网格列数
  const getGridCols = () => {
    switch (size) {
      case 'small':
        return 'grid-cols-6 md:grid-cols-8 lg:grid-cols-10';
      case 'medium':
        return 'grid-cols-3 md:grid-cols-4 lg:grid-cols-6';
      case 'large':
        return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4';
      default:
        return 'grid-cols-3 md:grid-cols-4 lg:grid-cols-6';
    }
  };

  // 获取间距
  const getGap = () => {
    switch (size) {
      case 'small':
        return 'gap-2';
      case 'medium':
        return 'gap-3';
      case 'large':
        return 'gap-4';
      default:
        return 'gap-3';
    }
  };

  const handleFileClick = (file: ImageFile) => {
    if (onSelectFile) {
      onSelectFile(file.id);
    }
    if (onPreviewFile) {
      onPreviewFile(file);
    }
  };

  const handleFileRemove = (fileId: string) => {
    if (onRemoveFile) {
      onRemoveFile(fileId);
    }
  };

  if (files.length === 0) {
    return (
      <div className={`text-center py-8 text-gray-500 ${className}`}>
        <div className="text-4xl mb-2">📁</div>
        <p>暂无文件</p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 文件统计 */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          共 {files.length} 个文件
          {maxFiles && ` (最多 ${maxFiles} 个)`}
        </div>
        <div className="text-sm text-gray-500">
          总大小: {formatFileSize(files.reduce((sum, file) => sum + file.size, 0))}
        </div>
      </div>

      {/* 缩略图网格 */}
      <div className={`grid ${getGridCols()} ${getGap()}`}>
        <AnimatePresence>
          {files.map((file, index) => (
            <motion.div
              key={file.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              onMouseEnter={() => setHoveredFile(file.id)}
              onMouseLeave={() => setHoveredFile(null)}
            >
              <ThumbnailPreview
                file={file}
                size={size}
                showInfo={showInfo}
                showActions={showActions}
                onRemove={() => handleFileRemove(file.id)}
                onPreview={() => handleFileClick(file)}
                className={`cursor-pointer transition-all duration-200 ${
                  selectedFiles.includes(file.id)
                    ? 'ring-2 ring-blue-500 bg-blue-50'
                    : hoveredFile === file.id
                    ? 'shadow-lg transform scale-105'
                    : ''
                }`}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* 文件列表视图（可选） */}
      {size === 'large' && (
        <div className="mt-6">
          <div className="text-sm font-medium text-gray-700 mb-3">文件详情</div>
          <div className="space-y-2">
            {files.map((file, index) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className={`flex items-center space-x-3 p-3 rounded-lg border transition-all duration-200 ${
                  selectedFiles.includes(file.id)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleFileClick(file)}
              >
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={file.url}
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate">
                    {file.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatFileSize(file.size)} • {file.type}
                  </div>
                </div>
                {onRemoveFile && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFileRemove(file.id);
                    }}
                    className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// 格式化文件大小
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
