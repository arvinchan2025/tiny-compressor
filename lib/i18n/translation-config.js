// JavaScript version of translation config for Node.js scripts
const supportedLocales = ['en', 'zh', 'es', 'de', 'fr', 'ar', 'ja', 'ko', 'pt', 'ru', 'it'];

// Minimal translation path generator used by translation loader/hooks
const translationPathGenerator = {
  // Module path used for dynamic import
  getModulePath(moduleName, locale) {
    return `${locale}/${moduleName}`;
  },
  // Debug-friendly path string
  getTranslationPath(locale, moduleName) {
    return `${locale}/${moduleName}`;
  }
};

// Allow all modules by default to avoid unnecessary runtime failures
function isModuleSupported(_moduleName) {
  return true;
}

function isLocaleSupported(locale) {
  return supportedLocales.includes(locale);
}

function getSupportedModules() {
  // Optional: could be populated by scanning files; keep permissive minimal set
  return [];
}

// Default configuration for build scripts
const defaultTranslationConfig = {
  basePath: 'lib/i18n/translations',
  supportedLocales,
  fileExtension: '.json',
  enableCache: true,
  cacheExpiry: 5 * 60 * 1000,
  modulePaths: {
    'common/ui': 'common/ui',
    'common/messages': 'common/messages',
    'common/navigation': 'common/navigation',
    'home': 'home',
    'compressors/png': 'compressors/png',
    'compressors/jpeg': 'compressors/jpeg',
    'compressors/webp': 'compressors/webp',
    'compressors/avif': 'compressors/avif',
    'compressors/gif': 'compressors/gif',
    'compressors/bmp': 'compressors/bmp',
    'compressors/pdf': 'compressors/pdf',
    'compressors/video': 'compressors/video',
    'converters/png-to-jpg': 'converters/png-to-jpg',
    'converters/png-to-webp': 'converters/png-to-webp',
    'converters/png-to-avif': 'converters/png-to-avif',
    'converters/jpeg-to-png': 'converters/jpeg-to-png',
    'converters/webp-to-png': 'converters/webp-to-png',
    'converters/webp-to-jpg': 'converters/webp-to-jpg',
    'converters/webp-to-avif': 'converters/webp-to-avif',
    'converters/jpg-to-avif': 'converters/jpg-to-avif',
    'converters/jpg-to-webp': 'converters/jpg-to-webp',
    'converters/heic-to-jpg': 'converters/heic-to-jpg',
    'shared/upload': 'shared/upload',
    'shared/processing': 'shared/processing',
    'shared/download': 'shared/download',
    'footer': 'footer',
    'privacy': 'privacy',
    'terms': 'terms'
  }
};

module.exports = {
  translationPathGenerator,
  isModuleSupported,
  isLocaleSupported,
  getSupportedModules,
  defaultTranslationConfig,
  supportedLocales
};

