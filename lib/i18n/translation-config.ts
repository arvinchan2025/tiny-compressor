import { Locale, supportedLocales } from '@/lib/i18n'

// Minimal translation path generator used by translation loader/hooks
export const translationPathGenerator = {
  // Module path used for dynamic import
  getModulePath(moduleName: string, locale: Locale): string {
    return `${locale}/${moduleName}`
  },
  // Debug-friendly path string
  getTranslationPath(locale: Locale, moduleName: string): string {
    return `${locale}/${moduleName}`
  }
}

// Allow all modules by default to avoid unnecessary runtime failures
export function isModuleSupported(_moduleName: string): boolean {
  return true
}

export function isLocaleSupported(locale: Locale): boolean {
  return supportedLocales.includes(locale)
}

export function getSupportedModules(): string[] {
  // Optional: could be populated by scanning files; keep permissive minimal set
  return []
}



