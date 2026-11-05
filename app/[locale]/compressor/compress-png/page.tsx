import {Metadata} from 'next';
import {SupportedLanguage} from '@/types/i18n';
import ModernCompressorLayout, {getCompressorStaticProps} from "@/components/pages/ModernCompressorLayout";

// 强制动态渲染
// export const dynamic = 'force-dynamic';
export const revalidate = 0;
const format = 'png'


interface CompressPngPageProps {
  params: {
    locale: SupportedLanguage;
  };
}

export async function generateMetadata({params}: CompressPngPageProps): Promise<Metadata> {
  return await getCompressorStaticProps({params, format})
}

export default function CompressPngPage({params}: CompressPngPageProps) {
  return (
    // <CompressPngClient locale={params.locale} />
    <ModernCompressorLayout
      locale={params.locale}
      format={format}
      maxFiles={10}
    />
  );
}