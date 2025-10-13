/**
 * 功能权限控制系统
 * 管理功能访问权限和使用限制
 */

import { GlobalSettings, FEATURE_LIMITATIONS } from '@/lib/settings/global-settings';

export interface FeatureLimitations {
  maxFiles: number;
  maxFileSize: number;
  dailyLimit: number;
  supportedFormats: string[];
  watermark: boolean;
}

export interface UsageStats {
  filesProcessedToday: number;
  totalFilesProcessed: number;
  lastResetDate: string;
}

class FeaturePermissions {
  private static instance: FeaturePermissions;
  private usageStats: UsageStats = {
    filesProcessedToday: 0,
    totalFilesProcessed: 0,
    lastResetDate: new Date().toDateString()
  };

  private constructor() {
    this.loadUsageStats();
  }

  static getInstance(): FeaturePermissions {
    if (!FeaturePermissions.instance) {
      FeaturePermissions.instance = new FeaturePermissions();
    }
    return FeaturePermissions.instance;
  }

  /**
   * 加载使用统计
   */
  private loadUsageStats(): void {
    // 检查是否在浏览器环境中
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return;
    }
    
    try {
      const stored = localStorage.getItem('tinycompressor-usage-stats');
      if (stored) {
        const parsed = JSON.parse(stored);
        // 检查是否需要重置每日计数
        if (parsed.lastResetDate !== new Date().toDateString()) {
          this.usageStats = {
            filesProcessedToday: 0,
            totalFilesProcessed: parsed.totalFilesProcessed || 0,
            lastResetDate: new Date().toDateString()
          };
          this.saveUsageStats();
        } else {
          this.usageStats = parsed;
        }
      }
    } catch (error) {
      console.error('Failed to load usage stats:', error);
      this.usageStats = {
        filesProcessedToday: 0,
        totalFilesProcessed: 0,
        lastResetDate: new Date().toDateString()
      };
    }
  }

  /**
   * 保存使用统计
   */
  private saveUsageStats(): void {
    // 检查是否在浏览器环境中
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return;
    }
    
    try {
      localStorage.setItem('tinycompressor-usage-stats', JSON.stringify(this.usageStats));
    } catch (error) {
      console.error('Failed to save usage stats:', error);
    }
  }

  /**
   * 获取当前用户等级
   * 目前所有用户都是免费用户，后续可以扩展
   */
  private getUserLevel(): string {
    // 这里可以根据用户登录状态、订阅状态等判断
    // 目前返回 'free'
    return 'free';
  }

  /**
   * 检查功能权限
   */
  canUse(feature: keyof GlobalSettings['advancedFeatures'], settings: GlobalSettings): boolean {
    // 检查功能是否在设置中启用
    return settings.advancedFeatures[feature];
  }

  /**
   * 获取可用功能列表
   */
  getAvailableFeatures(settings: GlobalSettings): string[] {
    return Object.entries(settings.advancedFeatures)
      .filter(([_, enabled]) => enabled)
      .map(([feature, _]) => feature);
  }

  /**
   * 获取功能限制
   */
  getLimitations(settings: GlobalSettings): FeatureLimitations {
    const userLevel = this.getUserLevel();
    const limitations = FEATURE_LIMITATIONS[userLevel] || FEATURE_LIMITATIONS['free'];
    if (!limitations) {
      throw new Error(`Unknown user level: ${userLevel}`);
    }
    return limitations;
  }

  /**
   * 检查文件数量限制
   */
  canProcessFiles(fileCount: number, settings: GlobalSettings): { allowed: boolean; reason?: string } {
    const limitations = this.getLimitations(settings);
    
    if (limitations.maxFiles > 0 && fileCount > limitations.maxFiles) {
      return {
        allowed: false,
        reason: `最多只能处理 ${limitations.maxFiles} 个文件`
      };
    }

    return { allowed: true };
  }

  /**
   * 检查文件大小限制
   */
  canProcessFileSize(fileSize: number, settings: GlobalSettings): { allowed: boolean; reason?: string } {
    const limitations = this.getLimitations(settings);
    
    if (fileSize > limitations.maxFileSize) {
      const maxSizeMB = Math.round(limitations.maxFileSize / (1024 * 1024));
      return {
        allowed: false,
        reason: `文件大小不能超过 ${maxSizeMB}MB`
      };
    }

    return { allowed: true };
  }

  /**
   * 检查每日使用限制
   */
  canProcessToday(settings: GlobalSettings): { allowed: boolean; reason?: string } {
    const limitations = this.getLimitations(settings);
    
    if (limitations.dailyLimit > 0 && this.usageStats.filesProcessedToday >= limitations.dailyLimit) {
      return {
        allowed: false,
        reason: `今日已处理 ${this.usageStats.filesProcessedToday} 个文件，达到每日限制`
      };
    }

    return { allowed: true };
  }

  /**
   * 检查文件格式支持
   */
  canProcessFormat(format: string, settings: GlobalSettings): { allowed: boolean; reason?: string } {
    const limitations = this.getLimitations(settings);
    
    if (!limitations.supportedFormats.includes(format.toUpperCase())) {
      return {
        allowed: false,
        reason: `不支持 ${format} 格式，支持格式：${limitations.supportedFormats.join(', ')}`
      };
    }

    return { allowed: true };
  }

  /**
   * 记录文件处理
   */
  recordFileProcessing(fileCount: number): void {
    this.usageStats.filesProcessedToday += fileCount;
    this.usageStats.totalFilesProcessed += fileCount;
    this.saveUsageStats();
  }

  /**
   * 获取使用统计
   */
  getUsageStats(): UsageStats {
    return { ...this.usageStats };
  }

  /**
   * 重置每日使用统计
   */
  resetDailyUsage(): void {
    this.usageStats.filesProcessedToday = 0;
    this.usageStats.lastResetDate = new Date().toDateString();
    this.saveUsageStats();
  }

  /**
   * 检查批量处理权限
   */
  canUseBatchProcessing(settings: GlobalSettings): { allowed: boolean; reason?: string } {
    if (!this.canUse('batchProcessing', settings)) {
      return {
        allowed: false,
        reason: '批量处理功能未启用，请在设置中开启'
      };
    }

    return { allowed: true };
  }

  /**
   * 检查高级设置权限
   */
  canUseAdvancedSettings(settings: GlobalSettings): { allowed: boolean; reason?: string } {
    if (!this.canUse('advancedSettings', settings)) {
      return {
        allowed: false,
        reason: '高级设置功能未启用，请在设置中开启'
      };
    }

    return { allowed: true };
  }

  /**
   * 检查自定义预设权限
   */
  canUseCustomPresets(settings: GlobalSettings): { allowed: boolean; reason?: string } {
    if (!this.canUse('customPresets', settings)) {
      return {
        allowed: false,
        reason: '自定义预设功能未启用，请在设置中开启'
      };
    }

    return { allowed: true };
  }

  /**
   * 获取功能升级提示
   */
  getUpgradeHint(feature: string): string {
    const hints: Record<string, string> = {
      batchProcessing: '升级到高级版本以使用批量处理功能',
      advancedSettings: '升级到高级版本以使用高级设置功能',
      customPresets: '升级到高级版本以使用自定义预设功能',
      apiAccess: '升级到专业版本以使用API访问功能',
      cloudIntegration: '升级到专业版本以使用云存储集成功能'
    };

    return hints[feature] || '升级到高级版本以使用此功能';
  }
}

// 导出单例实例
export const featurePermissions = FeaturePermissions.getInstance();
export default featurePermissions;
