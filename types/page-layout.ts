import { SupportedLanguage } from './i18n';

export interface NoteItem {
  icon: string;
  title: string;
  content: string;
  type: 'warning' | 'tip' | 'info' | 'success';
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface QuickLink {
  title: string;
  description: string;
  href: string;
  icon: string;
  color: string;
}

export interface HeroContent {
  title: string;
  subtitle: string;
  description: string;
}

export interface UnifiedPageLayoutProps {
  locale: SupportedLanguage;
  pageType: 'compressor' | 'converter';
  format: string;
  sourceFormat?: string;
  targetFormat?: string;
  hero: HeroContent;
  children: React.ReactNode;
  notes?: NoteItem[];
  faqs?: FAQItem[];
  technicalPrinciples?: any;
  useCases?: any;
  performanceComparison?: any;
  bestPractices?: any;
  quickLinks?: QuickLink[];
}

