'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Zap, Wand2, Sliders } from 'lucide-react';
import imageCompression from 'browser-image-compression';
import { Translations } from '@/lib/i18n';

interface CompressionSettingsProps {
  settings: {
    quality: number;
    maxWidth: number;
    maxHeight: number;
    format: 'jpeg' | 'png' | 'webp';
  };
  onSettingsChange: (settings: { quality: number; maxWidth: number; maxHeight: number; format: 'jpeg' | 'png' | 'webp' }) => void;
  onCompress: () => void;
  isCompressing: boolean;
  files: File[];
  onCompressionComplete: (results: { file: File; originalSize: number; compressedSize: number }[]) => void;
  translations: Translations;
}

export default function CompressionSettings({
  settings,
  onSettingsChange,
  onCompress,
  isCompressing,
  files,
  onCompressionComplete,
  translations
}: CompressionSettingsProps) {
  const [compressionMode, setCompressionMode] = useState<'quick' | 'custom'>('quick');
  const [compressionProgress, setCompressionProgress] = useState(0);
  const [currentFile, setCurrentFile] = useState<string>('');

  const quickCompressSettings = {
    quality: 0.8,
    maxWidth: 1920,
    maxHeight: 1080,
    format: 'jpeg' as 'jpeg' | 'png' | 'webp'
  };

  const handleCompress = async () => {
    onCompress();
    setCompressionProgress(0);
    
    try {
      const results = [];
      const currentSettings = compressionMode === 'quick' ? quickCompressSettings : settings;
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setCurrentFile(file.name);
        setCompressionProgress((i / files.length) * 100);
        // Get original file format
        const originalFormat = file.type.split('/')[1];
        
        // Determine the target format - keep original format unless explicitly changed in custom mode
        let targetFormat = originalFormat;
        if (compressionMode === 'custom' && settings.format !== 'jpeg') {
          targetFormat = settings.format;
        } else if (compressionMode === 'custom' && settings.format === 'jpeg' && originalFormat !== 'jpeg') {
          targetFormat = 'jpeg';
        }
        
        const options = {
          maxSizeMB: compressionMode === 'quick' ? 0.5 : 0.3,
          maxWidthOrHeight: Math.max(currentSettings.maxWidth, currentSettings.maxHeight),
          useWebWorker: true,
          fileType: `image/${targetFormat}`,
          initialQuality: currentSettings.quality,
          alwaysKeepResolution: false,
          preserveExif: false,
        };

        const compressedFile = await imageCompression(file, options);
        
        // Create a new file with the correct name and format
        const fileName = file.name.split('.')[0];
        const fileExtension = targetFormat === 'jpeg' ? 'jpg' : targetFormat;
        const newFileName = `${fileName}_compressed.${fileExtension}`;
        
        const finalFile = new File([compressedFile], newFileName, {
          type: `image/${targetFormat}`,
        });
        
        results.push({
          file: finalFile,
          originalSize: file.size,
          compressedSize: finalFile.size
        });
      }
      
      setCompressionProgress(100);
      setCurrentFile('');
      onCompressionComplete(results);
    } catch (error) {
      console.error('Compression failed:', error);
      setCompressionProgress(0);
      setCurrentFile('');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-elevated"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl">
            <Settings className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-neutral-900">
            {translations.compression.title}
          </h2>
        </div>
        
        {/* Mode Toggle */}
        <div className="flex items-center bg-neutral-100 rounded-xl p-1">
          <button
            onClick={() => setCompressionMode('quick')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
              compressionMode === 'quick'
                ? 'bg-white shadow-sm text-primary-600'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Wand2 className="w-4 h-4" />
            <span className="font-medium">{translations.compression.mode.quick}</span>
          </button>
          <button
            onClick={() => setCompressionMode('custom')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
              compressionMode === 'custom'
                ? 'bg-white shadow-sm text-primary-600'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span className="font-medium">{translations.compression.mode.custom}</span>
          </button>
        </div>
      </div>

      <AnimatePresence mode="popLayout">
        {compressionMode === 'quick' ? (
          <motion.div
            key="quick"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="space-y-6"
          >
            {/* Quick Mode */}
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                {translations.compression.quickMode.title}
              </h3>
              <p className="text-neutral-600 mb-4 max-w-md mx-auto">
                {translations.compression.quickMode.description}
              </p>
              <p className="text-sm text-primary-600 font-medium">
                {translations.compression.quickMode.formatNote}
              </p>
              
              {/* Quick Settings Preview */}
              <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-xl p-6 mb-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary-600">80%</div>
                    <div className="text-sm text-neutral-600">Quality</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-accent-600">1920px</div>
                    <div className="text-sm text-neutral-600">Max Width</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-success-600">Original</div>
                    <div className="text-sm text-neutral-600">Format</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="custom"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Custom Mode */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-neutral-900">
                {translations.compression.customMode.title}
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    {translations.compression.customMode.quality}: {Math.round(settings.quality * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.1"
                    value={settings.quality}
                    onChange={(e) => onSettingsChange({ ...settings, quality: parseFloat(e.target.value) })}
                    className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer slider"
                    disabled={isCompressing}
                  />
                  <div className="flex justify-between text-xs text-neutral-500 mt-1">
                    <span>Low Quality (Smaller)</span>
                    <span>High Quality (Larger)</span>
                  </div>
                  <p className="text-xs text-neutral-500 mt-1">
                    {settings.quality <= 0.3 ? translations.compression.customMode.qualityDescription.low :
                     settings.quality <= 0.6 ? translations.compression.customMode.qualityDescription.medium :
                     translations.compression.customMode.qualityDescription.high}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    {translations.compression.customMode.maxWidth}: {settings.maxWidth}px
                  </label>
                  <input
                    type="range"
                    min="100"
                    max="4000"
                    step="100"
                    value={settings.maxWidth}
                    onChange={(e) => onSettingsChange({ ...settings, maxWidth: parseInt(e.target.value) })}
                    className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer slider"
                    disabled={isCompressing}
                  />
                  <div className="flex justify-between text-xs text-neutral-500 mt-1">
                    <span>100px</span>
                    <span>4000px</span>
                  </div>
                  <p className="text-xs text-neutral-500 mt-1">
                    {settings.maxWidth <= 800 ? translations.compression.customMode.sizeDescription.small :
                     settings.maxWidth <= 1920 ? translations.compression.customMode.sizeDescription.medium :
                     translations.compression.customMode.sizeDescription.large}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    {translations.compression.customMode.maxHeight}: {settings.maxHeight}px
                  </label>
                  <input
                    type="range"
                    min="100"
                    max="4000"
                    step="100"
                    value={settings.maxHeight}
                    onChange={(e) => onSettingsChange({ ...settings, maxHeight: parseInt(e.target.value) })}
                    className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer slider"
                    disabled={isCompressing}
                  />
                  <div className="flex justify-between text-xs text-neutral-500 mt-1">
                    <span>100px</span>
                    <span>4000px</span>
                  </div>
                  <p className="text-xs text-neutral-500 mt-1">
                    {settings.maxHeight <= 600 ? translations.compression.customMode.sizeDescription.small :
                     settings.maxHeight <= 1080 ? translations.compression.customMode.sizeDescription.medium :
                     translations.compression.customMode.sizeDescription.large}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    {translations.compression.customMode.format}
                  </label>
                  <select
                    value={settings.format}
                    onChange={(e) => onSettingsChange({ ...settings, format: e.target.value as 'jpeg' | 'png' | 'webp' })}
                    className="input-field"
                    disabled={isCompressing}
                  >
                    <option value="jpeg">JPEG (Best for photos)</option>
                    <option value="png">PNG (Best for graphics with transparency)</option>
                    <option value="webp">WebP (Best compression, modern browsers)</option>
                  </select>
                  <p className="text-xs text-neutral-500 mt-1">
                    {settings.format === 'jpeg' ? translations.compression.customMode.formatDescription.jpeg :
                     settings.format === 'png' ? translations.compression.customMode.formatDescription.png :
                     translations.compression.customMode.formatDescription.webp}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Bar */}
      {isCompressing && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-6"
        >
          <div className="bg-neutral-100 rounded-full h-2 mb-2">
            <motion.div
              className="bg-gradient-to-r from-primary-500 to-accent-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${compressionProgress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <div className="flex justify-between text-sm text-neutral-600">
            <span>{Math.round(compressionProgress)}% complete</span>
            {currentFile && (
              <span className="truncate max-w-48">Processing: {currentFile}</span>
            )}
          </div>
        </motion.div>
      )}

      {/* Compress Button */}
      <div className="flex items-center justify-between pt-6 border-t border-neutral-200">
        <div className="text-sm text-neutral-600">
          {files.length} file{files.length !== 1 ? 's' : ''} ready to compress
        </div>
        
        <motion.button
          onClick={handleCompress}
          disabled={isCompressing || files.length === 0}
          className={`btn-primary flex items-center space-x-2 ${
            compressionMode === 'quick' ? 'btn-accent' : ''
          }`}
          whileHover={{ scale: isCompressing ? 1 : 1.05 }}
          whileTap={{ scale: isCompressing ? 1 : 0.95 }}
        >
          {isCompressing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              <span>{translations.compression.customMode.compressing}</span>
            </>
          ) : (
            <>
              {compressionMode === 'quick' ? (
                <Zap className="w-4 h-4" />
              ) : (
                <Settings className="w-4 h-4" />
              )}
              <span>
                {compressionMode === 'quick' 
                  ? translations.compression.quickMode.compress 
                  : translations.compression.customMode.compress
                }
              </span>
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}