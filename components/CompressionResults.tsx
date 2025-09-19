'use client';

import { motion } from 'framer-motion';
import { Download, RotateCcw, CheckCircle, TrendingDown, Archive } from 'lucide-react';
import { Translations } from '@/lib/translations';
import JSZip from 'jszip';

interface CompressionResultsProps {
  results: { file: File; originalSize: number; compressedSize: number }[];
  onReset: () => void;
  translations: Translations;
}

export default function CompressionResults({ results, onReset, translations }: CompressionResultsProps) {

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getCompressionRatio = (original: number, compressed: number) => {
    return Math.round(((original - compressed) / original) * 100);
  };

  const getTotalSavings = () => {
    const totalOriginal = results.reduce((sum, result) => sum + result.originalSize, 0);
    const totalCompressed = results.reduce((sum, result) => sum + result.compressedSize, 0);
    return { original: totalOriginal, compressed: totalCompressed };
  };

  const downloadFile = (file: File) => {
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadAllFiles = async () => {
    const zip = new JSZip();
    
    // Add all compressed files to the zip
    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      const fileData = await result.file.arrayBuffer();
      zip.file(result.file.name, fileData);
    }
    
    // Generate and download the zip file
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'compressed-images.zip';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const totalSavings = getTotalSavings();
  const totalCompressionRatio = getCompressionRatio(totalSavings.original, totalSavings.compressed);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <CheckCircle className="w-6 h-6 text-green-500" />
        <h2 className="text-2xl font-bold text-gray-900">
          {translations.results.title}
        </h2>
        </div>
        <button
          onClick={onReset}
          className="btn-secondary flex items-center space-x-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>{translations.results.compressMore}</span>
        </button>
      </div>

      {/* Summary */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 mb-8">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {formatFileSize(totalSavings.original)}
            </div>
            <div className="text-sm text-gray-600">{translations.results.originalSize}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {formatFileSize(totalSavings.compressed)}
            </div>
            <div className="text-sm text-gray-600">{translations.results.compressedSize}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 flex items-center justify-center space-x-1">
              <TrendingDown className="w-6 h-6" />
              <span>{totalCompressionRatio}%</span>
            </div>
            <div className="text-sm text-gray-600">{translations.results.spaceSaved}</div>
          </div>
        </div>
      </div>

      {/* Individual Results */}
      <div className="space-y-4 mb-8">
        {results.map((result, index) => {
          const compressionRatio = getCompressionRatio(result.originalSize, result.compressedSize);
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-900 truncate">{result.file.name}</h3>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                    -{compressionRatio}%
                  </span>
                  <button
                    onClick={() => downloadFile(result.file)}
                    className="btn-primary flex items-center space-x-2 text-sm px-3 py-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>{translations.results.download}</span>
                  </button>
                </div>
              </div>
              
              {/* Size comparison with visual bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{translations.results.originalSize}</span>
                  <span className="font-medium text-gray-900">{formatFileSize(result.originalSize)}</span>
                </div>
                
                <div className="relative">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-red-400 to-red-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: '100%' }}
                    ></div>
                  </div>
                  <div className="absolute top-0 right-0 w-1 h-2 bg-white rounded-full"></div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{translations.results.compressedSize}</span>
                  <span className="font-medium text-gray-900">{formatFileSize(result.compressedSize)}</span>
                </div>
                
                <div className="relative">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-400 to-green-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(result.compressedSize / result.originalSize) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="text-center text-xs text-gray-500">
                  Saved {formatFileSize(result.originalSize - result.compressedSize)} ({compressionRatio}% reduction)
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Download All Button */}
      {results.length > 1 && (
        <div className="text-center">
          <button
            onClick={downloadAllFiles}
            className="btn-primary text-lg px-8 py-3 flex items-center justify-center space-x-2 mx-auto"
          >
            <Archive className="w-5 h-5" />
            <span>{translations.results.downloadAll}</span>
          </button>
        </div>
      )}
    </motion.div>
  );
}
