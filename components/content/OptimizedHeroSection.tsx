'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import StandardButton from '@/components/ui/StandardButton';
import StandardIcon from '@/components/ui/StandardIcon';
import StandardCard from '@/components/ui/StandardCard';
import StandardContainer from '@/components/ui/StandardContainer';
import StandardGrid from '@/components/ui/StandardGrid';
import { longTailKeywords, contentTemplates } from '@/lib/content-optimization';

interface OptimizedHeroSectionProps {
  translations?: any;
  locale?: string;
}

export default function OptimizedHeroSection({ translations, locale = 'en' }: OptimizedHeroSectionProps) {
  const gradient = "from-blue-600 via-purple-600 to-pink-600";
  
  // 基于语言的内容
  const content = {
    en: {
      title: "Professional Image Compression & Conversion Tool",
      subtitle: "Reduce file sizes by up to 90% while maintaining quality. Fast, secure, and completely free.",
      description: "Advanced image processing tools that work directly in your browser. No uploads, no watermarks, no hidden fees.",
      cta: "Start Processing Images",
      compressButton: "Compress Images",
      convertButton: "Convert Images",
      trustedBy: "Trusted by 100,000+ users worldwide",
      stats: {
        sizeReduction: "Up to 90% Size Reduction",
        supportedFormats: "10+ Supported Formats", 
        freeSecure: "100% Free & Secure"
      }
    },
    zh: {
      title: "专业图片压缩与格式转换工具",
      subtitle: "文件大小减少高达90%，同时保持质量。快速、安全、完全免费。",
      description: "先进的图片处理工具，直接在浏览器中运行。无需上传，无水印，无隐藏费用。",
      cta: "开始处理图片",
      compressButton: "压缩图片",
      convertButton: "转换格式",
      trustedBy: "全球10万+用户信赖",
      stats: {
        sizeReduction: "高达90%大小减少",
        supportedFormats: "10+种支持格式",
        freeSecure: "100%免费安全"
      }
    }
  };

  const t = content[locale as keyof typeof content] || content.en;
  
  const stats = [
    {
      value: "90%",
      label: t.stats.sizeReduction,
      color: "bg-blue-50/50",
      icon: "compress",
      description: "Intelligent compression algorithm reduces file sizes while preserving quality"
    },
    {
      value: "10+",
      label: t.stats.supportedFormats,
      color: "bg-green-50/50", 
      icon: "image",
      description: "Support for JPG, PNG, WebP, AVIF, GIF and more formats"
    },
    {
      value: "100%",
      label: t.stats.freeSecure,
      color: "bg-purple-50/50",
      icon: "success",
      description: "Completely free, secure, and privacy-focused image processing"
    }
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center pt-8 pb-20"
    >
      <StandardContainer variant="content" size="lg">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mb-12"
        >
          {/* 图标 */}
          <div className="flex justify-center mb-8">
            <StandardIcon name="image" size="xl" className="text-blue-600" />
          </div>
          
          <h1 className={`heading-2 bg-gradient-to-r ${gradient} bg-clip-text text-transparent mb-8`}>
            {translations?.hero?.title || t.title}
          </h1>
          <p className="text-xl text-slate-700 max-w-4xl mx-auto leading-relaxed mb-8">
            {translations?.hero?.subtitle || t.subtitle}
          </p>
          <p className="text-lg text-slate-600 max-w-5xl mx-auto leading-relaxed">
            {translations?.hero?.description || t.description}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <StandardGrid cols={3} gap="md" className="max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <StandardCard
                key={index}
                variant="elevated"
                size="md"
                hover
                className={`${stat.color} text-center`}
              >
                <div className="flex flex-col items-center">
                  <StandardIcon 
                    name={stat.icon as any} 
                    size="lg" 
                    className="mb-4 text-blue-600" 
                  />
                  <div className="text-3xl font-bold text-slate-800 mb-2">{stat.value}</div>
                  <div className="text-sm text-slate-600 mb-2">{stat.label}</div>
                  <div className="text-xs text-slate-500 text-center leading-relaxed">
                    {stat.description}
                  </div>
                </div>
              </StandardCard>
            ))}
          </StandardGrid>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <StandardButton
            asChild
            variant="primary"
            size="lg"
            leftIcon={<StandardIcon name="compress" size="md" />}
          >
            <Link href="/compress-png">
              {translations?.hero?.compressButton || t.compressButton}
            </Link>
          </StandardButton>
          
          <StandardButton
            asChild
            variant="secondary"
            size="lg"
            leftIcon={<StandardIcon name="convert" size="md" />}
          >
            <Link href="/convert-png-to-jpg">
              {translations?.hero?.convertButton || t.convertButton}
            </Link>
          </StandardButton>
        </motion.div>

        {/* 信任指标 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-slate-500 mb-4">
            {translations?.hero?.trustedBy || t.trustedBy}
          </p>
          <div className="flex justify-center items-center space-x-8 text-xs text-slate-400">
            <div className="flex items-center">
              <StandardIcon name="shield" size="sm" className="mr-1" />
              <span>SSL Secured</span>
            </div>
            <div className="flex items-center">
              <StandardIcon name="lock" size="sm" className="mr-1" />
              <span>Privacy First</span>
            </div>
            <div className="flex items-center">
              <StandardIcon name="zap" size="sm" className="mr-1" />
              <span>Lightning Fast</span>
            </div>
          </div>
        </motion.div>
      </StandardContainer>
    </motion.section>
  );
}
