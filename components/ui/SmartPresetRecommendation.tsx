'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SmartPresetAnalyzer, FileAnalysis, SmartPreset } from '@/lib/smart-presets';
import { ImageFile } from '@/types/image';

interface SmartPresetRecommendationProps {
  files: ImageFile[];
  onPresetSelect: (preset: SmartPreset) => void;
  onApplyToAll: (preset: SmartPreset) => void;
  className?: string;
}

export default function SmartPresetRecommendation({
  files,
  onPresetSelect,
  onApplyToAll,
  className = ''
}: SmartPresetRecommendationProps) {
  const [analyses, setAnalyses] = useState<Map<string, FileAnalysis>>(new Map());
  const [recommendedPresets, setRecommendedPresets] = useState<SmartPreset[]>([]);
  const [selectedPreset, setSelectedPreset] = useState<SmartPreset | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // 分析文件并获取推荐预设
  useEffect(() => {
    if (files.length === 0) {
      setAnalyses(new Map());
      setRecommendedPresets([]);
      return;
    }

    const newAnalyses = new Map<string, FileAnalysis>();
    const allPresets = new Set<SmartPreset>();

    files.forEach(file => {
      const analysis = SmartPresetAnalyzer.analyzeFile(file);
      newAnalyses.set(file.id, analysis);
      
      const presets = SmartPresetAnalyzer.getMatchingPresets(file);
      presets.forEach(preset => allPresets.add(preset));
    });

    setAnalyses(newAnalyses);
    setRecommendedPresets(Array.from(allPresets).slice(0, 3)); // 只显示前3个推荐
  }, [files]);

  const handlePresetSelect = (preset: SmartPreset) => {
    setSelectedPreset(preset);
    onPresetSelect(preset);
  };

  const handleApplyToAll = () => {
    if (selectedPreset) {
      onApplyToAll(selectedPreset);
    }
  };

  const getFileAnalysis = (fileId: string): FileAnalysis | null => {
    return analyses.get(fileId) || null;
  };

  const getPresetIcon = (category: SmartPreset['category']) => {
    switch (category) {
      case 'quality':
        return '⭐';
      case 'size':
        return '📦';
      case 'web':
        return '🌐';
      case 'print':
        return '🖨️';
      case 'social':
        return '📱';
      default:
        return '⚙️';
    }
  };

  const getQualityColor = (quality: FileAnalysis['quality']) => {
    switch (quality) {
      case 'very-high':
        return 'text-purple-600 bg-purple-100';
      case 'high':
        return 'text-green-600 bg-green-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (files.length === 0 || recommendedPresets.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6 ${className}`}
    >
      {/* 标题区域 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              智能推荐设置
            </h3>
            <p className="text-sm text-gray-600">
              根据您的文件特征，我们为您推荐以下优化设置
            </p>
          </div>
        </div>
        
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
        >
          <svg className={`w-5 h-5 transform transition-transform duration-200 ${showDetails ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* 文件分析摘要 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{files.length}</div>
          <div className="text-sm text-gray-600">文件数量</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">
            {Array.from(analyses.values()).filter(a => a.type === 'photo').length}
          </div>
          <div className="text-sm text-gray-600">照片</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">
            {Array.from(analyses.values()).filter(a => a.type === 'graphic').length}
          </div>
          <div className="text-sm text-gray-600">图形</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">
            {Array.from(analyses.values()).filter(a => a.hasTransparency).length}
          </div>
          <div className="text-sm text-gray-600">透明</div>
        </div>
      </div>

      {/* 推荐预设 */}
      <div className="space-y-3">
        {recommendedPresets.map((preset, index) => (
          <motion.div
            key={preset.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
              selectedPreset?.id === preset.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
            onClick={() => handlePresetSelect(preset)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{getPresetIcon(preset.category)}</div>
                <div>
                  <h4 className="font-semibold text-gray-900">{preset.name}</h4>
                  <p className="text-sm text-gray-600">{preset.description}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    质量: {preset.settings.quality}%
                  </div>
                  <div className="text-xs text-gray-500">
                    {preset.settings.lossless ? '无损' : '有损'}
                  </div>
                </div>
                <div className={`w-3 h-3 rounded-full ${
                  selectedPreset?.id === preset.id ? 'bg-blue-500' : 'bg-gray-300'
                }`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 操作按钮 */}
      {selectedPreset && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 flex items-center justify-between"
        >
          <div className="text-sm text-gray-600">
            已选择: <span className="font-semibold text-blue-600">{selectedPreset.name}</span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => onPresetSelect(selectedPreset)}
              className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors duration-200"
            >
              应用设置
            </button>
            <button
              onClick={handleApplyToAll}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              应用到所有文件
            </button>
          </div>
        </motion.div>
      )}

      {/* 详细信息 */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-6 border-t border-blue-200 pt-6"
          >
            <h4 className="font-semibold text-gray-900 mb-4">文件分析详情</h4>
            <div className="space-y-3">
              {files.map(file => {
                const analysis = getFileAnalysis(file.id);
                if (!analysis) return null;

                return (
                  <div key={file.id} className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium text-gray-900 truncate">{file.name}</h5>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getQualityColor(analysis.quality)}`}>
                        {analysis.quality}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">类型:</span> {analysis.type}
                      </div>
                      <div>
                        <span className="font-medium">大小:</span> {analysis.size}
                      </div>
                      <div>
                        <span className="font-medium">宽高比:</span> {analysis.aspectRatio}
                      </div>
                      <div>
                        <span className="font-medium">透明度:</span> {analysis.hasTransparency ? '是' : '否'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

