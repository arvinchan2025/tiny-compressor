'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Check } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

interface LanguageSwitcherProps {
  currentLanguage: string;
  onLanguageChange?: (language: string) => void;
}

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
];

export default function LanguageSwitcher({ currentLanguage, onLanguageChange }: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  const currentLang = languages.find(lang => lang.code === currentLanguage) || languages[0];

  const handleLanguageChange = (languageCode: string) => {
    if (languageCode === currentLanguage) return;
    
    // 防止重复点击
    if (isOpen === false) return;
    
    // 先关闭下拉菜单
    setIsOpen(false);
    
    // 获取当前路径，移除语言前缀
    let pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, '');
    
    // 如果路径为空或者是根路径，确保有斜杠
    if (!pathWithoutLocale || pathWithoutLocale === '') {
      pathWithoutLocale = '/';
    }
    
    // 导航到新语言路径
    // 英文使用根路径，其他语言使用语言前缀
    const newPath = languageCode === 'en' 
      ? pathWithoutLocale 
      : `/${languageCode}${pathWithoutLocale}`;
    
    // 使用requestAnimationFrame确保DOM更新完成后再导航
    requestAnimationFrame(() => {
      // 再次使用setTimeout确保所有动画完成
      setTimeout(() => {
        try {
          router.push(newPath);
          
          // 调用回调函数（如果提供）
          if (onLanguageChange) {
            onLanguageChange(languageCode);
          }
        } catch (error) {
          console.error('Language switch error:', error);
        }
      }, 200);
    });
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-white/20 hover:bg-white/30 transition-all duration-300 backdrop-blur-sm border border-white/20"
        aria-label="Select language"
      >
        <Globe className="w-4 h-4 text-neutral-700" />
        <span className="text-sm font-medium text-neutral-700">{currentLang.flag}</span>
        <span className="text-sm text-neutral-700 hidden sm:inline">{currentLang.name}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <svg className="w-4 h-4 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </button>

      <AnimatePresence mode="wait" onExitComplete={() => {}}>
        {isOpen && (
          <motion.div
            key="language-dropdown"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-neutral-200/50 py-2 z-50"
          >
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{language.flag}</span>
                  <span className="text-sm font-medium text-gray-900">{language.name}</span>
                </div>
                {currentLanguage === language.code && (
                  <Check className="w-4 h-4 text-primary-600" />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
