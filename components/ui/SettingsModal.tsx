/**
 * 设置弹窗组件
 * 使用Portal渲染到document.body，避免容器限制
 */

'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, RotateCcw, Monitor, Smartphone, Palette, Zap } from 'lucide-react';
import { UserSettings, DEFAULT_USER_SETTINGS } from '@/types/user-settings';
import { userSettings } from '@/lib/user-settings';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  translations?: {
    settings: string;
    processingMode: string;
    singleFile: string;
    batchMode: string;
    ui: string;
    advancedSettings: string;
    batchOperations: string;
    smartPresets: string;
    fileThumbnails: string;
    compactMode: string;
    defaults: string;
    compressionQuality: string;
    conversionFormat: string;
    preserveMetadata: string;
    optimizeForWeb: string;
    features: string;
    dragDrop: string;
    keyboardShortcuts: string;
    autoSave: string;
    progressNotifications: string;
    theme: string;
    colorScheme: string;
    light: string;
    dark: string;
    auto: string;
    accentColor: string;
    save: string;
    reset: string;
    close: string;
  };
}

const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, 
  onClose, 
  translations = {} 
}) => {
  const [currentSettings, setCurrentSettings] = useState<UserSettings>(DEFAULT_USER_SETTINGS);
  const [hasChanges, setHasChanges] = useState(false);
  const [mounted, setMounted] = useState(false);

  // 确保组件在客户端渲染
  useEffect(() => {
    setMounted(true);
  }, []);

  // 加载设置
  useEffect(() => {
    if (!mounted) return;
    
    const loadSettings = () => {
      const settings = userSettings.getSettings();
      setCurrentSettings(settings);
    };

    loadSettings();
    
    // 订阅设置变化
    const unsubscribe = userSettings.subscribe(loadSettings);
    return unsubscribe;
  }, [mounted]);

  // 检查是否有变化
  useEffect(() => {
    if (!mounted) return;
    
    const originalSettings = userSettings.getSettings();
    setHasChanges(JSON.stringify(currentSettings) !== JSON.stringify(originalSettings));
  }, [currentSettings, mounted]);

  // 更新设置
  const updateSetting = <K extends keyof UserSettings>(
    category: K,
    key: keyof UserSettings[K],
    value: UserSettings[K][keyof UserSettings[K]]
  ) => {
    setCurrentSettings(prev => ({
      ...prev,
      [category]: {
        ...(prev[category] as any),
        [key]: value,
      },
    }));
  };

  // 保存设置
  const handleSave = () => {
    userSettings.updateSettings(currentSettings);
    setHasChanges(false);
  };

  // 重置设置
  const handleReset = () => {
    setCurrentSettings(DEFAULT_USER_SETTINGS);
  };

  // 关闭设置面板
  const handleClose = () => {
    if (hasChanges) {
      if (confirm(translations.save || 'Save changes before closing?')) {
        handleSave();
      }
    }
    onClose();
  };

  // 处理ESC键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, hasChanges]);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", bounce: 0.2, duration: 0.3 }}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden relative flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 头部 */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
              <h2 className="text-xl font-semibold text-gray-900">
                {translations.settings || 'Settings'}
              </h2>
              <button
                onClick={handleClose}
                className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 设置内容 */}
            <div className="p-6 overflow-y-auto flex-1 min-h-0">
              <div className="space-y-6">
                {/* 处理模式 */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <Zap className="w-5 h-5 mr-2 text-blue-600" />
                    {translations.processingMode || 'Processing Mode'}
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="relative cursor-pointer">
                      <input
                        type="radio"
                        name="processingMode"
                        value="single"
                        checked={currentSettings.processingMode === 'single'}
                        onChange={(e) => setCurrentSettings(prev => ({ ...prev, processingMode: e.target.value as 'single' | 'batch' }))}
                        className="sr-only"
                      />
                      <div className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                        currentSettings.processingMode === 'single'
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}>
                        <div className="text-center">
                          <div className="text-sm font-medium text-gray-900">
                            {translations.singleFile || 'Single File'}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            Process one file at a time
                          </div>
                        </div>
                      </div>
                    </label>
                    <label className="relative cursor-pointer">
                      <input
                        type="radio"
                        name="processingMode"
                        value="batch"
                        checked={currentSettings.processingMode === 'batch'}
                        onChange={(e) => setCurrentSettings(prev => ({ ...prev, processingMode: e.target.value as 'single' | 'batch' }))}
                        className="sr-only"
                      />
                      <div className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                        currentSettings.processingMode === 'batch'
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}>
                        <div className="text-center">
                          <div className="text-sm font-medium text-gray-900">
                            {translations.batchMode || 'Batch Mode'}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            Process multiple files
                          </div>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* 界面设置 */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <Monitor className="w-5 h-5 mr-2 text-green-600" />
                    {translations.ui || 'Interface'}
                  </h3>
                  <div className="space-y-3">
                    {[
                      { key: 'showAdvancedSettings', label: translations.advancedSettings || 'Advanced Settings', isAdvanced: true },
                      { key: 'showBatchOperations', label: translations.batchOperations || 'Batch Operations', isAdvanced: true },
                      { key: 'showSmartPresets', label: translations.smartPresets || 'Smart Presets', isAdvanced: true },
                      { key: 'showFileThumbnails', label: translations.fileThumbnails || 'File Thumbnails', isAdvanced: true },
                      { key: 'compactMode', label: translations.compactMode || 'Compact Mode', isAdvanced: false },
                    ].map(({ key, label, isAdvanced }) => (
                      <label key={key} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="text-sm text-gray-700">{label}</span>
                          {isAdvanced && (
                            <span className="ml-2 px-2 py-0.5 text-xs font-medium text-purple-600 bg-purple-100 rounded-full">
                              Advanced
                            </span>
                          )}
                        </div>
                        <input
                          type="checkbox"
                          checked={currentSettings.ui[key as keyof typeof currentSettings.ui] as boolean}
                          onChange={(e) => updateSetting('ui', key as keyof typeof currentSettings.ui, e.target.checked)}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </label>
                    ))}
                  </div>
                </div>

                {/* 默认设置 */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <Zap className="w-5 h-5 mr-2 text-purple-600" />
                    {translations.defaults || 'Defaults'}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {translations.compressionQuality || 'Compression Quality'}
                      </label>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        value={currentSettings.defaults.compressionQuality}
                        onChange={(e) => updateSetting('defaults', 'compressionQuality', parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>10%</span>
                        <span className="font-medium">{currentSettings.defaults.compressionQuality}%</span>
                        <span>100%</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { key: 'preserveMetadata', label: translations.preserveMetadata || 'Preserve Metadata' },
                        { key: 'optimizeForWeb', label: translations.optimizeForWeb || 'Optimize for Web' },
                      ].map(({ key, label }) => (
                        <label key={key} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={currentSettings.defaults[key as keyof typeof currentSettings.defaults] as boolean}
                            onChange={(e) => updateSetting('defaults', key as keyof typeof currentSettings.defaults, e.target.checked)}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 mr-2"
                          />
                          <span className="text-sm text-gray-700">{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 功能开关 */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <Zap className="w-5 h-5 mr-2 text-yellow-600" />
                    {translations.features || 'Features'}
                  </h3>
                  <div className="space-y-3">
                    {[
                      { key: 'enableDragDrop', label: translations.dragDrop || 'Drag & Drop', isAdvanced: false },
                      { key: 'enableKeyboardShortcuts', label: translations.keyboardShortcuts || 'Keyboard Shortcuts', isAdvanced: true },
                      { key: 'enableAutoSave', label: translations.autoSave || 'Auto Save', isAdvanced: true },
                      { key: 'enableProgressNotifications', label: translations.progressNotifications || 'Progress Notifications', isAdvanced: false },
                    ].map(({ key, label, isAdvanced }) => (
                      <label key={key} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="text-sm text-gray-700">{label}</span>
                          {isAdvanced && (
                            <span className="ml-2 px-2 py-0.5 text-xs font-medium text-purple-600 bg-purple-100 rounded-full">
                              Advanced
                            </span>
                          )}
                        </div>
                        <input
                          type="checkbox"
                          checked={currentSettings.features[key as keyof typeof currentSettings.features] as boolean}
                          onChange={(e) => updateSetting('features', key as keyof typeof currentSettings.features, e.target.checked)}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 底部操作按钮 */}
            <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
              <button
                onClick={handleReset}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                {translations.reset || 'Reset'}
              </button>
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {translations.close || 'Close'}
                </button>
                <button
                  onClick={handleSave}
                  disabled={!hasChanges}
                  className={`flex items-center px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    hasChanges
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {translations.save || 'Save'}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default SettingsModal;

