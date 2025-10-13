/**
 * 全局设置类型定义
 * 管理应用的所有设置选项
 */

export interface BasicSettings {
  language: string;
  theme: 'light' | 'dark' | 'auto';
  defaultQuality: 'high' | 'medium' | 'low';
}

export interface AdvancedFeatures {
  batchProcessing: boolean;
  advancedSettings: boolean;
  customPresets: boolean;
  apiAccess: boolean;
  cloudIntegration: boolean;
  metadataHandling: boolean;
  colorSpaceControl: boolean;
  formatSpecificOptions: boolean;
}

export interface ProcessingModePreferences {
  defaultMode: 'single' | 'batch';
  autoDetect: boolean;
  rememberPreference: boolean;
}

export interface CompressorAdvancedFeatures {
  compression: {
    algorithm: 'deflate' | 'lz77' | 'custom';
    level: number; // 1-9
    strategy: 'default' | 'filtered' | 'huffman' | 'rle';
    dictionary: boolean;
  };
  quality: {
    lossless: boolean;
    progressive: boolean;
    interlaced: boolean;
    colorReduction: boolean;
  };
  metadata: {
    strip: boolean;
    preserve: string[];
    add: Record<string, string>;
  };
}

export interface ConverterAdvancedFeatures {
  conversion: {
    colorSpace: 'sRGB' | 'AdobeRGB' | 'P3' | 'Rec2020';
    bitDepth: 8 | 16 | 32;
    alphaChannel: 'preserve' | 'remove' | 'flatten';
    colorProfile: boolean;
  };
  quality: {
    lossless: boolean;
    dithering: boolean;
    colorQuantization: boolean;
    gammaCorrection: boolean;
  };
  formatOptions: {
    jpeg: {
      quality: number; // 1-100
      progressive: boolean;
      optimize: boolean;
    };
    png: {
      compression: number; // 0-9
      interlaced: boolean;
      palette: boolean;
    };
    webp: {
      quality: number; // 1-100
      lossless: boolean;
      alpha: boolean;
    };
    avif: {
      quality: number; // 1-100
      speed: number; // 1-10
      colorSpace: string;
    };
  };
}

export interface GlobalSettings {
  basic: BasicSettings;
  advancedFeatures: AdvancedFeatures;
  processingMode: ProcessingModePreferences;
  compressor: CompressorAdvancedFeatures;
  converter: ConverterAdvancedFeatures;
}

export interface FeatureLimitations {
  maxFiles: number;
  maxFileSize: number; // bytes
  dailyLimit: number;
  supportedFormats: string[];
  watermark: boolean;
}

// 默认设置
export const DEFAULT_BASIC_SETTINGS: BasicSettings = {
  language: 'en',
  theme: 'auto',
  defaultQuality: 'medium'
};

export const DEFAULT_ADVANCED_FEATURES: AdvancedFeatures = {
  batchProcessing: false,
  advancedSettings: false,
  customPresets: false,
  apiAccess: false,
  cloudIntegration: false,
  metadataHandling: false,
  colorSpaceControl: false,
  formatSpecificOptions: false
};

export const DEFAULT_PROCESSING_MODE: ProcessingModePreferences = {
  defaultMode: 'single',
  autoDetect: true,
  rememberPreference: true
};

export const DEFAULT_COMPRESSOR_FEATURES: CompressorAdvancedFeatures = {
  compression: {
    algorithm: 'deflate',
    level: 6,
    strategy: 'default',
    dictionary: false
  },
  quality: {
    lossless: false,
    progressive: true,
    interlaced: false,
    colorReduction: false
  },
  metadata: {
    strip: false,
    preserve: ['EXIF', 'ICC'],
    add: {}
  }
};

export const DEFAULT_CONVERTER_FEATURES: ConverterAdvancedFeatures = {
  conversion: {
    colorSpace: 'sRGB',
    bitDepth: 8,
    alphaChannel: 'preserve',
    colorProfile: true
  },
  quality: {
    lossless: false,
    dithering: false,
    colorQuantization: false,
    gammaCorrection: false
  },
  formatOptions: {
    jpeg: {
      quality: 85,
      progressive: true,
      optimize: true
    },
    png: {
      compression: 6,
      interlaced: false,
      palette: false
    },
    webp: {
      quality: 90,
      lossless: false,
      alpha: true
    },
    avif: {
      quality: 90,
      speed: 5,
      colorSpace: 'sRGB'
    }
  }
};

export const DEFAULT_GLOBAL_SETTINGS: GlobalSettings = {
  basic: DEFAULT_BASIC_SETTINGS,
  advancedFeatures: DEFAULT_ADVANCED_FEATURES,
  processingMode: DEFAULT_PROCESSING_MODE,
  compressor: DEFAULT_COMPRESSOR_FEATURES,
  converter: DEFAULT_CONVERTER_FEATURES
};

// 功能限制配置
export const FEATURE_LIMITATIONS: Record<string, FeatureLimitations> = {
  free: {
    maxFiles: 1,
    maxFileSize: 10 * 1024 * 1024, // 10MB
    dailyLimit: 20,
    supportedFormats: ['PNG', 'JPEG', 'WebP'],
    watermark: false
  },
  basic: {
    maxFiles: 50,
    maxFileSize: 100 * 1024 * 1024, // 100MB
    dailyLimit: 1000,
    supportedFormats: ['PNG', 'JPEG', 'WebP', 'AVIF', 'GIF'],
    watermark: false
  },
  pro: {
    maxFiles: -1, // 无限制
    maxFileSize: 500 * 1024 * 1024, // 500MB
    dailyLimit: -1, // 无限制
    supportedFormats: ['PNG', 'JPEG', 'WebP', 'AVIF', 'GIF', 'TIFF', 'BMP', 'ICO'],
    watermark: false
  }
};
