'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, Download, Zap, Shield, Star, Gift, FileImage, Settings, CheckCircle, HelpCircle, Users, Globe, Smartphone, Monitor } from 'lucide-react';
import ImageUploader from '@/components/ImageUploader';
import CompressionSettings from '@/components/CompressionSettings';
import CompressionResults from '@/components/CompressionResults';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getTranslations } from '@/lib/translations';
import { Translations } from '@/lib/i18n';
import { createTranslationAccessor } from '@/lib/safe-translations';

export default function Home({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const [translations, setTranslations] = useState<Translations | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // 直接使用locale，避免额外的状态管理
  const currentLanguage = locale;
  
  // 异步加载翻译
  useEffect(() => {
    let isMounted = true;
    
    const loadTranslations = async () => {
      if (!isMounted) return;
      
      console.log(`Loading translations for locale: ${locale}`);
      setIsLoading(true);
      
      try {
        const trans = await getTranslations(locale);
        console.log(`Translations loaded for ${locale}:`, trans ? 'Success' : 'Failed');
        
        if (isMounted) {
          setTranslations(trans);
        }
      } catch (error) {
        console.error(`Failed to load translations for ${locale}:`, error);
        // 回退到英语
        try {
          console.log('Falling back to English translations...');
          const fallback = await getTranslations('en');
          console.log('Fallback translations loaded:', fallback ? 'Success' : 'Failed');
          
          if (isMounted) {
            setTranslations(fallback);
          }
        } catch (fallbackError) {
          console.error('Failed to load fallback translations:', fallbackError);
          // 如果连英语都加载失败，设置一个基本的空翻译对象
          if (isMounted) {
            setTranslations(null);
            // 保持加载状态，避免渲染错误
            setIsLoading(true);
          }
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    
    loadTranslations();
    
    return () => {
      isMounted = false;
    };
  }, [locale]); // 直接使用locale作为依赖
  
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [compressedFiles, setCompressedFiles] = useState<{ file: File; originalSize: number; compressedSize: number }[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionSettings, setCompressionSettings] = useState({
    quality: 0.8,
    maxWidth: 1920,
    maxHeight: 1080,
    format: 'jpeg' as 'jpeg' | 'png' | 'webp'
  });

  const handleFilesUploaded = (files: File[]) => {
    setUploadedFiles(files);
    setCompressedFiles([]);
  };

  const handleCompressionComplete = (results: { file: File; originalSize: number; compressedSize: number }[]) => {
    setCompressedFiles(results);
    setIsCompressing(false);
  };

  const handleCompress = () => {
    setIsCompressing(true);
    // Compression logic will be handled in the CompressionSettings component
  };

  const handleReset = () => {
    setUploadedFiles([]);
    setCompressedFiles([]);
    setIsCompressing(false);
  };

  // 如果正在加载翻译，显示加载状态
  if (isLoading || !translations) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading...</p>
        </div>
      </div>
    );
  }

  // 创建安全的翻译访问器
  const t = createTranslationAccessor(translations);

  // FAQ结构化数据
  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": t.faq.questions.privacy.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": t.faq.questions.privacy.answer
        }
      },
      {
        "@type": "Question",
        "name": t.faq.questions.fileSize.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": t.faq.questions.fileSize.answer
        }
      },
      {
        "@type": "Question",
        "name": t.faq.questions.compression.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": t.faq.questions.compression.answer
        }
      },
      {
        "@type": "Question",
        "name": t.faq.questions.account.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": t.faq.questions.account.answer
        }
      },
      {
        "@type": "Question",
        "name": t.faq.questions.browsers.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": t.faq.questions.browsers.answer
        }
      }
    ]
  };

  return (
    <div className="min-h-screen gradient-bg">
      {/* FAQ结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
      
      <Header 
        currentLanguage={currentLanguage}
        onLanguageChange={(lang) => {
          // 语言切换由路由处理，这里不需要状态更新
          const newPath = lang === 'en' ? '/' : `/${lang}`;
          window.location.href = newPath;
        }}
      />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.section 
          className="text-center py-8 sm:py-12 md:py-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 mb-4 sm:mb-6 px-4">
            {t.hero.title}
          </h1>
          <p className="text-lg sm:text-xl text-neutral-600 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            {t.hero.subtitle}
          </p>
          <motion.button
            className="btn-primary text-base sm:text-lg px-6 py-3 sm:px-8 sm:py-4"
            onClick={() => document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth' })}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {t.hero.cta}
          </motion.button>
        </motion.section>

        {/* Upload Section */}
        <motion.section 
          id="upload-section"
          className="py-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="max-w-4xl mx-auto">
            <ImageUploader 
              onFilesUploaded={handleFilesUploaded}
              disabled={isCompressing}
                     translations={t as any}
            />
          </div>
        </motion.section>

        {/* Compression Settings */}
        {uploadedFiles.length > 0 && (
          <motion.section 
            className="py-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="max-w-4xl mx-auto">
              <CompressionSettings
                settings={compressionSettings}
                onSettingsChange={setCompressionSettings}
                onCompress={handleCompress}
                isCompressing={isCompressing}
                files={uploadedFiles}
                onCompressionComplete={handleCompressionComplete}
                     translations={t as any}
              />
            </div>
          </motion.section>
        )}

        {/* Results */}
        {compressedFiles.length > 0 && (
          <motion.section 
            className="py-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="max-w-4xl mx-auto">
              <CompressionResults
                results={compressedFiles}
                onReset={handleReset}
                     translations={t as any}
              />
            </div>
          </motion.section>
        )}

        {/* Features Section */}
        <motion.section 
          className="py-12 sm:py-16 md:py-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-neutral-900 mb-8 sm:mb-12 md:mb-16">
              {t.features.title}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              <motion.div 
                className="card text-center p-4 sm:p-6"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <Zap className="w-10 h-10 sm:w-12 sm:h-12 text-primary-600 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-lg sm:text-xl font-semibold mb-2">{t.features.fast.title}</h3>
                <p className="text-sm sm:text-base text-neutral-600">{t.features.fast.description}</p>
              </motion.div>
              
              <motion.div 
                className="card text-center p-4 sm:p-6"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <Shield className="w-10 h-10 sm:w-12 sm:h-12 text-primary-600 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-lg sm:text-xl font-semibold mb-2">{t.features.secure.title}</h3>
                <p className="text-sm sm:text-base text-neutral-600">{t.features.secure.description}</p>
              </motion.div>
              
              <motion.div 
                className="card text-center p-4 sm:p-6"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <Star className="w-10 h-10 sm:w-12 sm:h-12 text-primary-600 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-lg sm:text-xl font-semibold mb-2">{t.features.quality.title}</h3>
                <p className="text-sm sm:text-base text-neutral-600">{t.features.quality.description}</p>
              </motion.div>
              
              <motion.div 
                className="card text-center p-4 sm:p-6"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <Gift className="w-10 h-10 sm:w-12 sm:h-12 text-primary-600 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-lg sm:text-xl font-semibold mb-2">{t.features.free.title}</h3>
                <p className="text-sm sm:text-base text-neutral-600">{t.features.free.description}</p>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* How It Works Section */}
        <motion.section 
          className="py-12 sm:py-16 md:py-20 bg-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-8 sm:mb-12 md:mb-16">
              {t.howItWorks.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              <motion.div 
                className="text-center p-4"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="bg-primary-100 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-primary-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">{t.howItWorks.step1.title}</h3>
                <p className="text-sm sm:text-base text-gray-600">{t.howItWorks.step1.description}</p>
              </motion.div>
              
              <motion.div 
                className="text-center p-4"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="bg-primary-100 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Settings className="w-6 h-6 sm:w-8 sm:h-8 text-primary-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">{t.howItWorks.step2.title}</h3>
                <p className="text-sm sm:text-base text-gray-600">{t.howItWorks.step2.description}</p>
              </motion.div>
              
              <motion.div 
                className="text-center p-4"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="bg-primary-100 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Download className="w-6 h-6 sm:w-8 sm:h-8 text-primary-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">{t.howItWorks.step3.title}</h3>
                <p className="text-sm sm:text-base text-gray-600">{t.howItWorks.step3.description}</p>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Supported Formats Section */}
        <motion.section 
          className="py-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">
              {t.formats.title}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="card text-center">
                <FileImage className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">{t.formats.jpeg.title}</h3>
                <p className="text-gray-600 text-sm">{t.formats.jpeg.description}</p>
              </div>
              
              <div className="card text-center">
                <FileImage className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">{t.formats.png.title}</h3>
                <p className="text-gray-600 text-sm">{t.formats.png.description}</p>
              </div>
              
              <div className="card text-center">
                <FileImage className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">{t.formats.webp.title}</h3>
                <p className="text-gray-600 text-sm">{t.formats.webp.description}</p>
              </div>
              
              <div className="card text-center">
                <FileImage className="w-12 h-12 text-orange-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">{t.formats.gif.title}</h3>
                <p className="text-gray-600 text-sm">{t.formats.gif.description}</p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* FAQ Section */}
        <motion.section 
          className="py-12 sm:py-16 md:py-20 bg-gray-50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-8 sm:mb-12 md:mb-16">
              {t.faq.title}
            </h2>
            <div className="space-y-4 sm:space-y-6">
              <motion.div 
                className="card p-4 sm:p-6"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 flex items-start sm:items-center">
                  <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600 mr-2 mt-0.5 sm:mt-0 flex-shrink-0" />
                  {t.faq.questions.privacy.question}
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  {t.faq.questions.privacy.answer}
                </p>
              </motion.div>
              
              <motion.div 
                className="card p-4 sm:p-6"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 flex items-start sm:items-center">
                  <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600 mr-2 mt-0.5 sm:mt-0 flex-shrink-0" />
                  {t.faq.questions.fileSize.question}
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  {t.faq.questions.fileSize.answer}
                </p>
              </motion.div>
              
              <motion.div 
                className="card p-4 sm:p-6"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 flex items-start sm:items-center">
                  <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600 mr-2 mt-0.5 sm:mt-0 flex-shrink-0" />
                  {t.faq.questions.compression.question}
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  {t.faq.questions.compression.answer}
                </p>
              </motion.div>
              
              <motion.div 
                className="card p-4 sm:p-6"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 flex items-start sm:items-center">
                  <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600 mr-2 mt-0.5 sm:mt-0 flex-shrink-0" />
                  {t.faq.questions.account.question}
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  {t.faq.questions.account.answer}
                </p>
              </motion.div>
              
              <motion.div 
                className="card p-4 sm:p-6"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 flex items-start sm:items-center">
                  <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600 mr-2 mt-0.5 sm:mt-0 flex-shrink-0" />
                  {t.faq.questions.browsers.question}
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  {t.faq.questions.browsers.answer}
                </p>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Use Cases Section */}
        <motion.section 
          className="py-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">
              {t.perfectFor.title}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <motion.div 
                className="card text-center"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <Globe className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">{t.perfectFor.webDevelopers.title}</h3>
                <p className="text-gray-600">{t.perfectFor.webDevelopers.description}</p>
              </motion.div>
              
              <motion.div 
                className="card text-center"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <Smartphone className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">{t.perfectFor.designers.title}</h3>
                <p className="text-gray-600">{t.perfectFor.designers.description}</p>
              </motion.div>
              
              <motion.div 
                className="card text-center"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <Users className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">{t.perfectFor.socialMedia.title}</h3>
                <p className="text-gray-600">{t.perfectFor.socialMedia.description}</p>
              </motion.div>
              
              <motion.div 
                className="card text-center"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <Monitor className="w-12 h-12 text-orange-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">{t.perfectFor.emailAttachments.title}</h3>
                <p className="text-gray-600">{t.perfectFor.emailAttachments.description}</p>
              </motion.div>
              
              <motion.div 
                className="card text-center"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <FileImage className="w-12 h-12 text-red-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">{t.perfectFor.photoStorage.title}</h3>
                <p className="text-gray-600">{t.perfectFor.photoStorage.description}</p>
              </motion.div>
              
              <motion.div 
                className="card text-center"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <CheckCircle className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">{t.perfectFor.ecommerce.title}</h3>
                <p className="text-gray-600">{t.perfectFor.ecommerce.description}</p>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section 
          className="py-20 bg-primary-600"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.4 }}
        >
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              {t.cta.title}
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              {t.cta.subtitle}
            </p>
            <motion.button
              className="bg-white text-primary-600 font-semibold py-4 px-8 rounded-lg text-lg hover:bg-gray-100 transition-colors"
              onClick={() => document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth' })}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {t.cta.button}
            </motion.button>
          </div>
        </motion.section>
      </main>

        <Footer translations={t as any} locale={locale} />
    </div>
  );
}
