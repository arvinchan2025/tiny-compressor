/**
 * 用户设置类型定义
 * 定义用户个性化设置的数据结构
 */

export interface UserSettings {
  // 处理模式
  processingMode: 'single' | 'batch';
  
  // 界面设置
  ui: {
    showAdvancedSettings: boolean;
    showBatchOperations: boolean;
    showSmartPresets: boolean;
    showFileThumbnails: boolean;
    compactMode: boolean;
  };
  
  // 默认设置
  defaults: {
    compressionQuality: number;
    conversionFormat: string;
    preserveMetadata: boolean;
    optimizeForWeb: boolean;
  };
  
  // 功能开关
  features: {
    enableDragDrop: boolean;
    enableKeyboardShortcuts: boolean;
    enableAutoSave: boolean;
    enableProgressNotifications: boolean;
  };
  
  // 主题设置
  theme: {
    colorScheme: 'light' | 'dark' | 'auto';
    accentColor: string;
  };
}

export const DEFAULT_USER_SETTINGS: UserSettings = {
  processingMode: 'single',
  ui: {
    showAdvancedSettings: false,
    showBatchOperations: false,
    showSmartPresets: false,
    showFileThumbnails: false,
    compactMode: false,
  },
  defaults: {
    compressionQuality: 85,
    conversionFormat: 'jpeg',
    preserveMetadata: true,
    optimizeForWeb: true,
  },
  features: {
    enableDragDrop: true,
    enableKeyboardShortcuts: false,
    enableAutoSave: false,
    enableProgressNotifications: true,
  },
  theme: {
    colorScheme: 'light',
    accentColor: 'blue',
  },
};

export type SettingCategory = 'processing' | 'ui' | 'defaults' | 'features' | 'theme';
export type ProcessingMode = 'single' | 'batch';
