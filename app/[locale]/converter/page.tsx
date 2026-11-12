import {SupportedLanguage} from '@/types/i18n';
import {Metadata} from 'next';
import {SUPPORTED_LANGUAGES} from '@/lib/language-config';
import ModernConverterNavigation from '@/components/converter/ModernConverterNavigation';
import {getLocalizedPath, Locale, supportedLocales} from "@/lib/i18n";
import {createTranslator, loadServerTranslations} from "@/lib/i18n/ssr-optimization";

interface ConverterPageProps {
  params: {
    locale: string;
  };
}

export async function generateMetadata({params}: ConverterPageProps): Promise<Metadata> {
  const {locale} = params;
  const validLocale: SupportedLanguage = SUPPORTED_LANGUAGES.includes(locale as SupportedLanguage)
    ? (locale as SupportedLanguage)
    : 'en';
  const translations = await loadServerTranslations('common/navigation', validLocale);
  const translator = createTranslator(translations);
  const {t, getTranslation} = translator
  const pathname = '/converter'
  const languages: Record<string, string> = {};
  for (const lang of supportedLocales) {
    languages[lang] = getLocalizedPath(pathname, lang);
  }

  return {
    title: t("converter.seo.title"),
    description: t("converter.seo.description"),
    keywords: t("converter.seo.keywords"),
    openGraph: {
      title: t("converter.seo.title"),
      description: t("converter.seo.description"),
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t("converter.seo.title"),
      description: t("converter.seo.description"),
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

export default async function ConverterPage({params}: ConverterPageProps) {
  const {locale} = params;
  const validLocale: SupportedLanguage = SUPPORTED_LANGUAGES.includes(locale as SupportedLanguage)
    ? (locale as SupportedLanguage)
    : 'en';

  return (
    <ModernConverterNavigation
      locale={validLocale}
    />
  );
}