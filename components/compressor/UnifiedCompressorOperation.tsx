'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SupportedLanguage } from '@/types/i18n';
import { ImageFile } from '@/types/image';
import FileUploader from '@/components/core/FileUploader';
import EnhancedFilePreview from '@/components/ui/EnhancedFilePreview';
import UnifiedFileManager from '@/components/ui/UnifiedFileManager';
import EnhancedActionButton from '@/components/ui/EnhancedActionButton';
import SimplifiedSettingsPanel from '@/components/ui/SimplifiedSettingsPanel';
import ErrorHandler from '@/components/ui/ErrorHandler';
import BatchOperations from '@/components/ui/BatchOperations';
import SmartPresetRecommendation from '@/components/ui/SmartPresetRecommendation';
import { ErrorHandler as ErrorHandlerUtil, ErrorInfo } from '@/lib/error-handler';
import { SmartPreset } from '@/lib/smart-presets';
import { formatFileSize } from '@/lib/utils';
import { useUserSettings } from '@/hooks/useUserSettings';

interface UnifiedCompressorOperationProps {
  locale: SupportedLanguage;
  format: string;
  imageFiles: ImageFile[];
  onFilesSelected: (files: ImageFile[]) => void;
  onRemoveFile: (fileId: string) => void;
  onCompress: () => void;
  maxFiles: number;
  translations: any;
  isCompressing?: boolean;
  compressionProgress?: number;
  compressionStatus?: 'idle' | 'processing' | 'completed' | 'error';
  compressionResults?: Array<{
    originalFile: ImageFile;
    compressedFile: File;
    compressedSize: number;
  }>;
  onDownloadResult?: (result: any) => void;
}

export default function UnifiedCompressorOperation({
  locale,
  format,
  imageFiles,
  onFilesSelected,
  onRemoveFile,
  onCompress,
  maxFiles,
  translations,
  isCompressing = false,
  compressionProgress = 0,
  compressionStatus = 'idle',
  compressionResults = [],
  onDownloadResult
}: UnifiedCompressorOperationProps) {
  const { settings } = useUserSettings();
  const isRTL = locale === 'ar';
  const [dragActive, setDragActive] = useState(false);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [compressionSettings, setCompressionSettings] = useState({
    quality: 85,
    lossless: false,
    optimizationLevel: 6,
    preserveMetadata: true,
    optimizeForWeb: true
  });
  const [selectedFileIds, setSelectedFileIds] = useState<string[]>([]);
  const [error, setError] = useState<ErrorInfo | null>(null);


  // 预设定义
  const presets = [
    {
      id: 'balanced',
      name: translations?.settings?.presets?.balanced || 'Balanced',
      description: translations?.settings?.presets?.balancedDesc || 'Good quality and size',
      icon: '⚖️',
      settings: { quality: 85, lossless: false, optimizationLevel: 6, preserveMetadata: true, optimizeForWeb: true },
      recommended: true
    },
    {
      id: 'high-quality',
      name: translations?.settings?.presets?.highQuality || 'High Quality',
      description: translations?.settings?.presets?.highQualityDesc || 'Best quality, larger file size',
      icon: '💎',
      settings: { quality: 95, lossless: false, optimizationLevel: 3, preserveMetadata: true, optimizeForWeb: false },
      recommended: false
    },
    {
      id: 'maximum',
      name: translations?.settings?.presets?.maximum || 'Maximum Compression',
      description: translations?.settings?.presets?.maximumDesc || 'Smallest file size, may reduce quality',
      icon: '🗜️',
      settings: { quality: 60, lossless: false, optimizationLevel: 9, preserveMetadata: false, optimizeForWeb: true },
      recommended: false
    }
  ];

  // 设置选项定义
  const settingsOptions = [
    {
      id: 'quality',
      name: translations?.settings?.quality || 'Quality',
      type: 'range' as const,
      min: 1,
      max: 100,
      value: compressionSettings.quality,
      description: translations?.settings?.qualityDesc || 'Higher values mean better quality but larger files'
    },
    {
      id: 'lossless',
      name: translations?.settings?.lossless || 'Lossless',
      type: 'toggle' as const,
      value: compressionSettings.lossless,
      description: translations?.settings?.losslessDesc || 'No quality loss but larger files'
    },
    {
      id: 'optimizationLevel',
      name: translations?.settings?.optimizationLevel || 'Optimization Level',
      type: 'range' as const,
      min: 1,
      max: 9,
      value: compressionSettings.optimizationLevel,
      description: translations?.settings?.optimizationLevelDesc || 'Higher values mean better compression'
    },
    {
      id: 'preserveMetadata',
      name: translations?.settings?.preserveMetadata || 'Preserve Metadata',
      type: 'toggle' as const,
      value: compressionSettings.preserveMetadata,
      description: translations?.settings?.preserveMetadataDesc || 'Keep EXIF data and other metadata'
    },
    {
      id: 'optimizeForWeb',
      name: translations?.settings?.optimizeForWeb || 'Optimize for Web',
      type: 'toggle' as const,
      value: compressionSettings.optimizeForWeb,
      description: translations?.settings?.optimizeForWebDesc || 'Optimize for faster web loading'
    }
  ];

  // 拖拽处理
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.map(file => ({
      id: Math.random().toString(),
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file)
    }));
    
    onFilesSelected(imageFiles);
  };

  // 文件选择处理
  const handleFilesSelected = (files: ImageFile[]) => {
    onFilesSelected(files);
  };

  // 文件删除处理
  const handleRemoveFile = (fileId: string) => {
    onRemoveFile(fileId);
    setSelectedFileIds(prev => prev.filter(id => id !== fileId));
  };

  // 预设选择处理
  const handlePresetSelect = (preset: any) => {
    if (preset) {
      setCompressionSettings(preset.settings);
    }
  };

  // 设置变更处理
  const handleSettingChange = (settingId: string, value: any) => {
    setCompressionSettings(prev => ({
      ...prev,
      [settingId]: value
    }));
  };

  // 批量操作处理
  const handleSelectAll = () => {
    setSelectedFileIds(imageFiles.map(file => file.id));
  };

  const handleDeselectAll = () => {
    setSelectedFileIds([]);
  };

  const handleDeleteSelected = () => {
    selectedFileIds.forEach(id => onRemoveFile(id));
    setSelectedFileIds([]);
  };

  const handleDownloadSelected = () => {
    // 实现批量下载逻辑
    console.log('Download selected files:', selectedFileIds);
  };

  const handleApplySettingsToSelected = () => {
    // 实现批量应用设置逻辑
    console.log('Apply settings to selected files:', selectedFileIds);
  };

  // 智能预设处理
  const handleSmartPresetSelect = (preset: SmartPreset) => {
    setCompressionSettings(preset.settings);
  };

  const handleSmartPresetApplyToAll = (preset: SmartPreset) => {
    setCompressionSettings(preset.settings);
  };

  return (
    <section className="py-8 container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-8"
      >

        {/* 错误处理 */}
        {error && (
          <div className="mb-8">
            <ErrorHandler
              error={error}
              onDismiss={() => setError(null)}
              onRetry={() => {
                setError(null);
                // 可以在这里添加重试逻辑
              }}
            />
          </div>
        )}

        {/* 主操作区域 */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-neutral-200/50 p-8">
          {/* 标题区域 */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              {translations?.upload?.title || `Compress ${format.toUpperCase()} Images`}
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              {translations?.upload?.subtitle || `Upload ${format.toUpperCase()} images to compress and reduce file size`}
            </p>
          </div>

          {/* 统一文件管理器 */}
          <div className="mb-8">
            <UnifiedFileManager
              files={imageFiles}
              onFilesSelected={onFilesSelected}
              onRemoveFile={onRemoveFile}
              onSelectionChange={setSelectedFileIds}
              selectedIds={selectedFileIds}
              maxFiles={maxFiles}
              acceptedTypes={[`image/${format}`]}
              format={format}
              translations={translations}
              processingMode={settings.processingMode}
              showBatchOperations={settings.ui.showBatchOperations}
              showThumbnails={settings.ui.showFileThumbnails}
              compact={settings.ui.compactMode}
            />
          </div>

          {/* 智能预设推荐 - 仅在启用时显示 */}
          {imageFiles.length > 0 && settings.ui.showSmartPresets && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-8"
            >
              <SmartPresetRecommendation
                files={imageFiles}
                onPresetSelect={handleSmartPresetSelect}
                onApplyToAll={handleSmartPresetApplyToAll}
              />
            </motion.div>
          )}

          {/* 设置开关和面板 */}
          <div className="border-t border-gray-200 pt-8">
            {/* 设置开关 */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <h3 className="text-lg font-medium text-gray-900">
                  {translations?.settings?.title || 'Compression Settings'}
                </h3>
                <span className="text-sm text-gray-500">
                  {translations?.settings?.optional || '(Optional)'}
                </span>
              </div>
              <button
                onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors duration-200 ${
                  showAdvancedSettings
                    ? 'bg-blue-50 border-blue-200 text-blue-700'
                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <svg 
                  className={`w-4 h-4 transition-transform duration-200 ${showAdvancedSettings ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                <span className="text-sm font-medium">
                  {showAdvancedSettings 
                    ? (translations?.settings?.hideSettings || 'Hide Settings')
                    : (translations?.settings?.showSettings || 'Show Settings')
                  }
                </span>
              </button>
            </div>

            {/* 设置面板 - 可折叠 */}
            <AnimatePresence>
              {showAdvancedSettings && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <SimplifiedSettingsPanel
                    title=""
                    presets={presets}
                    settings={settingsOptions}
                    onPresetSelect={handlePresetSelect}
                    onSettingChange={handleSettingChange}
                    currentPreset="balanced"
                    showAdvanced={settings.ui.showAdvancedSettings}
                    onToggleAdvanced={() => setShowAdvancedSettings(!showAdvancedSettings)}
                    className="mb-8"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 压缩按钮 */}
          <div className="text-center space-y-4">
            <EnhancedActionButton
              onClick={onCompress}
              disabled={imageFiles.length === 0}
              loading={isCompressing}
              variant="success"
              size="lg"
              loadingText={translations?.upload?.compressing || 'Compressing...'}
              showProgress={isCompressing}
              progress={compressionProgress}
              icon={
                !isCompressing ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                  </svg>
                ) : undefined
              }
              className="min-w-[200px]"
            >
              {translations?.upload?.compressNow || `Compress ${format.toUpperCase()}`}
            </EnhancedActionButton>
            
            {imageFiles.length === 0 && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-gray-500"
              >
                {translations?.upload?.uploadFirst || 'Please upload images first'}
              </motion.p>
            )}

            {/* 文件统计提示 */}
            {imageFiles.length > 0 && !isCompressing && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-gray-600 bg-green-50 rounded-lg p-3 inline-block"
              >
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>
                    Ready to compress {imageFiles.length} file{imageFiles.length > 1 ? 's' : ''} 
                    ({formatFileSize(imageFiles.reduce((sum, file) => sum + file.size, 0))})
                  </span>
                </div>
              </motion.div>
            )}

            {/* 压缩结果 - 紧跟在压缩按钮后面 */}
            <AnimatePresence>
              {compressionResults.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="mt-8 border-t border-gray-200 pt-8"
                >
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {translations?.compressor?.results?.title || 'Compression Results'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {translations?.compressor?.results?.subtitle || 'Your images have been compressed successfully'}
                    </p>
                  </div>

                  <div className={settings.processingMode === 'single' ? 'space-y-4' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'}>
                    {compressionResults.map((result, index) => {
                      const compressionRatio = Math.round(((result.originalFile.size - result.compressedSize) / result.originalFile.size) * 100);
                      
                      return (
                        <motion.div
                          key={result.originalFile.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className={`bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 ${
                            settings.processingMode === 'single' 
                              ? 'p-6 flex items-center space-x-6' 
                              : 'p-4'
                          }`}
                        >
                          {settings.processingMode === 'single' ? (
                            // 单文件模式 - 横向布局
                            <>
                              <div className="w-32 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                <img
                                  src={URL.createObjectURL(result.compressedFile)}
                                  alt="Compressed"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-gray-800 text-lg mb-2 truncate">
                                  {result.originalFile.name}
                                </h4>
                                
                                <div className="grid grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                                  <div className="text-center">
                                    <div className="text-xs text-gray-500 mb-1">
                                      {translations?.compressor?.results?.originalSize || 'Original'}
                                    </div>
                                    <div className="font-medium">
                                      {formatFileSize(result.originalFile.size)}
                                    </div>
                                  </div>
                                  <div className="text-center">
                                    <div className="text-xs text-gray-500 mb-1">
                                      {translations?.compressor?.results?.compressedSize || 'Compressed'}
                                    </div>
                                    <div className="font-medium">
                                      {formatFileSize(result.compressedSize)}
                                    </div>
                                  </div>
                                  <div className="text-center">
                                    <div className="text-xs text-gray-500 mb-1">
                                      {translations?.compressor?.results?.reduction || 'Reduction'}
                                    </div>
                                    <div className="font-medium text-green-600">
                                      {compressionRatio}%
                                    </div>
                                  </div>
                                </div>
                                
                                <button
                                  onClick={() => onDownloadResult && onDownloadResult(result)}
                                  className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                                >
                                  {translations?.compressor?.results?.download || 'Download'}
                                </button>
                              </div>
                            </>
                          ) : (
                            // 批量模式 - 网格布局
                            <>
                              <div className="aspect-video bg-gray-100 rounded-lg mb-3 overflow-hidden">
                                <img
                                  src={URL.createObjectURL(result.compressedFile)}
                                  alt="Compressed"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <h4 className="font-medium text-gray-800 truncate text-sm">
                                  {result.originalFile.name}
                                </h4>
                                
                                <div className="space-y-1 text-xs text-gray-600">
                                  <div className="flex justify-between">
                                    <span>{translations?.compressor?.results?.originalSize || 'Original'}:</span>
                                    <span>{formatFileSize(result.originalFile.size)}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>{translations?.compressor?.results?.compressedSize || 'Compressed'}:</span>
                                    <span>{formatFileSize(result.compressedSize)}</span>
                                  </div>
                                </div>
                                
                                <div className="text-center">
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    {translations?.compressor?.results?.reduction || 'Reduction'}: {compressionRatio}%
                                  </span>
                                </div>
                                
                                <button
                                  onClick={() => onDownloadResult && onDownloadResult(result)}
                                  className="w-full bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium text-sm"
                                >
                                  {translations?.compressor?.results?.download || 'Download'}
                                </button>
                              </div>
                            </>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </section>
  );
}