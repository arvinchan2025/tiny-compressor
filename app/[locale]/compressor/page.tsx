import { SupportedLanguage } from '@/types/i18n';
import UnifiedClient from '@/components/UnifiedClient';
import { Metadata } from 'next';
import { SUPPORTED_LANGUAGES } from '@/lib/language-config';
import {loadServerTranslations} from "@/lib/i18n/ssr-optimization";
import {Locale} from "@/lib/i18n";
import UnifiedNavigation from "@/components/navigation/UnifiedNavigation";
import React from "react";
import ModernCompressorNavigation from "@/components/compressor/ModernCompressorNavigation";

interface CompressorPageProps {
  params: {
    locale: Locale;
  };
}

export async function generateMetadata({ params }: CompressorPageProps): Promise<Metadata> {
  const { locale } = params;
  const translations = await loadServerTranslations('', locale)
  const validLocale: SupportedLanguage = SUPPORTED_LANGUAGES.includes(locale as SupportedLanguage)
    ? (locale as SupportedLanguage)
    : 'en';

  const metadata: Record<SupportedLanguage, { title: string; description: string; keywords: string }> = {
    en: {
      title: "Image Compressor - Free Online Compression Tool | TinyCompressor",
      description: "Compress images online for free! Reduce JPG, PNG, WebP, AVIF, GIF file sizes by up to 90% while maintaining quality. Smart compression with batch processing. No registration required.",
      keywords: "image compressor, compress images, reduce file size, JPG compression, PNG compression, WebP compression, AVIF compression, GIF compression, batch compression, online image optimizer, free image compression tool"
    },
    zh: {
      title: "图片压缩器 - 免费在线压缩工具 | TinyCompressor",
      description: "免费在线压缩图片！将JPG、PNG、WebP、AVIF、GIF文件大小减少高达90%，同时保持质量。智能压缩，支持批量处理。无需注册。",
      keywords: "图片压缩器, 压缩图片, 减少文件大小, JPG压缩, PNG压缩, WebP压缩, AVIF压缩, GIF压缩, 批量压缩, 在线图片优化器, 免费图片压缩工具"
    },
    es: {
      title: "Compresor de Imágenes - Herramienta Gratuita de Compresión Online | TinyCompressor",
      description: "¡Comprime imágenes en línea gratis! Reduce el tamaño de archivos JPG, PNG, WebP, AVIF, GIF hasta un 90% manteniendo la calidad. Compresión inteligente con procesamiento por lotes. No requiere registro.",
      keywords: "compresor de imágenes, comprimir imágenes, reducir tamaño archivo, compresión JPG, compresión PNG, compresión WebP, compresión AVIF, compresión GIF, compresión por lotes, optimizador imagen online, herramienta gratuita compresión imagen"
    },
    de: {
      title: "Bildkompressor - Kostenloses Online-Komprimierungstool | TinyCompressor",
      description: "Bilder kostenlos online komprimieren! Reduzieren Sie JPG, PNG, WebP, AVIF, GIF Dateigrößen um bis zu 90% bei gleichbleibender Qualität. Intelligente Komprimierung mit Stapelverarbeitung. Keine Registrierung erforderlich.",
      keywords: "Bildkompressor, Bilder komprimieren, Dateigröße reduzieren, JPG-Komprimierung, PNG-Komprimierung, WebP-Komprimierung, AVIF-Komprimierung, GIF-Komprimierung, Stapelkomprimierung, Online-Bildoptimierer, kostenloses Bildkomprimierungstool"
    },
    fr: {
      title: "Compresseur d'Images - Outil Gratuit de Compression en Ligne | TinyCompressor",
      description: "Compressez des images en ligne gratuitement ! Réduisez la taille des fichiers JPG, PNG, WebP, AVIF, GIF jusqu'à 90% tout en maintenant la qualité. Compression intelligente avec traitement par lots. Aucune inscription requise.",
      keywords: "compresseur d'images, compresser images, réduire taille fichier, compression JPG, compression PNG, compression WebP, compression AVIF, compression GIF, compression par lots, optimiseur image en ligne, outil gratuit compression image"
    },
    ar: {
      title: "ضاغط الصور - أداة الضغط المجانية عبر الإنترنت | TinyCompressor",
      description: "اضغط الصور مجاناً عبر الإنترنت! قلل حجم ملفات JPG، PNG، WebP، AVIF، GIF بنسبة تصل إلى 90% مع الحفاظ على الجودة. ضغط ذكي مع معالجة مجمعة. لا يتطلب تسجيل.",
      keywords: "ضاغط الصور, ضغط الصور, تقليل حجم الملف, ضغط JPG, ضغط PNG, ضغط WebP, ضغط AVIF, ضغط GIF, ضغط مجمع, محسن الصور عبر الإنترنت, أداة ضغط الصور المجانية"
    },
    ja: {
      title: "画像圧縮ツール - 無料オンライン圧縮ツール | TinyCompressor",
      description: "画像を無料でオンライン圧縮！JPG、PNG、WebP、AVIF、GIFファイルサイズを品質を保ちながら最大90%削減。スマート圧縮とバッチ処理。登録不要。",
      keywords: "画像圧縮ツール, 画像圧縮, ファイルサイズ削減, JPG圧縮, PNG圧縮, WebP圧縮, AVIF圧縮, GIF圧縮, バッチ圧縮, オンライン画像最適化, 無料画像圧縮ツール"
    },
    ko: {
      title: "이미지 압축기 - 무료 온라인 압축 도구 | TinyCompressor",
      description: "이미지를 무료로 온라인 압축! 품질을 유지하면서 JPG, PNG, WebP, AVIF, GIF 파일 크기를 최대 90%까지 줄입니다. 스마트 압축과 배치 처리. 등록 불필요.",
      keywords: "이미지 압축기, 이미지 압축, 파일 크기 줄이기, JPG 압축, PNG 압축, WebP 압축, AVIF 압축, GIF 압축, 배치 압축, 온라인 이미지 최적화, 무료 이미지 압축 도구"
    },
    pt: {
      title: "Compressor de Imagens - Ferramenta Gratuita de Compressão Online | TinyCompressor",
      description: "Comprima imagens online gratuitamente! Reduza o tamanho dos arquivos JPG, PNG, WebP, AVIF, GIF em até 90% mantendo a qualidade. Compressão inteligente com processamento em lote. Não requer registro.",
      keywords: "compressor de imagens, comprimir imagens, reduzir tamanho arquivo, compressão JPG, compressão PNG, compressão WebP, compressão AVIF, compressão GIF, compressão em lote, otimizador imagem online, ferramenta gratuita compressão imagem"
    },
    ru: {
      title: "Компрессор изображений - Бесплатный онлайн инструмент сжатия | TinyCompressor",
      description: "Сжимайте изображения онлайн бесплатно! Уменьшайте размеры файлов JPG, PNG, WebP, AVIF, GIF до 90% сохраняя качество. Умное сжатие с пакетной обработкой. Регистрация не требуется.",
      keywords: "компрессор изображений, сжатие изображений, уменьшение размера файла, сжатие JPG, сжатие PNG, сжатие WebP, сжатие AVIF, сжатие GIF, пакетное сжатие, онлайн оптимизатор изображений, бесплатный инструмент сжатия изображений"
    },
    it: {
      title: "Compressore di Immagini - Strumento Gratuito di Compressione Online | TinyCompressor",
      description: "Comprimi immagini online gratuitamente! Riduci le dimensioni dei file JPG, PNG, WebP, AVIF, GIF fino al 90% mantenendo la qualità. Compressione intelligente con elaborazione batch. Nessuna registrazione richiesta.",
      keywords: "compressore di immagini, comprimere immagini, ridurre dimensione file, compressione JPG, compressione PNG, compressione WebP, compressione AVIF, compressione GIF, compressione batch, ottimizzatore immagini online, strumento gratuito compressione immagini"
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
      canonical: `/compressor`,
    },
  };
}

export default async function CompressorPage({ params }: CompressorPageProps) {
  const { locale } = params;
  const validLocale: SupportedLanguage = SUPPORTED_LANGUAGES.includes(locale as SupportedLanguage)
    ? (locale as SupportedLanguage)
    : 'en';

  return (
    <ModernCompressorNavigation locale={locale} />
    // <UnifiedClient
    //   locale={validLocale}
    //   pageType="navigation"
    //   sourceFormat="compressor"
    // />
  );
}