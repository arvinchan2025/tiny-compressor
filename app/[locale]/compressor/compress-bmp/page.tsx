import {Metadata} from 'next';
import {SupportedLanguage} from '@/types/i18n';
import ModernCompressorLayout, {getCompressorStaticProps} from "@/components/pages/ModernCompressorLayout";

// 强制动态渲染
export const dynamic = 'force-dynamic';
export const revalidate = 0;


interface CompressBmpPageProps {
  params: {
    locale: SupportedLanguage;
  };
}
const format = 'bmp'
export async function generateMetadata(props: any): Promise<Metadata> {
  return await getCompressorStaticProps({...props, format})
}

export default function CompressPage({params}: any) {
  return (
    // <CompressPngClient locale={params.locale} />
    <ModernCompressorLayout
      locale={params.locale}
      format={format}
      maxFiles={10}
    />
  );
}





