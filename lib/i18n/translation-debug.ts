/**
 * Translation Debug Tools
 * 
 * 翻译路径调试工具，帮助开发者诊断翻译加载问题
 */

import { translationPathGenerator, TranslationPathConfig } from './translation-config';
import { translationValidator, ValidationResult } from './translation-validator';

export interface DebugInfo {
  config: TranslationPathConfig;
  supportedModules: string[];
  supportedLocales: string[];
  validationResult?: ValidationResult;
  pathExamples: Record<string, string>;
  recommendations: string[];
}

export class TranslationDebugger {
  private config: TranslationPathConfig;

  constructor(config?: TranslationPathConfig) {
    this.config = config || translationPathGenerator.getConfig();
  }

  /**
   * 获取完整的调试信息
   * @returns 调试信息
   */
  async getDebugInfo(): Promise<DebugInfo> {
    const debugInfo: DebugInfo = {
      config: this.config,
      supportedModules: translationPathGenerator.getSupportedModules(),
      supportedLocales: translationPathGenerator.getSupportedLocales(),
      pathExamples: {},
      recommendations: []
    };

    // 生成路径示例
    const exampleModules = ['home', 'common/ui', 'compressors/png', 'converters/png-to-jpg'];
    const exampleLocales = ['en', 'zh', 'es'];

    for (const moduleName of exampleModules) {
      if (translationPathGenerator.isModuleSupported(moduleName)) {
        for (const locale of exampleLocales) {
          if (translationPathGenerator.isLocaleSupported(locale)) {
            try {
              const path = translationPathGenerator.getTranslationPath(locale, moduleName);
              debugInfo.pathExamples[`${locale}/${moduleName}`] = path;
            } catch (error) {
              debugInfo.pathExamples[`${locale}/${moduleName}`] = `Error: ${error.message}`;
            }
          }
        }
      }
    }

    // 运行验证
    try {
      debugInfo.validationResult = await translationValidator.validateAllTranslations();
    } catch (error) {
      debugInfo.recommendations.push(`Validation failed: ${error.message}`);
    }

    // 生成建议
    this.generateRecommendations(debugInfo);

    return debugInfo;
  }

  /**
   * 生成建议
   * @param debugInfo 调试信息
   */
  private generateRecommendations(debugInfo: DebugInfo): void {
    const { validationResult, supportedModules, supportedLocales } = debugInfo;

    // 基于验证结果的建议
    if (validationResult) {
      if (validationResult.missingFiles.length > 0) {
        debugInfo.recommendations.push(
          `Found ${validationResult.missingFiles.length} missing translation files. Consider creating them or updating the module paths configuration.`
        );
      }

      if (validationResult.errors.length > 0) {
        debugInfo.recommendations.push(
          `Found ${validationResult.errors.length} validation errors. Check the error messages for details.`
        );
      }

      if (validationResult.warnings.length > 0) {
        debugInfo.recommendations.push(
          `Found ${validationResult.warnings.length} warnings. These may indicate configuration issues.`
        );
      }
    }

    // 基于配置的建议
    if (supportedModules.length === 0) {
      debugInfo.recommendations.push('No modules configured. Add module paths to the configuration.');
    }

    if (supportedLocales.length === 0) {
      debugInfo.recommendations.push('No locales configured. Add supported locales to the configuration.');
    }

    // 性能建议
    if (supportedModules.length > 50) {
      debugInfo.recommendations.push('Large number of modules detected. Consider implementing lazy loading for better performance.');
    }

    if (supportedLocales.length > 20) {
      debugInfo.recommendations.push('Large number of locales detected. Consider implementing locale-specific builds for better performance.');
    }

    // 最佳实践建议
    debugInfo.recommendations.push('Use the translation path generator to avoid hardcoded paths.');
    debugInfo.recommendations.push('Validate translations during build time to catch missing files early.');
    debugInfo.recommendations.push('Consider implementing translation fallbacks for missing keys.');
  }

  /**
   * 生成调试报告
   * @param debugInfo 调试信息
   * @returns 格式化的报告
   */
  generateDebugReport(debugInfo: DebugInfo): string {
    let report = 'Translation Debug Report\n';
    report += '========================\n\n';

    // 配置信息
    report += 'Configuration:\n';
    report += `  Base Path: ${debugInfo.config.basePath}\n`;
    report += `  File Extension: ${debugInfo.config.fileExtension}\n`;
    report += `  Cache Enabled: ${debugInfo.config.enableCache}\n`;
    report += `  Cache Expiry: ${debugInfo.config.cacheExpiry}ms\n\n`;

    // 支持的模块和语言
    report += 'Supported Modules:\n';
    debugInfo.supportedModules.forEach(module => {
      report += `  ✅ ${module}\n`;
    });
    report += '\n';

    report += 'Supported Locales:\n';
    debugInfo.supportedLocales.forEach(locale => {
      report += `  🌍 ${locale}\n`;
    });
    report += '\n';

    // 路径示例
    report += 'Path Examples:\n';
    Object.entries(debugInfo.pathExamples).forEach(([key, path]) => {
      report += `  ${key}: ${path}\n`;
    });
    report += '\n';

    // 验证结果
    if (debugInfo.validationResult) {
      report += 'Validation Results:\n';
      report += `  Status: ${debugInfo.validationResult.isValid ? '✅ Valid' : '❌ Invalid'}\n`;
      report += `  Errors: ${debugInfo.validationResult.errors.length}\n`;
      report += `  Warnings: ${debugInfo.validationResult.warnings.length}\n`;
      report += `  Missing Files: ${debugInfo.validationResult.missingFiles.length}\n\n`;
    }

    // 建议
    if (debugInfo.recommendations.length > 0) {
      report += 'Recommendations:\n';
      debugInfo.recommendations.forEach((rec, index) => {
        report += `  ${index + 1}. ${rec}\n`;
      });
      report += '\n';
    }

    return report;
  }

  /**
   * 检查特定路径
   * @param locale 语言代码
   * @param module 模块名称
   * @returns 路径检查结果
   */
  async checkPath(locale: string, module: string): Promise<{
    path: string;
    exists: boolean;
    error?: string;
  }> {
    try {
      const path = translationPathGenerator.getTranslationPath(locale, module);
      const exists = await translationValidator['checkFileExists'](path);
      
      return {
        path,
        exists,
        error: exists ? undefined : 'File not found'
      };
    } catch (error) {
      return {
        path: 'N/A',
        exists: false,
        error: error.message
      };
    }
  }
}

// 默认调试器实例
export const translationDebugger = new TranslationDebugger();

// 便捷函数
export const getDebugInfo = () => translationDebugger.getDebugInfo();
export const generateDebugReport = (debugInfo: DebugInfo) => translationDebugger.generateDebugReport(debugInfo);
export const checkPath = (locale: string, module: string) => translationDebugger.checkPath(locale, module);
