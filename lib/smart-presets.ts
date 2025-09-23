import { ImageFile } from '@/types/image';

// 文件类型分析结果
export interface FileAnalysis {
  type: 'photo' | 'graphic' | 'screenshot' | 'logo' | 'icon' | 'unknown';
  quality: 'low' | 'medium' | 'high' | 'very-high';
  size: 'small' | 'medium' | 'large' | 'very-large';
  aspectRatio: 'square' | 'landscape' | 'portrait' | 'ultra-wide';
  hasTransparency: boolean;
  colorComplexity: 'simple' | 'moderate' | 'complex';
  recommendedFormat: string;
  recommendedSettings: {
    quality: number;
    lossless: boolean;
    optimizationLevel: number;
    preserveMetadata: boolean;
    optimizeForWeb: boolean;
  };
}

// 预设配置
export interface SmartPreset {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'quality' | 'size' | 'web' | 'print' | 'social';
  settings: {
    quality: number;
    lossless: boolean;
    optimizationLevel: number;
    preserveMetadata: boolean;
    optimizeForWeb: boolean;
  };
  conditions: {
    fileTypes?: string[];
    minSize?: number;
    maxSize?: number;
    aspectRatios?: string[];
    hasTransparency?: boolean;
    priority?: number;
  };
  priority: number;
}

// 智能预设分析器类
export class SmartPresetAnalyzer {
  private static presets: SmartPreset[] = [
    // 高质量预设
    {
      id: 'ultra-high-quality',
      name: 'Ultra High Quality',
      description: 'Best quality for professional use',
      icon: '⭐',
      category: 'quality',
      settings: {
        quality: 95,
        lossless: true,
        optimizationLevel: 9,
        preserveMetadata: true,
        optimizeForWeb: false
      },
      conditions: {
        fileTypes: ['image/png', 'image/tiff'],
        minSize: 1024 * 1024, // 1MB
        priority: 1
      },
      priority: 1
    },
    {
      id: 'high-quality',
      name: 'High Quality',
      description: 'High quality with good compression',
      icon: '🔥',
      category: 'quality',
      settings: {
        quality: 90,
        lossless: false,
        optimizationLevel: 8,
        preserveMetadata: true,
        optimizeForWeb: false
      },
      conditions: {
        fileTypes: ['image/jpeg', 'image/png'],
        minSize: 500 * 1024, // 500KB
        priority: 2
      },
      priority: 2
    },
    // 网页优化预设
    {
      id: 'web-optimized',
      name: 'Web Optimized',
      description: 'Optimized for web performance',
      icon: '🌐',
      category: 'web',
      settings: {
        quality: 80,
        lossless: false,
        optimizationLevel: 6,
        preserveMetadata: false,
        optimizeForWeb: true
      },
      conditions: {
        fileTypes: ['image/jpeg', 'image/png', 'image/webp'],
        maxSize: 5 * 1024 * 1024, // 5MB
        priority: 3
      },
      priority: 3
    },
    // 社交媒体预设
    {
      id: 'social-media',
      name: 'Social Media',
      description: 'Optimized for social platforms',
      icon: '📱',
      category: 'social',
      settings: {
        quality: 85,
        lossless: false,
        optimizationLevel: 7,
        preserveMetadata: false,
        optimizeForWeb: true
      },
      conditions: {
        fileTypes: ['image/jpeg', 'image/png'],
        aspectRatios: ['square', 'landscape', 'portrait'],
        priority: 4
      },
      priority: 4
    },
    // 小文件预设
    {
      id: 'small-file',
      name: 'Small File',
      description: 'Maximum compression for small files',
      icon: '📦',
      category: 'size',
      settings: {
        quality: 70,
        lossless: false,
        optimizationLevel: 9,
        preserveMetadata: false,
        optimizeForWeb: true
      },
      conditions: {
        maxSize: 200 * 1024, // 200KB
        priority: 5
      },
      priority: 5
    },
    // 透明图片预设
    {
      id: 'transparency-preserved',
      name: 'Preserve Transparency',
      description: 'Maintains transparency for PNG files',
      icon: '🔍',
      category: 'quality',
      settings: {
        quality: 90,
        lossless: true,
        optimizationLevel: 8,
        preserveMetadata: true,
        optimizeForWeb: false
      },
      conditions: {
        fileTypes: ['image/png'],
        hasTransparency: true,
        priority: 2
      },
      priority: 2
    },
    // 打印预设
    {
      id: 'print-ready',
      name: 'Print Ready',
      description: 'High resolution for printing',
      icon: '🖨️',
      category: 'print',
      settings: {
        quality: 95,
        lossless: true,
        optimizationLevel: 9,
        preserveMetadata: true,
        optimizeForWeb: false
      },
      conditions: {
        fileTypes: ['image/tiff', 'image/png'],
        minSize: 2 * 1024 * 1024, // 2MB
        priority: 1
      },
      priority: 1
    }
  ];

  // 分析文件并返回推荐预设
  static analyzeFile(file: ImageFile): FileAnalysis {
    const analysis: FileAnalysis = {
      type: this.analyzeFileType(file),
      quality: this.analyzeQuality(file),
      size: this.analyzeSize(file),
      aspectRatio: this.analyzeAspectRatio(file),
      hasTransparency: this.analyzeTransparency(file),
      colorComplexity: this.analyzeColorComplexity(file),
      recommendedFormat: this.recommendFormat(file),
      recommendedSettings: this.getDefaultSettings()
    };

    return analysis;
  }

  // 分析文件类型
  private static analyzeFileType(file: ImageFile): FileAnalysis['type'] {
    const type = file.type.toLowerCase();
    
    if (type.includes('jpeg') || type.includes('jpg')) {
      return 'photo';
    }
    if (type.includes('png')) {
      // 根据文件名和大小判断
      if (file.name.toLowerCase().includes('logo') || file.name.toLowerCase().includes('icon')) {
        return 'logo';
      }
      if (file.size < 100 * 1024) { // 小于100KB
        return 'icon';
      }
      return 'graphic';
    }
    if (type.includes('webp')) {
      return 'graphic';
    }
    if (type.includes('gif')) {
      return 'graphic';
    }
    
    return 'unknown';
  }

  // 分析质量等级
  private static analyzeQuality(file: ImageFile): FileAnalysis['quality'] {
    if (file.size > 5 * 1024 * 1024) { // 大于5MB
      return 'very-high';
    }
    if (file.size > 2 * 1024 * 1024) { // 大于2MB
      return 'high';
    }
    if (file.size > 500 * 1024) { // 大于500KB
      return 'medium';
    }
    return 'low';
  }

  // 分析文件大小等级
  private static analyzeSize(file: ImageFile): FileAnalysis['size'] {
    if (file.size > 10 * 1024 * 1024) { // 大于10MB
      return 'very-large';
    }
    if (file.size > 2 * 1024 * 1024) { // 大于2MB
      return 'large';
    }
    if (file.size > 500 * 1024) { // 大于500KB
      return 'medium';
    }
    return 'small';
  }

  // 分析宽高比
  private static analyzeAspectRatio(file: ImageFile): FileAnalysis['aspectRatio'] {
    // 这里需要从图片元数据获取，暂时返回默认值
    // 在实际实现中，应该解析图片的EXIF数据
    return 'landscape';
  }

  // 分析是否有透明度
  private static analyzeTransparency(file: ImageFile): boolean {
    return file.type.toLowerCase().includes('png') && 
           (file.name.toLowerCase().includes('transparent') || 
            file.name.toLowerCase().includes('alpha'));
  }

  // 分析颜色复杂度
  private static analyzeColorComplexity(file: ImageFile): FileAnalysis['colorComplexity'] {
    // 根据文件大小和类型估算颜色复杂度
    if (file.size < 100 * 1024) {
      return 'simple';
    }
    if (file.size < 1 * 1024 * 1024) {
      return 'moderate';
    }
    return 'complex';
  }

  // 推荐格式
  private static recommendFormat(file: ImageFile): string {
    const type = file.type.toLowerCase();
    
    if (type.includes('jpeg') || type.includes('jpg')) {
      return 'webp'; // 推荐转换为WebP以获得更好的压缩
    }
    if (type.includes('png')) {
      if (this.analyzeTransparency(file)) {
        return 'png'; // 保持PNG以保留透明度
      }
      return 'webp'; // 推荐转换为WebP
    }
    
    return file.type.split('/')[1] || 'jpeg';
  }

  // 获取默认设置
  private static getDefaultSettings(): FileAnalysis['recommendedSettings'] {
    return {
      quality: 85,
      lossless: false,
      optimizationLevel: 6,
      preserveMetadata: true,
      optimizeForWeb: true
    };
  }

  // 推荐设置
  static recommendSettings(file: ImageFile): FileAnalysis['recommendedSettings'] {
    const preset = this.getBestPreset(file);
    
    return preset ? preset.settings : this.getDefaultSettings();
  }

  // 获取最佳预设
  static getBestPreset(file: ImageFile): SmartPreset | null {
    const matchingPresets = this.getMatchingPresets(file);

    if (matchingPresets.length === 0) {
      return null;
    }

    // 按优先级排序，返回最高优先级的预设
    return matchingPresets.sort((a, b) => a.priority - b.priority)[0] || null;
  }

  // 获取所有匹配的预设
  static getMatchingPresets(file: ImageFile): SmartPreset[] {
    const analysis = this.analyzeFile(file);
    return this.presets
      .filter(preset => this.matchesConditions(preset, file, analysis))
      .sort((a, b) => a.priority - b.priority);
  }

  // 检查预设是否匹配条件
  private static matchesConditions(
    preset: SmartPreset, 
    file: ImageFile, 
    analysis: FileAnalysis
  ): boolean {
    const conditions = preset.conditions;

    // 检查文件类型
    if (conditions.fileTypes && !conditions.fileTypes.includes(file.type)) {
      return false;
    }

    // 检查文件大小
    if (conditions.minSize && file.size < conditions.minSize) {
      return false;
    }
    if (conditions.maxSize && file.size > conditions.maxSize) {
      return false;
    }

    // 检查宽高比
    if (conditions.aspectRatios && !conditions.aspectRatios.includes(analysis.aspectRatio)) {
      return false;
    }

    // 检查透明度
    if (conditions.hasTransparency !== undefined && 
        conditions.hasTransparency !== analysis.hasTransparency) {
      return false;
    }

    return true;
  }

  // 获取所有预设
  static getAllPresets(): SmartPreset[] {
    return [...this.presets];
  }

  // 根据类别获取预设
  static getPresetsByCategory(category: SmartPreset['category']): SmartPreset[] {
    return this.presets.filter(preset => preset.category === category);
  }

  // 获取预设详情
  static getPresetById(id: string): SmartPreset | null {
    return this.presets.find(preset => preset.id === id) || null;
  }
}
