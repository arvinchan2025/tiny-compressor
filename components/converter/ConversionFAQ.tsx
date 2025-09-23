/**
 * 转换常见问题组件
 * 显示转换相关的常见问题和答案
 */

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SupportedLanguage } from '@/types/i18n';

interface ConversionFAQProps {
  locale: SupportedLanguage;
  sourceFormat: string;
  targetFormat: string;
  customFAQs?: Array<{
    question: string;
    answer: string;
  }> | undefined;
  translations: any;
}

export default function ConversionFAQ({
  locale,
  sourceFormat,
  targetFormat,
  customFAQs,
  translations
}: ConversionFAQProps) {
  const isRTL = locale === 'ar';
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  
  // 默认FAQ
  const defaultFAQs = [
    {
      question: translations?.faq?.quality?.question || `Will the image quality be affected when converting from ${sourceFormat.toUpperCase()} to ${targetFormat.toUpperCase()}?`,
      answer: translations?.faq?.quality?.answer || 'Our conversion algorithm is designed to maintain the highest possible quality while optimizing for the target format. The quality loss is minimal and often imperceptible to the human eye.'
    },
    {
      question: translations?.faq?.transparency?.question || 'How is transparency handled during conversion?',
      answer: translations?.faq?.transparency?.answer || 'Transparency support depends on the target format. Some formats like PNG support transparency, while others like JPEG do not. We handle this intelligently based on the target format capabilities.'
    },
    {
      question: translations?.faq?.fileSize?.question || 'Will the file size change after conversion?',
      answer: translations?.faq?.fileSize?.answer || 'File size typically changes during conversion due to different compression algorithms and format characteristics. We optimize the conversion to achieve the best balance between quality and file size.'
    },
    {
      question: translations?.faq?.metadata?.question || 'Is metadata preserved during conversion?',
      answer: translations?.faq?.metadata?.answer || 'Metadata preservation depends on your settings. You can choose to keep or remove EXIF data, GPS information, and other metadata during the conversion process.'
    },
    {
      question: translations?.faq?.batch?.question || 'Can I convert multiple images at once?',
      answer: translations?.faq?.batch?.answer || 'Yes! You can upload and convert up to 20 images simultaneously. All converted images can be downloaded individually or as a single ZIP file.'
    },
    {
      question: translations?.faq?.security?.question || 'Is my data secure during conversion?',
      answer: translations?.faq?.security?.answer || 'Absolutely! All conversion happens locally in your browser. Your images are never uploaded to our servers, ensuring complete privacy and security.'
    }
  ];

  const faqs = customFAQs || defaultFAQs;

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        <div className="text-center mb-12">
          <h2 className="heading-3 text-slate-800 mb-4">
            {translations?.faq?.title || 'Frequently Asked Questions'}
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            {translations?.faq?.subtitle || `Get answers to common questions about ${sourceFormat.toUpperCase()} to ${targetFormat.toUpperCase()} conversion`}
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-neutral-200/50 overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left hover:bg-slate-50/50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-slate-800 pr-4">
                    {faq.question}
                  </h3>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0"
                  >
                    <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </motion.div>
                </div>
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-4">
                      <div className="pt-2 border-t border-slate-200">
                        <p className="text-slate-600 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

      </motion.div>
    </section>
  );
}
