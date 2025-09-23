import { NextRequest, NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

const SUPPORTED_LOCALES = ['en', 'zh', 'es', 'de', 'fr', 'ar'];

export async function GET(
  request: NextRequest,
  { params }: { params: { locale: string } }
) {
  try {
    const { locale } = params;
    
    // 验证语言代码
    if (!SUPPORTED_LOCALES.includes(locale)) {
      return NextResponse.json(
        { error: 'Unsupported locale' },
        { status: 400 }
      );
    }

    // 读取翻译文件
    const translationPath = join(process.cwd(), 'lib', 'translations', `${locale}.json`);
    
    try {
      const translationData = readFileSync(translationPath, 'utf8');
      const translations = JSON.parse(translationData);
      
      return NextResponse.json(translations, {
        headers: {
          'Cache-Control': 'public, max-age=3600, s-maxage=3600',
          'Content-Type': 'application/json; charset=utf-8',
        },
      });
    } catch (fileError) {
      console.error(`Failed to read translation file for ${locale}:`, fileError);
      
      // 回退到英文
      if (locale !== 'en') {
        const fallbackPath = join(process.cwd(), 'lib', 'translations', 'en.json');
        const fallbackData = readFileSync(fallbackPath, 'utf8');
        const fallbackTranslations = JSON.parse(fallbackData);
        
        return NextResponse.json(fallbackTranslations, {
          headers: {
            'Cache-Control': 'public, max-age=3600, s-maxage=3600',
            'Content-Type': 'application/json; charset=utf-8',
          },
        });
      }
      
      throw fileError;
    }
  } catch (error) {
    console.error('Translation API error:', error);
    
    return NextResponse.json(
      { error: 'Failed to load translations' },
      { status: 500 }
    );
  }
}


