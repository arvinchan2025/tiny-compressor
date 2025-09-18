export interface Translations {
  // Navigation
  nav: {
    features: string;
    about: string;
    language: string;
  };
  
  // Hero Section
  hero: {
    title: string;
    subtitle: string;
    cta: string;
    trustedBy: string;
  };
  
  // Upload Section
  upload: {
    title: string;
    subtitle: string;
    dragActive: string;
    dragInactive: string;
    dragReject: string;
    supportedFormats: string;
    maxSize: string;
    uploadedFiles: string;
    removeFile: string;
    ready: string;
  };
  
  // Compression Settings
  compression: {
    title: string;
    mode: {
      quick: string;
      custom: string;
    };
    quickMode: {
      title: string;
      description: string;
      compress: string;
      formatNote: string;
    };
    customMode: {
      title: string;
      quality: string;
      maxWidth: string;
      maxHeight: string;
      format: string;
      compress: string;
      compressing: string;
      qualityDescription: {
        low: string;
        medium: string;
        high: string;
      };
      sizeDescription: {
        small: string;
        medium: string;
        large: string;
      };
      formatDescription: {
        jpeg: string;
        png: string;
        webp: string;
      };
    };
  };
  
  // Results
  results: {
    title: string;
    originalSize: string;
    compressedSize: string;
    savings: string;
    download: string;
    downloadAll: string;
    compressMore: string;
    compressionRatio: string;
    spaceSaved: string;
  };
  
  // Features
  features: {
    title: string;
    fast: {
      title: string;
      description: string;
    };
    secure: {
      title: string;
      description: string;
    };
    quality: {
      title: string;
      description: string;
    };
    free: {
      title: string;
      description: string;
    };
  };
  
  // How It Works
  howItWorks: {
    title: string;
    step1: {
      title: string;
      description: string;
    };
    step2: {
      title: string;
      description: string;
    };
    step3: {
      title: string;
      description: string;
    };
  };
  
  // Supported Formats
  formats: {
    title: string;
    jpeg: {
      title: string;
      description: string;
    };
    png: {
      title: string;
      description: string;
    };
    webp: {
      title: string;
      description: string;
    };
    gif: {
      title: string;
      description: string;
    };
  };
  
  // FAQ
  faq: {
    title: string;
    questions: {
      privacy: {
        question: string;
        answer: string;
      };
      fileSize: {
        question: string;
        answer: string;
      };
      compression: {
        question: string;
        answer: string;
      };
      account: {
        question: string;
        answer: string;
      };
      browsers: {
        question: string;
        answer: string;
      };
    };
  };
  
  // Use Cases
  useCases: {
    title: string;
    webDev: {
      title: string;
      description: string;
    };
    mobile: {
      title: string;
      description: string;
    };
    social: {
      title: string;
      description: string;
    };
    email: {
      title: string;
      description: string;
    };
    storage: {
      title: string;
      description: string;
    };
    ecommerce: {
      title: string;
      description: string;
    };
  };
  
  // CTA
  cta: {
    title: string;
    subtitle: string;
    button: string;
  };
  
  // Footer
  footer: {
    description: string;
    quickLinks: string;
    legal: string;
    privacy: string;
    terms: string;
    copyright: string;
  };

  // Perfect For
  perfectFor: {
    title: string;
    webDevelopers: {
      title: string;
      description: string;
    };
    designers: {
      title: string;
      description: string;
    };
    socialMedia: {
      title: string;
      description: string;
    };
    emailAttachments: {
      title: string;
      description: string;
    };
    ecommerce: {
      title: string;
      description: string;
    };
    photoStorage: {
      title: string;
      description: string;
    };
  };
}

export const translations: Record<string, Translations> = {
  en: {
    nav: {
      features: "Features",
      about: "About",
      language: "Language"
    },
    hero: {
      title: "Compress Images Instantly",
      subtitle: "Reduce file sizes without losing quality. Fast, secure, and completely free.",
      cta: "Start Compressing",
      trustedBy: "Trusted by thousands of users worldwide"
    },
    upload: {
      title: "Upload Your Images",
      subtitle: "Drag and drop your images here or click to browse",
      dragActive: "Drop images here",
      dragInactive: "Drag & drop images here",
      dragReject: "Invalid file type",
      supportedFormats: "Supports JPG, PNG, WebP, and more",
      maxSize: "Max file size: 10MB per image",
      uploadedFiles: "Uploaded Files",
      removeFile: "Remove file",
      ready: "Ready"
    },
    compression: {
      title: "Compression Settings",
      mode: {
        quick: "Quick Compress",
        custom: "Custom Settings"
      },
      quickMode: {
        title: "Quick Compress",
        description: "Optimized settings for most images. Perfect balance of quality and file size.",
        compress: "Compress Now",
        formatNote: "Keeps original file format"
      },
      customMode: {
        title: "Custom Settings",
        quality: "Quality",
        maxWidth: "Max Width",
        maxHeight: "Max Height",
        format: "Output Format",
        compress: "Compress Images",
        compressing: "Compressing...",
        qualityDescription: {
          low: "Maximum compression, lowest quality",
          medium: "Balanced compression and quality",
          high: "High quality, minimal compression"
        },
        sizeDescription: {
          small: "Small size (mobile optimized)",
          medium: "Medium size (tablet/desktop)",
          large: "Large size (high resolution)"
        },
        formatDescription: {
          jpeg: "Lossy compression, smaller file size",
          png: "Lossless compression, supports transparency",
          webp: "Modern format with excellent compression"
        }
      }
    },
    results: {
      title: "Compression Results",
      originalSize: "Original Size",
      compressedSize: "Compressed Size",
      savings: "Space Saved",
      download: "Download",
      downloadAll: "Download All as ZIP",
      compressMore: "Compress More Images",
      compressionRatio: "Compression Ratio",
      spaceSaved: "Space Saved"
    },
    features: {
      title: "Why Choose TinyCompressor?",
      fast: {
        title: "Lightning Fast",
        description: "Compress images in seconds with our optimized algorithms"
      },
      secure: {
        title: "100% Secure",
        description: "Your images are processed locally and never stored on our servers"
      },
      quality: {
        title: "High Quality",
        description: "Maintain image quality while reducing file size significantly"
      },
      free: {
        title: "Completely Free",
        description: "No registration required, no hidden costs, no limits"
      }
    },
    howItWorks: {
      title: "How It Works",
      step1: {
        title: "Upload Images",
        description: "Drag and drop your images or click to browse. Supports JPG, PNG, WebP, and more formats."
      },
      step2: {
        title: "Adjust Settings",
        description: "Customize compression quality, dimensions, and output format to meet your needs."
      },
      step3: {
        title: "Download Results",
        description: "Download individual files or get all compressed images in a convenient ZIP file."
      }
    },
    formats: {
      title: "Supported Image Formats",
      jpeg: {
        title: "JPEG/JPG",
        description: "Best for photographs and complex images with many colors"
      },
      png: {
        title: "PNG",
        description: "Perfect for graphics with transparency and sharp edges"
      },
      webp: {
        title: "WebP",
        description: "Modern format with excellent compression and quality"
      },
      gif: {
        title: "GIF/BMP",
        description: "Support for animated GIFs and bitmap images"
      }
    },
    faq: {
      title: "Frequently Asked Questions",
      questions: {
        privacy: {
          question: "Is my data safe and private?",
          answer: "Yes, absolutely! All image processing happens locally in your browser. Your images are never uploaded to our servers, ensuring complete privacy and security."
        },
        fileSize: {
          question: "What's the maximum file size I can compress?",
          answer: "You can compress images up to 10MB each. There's no limit on the number of images you can process in a single session."
        },
        compression: {
          question: "How much can I reduce file sizes?",
          answer: "Compression ratios vary by image type and settings, but typically you can reduce file sizes by 60-90% while maintaining good visual quality."
        },
        account: {
          question: "Do I need to create an account?",
          answer: "No account required! TinyCompressor is completely free to use with no registration, no hidden costs, and no limits."
        },
        browsers: {
          question: "Which browsers are supported?",
          answer: "TinyCompressor works on all modern browsers including Chrome, Firefox, Safari, and Edge. It's also fully optimized for mobile devices."
        }
      }
    },
    useCases: {
      title: "Perfect For",
      webDev: {
        title: "Web Development",
        description: "Optimize images for websites to improve loading speed and user experience"
      },
      mobile: {
        title: "Mobile Apps",
        description: "Reduce app size by compressing images while maintaining quality"
      },
      social: {
        title: "Social Media",
        description: "Prepare images for social platforms with optimal file sizes"
      },
      email: {
        title: "Email Attachments",
        description: "Compress images for email to stay within size limits"
      },
      storage: {
        title: "Photo Storage",
        description: "Save storage space by compressing photo collections"
      },
      ecommerce: {
        title: "E-commerce",
        description: "Optimize product images for online stores and marketplaces"
      }
    },
    cta: {
      title: "Ready to Compress Your Images?",
      subtitle: "Join thousands of users who trust TinyCompressor for their image optimization needs",
      button: "Start Compressing Now"
    },
    footer: {
      description: "TinyCompressor - The best free online image compression tool",
      quickLinks: "Quick Links",
      legal: "Legal",
      privacy: "Privacy Policy",
      terms: "Terms of Service",
      copyright: "© 2024 TinyCompressor. All rights reserved."
    },
    perfectFor: {
      title: "Perfect For",
      webDevelopers: {
        title: "Web Development",
        description: "Optimize images for websites to improve loading speed and user experience."
      },
      designers: {
        title: "Mobile Apps",
        description: "Reduce app size by compressing images while maintaining quality."
      },
      socialMedia: {
        title: "Social Media",
        description: "Prepare images for social platforms with optimal file sizes."
      },
      emailAttachments: {
        title: "Email Attachments",
        description: "Compress images for email to stay within size limits."
      },
      ecommerce: {
        title: "E-commerce",
        description: "Optimize product images for faster online store performance."
      },
      photoStorage: {
        title: "Photo Storage",
        description: "Save storage space by compressing photo collections."
      }
    }
  },
  zh: {
    nav: {
      features: "功能特色",
      about: "关于我们",
      language: "语言"
    },
    hero: {
      title: "即时图片压缩",
      subtitle: "无损压缩图片文件大小，快速、安全、完全免费",
      cta: "开始压缩",
      trustedBy: "全球数千用户信赖"
    },
    upload: {
      title: "上传您的图片",
      subtitle: "拖拽图片到此处或点击浏览",
      dragActive: "释放图片",
      dragInactive: "拖拽图片到此处",
      dragReject: "不支持的文件类型",
      supportedFormats: "支持 JPG、PNG、WebP 等格式",
      maxSize: "单文件最大：10MB",
      uploadedFiles: "已上传文件",
      removeFile: "移除文件",
      ready: "就绪"
    },
    compression: {
      title: "压缩设置",
      mode: {
        quick: "快速压缩",
        custom: "自定义设置"
      },
      quickMode: {
        title: "快速压缩",
        description: "针对大多数图片优化的设置，质量和文件大小的完美平衡。",
        compress: "立即压缩",
        formatNote: "保持原始文件格式"
      },
      customMode: {
        title: "自定义设置",
        quality: "质量",
        maxWidth: "最大宽度",
        maxHeight: "最大高度",
        format: "输出格式",
        compress: "开始压缩",
        compressing: "压缩中...",
        qualityDescription: {
          low: "最大压缩，最低质量",
          medium: "平衡压缩和质量",
          high: "高质量，最小压缩"
        },
        sizeDescription: {
          small: "小尺寸（移动端优化）",
          medium: "中等尺寸（平板/桌面）",
          large: "大尺寸（高分辨率）"
        },
        formatDescription: {
          jpeg: "有损压缩，文件更小",
          png: "无损压缩，支持透明",
          webp: "现代格式，压缩效果极佳"
        }
      }
    },
    results: {
      title: "压缩结果",
      originalSize: "原始大小",
      compressedSize: "压缩后大小",
      savings: "节省空间",
      download: "下载",
      downloadAll: "打包下载ZIP",
      compressMore: "压缩更多图片",
      compressionRatio: "压缩比例",
      spaceSaved: "节省空间"
    },
    features: {
      title: "为什么选择TinyCompressor？",
      fast: {
        title: "极速压缩",
        description: "使用优化算法，秒级完成图片压缩"
      },
      secure: {
        title: "100% 安全",
        description: "图片在本地处理，绝不上传到服务器"
      },
      quality: {
        title: "高质量",
        description: "在显著减小文件大小的同时保持图片质量"
      },
      free: {
        title: "完全免费",
        description: "无需注册，无隐藏费用，无使用限制"
      }
    },
    howItWorks: {
      title: "使用方法",
      step1: {
        title: "上传图片",
        description: "拖拽图片或点击浏览，支持 JPG、PNG、WebP 等多种格式"
      },
      step2: {
        title: "调整设置",
        description: "自定义压缩质量、尺寸和输出格式以满足您的需求"
      },
      step3: {
        title: "下载结果",
        description: "单独下载文件或打包下载所有压缩后的图片"
      }
    },
    formats: {
      title: "支持的图片格式",
      jpeg: {
        title: "JPEG/JPG",
        description: "最适合照片和复杂彩色图像"
      },
      png: {
        title: "PNG",
        description: "完美支持透明背景和锐利边缘"
      },
      webp: {
        title: "WebP",
        description: "现代格式，压缩效果和画质俱佳"
      },
      gif: {
        title: "GIF/BMP",
        description: "支持动画GIF和位图图像"
      }
    },
    faq: {
      title: "常见问题",
      questions: {
        privacy: {
          question: "我的数据安全吗？",
          answer: "绝对安全！所有图片处理都在您的浏览器本地进行，图片绝不会上传到我们的服务器，确保完全的隐私和安全。"
        },
        fileSize: {
          question: "可以压缩多大的文件？",
          answer: "单个图片最大支持10MB。对处理的图片数量没有限制。"
        },
        compression: {
          question: "能减少多少文件大小？",
          answer: "压缩比例因图片类型和设置而异，通常可以在保持良好视觉质量的同时减少60-90%的文件大小。"
        },
        account: {
          question: "需要注册账户吗？",
          answer: "无需注册！TinyCompressor完全免费使用，无需注册，无隐藏费用，无使用限制。"
        },
        browsers: {
          question: "支持哪些浏览器？",
          answer: "TinyCompressor支持所有现代浏览器，包括Chrome、Firefox、Safari和Edge。同时完全优化了移动设备体验。"
        }
      }
    },
    useCases: {
      title: "适用场景",
      webDev: {
        title: "网站开发",
        description: "优化网站图片，提升加载速度和用户体验"
      },
      mobile: {
        title: "移动应用",
        description: "压缩应用图片，减小应用体积同时保持质量"
      },
      social: {
        title: "社交媒体",
        description: "为社交平台准备合适大小的图片"
      },
      email: {
        title: "邮件附件",
        description: "压缩邮件图片，符合大小限制"
      },
      storage: {
        title: "照片存储",
        description: "压缩照片收藏，节省存储空间"
      },
      ecommerce: {
        title: "电商平台",
        description: "优化在线商店和市场的产品图片"
      }
    },
    cta: {
      title: "准备压缩您的图片了吗？",
      subtitle: "加入数千名信赖TinyCompressor进行图片优化的用户",
      button: "立即开始压缩"
    },
    footer: {
      description: "TinyCompressor - 最佳免费在线图片压缩工具",
      quickLinks: "快速链接",
      legal: "法律条款",
      privacy: "隐私政策",
      terms: "服务条款",
      copyright: "© 2024 TinyCompressor. 保留所有权利。"
    },
    perfectFor: {
      title: "完美适用于",
      webDevelopers: {
        title: "Web开发",
        description: "优化网站图片以提升加载速度和用户体验。"
      },
      designers: {
        title: "移动应用",
        description: "通过压缩图片减少应用大小，同时保持质量。"
      },
      socialMedia: {
        title: "社交媒体",
        description: "为社交平台准备具有最佳文件大小的图片。"
      },
      emailAttachments: {
        title: "邮件附件",
        description: "压缩邮件图片以保持在大小限制内。"
      },
      ecommerce: {
        title: "电商",
        description: "优化产品图片以提升在线商店性能。"
      },
      photoStorage: {
        title: "照片存储",
        description: "通过压缩照片集合来节省存储空间。"
      }
    }
  }
};

export const getTranslations = (locale: string): Translations => {
  return translations[locale] || translations.en;
};
