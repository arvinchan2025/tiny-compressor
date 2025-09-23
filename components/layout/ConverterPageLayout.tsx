/**
 * 转换器页面统一布局组件
 * 提供转换器页面的通用结构和功能
 */

'use client';

import { useState, useEffect } from 'react';
import { SupportedLanguage } from '@/types/i18n';
import { ImageFile, CompressionResult } from '@/types/image';
import { getTranslations } from '@/lib/translations';
import ConverterHero from '@/components/converter/ConverterHero';
import FormatComparison from '@/components/converter/FormatComparison';
import UnifiedConverterOperation from '@/components/converter/UnifiedConverterOperation';
import FormatNotes from '@/components/converter/FormatNotes';
// 已删除的组件导入
import { compressImage, formatFileSize, calculateCompressionRatio } from '@/lib/image-processing/compression';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useRouter, usePathname } from 'next/navigation';
import { switchLanguage } from '@/lib/language-switch';
// import { useToast } from '@/components/ui/Toast'; // 移除Toast，改用进度条

interface ConversionResult {
  id: string;
  originalFile: {
    name: string;
    size: number;
    url: string;
  };
  compressedName: string;
  compressedSize: number;
  compressedUrl: string;
  sourceFormat: string;
  targetFormat: string;
  conversionTime: number;
}

interface ConverterPageLayoutProps {
  locale: SupportedLanguage;
  sourceFormat: string;
  targetFormat: string;
  children?: React.ReactNode;
  
  // 页面内容
  customTitle?: string;
  customSubtitle?: string;
  customDescription?: string;
  
  // 功能配置
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
  
  // 转换设置
  conversionSettings?: React.ReactNode;
}

export default function ConverterPageLayout({
  locale,
  sourceFormat,
  targetFormat,
  children,
  customTitle,
  customSubtitle,
  customDescription,
  customSteps,
  customNotes,
  customFAQs,
  conversionSettings
}: ConverterPageLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  // const toast = useToast(); // 移除Toast，改用进度条
  const [translations, setTranslations] = useState<any>(null);
  const [currentLocale, setCurrentLocale] = useState<SupportedLanguage>(locale);
  const [imageFiles, setImageFiles] = useState<ImageFile[]>([]);
  const [conversionResults, setConversionResults] = useState<ConversionResult[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [conversionProgress, setConversionProgress] = useState(0);
  const [conversionStatus, setConversionStatus] = useState<'idle' | 'processing' | 'completed' | 'error'>('idle');

  // 语言切换处理
  const handleLanguageChange = async (newLocale: SupportedLanguage) => {
    try {
      switchLanguage(newLocale, pathname);
      setCurrentLocale(newLocale);
    } catch (error) {
      console.error('Language switch failed:', error);
    }
  };

  // 加载翻译
  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const allTranslations = await getTranslations(currentLocale);
        setTranslations(allTranslations);
      } catch (error) {
        console.error('Failed to load translations:', error);
      }
    };
    loadTranslations();
  }, [currentLocale]);

  // 文件选择处理
  const handleFilesSelected = (files: ImageFile[]) => {
    const newImageFiles: ImageFile[] = files.map((imageFile, index) => ({
      id: `file-${Date.now()}-${index}`,
      file: imageFile.file,
      name: imageFile.name,
      size: imageFile.size,
      type: imageFile.type,
      url: URL.createObjectURL(imageFile.file)
    }));
    
    setImageFiles(prev => [...prev, ...newImageFiles]);
    // 文件上传成功，通过进度条显示状态
  };

  // 移除文件
  const handleRemoveFile = (fileId: string) => {
    setImageFiles(prev => {
      const fileToRemove = prev.find(f => f.id === fileId);
      if (fileToRemove && fileToRemove.url) {
        URL.revokeObjectURL(fileToRemove.url);
      }
      return prev.filter(f => f.id !== fileId);
    });
  };

  // 下载单个文件
  const handleDownload = (result: ConversionResult) => {
    const link = document.createElement('a');
    link.href = result.compressedUrl;
    link.download = result.compressedName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 下载所有文件
  const handleDownloadAll = () => {
    if (conversionResults.length === 0) return;
    
    // 创建ZIP文件
    // 这里需要实现ZIP创建逻辑
    console.log('Download started: Preparing ZIP file for download...');
  };

  // 转换处理
  const handleConvert = async () => {
    if (imageFiles.length === 0) {
      console.warn('No images selected: Please select images to convert');
      return;
    }

    setIsConverting(true);
    setConversionStatus('processing');
    setConversionProgress(0);
    setConversionResults([]);

    try {
      console.log('Conversion started:', `Converting ${imageFiles.length} image(s)...`);

      const results: ConversionResult[] = [];

      for (let i = 0; i < imageFiles.length; i++) {
        const imageFile = imageFiles[i];
        if (!imageFile) continue;
        
        const startTime = Date.now();
        
        // 更新进度
        setConversionProgress((i / imageFiles.length) * 100);
        
        // 这里需要实现实际的转换逻辑
        // 暂时使用压缩逻辑作为占位符
        const compressionOptions = {
          quality: 85,
          format: targetFormat as any,
          progressive: true,
          keepMetadata: false
        };

        const result = await compressImage(imageFile, compressionOptions);
        
        const conversionResult: ConversionResult = {
          id: `result-${Date.now()}-${i}`,
          originalFile: {
            name: imageFile.name,
            size: imageFile.size,
            url: imageFile.url
          },
          compressedName: result.compressedFile.name,
          compressedSize: result.compressedSize,
          compressedUrl: URL.createObjectURL(result.compressedFile),
          sourceFormat,
          targetFormat,
          conversionTime: Date.now() - startTime
        };
        
        results.push(conversionResult);
      }

      setConversionResults(results);
      setConversionProgress(100);
      setConversionStatus('completed');

      const totalOriginalSize = results.reduce((sum, result) => sum + result.originalFile.size, 0);
      const totalConvertedSize = results.reduce((sum, result) => sum + result.compressedSize, 0);
      const averageReduction = Math.round(((totalOriginalSize - totalConvertedSize) / totalOriginalSize) * 100);

      console.log(
        'Conversion completed!',
        `Successfully converted ${results.length} image(s) with ${averageReduction}% size reduction`
      );
    } catch (error) {
      console.error('Conversion failed:', error);
      setConversionStatus('error');
      console.error(
        'Conversion failed:',
        'An error occurred while converting your images. Please try again.'
      );
    } finally {
      setIsConverting(false);
    }
  };

  const isRTL = currentLocale === 'ar';
  const dir = isRTL ? 'rtl' : 'ltr';

  if (!translations) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center" dir={dir}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{translations?.common?.loading || 'Loading...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg" dir={dir}>
      {/* Header */}
      <Header
        currentLocale={currentLocale}
        onLanguageChange={(locale: string) => handleLanguageChange(locale as SupportedLanguage)}
        translations={translations}
      />

      {/* Hero Section */}
      <div className="pt-20">
        <ConverterHero
          locale={currentLocale}
          sourceFormat={sourceFormat}
          targetFormat={targetFormat}
          customTitle={customTitle || undefined}
          customSubtitle={customSubtitle || undefined}
          customDescription={customDescription || undefined}
          translations={translations.converter}
        />
      </div>

      {/* 统一操作区域 - 合并上传和设置 */}
      <UnifiedConverterOperation
        locale={currentLocale}
        sourceFormat={sourceFormat}
        targetFormat={targetFormat}
        imageFiles={imageFiles}
        onFilesSelected={(files: ImageFile[]) => handleFilesSelected(files)}
        onRemoveFile={handleRemoveFile}
        onConvert={handleConvert}
        maxFiles={20}
        translations={translations.converter}
        isConverting={isConverting}
        conversionProgress={conversionProgress}
        conversionStatus={conversionStatus}
        conversionResults={conversionResults.map(result => ({
          originalFile: {
            id: result.id,
            file: new File([], result.originalFile.name),
            name: result.originalFile.name,
            size: result.originalFile.size,
            type: `image/${sourceFormat}`,
            url: result.originalFile.url
          },
          convertedFile: new File([], result.compressedName),
          convertedSize: result.compressedSize
        }))}
        onDownloadResult={handleDownload}
      />




      {/* 已删除的组件：HowConversionWorks, ConversionFAQ */}
      {/* Important Notes */}
      <FormatNotes
        locale={currentLocale}
        sourceFormat={sourceFormat}
        targetFormat={targetFormat}
        customNotes={customNotes || undefined}
        translations={translations.converter}
      />

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
