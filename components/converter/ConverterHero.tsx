/**
 * 转换器Hero组件
 * 显示转换器的主要信息和功能特点
 */

'use client';

import { motion } from 'framer-motion';
import { SupportedLanguage } from '@/types/i18n';
import StandardIcon from '@/components/ui/StandardIcon';
import StandardCard from '@/components/ui/StandardCard';
import StandardContainer from '@/components/ui/StandardContainer';
import StandardGrid from '@/components/ui/StandardGrid';

interface ConverterHeroProps {
  locale: SupportedLanguage;
  sourceFormat: string;
  targetFormat: string;
  customTitle?: string | undefined;
  customSubtitle?: string | undefined;
  customDescription?: string | undefined;
  translations: any;
}

export default function ConverterHero({
  locale,
  sourceFormat,
  targetFormat,
  customTitle,
  customSubtitle,
  customDescription,
  translations
}: ConverterHeroProps) {
  const isRTL = locale === 'ar';
  
  // 获取转换相关的翻译
  const conversionKey = `${sourceFormat.toLowerCase()}To${targetFormat.toLowerCase()}`;
  const conversionTranslations = translations?.conversions?.[conversionKey] || {};
  
  const title = customTitle || conversionTranslations.title || `${sourceFormat.toUpperCase()} to ${targetFormat.toUpperCase()} Converter`;
  const subtitle = customSubtitle || conversionTranslations.subtitle || `Convert ${sourceFormat.toUpperCase()} images to ${targetFormat.toUpperCase()} format`;
  const description = customDescription || conversionTranslations.description || `High-quality ${sourceFormat.toUpperCase()} to ${targetFormat.toUpperCase()} conversion with batch processing support.`;

  // 获取格式图标名称
  const getFormatIconName = (format: string) => {
    const icons: { [key: string]: string } = {
      'jpg': 'image',
      'jpeg': 'image', 
      'png': 'image',
      'webp': 'image',
      'avif': 'image',
      'gif': 'image'
    };
    return icons[format.toLowerCase()] || 'image';
  };

  const sourceIconName = getFormatIconName(sourceFormat);
  const targetIconName = getFormatIconName(targetFormat);
  const gradient = "from-blue-600 via-purple-600 to-pink-600";

  const stats = [
    {
      value: "Free",
      label: "No registration required",
      color: "bg-blue-50/50",
      icon: "success"
    },
    {
      value: "Fast",
      label: "Browser-based conversion",
      color: "bg-green-50/50",
      icon: "compress"
    },
    {
      value: "Secure",
      label: "Files stay on your device",
      color: "bg-purple-50/50",
      icon: "success"
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
          {/* 格式转换图标 */}
          <div className="flex items-center justify-center mb-8">
            <StandardIcon name={sourceIconName as any} size="xl" className="text-blue-600 mr-4" />
            <StandardIcon name="convert" size="lg" className="text-gray-400 mx-4" />
            <StandardIcon name={targetIconName as any} size="xl" className="text-green-600" />
          </div>
          
          <h1 className={`heading-2 bg-gradient-to-r ${gradient} bg-clip-text text-transparent mb-8`}>
            {title}
          </h1>
          <p className="text-xl text-slate-700 max-w-4xl mx-auto leading-relaxed mb-8">
            {subtitle}
          </p>
          <p className="text-lg text-slate-600 max-w-5xl mx-auto leading-relaxed">
            {description}
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
                  <div className="text-2xl font-bold text-slate-800 mb-2">{stat.value}</div>
                  <div className="text-sm text-slate-600">{stat.label}</div>
                </div>
              </StandardCard>
            ))}
          </StandardGrid>
        </motion.div>
      </StandardContainer>
    </motion.section>
  );
}
