import {SupportedLanguage} from '@/types/i18n';
import {Metadata} from 'next';
import {SUPPORTED_LANGUAGES} from '@/lib/language-config';
import {getLocalizedPath, Locale, supportedLocales} from "@/lib/i18n";
import React from "react";
import ModernCompressorNavigation from "@/components/compressor/ModernCompressorNavigation";
import {createTranslator, loadServerTranslations} from "@/lib/i18n/ssr-optimization";

interface CompressorPageProps {
  params: {
    locale: Locale;
  };
}

export async function generateMetadata({ params }: CompressorPageProps): Promise<Metadata> {
  const { locale } = params;
  // const translations = await loadServerTranslations('', locale)
  const validLocale: SupportedLanguage = SUPPORTED_LANGUAGES.includes(locale as SupportedLanguage)
    ? (locale as SupportedLanguage)
    : 'en';
  const translations = await loadServerTranslations('common/navigation', validLocale);
  const translator = createTranslator(translations);
  const {t, getTranslation} = translator
  const pathname = '/compressor'
  const languages: Record<string, string> = {};
  for (const lang of supportedLocales) {
    languages[lang] = getLocalizedPath(pathname, lang);
  }
  return {
    title: t("compressor.seo.title"),
    description: t("compressor.seo.description"),
    keywords: t("compressor.seo.keywords"),
    openGraph: {
      title: t("compressor.seo.title"),
      description: t("compressor.seo.description"),
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t("compressor.seo.title"),
      description: t("compressor.seo.description"),
    },
    alternates: {
      canonical: getLocalizedPath(pathname, locale as Locale),
      languages: {
        ...languages,
        'x-default': getLocalizedPath(pathname, 'en'),
      },
    },
  };
}

export default async function CompressorPage({ params }: CompressorPageProps) {
  const { locale } = params;
  const validLocale: SupportedLanguage = SUPPORTED_LANGUAGES.includes(locale as SupportedLanguage)
    ? (locale as SupportedLanguage)
    : 'en';

  return (
    <ModernCompressorNavigation locale={locale} />
    // <UnifiedClient
    //   locale={validLocale}
    //   pageType="navigation"
    //   sourceFormat="compressor"
    // />
  );
}