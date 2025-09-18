'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Image as ImageIcon, X, CheckCircle, AlertCircle } from 'lucide-react';
import { Translations } from '@/lib/translations';

interface ImageUploaderProps {
  onFilesUploaded: (files: File[]) => void;
  disabled?: boolean;
  translations: Translations;
}

export default function ImageUploader({ onFilesUploaded, disabled, translations }: ImageUploaderProps) {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setUploadError(null);
    setUploadSuccess(null);
    
    if (rejectedFiles.length > 0) {
      setUploadError(`${rejectedFiles.length} file(s) were rejected. Please check file types and sizes.`);
    }
    
    if (acceptedFiles.length > 0) {
      setUploadSuccess(`${acceptedFiles.length} file(s) uploaded successfully!`);
      // Clear success message after 3 seconds
      setTimeout(() => setUploadSuccess(null), 3000);
    }
    
    const newFiles = [...uploadedFiles, ...acceptedFiles];
    setUploadedFiles(newFiles);
    onFilesUploaded(newFiles);
  }, [uploadedFiles, onFilesUploaded]);

  const removeFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
    onFilesUploaded(newFiles);
  };

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif', '.bmp']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: true,
    disabled
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <motion.h2 
          className="text-3xl font-bold text-gray-900 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {translations.upload.title}
        </motion.h2>
        <motion.p 
          className="text-gray-600"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {translations.upload.subtitle}
        </motion.p>
      </div>

      <div {...getRootProps()}>
        <motion.div
          className={`
            relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300
            ${isDragReject 
              ? 'border-red-500 bg-red-50 scale-105' 
              : isDragActive 
              ? 'border-primary-500 bg-primary-50 scale-105' 
              : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50 hover:scale-102'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          whileHover={disabled ? {} : { scale: 1.02 }}
          whileTap={disabled ? {} : { scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <input {...getInputProps()} />
          
          <motion.div
            animate={isDragActive ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center space-y-4"
          >
            <div className="relative">
              <Upload className="w-16 h-16 text-gray-400" />
              <motion.div
                className="absolute inset-0 bg-primary-100 rounded-full opacity-0"
                animate={isDragActive ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-700">
                {isDragActive 
                  ? translations.upload.dragActive 
                  : translations.upload.dragInactive
                }
              </h3>
              <p className="text-sm text-gray-500">
                {translations.upload.supportedFormats}
              </p>
              <p className="text-xs text-gray-400">
                {translations.upload.maxSize}
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Error Message */}
      {uploadError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg"
        >
          <AlertCircle className="w-5 h-5" />
          <span className="text-sm">{uploadError}</span>
        </motion.div>
      )}

      {/* Success Message */}
      {uploadSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="flex items-center space-x-2 text-green-600 bg-green-50 p-3 rounded-lg"
        >
          <CheckCircle className="w-5 h-5" />
          <span className="text-sm">{uploadSuccess}</span>
        </motion.div>
      )}

      {/* Uploaded Files */}
      <AnimatePresence mode="wait">
        {uploadedFiles.length > 0 && (
          <motion.div
            key="uploaded-files"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold text-gray-700">
              {translations.upload.uploadedFiles} ({uploadedFiles.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {uploadedFiles.map((file, index) => (
                <motion.div
                  key={`${file.name}-${index}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-start space-x-3">
                    <ImageIcon className="w-8 h-8 text-primary-600 flex-shrink-0 mt-1" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(file.size)}
                      </p>
                      <div className="flex items-center space-x-1 mt-1">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-xs text-green-600">
                          {translations.upload.ready}
                        </span>
                      </div>
                    </div>
                    <motion.button
                      onClick={() => removeFile(index)}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors duration-200"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <X className="w-4 h-4" />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}