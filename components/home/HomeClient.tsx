// 'use client';

import React from 'react';
import { Locale } from '@/lib/i18n';
import ModernHomePage from './ModernHomePage';
import {loadServerTranslations} from "@/lib/i18n/ssr-optimization";

interface HomeClientProps {
  locale: Locale;
}

export default async function HomeClient({ locale }: HomeClientProps) {
  const translations = await loadServerTranslations('home', locale);
  return <ModernHomePage
    translations={translations}
    locale={locale}
  />;
}