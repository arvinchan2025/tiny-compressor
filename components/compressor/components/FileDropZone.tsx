/**
 * 文件拖拽上传区域组件
 */

'use client';

import React, { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { ImageFile } from '@/types/image';
import { Locale } from '@/lib/i18n';
import { useModuleTranslation } from '@/hooks/useTranslationNew';

interface FileDropZoneProps {
  onFileSelect: (file: ImageFile) => void;
  locale?: Locale;
  format?: string;
  resetKey?: number; // 用于重置文件输入
}

export default function FileDropZone({ onFileSelect, locale = 'en', format = 'png', resetKey = 0 }: FileDropZoneProps) {
  const { t } = useModuleTranslation(`compressors/${format}`, locale);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileSelect = useCallback((file: File) => {
    const imageFile: ImageFile = {
      id: `file_${Date.now()}`,
      name: file.name,
      size: file.size,
      type: file.type,
      file: file,
      url: URL.createObjectURL(file)
    };
    
    onFileSelect(imageFile);
  }, [onFileSelect]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      handleFileSelect(imageFile);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  return (
    <motion.div
      className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
        isDragOver
          ? 'border-blue-400 bg-blue-50'
          : 'border-slate-300 bg-slate-50 hover:border-slate-400 hover:bg-slate-100'
      }`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        animate={{ 
          rotate: isDragOver ? 360 : 0,
          scale: isDragOver ? 1.1 : 1
        }}
        transition={{ duration: 0.3 }}
        className="w-16 h-16 mx-auto mb-4"
      >
        <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <span className="text-white text-2xl">📁</span>
        </div>
      </motion.div>

      <h3 className="text-lg font-semibold text-slate-800 mb-2">
        {t('operation.upload.title')}
      </h3>
      
      <p className="text-slate-600 mb-4">
        {t('operation.upload.subtitle', { format: format.toUpperCase(), maxFiles: 10 })}
      </p>

      <input
        key={resetKey}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
        onChange={handleFileInputChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />

      <div className="flex justify-center space-x-4 text-xs text-slate-500">
        <span>PNG</span>
        <span>•</span>
        <span>JPEG</span>
        <span>•</span>
        <span>WebP</span>
        <span>•</span>
        <span>GIF</span>
      </div>
    </motion.div>
  );
}