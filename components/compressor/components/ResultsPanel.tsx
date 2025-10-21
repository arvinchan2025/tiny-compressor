/**
 * 结果展示面板组件
 * 显示压缩结果和下载选项
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CompressionResult } from '@/lib/image-processing/types';
import { useTranslation } from '@/hooks/useTranslation';
import { Locale } from '@/lib/i18n';

interface ResultsPanelProps {
  result: CompressionResult;
  originalImageUrl?: string;
  locale?: Locale;
  format?: string;
  onDownload: () => void;
  onCompressMore: () => void;
}

export default function ResultsPanel({ 
  result,
  originalImageUrl,
  locale = 'en',
  format = 'png',
  onDownload, 
  onCompressMore 
}: ResultsPanelProps) {
  const { t } = useTranslation(`compressors/${format}` as any, locale);
  
  // 安全检查
  if (!result) {
    return null;
  }
  
  const compressionRatio = result.compressionRatio || 0;
  const isPositiveSavings = compressionRatio > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="border-t border-slate-200 dark:border-gray-700 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-green-950/20 dark:via-blue-950/20 dark:to-purple-950/20 transition-colors"
    >
      <div className="p-6 max-w-3xl mx-auto">
        {/* 成功标题 - 增强庆祝感 */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 10 }}
            className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
          >
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>
          
          <motion.h3 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2 transition-colors"
          >
            {t('operation.results.title')}
          </motion.h3>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-600 dark:text-gray-300 transition-colors"
          >
            {t('operation.results.subtitle')}
          </motion.p>
        </div>

        {/* 压缩统计 - 重新设计 */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-4 mb-6"
        >
          {/* 主要统计卡片 */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-gray-700 transition-colors">
            {/* 压缩率高亮显示 */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center space-x-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-2xl px-6 py-4 border-2 border-green-200 dark:border-green-700 transition-colors">
                <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <div className="text-xs text-green-700 dark:text-green-400 font-medium mb-1 transition-colors">{t('operation.results.compressionRatio')}</div>
                  <div className={`text-4xl font-black ${isPositiveSavings ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'} transition-colors`}>
                    {isPositiveSavings ? '-' : '+'}{Math.abs(compressionRatio)}%
                  </div>
                </div>
              </div>
            </div>

            {/* 图片预览对比 */}
            <div className="mb-6">
              <div className="grid grid-cols-2 gap-4">
                {/* 原始图片预览 */}
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase text-center transition-colors">{t('operation.results.original')}</div>
                  <div className="aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600 transition-colors">
                    {originalImageUrl && (
                      <img 
                        src={originalImageUrl} 
                        alt="Original"
                        className="w-full h-full object-contain"
                      />
                    )}
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 transition-colors">
                      {(result.originalSize / 1024 / 1024).toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 transition-colors">MB</div>
                  </div>
                </div>
                
                {/* 压缩后图片预览 */}
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-green-700 dark:text-green-400 uppercase text-center transition-colors">{t('operation.results.compressed')}</div>
                  <div className="aspect-video bg-green-50 dark:bg-green-900/30 rounded-lg overflow-hidden border-2 border-green-300 dark:border-green-700 transition-colors">
                    {result.preview && (
                      <img 
                        src={result.preview} 
                        alt="Compressed"
                        className="w-full h-full object-contain"
                      />
                    )}
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400 transition-colors">
                      {(result.compressedSize / 1024 / 1024).toFixed(2)}
                    </div>
                    <div className="text-xs text-green-600 dark:text-green-400 transition-colors">MB</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 详细统计 */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200 dark:border-gray-700 transition-colors">
              {/* 节省空间 */}
              <div className="text-center">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1 transition-colors">{t('operation.results.saved')}</div>
                <div className="text-lg font-bold text-green-600 dark:text-green-400 transition-colors">
                  {((result.originalSize - result.compressedSize) / 1024 / 1024).toFixed(2)} MB
                </div>
              </div>
              
              {/* 处理时间 */}
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-1">{t('operation.results.time')}</div>
                <div className="text-lg font-bold text-blue-600">
                  {result.processingTime ? `${(result.processingTime / 1000).toFixed(1)}s` : '<1s'}
                </div>
              </div>
              
              {/* 文件格式 */}
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-1">{t('operation.results.format')}</div>
                <div className="text-lg font-bold text-purple-600">
                  {result.compressedFile.type.split('/')[1].toUpperCase()}
                </div>
              </div>
            </div>
          </div>

          {/* 成功提示 */}
          {isPositiveSavings && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
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
                  <h4 className="text-sm font-semibold text-blue-900 mb-1">{t('operation.results.successMessage')}</h4>
                  <p className="text-xs text-blue-700">
                    {t('operation.results.successDescription', { ratio: Math.abs(compressionRatio) })}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* 操作按钮 - 优化层次 */}
        <div className="flex flex-col sm:flex-row gap-3">
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
              <span>{t('operation.results.download')}</span>
            </div>
          </motion.button>
          
          <button
            onClick={onCompressMore}
            className="py-4 px-6 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>{t('operation.results.reset')}</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}