/**
 * 用户设置Hook
 * 提供用户设置的响应式访问和更新
 */

import { useState, useEffect } from 'react';
import { UserSettings } from '@/types/user-settings';
import { userSettings } from '@/lib/user-settings';

export function useUserSettings() {
  const [settings, setSettings] = useState<UserSettings>(userSettings.getSettings());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 初始加载
    setSettings(userSettings.getSettings());
    setIsLoading(false);

    // 订阅设置变化
    const unsubscribe = userSettings.subscribe((newSettings) => {
      setSettings(newSettings);
    });

    return unsubscribe;
  }, []);

  const updateSettings = (updates: Partial<UserSettings>) => {
    userSettings.updateSettings(updates);
  };

  const updateCategorySettings = <K extends keyof UserSettings>(
    category: K,
    updates: Partial<UserSettings[K]>
  ) => {
    userSettings.updateCategorySettings(category, updates);
  };

  const resetSettings = () => {
    userSettings.resetSettings();
  };

  const isSingleFileMode = () => userSettings.isSingleFileMode();
  const isBatchMode = () => userSettings.isBatchMode();
  const toggleProcessingMode = () => userSettings.toggleProcessingMode();
  const setProcessingMode = (mode: 'single' | 'batch') => userSettings.setProcessingMode(mode);

  return {
    settings,
    isLoading,
    updateSettings,
    updateCategorySettings,
    resetSettings,
    isSingleFileMode,
    isBatchMode,
    toggleProcessingMode,
    setProcessingMode,
  };
}

