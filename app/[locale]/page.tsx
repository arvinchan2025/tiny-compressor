import {getLocalizedPath, Locale, supportedLocales} from '@/lib/i18n';
import StandardPageLayout from '@/components/layout/StandardPageLayout';
import HomeClient from '@/components/home/HomeClient';
import {Metadata} from "next";

export async function generateMetadata({params}: any): Promise<Metadata> {
  const locale = params.locale;
  const languages: Record<string, string> = {};

  for (const lang of supportedLocales) {
    languages[lang] = getLocalizedPath('/', lang);
  }
  return {
    alternates: {
      canonical: getLocalizedPath('/', locale),
      languages: {
        ...languages,
        'x-default': `https://tinycompressor.com/en`,
      },
    }
  }
}

export default async function Home({params}: { params: { locale: string } }) {
  const {locale} = params;

  // 确保 locale 是有效的 Locale 类型
  const validLocale: Locale = supportedLocales.includes(locale as Locale)
    ? (locale as Locale)
    : 'en';

  // 使用标准页面布局
  return (
    <StandardPageLayout locale={validLocale}>
      <HomeClient locale={validLocale}/>
    </StandardPageLayout>
  );
}