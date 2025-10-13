import { Locale, supportedLocales } from '@/lib/i18n';
import StandardPageLayout from '@/components/layout/StandardPageLayout';
import HomeClient from '@/components/home/HomeClient';

export default async function Home({ params }: { params: { locale: string } }) {
  const { locale } = params;
  
  // 确保 locale 是有效的 Locale 类型
  const validLocale: Locale = supportedLocales.includes(locale as Locale)
    ? (locale as Locale) 
    : 'en';
  
  // 使用标准页面布局
  return (
    <StandardPageLayout locale={validLocale}>
      <HomeClient locale={validLocale} />
    </StandardPageLayout>
  );
}