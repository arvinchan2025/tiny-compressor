'use client';

import React, { useState, useCallback } from 'react';
import { Locale } from '@/lib/i18n';
import { ImageFile } from '@/types/image';
import StandardButton from '@/components/ui/StandardButton';

interface BatchProcessorProps {
  locale: Locale;
  pageType: 'compressor' | 'converter';
  format?: string;
  sourceFormat?: string;
  targetFormat?: string;
  imageFiles: ImageFile[];
  onFilesSelected: (files: ImageFile[]) => void;
  onRemoveFile: (fileId: string) => void;
  onProcess: () => void;
  isProcessing: boolean;
  progress: number;
  status: 'idle' | 'processing' | 'completed' | 'error';
  results: any[];
  onDownloadResult: (result: any) => void;
  maxFiles?: number;
}

export default function BatchProcessor({
  locale,
  pageType,
  format = 'jpg',
  sourceFormat = 'jpg',
  targetFormat = 'png',
  imageFiles = [],
  onFilesSelected,
  onRemoveFile,
  onProcess,
  isProcessing = false,
  progress = 0,
  status = 'idle',
  results = [],
  onDownloadResult,
  maxFiles = 10
}: BatchProcessorProps) {
  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const imageFiles: ImageFile[] = files.map(file => ({
      id: Math.random().toString(),
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      preview: URL.createObjectURL(file)
    }));
    onFilesSelected(imageFiles.slice(0, maxFiles));
  }, [onFilesSelected, maxFiles]);

  const handleRemoveFile = useCallback((fileId: string) => {
    onRemoveFile(fileId);
  }, [onRemoveFile]);

  const handleProcess = useCallback(() => {
    if (imageFiles.length > 0) {
      onProcess();
    }
  }, [imageFiles, onProcess]);

  const handleDownload = useCallback((result: any) => {
    onDownloadResult(result);
  }, [onDownloadResult]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-slate-900 mb-2">
          Batch Processor
        </h3>
        <p className="text-slate-600">
          Upload and process multiple files at once (max {maxFiles} files)
        </p>
      </div>

      {/* File Upload */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Select Files
        </label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          disabled={isProcessing}
        />
      </div>

      {/* File List */}
      {imageFiles.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-slate-700 mb-2">
            Selected Files ({imageFiles.length}/{maxFiles})
          </h4>
          <div className="space-y-2">
            {imageFiles.map((file) => (
              <div key={file.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center">
                  <img
                    src={file.preview}
                    alt={file.name}
                    className="w-10 h-10 object-cover rounded mr-3"
                  />
                  <div>
                    <p className="text-sm font-medium text-slate-900">{file.name}</p>
                    <p className="text-xs text-slate-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveFile(file.id)}
                  className="text-slate-400 hover:text-slate-600"
                  disabled={isProcessing}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Process Button */}
      <div className="mb-6">
        <StandardButton
          variant="primary"
          size="lg"
          fullWidth={true}
          onClick={handleProcess}
          disabled={imageFiles.length === 0 || isProcessing}
        >
          {isProcessing ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Processing...
            </div>
          ) : (
            `Process ${imageFiles.length} File${imageFiles.length !== 1 ? 's' : ''}`
          )}
        </StandardButton>
      </div>

      {/* Progress Bar */}
      {isProcessing && (
        <div className="mb-6">
          <div className="flex justify-between text-sm text-slate-600 mb-2">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Results */}
      {status === 'completed' && results.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-slate-900">
            Results ({results.length} files)
          </h4>
          <div className="space-y-2">
            {results.map((result, index) => (
              <div key={index} className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-green-800">
                    {result.originalFile.name}
                  </span>
                  <span className="text-sm text-green-600">
                    {((result.compressedSize || result.convertedSize) / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
                <StandardButton
                  variant="secondary"
                  size="sm"
                  onClick={() => handleDownload(result)}
                >
                  Download
                </StandardButton>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error State */}
      {status === 'error' && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm text-red-800">
              An error occurred during processing
            </span>
          </div>
        </div>
      )}
    </div>
  );
}






