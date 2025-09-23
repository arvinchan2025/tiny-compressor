// 错误类型定义
export interface ErrorInfo {
  code: string;
  title: string;
  message: string;
  suggestion: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  severity: 'low' | 'medium' | 'high' | 'critical';
}

// 常见错误类型
export enum ErrorType {
  FILE_TOO_LARGE = 'FILE_TOO_LARGE',
  UNSUPPORTED_FORMAT = 'UNSUPPORTED_FORMAT',
  NETWORK_ERROR = 'NETWORK_ERROR',
  CONVERSION_FAILED = 'CONVERSION_FAILED',
  COMPRESSION_FAILED = 'COMPRESSION_FAILED',
  UPLOAD_FAILED = 'UPLOAD_FAILED',
  DOWNLOAD_FAILED = 'DOWNLOAD_FAILED',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  QUOTA_EXCEEDED = 'QUOTA_EXCEEDED',
  BROWSER_NOT_SUPPORTED = 'BROWSER_NOT_SUPPORTED',
  MEMORY_INSUFFICIENT = 'MEMORY_INSUFFICIENT',
  CORRUPTED_FILE = 'CORRUPTED_FILE',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

// 错误处理类
export class ErrorHandler {
  private static errorMessages: Record<ErrorType, Partial<ErrorInfo>> = {
    [ErrorType.FILE_TOO_LARGE]: {
      code: 'FILE_TOO_LARGE',
      title: '文件过大',
      message: '上传的文件超过了大小限制',
      suggestion: '请选择小于10MB的文件，或使用图片压缩工具减小文件大小',
      severity: 'medium'
    },
    [ErrorType.UNSUPPORTED_FORMAT]: {
      code: 'UNSUPPORTED_FORMAT',
      title: '不支持的文件格式',
      message: '当前文件格式不被支持',
      suggestion: '请选择支持的图片格式：JPG、PNG、WebP、AVIF、GIF',
      severity: 'medium'
    },
    [ErrorType.NETWORK_ERROR]: {
      code: 'NETWORK_ERROR',
      title: '网络连接错误',
      message: '网络连接出现问题，无法完成操作',
      suggestion: '请检查网络连接，或稍后重试',
      severity: 'high'
    },
    [ErrorType.CONVERSION_FAILED]: {
      code: 'CONVERSION_FAILED',
      title: '转换失败',
      message: '图片格式转换过程中出现错误',
      suggestion: '请检查文件是否损坏，或尝试使用不同的设置',
      severity: 'high'
    },
    [ErrorType.COMPRESSION_FAILED]: {
      code: 'COMPRESSION_FAILED',
      title: '压缩失败',
      message: '图片压缩过程中出现错误',
      suggestion: '请检查文件是否损坏，或尝试调整压缩设置',
      severity: 'high'
    },
    [ErrorType.UPLOAD_FAILED]: {
      code: 'UPLOAD_FAILED',
      title: '上传失败',
      message: '文件上传过程中出现错误',
      suggestion: '请检查网络连接，或尝试重新上传文件',
      severity: 'medium'
    },
    [ErrorType.DOWNLOAD_FAILED]: {
      code: 'DOWNLOAD_FAILED',
      title: '下载失败',
      message: '文件下载过程中出现错误',
      suggestion: '请检查网络连接，或尝试重新下载',
      severity: 'medium'
    },
    [ErrorType.PERMISSION_DENIED]: {
      code: 'PERMISSION_DENIED',
      title: '权限不足',
      message: '没有足够的权限执行此操作',
      suggestion: '请检查浏览器权限设置，或尝试刷新页面',
      severity: 'high'
    },
    [ErrorType.QUOTA_EXCEEDED]: {
      code: 'QUOTA_EXCEEDED',
      title: '存储空间不足',
      message: '浏览器存储空间已满',
      suggestion: '请清理浏览器缓存，或尝试减少文件数量',
      severity: 'medium'
    },
    [ErrorType.BROWSER_NOT_SUPPORTED]: {
      code: 'BROWSER_NOT_SUPPORTED',
      title: '浏览器不支持',
      message: '当前浏览器不支持此功能',
      suggestion: '请使用现代浏览器，如Chrome、Firefox、Safari或Edge',
      severity: 'critical'
    },
    [ErrorType.MEMORY_INSUFFICIENT]: {
      code: 'MEMORY_INSUFFICIENT',
      title: '内存不足',
      message: '系统内存不足，无法处理此文件',
      suggestion: '请尝试处理较小的文件，或关闭其他应用程序释放内存',
      severity: 'high'
    },
    [ErrorType.CORRUPTED_FILE]: {
      code: 'CORRUPTED_FILE',
      title: '文件损坏',
      message: '上传的文件可能已损坏',
      suggestion: '请检查文件完整性，或尝试重新获取文件',
      severity: 'medium'
    },
    [ErrorType.UNKNOWN_ERROR]: {
      code: 'UNKNOWN_ERROR',
      title: '未知错误',
      message: '发生了一个未知错误',
      suggestion: '请刷新页面重试，或联系技术支持',
      severity: 'high'
    }
  };

  // 根据错误类型获取错误信息
  static getErrorInfo(errorType: ErrorType, customMessage?: string): ErrorInfo {
    const baseError = this.errorMessages[errorType];
    if (!baseError) {
      return this.getErrorInfo(ErrorType.UNKNOWN_ERROR);
    }

    return {
      code: baseError.code || errorType,
      title: baseError.title || '错误',
      message: customMessage || baseError.message || '发生了一个错误',
      suggestion: baseError.suggestion || '请稍后重试',
      severity: baseError.severity || 'medium'
    } as ErrorInfo;
  }

  // 根据原生错误对象推断错误类型
  static inferErrorType(error: Error): ErrorType {
    const message = error.message.toLowerCase();
    const name = error.name.toLowerCase();

    if (message.includes('file too large') || message.includes('size limit')) {
      return ErrorType.FILE_TOO_LARGE;
    }
    if (message.includes('unsupported') || message.includes('format')) {
      return ErrorType.UNSUPPORTED_FORMAT;
    }
    if (message.includes('network') || message.includes('fetch')) {
      return ErrorType.NETWORK_ERROR;
    }
    if (message.includes('permission') || message.includes('denied')) {
      return ErrorType.PERMISSION_DENIED;
    }
    if (message.includes('quota') || message.includes('storage')) {
      return ErrorType.QUOTA_EXCEEDED;
    }
    if (message.includes('memory') || message.includes('out of memory')) {
      return ErrorType.MEMORY_INSUFFICIENT;
    }
    if (message.includes('corrupted') || message.includes('invalid')) {
      return ErrorType.CORRUPTED_FILE;
    }

    return ErrorType.UNKNOWN_ERROR;
  }

  // 处理文件上传错误
  static handleFileUploadError(error: Error, file: File): ErrorInfo {
    const errorType = this.inferErrorType(error);
    let customMessage = error.message;

    if (errorType === ErrorType.FILE_TOO_LARGE) {
      customMessage = `文件 "${file.name}" 大小 ${this.formatFileSize(file.size)} 超过了限制`;
    } else if (errorType === ErrorType.UNSUPPORTED_FORMAT) {
      customMessage = `文件 "${file.name}" 的格式 "${file.type}" 不被支持`;
    }

    return this.getErrorInfo(errorType, customMessage);
  }

  // 处理转换错误
  static handleConversionError(error: Error, sourceFormat: string, targetFormat: string): ErrorInfo {
    const errorType = this.inferErrorType(error);
    const customMessage = `${sourceFormat.toUpperCase()} 到 ${targetFormat.toUpperCase()} 转换失败: ${error.message}`;
    
    return this.getErrorInfo(errorType, customMessage);
  }

  // 处理压缩错误
  static handleCompressionError(error: Error, format: string): ErrorInfo {
    const errorType = this.inferErrorType(error);
    const customMessage = `${format.toUpperCase()} 压缩失败: ${error.message}`;
    
    return this.getErrorInfo(errorType, customMessage);
  }

  // 格式化文件大小
  private static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // 检查浏览器支持
  static checkBrowserSupport(): ErrorInfo | null {
    // 检查必要的API支持
    const requiredAPIs = [
      'FileReader',
      'URL',
      'createObjectURL',
      'revokeObjectURL'
    ];

    const unsupportedAPIs = requiredAPIs.filter(api => !(api in window));
    
    if (unsupportedAPIs.length > 0) {
      return this.getErrorInfo(ErrorType.BROWSER_NOT_SUPPORTED, 
        `当前浏览器不支持以下API: ${unsupportedAPIs.join(', ')}`);
    }

    return null;
  }

  // 检查文件大小
  static checkFileSize(file: File, maxSize: number = 10 * 1024 * 1024): ErrorInfo | null {
    if (file.size > maxSize) {
      return this.getErrorInfo(ErrorType.FILE_TOO_LARGE, 
        `文件大小 ${this.formatFileSize(file.size)} 超过了限制 ${this.formatFileSize(maxSize)}`);
    }
    return null;
  }

  // 检查文件格式
  static checkFileFormat(file: File, supportedFormats: string[]): ErrorInfo | null {
    const fileType = file.type.toLowerCase();
    const isSupported = supportedFormats.some(format => 
      fileType.includes(format.toLowerCase())
    );

    if (!isSupported) {
      return this.getErrorInfo(ErrorType.UNSUPPORTED_FORMAT, 
        `文件格式 "${file.type}" 不被支持。支持的格式: ${supportedFormats.join(', ')}`);
    }
    return null;
  }
}

