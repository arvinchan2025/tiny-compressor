import { SupportedLanguage } from '@/types/i18n';
import UnifiedClient from '@/components/UnifiedClient';
import { Metadata } from 'next';
import { SUPPORTED_LANGUAGES } from '@/lib/language-config';
import ModernConverterNavigation from '@/components/converter/ModernConverterNavigation';
import {getLocalizedPath, Locale, supportedLocales} from "@/lib/i18n";

interface ConverterPageProps {
  params: {
    locale: string;
  };
}

export async function generateMetadata({ params }: ConverterPageProps): Promise<Metadata> {
  const { locale } = params;
  const validLocale: SupportedLanguage = SUPPORTED_LANGUAGES.includes(locale as SupportedLanguage)
    ? (locale as SupportedLanguage)
    : 'en';

  const metadata: Record<SupportedLanguage, { title: string; description: string; keywords: string }> = {
    en: {
      title: "Image Converter - Free Online Format Converter | TinyCompressor",
      description: "Convert images between JPG, PNG, WebP, AVIF, GIF, HEIC formats instantly. High-quality format conversion with batch processing. Free online image converter tool. No registration required.",
      keywords: "image converter, convert images, JPG to PNG, PNG to JPG, WebP converter, AVIF converter, GIF converter, HEIC converter, image format converter, online image converter, free image converter tool, batch image conversion"
    },
    zh: {
      title: "图片转换器 - 免费在线格式转换工具 | TinyCompressor",
      description: "在JPG、PNG、WebP、AVIF、GIF、HEIC格式之间即时转换图片。高质量格式转换，支持批量处理。免费在线图片转换工具。无需注册。",
      keywords: "图片转换器, 转换图片, JPG转PNG, PNG转JPG, WebP转换器, AVIF转换器, GIF转换器, HEIC转换器, 图片格式转换器, 在线图片转换器, 免费图片转换工具, 批量图片转换"
    },
    es: {
      title: "Convertidor de Imágenes - Convertidor Gratuito de Formatos Online | TinyCompressor",
      description: "Convierte imágenes entre formatos JPG, PNG, WebP, AVIF, GIF, HEIC instantáneamente. Conversión de formatos de alta calidad con procesamiento por lotes. Herramienta gratuita de conversión de imágenes online. No requiere registro.",
      keywords: "convertidor de imágenes, convertir imágenes, JPG a PNG, PNG a JPG, convertidor WebP, convertidor AVIF, convertidor GIF, convertidor HEIC, convertidor formato imagen, convertidor imagen online, herramienta gratuita convertidor imagen, conversión imagen por lotes"
    },
    de: {
      title: "Bildkonverter - Kostenloser Online-Format-Konverter | TinyCompressor",
      description: "Konvertieren Sie Bilder zwischen JPG, PNG, WebP, AVIF, GIF, HEIC Formaten sofort. Hochwertige Formatkonvertierung mit Stapelverarbeitung. Kostenloses Online-Bildkonvertierungstool. Keine Registrierung erforderlich.",
      keywords: "Bildkonverter, Bilder konvertieren, JPG zu PNG, PNG zu JPG, WebP-Konverter, AVIF-Konverter, GIF-Konverter, HEIC-Konverter, Bildformat-Konverter, Online-Bildkonverter, kostenloses Bildkonvertierungstool, Stapel-Bildkonvertierung"
    },
    fr: {
      title: "Convertisseur d'Images - Convertisseur Gratuit de Formats en Ligne | TinyCompressor",
      description: "Convertissez des images entre formats JPG, PNG, WebP, AVIF, GIF, HEIC instantanément. Conversion de formats haute qualité avec traitement par lots. Outil gratuit de conversion d'images en ligne. Aucune inscription requise.",
      keywords: "convertisseur d'images, convertir images, JPG vers PNG, PNG vers JPG, convertisseur WebP, convertisseur AVIF, convertisseur GIF, convertisseur HEIC, convertisseur format image, convertisseur image en ligne, outil gratuit convertisseur image, conversion image par lots"
    },
    ar: {
      title: "محول الصور - محول التنسيقات المجاني عبر الإنترنت | TinyCompressor",
      description: "حوّل الصور بين تنسيقات JPG، PNG، WebP، AVIF، GIF، HEIC فوراً. تحويل تنسيقات عالي الجودة مع معالجة مجمعة. أداة مجانية لتحويل الصور عبر الإنترنت. لا يتطلب تسجيل.",
      keywords: "محول الصور, تحويل الصور, JPG إلى PNG, PNG إلى JPG, محول WebP, محول AVIF, محول GIF, محول HEIC, محول تنسيق الصور, محول الصور عبر الإنترنت, أداة مجانية محول الصور, تحويل الصور المجمع"
    },
    ja: {
      title: "画像コンバーター - 無料オンライン形式変換ツール | TinyCompressor",
      description: "JPG、PNG、WebP、AVIF、GIF、HEIC形式間で画像を瞬時に変換。高品質形式変換とバッチ処理。無料オンライン画像変換ツール。登録不要。",
      keywords: "画像コンバーター, 画像変換, JPGからPNG, PNGからJPG, WebPコンバーター, AVIFコンバーター, GIFコンバーター, HEICコンバーター, 画像形式コンバーター, オンライン画像コンバーター, 無料画像変換ツール, バッチ画像変換"
    },
    ko: {
      title: "이미지 컨버터 - 무료 온라인 포맷 변환 도구 | TinyCompressor",
      description: "JPG, PNG, WebP, AVIF, GIF, HEIC 형식 간에 이미지를 즉시 변환. 고품질 형식 변환과 배치 처리. 무료 온라인 이미지 변환 도구. 등록 불필요.",
      keywords: "이미지 컨버터, 이미지 변환, JPG에서 PNG, PNG에서 JPG, WebP 컨버터, AVIF 컨버터, GIF 컨버터, HEIC 컨버터, 이미지 형식 컨버터, 온라인 이미지 컨버터, 무료 이미지 변환 도구, 배치 이미지 변환"
    },
    pt: {
      title: "Conversor de Imagens - Conversor Gratuito de Formatos Online | TinyCompressor",
      description: "Converta imagens entre formatos JPG, PNG, WebP, AVIF, GIF, HEIC instantaneamente. Conversão de formatos de alta qualidade com processamento em lote. Ferramenta gratuita de conversão de imagens online. Não requer registro.",
      keywords: "conversor de imagens, converter imagens, JPG para PNG, PNG para JPG, conversor WebP, conversor AVIF, conversor GIF, conversor HEIC, conversor formato imagem, conversor imagem online, ferramenta gratuita conversão imagem, conversão imagem em lote"
    },
    ru: {
      title: "Конвертер изображений - Бесплатный онлайн конвертер форматов | TinyCompressor",
      description: "Конвертируйте изображения между форматами JPG, PNG, WebP, AVIF, GIF, HEIC мгновенно. Высококачественная конвертация форматов с пакетной обработкой. Бесплатный онлайн инструмент конвертации изображений. Регистрация не требуется.",
      keywords: "конвертер изображений, конвертировать изображения, JPG в PNG, PNG в JPG, конвертер WebP, конвертер AVIF, конвертер GIF, конвертер HEIC, конвертер формата изображений, онлайн конвертер изображений, бесплатный инструмент конвертации изображений, пакетная конвертация изображений"
    },
    it: {
      title: "Convertitore di Immagini - Convertitore Gratuito di Formati Online | TinyCompressor",
      description: "Converti immagini tra formati JPG, PNG, WebP, AVIF, GIF, HEIC istantaneamente. Conversione di formati di alta qualità con elaborazione batch. Strumento gratuito di conversione immagini online. Nessuna registrazione richiesta.",
      keywords: "convertitore di immagini, convertire immagini, JPG in PNG, PNG in JPG, convertitore WebP, convertitore AVIF, convertitore GIF, convertitore HEIC, convertitore formato immagine, convertitore immagine online, strumento gratuito conversione immagini, conversione immagini batch"
    }
  };

  const meta = metadata[validLocale] || metadata.en;
  const pathname = '/converter'
  const languages: Record<string, string> = {};
  for (const lang of supportedLocales) {
    languages[lang] = getLocalizedPath(pathname, lang);
  }

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    openGraph: {
      title: meta.title,
      description: meta.description,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
    },
    alternates: {
      canonical: getLocalizedPath(pathname, locale as Locale),
      languages: {
        ...languages,
        'x-default': getLocalizedPath(pathname, 'en'),
      },
    },
  };
}

export default async function ConverterPage({ params }: ConverterPageProps) {
  const { locale } = params;
  const validLocale: SupportedLanguage = SUPPORTED_LANGUAGES.includes(locale as SupportedLanguage)
    ? (locale as SupportedLanguage)
    : 'en';

  return (
    <ModernConverterNavigation
      locale={validLocale} 
    />
  );
}