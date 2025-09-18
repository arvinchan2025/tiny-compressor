'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Download, Zap, Shield, Star, Gift, FileImage, Settings, CheckCircle, HelpCircle, Users, Globe, Smartphone, Monitor } from 'lucide-react';
import ImageUploader from '@/components/ImageUploader';
import CompressionSettings from '@/components/CompressionSettings';
import CompressionResults from '@/components/CompressionResults';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getTranslations } from '@/lib/translations';

export default function Home({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const [currentLanguage, setCurrentLanguage] = useState(locale);
  const translations = getTranslations(currentLanguage);
  
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

  // FAQ结构化数据
  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": translations.faq.questions.privacy.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": translations.faq.questions.privacy.answer
        }
      },
      {
        "@type": "Question",
        "name": translations.faq.questions.fileSize.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": translations.faq.questions.fileSize.answer
        }
      },
      {
        "@type": "Question",
        "name": translations.faq.questions.compression.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": translations.faq.questions.compression.answer
        }
      },
      {
        "@type": "Question",
        "name": translations.faq.questions.account.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": translations.faq.questions.account.answer
        }
      },
      {
        "@type": "Question",
        "name": translations.faq.questions.browsers.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": translations.faq.questions.browsers.answer
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
        translations={translations}
        currentLanguage={currentLanguage}
        onLanguageChange={setCurrentLanguage}
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
            {translations.hero.title}
          </h1>
          <p className="text-lg sm:text-xl text-neutral-600 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            {translations.hero.subtitle}
          </p>
          <motion.button
            className="btn-primary text-base sm:text-lg px-6 py-3 sm:px-8 sm:py-4"
            onClick={() => document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth' })}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {translations.hero.cta}
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
              translations={translations}
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
                translations={translations}
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
                translations={translations}
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
              {translations.features.title}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              <motion.div 
                className="card text-center p-4 sm:p-6"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <Zap className="w-10 h-10 sm:w-12 sm:h-12 text-primary-600 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-lg sm:text-xl font-semibold mb-2">{translations.features.fast.title}</h3>
                <p className="text-sm sm:text-base text-neutral-600">{translations.features.fast.description}</p>
              </motion.div>
              
              <motion.div 
                className="card text-center p-4 sm:p-6"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <Shield className="w-10 h-10 sm:w-12 sm:h-12 text-primary-600 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-lg sm:text-xl font-semibold mb-2">{translations.features.secure.title}</h3>
                <p className="text-sm sm:text-base text-neutral-600">{translations.features.secure.description}</p>
              </motion.div>
              
              <motion.div 
                className="card text-center p-4 sm:p-6"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <Star className="w-10 h-10 sm:w-12 sm:h-12 text-primary-600 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-lg sm:text-xl font-semibold mb-2">{translations.features.quality.title}</h3>
                <p className="text-sm sm:text-base text-neutral-600">{translations.features.quality.description}</p>
              </motion.div>
              
              <motion.div 
                className="card text-center p-4 sm:p-6"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <Gift className="w-10 h-10 sm:w-12 sm:h-12 text-primary-600 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-lg sm:text-xl font-semibold mb-2">{translations.features.free.title}</h3>
                <p className="text-sm sm:text-base text-neutral-600">{translations.features.free.description}</p>
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
              {translations.howItWorks.title}
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
                <h3 className="text-lg sm:text-xl font-semibold mb-2">{translations.howItWorks.step1.title}</h3>
                <p className="text-sm sm:text-base text-gray-600">{translations.howItWorks.step1.description}</p>
              </motion.div>
              
              <motion.div 
                className="text-center p-4"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="bg-primary-100 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Settings className="w-6 h-6 sm:w-8 sm:h-8 text-primary-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">{translations.howItWorks.step2.title}</h3>
                <p className="text-sm sm:text-base text-gray-600">{translations.howItWorks.step2.description}</p>
              </motion.div>
              
              <motion.div 
                className="text-center p-4"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="bg-primary-100 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Download className="w-6 h-6 sm:w-8 sm:h-8 text-primary-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">{translations.howItWorks.step3.title}</h3>
                <p className="text-sm sm:text-base text-gray-600">{translations.howItWorks.step3.description}</p>
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
              {translations.formats.title}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="card text-center">
                <FileImage className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">{translations.formats.jpeg.title}</h3>
                <p className="text-gray-600 text-sm">{translations.formats.jpeg.description}</p>
              </div>
              
              <div className="card text-center">
                <FileImage className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">{translations.formats.png.title}</h3>
                <p className="text-gray-600 text-sm">{translations.formats.png.description}</p>
              </div>
              
              <div className="card text-center">
                <FileImage className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">{translations.formats.webp.title}</h3>
                <p className="text-gray-600 text-sm">{translations.formats.webp.description}</p>
              </div>
              
              <div className="card text-center">
                <FileImage className="w-12 h-12 text-orange-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">{translations.formats.gif.title}</h3>
                <p className="text-gray-600 text-sm">{translations.formats.gif.description}</p>
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
              {translations.faq.title}
            </h2>
            <div className="space-y-4 sm:space-y-6">
              <motion.div 
                className="card p-4 sm:p-6"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 flex items-start sm:items-center">
                  <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600 mr-2 mt-0.5 sm:mt-0 flex-shrink-0" />
                  {translations.faq.questions.privacy.question}
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  {translations.faq.questions.privacy.answer}
                </p>
              </motion.div>
              
              <motion.div 
                className="card p-4 sm:p-6"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 flex items-start sm:items-center">
                  <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600 mr-2 mt-0.5 sm:mt-0 flex-shrink-0" />
                  {translations.faq.questions.fileSize.question}
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  {translations.faq.questions.fileSize.answer}
                </p>
              </motion.div>
              
              <motion.div 
                className="card p-4 sm:p-6"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 flex items-start sm:items-center">
                  <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600 mr-2 mt-0.5 sm:mt-0 flex-shrink-0" />
                  {translations.faq.questions.compression.question}
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  {translations.faq.questions.compression.answer}
                </p>
              </motion.div>
              
              <motion.div 
                className="card p-4 sm:p-6"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 flex items-start sm:items-center">
                  <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600 mr-2 mt-0.5 sm:mt-0 flex-shrink-0" />
                  {translations.faq.questions.account.question}
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  {translations.faq.questions.account.answer}
                </p>
              </motion.div>
              
              <motion.div 
                className="card"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                  <HelpCircle className="w-5 h-5 text-primary-600 mr-2" />
                  Which browsers are supported?
                </h3>
                <p className="text-gray-600">
                  TinyCompressor works on all modern browsers including Chrome, Firefox, Safari, and Edge. It&apos;s also fully optimized for mobile devices.
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
              {translations.perfectFor.title}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <motion.div 
                className="card text-center"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <Globe className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">{translations.perfectFor.webDevelopers.title}</h3>
                <p className="text-gray-600">{translations.perfectFor.webDevelopers.description}</p>
              </motion.div>
              
              <motion.div 
                className="card text-center"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <Smartphone className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">{translations.perfectFor.designers.title}</h3>
                <p className="text-gray-600">{translations.perfectFor.designers.description}</p>
              </motion.div>
              
              <motion.div 
                className="card text-center"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <Users className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">{translations.perfectFor.socialMedia.title}</h3>
                <p className="text-gray-600">{translations.perfectFor.socialMedia.description}</p>
              </motion.div>
              
              <motion.div 
                className="card text-center"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <Monitor className="w-12 h-12 text-orange-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">{translations.perfectFor.emailAttachments.title}</h3>
                <p className="text-gray-600">{translations.perfectFor.emailAttachments.description}</p>
              </motion.div>
              
              <motion.div 
                className="card text-center"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <FileImage className="w-12 h-12 text-red-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">{translations.perfectFor.photoStorage.title}</h3>
                <p className="text-gray-600">{translations.perfectFor.photoStorage.description}</p>
              </motion.div>
              
              <motion.div 
                className="card text-center"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <CheckCircle className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">{translations.perfectFor.ecommerce.title}</h3>
                <p className="text-gray-600">{translations.perfectFor.ecommerce.description}</p>
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
              Ready to Compress Your Images?
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Join thousands of users who trust TinyCompressor for their image optimization needs
            </p>
            <motion.button
              className="bg-white text-primary-600 font-semibold py-4 px-8 rounded-lg text-lg hover:bg-gray-100 transition-colors"
              onClick={() => document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth' })}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Compressing Now
            </motion.button>
          </div>
        </motion.section>
      </main>

        <Footer translations={translations} locale={locale} />
    </div>
  );
}
