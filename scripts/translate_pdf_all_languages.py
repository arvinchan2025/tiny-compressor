#!/usr/bin/env python3
"""
PDF 压缩器多语言翻译脚本
基于英文 PDF 翻译结构，批量翻译所有语言版本
"""

import json
import os
import sys
from pathlib import Path

# 添加项目根目录到 Python 路径
project_root = Path(__file__).parent.parent
sys.path.append(str(project_root))

# 导入翻译模块
from scripts.translation_utils import (
    translate_text, translate_array, translate_object,
    get_language_code, create_directory_if_not_exists,
    log_translation_progress, save_json_file
)

# 语言配置
LANGUAGES = {
    'zh': 'Chinese (Simplified)',
    'es': 'Spanish', 
    'fr': 'French',
    'de': 'German',
    'it': 'Italian',
    'pt': 'Portuguese',
    'ru': 'Russian',
    'ar': 'Arabic',
    'ja': 'Japanese',
    'ko': 'Korean'
}

# PDF 翻译结构定义
PDF_TRANSLATION_STRUCTURE = {
    'seo': {
        'type': 'object',
        'fields': ['title', 'description', 'keywords']
    },
    'hero': {
        'type': 'object', 
        'fields': ['title', 'description', 'subtitle', 'badge']
    },
    'formatInfo': {
        'type': 'object',
        'fields': ['description']
    },
    'features': {
        'type': 'object',
        'fields': ['title', 'description'],
        'arrays': ['items']
    },
    'technicalPrinciples': {
        'type': 'object',
        'fields': ['title', 'description'],
        'arrays': ['items']
    },
    'useCases': {
        'type': 'object',
        'fields': ['title', 'description'],
        'arrays': ['items']
    },
    'faq': {
        'type': 'object',
        'fields': ['title', 'description'],
        'arrays': ['items']
    },
    'quickLinks': {
        'type': 'object',
        'fields': ['title', 'description'],
        'arrays': ['items']
    },
    'operation': {
        'type': 'nested_object',
        'sections': ['upload', 'files', 'compress', 'progress', 'results', 'settings', 'actions', 'error', 'status', 'stats']
    },
    'cta': {
        'type': 'object',
        'fields': ['title', 'description', 'startButton', 'learnButton']
    }
}

def translate_pdf_section(section_data, section_name, target_lang):
    """翻译 PDF 翻译的特定部分"""
    try:
        if section_name == 'seo':
            return {
                'title': translate_text(section_data['title'], target_lang, 'SEO title'),
                'description': translate_text(section_data['description'], target_lang, 'SEO description'),
                'keywords': translate_text(section_data['keywords'], target_lang, 'SEO keywords')
            }
        
        elif section_name == 'hero':
            return {
                'title': translate_text(section_data['title'], target_lang, 'Hero title'),
                'description': translate_text(section_data['description'], target_lang, 'Hero description'),
                'subtitle': translate_text(section_data['subtitle'], target_lang, 'Hero subtitle'),
                'badge': translate_text(section_data['badge'], target_lang, 'Hero badge')
            }
        
        elif section_name == 'formatInfo':
            return {
                'description': translate_text(section_data['description'], target_lang, 'Format info description')
            }
        
        elif section_name == 'features':
            items = []
            for item in section_data['items']:
                items.append({
                    'icon': item['icon'],  # 图标不翻译
                    'title': translate_text(item['title'], target_lang, 'Feature title'),
                    'description': translate_text(item['description'], target_lang, 'Feature description')
                })
            
            return {
                'title': translate_text(section_data['title'], target_lang, 'Features title'),
                'description': translate_text(section_data['description'], target_lang, 'Features description'),
                'items': items
            }
        
        elif section_name == 'technicalPrinciples':
            items = []
            for item in section_data['items']:
                benefits = []
                for benefit in item['benefits']:
                    benefits.append(translate_text(benefit, target_lang, 'Technical principle benefit'))
                
                items.append({
                    'title': translate_text(item['title'], target_lang, 'Technical principle title'),
                    'description': translate_text(item['description'], target_lang, 'Technical principle description'),
                    'icon': item['icon'],  # 图标不翻译
                    'benefits': benefits
                })
            
            return {
                'title': translate_text(section_data['title'], target_lang, 'Technical principles title'),
                'description': translate_text(section_data['description'], target_lang, 'Technical principles description'),
                'items': items
            }
        
        elif section_name == 'useCases':
            items = []
            for item in section_data['items']:
                items.append({
                    'title': translate_text(item['title'], target_lang, 'Use case title'),
                    'description': translate_text(item['description'], target_lang, 'Use case description'),
                    'content': translate_text(item['content'], target_lang, 'Use case content'),
                    'icon': item['icon']  # 图标不翻译
                })
            
            return {
                'title': translate_text(section_data['title'], target_lang, 'Use cases title'),
                'description': translate_text(section_data['description'], target_lang, 'Use cases description'),
                'items': items
            }
        
        elif section_name == 'faq':
            items = []
            for item in section_data['items']:
                items.append({
                    'question': translate_text(item['question'], target_lang, 'FAQ question'),
                    'answer': translate_text(item['answer'], target_lang, 'FAQ answer')
                })
            
            return {
                'title': translate_text(section_data['title'], target_lang, 'FAQ title'),
                'description': translate_text(section_data['description'], target_lang, 'FAQ description'),
                'items': items
            }
        
        elif section_name == 'quickLinks':
            items = []
            for item in section_data['items']:
                items.append({
                    'title': translate_text(item['title'], target_lang, 'Quick link title'),
                    'description': translate_text(item['description'], target_lang, 'Quick link description'),
                    'url': item['url']  # URL 不翻译
                })
            
            return {
                'title': translate_text(section_data['title'], target_lang, 'Quick links title'),
                'description': translate_text(section_data['description'], target_lang, 'Quick links description'),
                'items': items
            }
        
        elif section_name == 'operation':
            return translate_operation_section(section_data, target_lang)
        
        elif section_name == 'cta':
            return {
                'title': translate_text(section_data['title'], target_lang, 'CTA title'),
                'description': translate_text(section_data['description'], target_lang, 'CTA description'),
                'startButton': translate_text(section_data['startButton'], target_lang, 'CTA start button'),
                'learnButton': translate_text(section_data['learnButton'], target_lang, 'CTA learn button')
            }
        
        else:
            return section_data
            
    except Exception as e:
        print(f"❌ 翻译 {section_name} 部分时出错: {e}")
        return section_data

def translate_operation_section(operation_data, target_lang):
    """翻译操作部分（最复杂的部分）"""
    try:
        translated = {}
        
        # 上传部分
        if 'upload' in operation_data:
            translated['upload'] = {
                'title': translate_text(operation_data['upload']['title'], target_lang, 'Upload title'),
                'subtitle': translate_text(operation_data['upload']['subtitle'], target_lang, 'Upload subtitle'),
                'selectFiles': translate_text(operation_data['upload']['selectFiles'], target_lang, 'Upload button')
            }
        
        # 文件信息部分
        if 'files' in operation_data:
            translated['files'] = {
                'title': translate_text(operation_data['files']['title'], target_lang, 'Files title'),
                'name': translate_text(operation_data['files']['name'], target_lang, 'File name label'),
                'dimensions': translate_text(operation_data['files']['dimensions'], target_lang, 'File dimensions label'),
                'count': operation_data['files']['count'],  # 模板字符串不翻译
                'remove': translate_text(operation_data['files']['remove'], target_lang, 'Remove button'),
                'sizeInfo': translate_text(operation_data['files']['sizeInfo'], target_lang, 'Size info label')
            }
        
        # 压缩部分
        if 'compress' in operation_data:
            translated['compress'] = {
                'start': translate_text(operation_data['compress']['start'], target_lang, 'Compress start button'),
                'processing': operation_data['compress']['processing']  # 模板字符串不翻译
            }
        
        # 进度部分
        if 'progress' in operation_data:
            translated['progress'] = {
                'label': translate_text(operation_data['progress']['label'], target_lang, 'Progress label'),
                'compressing': translate_text(operation_data['progress']['compressing'], target_lang, 'Progress message')
            }
        
        # 结果部分
        if 'results' in operation_data:
            translated['results'] = {}
            for key, value in operation_data['results'].items():
                if isinstance(value, str) and not value.startswith('{'):
                    translated['results'][key] = translate_text(value, target_lang, f'Results {key}')
                else:
                    translated['results'][key] = value  # 模板字符串不翻译
        
        # 设置部分
        if 'settings' in operation_data:
            translated['settings'] = {}
            for key, value in operation_data['settings'].items():
                if isinstance(value, str):
                    translated['settings'][key] = translate_text(value, target_lang, f'Settings {key}')
                else:
                    translated['settings'][key] = value
        
        # 操作按钮部分
        if 'actions' in operation_data:
            translated['actions'] = {}
            for key, value in operation_data['actions'].items():
                translated['actions'][key] = translate_text(value, target_lang, f'Action {key}')
        
        # 错误部分
        if 'error' in operation_data:
            translated['error'] = {}
            for key, value in operation_data['error'].items():
                if isinstance(value, str) and not value.startswith('{'):
                    translated['error'][key] = translate_text(value, target_lang, f'Error {key}')
                else:
                    translated['error'][key] = value  # 模板字符串不翻译
        
        # 状态部分
        if 'status' in operation_data:
            translated['status'] = {}
            for key, value in operation_data['status'].items():
                translated['status'][key] = translate_text(value, target_lang, f'Status {key}')
        
        # 统计部分
        if 'stats' in operation_data:
            translated['stats'] = {}
            for key, value in operation_data['stats'].items():
                translated['stats'][key] = translate_text(value, target_lang, f'Stats {key}')
        
        return translated
        
    except Exception as e:
        print(f"❌ 翻译操作部分时出错: {e}")
        return operation_data

def translate_pdf_for_language(target_lang, english_data):
    """为特定语言翻译 PDF 内容"""
    print(f"\n🌍 开始翻译 {LANGUAGES[target_lang]} ({target_lang})...")
    
    translated_data = {}
    total_sections = len(english_data)
    current_section = 0
    
    for section_name, section_data in english_data.items():
        current_section += 1
        print(f"  📝 翻译 {section_name} ({current_section}/{total_sections})...")
        
        try:
            translated_section = translate_pdf_section(section_data, section_name, target_lang)
            translated_data[section_name] = translated_section
            print(f"    ✅ {section_name} 完成")
        except Exception as e:
            print(f"    ❌ {section_name} 失败: {e}")
            translated_data[section_name] = section_data  # 使用原文作为后备
    
    return translated_data

def main():
    """主函数"""
    print("🚀 PDF 压缩器多语言翻译脚本启动")
    print("=" * 60)
    
    # 读取英文原文
    english_file = project_root / "lib/i18n/translations/en/compressors/pdf.json"
    if not english_file.exists():
        print(f"❌ 英文原文文件不存在: {english_file}")
        return
    
    try:
        with open(english_file, 'r', encoding='utf-8') as f:
            english_data = json.load(f)
        print(f"✅ 读取英文原文成功 ({len(english_data)} 个部分)")
    except Exception as e:
        print(f"❌ 读取英文原文失败: {e}")
        return
    
    # 为每种语言创建翻译
    success_count = 0
    total_languages = len(LANGUAGES)
    
    for lang_code, lang_name in LANGUAGES.items():
        try:
            print(f"\n{'='*20} {lang_name} ({lang_code}) {'='*20}")
            
            # 翻译内容
            translated_data = translate_pdf_for_language(lang_code, english_data)
            
            # 创建目录
            lang_dir = project_root / "lib/i18n/translations" / lang_code / "compressors"
            create_directory_if_not_exists(lang_dir)
            
            # 保存文件
            output_file = lang_dir / "pdf.json"
            save_json_file(output_file, translated_data)
            
            success_count += 1
            print(f"✅ {lang_name} 翻译完成!")
            
            # 显示统计
            sections_count = len(translated_data)
            print(f"   📊 翻译了 {sections_count} 个部分")
            
        except Exception as e:
            print(f"❌ {lang_name} 翻译失败: {e}")
            continue
    
    # 最终统计
    print(f"\n{'='*60}")
    print(f"🎉 翻译完成! 成功: {success_count}/{total_languages}")
    
    if success_count == total_languages:
        print("🎊 所有语言翻译完成!")
    else:
        print(f"⚠️  {total_languages - success_count} 个语言翻译失败")
    
    print("\n📝 下一步:")
    print("1. 运行 npm run build:translations 重新构建翻译文件")
    print("2. 测试各语言版本的 PDF 压缩器页面")

if __name__ == "__main__":
    main()
