import { Metadata } from 'next';
import { SupportedLanguage } from '@/types/i18n';
import TermsClient from './TermsClient';

interface TermsPageProps {
  params: {
    locale: SupportedLanguage;
  };
}

export async function generateMetadata({ params }: TermsPageProps): Promise<Metadata> {
  const { locale } = params;
  
  return {
    title: 'Terms of Service - TinyCompressor',
    description: 'Terms of Service for TinyCompressor - Learn about our service terms and conditions.',
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default function TermsPage({ params }: TermsPageProps) {
  const { locale } = params;
  
  return <TermsClient locale={locale} />;
}

