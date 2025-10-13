import { Metadata } from 'next';
import { SupportedLanguage } from '@/types/i18n';
import PrivacyClient from './PrivacyClient';

interface PrivacyPageProps {
  params: {
    locale: SupportedLanguage;
  };
}

export async function generateMetadata({ params }: PrivacyPageProps): Promise<Metadata> {
  const { locale } = params;
  
  return {
    title: 'Privacy Policy - TinyCompressor',
    description: 'Privacy Policy for TinyCompressor - Learn how we protect your data and privacy.',
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default function PrivacyPage({ params }: PrivacyPageProps) {
  const { locale } = params;
  
  return <PrivacyClient locale={locale} />;
}

