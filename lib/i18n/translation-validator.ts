/**
 * Translation Validator
 * 
 * 翻译文件路径验证工具，确保翻译文件存在且可访问
 */

import { translationPathGenerator, TranslationPathConfig } from './translation-config';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  missingFiles: string[];
  availableModules: string[];
  availableLocales: string[];
}

export class TranslationValidator {
  private config: TranslationPathConfig;

  constructor(config?: TranslationPathConfig) {
    this.config = config || translationPathGenerator.getConfig();
  }

  /**
   * 验证所有翻译文件
   * @returns 验证结果
   */
  async validateAllTranslations(): Promise<ValidationResult> {
    const result: ValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
      missingFiles: [],
      availableModules: [],
      availableLocales: []
    };

    // 验证所有模块和语言组合
    for (const moduleName of this.config.modulePaths) {
      for (const locale of this.config.supportedLocales) {
        try {
          const path = translationPathGenerator.getTranslationPath(locale, moduleName);
          const exists = await this.checkFileExists(path);
          
          if (!exists) {
            result.missingFiles.push(`${locale}/${moduleName}`);
            result.warnings.push(`Missing translation file: ${path}`);
          }
        } catch (error) {
          result.errors.push(`Error validating ${locale}/${moduleName}: ${error.message}`);
          result.isValid = false;
        }
      }
    }

    // 检查是否有可用的模块
    result.availableModules = this.config.modulePaths;
    result.availableLocales = this.config.supportedLocales;

    // 如果有错误，标记为无效
    if (result.errors.length > 0) {
      result.isValid = false;
    }

    return result;
  }

  /**
   * 验证特定模块的翻译文件
   * @param module 模块名称
   * @returns 验证结果
   */
  async validateModule(module: string): Promise<ValidationResult> {
    const result: ValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
      missingFiles: [],
      availableModules: [],
      availableLocales: []
    };

    // 检查模块是否支持
    if (!translationPathGenerator.isModuleSupported(module)) {
      result.errors.push(`Module '${module}' is not supported`);
      result.isValid = false;
      return result;
    }

    // 验证所有语言的文件
    for (const locale of this.config.supportedLocales) {
      try {
        const path = translationPathGenerator.getTranslationPath(locale, module);
        const exists = await this.checkFileExists(path);
        
        if (!exists) {
          result.missingFiles.push(`${locale}/${module}`);
          result.warnings.push(`Missing translation file: ${path}`);
        }
      } catch (error) {
        result.errors.push(`Error validating ${locale}/${moduleName}: ${error.message}`);
        result.isValid = false;
      }
    }

    result.availableModules = [module];
    result.availableLocales = this.config.supportedLocales;

    return result;
  }

  /**
   * 验证特定语言的翻译文件
   * @param locale 语言代码
   * @returns 验证结果
   */
  async validateLocale(locale: string): Promise<ValidationResult> {
    const result: ValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
      missingFiles: [],
      availableModules: [],
      availableLocales: []
    };

    // 检查语言是否支持
    if (!translationPathGenerator.isLocaleSupported(locale)) {
      result.errors.push(`Locale '${locale}' is not supported`);
      result.isValid = false;
      return result;
    }

    // 验证所有模块的文件
    for (const moduleName of Object.keys(this.config.modulePaths)) {
      try {
        const path = translationPathGenerator.getTranslationPath(locale, moduleName);
        const exists = await this.checkFileExists(path);
        
        if (!exists) {
          result.missingFiles.push(`${locale}/${moduleName}`);
          result.warnings.push(`Missing translation file: ${path}`);
        }
      } catch (error) {
        result.errors.push(`Error validating ${locale}/${moduleName}: ${error.message}`);
        result.isValid = false;
      }
    }

    result.availableModules = Object.keys(this.config.modulePaths);
    result.availableLocales = [locale];

    return result;
  }

  /**
   * 检查文件是否存在
   * @param filePath 文件路径
   * @returns 是否存在
   */
  private async checkFileExists(filePath: string): Promise<boolean> {
    try {
      // 在浏览器环境中，使用fetch检查文件
      if (typeof window !== 'undefined') {
        const response = await fetch(`/${filePath}`);
        return response.ok;
      }
      
      // 在Node.js环境中，使用fs检查文件
      if (typeof require !== 'undefined') {
        const fs = require('fs');
        return fs.existsSync(filePath);
      }
      
      return false;
    } catch (error) {
      return false;
    }
  }

  /**
   * 生成验证报告
   * @param result 验证结果
   * @returns 格式化的报告
   */
  generateReport(result: ValidationResult): string {
    let report = 'Translation Validation Report\n';
    report += '================================\n\n';
    
    report += `Status: ${result.isValid ? '✅ Valid' : '❌ Invalid'}\n\n`;
    
    if (result.errors.length > 0) {
      report += 'Errors:\n';
      result.errors.forEach(error => {
        report += `  ❌ ${error}\n`;
      });
      report += '\n';
    }
    
    if (result.warnings.length > 0) {
      report += 'Warnings:\n';
      result.warnings.forEach(warning => {
        report += `  ⚠️  ${warning}\n`;
      });
      report += '\n';
    }
    
    if (result.missingFiles.length > 0) {
      report += 'Missing Files:\n';
      result.missingFiles.forEach(file => {
        report += `  📁 ${file}\n`;
      });
      report += '\n';
    }
    
    report += `Available Modules: ${result.availableModules.length}\n`;
    report += `Available Locales: ${result.availableLocales.length}\n`;
    
    return report;
  }
}

// 默认验证器实例
export const translationValidator = new TranslationValidator();

// 便捷函数
export const validateAllTranslations = () => translationValidator.validateAllTranslations();
export const validateModule = (module: string) => translationValidator.validateModule(module);
export const validateLocale = (locale: string) => translationValidator.validateLocale(locale);
export const generateReport = (result: ValidationResult) => translationValidator.generateReport(result);
