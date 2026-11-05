import {Metadata} from 'next';
import {SupportedLanguage} from '@/types/i18n';
import ModernCompressorLayout, {getCompressorStaticProps} from '@/components/pages/ModernCompressorLayout';
import {VideoOperationSection} from "@/components/pages/sections/VideoOperationSection";

// 强制动态渲染
export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface CompressVideoPageProps {
  params: {
    locale: SupportedLanguage;
  };
}

const format = 'video'

export async function generateMetadata(props: any): Promise<Metadata> {
  return await getCompressorStaticProps({...props, format})
}


export default function CompressVideoPage({params}: any) {
  return <ModernCompressorLayout
    locale={params.locale}
    format={format}
    maxFiles={10}
    operation={VideoOperationSection}
  />;
}
