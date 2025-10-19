'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '@/hooks/useTranslation';
import StandardContainer from '@/components/ui/StandardContainer';

interface FAQSectionProps {
  locale: string;
}

export default function FAQSection({ locale }: FAQSectionProps) {
  const { t } = useTranslation('common/navigation' as any, locale as any);

  // 安全的翻译获取函数
  const getTranslationArray = (key: string, fallback: any[] = []): any[] => {
    const result = t(key, { returnObjects: true });
    return Array.isArray(result) ? result : fallback;
  };

  const faqs = getTranslationArray('compressorNavigation.faq', [
    {
      question: 'Is file compression safe?',
      answer: 'Yes, our compression is completely safe. All processing happens locally in your browser using client-side technologies. Your files never leave your device, ensuring maximum privacy and security.'
    },
    {
      question: 'Will compression reduce file quality?',
      answer: 'Our smart compression algorithms are designed to maintain visual quality while reducing file size. You can choose from different quality levels to balance size reduction with quality preservation.'
    },
    {
      question: 'What file formats do you support?',
      answer: 'We support all major formats including PNG, JPEG, WebP, AVIF, GIF, BMP for images; PDF for documents; and MP4, MOV, AVI for videos. More formats are added regularly.'
    },
    {
      question: 'How much can file sizes be reduced?',
      answer: 'Compression ratios vary by file type and content. Images can typically be reduced by 60-90%, PDFs by 30-70%, and videos by 40-80% depending on the original quality and settings used.'
    },
    {
      question: 'Are there any file size limits?',
      answer: 'Our browser-based compression works best with files under 100MB for optimal performance. Larger files may take longer to process but are still supported.'
    },
    {
      question: 'Can I compress multiple files at once?',
      answer: 'Currently, we focus on single-file compression for the best quality results. Batch compression features are planned for future updates.'
    }
  ]);

  return (
    <section className="py-24 bg-white dark:bg-slate-900">
      <StandardContainer variant="content" size="xl" center>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            {t('compressorNavigation.sections.faq.title')}
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            {t('compressorNavigation.sections.faq.subtitle')}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {faqs.map((faq: any, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                {faq.question}
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {faq.answer}
              </p>
            </motion.div>
          ))}
        </div>
      </StandardContainer>
    </section>
  );
}



