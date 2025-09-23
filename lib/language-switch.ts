/**
 * 统一的语言切换工具
 */

const SUPPORTED_LOCALES = ['en', 'zh', 'es', 'de', 'fr', 'ar'];

/**
 * 切换语言
 */
export function switchLanguage(newLocale: string, currentPath: string): void {
  // 移除当前语言前缀
  let cleanPath = currentPath;
  
  SUPPORTED_LOCALES.forEach(locale => {
    if (currentPath.startsWith(`/${locale}/`)) {
      cleanPath = currentPath.substring(locale.length + 1);
    } else if (currentPath === `/${locale}`) {
      cleanPath = '/';
    }
  });
  
  // 生成新路径
  let newPath: string;
  if (newLocale === 'en') {
    // 英语重定向到 /en 版本，让中间件处理
    newPath = cleanPath === '/' ? '/en' : `/en${cleanPath}`;
  } else {
    // 其他语言直接使用语言前缀
    newPath = cleanPath === '/' ? `/${newLocale}` : `/${newLocale}${cleanPath}`;
  }
  
  // 使用完整的页面跳转确保状态重置
  window.location.href = newPath;
}

/**
 * 获取当前语言
 */
export function getCurrentLanguage(pathname: string): string {
  for (const locale of SUPPORTED_LOCALES) {
    if (pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`) {
      return locale;
    }
  }
  return 'en'; // 默认返回英语
}

/**
 * 检查是否为支持的语言
 */
export function isValidLanguage(language: string): boolean {
  return SUPPORTED_LOCALES.includes(language);
}
