'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StandardContainer from '@/components/ui/StandardContainer';
import StandardCard from '@/components/ui/StandardCard';
import StandardIcon from '@/components/ui/StandardIcon';
import { longTailKeywords } from '@/lib/content-optimization';

interface FAQSectionProps {
  translations?: any;
  locale?: string;
}

export default function FAQSection({ translations, locale = 'en' }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const content = {
    en: {
      title: "Frequently Asked Questions",
      subtitle: "Everything you need to know about our image processing tools",
      faqs: [
        {
          question: "How much can I reduce image file sizes?",
          answer: "Our compression tool can reduce image file sizes by up to 90% while maintaining visual quality. The actual reduction depends on the original image format, quality settings, and content complexity. Most images see a 50-80% reduction in file size.",
          keywords: ["image file size reduction", "compress images", "reduce file size", "image optimization"]
        },
        {
          question: "Is my image data secure and private?",
          answer: "Yes, absolutely. All image processing happens directly in your browser using client-side JavaScript. We never upload your images to our servers, so your data remains completely private and secure. No registration or personal information required.",
          keywords: ["secure image processing", "privacy focused", "browser based", "no data collection"]
        },
        {
          question: "What image formats are supported?",
          answer: "We support all major image formats including JPG, JPEG, PNG, WebP, AVIF, GIF, BMP, and TIFF. You can compress images in their original format or convert between different formats as needed.",
          keywords: ["supported image formats", "JPG PNG WebP", "image format support", "convert images"]
        },
        {
          question: "Can I process multiple images at once?",
          answer: "Yes, our batch processing feature allows you to upload and process multiple images simultaneously. This is perfect for optimizing entire photo collections or preparing images for web use.",
          keywords: ["batch image processing", "multiple images", "bulk compression", "batch conversion"]
        },
        {
          question: "How does the compression affect image quality?",
          answer: "Our intelligent compression algorithm is designed to minimize quality loss while maximizing file size reduction. In most cases, the quality difference is imperceptible to the human eye, even with significant file size reductions.",
          keywords: ["image quality", "compression quality", "quality loss", "visual quality"]
        },
        {
          question: "Is there a file size limit?",
          answer: "Yes, we have a 10MB limit per image file to ensure fast processing and optimal performance. For larger files, we recommend using desktop image editing software or splitting the image into smaller parts.",
          keywords: ["file size limit", "maximum file size", "image size limit", "10MB limit"]
        },
        {
          question: "Can I use this tool for commercial purposes?",
          answer: "Yes, our tool is completely free for both personal and commercial use. There are no hidden fees, watermarks, or usage restrictions. Perfect for businesses, developers, and content creators.",
          keywords: ["commercial use", "free image tools", "business use", "no watermarks"]
        },
        {
          question: "How fast is the image processing?",
          answer: "Processing is typically instant for most images, taking only a few seconds. The speed depends on image size and complexity, but our optimized algorithms ensure the fastest possible processing.",
          keywords: ["fast image processing", "instant compression", "quick processing", "speed optimization"]
        }
      ]
    },
    zh: {
      title: "常见问题解答",
      subtitle: "关于我们的图片处理工具，您需要了解的一切",
      faqs: [
        {
          question: "我可以将图片文件大小减少多少？",
          answer: "我们的压缩工具可以将图片文件大小减少高达90%，同时保持视觉质量。实际减少量取决于原始图片格式、质量设置和内容复杂性。大多数图片的文件大小可以减少50-80%。",
          keywords: ["图片文件大小减少", "压缩图片", "减少文件大小", "图片优化"]
        },
        {
          question: "我的图片数据安全私密吗？",
          answer: "是的，绝对安全。所有图片处理都在您的浏览器中直接使用客户端JavaScript进行。我们从不将您的图片上传到我们的服务器，因此您的数据保持完全私密和安全。无需注册或提供个人信息。",
          keywords: ["安全图片处理", "隐私保护", "基于浏览器", "不收集数据"]
        },
        {
          question: "支持哪些图片格式？",
          answer: "我们支持所有主要图片格式，包括JPG、JPEG、PNG、WebP、AVIF、GIF、BMP和TIFF。您可以保持原始格式压缩图片，或根据需要在不同格式之间转换。",
          keywords: ["支持的图片格式", "JPG PNG WebP", "图片格式支持", "转换图片"]
        },
        {
          question: "我可以一次处理多张图片吗？",
          answer: "是的，我们的批量处理功能允许您同时上传和处理多张图片。这对于优化整个照片集合或为网络使用准备图片非常完美。",
          keywords: ["批量图片处理", "多张图片", "批量压缩", "批量转换"]
        },
        {
          question: "压缩如何影响图片质量？",
          answer: "我们的智能压缩算法旨在最小化质量损失，同时最大化文件大小减少。在大多数情况下，即使文件大小显著减少，质量差异对人眼来说也是不可察觉的。",
          keywords: ["图片质量", "压缩质量", "质量损失", "视觉质量"]
        },
        {
          question: "有文件大小限制吗？",
          answer: "是的，我们每个图片文件有10MB的限制，以确保快速处理和最佳性能。对于更大的文件，我们建议使用桌面图片编辑软件或将图片分割成较小的部分。",
          keywords: ["文件大小限制", "最大文件大小", "图片大小限制", "10MB限制"]
        },
        {
          question: "我可以将此工具用于商业目的吗？",
          answer: "是的，我们的工具对个人和商业用途完全免费。没有隐藏费用、水印或使用限制。非常适合企业、开发者和内容创作者。",
          keywords: ["商业用途", "免费图片工具", "商业使用", "无水印"]
        },
        {
          question: "图片处理有多快？",
          answer: "对于大多数图片，处理通常是即时的，只需要几秒钟。速度取决于图片大小和复杂性，但我们的优化算法确保最快的处理速度。",
          keywords: ["快速图片处理", "即时压缩", "快速处理", "速度优化"]
        }
      ]
    }
  };

  const t = content[locale as keyof typeof content] || content.en;

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

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
            {translations?.faq?.title || t.title}
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            {translations?.faq?.subtitle || t.subtitle}
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto space-y-4">
          {t.faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <StandardCard
                variant="outlined"
                size="md"
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => toggleFAQ(index)}
              >
                <div className="flex items-center justify-between p-6">
                  <h3 className="text-lg font-semibold text-slate-900 pr-4">
                    {faq.question}
                  </h3>
                  <StandardIcon
                    name={openIndex === index ? "chevron-up" : "chevron-down"}
                    size="md"
                    className="text-slate-500 flex-shrink-0"
                  />
                </div>
                
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6">
                        <p className="text-slate-700 leading-relaxed mb-4">
                          {faq.answer}
                        </p>
                        {/* SEO关键词（对搜索引擎可见，对用户隐藏） */}
                        <div className="text-xs text-slate-300 hidden">
                          Keywords: {faq.keywords.join(', ')}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </StandardCard>
            </motion.div>
          ))}
        </div>

        {/* 全局SEO关键词（对搜索引擎可见，对用户隐藏） */}
        <div className="mt-16 text-xs text-slate-200 hidden">
          <h4>Related Search Terms:</h4>
          <p>
            {longTailKeywords.compression.primary.join(', ') + ', ' +
             longTailKeywords.conversion.primary.join(', ') + ', ' +
             longTailKeywords.compression.secondary.join(', ') + ', ' +
             longTailKeywords.conversion.secondary.join(', ')}
          </p>
        </div>
      </StandardContainer>
    </section>
  );
}
