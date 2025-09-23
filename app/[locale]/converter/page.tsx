import { SupportedLanguage } from '@/types/i18n';
import ConverterNavigation from '@/components/converter/ConverterNavigation';
import PageLayout from '@/components/layout/PageLayout';
import { Metadata } from 'next';

interface ConverterPageProps {
  params: {
    locale: string;
  };
}

export async function generateMetadata({ params }: ConverterPageProps): Promise<Metadata> {
  const { locale } = params;
  const validLocale: SupportedLanguage = ['en', 'zh', 'es', 'de', 'fr', 'ar'].includes(locale)
    ? (locale as SupportedLanguage)
    : 'en';

  const metadata: Record<SupportedLanguage, { title: string; description: string; keywords: string }> = {
    en: {
      title: "Image Converter - Free Online Format Converter | TinyCompressor",
      description: "Convert images between JPG, PNG, WebP, AVIF, GIF formats instantly. High-quality format conversion with batch processing. Free online image converter tool. No registration required.",
      keywords: "image converter, convert images, JPG to PNG, PNG to JPG, WebP converter, AVIF converter, GIF converter, image format converter, online image converter, free image converter tool, batch image conversion"
    },
    zh: {
      title: "图片转换器 - 免费在线格式转换工具 | TinyCompressor",
      description: "在JPG、PNG、WebP、AVIF、GIF格式之间即时转换图片。高质量格式转换，支持批量处理。免费在线图片转换工具。无需注册。",
      keywords: "图片转换器, 转换图片, JPG转PNG, PNG转JPG, WebP转换器, AVIF转换器, GIF转换器, 图片格式转换器, 在线图片转换器, 免费图片转换工具, 批量图片转换"
    },
    es: {
      title: "Convertidor de Imágenes - Convertidor Gratuito de Formatos Online | TinyCompressor",
      description: "Convierte imágenes entre formatos JPG, PNG, WebP, AVIF, GIF instantáneamente. Conversión de formatos de alta calidad con procesamiento por lotes. Herramienta gratuita de conversión de imágenes online. No requiere registro.",
      keywords: "convertidor de imágenes, convertir imágenes, JPG a PNG, PNG a JPG, convertidor WebP, convertidor AVIF, convertidor GIF, convertidor formato imagen, convertidor imagen online, herramienta gratuita convertidor imagen, conversión imagen por lotes"
    },
    de: {
      title: "Bildkonverter - Kostenloser Online-Format-Konverter | TinyCompressor",
      description: "Konvertieren Sie Bilder zwischen JPG, PNG, WebP, AVIF, GIF Formaten sofort. Hochwertige Formatkonvertierung mit Stapelverarbeitung. Kostenloses Online-Bildkonvertierungstool. Keine Registrierung erforderlich.",
      keywords: "Bildkonverter, Bilder konvertieren, JPG zu PNG, PNG zu JPG, WebP-Konverter, AVIF-Konverter, GIF-Konverter, Bildformat-Konverter, Online-Bildkonverter, kostenloses Bildkonvertierungstool, Stapel-Bildkonvertierung"
    },
    fr: {
      title: "Convertisseur d'Images - Convertisseur Gratuit de Formats en Ligne | TinyCompressor",
      description: "Convertissez des images entre formats JPG, PNG, WebP, AVIF, GIF instantanément. Conversion de formats haute qualité avec traitement par lots. Outil gratuit de conversion d'images en ligne. Aucune inscription requise.",
      keywords: "convertisseur d'images, convertir images, JPG vers PNG, PNG vers JPG, convertisseur WebP, convertisseur AVIF, convertisseur GIF, convertisseur format image, convertisseur image en ligne, outil gratuit convertisseur image, conversion image par lots"
    },
    ar: {
      title: "محول الصور - محول التنسيقات المجاني عبر الإنترنت | TinyCompressor",
      description: "حوّل الصور بين تنسيقات JPG، PNG، WebP، AVIF، GIF فوراً. تحويل تنسيقات عالي الجودة مع معالجة مجمعة. أداة مجانية لتحويل الصور عبر الإنترنت. لا يتطلب تسجيل.",
      keywords: "محول الصور, تحويل الصور, JPG إلى PNG, PNG إلى JPG, محول WebP, محول AVIF, محول GIF, محول تنسيق الصور, محول الصور عبر الإنترنت, أداة مجانية محول الصور, تحويل الصور المجمع"
    }
  };

  const meta = metadata[validLocale] || metadata.en;

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
      canonical: `/converter`,
    },
  };
}

export default async function ConverterPage({ params }: ConverterPageProps) {
  const { locale } = params;
  const validLocale: SupportedLanguage = ['en', 'zh', 'es', 'de', 'fr', 'ar'].includes(locale)
    ? (locale as SupportedLanguage)
    : 'en';

  return (
    <PageLayout locale={validLocale}>
      <ConverterNavigation locale={validLocale} />
    </PageLayout>
  );
}