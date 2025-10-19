// SEO optimization utilities for TinyCompressor

export interface SEOContent {
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl: string;
  structuredData?: any;
}

// Generate SEO content for different page types
export const generateSEOContent = (
  pageType: 'home' | 'compressor' | 'converter' | 'video',
  format?: string,
  locale: string = 'en'
): SEOContent => {
  const baseUrl = 'https://tinycompressor.com';
  const localePrefix = locale === 'en' ? '' : `/${locale}`;
  
  switch (pageType) {
    case 'home':
      return {
        title: locale === 'en' 
          ? 'TinyCompressor - Free Online Image Compression & Format Conversion Tools'
          : `TinyCompressor - ${locale === 'zh' ? '免费在线图片压缩和格式转换工具' : 'Free Online Image Tools'}`,
        description: locale === 'en'
          ? 'Free online image compression and format conversion tools. Reduce file sizes by up to 90% while maintaining quality. Support PNG, JPEG, WebP, AVIF, GIF, BMP formats. No registration required.'
          : `Free online image compression and format conversion tools. Reduce file sizes by up to 90% while maintaining quality. No registration required.`,
        keywords: locale === 'en' ? [
          'image compression',
          'compress images', 
          'reduce file size',
          'online image optimizer',
          'PNG compressor',
          'JPEG compressor',
          'WebP converter',
          'image format converter',
          'free image tools',
          'lossless compression',
          'image optimizer'
        ] : ['image compression', 'compress images', 'reduce file size', 'online image optimizer'],
        canonicalUrl: `${baseUrl}${localePrefix}`,
        structuredData: {
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "TinyCompressor",
          "applicationCategory": "MultimediaApplication",
          "operatingSystem": "Web Browser",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          }
        }
      };

    case 'compressor':
      const formatUpper = format?.toUpperCase() || 'IMAGE';
      return {
        title: locale === 'en'
          ? `${formatUpper} Compressor - Free Online ${formatUpper} Image Compression Tool`
          : `${formatUpper} ${locale === 'zh' ? '压缩器' : 'Compressor'}`,
        description: locale === 'en'
          ? `Free online ${formatUpper} compression tool. Reduce ${formatUpper} file sizes by up to 90% while maintaining quality. No registration required.`
          : `Free online ${formatUpper} compression tool. Reduce file sizes by up to 90% while maintaining quality.`,
        keywords: [
          `${formatUpper.toLowerCase()} compression`,
          `compress ${formatUpper.toLowerCase()}`,
          `${formatUpper.toLowerCase()} optimizer`,
          `${formatUpper.toLowerCase()} compressor`,
          'reduce file size',
          'image compression'
        ],
        canonicalUrl: `${baseUrl}${localePrefix}/compressor/compress-${format?.toLowerCase() || 'image'}`,
        structuredData: {
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": `${formatUpper} Compressor`,
          "applicationCategory": "UtilityApplication",
          "operatingSystem": "Web Browser",
          "offers": {
            "@type": "Offer", 
            "price": "0",
            "priceCurrency": "USD"
          }
        }
      };

    case 'converter':
      const converterFormat = format?.toUpperCase() || 'IMAGE';
      return {
        title: locale === 'en'
          ? `${converterFormat} Converter - Free Online Image Format Conversion Tool`
          : `${converterFormat} ${locale === 'zh' ? '转换器' : 'Converter'}`,
        description: locale === 'en'
          ? `Free online ${converterFormat} converter. Convert between different image formats with high quality. No registration required.`
          : `Free online ${converterFormat} converter. Convert between different image formats with high quality.`,
        keywords: [
          `${converterFormat.toLowerCase()} converter`,
          `convert ${converterFormat.toLowerCase()}`,
          'image format conversion',
          'format converter',
          'image converter'
        ],
        canonicalUrl: `${baseUrl}${localePrefix}/converter/convert-${format?.toLowerCase() || 'image'}`,
        structuredData: {
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": `${converterFormat} Converter`,
          "applicationCategory": "UtilityApplication",
          "operatingSystem": "Web Browser",
          "offers": {
            "@type": "Offer",
            "price": "0", 
            "priceCurrency": "USD"
          }
        }
      };

    case 'video':
      return {
        title: locale === 'en'
          ? 'Video Compressor - Free Online Video Compression Tool'
          : `Video ${locale === 'zh' ? '压缩器' : 'Compressor'}`,
        description: locale === 'en'
          ? 'Free online video compression tool. Reduce video file sizes while maintaining quality. Support MP4, AVI, MOV formats. No registration required.'
          : 'Free online video compression tool. Reduce video file sizes while maintaining quality.',
        keywords: [
          'video compression',
          'compress video',
          'video optimizer',
          'reduce video size',
          'video compressor',
          'MP4 compressor',
          'video format conversion'
        ],
        canonicalUrl: `${baseUrl}${localePrefix}/video-compressor`,
        structuredData: {
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "Video Compressor",
          "applicationCategory": "MultimediaApplication",
          "operatingSystem": "Web Browser",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          }
        }
      };

    default:
      return {
        title: 'TinyCompressor - Free Online Image Tools',
        description: 'Free online image compression and format conversion tools.',
        keywords: ['image compression', 'image tools'],
        canonicalUrl: `${baseUrl}${localePrefix}`
      };
  }
};

// Generate breadcrumb structured data
export const generateBreadcrumbData = (breadcrumbs: Array<{name: string, url: string}>) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": crumb.url
    }))
  };
};

// Generate FAQ structured data
export const generateFAQData = (faqs: Array<{question: string, answer: string}>) => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
};

// SEO-friendly URL generation
export const generateSEOUrl = (path: string, locale: string = 'en'): string => {
  const baseUrl = 'https://tinycompressor.com';
  const localePrefix = locale === 'en' ? '' : `/${locale}`;
  return `${baseUrl}${localePrefix}${path}`;
};

// Generate meta robots content
export const generateRobotsMeta = (index: boolean = true, follow: boolean = true): string => {
  return `${index ? 'index' : 'noindex'}, ${follow ? 'follow' : 'nofollow'}`;
};

// Generate hreflang tags for multilingual SEO
export const generateHreflangTags = (supportedLocales: string[], currentPath: string) => {
  const baseUrl = 'https://tinycompressor.com';
  
  return supportedLocales.map(locale => ({
    rel: 'alternate',
    hreflang: locale,
    href: `${baseUrl}/${locale === 'en' ? '' : locale}${currentPath}`
  }));
};

// Content optimization helpers
export const optimizeContentForSEO = {
  // Add keywords naturally to content
  injectKeywords: (content: string, keywords: string[]): string => {
    let optimizedContent = content;
    keywords.forEach(keyword => {
      // Add keyword if not already present (avoid keyword stuffing)
      if (!optimizedContent.toLowerCase().includes(keyword.toLowerCase())) {
        optimizedContent += ` ${keyword}`;
      }
    });
    return optimizedContent;
  },

  // Generate alt text for images
  generateAltText: (imageName: string, context: string): string => {
    return `${imageName} - ${context} | TinyCompressor`;
  },

  // Generate title tags with proper length
  generateTitle: (baseTitle: string, maxLength: number = 60): string => {
    if (baseTitle.length <= maxLength) return baseTitle;
    return baseTitle.substring(0, maxLength - 3) + '...';
  },

  // Generate meta descriptions with proper length
  generateDescription: (baseDescription: string, maxLength: number = 160): string => {
    if (baseDescription.length <= maxLength) return baseDescription;
    return baseDescription.substring(0, maxLength - 3) + '...';
  }
};



