/**
 * 用户设置管理器
 * 处理用户设置的存储、读取和更新
 */

import { UserSettings, DEFAULT_USER_SETTINGS } from '@/types/user-settings';

const STORAGE_KEY = 'tinycompressor_user_settings';

export class UserSettingsManager {
  private static instance: UserSettingsManager;
  private settings: UserSettings;
  private listeners: Set<(settings: UserSettings) => void> = new Set();

  private constructor() {
    this.settings = this.loadSettings();
  }

  static getInstance(): UserSettingsManager {
    if (!UserSettingsManager.instance) {
      UserSettingsManager.instance = new UserSettingsManager();
    }
    return UserSettingsManager.instance;
  }

  // 加载设置
  private loadSettings(): UserSettings {
    try {
      if (typeof window === 'undefined') {
        return DEFAULT_USER_SETTINGS;
      }

      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        return DEFAULT_USER_SETTINGS;
      }

      const parsed = JSON.parse(stored);
      // 合并默认设置，确保新字段有默认值
      return this.mergeWithDefaults(parsed);
    } catch (error) {
      console.warn('Failed to load user settings:', error);
      return DEFAULT_USER_SETTINGS;
    }
  }

  // 合并设置与默认值
  private mergeWithDefaults(settings: Partial<UserSettings>): UserSettings {
    return {
      processingMode: settings.processingMode ?? DEFAULT_USER_SETTINGS.processingMode,
      ui: {
        ...DEFAULT_USER_SETTINGS.ui,
        ...settings.ui,
      },
      defaults: {
        ...DEFAULT_USER_SETTINGS.defaults,
        ...settings.defaults,
      },
      features: {
        ...DEFAULT_USER_SETTINGS.features,
        ...settings.features,
      },
      theme: {
        ...DEFAULT_USER_SETTINGS.theme,
        ...settings.theme,
      },
    };
  }

  // 保存设置
  private saveSettings(): void {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.settings));
      }
    } catch (error) {
      console.warn('Failed to save user settings:', error);
    }
  }

  // 获取当前设置
  getSettings(): UserSettings {
    return { ...this.settings };
  }

  // 更新设置
  updateSettings(updates: Partial<UserSettings>): void {
    this.settings = this.mergeWithDefaults({
      ...this.settings,
      ...updates,
    });
    this.saveSettings();
    this.notifyListeners();
  }

  // 更新特定类别的设置
  updateCategorySettings(category: keyof UserSettings, updates: Partial<UserSettings[keyof UserSettings]>): void {
    this.settings = {
      ...this.settings,
      [category]: {
        ...(this.settings[category] as any),
        ...(updates as any),
      },
    };
    this.saveSettings();
    this.notifyListeners();
  }

  // 重置设置
  resetSettings(): void {
    this.settings = { ...DEFAULT_USER_SETTINGS };
    this.saveSettings();
    this.notifyListeners();
  }

  // 订阅设置变化
  subscribe(listener: (settings: UserSettings) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  // 通知监听器
  private notifyListeners(): void {
    this.listeners.forEach(listener => {
      try {
        listener(this.getSettings());
      } catch (error) {
        console.warn('Error in settings listener:', error);
      }
    });
  }

  // 获取特定设置值
  getSetting<K extends keyof UserSettings>(key: K): UserSettings[K] {
    return this.settings[key];
  }

  // 获取嵌套设置值
  getNestedSetting<K extends keyof UserSettings, T extends keyof UserSettings[K]>(
    category: K,
    key: T
  ): UserSettings[K][T] {
    return this.settings[category][key];
  }

  // 检查是否为单文件模式
  isSingleFileMode(): boolean {
    return this.settings.processingMode === 'single';
  }

  // 检查是否为批量模式
  isBatchMode(): boolean {
    return this.settings.processingMode === 'batch';
  }

  // 切换处理模式
  toggleProcessingMode(): void {
    this.updateSettings({
      processingMode: this.settings.processingMode === 'single' ? 'batch' : 'single',
    });
  }

  // 设置处理模式
  setProcessingMode(mode: 'single' | 'batch'): void {
    this.updateSettings({ processingMode: mode });
  }
}

// 导出单例实例
export const userSettings = UserSettingsManager.getInstance();
