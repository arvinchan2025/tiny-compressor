import { Metadata } from 'next';
import StandardPageLayout from '@/components/layout/StandardPageLayout';
import PrivacyClient from '@/app/[locale]/privacy/PrivacyClient';

export const metadata: Metadata = {
  title: 'Privacy Policy - TinyCompressor',
  description: 'Privacy Policy for TinyCompressor image compression and conversion tools. Learn how we protect your data and privacy.',
  keywords: 'privacy policy, data protection, privacy, TinyCompressor'
};

export default function PrivacyPage() {
  // 英语作为默认语言，直接渲染组件，地址栏不显示 /en 前缀
  return (
    <StandardPageLayout locale="en">
      <PrivacyClient locale="en" />
    </StandardPageLayout>
  );
}






