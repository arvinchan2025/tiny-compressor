'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Image as ImageIcon } from 'lucide-react';
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

interface UnifiedConverterOperationProps {
  locale: SupportedLanguage;
  sourceFormat: string;
  targetFormat: string;
  imageFiles: ImageFile[];
  onFilesSelected: (files: ImageFile[]) => void;
  onRemoveFile: (fileId: string) => void;
  onConvert: () => void;
  maxFiles: number;
  translations: any;
  isConverting?: boolean;
  conversionProgress?: number;
  conversionStatus?: 'idle' | 'processing' | 'completed' | 'error';
  conversionResults?: Array<{
    originalFile: ImageFile;
    convertedFile: File;
    convertedSize: number;
  }>;
  onDownloadResult?: (result: any) => void;
}

export default function UnifiedConverterOperation({
  locale,
  sourceFormat,
  targetFormat,
  imageFiles,
  onFilesSelected,
  onRemoveFile,
  onConvert,
  maxFiles,
  translations,
  isConverting = false,
  conversionProgress = 0,
  conversionStatus = 'idle',
  conversionResults = [],
  onDownloadResult
}: UnifiedConverterOperationProps) {
  const { settings } = useUserSettings();
  const isRTL = locale === 'ar';
  const [dragActive, setDragActive] = useState(false);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [conversionSettings, setConversionSettings] = useState({
    quality: 85,
    preserveMetadata: false,
    optimizeForWeb: true,
    progressive: false,
    colorSpace: 'auto'
  });
  const [error, setError] = useState<ErrorInfo | null>(null);
  const [selectedFileIds, setSelectedFileIds] = useState<string[]>([]);



  // 预设定义
  const presets = [
    {
      id: 'high-quality',
      name: translations?.settings?.presets?.highQuality || 'High Quality',
      description: translations?.settings?.presets?.highQualityDesc || 'Best quality, larger file size',
      icon: '🎯',
      settings: { quality: 95, preserveMetadata: true, optimizeForWeb: false, progressive: false, colorSpace: 'auto' },
      recommended: false
    },
    {
      id: 'balanced',
      name: translations?.settings?.presets?.balanced || 'Balanced',
      description: translations?.settings?.presets?.balancedDesc || 'Good balance of quality and file size',
      icon: '⚖️',
      settings: { quality: 85, preserveMetadata: false, optimizeForWeb: true, progressive: true, colorSpace: 'auto' },
      recommended: true
    },
    {
      id: 'web-optimized',
      name: translations?.settings?.presets?.optimized || 'Web Optimized',
      description: translations?.settings?.presets?.optimizedDesc || 'Optimized for web, smaller file size',
      icon: '🌐',
      settings: { quality: 75, preserveMetadata: false, optimizeForWeb: true, progressive: true, colorSpace: 'srgb' },
      recommended: false
    },
    {
      id: 'fast',
      name: translations?.settings?.presets?.fast || 'Fast Conversion',
      description: translations?.settings?.presets?.fastDesc || 'Quick conversion with basic optimization',
      icon: '⚡',
      settings: { quality: 70, preserveMetadata: false, optimizeForWeb: true, progressive: false, colorSpace: 'auto' },
      recommended: false
    }
  ];

  // 设置选项定义
  const settingsOptions = [
    {
      id: 'quality',
      name: translations?.settings?.quality || 'Quality',
      description: translations?.settings?.qualityDesc || 'Higher values produce better quality but larger files',
      value: conversionSettings.quality,
      type: 'range' as const,
      min: 1,
      max: 100,
      step: 1
    },
    {
      id: 'preserveMetadata',
      name: translations?.settings?.preserveMetadata || 'Keep Metadata',
      description: translations?.settings?.preserveMetadataDesc || 'Preserve EXIF data and other metadata',
      value: conversionSettings.preserveMetadata,
      type: 'toggle' as const
    },
    {
      id: 'optimizeForWeb',
      name: translations?.settings?.optimizeForWeb || 'Web Optimization',
      description: translations?.settings?.optimizeForWebDesc || 'Optimize for faster web loading',
      value: conversionSettings.optimizeForWeb,
      type: 'toggle' as const
    },
    {
      id: 'progressive',
      name: translations?.settings?.progressive || 'Progressive Loading',
      description: translations?.settings?.progressiveDesc || 'Enable progressive loading for better web performance',
      value: conversionSettings.progressive,
      type: 'toggle' as const
    },
    {
      id: 'colorSpace',
      name: translations?.settings?.colorSpace || 'Color Space',
      description: translations?.settings?.colorSpaceDesc || 'Choose the color space for the output image',
      value: conversionSettings.colorSpace,
      type: 'select' as const,
      options: [
        { value: 'auto', label: translations?.settings?.auto || 'Auto' },
        { value: 'srgb', label: translations?.settings?.srgb || 'sRGB' },
        { value: 'adobe', label: translations?.settings?.adobe || 'Adobe RGB' }
      ]
    }
  ];

  // 处理预设选择
  const handlePresetSelect = (preset: any) => {
    setConversionSettings(preset.settings);
  };

  // 处理设置变化
  const handleSettingChange = (settingId: string, value: any) => {
    setConversionSettings(prev => ({ ...prev, [settingId]: value }));
  };

  // 批量操作处理函数
  const handleSelectAll = () => {
    setSelectedFileIds(imageFiles.map(file => file.id));
  };

  const handleDeselectAll = () => {
    setSelectedFileIds([]);
  };

  const handleDeleteSelected = () => {
    const remainingFiles = imageFiles.filter(file => !selectedFileIds.includes(file.id));
    onFilesSelected(remainingFiles);
    setSelectedFileIds([]);
  };

  const handleDownloadSelected = () => {
    // 这里可以实现批量下载逻辑
    console.log('Downloading selected files:', selectedFileIds);
  };

  const handleApplySettingsToSelected = () => {
    // 这里可以实现将设置应用到选中文件的逻辑
    console.log('Applying settings to selected files:', selectedFileIds);
  };

  // 智能预设处理函数
  const handleSmartPresetSelect = (preset: SmartPreset) => {
    setConversionSettings({
      quality: preset.settings.quality,
      preserveMetadata: preset.settings.preserveMetadata,
      optimizeForWeb: preset.settings.optimizeForWeb,
      progressive: false, // 根据预设调整
      colorSpace: 'auto'
    });
  };

  const handleSmartPresetApplyToAll = (preset: SmartPreset) => {
    // 应用预设到所有文件
    handleSmartPresetSelect(preset);
    // 可以在这里添加其他逻辑，比如批量处理
    console.log('Applied preset to all files:', preset.name);
  };


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

    try {
      const files = Array.from(e.dataTransfer.files);
      const supportedFormats = [`image/${sourceFormat}`];
      
      // 检查每个文件
      for (const file of files) {
        // 检查文件大小
        const sizeError = ErrorHandlerUtil.checkFileSize(file, 10 * 1024 * 1024);
        if (sizeError) {
          setError(sizeError);
          return;
        }

        // 检查文件格式
        const formatError = ErrorHandlerUtil.checkFileFormat(file, supportedFormats);
        if (formatError) {
          setError(formatError);
          return;
        }
      }

      // 如果没有错误，处理文件
      const imageFiles = files.map(file => ({
        id: Math.random().toString(),
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file)
      }));
      
      setError(null); // 清除之前的错误
      onFilesSelected(imageFiles);
    } catch (err) {
      const firstFile = e.dataTransfer.files[0];
      if (firstFile) {
        const errorInfo = ErrorHandlerUtil.handleFileUploadError(err as Error, firstFile);
        setError(errorInfo);
      } else {
        const errorInfo = ErrorHandlerUtil.getErrorInfo(ErrorHandlerUtil.inferErrorType(err as Error));
        setError(errorInfo);
      }
    }
  };

  return (
    <section className="py-8 container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto"
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
              {translations?.upload?.title || 'Upload & Convert Your Images'}
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              {translations?.upload?.subtitle || `Upload ${sourceFormat.toUpperCase()} images to convert to ${targetFormat.toUpperCase()} format`}
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
              acceptedTypes={[`image/${sourceFormat}`]}
              format={sourceFormat}
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
                  {translations?.settings?.title || 'Conversion Settings'}
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
                    showAdvanced={showAdvancedSettings}
                    onToggleAdvanced={() => setShowAdvancedSettings(!showAdvancedSettings)}
                    className="mb-8"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 转换按钮 */}
          <div className="text-center space-y-4">
              <EnhancedActionButton
                onClick={onConvert}
                disabled={imageFiles.length === 0}
                loading={isConverting}
                variant="primary"
                size="lg"
                loadingText={translations?.upload?.converting || 'Converting...'}
                showProgress={isConverting}
                progress={conversionProgress}
                icon={
                  !isConverting ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  ) : undefined
                }
                className="min-w-[200px]"
              >
                {translations?.upload?.convertNow || `Convert to ${targetFormat.toUpperCase()}`}
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
              {imageFiles.length > 0 && !isConverting && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-gray-600 bg-blue-50 rounded-lg p-3 inline-block"
                >
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>
                      Ready to convert {imageFiles.length} file{imageFiles.length > 1 ? 's' : ''} 
                      ({formatFileSize(imageFiles.reduce((sum, file) => sum + file.size, 0))})
                    </span>
                  </div>
                </motion.div>
              )}
            </div>

          {/* 转换结果展示 */}
          {conversionResults.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="mt-8 border-t border-gray-200 pt-8"
            >
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {translations?.converter?.results?.title || 'Conversion Results'}
                </h3>
                <p className="text-sm text-gray-600">
                  {translations?.converter?.results?.subtitle || 'Your images have been converted successfully'}
                </p>
              </div>

              <div className={settings.processingMode === 'single' ? 'space-y-4' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'}>
                {conversionResults.map((result, index) => {
                  const sizeChange = result.originalFile.size - result.convertedSize;
                  const sizeChangePercent = Math.round((sizeChange / result.originalFile.size) * 100);
                  
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
                            {result.originalFile.url ? (
                              <img
                                src={result.originalFile.url}
                                alt={result.originalFile.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <ImageIcon className="w-8 h-8 text-gray-400" />
                              </div>
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 text-lg mb-2 truncate">
                              {result.originalFile.name}
                            </h4>
                            
                            <div className="grid grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                              <div className="text-center">
                                <div className="text-xs text-gray-500 mb-1">
                                  {translations?.converter?.results?.original || 'Original'}
                                </div>
                                <div className="font-medium">
                                  {formatFileSize(result.originalFile.size)}
                                </div>
                              </div>
                              <div className="text-center">
                                <div className="text-xs text-gray-500 mb-1">
                                  {translations?.converter?.results?.converted || 'Converted'}
                                </div>
                                <div className="font-medium">
                                  {formatFileSize(result.convertedSize)}
                                </div>
                              </div>
                              <div className="text-center">
                                <div className="text-xs text-gray-500 mb-1">
                                  {sizeChange > 0 
                                    ? (translations?.converter?.results?.sizeReduced || 'Size reduced')
                                    : (translations?.converter?.results?.sizeIncreased || 'Size increased')
                                  }
                                </div>
                                <div className={`font-medium ${sizeChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  {sizeChangePercent > 0 ? '-' : '+'}{Math.abs(sizeChangePercent)}%
                                </div>
                              </div>
                            </div>
                            
                            <button
                              onClick={() => onDownloadResult?.(result)}
                              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
                            >
                              <Download className="w-4 h-4" />
                              <span>{translations?.converter?.results?.download || 'Download'} {targetFormat.toUpperCase()}</span>
                            </button>
                          </div>
                        </>
                      ) : (
                        // 批量模式 - 网格布局
                        <>
                          <div className="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden">
                            {result.originalFile.url ? (
                              <img
                                src={result.originalFile.url}
                                alt={result.originalFile.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <ImageIcon className="w-8 h-8 text-gray-400" />
                              </div>
                            )}
                          </div>

                          <div className="space-y-2">
                            <h4 className="font-medium text-gray-900 text-sm truncate">
                              {result.originalFile.name}
                            </h4>
                            
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs text-gray-600">
                                <span>{translations?.converter?.results?.original || 'Original'}:</span>
                                <span>{formatFileSize(result.originalFile.size)}</span>
                              </div>
                              <div className="flex justify-between text-xs text-gray-600">
                                <span>{translations?.converter?.results?.converted || 'Converted'}:</span>
                                <span>{formatFileSize(result.convertedSize)}</span>
                              </div>
                              <div className="flex justify-between text-xs font-medium">
                                <span className={sizeChange > 0 ? 'text-green-600' : 'text-red-600'}>
                                  {sizeChange > 0 
                                    ? (translations?.converter?.results?.sizeReduced || 'Size reduced')
                                    : (translations?.converter?.results?.sizeIncreased || 'Size increased')
                                  }:
                                </span>
                                <span className={sizeChange > 0 ? 'text-green-600' : 'text-red-600'}>
                                  {sizeChangePercent > 0 ? '-' : '+'}{Math.abs(sizeChangePercent)}%
                                </span>
                              </div>
                            </div>

                            <button
                              onClick={() => onDownloadResult?.(result)}
                              className="w-full mt-3 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-2"
                            >
                              <Download className="w-4 h-4" />
                              <span>{translations?.converter?.results?.download || 'Download'} {targetFormat.toUpperCase()}</span>
                            </button>
                          </div>
                        </>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {/* 批量下载 */}
              {conversionResults.length > 1 && (
                <div className="mt-6 text-center">
                  <button
                    onClick={() => {
                      // 创建ZIP文件并下载
                      console.log('Download all as ZIP');
                    }}
                    className="px-6 py-3 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-900 transition-colors duration-200 flex items-center space-x-2 mx-auto"
                  >
                    <Download className="w-5 h-5" />
                    <span>{translations?.converter?.results?.downloadAll || 'Download All as ZIP'}</span>
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </motion.div>
    </section>
  );
}
