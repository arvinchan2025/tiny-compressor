import {Metadata} from 'next';
import {SupportedLanguage} from '@/types/i18n';
import ModernCompressorLayout, {getCompressorStaticProps} from "@/components/compressor/ModernCompressorLayout";
// 强制动态渲染
export const dynamic = 'force-dynamic';
export const revalidate = 0;



interface CompressGifPageProps {
  params: {
    locale: SupportedLanguage;
  };
}
const format = 'gif'
export async function generateMetadata(props: any): Promise<Metadata> {
  return await getCompressorStaticProps({...props, format})
}

export default function CompressPage({params}: any) {
  return (
    // <CompressPngClient locale={params.locale} />
    <ModernCompressorLayout
      locale={params.locale}
      format={format}
      operationProps={{
        maxFiles: 10,
        advSettings: {
          avifOptions: {
            quality: 85,
            lossless: false,
            colorSpace: 'srgb',
            speed: 8
          }
        }
      }}
    />
  );
}
