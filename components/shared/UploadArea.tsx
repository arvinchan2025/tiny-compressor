'use client';

import React, { useCallback, useState } from 'react';
import { Upload } from 'lucide-react';

interface UploadAreaProps {
  title: string;
  subtitle: string;
  buttonText: string;
  acceptTypes: string;
  onFileSelect: (file: File) => void;
  accentColor?: string;
  maxFileSize?: number; // in MB
}

export default function UploadArea({
  title,
  subtitle,
  buttonText,
  acceptTypes,
  onFileSelect,
  accentColor = 'blue',
  maxFileSize = 10
}: UploadAreaProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0 && files[0]) {
      onFileSelect(files[0]);
    }
  }, [onFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0 && files[0]) {
      onFileSelect(files[0]);
    }
  }, [onFileSelect]);

  return (
    <div
      className={`
        border-2 border-dashed rounded-xl p-12 text-center
        transition-all duration-300 ease-out
        hover:scale-[1.01]
        animate-scale-in
        ${isDragging
          ? `border-${accentColor}-500 bg-${accentColor}-50 dark:bg-${accentColor}-500/10`
          : `border-border-default hover:border-${accentColor}-500 hover:bg-${accentColor}-50/50 dark:hover:bg-${accentColor}-500/5`
        }
      `}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <Upload className={`w-16 h-16 text-${accentColor}-500 mx-auto mb-4`} />
      
      <h3 className="text-xl font-semibold text-text-primary mb-2">
        {title}
      </h3>
      
      <p className="text-text-secondary mb-6">
        {subtitle}
      </p>
      
      <label className={`
        inline-flex items-center gap-2 px-6 py-3 
        bg-gradient-to-r from-${accentColor}-600 to-${accentColor}-700 
        dark:from-${accentColor}-700 dark:to-${accentColor}-800
        text-white rounded-lg font-medium 
        transition-all duration-300 ease-out
        hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]
        cursor-pointer
      `}>
        <Upload className="w-5 h-5" />
        {buttonText}
        <input
          type="file"
          accept={acceptTypes}
          onChange={handleFileInputChange}
          className="hidden"
        />
      </label>
    </div>
  );
}



