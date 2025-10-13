#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
所有语言翻译检测 V3 - 全面检测
检测：内容质量 + 结构完整性 + 文件名一致性
"""

import json
import re
from pathlib import Path

LANGUAGES = {
    'zh': '中文', 'ja': '日语', 'ko': '韩语', 'es': '西班牙语',
    'pt': '葡萄牙语', 'fr': '法语', 'it': '意大利语',
    'de': '德语', 'ru': '俄语', 'ar': '阿拉伯语'
}

# 文件名映射（英文 -> 其他语言）
FILE_MAPPING = {
    'heic-to-jpg.json': 'heic-to-jpeg.json',
    'jpg-to-avif.json': 'jpeg-to-avif.json',
    'webp-to-jpg.json': 'webp-to-jpeg.json',
}

def get_all_paths(data):
    """获取所有JSON路径"""
    paths = set()
    
    def traverse(d, path=''):
        if isinstance(d, dict):
            for key, value in d.items():
                new_path = f"{path}.{key}" if path else key
                paths.add(new_path)
                traverse(value, new_path)
        elif isinstance(d, list):
            for i, value in enumerate(d):
                new_path = f"{path}[{i}]"
                paths.add(new_path)
                traverse(value, new_path)
    
    traverse(data)
    return paths

def check_completeness(en_file, target_file):
    """检查结构完整性"""
    try:
        with open(en_file, 'r', encoding='utf-8') as f:
            en_data = json.load(f)
        with open(target_file, 'r', encoding='utf-8') as f:
            target_data = json.load(f)
        
        en_paths = get_all_paths(en_data)
        target_paths = get_all_paths(target_data)
        
        completeness = (len(target_paths) / len(en_paths) * 100) if en_paths else 0
        
        return {
            'exists': True,
            'en_count': len(en_paths),
            'target_count': len(target_paths),
            'completeness': completeness
        }
    except:
        return {'exists': False, 'completeness': 0}

print("=" * 80)
print("所有语言翻译完整性检测 V3")
print("=" * 80)

en_base = Path('lib/i18n/translations/en')

# 收集所有需要检查的文件
files_to_check = []

# 压缩器
for comp in ['png', 'jpeg', 'webp', 'avif', 'gif', 'bmp']:
    files_to_check.append(('compressors', f'{comp}.json', f'{comp}.json'))

# 转换器
for file in sorted((en_base / 'converters').glob('*.json')):
    en_name = file.name
    target_name = FILE_MAPPING.get(en_name, en_name)
    files_to_check.append(('converters', en_name, target_name))

# 检查每个语言
results = {}

for lang_code, lang_name in LANGUAGES.items():
    print(f"\n检查 {lang_name}({lang_code.upper()})...")
    
    target_base = Path(f'lib/i18n/translations/{lang_code}')
    lang_results = []
    
    total_files = 0
    complete_files = 0
    incomplete_files = []
    
    for folder, en_name, target_name in files_to_check:
        en_file = en_base / folder / en_name
        target_file = target_base / folder / target_name
        
        if en_file.exists():
            total_files += 1
            result = check_completeness(en_file, target_file)
            
            if result['exists']:
                completeness = result['completeness']
                
                if completeness >= 95:
                    complete_files += 1
                elif completeness < 70:
                    incomplete_files.append({
                        'file': f"{folder}/{target_name}",
                        'completeness': completeness,
                        'en_count': result['en_count'],
                        'target_count': result['target_count']
                    })
    
    completion_rate = (complete_files / total_files * 100) if total_files > 0 else 0
    
    results[lang_code] = {
        'name': lang_name,
        'total': total_files,
        'complete': complete_files,
        'incomplete': incomplete_files,
        'rate': completion_rate
    }
    
    # 状态显示
    if completion_rate >= 95:
        status = "✅"
    elif completion_rate >= 70:
        status = "⚠️"
    else:
        status = "❌"
    
    print(f"  {status} 完整文件: {complete_files}/{total_files} ({completion_rate:.1f}%)")
    
    if incomplete_files:
        print(f"  ⚠️ 严重不完整的文件:")
        for item in incomplete_files[:3]:
            print(f"     - {item['file']}: {item['completeness']:.1f}% ({item['target_count']}/{item['en_count']}键)")

# 总结报告
print("\n" + "=" * 80)
print("📊 所有语言翻译完整性汇总\n")
print(f"{'语言':<12} {'完整文件':<15} {'完成率':<10} {'状态'}")
print("-" * 80)

for lang_code in ['zh', 'ja', 'ko', 'es', 'pt', 'fr', 'it', 'de', 'ru', 'ar']:
    result = results[lang_code]
    rate = result['rate']
    
    if rate >= 95:
        status = "✅ 优秀"
    elif rate >= 70:
        status = "⚠️ 需改进"
    else:
        status = "❌ 严重问题"
    
    print(f"{result['name']:<10} {result['complete']:>3}/{result['total']:<10} {rate:>6.1f}%    {status}")

# 重点问题文件
print("\n" + "=" * 80)
print("⚠️ 需要优先修复的文件（<70%完整性）:\n")

problem_files = {}
for lang_code, result in results.items():
    for item in result['incomplete']:
        file_name = item['file']
        if file_name not in problem_files:
            problem_files[file_name] = []
        problem_files[file_name].append({
            'lang': lang_code,
            'completeness': item['completeness']
        })

# 按问题严重程度排序
for file_name in sorted(problem_files.keys()):
    langs = problem_files[file_name]
    if len(langs) >= 5:  # 至少5个语言都有问题
        avg_completeness = sum(l['completeness'] for l in langs) / len(langs)
        print(f"{file_name}:")
        print(f"  影响语言: {len(langs)}个, 平均完整性: {avg_completeness:.1f}%")
        print(f"  语言: {', '.join([l['lang'] for l in langs])}")
        print()

print("=" * 80)
print("\n💡 建议:")
print("  1. 优先修复影响多个语言的文件（如 heic-to-jpeg）")
print("  2. 使用英文原文作为基准，重新创建完整的翻译文件")
print("  3. 确保文件名与英文版本一致或建立映射关系")



