'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageFile } from '@/types/image';
import { formatFileSize } from '@/lib/utils';
import StandardButton from '@/components/ui/StandardButton';
import StandardIcon from '@/components/ui/StandardIcon';
import StandardCard from '@/components/ui/StandardCard';
import StandardContainer from '@/components/ui/StandardContainer';
import FileUploader from '@/components/core/FileUploader';
import { transitions, commonVariants } from '@/lib/micro-interactions';

interface UnifiedOperationPanelProps {
  onFileSelected: (file: ImageFile | null) => void;
  onProcess: () => void;
  onClear: () => void;
  onDownload: () => void;
  onProcessAnother: () => void;
  selectedFile: ImageFile | null;
  result: any;
  isProcessing: boolean;
  processingMode: 'compress' | 'convert';
  onModeChange: (mode: 'compress' | 'convert') => void;
  translations?: any;
}

export default function UnifiedOperationPanel({
  onFileSelected,
  onProcess,
  onClear,
  onDownload,
  onProcessAnother,
  selectedFile,
  result,
  isProcessing,
  processingMode,
  onModeChange,
  translations
}: UnifiedOperationPanelProps) {
  const [compressionQuality, setCompressionQuality] = useState<'high' | 'medium' | 'low'>('medium');
  const [targetFormat, setTargetFormat] = useState<string>('jpg');
  const [showSettings, setShowSettings] = useState(false);

  const handleFileSelected = (files: ImageFile[]) => {
    onFileSelected(files[0] || null);
  };

  const handleModeChange = (mode: 'compress' | 'convert') => {
    onModeChange(mode);
    onFileSelected(null);
    setShowSettings(false);
  };

  const getModeConfig = () => {
    return {
      compress: {
        title: 'Image Compression',
        description: 'Reduce file size while maintaining quality',
        icon: 'compress',
        color: 'blue',
        buttonText: 'Compress Image',
        processingText: 'Compressing...'
      },
      convert: {
        title: 'Format Conversion',
        description: 'Convert between different image formats',
        icon: 'convert',
        color: 'green',
        buttonText: 'Convert Image',
        processingText: 'Converting...'
      }
    }[processingMode];
  };

  const config = getModeConfig();

  return (
    <StandardContainer variant="content" size="lg">
      <motion.div
        initial={commonVariants.slideUp.initial}
        animate={commonVariants.slideUp.animate}
        transition={transitions.standard}
        className="max-w-4xl mx-auto"
      >
        <StandardCard variant="elevated" size="lg" className="overflow-hidden">
          {/* 头部 - 模式选择 */}
          <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg bg-${config.color}-100 flex items-center justify-center`}>
                  <StandardIcon name={config.icon as any} size="md" className={`text-${config.color}-600`} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{config.title}</h3>
                  <p className="text-sm text-slate-600">{config.description}</p>
                </div>
              </div>
              
              {/* 模式切换 */}
              <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm">
                <button
                  onClick={() => handleModeChange('compress')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    processingMode === 'compress'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Compress
                </button>
                <button
                  onClick={() => handleModeChange('convert')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    processingMode === 'convert'
                      ? 'bg-green-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Convert
                </button>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* 文件上传 */}
            <motion.div
              initial={commonVariants.fadeIn.initial}
              animate={commonVariants.fadeIn.animate}
              transition={transitions.standard}
              className="mb-6"
            >
              <div className="text-center mb-4">
                <h4 className="text-lg font-medium text-slate-900 mb-2">
                  {selectedFile ? 'Selected Image' : 'Upload Your Image'}
                </h4>
                <p className="text-sm text-slate-600">
                  {selectedFile 
                    ? 'Ready for processing' 
                    : `Drag and drop your image here or click to browse`
                  }
                </p>
              </div>

              <FileUploader
                onFilesSelected={handleFileSelected}
                maxFiles={1}
                className="mb-4"
                translations={{
                  dragActive: `Drop image to ${processingMode}`,
                  dragInactive: `Drag & drop image to ${processingMode}`,
                  dragReject: translations?.upload?.dragReject || "Invalid file type",
                  clickToUpload: translations?.upload?.clickToUpload || "or click to browse",
                  supportedFormats: translations?.upload?.supportedFormats || "Supports JPG, PNG, WebP, and more",
                  maxSize: translations?.upload?.maxSize || "Max file size: 10MB",
                  maxFiles: translations?.upload?.maxFiles || "Single file only",
                  removeFile: translations?.upload?.removeFile || "Remove file",
                  uploadError: translations?.upload?.uploadError || "Upload failed",
                  uploadSuccess: translations?.upload?.uploadSuccess || "Upload successful"
                }}
              />

              {/* 文件预览 */}
              {selectedFile && (
                <motion.div
                  initial={commonVariants.scale.initial}
                  animate={commonVariants.scale.animate}
                  transition={transitions.standard}
                  className="bg-slate-50 rounded-lg p-4 border border-slate-200"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-slate-200 rounded-lg flex items-center justify-center overflow-hidden">
                      {selectedFile.url ? (
                        <img
                          src={selectedFile.url}
                          alt={selectedFile.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <StandardIcon name="image" size="lg" className="text-slate-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h5 className="font-medium text-slate-900 truncate">{selectedFile.name}</h5>
                      <p className="text-sm text-slate-500">{formatFileSize(selectedFile.size)}</p>
                      <div className="mt-1">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          processingMode === 'compress' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {processingMode === 'compress' ? 'Compress Mode' : 'Convert Mode'}
                        </span>
                      </div>
                    </div>
                    <StandardButton
                      variant="ghost"
                      size="sm"
                      onClick={onClear}
                      leftIcon={<StandardIcon name="close" size="sm" />}
                    >
                      Remove
                    </StandardButton>
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* 步骤2: 配置选项 */}
            <AnimatePresence>
              {selectedFile && (
                <motion.div
                  initial={commonVariants.slideUp.initial}
                  animate={commonVariants.slideUp.animate}
                  exit={commonVariants.slideUp.exit}
                  transition={transitions.standard}
                  className="mb-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-medium text-slate-900">Processing Options</h4>
                    <StandardButton
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowSettings(!showSettings)}
                      rightIcon={<StandardIcon name={showSettings ? "chevron-up" : "chevron-down"} size="sm" />}
                    >
                      {showSettings ? 'Hide' : 'Show'} Settings
                    </StandardButton>
                  </div>

                  <AnimatePresence>
                    {showSettings && (
                      <motion.div
                        initial={commonVariants.slideUp.initial}
                        animate={commonVariants.slideUp.animate}
                        exit={commonVariants.slideUp.exit}
                        transition={transitions.standard}
                        className="bg-slate-50 rounded-lg p-4 border border-slate-200"
                      >
                        {processingMode === 'compress' ? (
                          <div>
                            <h5 className="font-medium text-slate-900 mb-3">Compression Quality</h5>
                            <div className="grid grid-cols-3 gap-3">
                              {[
                                { value: 'high', label: 'High Quality', desc: 'Larger file, better quality' },
                                { value: 'medium', label: 'Balanced', desc: 'Good balance' },
                                { value: 'low', label: 'High Compression', desc: 'Smaller file, lower quality' }
                              ].map((option) => (
                                <button
                                  key={option.value}
                                  onClick={() => setCompressionQuality(option.value as any)}
                                  className={`p-3 rounded-lg border text-left transition-colors duration-200 ${
                                    compressionQuality === option.value
                                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                                      : 'border-slate-200 hover:border-slate-300'
                                  }`}
                                >
                                  <div className="font-medium text-sm">{option.label}</div>
                                  <div className="text-xs text-slate-500">{option.desc}</div>
                                </button>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div>
                            <h5 className="font-medium text-slate-900 mb-3">Target Format</h5>
                            <div className="grid grid-cols-4 gap-3">
                              {['jpg', 'png', 'webp', 'avif'].map((format) => (
                                <button
                                  key={format}
                                  onClick={() => setTargetFormat(format)}
                                  className={`p-3 rounded-lg border text-center transition-colors duration-200 ${
                                    targetFormat === format
                                      ? 'border-green-500 bg-green-50 text-green-700'
                                      : 'border-slate-200 hover:border-slate-300'
                                  }`}
                                >
                                  <div className="font-medium text-sm uppercase">{format}</div>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 步骤3: 处理按钮 */}
            <motion.div
              initial={commonVariants.fadeIn.initial}
              animate={commonVariants.fadeIn.animate}
              transition={transitions.standard}
              className="mb-6"
            >
              <div className="flex gap-3 justify-center">
                <StandardButton
                  variant="primary"
                  size="lg"
                  onClick={onProcess}
                  disabled={!selectedFile || isProcessing}
                  leftIcon={isProcessing ? undefined : <StandardIcon name={config.icon as any} size="md" />}
                  className={`${
                    processingMode === 'compress' 
                      ? 'bg-blue-600 hover:bg-blue-700' 
                      : 'bg-green-600 hover:bg-green-700'
                  } ${!selectedFile ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isProcessing ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                      <span>{config.processingText}</span>
                    </div>
                  ) : (
                    !selectedFile 
                      ? `Select image to ${processingMode}` 
                      : config.buttonText
                  )}
                </StandardButton>
              </div>
            </motion.div>

            {/* 步骤4: 结果展示 */}
            <AnimatePresence>
              {result && (
                <motion.div
                  initial={commonVariants.slideUp.initial}
                  animate={commonVariants.slideUp.animate}
                  exit={commonVariants.slideUp.exit}
                  transition={transitions.standard}
                  className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200 p-6"
                >
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <StandardIcon name="success" size="xl" className="text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">
                      {processingMode === 'compress' ? 'Compression Complete!' : 'Conversion Complete!'}
                    </h3>
                    <p className="text-slate-600">
                      Your image has been {processingMode === 'compress' ? 'compressed' : 'converted'} successfully
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="text-center bg-white rounded-lg p-4 border border-slate-200">
                      <div className="text-2xl font-bold text-slate-900 mb-1">
                        {formatFileSize(result.originalSize)}
                      </div>
                      <div className="text-sm text-slate-500">Original Size</div>
                    </div>
                    <div className="text-center bg-white rounded-lg p-4 border border-slate-200">
                      <div className="text-2xl font-bold text-slate-900 mb-1">
                        {formatFileSize(result.processedSize)}
                      </div>
                      <div className="text-sm text-slate-500">New Size</div>
                    </div>
                    <div className="text-center bg-white rounded-lg p-4 border border-slate-200">
                      <div className="text-2xl font-bold text-green-600 mb-1">
                        {result.reduction}%
                      </div>
                      <div className="text-sm text-slate-500">
                        {processingMode === 'compress' ? 'Size Reduction' : 'Conversion Complete'}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 justify-center">
                    <StandardButton
                      variant="primary"
                      size="lg"
                      onClick={onDownload}
                      leftIcon={<StandardIcon name="download" size="md" />}
                      className={processingMode === 'compress' 
                        ? 'bg-blue-600 hover:bg-blue-700' 
                        : 'bg-green-600 hover:bg-green-700'
                      }
                    >
                      Download {processingMode === 'compress' ? 'Compressed' : 'Converted'} Image
                    </StandardButton>
                    <StandardButton
                      variant="secondary"
                      size="lg"
                      onClick={onProcessAnother}
                      leftIcon={<StandardIcon name="refresh" size="md" />}
                    >
                      Process Another Image
                    </StandardButton>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </StandardCard>
      </motion.div>
    </StandardContainer>
  );
}
