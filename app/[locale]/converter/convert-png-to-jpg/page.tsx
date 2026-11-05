import {Metadata} from 'next';
import {SupportedLanguage} from '@/types/i18n';
import ModernConverterLayout, {getConverterStaticProps} from "@/components/pages/ModernConverterLayout";

interface ConvertPngToJpgPageProps {
  params: {
    locale: SupportedLanguage;
  };
}

const format = 'png'
const targetFormat = 'jpg'
export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { locale } = params;
  return await getConverterStaticProps({
    params,
    format,
    targetFormat
  })
}

export default function ConvertPage({ params }: any) {
  return (
    <ModernConverterLayout
      locale={params.locale}
      format={format}
      targetFormat={targetFormat}
    />
  );
}