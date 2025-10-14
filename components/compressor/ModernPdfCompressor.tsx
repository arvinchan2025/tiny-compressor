'use client';

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FileText, Upload, Download, Check, X, Zap, Shield, Clock, HardDrive } from 'lucide-react';
import StandardPageLayout from '@/components/layout/StandardPageLayout';
import { SupportedLanguage } from '@/types/i18n';
import {
  createPdfFile,
  validatePdfFile,
  compressPdf,
  downloadPdfResult,
  formatFileSize,
  PdfFile,
  PdfCompressionResult,
  PdfCompressionOptions
} from '@/lib/pdf-processing/compression';

interface ModernPdfCompressorProps {
  locale: SupportedLanguage;
}

export default function ModernPdfCompressor({ locale }: ModernPdfCompressorProps) {
  const [pdfFile, setPdfFile] = useState<PdfFile | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<PdfCompressionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  // Compression options
  const [options, setOptions] = useState<PdfCompressionOptions>({
    imageQuality: 0.7,
    removeMetadata: true,
    compressImages: true,
    scaleImages: false,
    maxImageDimension: 1920
  });

  React.useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleFileSelect = useCallback(async (file: File) => {
    setError(null);
    setResult(null);

    // Validate file
    const validation = validatePdfFile(file);
    if (!validation.valid) {
      setError(validation.error || 'Invalid PDF file');
      return;
    }

    // Create PDF file object
    try {
      const pdfFileObj = await createPdfFile(file);
      setPdfFile(pdfFileObj);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load PDF file');
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0 && files[0]) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleCompress = useCallback(async () => {
    if (!pdfFile) return;

    setIsProcessing(true);
    setError(null);

    try {
      const compressionResult = await compressPdf(pdfFile, options);
      setResult(compressionResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Compression failed');
    } finally {
      setIsProcessing(false);
    }
  }, [pdfFile, options]);

  const handleDownload = useCallback(() => {
    if (result) {
      downloadPdfResult(result);
    }
  }, [result]);

  const handleReset = useCallback(() => {
    setPdfFile(null);
    setResult(null);
    setError(null);
  }, []);

  return (
    <StandardPageLayout locale={locale}>
      <motion.div 
        className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 dark:from-gray-925 dark:via-gray-900 dark:to-red-950/20 relative overflow-hidden"
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-red-400/20 to-orange-600/20 dark:from-red-500/10 dark:to-orange-700/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <motion.div
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-orange-400/20 to-red-600/20 dark:from-orange-500/10 dark:to-red-700/10 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [360, 180, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </div>
        
        {/* Hero Section */}
        <motion.section 
          className="pt-24 pb-12 md:pt-28 md:pb-16 relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="max-w-6xl mx-auto px-4 text-center">
            {/* Main Title with Enhanced Animation */}
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 dark:from-red-400 dark:via-orange-400 dark:to-amber-400 bg-clip-text text-transparent mb-6 relative"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Compress PDF Files Online
              <motion.div
                className="absolute -inset-1 bg-gradient-to-r from-red-600/20 via-orange-600/20 to-amber-600/20 dark:from-red-400/10 dark:via-orange-400/10 dark:to-amber-400/10 rounded-lg blur-lg -z-10"
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.h1>
            
            {/* Animated Divider */}
            <motion.div 
              className="w-32 h-1.5 bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 dark:from-red-400 dark:via-orange-400 dark:to-amber-400 mx-auto rounded-full mb-6"
              initial={{ width: 0 }}
              animate={{ width: 128 }}
              transition={{ duration: 1, delay: 0.6 }}
            />
            
            {/* Description with Stagger Animation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <p className="text-xl text-slate-700 dark:text-slate-300 max-w-4xl mx-auto leading-relaxed mb-3">
                Reduce PDF file size while maintaining quality. Fast, secure, and completely free.
              </p>
              
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed mb-8">
                Professional PDF compression tool that helps you optimize PDFs for web, email, and storage. Privacy-first with client-side processing.
              </p>
            </motion.div>

            {/* Enhanced Features Badges */}
            <motion.div 
              className="flex flex-wrap justify-center gap-4 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
            >
              {[
                'Fast Processing',
                'Privacy First',
                'No Size Limit',
                '100% Free'
              ].map((feature: string, index: number) => (
                <motion.span 
                  key={index}
                  className="px-6 py-3 bg-white/90 dark:bg-gray-850/90 backdrop-blur-sm rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 shadow-lg border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl transition-all duration-300 cursor-default"
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 1.2 + index * 0.1 }}
                  whileHover={{ 
                    scale: 1.05, 
                    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                    y: -2
                  }}
                >
                  {feature}
                </motion.span>
              ))}
            </motion.div>

            {/* Floating Action Button */}
            <motion.div
              className="flex justify-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.5 }}
            >
              <motion.button
                className="px-8 py-4 bg-gradient-to-r from-red-600 to-orange-600 dark:from-red-700 dark:to-orange-700 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  document.getElementById('compression-section')?.scrollIntoView({ 
                    behavior: 'smooth' 
                  });
                }}
              >
                <span className="text-lg">📄</span>
                <span>Start Compressing</span>
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              </motion.button>
            </motion.div>
          </div>
        </motion.section>

        {/* Main Compression Section */}
        <motion.section 
          id="compression-section"
          className="py-16 relative z-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="max-w-5xl mx-auto px-4">
            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              {/* Section Header */}
              <motion.div
                className="text-center mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.0 }}
              >
                <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-200 mb-4">
                  Compress Your PDF
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                  Upload your PDF file and get optimized results with our advanced compression technology
                </p>
              </motion.div>

              {/* Enhanced Compression Area */}
              <motion.div
                className="relative"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-red-600/20 via-orange-600/20 to-amber-600/20 dark:from-red-400/10 dark:via-orange-400/10 dark:to-amber-400/10 rounded-3xl blur-lg"></div>
                <div className="relative bg-white/95 dark:bg-gray-850/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/20 p-8">
              {!pdfFile && !result && (
                <motion.div
                  className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${
                    isDragging
                      ? 'border-red-500 bg-red-50 dark:bg-red-500/10'
                      : 'border-border-default hover:border-red-500 hover:bg-red-50/50 dark:hover:bg-red-500/5'
                  }`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  whileHover={{ scale: 1.01 }}
                >
                  <Upload className="w-16 h-16 text-red-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-text-primary mb-2">
                    Drop PDF file here or click to upload
                  </h3>
                  <p className="text-text-secondary mb-6">
                    Maximum file size: 100MB
                  </p>
                  <label className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 dark:from-red-700 dark:to-orange-700 text-white rounded-lg font-medium hover:shadow-lg transition-all cursor-pointer">
                    <Upload className="w-5 h-5" />
                    Choose PDF File
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={(e) => {
                        const files = e.target.files;
                        if (files && files.length > 0 && files[0]) {
                          handleFileSelect(files[0]);
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                </motion.div>
              )}

              {error && (
                <motion.div
                  className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg p-4 flex items-start gap-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <X className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-red-800 dark:text-red-300 font-medium">Error</p>
                    <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
                  </div>
                  <button
                    onClick={() => setError(null)}
                    className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </motion.div>
              )}

              {pdfFile && !result && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* File Info */}
                  <div className="card-glass p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-red-500/10 dark:bg-red-500/20 rounded-lg">
                        <FileText className="w-8 h-8 text-red-600 dark:text-red-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-lg font-semibold text-text-primary mb-1 truncate">
                          {pdfFile.name}
                        </h4>
                        <div className="flex flex-wrap gap-4 text-sm text-text-secondary">
                          <span>Size: {formatFileSize(pdfFile.size)}</span>
                          {pdfFile.metadata && (
                            <>
                              <span>Pages: {pdfFile.metadata.pageCount}</span>
                              {pdfFile.metadata.hasImages && (
                                <span className="text-orange-600 dark:text-orange-400">
                                  Contains Images
                                </span>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={handleReset}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                      >
                        <X className="w-5 h-5 text-text-secondary" />
                      </button>
                    </div>
                  </div>

                  {/* Compression Options */}
                  <div className="card-glass p-6">
                    <h4 className="text-lg font-semibold text-text-primary mb-4">
                      Compression Settings
                    </h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-text-secondary">Remove Metadata</label>
                        <input
                          type="checkbox"
                          checked={options.removeMetadata}
                          onChange={(e) => setOptions({ ...options, removeMetadata: e.target.checked })}
                          className="w-5 h-5 text-red-600 rounded focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-text-secondary">Compress Images</label>
                        <input
                          type="checkbox"
                          checked={options.compressImages}
                          onChange={(e) => setOptions({ ...options, compressImages: e.target.checked })}
                          className="w-5 h-5 text-red-600 rounded focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                      {options.compressImages && (
                        <div>
                          <label className="text-text-secondary block mb-2">
                            Image Quality: {Math.round(options.imageQuality * 100)}%
                          </label>
                          <input
                            type="range"
                            min="10"
                            max="100"
                            step="10"
                            value={options.imageQuality * 100}
                            onChange={(e) => setOptions({ ...options, imageQuality: parseInt(e.target.value) / 100 })}
                            className="w-full"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Compress Button */}
                  <button
                    onClick={handleCompress}
                    disabled={isProcessing}
                    className="w-full py-4 bg-gradient-to-r from-red-600 to-orange-600 dark:from-red-700 dark:to-orange-700 text-white rounded-lg font-semibold text-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Compressing...
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5" />
                        Compress PDF
                      </>
                    )}
                  </button>
                </motion.div>
              )}

              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* Success Message */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-500/10 dark:to-emerald-500/10 border border-green-200 dark:border-green-500/20 rounded-lg p-6 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-4">
                      <Check className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-green-800 dark:text-green-300 mb-2">
                      Compression Complete!
                    </h3>
                    <p className="text-green-700 dark:text-green-400">
                      Your PDF has been compressed successfully
                    </p>
                  </div>

                  {/* Compression Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="card-glass p-4 text-center">
                      <div className="text-3xl font-bold text-text-primary mb-1">
                        {formatFileSize(result.originalSize)}
                      </div>
                      <div className="text-sm text-text-secondary">Original Size</div>
                    </div>
                    <div className="card-glass p-4 text-center">
                      <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
                        {formatFileSize(result.compressedSize)}
                      </div>
                      <div className="text-sm text-text-secondary">Compressed Size</div>
                    </div>
                    <div className="card-glass p-4 text-center">
                      <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-1">
                        {result.savingsPercentage}%
                      </div>
                      <div className="text-sm text-text-secondary">Size Reduced</div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={handleDownload}
                      className="flex-1 py-4 bg-gradient-to-r from-red-600 to-orange-600 dark:from-red-700 dark:to-orange-700 text-white rounded-lg font-semibold text-lg hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      <Download className="w-5 h-5" />
                      Download Compressed PDF
                    </button>
                    <button
                      onClick={handleReset}
                      className="py-4 px-6 border-2 border-border-default rounded-lg font-semibold text-text-primary hover:bg-gray-50 dark:hover:bg-gray-850 transition-all"
                    >
                      Compress Another
                    </button>
                  </div>
                </motion.div>
              )}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        {/* Enhanced Knowledge Base Section */}
        <motion.section 
          className="py-24 bg-gradient-to-br from-red-50/80 to-orange-50/80 dark:from-gray-900/50 dark:to-red-950/20 backdrop-blur-sm relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 25px 25px, rgba(239, 68, 68, 0.3) 2px, transparent 0)`,
              backgroundSize: '50px 50px'
            }} />
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-7xl mx-auto">
              <motion.div 
                className="text-center mb-20"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="inline-flex items-center px-6 py-3 bg-white/90 dark:bg-gray-850/90 backdrop-blur-sm border border-red-200 dark:border-red-900/50 rounded-full text-sm font-medium text-red-800 dark:text-red-300 mb-6 shadow-lg">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-3 animate-pulse" />
                  <span className="font-semibold">PDF Compression Guide</span>
                  <span className="ml-2 px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full text-xs font-medium">Professional Tool</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-6">
                  Why Choose Our PDF Compressor?
                </h2>
                <p className="text-xl text-slate-600 dark:text-slate-400 max-w-4xl mx-auto leading-relaxed">
                  Professional-grade PDF compression with privacy-first, client-side processing
                </p>
              </motion.div>

              <div className="grid lg:grid-cols-2 gap-12">
                {[
                  {
                    icon: Shield,
                    color: 'from-blue-500 to-cyan-600',
                    title: 'Privacy First',
                    description: 'All processing happens in your browser. Your files never leave your device.',
                    benefits: [
                      'No file uploads to servers',
                      'Complete data privacy',
                      'Offline processing capability'
                    ]
                  },
                  {
                    icon: Zap,
                    color: 'from-orange-500 to-red-600',
                    title: 'Lightning Fast',
                    description: 'Compress PDFs in seconds with our optimized compression algorithm.',
                    benefits: [
                      'Instant processing',
                      'Real-time compression',
                      'Quick download'
                    ]
                  },
                  {
                    icon: HardDrive,
                    color: 'from-purple-500 to-pink-600',
                    title: 'No Size Limits',
                    description: 'Process files up to 100MB without any restrictions or hidden fees.',
                    benefits: [
                      'Large file support',
                      'No file count limits',
                      'Unlimited usage'
                    ]
                  },
                  {
                    icon: Clock,
                    color: 'from-green-500 to-emerald-600',
                    title: 'Always Free',
                    description: 'No registration, no watermarks, no limits. Completely free forever.',
                    benefits: [
                      'No account required',
                      'No watermarks',
                      'No hidden costs'
                    ]
                  }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    className="bg-white/90 dark:bg-gray-850/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700"
                    initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -5 }}
                  >
                    <div className="flex items-center mb-8">
                      <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mr-4`}>
                        <feature.icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{feature.title}</h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                      {feature.description}
                    </p>
                    <ul className="space-y-3">
                      {feature.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-start text-gray-700 dark:text-gray-300">
                          <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>
      </motion.div>
    </StandardPageLayout>
  );
}

