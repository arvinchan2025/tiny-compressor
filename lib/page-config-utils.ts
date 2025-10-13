import { NoteItem, FAQItem, HeroContent } from '@/types/page-layout';

/**
 * 创建Hero内容
 */
export function createHeroContent(translations: any, keyPrefix: string): HeroContent {
  const data = translations?.[keyPrefix];
  return {
    title: data?.title || '',
    subtitle: data?.subtitle || '',
    description: data?.description || ''
  };
}

/**
 * 创建Notes内容
 */
export function createNotes(translations: any, keyPrefix: string): NoteItem[] {
  const data = translations?.[keyPrefix];
  if (!data?.notes) return [];

  return [
    {
      icon: '✅',
      title: data.notes.lossless?.title || 'Lossless Compression',
      content: data.notes.lossless?.content || 'PNG compression is lossless, meaning no image quality is lost during compression.',
      type: 'success' as const
    },
    {
      icon: '🔍',
      title: data.notes.transparency?.title || 'Transparency Support',
      content: data.notes.transparency?.content || 'PNG supports full alpha channel transparency, making it perfect for graphics with transparent backgrounds.',
      type: 'info' as const
    },
    {
      icon: '⚙️',
      title: data.notes.optimization?.title || 'Optimization Techniques',
      content: data.notes.optimization?.content || 'Our PNG optimizer uses advanced techniques like palette optimization and compression algorithms.',
      type: 'info' as const
    },
    {
      icon: '🔄',
      title: data.notes.recompression?.title || 'Recompression Benefits',
      content: data.notes.recompression?.content || 'Unlike JPEG, PNG images can be recompressed multiple times without quality loss.',
      type: 'success' as const
    }
  ];
}

/**
 * 创建FAQ内容
 */
export function createFAQs(translations: any, keyPrefix: string): FAQItem[] {
  const data = translations?.[keyPrefix];
  if (!data?.faq) return [];

  const faqs: FAQItem[] = [];
  
  // 从结构化的键名中提取FAQ
  for (let i = 1; i <= 20; i++) {
    const item = data.faq[`item${i}`];
    
    if (item?.question && item?.answer) {
      faqs.push({
        question: item.question,
        answer: item.answer
      });
    }
  }
  
  return faqs;
}

/**
 * 创建技术原理内容
 */
export function createTechnicalPrinciples(translations: any, keyPrefix: string) {
  const data = translations?.[keyPrefix]?.technicalPrinciples;
  if (!data) return null;

  return {
    title: data.title,
    subtitle: data.subtitle,
    deflateAlgorithm: {
      title: data.deflateAlgorithm?.title,
      content: data.deflateAlgorithm?.content,
      benefits: [
        data.deflateAlgorithm?.benefit1,
        data.deflateAlgorithm?.benefit2,
        data.deflateAlgorithm?.benefit3
      ].filter(Boolean)
    },
    adaptiveOptimization: {
      title: data.adaptiveOptimization?.title,
      content: data.adaptiveOptimization?.content,
      benefits: [
        data.adaptiveOptimization?.benefit1,
        data.adaptiveOptimization?.benefit2,
        data.adaptiveOptimization?.benefit3
      ].filter(Boolean)
    }
  };
}

/**
 * 创建应用场景内容
 */
export function createUseCases(translations: any, keyPrefix: string) {
  const data = translations?.[keyPrefix]?.useCases;
  if (!data) return null;

  return {
    title: data.title,
    subtitle: data.subtitle,
    webDevelopment: {
      title: data.webDevelopment?.title,
      content: data.webDevelopment?.content,
      examples: [
        data.webDevelopment?.example1,
        data.webDevelopment?.example2,
        data.webDevelopment?.example3
      ].filter(Boolean)
    },
    digitalMarketing: {
      title: data.digitalMarketing?.title,
      content: data.digitalMarketing?.content,
      examples: [
        data.digitalMarketing?.example1,
        data.digitalMarketing?.example2,
        data.digitalMarketing?.example3
      ].filter(Boolean)
    }
  };
}

/**
 * 创建性能对比内容
 */
export function createPerformanceComparison(translations: any, keyPrefix: string) {
  const data = translations?.[keyPrefix]?.performanceComparison;
  if (!data) return null;

  return {
    title: data.title,
    subtitle: data.subtitle,
    compressionEfficiency: {
      title: data.compressionEfficiency?.title,
      content: data.compressionEfficiency?.content,
      statistics: {
        logoGraphics: data.compressionEfficiency?.logoGraphics,
        uiElements: data.compressionEfficiency?.uiElements,
        screenshots: data.compressionEfficiency?.screenshots
      }
    },
    speedOptimization: {
      title: data.speedOptimization?.title,
      content: data.speedOptimization?.content,
      benefits: [
        data.speedOptimization?.benefit1,
        data.speedOptimization?.benefit2,
        data.speedOptimization?.benefit3
      ].filter(Boolean)
    }
  };
}

/**
 * 创建最佳实践内容
 */
export function createBestPractices(translations: any, keyPrefix: string) {
  const data = translations?.[keyPrefix]?.bestPractices;
  if (!data) return null;

  return {
    title: data.title,
    subtitle: data.subtitle,
    imagePreparation: {
      title: data.imagePreparation?.title,
      content: data.imagePreparation?.content,
      tips: [
        data.imagePreparation?.tip1,
        data.imagePreparation?.tip2,
        data.imagePreparation?.tip3
      ].filter(Boolean)
    },
    compressionSettings: {
      title: data.compressionSettings?.title,
      content: data.compressionSettings?.content,
      tips: [
        data.compressionSettings?.tip1,
        data.compressionSettings?.tip2,
        data.compressionSettings?.tip3
      ].filter(Boolean)
    }
  };
}
