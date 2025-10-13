'use client';

import React from 'react';
import { Locale } from '@/lib/i18n';
import ModernHomePage from './ModernHomePage';

interface HomeClientProps {
  locale: Locale;
}

export default function HomeClient({ locale }: HomeClientProps) {
  return <ModernHomePage locale={locale} />;
}