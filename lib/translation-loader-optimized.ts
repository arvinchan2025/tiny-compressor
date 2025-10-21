import { Locale, TranslationModule } from '@/lib/i18n'
import { translationPathGenerator, isModuleSupported as configIsModuleSupported, getSupportedModules as configGetSupportedModules } from '@/lib/i18n/translation-config'

// LRU Cache for translations
const translationCache = new Map<string, Record<string, any>>()
const MAX_CACHE_SIZE = 50

export async function loadModuleTranslations(locale: Locale, moduleName: TranslationModule): Promise<Record<string, any>> {
  const cacheKey = `${locale}/${moduleName}`

  if (translationCache.has(cacheKey)) {
    const cached = translationCache.get(cacheKey)!
    translationCache.delete(cacheKey)
    translationCache.set(cacheKey, cached)
    return cached
  }

  if (!configIsModuleSupported(moduleName as unknown as string)) {
    return {}
  }

  try {
    const modulePath = translationPathGenerator.getModulePath(moduleName as unknown as string, locale)
    const translations = await import(`@/lib/i18n/translations/${modulePath}.json`)

    if (translationCache.size >= MAX_CACHE_SIZE) {
      const firstKey = translationCache.keys().next().value
      translationCache.delete(firstKey)
    }
    translationCache.set(cacheKey, translations.default)
    return translations.default
  } catch (_e) {
    // Fallback to empty to avoid runtime crash
    return {}
  }
}

export async function loadMultipleModules(locale: Locale, modules: TranslationModule[]): Promise<Record<string, any>> {
  const loaded: Record<string, any> = {}
  for (const m of modules) {
    loaded[m as unknown as string] = await loadModuleTranslations(locale, m)
  }
  return loaded
}

export function isModuleSupported(moduleName: TranslationModule): boolean {
  return configIsModuleSupported(moduleName as unknown as string)
}

export function getSupportedModules(): TranslationModule[] {
  return configGetSupportedModules() as unknown as TranslationModule[]
}



