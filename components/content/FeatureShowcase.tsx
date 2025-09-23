'use client';

import { motion } from 'framer-motion';
import StandardCard from '@/components/ui/StandardCard';
import StandardIcon from '@/components/ui/StandardIcon';
import StandardContainer from '@/components/ui/StandardContainer';
import StandardGrid from '@/components/ui/StandardGrid';
import { longTailKeywords } from '@/lib/content-optimization';

interface FeatureShowcaseProps {
  translations?: any;
  locale?: string;
}

export default function FeatureShowcase({ translations, locale = 'en' }: FeatureShowcaseProps) {
  const content = {
    en: {
      title: "Why Choose Our Image Processing Tools?",
      subtitle: "Professional-grade features designed for maximum efficiency and quality",
      features: [
        {
          icon: "compress",
          title: "Smart Image Compression",
          description: "Our AI-powered compression algorithm reduces file sizes by up to 90% while preserving visual quality. Perfect for web optimization and storage savings.",
          benefits: [
            "Up to 90% size reduction",
            "Zero quality loss",
            "Batch processing support",
            "Multiple format support"
          ],
          keywords: longTailKeywords.compression.primary.slice(0, 4)
        },
        {
          icon: "convert",
          title: "Universal Format Conversion",
          description: "Convert images between JPG, PNG, WebP, AVIF, and GIF formats with a single click. Preserve image quality while changing formats for better compatibility.",
          benefits: [
            "All major formats supported",
            "Quality preservation",
            "Batch conversion",
            "Format optimization"
          ],
          keywords: longTailKeywords.conversion.primary.slice(0, 4)
        },
        {
          icon: "shield",
          title: "Privacy & Security First",
          description: "All image processing happens directly in your browser. No uploads to our servers, no data collection, complete privacy protection.",
          benefits: [
            "100% browser-based",
            "No data collection",
            "SSL encryption",
            "GDPR compliant"
          ],
          keywords: ["privacy focused", "secure image processing", "browser based", "no uploads"]
        },
        {
          icon: "zap",
          title: "Lightning Fast Processing",
          description: "Process images instantly with our optimized algorithms. No waiting, no queues, immediate results for all your image optimization needs.",
          benefits: [
            "Instant processing",
            "No waiting queues",
            "Optimized algorithms",
            "Real-time preview"
          ],
          keywords: ["fast image processing", "instant compression", "real-time optimization", "no waiting"]
        },
        {
          icon: "layers",
          title: "Batch Processing",
          description: "Process multiple images at once with our batch processing feature. Save time and effort when working with large image collections.",
          benefits: [
            "Multiple file support",
            "Bulk processing",
            "Time saving",
            "Efficient workflow"
          ],
          keywords: longTailKeywords.compression.secondary.slice(0, 4)
        },
        {
          icon: "settings",
          title: "Advanced Customization",
          description: "Fine-tune compression settings, quality levels, and output formats to match your specific requirements and preferences.",
          benefits: [
            "Custom quality settings",
            "Format optimization",
            "Metadata preservation",
            "Advanced controls"
          ],
          keywords: ["custom compression settings", "quality control", "format optimization", "advanced image tools"]
        }
      ]
    },
    zh: {
      title: "为什么选择我们的图片处理工具？",
      subtitle: "专业级功能，专为最大效率和质量而设计",
      features: [
        {
          icon: "compress",
          title: "智能图片压缩",
          description: "我们的AI驱动压缩算法可将文件大小减少高达90%，同时保持视觉质量。完美适用于网络优化和存储节省。",
          benefits: [
            "高达90%的大小减少",
            "零质量损失",
            "批量处理支持",
            "多种格式支持"
          ],
          keywords: ["在线图片压缩", "免费图片压缩", "图片大小减少", "图片优化工具"]
        },
        {
          icon: "convert",
          title: "通用格式转换",
          description: "一键在JPG、PNG、WebP、AVIF和GIF格式之间转换。在改变格式以获得更好兼容性的同时保持图片质量。",
          benefits: [
            "支持所有主要格式",
            "质量保持",
            "批量转换",
            "格式优化"
          ],
          keywords: ["图片格式转换", "JPG转PNG", "PNG转JPG", "在线图片转换"]
        },
        {
          icon: "shield",
          title: "隐私与安全优先",
          description: "所有图片处理都在您的浏览器中直接进行。不上传到我们的服务器，不收集数据，完全隐私保护。",
          benefits: [
            "100%基于浏览器",
            "不收集数据",
            "SSL加密",
            "GDPR合规"
          ],
          keywords: ["隐私保护", "安全图片处理", "浏览器处理", "无上传"]
        },
        {
          icon: "zap",
          title: "闪电般快速处理",
          description: "使用我们优化的算法即时处理图片。无需等待，无需排队，为您的所有图片优化需求提供即时结果。",
          benefits: [
            "即时处理",
            "无等待队列",
            "优化算法",
            "实时预览"
          ],
          keywords: ["快速图片处理", "即时压缩", "实时优化", "无等待"]
        },
        {
          icon: "layers",
          title: "批量处理",
          description: "使用我们的批量处理功能一次处理多张图片。在处理大型图片集合时节省时间和精力。",
          benefits: [
            "多文件支持",
            "批量处理",
            "节省时间",
            "高效工作流"
          ],
          keywords: ["批量图片压缩", "多文件处理", "批量转换", "高效处理"]
        },
        {
          icon: "settings",
          title: "高级自定义",
          description: "微调压缩设置、质量级别和输出格式，以匹配您的特定要求和偏好。",
          benefits: [
            "自定义质量设置",
            "格式优化",
            "元数据保留",
            "高级控制"
          ],
          keywords: ["自定义压缩设置", "质量控制", "格式优化", "高级图片工具"]
        }
      ]
    }
  };

  const t = content[locale as keyof typeof content] || content.en;

  return (
    <section className="py-20 bg-slate-50">
      <StandardContainer variant="content" size="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-slate-900 mb-6">
            {translations?.features?.title || t.title}
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            {translations?.features?.subtitle || t.subtitle}
          </p>
        </motion.div>

        <StandardGrid cols={3} gap="lg">
          {t.features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <StandardCard
                variant="elevated"
                size="lg"
                hover
                className="h-full"
              >
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <StandardIcon name={feature.icon as any} size="xl" className="text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed mb-6">
                    {feature.description}
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-slate-800 mb-3">Key Benefits:</h4>
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-center text-sm text-slate-600">
                        <StandardIcon name="check" size="sm" className="text-green-500 mr-2 flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* SEO关键词展示（仅对搜索引擎可见） */}
                <div className="mt-4 text-xs text-slate-400 hidden">
                  {feature.keywords.join(', ')}
                </div>
              </StandardCard>
            </motion.div>
          ))}
        </StandardGrid>
      </StandardContainer>
    </section>
  );
}
