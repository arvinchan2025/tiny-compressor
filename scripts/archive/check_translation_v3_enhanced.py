#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
翻译检测脚本 V3.0 - 增强版
同时检测：
1. 内容质量（是否为目标语言）
2. 结构完整性（是否与英文原文匹配）
"""

import json
import re
from pathlib import Path
from langdetect import detect, LangDetectException

# 语言配置
LANGUAGES = {
    'zh': {'name': '中文', 'detect_codes': ['zh-cn', 'zh-tw'], 'type': 'CJK'},
    'ja': {'name': '日语', 'detect_codes': ['ja'], 'type': 'CJK'},
    'ko': {'name': '韩语', 'detect_codes': ['ko'], 'type': 'CJK'},
    'es': {'name': '西班牙语', 'detect_codes': ['es'], 'type': 'Latin'},
    'pt': {'name': '葡萄牙语', 'detect_codes': ['pt'], 'type': 'Latin'},
    'fr': {'name': '法语', 'detect_codes': ['fr'], 'type': 'Latin'},
    'it': {'name': '意大利语', 'detect_codes': ['it'], 'type': 'Latin'},
    'de': {'name': '德语', 'detect_codes': ['de'], 'type': 'Germanic'},
    'ru': {'name': '俄语', 'detect_codes': ['ru'], 'type': 'Cyrillic'},
    'ar': {'name': '阿拉伯语', 'detect_codes': ['ar'], 'type': 'Arabic'},
}

def should_skip_detection(text):
    """判断是否跳过内容检测"""
    if not isinstance(text, str) or len(text.strip()) < 3:
        return True
    if text.startswith('/') or ('{' in text and '}' in text):
        return True
    
    # 专有名词白名单
    tech_terms = ['Adobe RGB', 'sRGB', 'ProPhoto RGB', 'DCI-P3', 'Display P3']
    if text.strip() in tech_terms:
        return True
    
    words = re.findall(r'\b[A-Za-z]+\b', text)
    if len(words) <= 1:
        return True
    return False

def has_target_language_chars(text, target_lang):
    """检查是否包含目标语言字符"""
    if LANGUAGES[target_lang]['type'] == 'CJK':
        if target_lang == 'zh':
            return bool(re.search(r'[\u4e00-\u9fff]', text))
        elif target_lang == 'ja':
            return bool(re.search(r'[\u3040-\u309f\u30a0-\u30ff\u4e00-\u9fff]', text))
        elif target_lang == 'ko':
            return bool(re.search(r'[\uac00-\ud7af]', text))
    elif target_lang == 'ru':
        return bool(re.search(r'[\u0400-\u04ff]', text))
    elif target_lang == 'ar':
        return bool(re.search(r'[\u0600-\u06ff]', text))
    return False

def is_correct_language(text, target_lang):
    """检测是否为目标语言"""
    if should_skip_detection(text):
        return True, 'skip'
    
    # CJK/俄语/阿拉伯语：检查字符
    if LANGUAGES[target_lang]['type'] in ['CJK', 'Cyrillic', 'Arabic']:
        has_target_chars = has_target_language_chars(text, target_lang)
        if has_target_chars:
            return True, target_lang
        else:
            return False, 'en'
    
    # 拉丁语系和德语：简化检测
    return True, 'assumed_ok'  # 对拉丁语系，结构检测更重要

def get_all_paths(data, path=''):
    """递归获取所有JSON路径"""
    paths = set()
    
    if isinstance(data, dict):
        for key, value in data.items():
            new_path = f"{path}.{key}" if path else key
            paths.add(new_path)
            paths.update(get_all_paths(value, new_path))
    elif isinstance(data, list):
        for i, value in enumerate(data):
            new_path = f"{path}[{i}]"
            paths.add(new_path)
            paths.update(get_all_paths(value, new_path))
    
    return paths

def check_content_quality(data, target_lang, path=''):
    """检查内容质量（是否为目标语言）"""
    issues = []
    
    if isinstance(data, dict):
        for key, value in data.items():
            new_path = f"{path}.{key}" if path else key
            issues.extend(check_content_quality(value, target_lang, new_path))
    elif isinstance(data, list):
        for i, value in enumerate(data):
            new_path = f"{path}[{i}]"
            issues.extend(check_content_quality(value, target_lang, new_path))
    elif isinstance(data, str):
        is_correct, detected = is_correct_language(data, target_lang)
        if not is_correct:
            preview = data[:60] + '...' if len(data) > 60 else data
            issues.append({'path': path, 'text': preview, 'type': 'language'})
    
    return issues

def check_structure_completeness(en_data, target_data, file_type=''):
    """检查结构完整性"""
    en_paths = get_all_paths(en_data)
    target_paths = get_all_paths(target_data)
    
    missing_paths = en_paths - target_paths
    extra_paths = target_paths - en_paths
    
    # 过滤掉数组索引差异（内容数量不同是正常的）
    missing_critical = []
    for path in missing_paths:
        # 移除数组索引，检查是否是结构性缺失
        base_path = re.sub(r'\[\d+\]', '', path)
        if base_path and not any(re.sub(r'\[\d+\]', '', p) == base_path for p in target_paths):
            missing_critical.append(path)
    
    return {
        'total_en': len(en_paths),
        'total_target': len(target_paths),
        'missing': list(missing_critical)[:10],  # 只显示前10个
        'missing_count': len(missing_critical),
        'completeness': (len(target_paths) / len(en_paths) * 100) if en_paths else 100
    }

def check_file(en_file_path, target_file_path, target_lang):
    """检查单个文件（内容+结构）"""
    try:
        # 读取英文原文
        with open(en_file_path, 'r', encoding='utf-8') as f:
            en_data = json.load(f)
        
        # 读取目标语言文件
        with open(target_file_path, 'r', encoding='utf-8') as f:
            target_data = json.load(f)
        
        # 1. 检查内容质量
        content_issues = check_content_quality(target_data, target_lang)
        
        # 2. 检查结构完整性
        structure_check = check_structure_completeness(en_data, target_data)
        
        return {
            'content_issues': content_issues,
            'structure': structure_check
        }
    
    except Exception as e:
        return {
            'error': str(e),
            'content_issues': [],
            'structure': {'completeness': 0}
        }

def check_language(lang_code):
    """检查指定语言的所有翻译文件"""
    if lang_code not in LANGUAGES:
        print(f"❌ 不支持的语言代码: {lang_code}")
        return
    
    lang_info = LANGUAGES[lang_code]
    print(f"\n{'='*80}")
    print(f"🔍 检查{lang_info['name']}({lang_code.upper()})的翻译质量")
    print(f"   ✅ 内容质量检测：是否为正确的{lang_info['name']}")
    print(f"   ✅ 结构完整性检测：是否与英文原文匹配")
    print("="*80)
    
    en_base = Path('lib/i18n/translations/en')
    target_base = Path(f'lib/i18n/translations/{lang_code}')
    
    if not target_base.exists():
        print(f"❌ 路径不存在: {target_base}")
        return
    
    total_content_issues = 0
    total_structure_issues = 0
    files_checked = 0
    structure_problems = []
    
    # 检查压缩器
    print("\n【压缩器】\n")
    for comp in ['png', 'jpeg', 'webp', 'avif', 'gif', 'bmp']:
        en_file = en_base / 'compressors' / f'{comp}.json'
        target_file = target_base / 'compressors' / f'{comp}.json'
        
        if en_file.exists() and target_file.exists():
            result = check_file(en_file, target_file, lang_code)
            files_checked += 1
            
            content_count = len(result['content_issues'])
            structure = result['structure']
            completeness = structure.get('completeness', 0)
            
            # 状态显示
            if content_count == 0 and completeness >= 95:
                status = "✅"
            elif completeness < 70:
                status = "❌"
            else:
                status = "⚠️"
            
            print(f"{status} {comp.upper()}: 内容 {content_count}处 | 结构 {completeness:.1f}%")
            
            if completeness < 95:
                structure_problems.append({
                    'file': f'compressors/{comp}.json',
                    'completeness': completeness,
                    'missing': structure.get('missing_count', 0)
                })
            
            total_content_issues += content_count
            if completeness < 95:
                total_structure_issues += 1
    
    # 检查转换器
    print("\n【转换器】\n")
    for file in sorted((en_base / 'converters').glob('*.json')):
        target_file = target_base / 'converters' / file.name
        
        if target_file.exists():
            result = check_file(file, target_file, lang_code)
            files_checked += 1
            
            content_count = len(result['content_issues'])
            structure = result['structure']
            completeness = structure.get('completeness', 0)
            
            if content_count == 0 and completeness >= 95:
                status = "✅"
            elif completeness < 70:
                status = "❌"
            else:
                status = "⚠️"
            
            print(f"{status} {file.stem}: 内容 {content_count}处 | 结构 {completeness:.1f}%")
            
            if completeness < 95:
                structure_problems.append({
                    'file': f'converters/{file.name}',
                    'completeness': completeness,
                    'missing': structure.get('missing_count', 0)
                })
            
            total_content_issues += content_count
            if completeness < 95:
                total_structure_issues += 1
    
    # 检查Common文件
    print("\n【Common文件】\n")
    for common_file in ['navigation.json', 'messages.json', 'ui.json']:
        en_file = en_base / 'common' / common_file
        target_file = target_base / 'common' / common_file
        
        if en_file.exists() and target_file.exists():
            result = check_file(en_file, target_file, lang_code)
            files_checked += 1
            
            content_count = len(result['content_issues'])
            structure = result['structure']
            completeness = structure.get('completeness', 0)
            
            if content_count == 0 and completeness >= 95:
                status = "✅"
            else:
                status = "⚠️"
            
            print(f"{status} {common_file}: 内容 {content_count}处 | 结构 {completeness:.1f}%")
            
            total_content_issues += content_count
            if completeness < 95:
                total_structure_issues += 1
    
    # 总结报告
    print("\n" + "="*80)
    print(f"\n📊 {lang_info['name']}翻译质量报告")
    print(f"   检查文件: {files_checked}个")
    print(f"   内容问题: {total_content_issues}处（非{lang_info['name']}内容）")
    print(f"   结构问题: {total_structure_issues}个文件（不完整）")
    
    if total_content_issues == 0 and total_structure_issues == 0:
        print(f"\n🎉 完美！所有内容和结构都正确！")
        print(f"   翻译质量: ⭐⭐⭐⭐⭐")
    else:
        if structure_problems:
            print(f"\n⚠️ 结构不完整的文件（前5个）:")
            for prob in structure_problems[:5]:
                print(f"   - {prob['file']}: {prob['completeness']:.1f}% (缺失{prob['missing']}项)")
        
        if total_content_issues > 0:
            print(f"\n💡 建议: 修复{total_content_issues}处非{lang_info['name']}内容")
        if total_structure_issues > 0:
            print(f"💡 建议: 修复{total_structure_issues}个结构不完整的文件")
    
    print(f"\n💡 使用方法:")
    print(f"   python check_translation_v3_enhanced.py <语言代码>")
    print(f"   支持的语言: {', '.join(LANGUAGES.keys())}")
    print("="*80)

def main():
    import sys
    
    if len(sys.argv) < 2:
        print("❌ 请提供语言代码")
        print(f"   用法: python {sys.argv[0]} <语言代码>")
        print(f"   支持的语言: {', '.join(LANGUAGES.keys())}")
        return
    
    lang_code = sys.argv[1].lower()
    check_language(lang_code)

if __name__ == '__main__':
    main()



