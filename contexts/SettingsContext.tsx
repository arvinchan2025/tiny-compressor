/**
 * 设置上下文
 * 提供全局设置状态管理
 */

'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { GlobalSettings, DEFAULT_GLOBAL_SETTINGS } from '@/lib/settings/global-settings';
import { settingsStorage } from '@/lib/settings/settings-storage';

interface SettingsContextType {
  settings: GlobalSettings;
  updateSettings: (updates: Partial<GlobalSettings>) => void;
  updateFeature: (feature: keyof GlobalSettings['advancedFeatures'], value: boolean) => void;
  resetSettings: () => void;
  exportSettings: () => string;
  importSettings: (settingsJson: string) => boolean;
  isLoading: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

interface SettingsProviderProps {
  children: ReactNode;
}

export function SettingsProvider({ children }: SettingsProviderProps) {
  const [settings, setSettings] = useState<GlobalSettings>(DEFAULT_GLOBAL_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 加载设置
    const loadSettings = () => {
      try {
        const loadedSettings = settingsStorage.getSettings();
        setSettings(loadedSettings);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load settings:', error);
        setSettings(DEFAULT_GLOBAL_SETTINGS);
        setIsLoading(false);
      }
    };

    loadSettings();

    // 订阅设置变化
    const unsubscribe = settingsStorage.subscribe((newSettings) => {
      setSettings(newSettings);
    });

    return unsubscribe;
  }, []);

  const updateSettings = (updates: Partial<GlobalSettings>) => {
    try {
      settingsStorage.updateSettings(updates);
    } catch (error) {
      console.error('Failed to update settings:', error);
    }
  };

  const updateFeature = (feature: keyof GlobalSettings['advancedFeatures'], value: boolean) => {
    try {
      settingsStorage.updateFeature(feature, value);
    } catch (error) {
      console.error('Failed to update feature:', error);
    }
  };

  const resetSettings = () => {
    try {
      settingsStorage.resetSettings();
    } catch (error) {
      console.error('Failed to reset settings:', error);
    }
  };

  const exportSettings = () => {
    try {
      return settingsStorage.exportSettings();
    } catch (error) {
      console.error('Failed to export settings:', error);
      return '';
    }
  };

  const importSettings = (settingsJson: string) => {
    try {
      return settingsStorage.importSettings(settingsJson);
    } catch (error) {
      console.error('Failed to import settings:', error);
      return false;
    }
  };

  const value: SettingsContextType = {
    settings,
    updateSettings,
    updateFeature,
    resetSettings,
    exportSettings,
    importSettings,
    isLoading
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): SettingsContextType {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}

// 便捷的hooks
export function useFeatureAccess() {
  const { settings } = useSettings();
  
  const canUse = (feature: keyof GlobalSettings['advancedFeatures']): boolean => {
    return settings.advancedFeatures[feature];
  };

  const getAvailableFeatures = (): string[] => {
    return Object.entries(settings.advancedFeatures)
      .filter(([_, enabled]) => enabled)
      .map(([feature, _]) => feature);
  };

  return {
    canUse,
    getAvailableFeatures,
    settings: settings.advancedFeatures
  };
}

export function useProcessingMode() {
  const { settings, updateSettings } = useSettings();
  
  const setDefaultMode = (mode: 'single' | 'batch') => {
    updateSettings({
      processingMode: {
        ...settings.processingMode,
        defaultMode: mode
      }
    });
  };

  const setAutoDetect = (enabled: boolean) => {
    updateSettings({
      processingMode: {
        ...settings.processingMode,
        autoDetect: enabled
      }
    });
  };

  const setRememberPreference = (enabled: boolean) => {
    updateSettings({
      processingMode: {
        ...settings.processingMode,
        rememberPreference: enabled
      }
    });
  };

  return {
    mode: settings.processingMode.defaultMode,
    autoDetect: settings.processingMode.autoDetect,
    rememberPreference: settings.processingMode.rememberPreference,
    setDefaultMode,
    setAutoDetect,
    setRememberPreference
  };
}

export function usePageSettings(pageType: 'compressor' | 'converter') {
  const { settings, updateSettings } = useSettings();
  
  const pageSettings = pageType === 'compressor' ? settings.compressor : settings.converter;
  
  const updatePageSettings = (updates: Partial<typeof pageSettings>) => {
    updateSettings({
      [pageType]: {
        ...pageSettings,
        ...updates
      }
    });
  };

  return {
    settings: pageSettings,
    updateSettings: updatePageSettings
  };
}
