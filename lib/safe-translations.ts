/**
 * 安全的翻译访问工具
 * 提供类型安全的翻译访问，避免undefined错误
 */

import { Translations } from './i18n';

/**
 * 安全的翻译访问函数
 * 如果路径不存在，返回默认值
 */
export function getSafeTranslation(
  translations: Translations | null,
  path: string,
  defaultValue: string = ''
): string {
  if (!translations) return defaultValue;
  
  const keys = path.split('.');
  let current: unknown = translations;
  
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return defaultValue;
    }
  }
  
  return typeof current === 'string' ? current : defaultValue;
}

/**
 * 获取嵌套对象的安全访问
 */
export function getSafeNestedTranslation(
  translations: Translations | null,
  path: string,
  defaultValue: Record<string, unknown> = {}
): Record<string, unknown> {
  if (!translations) return defaultValue;
  
  const keys = path.split('.');
  let current: unknown = translations;
  
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return defaultValue;
    }
  }
  
  return (current as Record<string, unknown>) || defaultValue;
}

/**
 * 预定义的常用翻译路径
 */
export const TRANSLATION_PATHS = {
  // Hero section
  heroTitle: 'hero.title',
  heroSubtitle: 'hero.subtitle',
  heroCta: 'hero.cta',
  heroTrustedBy: 'hero.trustedBy',
  
  // How it works
  howItWorksTitle: 'howItWorks.title',
  howItWorksStep1Title: 'howItWorks.step1.title',
  howItWorksStep1Description: 'howItWorks.step1.description',
  howItWorksStep2Title: 'howItWorks.step2.title',
  howItWorksStep2Description: 'howItWorks.step2.description',
  howItWorksStep3Title: 'howItWorks.step3.title',
  howItWorksStep3Description: 'howItWorks.step3.description',
  
  // Features
  featuresTitle: 'features.title',
  featuresSubtitle: 'features.subtitle',
  featuresFastTitle: 'features.fast.title',
  featuresFastDescription: 'features.fast.description',
  featuresSecureTitle: 'features.secure.title',
  featuresSecureDescription: 'features.secure.description',
  featuresQualityTitle: 'features.quality.title',
  featuresQualityDescription: 'features.quality.description',
  featuresFreeTitle: 'features.free.title',
  featuresFreeDescription: 'features.free.description',
  
  // Upload
  uploadTitle: 'upload.title',
  uploadSubtitle: 'upload.subtitle',
  uploadDragDrop: 'upload.dragDrop',
  uploadClickToUpload: 'upload.clickToUpload',
  uploadSupportedFormats: 'upload.supportedFormats',
  uploadMaxSize: 'upload.maxSize',
  uploadUploadedFiles: 'upload.uploadedFiles',
  
  // Compression
  compressionTitle: 'compression.title',
  compressionModeQuick: 'compression.mode.quick',
  compressionModeCustom: 'compression.mode.custom',
  compressionQuickTitle: 'compression.quickMode.title',
  compressionQuickDescription: 'compression.quickMode.description',
  compressionCustomTitle: 'compression.customMode.title',
  compressionCustomDescription: 'compression.customMode.description',
  
  // Results
  resultsTitle: 'results.title',
  resultsBefore: 'results.before',
  resultsAfter: 'results.after',
  resultsReduction: 'results.reduction',
  resultsOriginalSize: 'results.originalSize',
  resultsCompressedSize: 'results.compressedSize',
  resultsSpaceSaved: 'results.spaceSaved',
  resultsDownload: 'results.download',
  resultsDownloadAll: 'results.downloadAll',
  resultsCompressMore: 'results.compressMore',
  resultsNoResults: 'results.noResults',
  
  // FAQ
  faqTitle: 'faq.title',
  faqSubtitle: 'faq.subtitle',
  
  // Footer
  footerQuickLinks: 'footer.quickLinks',
  footerLegal: 'footer.legal',
  footerPrivacy: 'footer.links.privacy',
  footerTerms: 'footer.links.terms',
  footerCopyright: 'footer.copyright',
  
  // Navigation
  navFeatures: 'nav.features',
  navAbout: 'nav.about',
  navLanguage: 'nav.language',
  navHome: 'nav.home',
  navPrivacy: 'nav.privacy',
  navTerms: 'nav.terms'
} as const;

/**
 * 创建翻译访问器对象
 * 提供类型安全的翻译访问
 */
export function createTranslationAccessor(translations: Translations | null) {
  return {
    // Hero
    hero: {
      title: getSafeTranslation(translations, TRANSLATION_PATHS.heroTitle, 'Compress Images Instantly'),
      subtitle: getSafeTranslation(translations, TRANSLATION_PATHS.heroSubtitle, 'Reduce file sizes without losing quality'),
      cta: getSafeTranslation(translations, TRANSLATION_PATHS.heroCta, 'Start Compressing'),
      trustedBy: getSafeTranslation(translations, TRANSLATION_PATHS.heroTrustedBy, 'Trusted by thousands of users worldwide')
    },
    
    // How it works
    howItWorks: {
      title: getSafeTranslation(translations, TRANSLATION_PATHS.howItWorksTitle, 'How It Works'),
      step1: {
        title: getSafeTranslation(translations, TRANSLATION_PATHS.howItWorksStep1Title, 'Upload Images'),
        description: getSafeTranslation(translations, TRANSLATION_PATHS.howItWorksStep1Description, 'Drag and drop your images or click to browse')
      },
      step2: {
        title: getSafeTranslation(translations, TRANSLATION_PATHS.howItWorksStep2Title, 'Adjust Settings'),
        description: getSafeTranslation(translations, TRANSLATION_PATHS.howItWorksStep2Description, 'Customize compression quality and dimensions')
      },
      step3: {
        title: getSafeTranslation(translations, TRANSLATION_PATHS.howItWorksStep3Title, 'Download Results'),
        description: getSafeTranslation(translations, TRANSLATION_PATHS.howItWorksStep3Description, 'Get your compressed images instantly')
      }
    },
    
    // Features
    features: {
      title: getSafeTranslation(translations, TRANSLATION_PATHS.featuresTitle, 'Why Choose TinyCompressor?'),
      subtitle: getSafeTranslation(translations, TRANSLATION_PATHS.featuresSubtitle, 'Powerful features for all your image compression needs'),
      fast: {
        title: getSafeTranslation(translations, TRANSLATION_PATHS.featuresFastTitle, 'Lightning Fast'),
        description: getSafeTranslation(translations, TRANSLATION_PATHS.featuresFastDescription, 'Compress images in seconds')
      },
      secure: {
        title: getSafeTranslation(translations, TRANSLATION_PATHS.featuresSecureTitle, '100% Secure'),
        description: getSafeTranslation(translations, TRANSLATION_PATHS.featuresSecureDescription, 'Your images never leave your device')
      },
      quality: {
        title: getSafeTranslation(translations, TRANSLATION_PATHS.featuresQualityTitle, 'High Quality'),
        description: getSafeTranslation(translations, TRANSLATION_PATHS.featuresQualityDescription, 'Maintain image quality while reducing size')
      },
      free: {
        title: getSafeTranslation(translations, TRANSLATION_PATHS.featuresFreeTitle, 'Completely Free'),
        description: getSafeTranslation(translations, TRANSLATION_PATHS.featuresFreeDescription, 'No registration, no hidden costs')
      }
    },
    
    // Upload
    upload: {
      title: getSafeTranslation(translations, TRANSLATION_PATHS.uploadTitle, 'Upload Your Images'),
      subtitle: getSafeTranslation(translations, TRANSLATION_PATHS.uploadSubtitle, 'Drag and drop your images here or click to browse'),
      dragActive: getSafeTranslation(translations, 'upload.dragActive', 'Drop images here'),
      dragInactive: getSafeTranslation(translations, 'upload.dragInactive', 'Drag & drop images here'),
      dragReject: getSafeTranslation(translations, 'upload.dragReject', 'Invalid file type'),
      dragDrop: getSafeTranslation(translations, TRANSLATION_PATHS.uploadDragDrop, 'Drag & drop images here'),
      clickToUpload: getSafeTranslation(translations, TRANSLATION_PATHS.uploadClickToUpload, 'or click to browse'),
      supportedFormats: getSafeTranslation(translations, TRANSLATION_PATHS.uploadSupportedFormats, 'Supports JPG, PNG, WebP, and more'),
      maxSize: getSafeTranslation(translations, TRANSLATION_PATHS.uploadMaxSize, 'Max file size: 10MB per image'),
      uploadedFiles: getSafeTranslation(translations, TRANSLATION_PATHS.uploadUploadedFiles, 'Uploaded Files'),
      removeFile: getSafeTranslation(translations, 'upload.removeFile', 'Remove'),
      ready: getSafeTranslation(translations, 'upload.ready', 'Ready to compress')
    },
    
    // Compression
    compression: {
      title: getSafeTranslation(translations, TRANSLATION_PATHS.compressionTitle, 'Compression Settings'),
      mode: {
        quick: getSafeTranslation(translations, TRANSLATION_PATHS.compressionModeQuick, 'Quick'),
        custom: getSafeTranslation(translations, TRANSLATION_PATHS.compressionModeCustom, 'Custom')
      },
      quickMode: {
        title: getSafeTranslation(translations, TRANSLATION_PATHS.compressionQuickTitle, 'Quick Compression'),
        description: getSafeTranslation(translations, TRANSLATION_PATHS.compressionQuickDescription, 'Optimized settings for best results')
      },
      customMode: {
        title: getSafeTranslation(translations, TRANSLATION_PATHS.compressionCustomTitle, 'Custom Settings'),
        description: getSafeTranslation(translations, TRANSLATION_PATHS.compressionCustomDescription, 'Fine-tune compression parameters')
      }
    },
    
    // Results
    results: {
      title: getSafeTranslation(translations, TRANSLATION_PATHS.resultsTitle, 'Compression Results'),
      before: getSafeTranslation(translations, TRANSLATION_PATHS.resultsBefore, 'Before'),
      after: getSafeTranslation(translations, TRANSLATION_PATHS.resultsAfter, 'After'),
      reduction: getSafeTranslation(translations, TRANSLATION_PATHS.resultsReduction, 'Reduction'),
      originalSize: getSafeTranslation(translations, TRANSLATION_PATHS.resultsOriginalSize, 'Original Size'),
      compressedSize: getSafeTranslation(translations, TRANSLATION_PATHS.resultsCompressedSize, 'Compressed Size'),
      spaceSaved: getSafeTranslation(translations, TRANSLATION_PATHS.resultsSpaceSaved, 'Space Saved'),
      download: getSafeTranslation(translations, TRANSLATION_PATHS.resultsDownload, 'Download'),
      downloadAll: getSafeTranslation(translations, TRANSLATION_PATHS.resultsDownloadAll, 'Download All'),
      compressMore: getSafeTranslation(translations, TRANSLATION_PATHS.resultsCompressMore, 'Compress More'),
      noResults: getSafeTranslation(translations, TRANSLATION_PATHS.resultsNoResults, 'No results yet')
    },
    
    // FAQ
    faq: {
      title: getSafeTranslation(translations, TRANSLATION_PATHS.faqTitle, 'Frequently Asked Questions'),
      subtitle: getSafeTranslation(translations, TRANSLATION_PATHS.faqSubtitle, 'Everything you need to know about image compression'),
      questions: {
        privacy: {
          question: getSafeTranslation(translations, 'faq.questions.privacy.question', 'Is my data secure?'),
          answer: getSafeTranslation(translations, 'faq.questions.privacy.answer', 'Yes, all processing happens in your browser. Your images never leave your device.')
        },
        fileSize: {
          question: getSafeTranslation(translations, 'faq.questions.fileSize.question', 'What file sizes are supported?'),
          answer: getSafeTranslation(translations, 'faq.questions.fileSize.answer', 'We support images up to 10MB each. For larger files, consider using desktop software.')
        },
        compression: {
          question: getSafeTranslation(translations, 'faq.questions.compression.question', 'How much can I compress my images?'),
          answer: getSafeTranslation(translations, 'faq.questions.compression.answer', 'Typically 60-90% size reduction while maintaining good quality.')
        },
        account: {
          question: getSafeTranslation(translations, 'faq.questions.account.question', 'Do I need to create an account?'),
          answer: getSafeTranslation(translations, 'faq.questions.account.answer', 'No account required! Just upload and compress your images instantly.')
        },
        browsers: {
          question: getSafeTranslation(translations, 'faq.questions.browsers.question', 'Which browsers are supported?'),
          answer: getSafeTranslation(translations, 'faq.questions.browsers.answer', 'Works on all modern browsers including Chrome, Firefox, Safari, and Edge.')
        }
      }
    },
    
    // Footer
    footer: {
      quickLinks: getSafeTranslation(translations, TRANSLATION_PATHS.footerQuickLinks, 'Quick Links'),
      legal: getSafeTranslation(translations, TRANSLATION_PATHS.footerLegal, 'Legal'),
      links: {
        privacy: getSafeTranslation(translations, TRANSLATION_PATHS.footerPrivacy, 'Privacy Policy'),
        terms: getSafeTranslation(translations, TRANSLATION_PATHS.footerTerms, 'Terms of Service')
      },
      copyright: getSafeTranslation(translations, 'footer.copyright', '© 2025 TinyCompressor. All rights reserved.')
    },
    
    // Navigation
    nav: {
      features: getSafeTranslation(translations, TRANSLATION_PATHS.navFeatures, 'Features'),
      about: getSafeTranslation(translations, TRANSLATION_PATHS.navAbout, 'About'),
      language: getSafeTranslation(translations, TRANSLATION_PATHS.navLanguage, 'Language'),
      home: getSafeTranslation(translations, TRANSLATION_PATHS.navHome, 'Home'),
      privacy: getSafeTranslation(translations, TRANSLATION_PATHS.navPrivacy, 'Privacy'),
      terms: getSafeTranslation(translations, TRANSLATION_PATHS.navTerms, 'Terms')
    },
    
    // Metadata
    metadata: {
      title: getSafeTranslation(translations, 'metadata.title', 'TinyCompressor - Free Online Image Compression'),
      description: getSafeTranslation(translations, 'metadata.description', 'Compress images online for free!'),
      keywords: getSafeTranslation(translations, 'metadata.keywords', 'image compression, online tool, free'),
      openGraphTitle: getSafeTranslation(translations, 'metadata.openGraphTitle', 'TinyCompressor - Free Online Image Compression'),
      openGraphDescription: getSafeTranslation(translations, 'metadata.openGraphDescription', 'Compress images online for free!'),
      twitterTitle: getSafeTranslation(translations, 'metadata.twitterTitle', 'TinyCompressor - Free Online Image Compression'),
      twitterDescription: getSafeTranslation(translations, 'metadata.twitterDescription', 'Compress images online for free!')
    },
    
    // Perfect For
    perfectFor: {
      title: getSafeTranslation(translations, 'perfectFor.title', 'Perfect For'),
      webDevelopers: {
        title: getSafeTranslation(translations, 'perfectFor.webDevelopers.title', 'Web Developers'),
        description: getSafeTranslation(translations, 'perfectFor.webDevelopers.description', 'Optimize images for web performance')
      },
      designers: {
        title: getSafeTranslation(translations, 'perfectFor.designers.title', 'Designers'),
        description: getSafeTranslation(translations, 'perfectFor.designers.description', 'Reduce file sizes for design projects')
      },
      socialMedia: {
        title: getSafeTranslation(translations, 'perfectFor.socialMedia.title', 'Social Media'),
        description: getSafeTranslation(translations, 'perfectFor.socialMedia.description', 'Optimize images for social platforms')
      },
      emailAttachments: {
        title: getSafeTranslation(translations, 'perfectFor.emailAttachments.title', 'Email Attachments'),
        description: getSafeTranslation(translations, 'perfectFor.emailAttachments.description', 'Reduce attachment sizes for faster sending')
      },
      ecommerce: {
        title: getSafeTranslation(translations, 'perfectFor.ecommerce.title', 'E-commerce'),
        description: getSafeTranslation(translations, 'perfectFor.ecommerce.description', 'Optimize product images for online stores')
      },
      photoStorage: {
        title: getSafeTranslation(translations, 'perfectFor.photoStorage.title', 'Photo Storage'),
        description: getSafeTranslation(translations, 'perfectFor.photoStorage.description', 'Save space in your photo collections')
      }
    },
    
    // Formats
    formats: {
      title: getSafeTranslation(translations, 'formats.title', 'Supported Formats'),
      jpeg: {
        title: getSafeTranslation(translations, 'formats.jpeg.title', 'JPEG'),
        description: getSafeTranslation(translations, 'formats.jpeg.description', 'Best for photographs and complex images')
      },
      png: {
        title: getSafeTranslation(translations, 'formats.png.title', 'PNG'),
        description: getSafeTranslation(translations, 'formats.png.description', 'Best for graphics with transparency')
      },
      webp: {
        title: getSafeTranslation(translations, 'formats.webp.title', 'WebP'),
        description: getSafeTranslation(translations, 'formats.webp.description', 'Modern format with excellent compression')
      },
      gif: {
        title: getSafeTranslation(translations, 'formats.gif.title', 'GIF'),
        description: getSafeTranslation(translations, 'formats.gif.description', 'Best for simple animations')
      }
    },
    
    // Privacy
    privacy: {
      introduction: {
        title: getSafeTranslation(translations, 'privacy.introduction.title', 'Privacy Policy'),
        content: getSafeTranslation(translations, 'privacy.introduction.content', 'Your privacy is important to us.')
      },
      informationCollection: {
        title: getSafeTranslation(translations, 'privacy.informationCollection.title', 'Information Collection'),
        content: getSafeTranslation(translations, 'privacy.informationCollection.content', 'We do not collect personal information.')
      },
      dataProcessing: {
        title: getSafeTranslation(translations, 'privacy.dataProcessing.title', 'Data Processing'),
        content: getSafeTranslation(translations, 'privacy.dataProcessing.content', 'All processing happens locally in your browser.')
      },
      cookies: {
        title: getSafeTranslation(translations, 'privacy.cookies.title', 'Cookies'),
        content: getSafeTranslation(translations, 'privacy.cookies.content', 'We use minimal cookies for functionality.')
      },
      thirdParty: {
        title: getSafeTranslation(translations, 'privacy.thirdParty.title', 'Third Party Services'),
        content: getSafeTranslation(translations, 'privacy.thirdParty.content', 'We do not share data with third parties.')
      },
      dataSecurity: {
        title: getSafeTranslation(translations, 'privacy.dataSecurity.title', 'Data Security'),
        content: getSafeTranslation(translations, 'privacy.dataSecurity.content', 'Your data never leaves your device.')
      },
      changes: {
        title: getSafeTranslation(translations, 'privacy.changes.title', 'Changes to Privacy Policy'),
        content: getSafeTranslation(translations, 'privacy.changes.content', 'We may update this policy from time to time.')
      },
      contact: {
        title: getSafeTranslation(translations, 'privacy.contact.title', 'Contact Us'),
        content: getSafeTranslation(translations, 'privacy.contact.content', 'If you have questions about this policy.')
      }
    },
    
    // Terms
    terms: {
      acceptance: {
        title: getSafeTranslation(translations, 'terms.acceptance.title', 'Terms of Service'),
        content: getSafeTranslation(translations, 'terms.acceptance.content', 'By using our service, you agree to these terms.')
      },
      description: {
        title: getSafeTranslation(translations, 'terms.description.title', 'Service Description'),
        content: getSafeTranslation(translations, 'terms.description.content', 'TinyCompressor is a free online image compression tool.')
      },
      userResponsibilities: {
        title: getSafeTranslation(translations, 'terms.userResponsibilities.title', 'User Responsibilities'),
        content: getSafeTranslation(translations, 'terms.userResponsibilities.content', 'Users are responsible for their use of the service.')
      },
      limitations: {
        title: getSafeTranslation(translations, 'terms.limitations.title', 'Service Limitations'),
        content: getSafeTranslation(translations, 'terms.limitations.content', 'The service is provided as-is without warranties.')
      },
      prohibitedUses: {
        title: getSafeTranslation(translations, 'terms.prohibitedUses.title', 'Prohibited Uses'),
        content: getSafeTranslation(translations, 'terms.prohibitedUses.content', 'Users may not use the service for illegal purposes.')
      },
      intellectualProperty: {
        title: getSafeTranslation(translations, 'terms.intellectualProperty.title', 'Intellectual Property'),
        content: getSafeTranslation(translations, 'terms.intellectualProperty.content', 'All rights reserved to TinyCompressor.')
      },
      disclaimer: {
        title: getSafeTranslation(translations, 'terms.disclaimer.title', 'Disclaimer'),
        content: getSafeTranslation(translations, 'terms.disclaimer.content', 'The service is provided without warranties.')
      },
      limitationLiability: {
        title: getSafeTranslation(translations, 'terms.limitationLiability.title', 'Limitation of Liability'),
        content: getSafeTranslation(translations, 'terms.limitationLiability.content', 'Our liability is limited to the maximum extent permitted by law.')
      },
      governingLaw: {
        title: getSafeTranslation(translations, 'terms.governingLaw.title', 'Governing Law'),
        content: getSafeTranslation(translations, 'terms.governingLaw.content', 'These terms are governed by applicable law.')
      },
      changes: {
        title: getSafeTranslation(translations, 'terms.changes.title', 'Changes to Terms'),
        content: getSafeTranslation(translations, 'terms.changes.content', 'We may update these terms from time to time.')
      },
      contact: {
        title: getSafeTranslation(translations, 'terms.contact.title', 'Contact Information'),
        content: getSafeTranslation(translations, 'terms.contact.content', 'For questions about these terms.')
      }
    },

    // CTA Section
    cta: {
      title: getSafeTranslation(translations, 'cta.title', 'Ready to Compress Your Images?'),
      subtitle: getSafeTranslation(translations, 'cta.subtitle', 'Join thousands of users who trust TinyCompressor for their image optimization needs'),
      button: getSafeTranslation(translations, 'cta.button', 'Start Compressing Now')
    }
  };
}
