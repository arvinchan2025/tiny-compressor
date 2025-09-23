/**
 * 文件上传核心组件
 * 提供统一的文件上传功能和验证
 */

'use client';

import { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileImage, X, CheckCircle, AlertCircle, Trash2 } from 'lucide-react';
import type { FileUploadProps } from '@/types/components';
import { formatFileSize, validateFileType, validateFileSize } from '@/lib/utils';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

interface FileUploaderProps extends FileUploadProps {
  translations: {
    dragActive: string;
    dragInactive: string;
    dragReject: string;
    clickToUpload: string;
    supportedFormats: string;
    maxSize: string;
    maxFiles: string;
    removeFile: string;
    uploadError: string;
    uploadSuccess: string;
  };
}

export default function FileUploader({
  className,
  accept = 'image/*',
  multiple = true,
  maxSize = 10 * 1024 * 1024, // 10MB
  maxFiles = 10,
  disabled = false,
  onFilesChange,
  onFilesSelected,
  onError,
  dragActiveText,
  dragInactiveText,
  supportedFormats = ['JPEG', 'PNG', 'WebP', 'GIF'],
  translations,
  ...props
}: FileUploaderProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setErrors([]);
    setSuccess(null);
    
    // 处理被拒绝的文件
    if (rejectedFiles.length > 0) {
      const rejectionErrors = rejectedFiles.map(({ file, errors }) => {
        const errorMessages = errors.map((error: any) => {
          switch (error.code) {
            case 'file-too-large':
              return `File ${file.name} is too large. Maximum size is ${formatFileSize(maxSize)}.`;
            case 'file-invalid-type':
              return `File ${file.name} has an invalid type. Supported formats: ${supportedFormats.join(', ')}.`;
            case 'too-many-files':
              return `Too many files. Maximum allowed: ${maxFiles}.`;
            default:
              return `File ${file.name} was rejected: ${error.message}`;
          }
        });
        return errorMessages.join(' ');
      });
      
      setErrors(rejectionErrors);
      onError?.(rejectionErrors.join('; '));
    }
    
    // 处理接受的文件
    if (acceptedFiles.length > 0) {
      const newFiles = [...files, ...acceptedFiles].slice(0, maxFiles);
      setFiles(newFiles);
      onFilesChange?.(newFiles);
      
      // 如果提供了onFilesSelected，将File[]转换为ImageFile[]
      if (onFilesSelected) {
        const imageFiles = newFiles.map(file => ({
          id: Math.random().toString(),
          file,
          name: file.name,
          size: file.size,
          type: file.type,
          url: URL.createObjectURL(file)
        }));
        onFilesSelected(imageFiles);
      }
      
      setSuccess(`${acceptedFiles.length} file${acceptedFiles.length !== 1 ? 's' : ''} uploaded successfully!`);
      setTimeout(() => setSuccess(null), 3000);
    }
  }, [files, maxSize, maxFiles, supportedFormats, onFilesChange, onError]);
  
  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: accept ? { [accept]: [] } : undefined,
    maxSize,
    maxFiles: maxFiles - files.length,
    multiple,
    disabled: disabled ?? false,
    noClick: false,
    noKeyboard: false
  } as any);
  
  const removeFile = useCallback((index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onFilesChange?.(newFiles);
    
    // 如果提供了onFilesSelected，更新ImageFile[]
    if (onFilesSelected) {
      const imageFiles = newFiles.map(file => ({
        id: Math.random().toString(),
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file)
      }));
      onFilesSelected(imageFiles);
    }
    
    setErrors([]);
  }, [files, onFilesChange, onFilesSelected]);
  
  const clearAllFiles = useCallback(() => {
    setFiles([]);
    onFilesChange?.([]);
    
    // 如果提供了onFilesSelected，清空ImageFile[]
    if (onFilesSelected) {
      onFilesSelected([]);
    }
    
    setErrors([]);
    setSuccess(null);
  }, [onFilesChange, onFilesSelected]);
  
  const formatAcceptTypes = (accept: string) => {
    if (accept === 'image/*') {
      return supportedFormats.map(format => `.${format.toLowerCase()}`).join(', ');
    }
    return accept;
  };
  
  return (
    <div className={className} {...props}>
      {/* 上传区域 */}
      <Card
        {...getRootProps()}
        className={`
          cursor-pointer transition-all duration-200
          ${isDragActive ? 'border-primary-500 bg-primary-50' : ''}
          ${isDragReject ? 'border-red-500 bg-red-50' : ''}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        variant="outlined"
        padding="lg"
      >
        <input {...getInputProps()} ref={fileInputRef} />
        
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 text-neutral-400">
            {isDragReject ? (
              <AlertCircle className="w-full h-full" />
            ) : (
              <Upload className="w-full h-full" />
            )}
          </div>
          
          <div>
            <p className="text-lg font-medium text-neutral-900">
              {isDragReject
                ? translations.dragReject
                : isDragActive
                ? (dragActiveText || translations.dragActive)
                : (dragInactiveText || translations.dragInactive)
              }
            </p>
            <p className="text-sm text-neutral-500 mt-1">
              {translations.clickToUpload}
            </p>
          </div>
          
          <div className="text-xs text-neutral-400 space-y-1">
            <p>{translations.supportedFormats}: {supportedFormats.join(', ')}</p>
            <p>{translations.maxSize}: {formatFileSize(maxSize)}</p>
            {multiple && <p>{translations.maxFiles}: {maxFiles}</p>}
          </div>
        </div>
      </Card>
      
      {/* 错误信息 */}
      <AnimatePresence>
        {errors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 space-y-2"
          >
            {errors.map((error, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg"
              >
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* 成功信息 */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4"
          >
            <div className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
              <p className="text-sm text-green-700">{success}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
    </div>
  );
}
