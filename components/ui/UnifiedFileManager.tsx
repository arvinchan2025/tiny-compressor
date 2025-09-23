/**
 * 统一文件管理器组件
 * 结合文件上传和文件展示，提供流畅的用户体验
 */

'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Plus, X, Image as ImageIcon, FileImage } from 'lucide-react';
import { ImageFile } from '@/types/image';
import { formatFileSize } from '@/lib/utils';
import { useUserSettings } from '@/hooks/useUserSettings';

interface UnifiedFileManagerProps {
  files: ImageFile[];
  onFilesSelected: (files: ImageFile[]) => void;
  onRemoveFile: (fileId: string) => void;
  onSelectionChange?: (selectedIds: string[]) => void;
  selectedIds?: string[];
  maxFiles: number;
  acceptedTypes: string[];
  format: string;
  translations: any;
  processingMode: 'single' | 'batch';
  showBatchOperations?: boolean;
  showThumbnails?: boolean;
  compact?: boolean;
  className?: string;
}

const UnifiedFileManager: React.FC<UnifiedFileManagerProps> = ({
  files,
  onFilesSelected,
  onRemoveFile,
  onSelectionChange,
  selectedIds = [],
  maxFiles,
  acceptedTypes,
  format,
  translations,
  processingMode = 'single',
  showBatchOperations = false,
  showThumbnails = true,
  compact = false,
  className = '',
}) => {
  const { settings } = useUserSettings();
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setIsUploading(true);

    const droppedFiles = Array.from(e.dataTransfer.files);
    const imageFiles = droppedFiles.map(file => ({
      id: Math.random().toString(),
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file)
    }));

    onFilesSelected([...files, ...imageFiles]);
    setIsUploading(false);
  }, [files, onFilesSelected]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const imageFiles = selectedFiles.map(file => ({
      id: Math.random().toString(),
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file)
    }));

    onFilesSelected([...files, ...imageFiles]);
  }, [files, onFilesSelected]);

  const handleSelectFile = useCallback((fileId: string) => {
    if (!onSelectionChange) return;
    
    const newSelectedIds = selectedIds.includes(fileId)
      ? selectedIds.filter(id => id !== fileId)
      : [...selectedIds, fileId];
    
    onSelectionChange(newSelectedIds);
  }, [selectedIds, onSelectionChange]);

  const handleSelectAll = useCallback(() => {
    if (!onSelectionChange) return;
    onSelectionChange(files.map(f => f.id));
  }, [files, onSelectionChange]);

  const handleDeselectAll = useCallback(() => {
    if (!onSelectionChange) return;
    onSelectionChange([]);
  }, [onSelectionChange]);

  const handleRemoveSelected = useCallback(() => {
    selectedIds.forEach(id => onRemoveFile(id));
    onSelectionChange?.([]);
  }, [selectedIds, onRemoveFile, onSelectionChange]);

  const canAddMore = files.length < maxFiles;
  const hasFiles = files.length > 0;
  const isSingleMode = processingMode === 'single';
  const isBatchMode = processingMode === 'batch';

  // 单文件模式：最多1个文件
  const effectiveMaxFiles = isSingleMode ? 1 : maxFiles;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 单文件模式 - 简洁的上传区域 */}
      {isSingleMode && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`relative border-2 border-dashed rounded-xl transition-all duration-200 ${
            dragActive 
              ? 'border-blue-400 bg-blue-50/50 scale-105' 
              : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50/50'
          } ${hasFiles ? 'p-4' : 'p-8'}`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {hasFiles ? (
            // 单文件已上传 - 显示文件预览
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                {showThumbnails && files[0]?.url ? (
                  <img
                    src={files[0].url}
                    alt={files[0]?.name || ''}
                    className="w-full h-full object-cover rounded"
                  />
                ) : (
                  <ImageIcon className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 truncate">
                  {files[0]?.name}
                </h4>
                <p className="text-sm text-gray-500">
                  {formatFileSize(files[0]?.size || 0)}
                </p>
              </div>
              <button
                onClick={() => onRemoveFile(files[0]?.id || '')}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ) : (
            // 单文件上传区域
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Upload className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {translations?.upload?.singleFileTitle || 'Upload Your Image'}
              </h3>
              <p className="text-gray-600 mb-4">
                {translations?.upload?.singleFileSubtitle || 'Drag and drop your image here or click to browse'}
              </p>
              <div className="text-sm text-gray-500">
                {translations?.upload?.supportedFormats || `Supports ${format.toUpperCase()} images`}
              </div>
            </div>
          )}

          {/* 隐藏的文件输入 */}
          <input
            type="file"
            accept={acceptedTypes.join(',')}
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={!settings.features.enableDragDrop || hasFiles}
          />
        </motion.div>
      )}

      {/* 批量模式 - 丰富的文件管理区域 */}
      {isBatchMode && (
        <>
          {/* 上传区域 - 当没有文件或可以添加更多文件时显示 */}
          {canAddMore && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`relative border-2 border-dashed rounded-xl transition-all duration-200 ${
                dragActive 
                  ? 'border-blue-400 bg-blue-50/50 scale-105' 
                  : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50/50'
              } ${hasFiles ? 'p-4' : 'p-8'}`}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {hasFiles ? (
                // 批量模式 - 添加更多文件
                <div className="flex items-center justify-center space-x-4">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Plus className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {translations?.upload?.addMore || 'Add more files'}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {files.length}/{maxFiles} files
                  </div>
                </div>
              ) : (
                // 批量模式 - 初始上传
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <Upload className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {translations?.upload?.batchTitle || 'Upload Multiple Images'}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {translations?.upload?.batchSubtitle || 'Drag and drop multiple images here or click to browse'}
                  </p>
                  <div className="text-sm text-gray-500">
                    {translations?.upload?.supportedFormats || `Supports ${format.toUpperCase()} images`}
                  </div>
                </div>
              )}

              {/* 隐藏的文件输入 */}
              <input
                type="file"
                multiple
                accept={acceptedTypes.join(',')}
                onChange={handleFileInput}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={!settings.features.enableDragDrop}
              />
            </motion.div>
          )}

          {/* 文件列表 - 当有文件时显示 */}
          <AnimatePresence>
            {hasFiles && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-gray-50 rounded-xl p-4"
              >
                {/* 文件统计和批量操作 */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <h4 className="font-medium text-gray-900">
                      {translations?.upload?.uploadedFiles || 'Uploaded Files'} ({files.length})
                    </h4>
                    {showBatchOperations && files.length > 1 && (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={handleSelectAll}
                          className="text-sm text-blue-600 hover:text-blue-700"
                        >
                          Select All
                        </button>
                        <span className="text-gray-300">|</span>
                        <button
                          onClick={handleDeselectAll}
                          className="text-sm text-blue-600 hover:text-blue-700"
                        >
                          Deselect All
                        </button>
                        {selectedIds.length > 0 && (
                          <>
                            <span className="text-gray-300">|</span>
                            <button
                              onClick={handleRemoveSelected}
                              className="text-sm text-red-600 hover:text-red-700"
                            >
                              Remove Selected ({selectedIds.length})
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatFileSize(files.reduce((sum, file) => sum + file.size, 0))}
                  </div>
                </div>

                {/* 文件网格 */}
                <div className={`grid gap-3 ${
                  compact 
                    ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6'
                    : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
                }`}>
                  {files.map((file, index) => (
                    <motion.div
                      key={file.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      className={`relative bg-white rounded-lg border border-gray-200 overflow-hidden group hover:shadow-md transition-all duration-200 ${
                        selectedIds.includes(file.id) ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                      }`}
                    >
                      {/* 选择框 */}
                      {showBatchOperations && (
                        <div className="absolute top-2 left-2 z-10">
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(file.id)}
                            onChange={() => handleSelectFile(file.id)}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                          />
                        </div>
                      )}

                      {/* 文件预览 */}
                      <div className={`aspect-square bg-gray-100 flex items-center justify-center ${
                        compact ? 'p-2' : 'p-4'
                      }`}>
                        {showThumbnails && file.url ? (
                          <img
                            src={file.url}
                            alt={file.name}
                            className="w-full h-full object-cover rounded"
                          />
                        ) : (
                          <ImageIcon className={`text-gray-400 ${compact ? 'w-6 h-6' : 'w-8 h-8'}`} />
                        )}
                      </div>

                      {/* 文件信息 */}
                      {!compact && (
                        <div className="p-3">
                          <h5 className="font-medium text-gray-900 truncate text-sm">
                            {file.name}
                          </h5>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                      )}

                      {/* 删除按钮 */}
                      <button
                        onClick={() => onRemoveFile(file.id)}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
};

export default UnifiedFileManager;
