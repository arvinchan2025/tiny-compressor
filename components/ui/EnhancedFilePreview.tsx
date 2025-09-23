'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageFile } from '@/types/image';
import ThumbnailGrid from './ThumbnailGrid';
import ImagePreviewModal from './ImagePreviewModal';
import { formatFileSize } from '@/lib/utils';

interface EnhancedFilePreviewProps {
  files: ImageFile[];
  onRemoveFile: (fileId: string) => void;
  onFileClick?: (file: ImageFile) => void;
  onSelectionChange?: (selectedIds: string[]) => void;
  maxFiles?: number;
  className?: string;
  showDetails?: boolean;
  compact?: boolean;
  selectable?: boolean;
  selectedIds?: string[];
}

export default function EnhancedFilePreview({
  files,
  onRemoveFile,
  onFileClick,
  onSelectionChange,
  maxFiles = 20,
  className = '',
  showDetails = true,
  compact = false,
  selectable = false,
  selectedIds = []
}: EnhancedFilePreviewProps) {
  const [selectedFile, setSelectedFile] = useState<ImageFile | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [internalSelectedIds, setInternalSelectedIds] = useState<string[]>([]);
  const [previewFile, setPreviewFile] = useState<ImageFile | null>(null);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const currentSelectedIds = selectedIds.length > 0 ? selectedIds : internalSelectedIds;

  const handleFileClick = (file: ImageFile) => {
    setSelectedFile(file);
    setShowModal(true);
    if (onFileClick) {
      onFileClick(file);
    }
  };

  const handlePreviewFile = (file: ImageFile) => {
    const index = files.findIndex(f => f.id === file.id);
    setPreviewIndex(index);
    setPreviewFile(file);
  };

  const handlePreviewNext = () => {
    if (previewIndex < files.length - 1) {
      const nextIndex = previewIndex + 1;
      setPreviewIndex(nextIndex);
      const nextFile = files[nextIndex];
      if (nextFile) {
        setPreviewFile(nextFile);
      }
    }
  };

  const handlePreviewPrevious = () => {
    if (previewIndex > 0) {
      const prevIndex = previewIndex - 1;
      setPreviewIndex(prevIndex);
      const prevFile = files[prevIndex];
      if (prevFile) {
        setPreviewFile(prevFile);
      }
    }
  };

  const handleClosePreview = () => {
    setPreviewFile(null);
  };

  const handleFileSelect = (fileId: string, checked: boolean) => {
    let newSelectedIds: string[];
    
    if (checked) {
      newSelectedIds = [...currentSelectedIds, fileId];
    } else {
      newSelectedIds = currentSelectedIds.filter(id => id !== fileId);
    }
    
    setInternalSelectedIds(newSelectedIds);
    if (onSelectionChange) {
      onSelectionChange(newSelectedIds);
    }
  };

  const handleSelectAll = () => {
    const allIds = files.map(file => file.id);
    setInternalSelectedIds(allIds);
    if (onSelectionChange) {
      onSelectionChange(allIds);
    }
  };

  const handleDeselectAll = () => {
    setInternalSelectedIds([]);
    if (onSelectionChange) {
      onSelectionChange([]);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedFile(null);
  };

  const getFileIcon = (type: string) => {
    if (type.includes('image')) return '🖼️';
    if (type.includes('video')) return '🎥';
    if (type.includes('audio')) return '🎵';
    return '📄';
  };

  if (files.length === 0) {
    return (
      <div className={`text-center py-8 text-gray-500 ${className}`}>
        <div className="text-4xl mb-2">📁</div>
        <p>No files uploaded yet</p>
      </div>
    );
  }

  return (
    <>
      <div className={`space-y-4 ${className}`}>
        {/* 批量操作工具栏 */}
        {selectable && files.length > 0 && (
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={currentSelectedIds.length === files.length && files.length > 0}
                  onChange={(e) => e.target.checked ? handleSelectAll() : handleDeselectAll()}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  全选 ({currentSelectedIds.length}/{files.length})
                </span>
              </label>
            </div>
          </div>
        )}

        {/* 文件统计和视图控制 */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">
            Uploaded Files ({files.length}/{maxFiles})
          </h3>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500">
              Total: {formatFileSize(files.reduce((sum, file) => sum + file.size, 0))}
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  viewMode === 'grid' 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  viewMode === 'list' 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* 文件显示区域 */}
        {viewMode === 'grid' ? (
          <ThumbnailGrid
            files={files}
            onRemoveFile={onRemoveFile}
            onPreviewFile={handlePreviewFile}
            onSelectFile={selectable ? (fileId) => {
              const isSelected = currentSelectedIds.includes(fileId);
              handleFileSelect(fileId, !isSelected);
            } : undefined}
            selectedFiles={currentSelectedIds}
            size={compact ? 'small' : 'medium'}
            showInfo={showDetails}
            showActions={true}
            maxFiles={maxFiles}
          />
        ) : (
          <div className={`grid gap-4 ${
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
                className={`group relative bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200 ${
                  compact ? 'p-2' : 'p-4'
                } ${
                  currentSelectedIds.includes(file.id) ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                }`}
              >
                {/* 选择复选框 */}
                {selectable && (
                  <div className="absolute top-2 left-2 z-10">
                    <input
                      type="checkbox"
                      checked={currentSelectedIds.includes(file.id)}
                      onChange={(e) => handleFileSelect(file.id, e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>
                )}

                {/* 文件预览 */}
                <div className={`aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden ${
                  compact ? 'h-16' : 'h-32'
                }`}>
                  <img
                    src={file.url}
                    alt={file.name}
                    className="w-full h-full object-cover"
                    onClick={() => handleFileClick(file)}
                  />
                </div>

                {/* 文件信息 */}
                {showDetails && (
                  <div className={`space-y-1 ${compact ? 'text-xs' : 'text-sm'}`}>
                    <div className="font-medium text-gray-900 truncate" title={file.name}>
                      {file.name}
                    </div>
                    <div className="text-gray-500">
                      {formatFileSize(file.size)}
                    </div>
                    <div className="text-gray-400 text-xs">
                      {file.type.split('/')[1]?.toUpperCase() || 'FILE'}
                    </div>
                  </div>
                )}

                {/* 悬停操作 */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                    <button
                      onClick={() => handleFileClick(file)}
                      className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all duration-200"
                    >
                      <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => onRemoveFile(file.id)}
                      className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all duration-200"
                    >
                      <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* 文件详情模态框 */}
        <AnimatePresence>
          {showModal && selectedFile && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
              onClick={closeModal}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* 模态框头部 */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{getFileIcon(selectedFile.type)}</div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 truncate">
                        {selectedFile.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {selectedFile.type.split('/')[1]?.toUpperCase() || 'FILE'} • {formatFileSize(selectedFile.size)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={closeModal}
                    className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* 模态框内容 */}
                <div className="p-6">
                  {/* 图片预览 */}
                  <div className="aspect-video bg-gray-100 rounded-lg mb-6 overflow-hidden">
                    <img
                      src={selectedFile.url}
                      alt={selectedFile.name}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* 文件详细信息 */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">File Name:</span>
                      <p className="text-gray-600 truncate">{selectedFile.name}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">File Size:</span>
                      <p className="text-gray-600">{formatFileSize(selectedFile.size)}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">File Type:</span>
                      <p className="text-gray-600 capitalize">{selectedFile.type.split('/')[1]}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">MIME Type:</span>
                      <p className="text-gray-600">{selectedFile.type}</p>
                    </div>
                  </div>

                  {/* 操作按钮 */}
                  <div className="flex items-center justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
                    <button
                      onClick={closeModal}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = selectedFile.url;
                        link.download = selectedFile.name;
                        link.click();
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      Download
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 图片预览模态框 */}
      <ImagePreviewModal
        file={previewFile}
        isOpen={previewFile !== null}
        onClose={handleClosePreview}
        onNext={previewIndex < files.length - 1 ? handlePreviewNext : undefined}
        onPrevious={previewIndex > 0 ? handlePreviewPrevious : undefined}
        hasNext={previewIndex < files.length - 1}
        hasPrevious={previewIndex > 0}
      />
    </>
  );
}