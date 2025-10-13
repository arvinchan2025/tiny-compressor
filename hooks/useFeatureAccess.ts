/**
 * 功能访问权限Hook
 * 提供功能权限检查和使用限制管理
 */

import { useCallback } from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { featurePermissions, FeatureLimitations } from '@/lib/permissions/feature-permissions';

export interface UseFeatureAccessReturn {
  canUse: (feature: keyof import('@/lib/settings/global-settings').AdvancedFeatures) => boolean;
  getAvailableFeatures: () => string[];
  getLimitations: () => FeatureLimitations;
  canProcessFiles: (fileCount: number) => { allowed: boolean; reason?: string };
  canProcessFileSize: (fileSize: number) => { allowed: boolean; reason?: string };
  canProcessToday: () => { allowed: boolean; reason?: string };
  canProcessFormat: (format: string) => { allowed: boolean; reason?: string };
  canUseBatchProcessing: () => { allowed: boolean; reason?: string };
  canUseAdvancedSettings: () => { allowed: boolean; reason?: string };
  canUseCustomPresets: () => { allowed: boolean; reason?: string };
  recordFileProcessing: (fileCount: number) => void;
  getUsageStats: () => import('@/lib/permissions/feature-permissions').UsageStats;
  getUpgradeHint: (feature: string) => string;
}

export function useFeatureAccess(): UseFeatureAccessReturn {
  const { settings } = useSettings();

  const canUse = useCallback((feature: keyof import('@/lib/settings/global-settings').AdvancedFeatures) => {
    return featurePermissions.canUse(feature, settings);
  }, [settings]);

  const getAvailableFeatures = useCallback(() => {
    return featurePermissions.getAvailableFeatures(settings);
  }, [settings]);

  const getLimitations = useCallback(() => {
    return featurePermissions.getLimitations(settings);
  }, [settings]);

  const canProcessFiles = useCallback((fileCount: number) => {
    return featurePermissions.canProcessFiles(fileCount, settings);
  }, [settings]);

  const canProcessFileSize = useCallback((fileSize: number) => {
    return featurePermissions.canProcessFileSize(fileSize, settings);
  }, [settings]);

  const canProcessToday = useCallback(() => {
    return featurePermissions.canProcessToday(settings);
  }, [settings]);

  const canProcessFormat = useCallback((format: string) => {
    return featurePermissions.canProcessFormat(format, settings);
  }, [settings]);

  const canUseBatchProcessing = useCallback(() => {
    return featurePermissions.canUseBatchProcessing(settings);
  }, [settings]);

  const canUseAdvancedSettings = useCallback(() => {
    return featurePermissions.canUseAdvancedSettings(settings);
  }, [settings]);

  const canUseCustomPresets = useCallback(() => {
    return featurePermissions.canUseCustomPresets(settings);
  }, [settings]);

  const recordFileProcessing = useCallback((fileCount: number) => {
    featurePermissions.recordFileProcessing(fileCount);
  }, []);

  const getUsageStats = useCallback(() => {
    return featurePermissions.getUsageStats();
  }, []);

  const getUpgradeHint = useCallback((feature: string) => {
    return featurePermissions.getUpgradeHint(feature);
  }, []);

  return {
    canUse,
    getAvailableFeatures,
    getLimitations,
    canProcessFiles,
    canProcessFileSize,
    canProcessToday,
    canProcessFormat,
    canUseBatchProcessing,
    canUseAdvancedSettings,
    canUseCustomPresets,
    recordFileProcessing,
    getUsageStats,
    getUpgradeHint
  };
}

// 便捷的权限检查Hook
export function useBatchProcessingAccess() {
  const { canUseBatchProcessing, getUpgradeHint } = useFeatureAccess();
  
  return {
    canUse: canUseBatchProcessing(),
    upgradeHint: getUpgradeHint('batchProcessing')
  };
}

export function useAdvancedSettingsAccess() {
  const { canUseAdvancedSettings, getUpgradeHint } = useFeatureAccess();
  
  return {
    canUse: canUseAdvancedSettings(),
    upgradeHint: getUpgradeHint('advancedSettings')
  };
}

export function useCustomPresetsAccess() {
  const { canUseCustomPresets, getUpgradeHint } = useFeatureAccess();
  
  return {
    canUse: canUseCustomPresets(),
    upgradeHint: getUpgradeHint('customPresets')
  };
}

// 文件处理权限检查Hook
export function useFileProcessingAccess() {
  const {
    canProcessFiles,
    canProcessFileSize,
    canProcessToday,
    canProcessFormat,
    recordFileProcessing,
    getUsageStats
  } = useFeatureAccess();

  const validateFiles = useCallback((files: File[]) => {
    const results = files.map(file => {
      const sizeCheck = canProcessFileSize(file.size);
      const formatCheck = canProcessFormat(file.name.split('.').pop() || '');
      
      return {
        file,
        valid: sizeCheck.allowed && formatCheck.allowed,
        errors: [
          ...(sizeCheck.reason ? [sizeCheck.reason] : []),
          ...(formatCheck.reason ? [formatCheck.reason] : [])
        ]
      };
    });

    const validFiles = results.filter(r => r.valid).map(r => r.file);
    const invalidFiles = results.filter(r => !r.valid);

    return {
      validFiles,
      invalidFiles,
      canProcess: validFiles.length > 0 && canProcessFiles(validFiles.length).allowed && canProcessToday().allowed
    };
  }, [canProcessFiles, canProcessFileSize, canProcessFormat, canProcessToday]);

  return {
    validateFiles,
    recordFileProcessing,
    getUsageStats,
    canProcessFiles,
    canProcessFileSize,
    canProcessToday,
    canProcessFormat
  };
}
