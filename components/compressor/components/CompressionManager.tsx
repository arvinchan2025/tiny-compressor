/**
 * 压缩管理器组件
 * 管理整个压缩流程的状态和逻辑
 */

'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageFile } from '@/types/image';
import { CompressionResult } from '@/lib/image-processing/types';
import ModeSelector from './ModeSelector';
import FileDropZone from './FileDropZone';
import AdvancedSettingsPanel from './AdvancedSettingsPanel';
import ResultsPanel from './ResultsPanel';

interface CompressionSettings {
  quality: number;
  keepMetadata: boolean;
  removeUnusedColors: boolean;
  optimizationLevel: number;
}

export default function CompressionManager() {
  const [selectedFile, setSelectedFile] = useState<ImageFile | null>(null);
  const [result, setResult] = useState<CompressionResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);
  
  // 默认设置 - 简单模式
  const [settings, setSettings] = useState<CompressionSettings>({
    quality: 6,              // 平衡质量
    keepMetadata: false,     // 默认移除元数据
    removeUnusedColors: true, // 默认优化调色板
    optimizationLevel: 2     // 标准优化
  });

  const handleFileSelect = useCallback((file: ImageFile) => {
    setSelectedFile(file);
    setResult(null); // 清除之前的结果
  }, []);

  const handleModeChange = useCallback((isAdvanced: boolean) => {
    setIsAdvancedMode(isAdvanced);
    if (!isAdvanced) {
      // 切换到简单模式时，重置为默认设置
      setSettings({
        quality: 6,
        keepMetadata: false,
        removeUnusedColors: true,
        optimizationLevel: 2
      });
    }
  }, []);

  const handleSettingsChange = useCallback((newSettings: CompressionSettings) => {
    setSettings(newSettings);
  }, []);

  const handleCompress = useCallback(async () => {
    if (!selectedFile) return;
    
    setIsProcessing(true);
    
    try {
      // 模拟压缩过程
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 模拟压缩结果
      const compressedSize = Math.floor(selectedFile.size * (0.6 + Math.random() * 0.3));
      const compressedFile = new File([], selectedFile.name, { type: selectedFile.type });
      
      const compressionResult: CompressionResult = {
        id: `result_${Date.now()}`,
        originalFile: selectedFile,
        compressedFile: {
          name: selectedFile.name,
          size: compressedSize,
          type: selectedFile.type,
          data: compressedFile
        },
        originalSize: selectedFile.size,
        compressedSize: compressedSize,
        compressionRatio: Math.round(((selectedFile.size - compressedSize) / selectedFile.size) * 100),
        processingTime: 2000,
        settings: { format: 'png', ...settings }
      };
      
      setResult(compressionResult);
    } catch (error) {
      console.error('Compression failed:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [selectedFile, settings]);

  const handleDownload = useCallback(() => {
    if (result.compressedFile) {
      const url = URL.createObjectURL(result.compressedFile.data);
      const link = document.createElement('a');
      link.href = url;
      link.download = result.compressedFile.name;
      link.click();
      URL.revokeObjectURL(url);
    }
  }, [result]);

  const handleCompressMore = useCallback(() => {
    setSelectedFile(null);
    setResult(null);
    setIsProcessing(false);
    // 重置模式为简单模式
    setIsAdvancedMode(false);
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
      {/* 模式选择器 */}
      <div className="p-6 pb-0">
        <ModeSelector 
          isAdvancedMode={isAdvancedMode}
          onModeChange={handleModeChange}
        />
      </div>

      {/* 文件上传区域 */}
      <div className="px-6">
        <FileDropZone onFileSelect={handleFileSelect} />
      </div>

      {/* 高级设置面板 - 只在高级模式且已选择文件时显示 */}
      <AnimatePresence>
        {selectedFile && isAdvancedMode && (
          <div className="px-6">
            <AdvancedSettingsPanel
              settings={settings}
              onSettingsChange={handleSettingsChange}
            />
          </div>
        )}
      </AnimatePresence>

      {/* 压缩操作区域 */}
      {selectedFile && (
        <div className="p-6 border-t border-slate-200 bg-slate-50">
          <div className="flex flex-col items-center">
            <motion.button
              onClick={handleCompress}
              disabled={isProcessing}
              className={`
                w-full max-w-md py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200
                ${isProcessing
                   ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                }
              `}
              whileHover={isProcessing ? {} : { scale: 1.02 }}
              whileTap={isProcessing ? {} : { scale: 0.98 }}
            >
              {isProcessing ? (
                <div className="flex items-center justify-center space-x-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  <span>Compressing...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-3">
                  <span className="text-xl"></span>
                  <span>Compress PNG</span>
                </div>
              )}
            </motion.button>

            {/* 进度条 */}
            <AnimatePresence>
              {isProcessing && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full max-w-md mt-4"
                >
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-slate-600">
                      <span>Processing...</span>
                      <span>75%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <motion.div
                        className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full"
                        initial={{ width: '0%' }}
                        animate={{ width: '75%' }}
                        transition={{ duration: 2, ease: 'easeInOut' }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* 结果展示 */}
      {result && (
        <ResultsPanel
          result={result}
          onDownload={handleDownload}
          onCompressMore={handleCompressMore}
        />
      )}
    </div>
  );
}
