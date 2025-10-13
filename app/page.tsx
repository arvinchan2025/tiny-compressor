import { Locale } from '@/lib/i18n';
import StandardPageLayout from '@/components/layout/StandardPageLayout';
import HomeClient from '@/components/home/HomeClient';

export default function RootPage() {
  // English as default language, directly render English content without /en prefix
  // Note: This should be rewritten to /en version through middleware, so this component won't be directly accessed
  const locale: Locale = 'en';
  
  return (
    <StandardPageLayout locale={locale}>
      <HomeClient locale={locale} />
    </StandardPageLayout>
  );
}