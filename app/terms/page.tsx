import { Metadata } from 'next';
import StandardPageLayout from '@/components/layout/StandardPageLayout';
import TermsClient from '@/app/[locale]/terms/TermsClient';

export const metadata: Metadata = {
  title: 'Terms of Service - TinyCompressor',
  description: 'Terms of Service for TinyCompressor image compression and conversion tools.',
  keywords: 'terms of service, legal, TinyCompressor'
};

export default function TermsPage() {
  // 英语作为默认语言，直接渲染组件，地址栏不显示 /en 前缀
  return (
    <StandardPageLayout locale="en">
      <TermsClient locale="en" />
    </StandardPageLayout>
  );
}