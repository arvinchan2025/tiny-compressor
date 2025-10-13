/**
 * 格式配置系统
 * 定义所有支持格式的配置参数和选项
 */

export interface SettingOption {
  type: 'range' | 'boolean' | 'select' | 'preset';
  min?: number;
  max?: number;
  default: any;
  options?: { value: any; label: string }[];
  step?: number;
}

export interface Preset {
  name: string;
  description: string;
  settings: Record<string, any>;
}

export interface FormatConfig {
  acceptedTypes: string[];
  maxSize: number;
  options: Record<string, SettingOption>;
  presets: Preset[];
  icon: string;
  color: string;
  features: string[];
}

export const formatConfigs: Record<string, FormatConfig> = {
  png: {
    acceptedTypes: ['image/png'],
    maxSize: 50 * 1024 * 1024, // 50MB
    icon: '🖼️',
    color: 'blue',
    features: ['lossless', 'transparency', 'high_quality'],
    options: {
      quality: {
        type: 'range',
        min: 1,
        max: 9,
        default: 6,
        step: 1
      },
      lossless: {
        type: 'boolean',
        default: true
      },
      optimizationLevel: {
        type: 'range',
        min: 0,
        max: 9,
        default: 9,
        step: 1
      },
      keepMetadata: {
        type: 'boolean',
        default: false
      },
      interlace: {
        type: 'boolean',
        default: false
      }
    },
    presets: [
      {
        name: 'Web Optimized',
        description: 'Best balance for web use with transparency support',
        settings: {
          quality: 6,
          lossless: true,
          optimizationLevel: 9,
          keepMetadata: false,
          interlace: false
        }
      },
      {
        name: 'Maximum Compression',
        description: 'Smallest file size while maintaining quality',
        settings: {
          quality: 9,
          lossless: true,
          optimizationLevel: 9,
          keepMetadata: false,
          interlace: false
        }
      },
      {
        name: 'High Quality',
        description: 'Maximum quality for professional use',
        settings: {
          quality: 3,
          lossless: true,
          optimizationLevel: 9,
          keepMetadata: true,
          interlace: false
        }
      },
      {
        name: 'Fast Processing',
        description: 'Quick processing with good results',
        settings: {
          quality: 6,
          lossless: true,
          optimizationLevel: 3,
          keepMetadata: false,
          interlace: false
        }
      }
    ]
  },

  jpeg: {
    acceptedTypes: ['image/jpeg', 'image/jpg'],
    maxSize: 50 * 1024 * 1024, // 50MB
    icon: '📷',
    color: 'green',
    features: ['lossy', 'photographs', 'small_file_size'],
    options: {
      quality: {
        type: 'range',
        min: 10,
        max: 100,
        default: 85,
        step: 5
      },
      progressive: {
        type: 'boolean',
        default: true
      },
      optimizeHuffman: {
        type: 'boolean',
        default: true
      },
      colorSpace: {
        type: 'select',
        default: 'auto',
        options: [
          { value: 'auto', label: 'Auto' },
          { value: 'srgb', label: 'sRGB' },
          { value: 'ycbcr', label: 'YCbCr' }
        ]
      },
      keepMetadata: {
        type: 'boolean',
        default: false
      }
    },
    presets: [
      {
        name: 'Web Ready',
        description: 'Optimized for web with good quality',
        settings: {
          quality: 85,
          progressive: true,
          optimizeHuffman: true,
          colorSpace: 'auto',
          keepMetadata: false
        }
      },
      {
        name: 'High Quality',
        description: 'Maximum quality for photos',
        settings: {
          quality: 95,
          progressive: true,
          optimizeHuffman: true,
          colorSpace: 'srgb',
          keepMetadata: true
        }
      },
      {
        name: 'Maximum Compression',
        description: 'Smallest file size for storage',
        settings: {
          quality: 60,
          progressive: true,
          optimizeHuffman: true,
          colorSpace: 'auto',
          keepMetadata: false
        }
      },
      {
        name: 'Fast Processing',
        description: 'Quick compression with decent quality',
        settings: {
          quality: 75,
          progressive: false,
          optimizeHuffman: false,
          colorSpace: 'auto',
          keepMetadata: false
        }
      }
    ]
  },

  webp: {
    acceptedTypes: ['image/webp'],
    maxSize: 50 * 1024 * 1024, // 50MB
    icon: '🌐',
    color: 'purple',
    features: ['modern', 'transparency', 'lossless_lossy'],
    options: {
      quality: {
        type: 'range',
        min: 10,
        max: 100,
        default: 80,
        step: 5
      },
      lossless: {
        type: 'boolean',
        default: false
      },
      method: {
        type: 'range',
        min: 0,
        max: 6,
        default: 4,
        step: 1
      },
      keepMetadata: {
        type: 'boolean',
        default: false
      }
    },
    presets: [
      {
        name: 'Lossy Optimized',
        description: 'Best balance of quality and file size',
        settings: {
          quality: 80,
          lossless: false,
          method: 4,
          keepMetadata: false
        }
      },
      {
        name: 'Lossless',
        description: 'Perfect quality with transparency support',
        settings: {
          quality: 100,
          lossless: true,
          method: 6,
          keepMetadata: false
        }
      },
      {
        name: 'Maximum Compression',
        description: 'Smallest file size for web',
        settings: {
          quality: 60,
          lossless: false,
          method: 6,
          keepMetadata: false
        }
      },
      {
        name: 'High Quality',
        description: 'Near-lossless quality',
        settings: {
          quality: 95,
          lossless: false,
          method: 6,
          keepMetadata: true
        }
      }
    ]
  },

  avif: {
    acceptedTypes: ['image/avif'],
    maxSize: 50 * 1024 * 1024, // 50MB
    icon: '🚀',
    color: 'orange',
    features: ['next_gen', 'best_compression', 'hdr'],
    options: {
      quality: {
        type: 'range',
        min: 10,
        max: 100,
        default: 80,
        step: 5
      },
      lossless: {
        type: 'boolean',
        default: false
      },
      colorSpace: {
        type: 'select',
        default: 'srgb',
        options: [
          { value: 'srgb', label: 'sRGB' },
          { value: 'rec2020', label: 'Rec.2020' },
          { value: 'p3', label: 'P3' }
        ]
      },
      speed: {
        type: 'range',
        min: 0,
        max: 10,
        default: 4,
        step: 1
      },
      keepMetadata: {
        type: 'boolean',
        default: false
      }
    },
    presets: [
      {
        name: 'Web Optimized',
        description: 'Best for modern web browsers',
        settings: {
          quality: 80,
          lossless: false,
          colorSpace: 'srgb',
          speed: 4,
          keepMetadata: false
        }
      },
      {
        name: 'Lossless',
        description: 'Perfect quality with advanced features',
        settings: {
          quality: 100,
          lossless: true,
          colorSpace: 'srgb',
          speed: 6,
          keepMetadata: false
        }
      },
      {
        name: 'Maximum Compression',
        description: 'Smallest file size with AVIF',
        settings: {
          quality: 60,
          lossless: false,
          colorSpace: 'srgb',
          speed: 6,
          keepMetadata: false
        }
      },
      {
        name: 'Fast Processing',
        description: 'Quick encoding with good results',
        settings: {
          quality: 75,
          lossless: false,
          colorSpace: 'srgb',
          speed: 2,
          keepMetadata: false
        }
      }
    ]
  },

  gif: {
    acceptedTypes: ['image/gif'],
    maxSize: 50 * 1024 * 1024, // 50MB
    icon: '🎬',
    color: 'pink',
    features: ['animation', 'color_palette', 'simple_graphics'],
    options: {
      quality: {
        type: 'range',
        min: 10,
        max: 100,
        default: 80,
        step: 5
      },
      colors: {
        type: 'range',
        min: 2,
        max: 256,
        default: 128,
        step: 2
      },
      optimizationLevel: {
        type: 'range',
        min: 0,
        max: 3,
        default: 2,
        step: 1
      },
      optimizeFrames: {
        type: 'boolean',
        default: true
      },
      keepMetadata: {
        type: 'boolean',
        default: false
      }
    },
    presets: [
      {
        name: 'Animation Optimized',
        description: 'Best for animated GIFs',
        settings: {
          quality: 80,
          colors: 128,
          optimizationLevel: 2,
          optimizeFrames: true,
          keepMetadata: false
        }
      },
      {
        name: 'Maximum Colors',
        description: 'Best quality with full color palette',
        settings: {
          quality: 95,
          colors: 256,
          optimizationLevel: 3,
          optimizeFrames: true,
          keepMetadata: false
        }
      },
      {
        name: 'Small File Size',
        description: 'Minimal file size for simple graphics',
        settings: {
          quality: 60,
          colors: 64,
          optimizationLevel: 3,
          optimizeFrames: true,
          keepMetadata: false
        }
      },
      {
        name: 'Fast Processing',
        description: 'Quick processing with decent quality',
        settings: {
          quality: 75,
          colors: 128,
          optimizationLevel: 1,
          optimizeFrames: false,
          keepMetadata: false
        }
      }
    ]
  }
};

/**
 * 获取格式配置
 */
export function getFormatConfig(format: string): FormatConfig {
  return formatConfigs[format] || formatConfigs.png;
}

/**
 * 获取格式的默认设置
 */
export function getDefaultSettings(format: string): Record<string, any> {
  const config = getFormatConfig(format);
  const settings: Record<string, any> = {};
  
  Object.entries(config.options).forEach(([key, option]) => {
    settings[key] = option.default;
  });
  
  return settings;
}

/**
 * 验证设置值
 */
export function validateSettings(format: string, settings: Record<string, any>): { valid: boolean; errors: string[] } {
  const config = getFormatConfig(format);
  const errors: string[] = [];
  
  Object.entries(settings).forEach(([key, value]) => {
    const option = config.options[key];
    if (!option) {
      errors.push(`Unknown setting: ${key}`);
      return;
    }
    
    switch (option.type) {
      case 'range':
        if (typeof value !== 'number' || value < (option.min || 0) || value > (option.max || 100)) {
          errors.push(`Invalid ${key}: must be between ${option.min} and ${option.max}`);
        }
        break;
      case 'boolean':
        if (typeof value !== 'boolean') {
          errors.push(`Invalid ${key}: must be boolean`);
        }
        break;
      case 'select':
        if (!option.options?.some(opt => opt.value === value)) {
          errors.push(`Invalid ${key}: must be one of ${option.options?.map(o => o.value).join(', ')}`);
        }
        break;
    }
  });
  
  return {
    valid: errors.length === 0,
    errors
  };
}





