'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { SupportedLanguage } from '@/types/i18n';
import { useTranslationLoader } from '@/hooks/useTranslationLoader';
import PageLayout from '@/components/layout/PageLayout';
import { ImageFile } from '@/types/image';
import { formatFileSize } from '@/lib/utils';
import Link from 'next/link';
import HeroSection from '@/components/home/HeroSection';
import UnifiedOperationPanel from '@/components/home/UnifiedOperationPanel';
import StandardButton from '@/components/ui/StandardButton';
import StandardIcon from '@/components/ui/StandardIcon';

interface HomeClientProps {
  locale: SupportedLanguage;
}

export default function HomeClient({ locale }: HomeClientProps) {
  const { translations, isLoading, error, t } = useTranslationLoader({ locale });
  const [selectedFile, setSelectedFile] = useState<ImageFile | null>(null);
  const [processingMode, setProcessingMode] = useState<'compress' | 'convert'>('compress');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<any>(null);

  if (isLoading) {
    return (
      <PageLayout locale={locale} showHeader={false} showFooter={false}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">{t('common.loading')}</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout locale={locale} showHeader={false} showFooter={false}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">{t('common.error')}</h1>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              {t('common.retry')}
            </button>
          </div>
        </div>
      </PageLayout>
    );
  }

  const handleFileSelected = (file: ImageFile | null) => {
    setSelectedFile(file);
    setResult(null); // Clear previous results
    console.log('File selected:', file);
  };

  const handleProcess = async () => {
    if (!selectedFile) {
      return;
    }
    setIsProcessing(true);
    setResult(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate processing
      const mockResult = {
        originalFile: selectedFile,
        processedFile: selectedFile.file,
        originalSize: selectedFile.size,
        processedSize: Math.round(selectedFile.size * (processingMode === 'compress' ? 0.7 : 0.9)),
        reduction: processingMode === 'compress' ? 30 : 10,
        targetFormat: processingMode === 'convert' ? 'jpg' : selectedFile.type.split('/')[1]
      };
      setResult(mockResult);
    } catch (error) {
      console.error('Processing failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!result) {
      return;
    }
    const link = document.createElement('a');
    link.href = URL.createObjectURL(result.processedFile);
    link.download = `${result.originalFile.name.split('.')[0]}_${processingMode === 'compress' ? 'compressed' : 'converted'}.${result.targetFormat}`;
    link.click();
  };

  const handleClear = () => {
    setSelectedFile(null);
    setResult(null);
    setIsProcessing(false);
  };

  const handleProcessAnother = () => {
    setSelectedFile(null);
    setResult(null);
    setIsProcessing(false);
  };

  return (
    <PageLayout locale={locale} showHeader={true} showFooter={true}>
      {/* Hero Section */}
      <HeroSection translations={translations} />

      {/* Unified Operation Panel */}
      <section className="py-20 bg-slate-50">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            {translations?.quickProcess?.title || "Quick Processing"}
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            {translations?.quickProcess?.subtitle || "Upload your image and process it instantly"}
          </p>
        </motion.div>

        <UnifiedOperationPanel
          onFileSelected={handleFileSelected}
          onProcess={handleProcess}
          onClear={handleClear}
          onDownload={handleDownload}
          onProcessAnother={handleProcessAnother}
          selectedFile={selectedFile}
          result={result}
          isProcessing={isProcessing}
          processingMode={processingMode}
          onModeChange={setProcessingMode}
          translations={translations}
        />
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {translations?.features?.title || "Why Choose Our Image Tools?"}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {translations?.features?.subtitle || "Professional-grade image processing with user-friendly interface"}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: '⚡',
                title: translations?.features?.fast?.title || 'Lightning Fast',
                description: translations?.features?.fast?.description || 'Process images in seconds with our optimized algorithms'
              },
              {
                icon: '🔒',
                title: translations?.features?.secure?.title || '100% Secure',
                description: translations?.features?.secure?.description || 'Your files are processed locally and never stored on our servers'
              },
              {
                icon: '🎯',
                title: translations?.features?.accurate?.title || 'High Quality',
                description: translations?.features?.accurate?.description || 'Maintain image quality while reducing file size'
              },
              {
                icon: '📱',
                title: translations?.features?.mobile?.title || 'Mobile Friendly',
                description: translations?.features?.mobile?.description || 'Works perfectly on all devices and screen sizes'
              },
              {
                icon: '🌍',
                title: translations?.features?.global?.title || 'Multi-language',
                description: translations?.features?.global?.description || 'Available in multiple languages for global users'
              },
              {
                icon: '💯',
                title: translations?.features?.free?.title || 'Completely Free',
                description: translations?.features?.free?.description || 'No watermarks, no subscriptions, no hidden fees'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow duration-300"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
          >
            <h2 className="heading-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-8">
              {translations?.cta?.title || "Ready to Process Your Images?"}
            </h2>
            <p className="text-xl text-slate-700 max-w-4xl mx-auto leading-relaxed mb-8">
              {translations?.cta?.subtitle || "Get started with our powerful image compression and conversion tools"}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <StandardButton
                asChild
                variant="primary"
                size="lg"
                leftIcon={<StandardIcon name="compress" size="md" />}
              >
                <Link href="/compress-png">
                  {translations?.cta?.compressButton || "Start Compressing"}
                </Link>
              </StandardButton>
              
              <StandardButton
                asChild
                variant="secondary"
                size="lg"
                leftIcon={<StandardIcon name="convert" size="md" />}
              >
                <Link href="/convert-png-to-jpg">
                  {translations?.cta?.convertButton || "Start Converting"}
                </Link>
              </StandardButton>
            </div>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}