import HomeClient from './HomeClient';
import { SupportedLanguage } from '@/types/i18n';

export default async function Home({ params }: { params: { locale: string } }) {
  const { locale } = params;
  
  // 确保 locale 是有效的 SupportedLanguage 类型
  const validLocale: SupportedLanguage = ['en', 'zh', 'es', 'de', 'fr', 'ar'].includes(locale) 
    ? (locale as SupportedLanguage) 
    : 'en';
  
  // 直接传递 locale，让客户端组件处理翻译
  return <HomeClient locale={validLocale} />;
}