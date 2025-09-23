'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageFile } from '@/types/image';

interface ImagePreviewModalProps {
  file: ImageFile | null;
  isOpen: boolean;
  onClose: () => void;
  onNext?: (() => void) | undefined;
  onPrevious?: (() => void) | undefined;
  hasNext?: boolean;
  hasPrevious?: boolean;
  className?: string;
}

export default function ImagePreviewModal({
  file,
  isOpen,
  onClose,
  onNext,
  onPrevious,
  hasNext = false,
  hasPrevious = false,
  className = ''
}: ImagePreviewModalProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // 重置状态当文件改变时
  useEffect(() => {
    if (file) {
      setImageLoaded(false);
      setImageError(false);
      setZoom(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [file]);

  // 键盘事件处理
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          if (hasPrevious && onPrevious) {
            onPrevious();
          }
          break;
        case 'ArrowRight':
          if (hasNext && onNext) {
            onNext();
          }
          break;
        case '+':
        case '=':
          setZoom(prev => Math.min(prev * 1.2, 5));
          break;
        case '-':
          setZoom(prev => Math.max(prev / 1.2, 0.1));
          break;
        case '0':
          setZoom(1);
          setPosition({ x: 0, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onNext, onPrevious, hasNext, hasPrevious]);

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageLoaded(false);
    setImageError(true);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(prev => Math.max(0.1, Math.min(5, prev * delta)));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!file) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center ${className}`}
          onClick={onClose}
        >
          {/* 关闭按钮 */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 transition-colors duration-200"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* 导航按钮 */}
          {hasPrevious && onPrevious && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPrevious();
              }}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 text-white hover:text-gray-300 transition-colors duration-200"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {hasNext && onNext && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNext();
              }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 text-white hover:text-gray-300 transition-colors duration-200"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          {/* 图片容器 */}
          <div
            className="relative max-w-full max-h-full overflow-hidden"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onWheel={handleWheel}
            onClick={(e) => e.stopPropagation()}
          >
            {imageError ? (
              <div className="flex flex-col items-center justify-center text-white p-8">
                <div className="text-6xl mb-4">❌</div>
                <div className="text-xl mb-2">图片加载失败</div>
                <div className="text-sm text-gray-300">{file.name}</div>
              </div>
            ) : (
              <motion.img
                src={file.url}
                alt={file.name}
                className="max-w-full max-h-full object-contain"
                style={{
                  transform: `scale(${zoom}) translate(${position.x}px, ${position.y}px)`,
                  cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'
                }}
                onLoad={handleImageLoad}
                onError={handleImageError}
                initial={{ opacity: 0 }}
                animate={{ opacity: imageLoaded ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              />
            )}

            {/* 加载指示器 */}
            {!imageLoaded && !imageError && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
              </div>
            )}
          </div>

          {/* 文件信息 */}
          <div className="absolute bottom-4 left-4 right-4 z-10">
            <div className="bg-black bg-opacity-50 rounded-lg p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-semibold">{file.name}</div>
                  <div className="text-sm text-gray-300">
                    {formatFileSize(file.size)} • {file.type}
                  </div>
                </div>
                <div className="text-sm text-gray-300">
                  缩放: {Math.round(zoom * 100)}%
                </div>
              </div>
            </div>
          </div>

          {/* 缩放控制 */}
          <div className="absolute top-4 left-4 z-10 flex items-center space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setZoom(prev => Math.max(0.1, prev / 1.2));
              }}
              className="bg-black bg-opacity-50 text-white px-3 py-2 rounded hover:bg-opacity-70 transition-colors duration-200"
            >
              -
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setZoom(1);
                setPosition({ x: 0, y: 0 });
              }}
              className="bg-black bg-opacity-50 text-white px-3 py-2 rounded hover:bg-opacity-70 transition-colors duration-200"
            >
              重置
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setZoom(prev => Math.min(5, prev * 1.2));
              }}
              className="bg-black bg-opacity-50 text-white px-3 py-2 rounded hover:bg-opacity-70 transition-colors duration-200"
            >
              +
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
