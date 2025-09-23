/**
 * 格式特定压缩器翻译配置
 * 支持JPEG、PNG、WebP、AVIF、GIF等格式的特定内容
 */

export interface FormatTranslations {
  hero: {
    icon: string;
    title: string;
    subtitle: string;
    description: string;
    gradient: string;
  };
  stats: Array<{
    value: string;
    label: string;
    color: string;
  }>;
  howItWorks: {
    title: string;
    subtitle: string;
    steps: Array<{
      step: string;
      title: string;
      description: string;
      icon: string;
    }>;
  };
  notes: {
    title: string;
    subtitle: string;
    items: Array<{
      icon: string;
      title: string;
      content: string;
      type: 'warning' | 'tip' | 'info';
    }>;
  };
  faq: {
    title: string;
    subtitle: string;
    items: Array<{
      question: string;
      answer: string;
    }>;
  };
}

// JPEG格式翻译
export const jpegTranslations: Record<string, FormatTranslations> = {
  en: {
    hero: {
      icon: "📸",
      title: "JPEG Compressor",
      subtitle: "Perfect for photos with quality control",
      description: "Advanced JPEG compression with progressive loading, color space optimization, and smart quality adjustment for optimal web performance.",
      gradient: "from-blue-600 via-purple-600 to-pink-600"
    },
    stats: [
      { value: "60-80%", label: "Typical size reduction", color: "bg-blue-50/50" },
      { value: "85-95", label: "Optimal quality range", color: "bg-green-50/50" },
      { value: "Progressive", label: "Loading optimization", color: "bg-purple-50/50" }
    ],
    howItWorks: {
      title: "How JPEG Compression Works",
      subtitle: "Our JPEG compressor uses advanced algorithms to reduce file sizes while maintaining visual quality",
      steps: [
        {
          step: "1",
          title: "Upload Images",
          description: "Drag & drop or click to upload your JPEG images. Support up to 20 files at once.",
          icon: "📤"
        },
        {
          step: "2",
          title: "Adjust Settings",
          description: "Choose quality level, enable progressive loading, and configure advanced options.",
          icon: "⚙️"
        },
        {
          step: "3",
          title: "Smart Compression",
          description: "Our algorithm analyzes and compresses images while preserving visual quality.",
          icon: "🧠"
        },
        {
          step: "4",
          title: "Download Results",
          description: "Download compressed images individually or as a ZIP file for batch processing.",
          icon: "⬇️"
        }
      ]
    },
    notes: {
      title: "Important Notes",
      subtitle: "Key information to help you get the best compression results",
      items: [
        {
          icon: "⚠️",
          title: "Lossy Compression",
          content: "JPEG uses lossy compression, meaning some image data is permanently removed. Higher quality settings preserve more detail.",
          type: "warning"
        },
        {
          icon: "🎯",
          title: "Quality vs Size",
          content: "Quality 85-95 is ideal for most uses. Quality below 70 may show visible artifacts. Find your optimal balance.",
          type: "info"
        },
        {
          icon: "📱",
          title: "Progressive Loading",
          content: "Enable progressive loading for better web performance. Images load gradually from low to high quality.",
          type: "tip"
        },
        {
          icon: "🔄",
          title: "Re-compression Warning",
          content: "Re-compressing already compressed JPEGs will further reduce quality. Always work with original images when possible.",
          type: "warning"
        }
      ]
    },
    faq: {
      title: "JPEG Compression FAQ",
      subtitle: "Common questions about JPEG compression and our tool",
      items: [
        {
          question: "What's the best JPEG quality setting?",
          answer: "Quality 85-90 is ideal for most web use, balancing file size and visual quality. Use 95+ for print, 70-80 for social media."
        },
        {
          question: "Should I enable progressive loading?",
          answer: "Yes, for web images. Progressive JPEGs load faster on slow connections and provide better user experience."
        },
        {
          question: "Can I compress already compressed JPEGs?",
          answer: "Yes, but quality will degrade further. For best results, always work with original uncompressed images."
        },
        {
          question: "What's the difference between color spaces?",
          answer: "sRGB is standard for web, Adobe RGB has wider color gamut for print. Auto mode detects the best option."
        },
        {
          question: "How much can I reduce JPEG file sizes?",
          answer: "Typically 60-80% reduction is possible while maintaining good quality. Exact savings depend on image content."
        },
        {
          question: "Should I keep metadata in compressed images?",
          answer: "Remove metadata for smaller files and privacy. Keep it if you need EXIF data like camera settings or location."
        }
      ]
    }
  }
};

// PNG格式翻译
export const pngTranslations: Record<string, FormatTranslations> = {
  en: {
    hero: {
      icon: "🖼️",
      title: "PNG Compressor",
      subtitle: "Lossless compression with transparency support",
      description: "Advanced PNG optimization with lossless compression, transparency preservation, and color palette optimization for perfect image quality.",
      gradient: "from-green-600 via-emerald-600 to-teal-600"
    },
    stats: [
      { value: "10-50%", label: "Size reduction", color: "bg-green-50/50" },
      { value: "Lossless", label: "Quality preservation", color: "bg-blue-50/50" },
      { value: "Transparency", label: "Alpha channel support", color: "bg-purple-50/50" }
    ],
    howItWorks: {
      title: "How PNG Compression Works",
      subtitle: "Our PNG compressor uses lossless algorithms to reduce file sizes while preserving every pixel perfectly",
      steps: [
        {
          step: "1",
          title: "Upload PNG Images",
          description: "Drag & drop or click to upload your PNG images. Support up to 20 files with transparency.",
          icon: "📤"
        },
        {
          step: "2",
          title: "Configure Settings",
          description: "Choose compression level, preserve transparency, and optimize color palette.",
          icon: "⚙️"
        },
        {
          step: "3",
          title: "Lossless Optimization",
          description: "Our algorithm removes redundant data while preserving perfect image quality.",
          icon: "🔍"
        },
        {
          step: "4",
          title: "Download Results",
          description: "Download optimized PNG files with smaller sizes and preserved transparency.",
          icon: "⬇️"
        }
      ]
    },
    notes: {
      title: "Important Notes",
      subtitle: "Key information about PNG compression and optimization",
      items: [
        {
          icon: "✅",
          title: "Lossless Compression",
          content: "PNG compression is lossless, meaning no image data is lost. Quality remains perfect after compression.",
          type: "info"
        },
        {
          icon: "🎨",
          title: "Transparency Support",
          content: "PNG preserves transparency perfectly. Alpha channels are maintained during compression.",
          type: "tip"
        },
        {
          icon: "📊",
          title: "Compression Levels",
          content: "Higher compression levels take longer but produce smaller files. Level 6-8 is usually optimal.",
          type: "info"
        },
        {
          icon: "🎯",
          title: "Best Use Cases",
          content: "PNG is ideal for graphics, logos, screenshots, and images with transparency or sharp edges.",
          type: "tip"
        }
      ]
    },
    faq: {
      title: "PNG Compression FAQ",
      subtitle: "Common questions about PNG compression and optimization",
      items: [
        {
          question: "Is PNG compression really lossless?",
          answer: "Yes! PNG compression is completely lossless. Every pixel remains exactly the same after compression."
        },
        {
          question: "How much can PNG files be compressed?",
          answer: "PNG compression typically achieves 10-50% size reduction depending on image content and complexity."
        },
        {
          question: "Does PNG compression affect transparency?",
          answer: "No, PNG compression preserves transparency perfectly. Alpha channels remain intact."
        },
        {
          question: "What's the best compression level for PNG?",
          answer: "Level 6-8 provides the best balance of compression ratio and processing time for most images."
        },
        {
          question: "When should I use PNG vs JPEG?",
          answer: "Use PNG for graphics, logos, screenshots, and images with transparency. Use JPEG for photographs."
        },
        {
          question: "Can I compress PNG files multiple times?",
          answer: "Yes, since PNG compression is lossless, you can compress the same file multiple times without quality loss."
        }
      ]
    }
  }
};

// 获取格式特定翻译的函数
export function getFormatTranslations(format: string, locale: string = 'en'): FormatTranslations | null {
  const formatMap: Record<string, Record<string, FormatTranslations>> = {
    jpeg: jpegTranslations,
    png: pngTranslations
  };

  return formatMap[format]?.[locale] || null;
}

