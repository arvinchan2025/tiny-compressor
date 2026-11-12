import {Metadata} from 'next';
import {SupportedLanguage} from '@/types/i18n';
import ModernCompressorLayout, {getCompressorStaticProps} from "@/components/compressor/ModernCompressorLayout";

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
    <ModernCompressorLayout
      locale={params.locale}
      format={format}
      operationProps={{
        maxFiles: 10,
        defaultSettings: {
          quality: 6,
          lossless: true,
          optimizationLevel: 9
        }
      }}
    />
  );
}