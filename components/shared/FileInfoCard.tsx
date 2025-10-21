'use client';

import React from 'react';
import { FileText, Image, X } from 'lucide-react';

interface FileInfoCardProps {
  fileName: string;
  fileSize: number;
  fileType: 'pdf' | 'image';
  metadata?: {
    pageCount?: number;
    dimensions?: { width: number; height: number };
    format?: string;
    hasImages?: boolean;
  };
  onRemove?: () => void;
  accentColor?: string;
}

export default function FileInfoCard({
  fileName,
  fileSize,
  fileType,
  metadata,
  onRemove,
  accentColor = 'blue'
}: FileInfoCardProps) {
  
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const IconComponent = fileType === 'pdf' ? FileText : Image;

  return (
    <div className="card-glass p-6 animate-scale-in">
      <div className="flex items-start gap-4">
        <div className={`p-3 bg-${accentColor}-500/10 dark:bg-${accentColor}-500/20 rounded-lg`}>
          <IconComponent className={`w-8 h-8 text-${accentColor}-600 dark:text-${accentColor}-400`} />
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="text-lg font-semibold text-text-primary mb-1 truncate">
            {fileName}
          </h4>
          
          <div className="flex flex-wrap gap-4 text-sm text-text-secondary">
            <span>Size: {formatFileSize(fileSize)}</span>
            
            {metadata?.pageCount && (
              <span>Pages: {metadata.pageCount}</span>
            )}
            
            {metadata?.dimensions && (
              <span>
                {metadata.dimensions.width} × {metadata.dimensions.height}
              </span>
            )}
            
            {metadata?.format && (
              <span className="uppercase">{metadata.format}</span>
            )}
            
            {metadata?.hasImages && (
              <span className="text-orange-600 dark:text-orange-400">
                Contains Images
              </span>
            )}
          </div>
        </div>
        
        {onRemove && (
          <button
            onClick={onRemove}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
            aria-label="Remove file"
          >
            <X className="w-5 h-5 text-text-secondary hover:text-text-primary transition-colors duration-200" />
          </button>
        )}
      </div>
    </div>
  );
}


