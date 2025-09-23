/**
 * 压缩器页面统一布局组件
 * 提供压缩器页面的通用结构和功能
 */

'use client';

import { useState, useEffect } from 'react';
import { SupportedLanguage } from '@/types/i18n';
import { ImageFile, CompressionOptions, CompressionResult } from '@/types/image';
import { getTranslations } from '@/lib/translations';
import CompressorHero from '@/components/compressor/CompressorHero';
import UnifiedCompressorOperation from '@/components/compressor/UnifiedCompressorOperation';
// 已删除的组件导入
import { compressImage, formatFileSize, calculateCompressionRatio } from '@/lib/image-processing/compression';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useRouter, usePathname } from 'next/navigation';
import { switchLanguage } from '@/lib/language-switch';
// import { useToast } from '@/components/ui/Toast'; // 移除Toast，改用进度条

interface CompressorPageLayoutProps {
  locale: SupportedLanguage;
  format: string;
  children: React.ReactNode;
  customTitle?: string;
  customSubtitle?: string;
  customDescription?: string;
  customSteps?: Array<{
    step: string;
    title: string;
    description: string;
    icon: string;
  }>;
  customNotes?: Array<{
    icon: string;
    title: string;
    content: string;
    type: 'warning' | 'tip' | 'info';
  }>;
  customFAQs?: Array<{
    question: string;
    answer: string;
  }>;
  compressionSettings?: React.ReactNode;
  customCompressionResults?: React.ReactNode;
}

export default function CompressorPageLayout({
  locale,
  format,
  children,
  customTitle,
  customSubtitle,
  customDescription,
  customSteps,
  customNotes,
  customFAQs,
  compressionSettings,
  customCompressionResults
}: CompressorPageLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  // const toast = useToast(); // 移除Toast，改用进度条
  const [translations, setTranslations] = useState<any>(null);
  const [currentLocale, setCurrentLocale] = useState<SupportedLanguage>(locale);
  const [imageFiles, setImageFiles] = useState<ImageFile[]>([]);
  const [compressionResults, setCompressionResults] = useState<CompressionResult[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionProgress, setCompressionProgress] = useState(0);
  const [compressionStatus, setCompressionStatus] = useState<'idle' | 'processing' | 'completed' | 'error'>('idle');

  // 语言切换处理器
  const handleLanguageChange = (newLocale: string) => {
    if (newLocale === currentLocale) {
      return;
    }
    setCurrentLocale(newLocale as SupportedLanguage);
    switchLanguage(newLocale, pathname);
  };

  // 加载翻译
  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const trans = await getTranslations(currentLocale);
        setTranslations(trans);
      } catch (error) {
        console.error('Failed to load translations:', error);
      }
    };

    loadTranslations();
  }, [currentLocale]);

  // 更新当前语言状态
  useEffect(() => {
    setCurrentLocale(locale);
  }, [locale]);

  const handleFilesSelected = (files: ImageFile[]) => {
    setImageFiles(files);
    setCompressionResults([]);
  };

  const handleRemoveFile = (fileId: string) => {
    setImageFiles(prev => prev.filter(file => file.id !== fileId));
    setCompressionResults(prev => prev.filter(result => result.originalFile.id !== fileId));
  };

  const handleDownload = (result: CompressionResult) => {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(result.compressedFile);
    link.download = `compressed_${result.originalFile.name}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  const handleCompress = async () => {
    if (imageFiles.length === 0) {
      return;
    }

    setIsCompressing(true);
    setCompressionStatus('processing');
    setCompressionProgress(0);
    setCompressionResults([]);

    try {
      const results: CompressionResult[] = [];
      
      for (let i = 0; i < imageFiles.length; i++) {
        const imageFile = imageFiles[i];
        if (!imageFile) continue;
        
        const options: CompressionOptions = {
          quality: 85,
          format: format as 'jpeg' | 'png' | 'webp' | 'avif' | 'gif'
        };

        const compressionResult = await compressImage(imageFile, options);
        results.push(compressionResult);
        
        // 更新进度
        setCompressionProgress(Math.round(((i + 1) / imageFiles.length) * 100));
      }

      setCompressionResults(results);
      setCompressionStatus('completed');
    } catch (error) {
      console.error('Compression failed:', error);
      setCompressionStatus('error');
    } finally {
      setIsCompressing(false);
    }
  };

  const handleDownloadAll = async () => {
    if (compressionResults.length === 0) {
      return;
    }

    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();

    compressionResults.forEach((result, index) => {
      const extension = result.compressedFile.type.split('/')[1] || 'jpg';
      const fileName = `compressed_${index + 1}_${result.originalFile.name.replace(/\.[^/.]+$/, '')}.${extension}`;
      zip.file(fileName, result.compressedFile);
    });

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(zipBlob);
    link.download = `compressed_images_${format}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  if (!translations) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading translations...</p>
        </div>
      </div>
    );
  }

  // 检查是否为 RTL 语言
  const isRTL = currentLocale === 'ar';
  const dir = isRTL ? 'rtl' : 'ltr';

  return (
    <div className="min-h-screen gradient-bg" dir={dir}>
      {/* Header */}
      <Header
        currentLocale={currentLocale}
        onLanguageChange={handleLanguageChange}
        translations={translations}
      />

      {/* Hero Section */}
      <CompressorHero
        locale={currentLocale}
        format={format}
        customTitle={customTitle}
        customSubtitle={customSubtitle}
        customDescription={customDescription}
        translations={translations.compressor}
      />

      {/* 统一操作区域 - 合并上传和设置 */}
      <UnifiedCompressorOperation
        locale={currentLocale}
        format={format}
        imageFiles={imageFiles}
        onFilesSelected={handleFilesSelected}
        onRemoveFile={handleRemoveFile}
        onCompress={handleCompress}
        maxFiles={20}
        translations={translations.compressor}
        isCompressing={isCompressing}
        compressionProgress={compressionProgress}
        compressionStatus={compressionStatus}
        compressionResults={compressionResults}
        onDownloadResult={handleDownload}
      />


      {/* Custom Compression Results */}
      {customCompressionResults}

      {/* 已删除的组件：HowItWorks, ImportantNotes, CompressorFAQ */}

      {/* Custom Content */}
      {children}

      {/* Footer */}
      <Footer
        currentLocale={currentLocale}
        translations={translations}
      />
    </div>
  );
}