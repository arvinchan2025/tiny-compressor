import {Metadata} from 'next';
import {SupportedLanguage} from '@/types/i18n';
import ModernCompressorLayout, {getCompressorStaticProps} from "@/components/pages/ModernCompressorLayout";

// 强制动态渲染
// export const dynamic = 'force-dynamic';
export const revalidate = 0;
const format = 'jpeg'


interface CompressJpegPageProps {
  params: {
    locale: SupportedLanguage;
  };
}

export async function generateMetadata(props: any): Promise<Metadata> {
  return await getCompressorStaticProps({...props, format})
}

export default function CompressPage({params}: CompressJpegPageProps) {
  return (
    <ModernCompressorLayout
      locale={params.locale}
      format={format}
      maxFiles={10}
    />
  );
}