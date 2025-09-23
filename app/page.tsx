import HomeClient from './[locale]/HomeClient';
import { SupportedLanguage } from '@/types/i18n';

export default function RootPage() {
  // 英语作为默认语言，直接渲染英语内容，不显示 /en 前缀
  // 注意：这里应该通过中间件重写到 /en 版本，所以这个组件实际上不会被直接访问
  const locale: SupportedLanguage = 'en';
  
  return <HomeClient locale={locale} />;
}

