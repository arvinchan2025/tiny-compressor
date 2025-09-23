'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SettingOption {
  id: string;
  name: string;
  description: string;
  value: any;
  type: 'range' | 'toggle' | 'select' | 'preset';
  options?: { value: any; label: string }[];
  min?: number;
  max?: number;
  step?: number;
}

interface Preset {
  id: string;
  name: string;
  description: string;
  icon: string;
  settings: Record<string, any>;
  recommended?: boolean;
}

interface SimplifiedSettingsPanelProps {
  title: string;
  presets: Preset[];
  settings: SettingOption[];
  onPresetSelect: (preset: Preset) => void;
  onSettingChange: (settingId: string, value: any) => void;
  currentPreset?: string;
  className?: string;
  showAdvanced?: boolean;
  onToggleAdvanced?: () => void;
}

export default function SimplifiedSettingsPanel({
  title,
  presets,
  settings,
  onPresetSelect,
  onSettingChange,
  currentPreset,
  className = '',
  showAdvanced = false,
  onToggleAdvanced
}: SimplifiedSettingsPanelProps) {
  const [selectedPreset, setSelectedPreset] = useState<string>(currentPreset || presets[0]?.id || '');

  const handlePresetSelect = (preset: Preset) => {
    setSelectedPreset(preset.id);
    onPresetSelect(preset);
  };

  const renderSetting = (setting: SettingOption) => {
    switch (setting.type) {
      case 'range':
        return (
          <div key={setting.id} className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-700">
                {setting.name}
              </label>
              <span className="text-sm text-gray-500">{setting.value}%</span>
            </div>
            <input
              type="range"
              min={setting.min || 0}
              max={setting.max || 100}
              step={setting.step || 1}
              value={setting.value}
              onChange={(e) => onSettingChange(setting.id, parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <p className="text-xs text-gray-500">{setting.description}</p>
          </div>
        );

      case 'toggle':
        return (
          <div key={setting.id} className="flex items-center justify-between">
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700">
                {setting.name}
              </label>
              <p className="text-xs text-gray-500">{setting.description}</p>
            </div>
            <button
              onClick={() => onSettingChange(setting.id, !setting.value)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                setting.value ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                  setting.value ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        );

      case 'select':
        return (
          <div key={setting.id} className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              {setting.name}
            </label>
            <select
              value={setting.value}
              onChange={(e) => onSettingChange(setting.id, e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {setting.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500">{setting.description}</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`bg-white rounded-xl border border-gray-200 ${className}`}>
      {/* 标题 */}
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-600 mt-1">Choose your preferred settings</p>
      </div>

      {/* 预设选择 */}
      <div className="p-6">
        <h4 className="text-sm font-medium text-gray-700 mb-4">Quick Presets</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {presets.map((preset) => (
            <motion.button
              key={preset.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handlePresetSelect(preset)}
              className={`p-4 text-left border rounded-lg transition-all duration-200 ${
                selectedPreset === preset.id
                  ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="text-2xl">{preset.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h5 className="font-medium text-gray-800">{preset.name}</h5>
                    {preset.recommended && (
                      <span className="px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded-full">
                        Recommended
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{preset.description}</p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* 高级设置切换 */}
      {onToggleAdvanced && (
        <div className="px-6 pb-4">
          <button
            onClick={onToggleAdvanced}
            className="flex items-center text-blue-600 hover:text-blue-700 transition-colors duration-200"
          >
            <svg 
              className={`w-4 h-4 mr-2 transition-transform duration-200 ${showAdvanced ? 'rotate-90' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            Advanced Settings
          </button>
        </div>
      )}

      {/* 高级设置面板 */}
      <AnimatePresence>
        {showAdvanced && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-gray-200"
          >
            <div className="p-6 space-y-6">
              {settings.map((setting) => renderSetting(setting))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

