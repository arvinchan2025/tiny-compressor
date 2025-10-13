/**
 * 设置存储管理
 * 处理设置的持久化存储和同步
 */

import { GlobalSettings, DEFAULT_GLOBAL_SETTINGS } from './global-settings';

class SettingsStorage {
  private static instance: SettingsStorage;
  private listeners: Set<(settings: GlobalSettings) => void> = new Set();
  private settings: GlobalSettings | null = null;

  private constructor() {
    this.loadSettings();
  }

  static getInstance(): SettingsStorage {
    if (!SettingsStorage.instance) {
      SettingsStorage.instance = new SettingsStorage();
    }
    return SettingsStorage.instance;
  }

  /**
   * 加载设置
   */
  private loadSettings(): void {
    // 检查是否在浏览器环境
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      this.settings = { ...DEFAULT_GLOBAL_SETTINGS };
      return;
    }

    try {
      const stored = localStorage.getItem('tinycompressor-settings');
      if (stored) {
        this.settings = JSON.parse(stored);
      } else {
        this.settings = { ...DEFAULT_GLOBAL_SETTINGS };
        this.saveSettings();
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
      this.settings = { ...DEFAULT_GLOBAL_SETTINGS };
    }
  }

  /**
   * 保存设置
   */
  private saveSettings(): void {
    // 检查是否在浏览器环境
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return;
    }

    try {
      if (this.settings) {
        localStorage.setItem('tinycompressor-settings', JSON.stringify(this.settings));
        this.notifyListeners();
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  }

  /**
   * 获取当前设置
   */
  getSettings(): GlobalSettings {
    if (!this.settings) {
      this.loadSettings();
    }
    return this.settings || { ...DEFAULT_GLOBAL_SETTINGS };
  }

  /**
   * 更新设置
   */
  updateSettings(updates: Partial<GlobalSettings>): void {
    if (!this.settings) {
      this.settings = { ...DEFAULT_GLOBAL_SETTINGS };
    }

    this.settings = {
      ...this.settings,
      ...updates,
      basic: { ...this.settings.basic, ...updates.basic },
      advancedFeatures: { ...this.settings.advancedFeatures, ...updates.advancedFeatures },
      processingMode: { ...this.settings.processingMode, ...updates.processingMode },
      compressor: { ...this.settings.compressor, ...updates.compressor },
      converter: { ...this.settings.converter, ...updates.converter }
    };

    this.saveSettings();
  }

  /**
   * 更新特定功能设置
   */
  updateFeature(feature: keyof GlobalSettings['advancedFeatures'], value: boolean): void {
    if (!this.settings) {
      this.settings = { ...DEFAULT_GLOBAL_SETTINGS };
    }

    this.settings.advancedFeatures[feature] = value;
    this.saveSettings();
  }

  /**
   * 重置设置
   */
  resetSettings(): void {
    this.settings = { ...DEFAULT_GLOBAL_SETTINGS };
    this.saveSettings();
  }

  /**
   * 订阅设置变化
   */
  subscribe(listener: (settings: GlobalSettings) => void): () => void {
    this.listeners.add(listener);
    
    // 立即调用一次
    listener(this.getSettings());

    // 返回取消订阅函数
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * 通知所有监听器
   */
  private notifyListeners(): void {
    if (this.settings) {
      this.listeners.forEach(listener => {
        try {
          listener(this.settings!);
        } catch (error) {
          console.error('Error in settings listener:', error);
        }
      });
    }
  }

  /**
   * 导出设置
   */
  exportSettings(): string {
    return JSON.stringify(this.getSettings(), null, 2);
  }

  /**
   * 导入设置
   */
  importSettings(settingsJson: string): boolean {
    try {
      const imported = JSON.parse(settingsJson);
      this.settings = { ...DEFAULT_GLOBAL_SETTINGS, ...imported };
      this.saveSettings();
      return true;
    } catch (error) {
      console.error('Failed to import settings:', error);
      return false;
    }
  }

  /**
   * 验证设置
   */
  validateSettings(settings: any): settings is GlobalSettings {
    try {
      // 基本验证
      if (!settings || typeof settings !== 'object') return false;
      if (!settings.basic || !settings.advancedFeatures || !settings.processingMode) return false;
      
      // 可以添加更详细的验证逻辑
      return true;
    } catch {
      return false;
    }
  }
}

// 导出单例实例
export const settingsStorage = SettingsStorage.getInstance();
export default settingsStorage;
