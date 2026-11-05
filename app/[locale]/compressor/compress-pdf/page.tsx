import {Metadata} from 'next';
import {SupportedLanguage} from '@/types/i18n';
import ModernCompressorLayout, {getCompressorStaticProps} from "@/components/pages/ModernCompressorLayout";
import {PDFOperationSection} from "@/components/pages/sections/PDFOperationSection";

// 强制动态渲染
export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface CompressPdfPageProps {
  params: {
    locale: SupportedLanguage;
  };
}

const format = 'pdf'

export async function generateMetadata(props: any): Promise<Metadata> {
  return await getCompressorStaticProps({...props, format})
}

export default function CompressPdfPage({params}: CompressPdfPageProps) {
  return <ModernCompressorLayout
    locale={params.locale}
    format={format}
    maxFiles={10}
    operation={PDFOperationSection}
  />;
}

