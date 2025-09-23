'use client';

import { motion } from 'framer-motion';
import StandardContainer from '@/components/ui/StandardContainer';
import StandardCard from '@/components/ui/StandardCard';
import StandardIcon from '@/components/ui/StandardIcon';
import { longTailKeywords, contentTemplates } from '@/lib/content-optimization';

interface SEOContentProps {
  type: 'compressor' | 'converter';
  format?: string;
  useCase?: string;
  translations?: any;
  locale?: string;
}

export default function SEOContent({ 
  type, 
  format, 
  useCase, 
  translations, 
  locale = 'en' 
}: SEOContentProps) {
  const content = {
    en: {
      compressor: {
        title: "Professional Image Compression Tool",
        subtitle: "Reduce file sizes by up to 90% while maintaining quality",
        description: "Our advanced image compression tool uses intelligent algorithms to reduce file sizes without compromising visual quality. Perfect for web optimization, email attachments, and storage savings.",
        benefits: [
          "Up to 90% file size reduction",
          "Zero quality loss compression",
          "Batch processing support",
          "Multiple format support",
          "Privacy-focused processing"
        ],
        useCases: [
          {
            title: "Web Optimization",
            description: "Optimize images for faster website loading and better SEO performance",
            keywords: longTailKeywords.useCases.web
          },
          {
            title: "Social Media",
            description: "Compress images for social media platforms while maintaining quality",
            keywords: longTailKeywords.useCases.social
          },
          {
            title: "Email Attachments",
            description: "Reduce image file sizes for easier email sharing",
            keywords: longTailKeywords.useCases.email
          },
          {
            title: "Mobile Optimization",
            description: "Optimize images for mobile devices and apps",
            keywords: longTailKeywords.useCases.mobile
          }
        ]
      },
      converter: {
        title: "Universal Image Format Converter",
        subtitle: "Convert between JPG, PNG, WebP, AVIF, and GIF formats",
        description: "Convert images between different formats with a single click. Our converter preserves image quality while changing formats for better compatibility and performance.",
        benefits: [
          "Support for all major formats",
          "Quality preservation",
          "Batch conversion",
          "Format optimization",
          "Instant processing"
        ],
        formats: [
          {
            name: "JPG/JPEG",
            description: "Most common format for photos and web images",
            keywords: longTailKeywords.formats.jpg
          },
          {
            name: "PNG",
            description: "Best for images with transparency and graphics",
            keywords: longTailKeywords.formats.png
          },
          {
            name: "WebP",
            description: "Modern format with superior compression",
            keywords: longTailKeywords.formats.webp
          },
          {
            name: "AVIF",
            description: "Next-generation format with advanced compression",
            keywords: longTailKeywords.formats.avif
          }
        ]
      }
    },
    zh: {
      compressor: {
        title: "专业图片压缩工具",
        subtitle: "文件大小减少高达90%，同时保持质量",
        description: "我们的高级图片压缩工具使用智能算法来减少文件大小，而不影响视觉质量。完美适用于网络优化、邮件附件和存储节省。",
        benefits: [
          "高达90%的文件大小减少",
          "零质量损失压缩",
          "批量处理支持",
          "多种格式支持",
          "隐私保护处理"
        ],
        useCases: [
          {
            title: "网络优化",
            description: "优化图片以加快网站加载速度并提升SEO性能",
            keywords: ["网站图片优化", "图片加载速度", "SEO优化", "网络性能"]
          },
          {
            title: "社交媒体",
            description: "为社交媒体平台压缩图片，同时保持质量",
            keywords: ["社交媒体图片", "Instagram优化", "Facebook图片", "社交平台"]
          },
          {
            title: "邮件附件",
            description: "减少图片文件大小，便于邮件分享",
            keywords: ["邮件图片压缩", "附件优化", "邮件分享", "文件大小"]
          },
          {
            title: "移动优化",
            description: "为移动设备和应用优化图片",
            keywords: ["移动图片优化", "手机图片", "应用优化", "移动性能"]
          }
        ]
      },
      converter: {
        title: "通用图片格式转换器",
        subtitle: "在JPG、PNG、WebP、AVIF和GIF格式之间转换",
        description: "一键在不同格式之间转换图片。我们的转换器在改变格式以获得更好兼容性和性能的同时保持图片质量。",
        benefits: [
          "支持所有主要格式",
          "质量保持",
          "批量转换",
          "格式优化",
          "即时处理"
        ],
        formats: [
          {
            name: "JPG/JPEG",
            description: "照片和网络图片最常用的格式",
            keywords: ["JPG转换", "JPEG压缩", "照片格式", "图片转换"]
          },
          {
            name: "PNG",
            description: "最适合有透明度和图形的图片",
            keywords: ["PNG转换", "透明图片", "图形格式", "PNG压缩"]
          },
          {
            name: "WebP",
            description: "具有卓越压缩的现代格式",
            keywords: ["WebP转换", "现代格式", "高级压缩", "WebP优化"]
          },
          {
            name: "AVIF",
            description: "具有高级压缩的下一代格式",
            keywords: ["AVIF转换", "下一代格式", "高级压缩", "AVIF优化"]
          }
        ]
      }
    }
  };

  const t = content[locale as keyof typeof content] || content.en;
  const currentContent = t[type as keyof typeof t];

  if (!currentContent) return null;

  return (
    <section className="py-20">
      <StandardContainer variant="content" size="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-slate-900 mb-6">
            {currentContent.title}
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
            {currentContent.subtitle}
          </p>
          <p className="text-lg text-slate-700 max-w-4xl mx-auto leading-relaxed">
            {currentContent.description}
          </p>
        </motion.div>

        {/* 主要功能特性 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <StandardCard variant="elevated" size="lg" className="p-8">
            <h3 className="text-2xl font-semibold text-slate-900 mb-6 text-center">
              Key Features & Benefits
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentContent.benefits.map((benefit: string, index: number) => (
                <div key={index} className="flex items-start">
                  <StandardIcon name="check" size="md" className="text-green-500 mr-3 flex-shrink-0 mt-1" />
                  <span className="text-slate-700">{benefit}</span>
                </div>
              ))}
            </div>
          </StandardCard>
        </motion.div>

        {/* 使用场景或格式支持 */}
        {type === 'compressor' && 'useCases' in currentContent && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-3xl font-bold text-slate-900 mb-8 text-center">
              Perfect for Every Use Case
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentContent.useCases.map((useCase: any, index: number) => (
                <StandardCard key={index} variant="outlined" size="md" className="p-6">
                  <h4 className="text-xl font-semibold text-slate-900 mb-3">
                    {useCase.title}
                  </h4>
                  <p className="text-slate-600 mb-4">
                    {useCase.description}
                  </p>
                  <div className="text-xs text-slate-400 hidden">
                    {useCase.keywords.join(', ')}
                  </div>
                </StandardCard>
              ))}
            </div>
          </motion.div>
        )}

        {type === 'converter' && 'formats' in currentContent && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-3xl font-bold text-slate-900 mb-8 text-center">
              Supported Image Formats
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentContent.formats.map((format: any, index: number) => (
                <StandardCard key={index} variant="outlined" size="md" className="p-6">
                  <h4 className="text-xl font-semibold text-slate-900 mb-3">
                    {format.name}
                  </h4>
                  <p className="text-slate-600 mb-4">
                    {format.description}
                  </p>
                  <div className="text-xs text-slate-400 hidden">
                    {format.keywords.join(', ')}
                  </div>
                </StandardCard>
              ))}
            </div>
          </motion.div>
        )}

        {/* SEO关键词内容（对搜索引擎可见，对用户隐藏） */}
        <div className="mt-16 text-xs text-slate-300 hidden">
          <h4>Related Keywords:</h4>
          <p>
            {type === 'compressor' 
              ? longTailKeywords.compression.primary.join(', ') + ', ' + longTailKeywords.compression.secondary.join(', ')
              : longTailKeywords.conversion.primary.join(', ') + ', ' + longTailKeywords.conversion.secondary.join(', ')
            }
          </p>
        </div>
      </StandardContainer>
    </section>
  );
}
