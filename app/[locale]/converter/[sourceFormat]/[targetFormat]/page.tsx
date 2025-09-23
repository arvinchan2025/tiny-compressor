/**
 * 动态格式转换页面
 * 支持任意格式之间的转换
 */

import { SupportedLanguage } from '@/types/i18n';
import ConverterPageLayout from '@/components/layout/ConverterPageLayout';
import { Metadata } from 'next';

interface ConverterPageProps {
  params: {
    locale: string;
    sourceFormat: string;
    targetFormat: string;
  };
}

// 支持的格式
const SUPPORTED_FORMATS = ['jpeg', 'jpg', 'png', 'webp', 'avif', 'gif'];

// 生成元数据
export async function generateMetadata({ params }: ConverterPageProps): Promise<Metadata> {
  const { locale, sourceFormat, targetFormat } = params;
  const validLocale: SupportedLanguage = ['en', 'zh', 'es', 'de', 'fr', 'ar'].includes(locale)
    ? (locale as SupportedLanguage)
    : 'en';

  const sourceUpper = sourceFormat.toUpperCase();
  const targetUpper = targetFormat.toUpperCase();

  return {
    title: `${sourceUpper} to ${targetUpper} Converter - Free Online Image Format Conversion`,
    description: `Convert ${sourceUpper} images to ${targetUpper} format online for free. High-quality image format conversion with batch processing support. Fast, secure, and completely private.`,
    keywords: `${sourceUpper}, ${targetUpper}, image converter, format conversion, ${sourceFormat} to ${targetFormat}, online image converter, batch conversion, free image tools`,
    openGraph: {
      title: `${sourceUpper} to ${targetUpper} Converter - Free Online Image Format Conversion`,
      description: `Convert ${sourceUpper} images to ${targetUpper} format online for free. High-quality image format conversion with batch processing support.`,
      type: 'website',
      locale: validLocale,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${sourceUpper} to ${targetUpper} Converter - Free Online Image Format Conversion`,
      description: `Convert ${sourceUpper} images to ${targetUpper} format online for free. High-quality image format conversion with batch processing support.`,
    },
    alternates: {
      canonical: `/${validLocale}/converter/${sourceFormat}/${targetFormat}`,
      languages: {
        'en': '/en/converter/${sourceFormat}/${targetFormat}',
        'zh': '/zh/converter/${sourceFormat}/${targetFormat}',
        'es': '/es/converter/${sourceFormat}/${targetFormat}',
        'de': '/de/converter/${sourceFormat}/${targetFormat}',
        'fr': '/fr/converter/${sourceFormat}/${targetFormat}',
        'ar': '/ar/converter/${sourceFormat}/${targetFormat}',
      },
    },
  };
}

// 验证格式是否支持
function isValidFormat(format: string): boolean {
  return SUPPORTED_FORMATS.includes(format.toLowerCase());
}

// 生成静态路径
export async function generateStaticParams() {
  const locales: SupportedLanguage[] = ['en', 'zh', 'es', 'de', 'fr', 'ar'];
  const params: Array<{ locale: string; sourceFormat: string; targetFormat: string }> = [];

  // 生成常见的转换路径
  const commonConversions = [
    ['jpg', 'png'],
    ['png', 'jpg'],
    ['jpg', 'webp'],
    ['png', 'webp'],
    ['webp', 'jpg'],
    ['webp', 'png'],
    ['jpg', 'avif'],
    ['png', 'avif'],
    ['avif', 'jpg'],
    ['avif', 'png'],
    ['gif', 'png'],
    ['png', 'gif'],
  ];

  locales.forEach(locale => {
    commonConversions.forEach(([source, target]) => {
      params.push({
        locale,
        sourceFormat: source!,
        targetFormat: target!,
      });
    });
  });

  return params;
}

export default function ConverterPage({ params }: ConverterPageProps) {
  const { locale, sourceFormat, targetFormat } = params;
  const validLocale: SupportedLanguage = ['en', 'zh', 'es', 'de', 'fr', 'ar'].includes(locale)
    ? (locale as SupportedLanguage)
    : 'en';

  // 验证格式
  if (!isValidFormat(sourceFormat) || !isValidFormat(targetFormat)) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Unsupported Format</h1>
          <p className="text-gray-600 mb-4">
            The format conversion from {sourceFormat.toUpperCase()} to {targetFormat.toUpperCase()} is not supported.
          </p>
          <p className="text-gray-500 text-sm">
            Supported formats: {SUPPORTED_FORMATS.map(f => f.toUpperCase()).join(', ')}
          </p>
        </div>
      </div>
    );
  }

  // 检查是否是相同的格式
  if (sourceFormat.toLowerCase() === targetFormat.toLowerCase()) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="text-yellow-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Same Format</h1>
          <p className="text-gray-600 mb-4">
            You're trying to convert {sourceFormat.toUpperCase()} to {targetFormat.toUpperCase()}, which are the same format.
          </p>
          <p className="text-gray-500 text-sm">
            Please choose a different target format.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ConverterPageLayout
      locale={validLocale}
      sourceFormat={sourceFormat.toLowerCase()}
      targetFormat={targetFormat.toLowerCase()}
    />
  );
}

