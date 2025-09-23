/**
 * 内容优化配置
 * 基于SEO长尾关键词和用户需求的内容策略
 */

// 核心长尾关键词映射
export const longTailKeywords = {
  // 压缩相关
  compression: {
    primary: [
      "online image compression tool",
      "free image size reducer",
      "compress images without losing quality",
      "batch image compression online",
      "reduce image file size free",
      "image optimizer tool",
      "compress photos for web",
      "image compression software online"
    ],
    secondary: [
      "compress jpg files online",
      "reduce png file size",
      "optimize images for website",
      "compress images for email",
      "image compression for social media",
      "bulk image compression tool",
      "compress images for mobile",
      "image size reducer tool"
    ]
  },
  
  // 转换相关
  conversion: {
    primary: [
      "image format converter online",
      "convert jpg to png free",
      "png to jpg converter tool",
      "webp to jpg converter",
      "image format conversion tool",
      "convert images online free",
      "batch image converter",
      "image file converter tool"
    ],
    secondary: [
      "convert heic to jpg online",
      "tiff to jpg converter",
      "bmp to png converter",
      "gif to mp4 converter",
      "convert raw images online",
      "image format changer tool",
      "convert photos to different formats",
      "universal image converter"
    ]
  },
  
  // 特定格式
  formats: {
    jpg: [
      "jpg compression tool",
      "compress jpeg files",
      "jpeg optimizer online",
      "reduce jpg file size",
      "jpg quality optimizer"
    ],
    png: [
      "png compression tool",
      "compress png files",
      "png optimizer online",
      "reduce png file size",
      "png quality optimizer"
    ],
    webp: [
      "webp compression tool",
      "compress webp files",
      "webp optimizer online",
      "convert to webp format",
      "webp quality optimizer"
    ],
    avif: [
      "avif compression tool",
      "compress avif files",
      "avif optimizer online",
      "convert to avif format",
      "avif quality optimizer"
    ]
  },
  
  // 使用场景
  useCases: {
    web: [
      "optimize images for website",
      "compress images for web performance",
      "web image optimization tool",
      "reduce image loading time",
      "website image compressor"
    ],
    social: [
      "compress images for social media",
      "social media image optimizer",
      "instagram image compressor",
      "facebook image optimizer",
      "twitter image compressor"
    ],
    email: [
      "compress images for email",
      "email image optimizer",
      "reduce email attachment size",
      "email image compression tool"
    ],
    mobile: [
      "compress images for mobile",
      "mobile image optimizer",
      "reduce mobile data usage",
      "mobile app image compression"
    ]
  }
};

// 内容模板
export const contentTemplates = {
  // 页面标题模板
  pageTitles: {
    home: "Free Online Image Compression & Converter Tool - TinyCompressor",
    compressor: "Online Image Compressor - Reduce File Size Without Quality Loss",
    converter: "Image Format Converter - Convert JPG, PNG, WebP, AVIF Online",
    specificFormat: (format: string) => `${format.toUpperCase()} Compressor - Free Online ${format.toUpperCase()} Compression Tool`
  },
  
  // 页面描述模板
  pageDescriptions: {
    home: "Professional image compression and format conversion tool. Compress JPG, PNG, WebP, AVIF images up to 90% smaller with zero quality loss. Convert between formats instantly. 100% free, secure, and privacy-focused.",
    compressor: "Compress images online for free. Reduce file sizes by up to 90% while maintaining quality. Support JPG, PNG, WebP, AVIF formats. Fast, secure, and completely private.",
    converter: "Convert images between different formats online. Support JPG, PNG, WebP, AVIF, GIF conversion. Fast, secure, and completely free. No registration required."
  },
  
  // 功能描述模板
  featureDescriptions: {
    compression: {
      title: "Advanced Image Compression",
      description: "Reduce image file sizes by up to 90% while maintaining visual quality. Our intelligent compression algorithm analyzes each image to find the optimal balance between file size and quality.",
      benefits: [
        "Up to 90% file size reduction",
        "Zero quality loss compression",
        "Batch processing support",
        "Multiple format support"
      ]
    },
    conversion: {
      title: "Universal Format Conversion",
      description: "Convert images between JPG, PNG, WebP, AVIF, and GIF formats with a single click. Preserve image quality while changing formats for better compatibility and performance.",
      benefits: [
        "Support for all major formats",
        "Quality preservation",
        "Batch conversion",
        "Format optimization"
      ]
    }
  },
  
  // 用户价值主张
  valuePropositions: {
    primary: "Professional-grade image processing tools that work directly in your browser",
    secondary: "No uploads, no watermarks, no hidden fees - completely free and secure",
    benefits: [
      "Save storage space and bandwidth",
      "Improve website loading speed",
      "Optimize images for different platforms",
      "Maintain image quality while reducing file size"
    ]
  }
};

// 国际化内容映射
export const i18nContent = {
  en: {
    // 英文内容
    hero: {
      title: "Professional Image Compression & Conversion Tool",
      subtitle: "Reduce file sizes by up to 90% while maintaining quality. Fast, secure, and completely free.",
      description: "Advanced image processing tools that work directly in your browser. No uploads, no watermarks, no hidden fees.",
      cta: "Start Processing Images",
      trust: "Trusted by 100,000+ users worldwide"
    },
    features: {
      compression: {
        title: "Smart Image Compression",
        description: "Our AI-powered compression algorithm reduces file sizes by up to 90% while preserving visual quality.",
        benefits: [
          "Up to 90% size reduction",
          "Zero quality loss",
          "Batch processing",
          "Multiple formats"
        ]
      },
      conversion: {
        title: "Universal Format Conversion",
        description: "Convert between JPG, PNG, WebP, AVIF, and GIF formats with a single click.",
        benefits: [
          "All major formats",
          "Quality preservation",
          "Batch conversion",
          "Format optimization"
        ]
      }
    }
  },
  zh: {
    // 中文内容
    hero: {
      title: "专业图片压缩与格式转换工具",
      subtitle: "文件大小减少高达90%，同时保持质量。快速、安全、完全免费。",
      description: "先进的图片处理工具，直接在浏览器中运行。无需上传，无水印，无隐藏费用。",
      cta: "开始处理图片",
      trust: "全球10万+用户信赖"
    },
    features: {
      compression: {
        title: "智能图片压缩",
        description: "我们的AI驱动压缩算法可将文件大小减少高达90%，同时保持视觉质量。",
        benefits: [
          "高达90%的大小减少",
          "零质量损失",
          "批量处理",
          "多种格式"
        ]
      },
      conversion: {
        title: "通用格式转换",
        description: "一键在JPG、PNG、WebP、AVIF和GIF格式之间转换。",
        benefits: [
          "所有主要格式",
          "质量保持",
          "批量转换",
          "格式优化"
        ]
      }
    }
  }
};

// SEO优化配置
export const seoConfig = {
  // 元标签优化
  metaTags: {
    home: {
      title: "Free Online Image Compression & Converter Tool - TinyCompressor",
      description: "Professional image compression and format conversion tool. Compress JPG, PNG, WebP, AVIF images up to 90% smaller with zero quality loss. Convert between formats instantly. 100% free, secure, and privacy-focused.",
      keywords: "image compression, image converter, compress images, reduce file size, JPG compression, PNG compression, WebP compression, AVIF compression, online image optimizer, photo compression, batch compression, privacy, secure, free image tools, web optimization"
    },
    compressor: {
      title: "Online Image Compressor - Reduce File Size Without Quality Loss",
      description: "Compress images online for free. Reduce file sizes by up to 90% while maintaining quality. Support JPG, PNG, WebP, AVIF formats. Fast, secure, and completely private.",
      keywords: "image compression, compress images, reduce file size, JPG compression, PNG compression, WebP compression, AVIF compression, online image optimizer, photo compression, batch compression"
    },
    converter: {
      title: "Image Format Converter - Convert JPG, PNG, WebP, AVIF Online",
      description: "Convert images between different formats online. Support JPG, PNG, WebP, AVIF, GIF conversion. Fast, secure, and completely free. No registration required.",
      keywords: "image converter, convert images, JPG to PNG, PNG to JPG, WebP converter, AVIF converter, image format conversion, online image converter, batch image converter"
    }
  },
  
  // 结构化数据
  structuredData: {
    organization: {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "TinyCompressor",
      "description": "Free online image compression and format conversion tool",
      "url": "https://tinycompressor.com",
      "logo": "https://tinycompressor.com/logo.png",
      "sameAs": [
        "https://twitter.com/tinycompressor",
        "https://github.com/tinycompressor"
      ]
    },
    webApplication: {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "TinyCompressor",
      "description": "Free online image compression and format conversion tool",
      "url": "https://tinycompressor.com",
      "applicationCategory": "MultimediaApplication",
      "operatingSystem": "Any",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    }
  }
};

// 内容质量检查
export const contentQualityChecks = {
  // 检查内容长度
  checkLength: (content: string, minLength: number = 100, maxLength: number = 2000) => {
    return content.length >= minLength && content.length <= maxLength;
  },
  
  // 检查关键词密度
  checkKeywordDensity: (content: string, keyword: string, maxDensity: number = 0.03) => {
    const words = content.toLowerCase().split(/\s+/);
    const keywordCount = words.filter(word => word.includes(keyword.toLowerCase())).length;
    const density = keywordCount / words.length;
    return density <= maxDensity;
  },
  
  // 检查可读性
  checkReadability: (content: string) => {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = content.split(/\s+/).filter(w => w.length > 0);
    const avgWordsPerSentence = words.length / sentences.length;
    return avgWordsPerSentence <= 20; // 简单可读性检查
  }
};
