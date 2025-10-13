/**
 * 高级设置面板组件
 * 只在高级模式下显示的自定义参数设置
 */

'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CompressionSettings {
  quality: number;
  keepMetadata: boolean;
  removeUnusedColors: boolean;
  optimizationLevel: number;
}

interface AdvancedSettingsPanelProps {
  settings: CompressionSettings;
  onSettingsChange: (settings: CompressionSettings) => void;
}

export default function AdvancedSettingsPanel({ 
  settings, 
  onSettingsChange 
}: AdvancedSettingsPanelProps) {
  
  const qualityOptions = [
    { value: 1, label: 'Maximum', desc: 'Smallest file size', color: 'red' },
    { value: 3, label: 'High', desc: 'Good compression', color: 'orange' },
    { value: 6, label: 'Balanced', desc: 'Recommended', color: 'blue' },
    { value: 9, label: 'High Quality', desc: 'Larger file size', color: 'green' }
  ];

  const optimizationLevels = [
    { value: 1, label: 'Fast', desc: 'Quick processing' },
    { value: 2, label: 'Balanced', desc: 'Good quality/speed' },
    { value: 3, label: 'Maximum', desc: 'Best compression' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="overflow-hidden"
    >
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200 mt-4">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
            <span className="text-white text-sm">⚙️</span>
          </div>
          <h3 className="text-lg font-semibold text-slate-800">Advanced Settings</h3>
        </div>

        {/* Quality Settings */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-3">
            Compression Quality
          </label>
          <div className="grid grid-cols-2 gap-3">
            {qualityOptions.map((option) => (
              <motion.button
                key={option.value}
                onClick={() => onSettingsChange({ ...settings, quality: option.value })}
                className={`p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                  settings.quality === option.value
                    ? `border-${option.color}-500 bg-${option.color}-50`
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-slate-800">{option.label}</span>
                  <span className={`w-3 h-3 rounded-full bg-${option.color}-500`}></span>
                </div>
                <p className="text-xs text-slate-600">{option.desc}</p>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Optimization Level */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-3">
            Optimization Level
          </label>
          <div className="space-y-2">
            {optimizationLevels.map((level) => (
              <motion.button
                key={level.value}
                onClick={() => onSettingsChange({ ...settings, optimizationLevel: level.value })}
                className={`w-full p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                  settings.optimizationLevel === level.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium text-slate-800">{level.label}</span>
                    <p className="text-xs text-slate-600">{level.desc}</p>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    settings.optimizationLevel === level.value
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-slate-300'
                  }`}></div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Additional Options */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-slate-700">Keep Metadata</label>
              <p className="text-xs text-slate-600">Preserve EXIF and other metadata</p>
            </div>
            <button
              onClick={() => onSettingsChange({ ...settings, keepMetadata: !settings.keepMetadata })}
              className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                settings.keepMetadata ? 'bg-blue-500' : 'bg-slate-300'
              }`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                settings.keepMetadata ? 'translate-x-7' : 'translate-x-1'
              }`}></div>
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-slate-700">Remove Unused Colors</label>
              <p className="text-xs text-slate-600">Optimize color palette for smaller files</p>
            </div>
            <button
              onClick={() => onSettingsChange({ ...settings, removeUnusedColors: !settings.removeUnusedColors })}
              className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                settings.removeUnusedColors ? 'bg-blue-500' : 'bg-slate-300'
              }`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                settings.removeUnusedColors ? 'translate-x-7' : 'translate-x-1'
              }`}></div>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}