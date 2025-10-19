/**
 * 转换结果展示面板组件
 * 参考压缩器的优化设计，提供更好的视觉反馈
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ConversionResult } from '@/lib/image-processing/types';
import { useTranslation } from '@/hooks/useTranslation';
import { Locale } from '@/lib/i18n';

interface ConversionResultsPanelProps {
  result: ConversionResult;
  originalImageUrl?: string;
  sourceFormat: string;
  targetFormat: string;
  locale?: Locale;
  onDownload: () => void;
  onConvertMore: () => void;
}

export default function ConversionResultsPanel({ 
  result,
  originalImageUrl,
  sourceFormat,
  targetFormat,
  locale = 'en',
  onDownload, 
  onConvertMore 
}: ConversionResultsPanelProps) {
  const { t } = useTranslation(`converters/${sourceFormat}-to-${targetFormat}`, locale);
  
  // 安全检查
  if (!result) {
    return null;
  }

  // 计算文件大小变化
  // 安全检查，确保数据有效
  const originalSize = result.originalSize || result.originalFile?.size || 0;
  const convertedSize = result.convertedSize || result.convertedFile?.size || 0;
  
  const sizeChange = convertedSize - originalSize;
  const sizeChangePercent = originalSize > 0 ? Math.abs((sizeChange / originalSize * 100)) : 0;
  const isSizeReduced = sizeChange < 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
    >
      <div className="p-6 sm:p-8 space-y-6">
        {/* 成功标题 */}
        <div className="text-center space-y-2">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-full shadow-lg mb-4"
          >
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>
          
          <motion.h3 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold text-gray-900 mb-2"
          >
            {t('operation.results.title') || 'Conversion Complete! 🎉'}
          </motion.h3>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-600"
          >
            {t('operation.results.subtitle') || 'Your image has been successfully optimized'}
          </motion.p>
        </div>

        {/* 格式转换展示 */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200"
        >
          <div className="flex items-center justify-center space-x-4">
            {/* 源格式 */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg mb-2">
                <span className="text-white font-bold text-sm">{sourceFormat.toUpperCase()}</span>
              </div>
              <span className="text-xs text-gray-600">{t('operation.results.original') || 'Original'}</span>
            </div>

            {/* 箭头动画 */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </motion.div>

            {/* 目标格式 */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg mb-2">
                <span className="text-white font-bold text-sm">{targetFormat.toUpperCase()}</span>
              </div>
              <span className="text-xs text-green-700 font-medium">{t('operation.results.converted') || 'Converted'}</span>
            </div>
          </div>

          {/* 文件大小变化 */}
          <div className="mt-4 text-center">
            <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${
              isSizeReduced 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {isSizeReduced ? '↓' : '↑'} {sizeChangePercent.toFixed(1)}% {isSizeReduced ? t('operation.results.smaller') || 'Smaller' : t('operation.results.larger') || 'Larger'}
            </div>
          </div>
        </motion.div>

        {/* 图片预览对比 */}
        {originalImageUrl && result.preview && (
          <div className="mb-6">
            <div className="grid grid-cols-2 gap-4">
              {/* 原始图片预览 */}
              <div className="space-y-2">
                <div className="text-center space-y-1">
                  <div className="text-xs font-semibold text-gray-600 uppercase">{t('operation.results.original') || 'Original'}</div>
                  <div className="text-xs text-gray-500">{sourceFormat.toUpperCase()} Format</div>
                </div>
                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                  <img 
                    src={originalImageUrl} 
                    alt={`Original ${sourceFormat.toUpperCase()}`}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="text-center">
                  <div className="flex items-baseline justify-center space-x-1">
                    <span className="text-xl font-bold text-gray-700">
                      {(originalSize / 1024 / 1024).toFixed(2)}
                    </span>
                    <div className="text-xs text-gray-500">MB</div>
                  </div>
                </div>
              </div>
              
              {/* 转换后图片预览 */}
              <div className="space-y-2">
                <div className="text-center space-y-1">
                  <div className="text-xs font-semibold text-green-700 uppercase">{t('operation.results.converted') || 'Converted'}</div>
                  <div className="text-xs text-green-600 font-medium">
                    {targetFormat.toUpperCase()} Format
                  </div>
                </div>
                <div className="aspect-video bg-green-50 rounded-lg overflow-hidden border-2 border-green-300">
                  <img 
                    src={result.preview} 
                    alt={`Converted ${targetFormat.toUpperCase()}`}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="text-center">
                  <div className="flex items-baseline justify-center space-x-1">
                    <span className="text-xl font-bold text-green-600">
                      {(convertedSize / 1024 / 1024).toFixed(2)}
                    </span>
                    <div className="text-xs text-gray-500">MB</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 详细统计 */}
        <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
          {/* 文件大小变化 */}
          <div className="text-center">
            <div className="text-xs text-gray-500 mb-1">{t('operation.results.sizeChange') || 'Size Change'}</div>
            <div className={`text-lg font-bold ${isSizeReduced ? 'text-green-600' : 'text-yellow-600'}`}>
              {isSizeReduced ? '-' : '+'}{Math.abs((sizeChange / 1024 / 1024)).toFixed(2)} MB
            </div>
          </div>
          
          {/* 处理时间 */}
          <div className="text-center">
            <div className="text-xs text-gray-500 mb-1">{t('operation.results.time') || 'Time'}</div>
            <div className="text-lg font-bold text-blue-600">
              {result.processingTime ? `${(result.processingTime / 1000).toFixed(1)}s` : '<1s'}
            </div>
          </div>
          
          {/* 目标格式 */}
          <div className="text-center">
            <div className="text-xs text-gray-500 mb-1">{t('operation.results.format') || 'Format'}</div>
            <div className="text-lg font-bold text-purple-600">
              {targetFormat.toUpperCase()}
            </div>
          </div>
        </div>

        {/* 成功提示 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200"
        >
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-blue-900 mb-1">
                {t('operation.results.successMessage') || 'Conversion successful!'}
              </h4>
              <p className="text-xs text-blue-700">
                {t('operation.results.successDescription') || 'Your image has been converted and optimized. Ready for download!'}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 操作按钮 */}
      <div className="bg-gray-50 px-6 py-4 sm:px-8 flex flex-col sm:flex-row gap-3">
        <motion.button
          onClick={onDownload}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 py-4 px-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold text-base shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <div className="flex items-center justify-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>{t('operation.results.download') || 'Download'}</span>
          </div>
        </motion.button>
        
        <button
          onClick={onConvertMore}
          className="py-4 px-6 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 flex items-center justify-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>{t('operation.results.reset') || 'Convert More'}</span>
        </button>
      </div>
    </motion.div>
  );
}

