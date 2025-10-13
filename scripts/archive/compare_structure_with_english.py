#!/usr/bin/env python3
#-*- coding:utf-8 -*-
"""对比所有语言与英语的结构差异"""
import json,sys,io,os
if sys.platform=='win32':sys.stdout=io.TextIOWrapper(sys.stdout.buffer,encoding='utf-8')

print('🔍 对比所有语言与英语结构\n'+'='*80+'\n')

languages=['zh','ja','ko','es','de','fr','pt','it','ru','ar']
compressors=['png','jpeg','webp','avif','gif','bmp']
converters=['png-to-jpg','jpg-to-png','png-to-webp','webp-to-png',
            'png-to-avif','webp-to-avif','jpeg-to-webp','webp-to-jpeg',
            'jpeg-to-avif','heic-to-jpeg']

def get_keys_recursive(data,prefix=''):
    """递归获取所有键路径"""
    keys=set()
    if isinstance(data,dict):
        for k,v in data.items():
            key_path=f'{prefix}.{k}' if prefix else k
            keys.add(key_path)
            if isinstance(v,(dict,list)):
                keys.update(get_keys_recursive(v,key_path))
    elif isinstance(data,list):
        for i,item in enumerate(data):
            key_path=f'{prefix}[{i}]'
            if isinstance(item,(dict,list)):
                keys.update(get_keys_recursive(item,key_path))
    return keys

print('分析结构差异...\n')

# 分析压缩器
print('【压缩器】\n')
for comp in compressors:
    en_file=f'lib/i18n/translations/en/compressors/{comp}.json'
    if not os.path.exists(en_file):
        continue
    
    with open(en_file,'r',encoding='utf-8') as f:
        en_data=json.load(f)
    en_keys=get_keys_recursive(en_data)
    
    print(f'{comp.upper()}:')
    for lang in languages[:3]:  # 只检查中日韩
        lang_file=f'lib/i18n/translations/{lang}/compressors/{comp}.json'
        if not os.path.exists(lang_file):
            print(f'  {lang}: 文件不存在')
            continue
        
        with open(lang_file,'r',encoding='utf-8') as f:
            lang_data=json.load(f)
        lang_keys=get_keys_recursive(lang_data)
        
        missing=en_keys-lang_keys
        extra=lang_keys-en_keys
        
        if missing or extra:
            print(f'  {lang}: 缺失{len(missing)}个键, 多余{len(extra)}个键')
            if missing and len(missing)<=5:
                for m in list(missing)[:5]:
                    print(f'    缺失: {m}')
        else:
            print(f'  {lang}: ✅ 结构一致')
    print()

print('\n【转换器】\n')
for conv in converters[:3]:  # 只检查前3个
    en_file=f'lib/i18n/translations/en/converters/{conv}.json'
    if not os.path.exists(en_file):
        continue
    
    with open(en_file,'r',encoding='utf-8') as f:
        en_data=json.load(f)
    en_keys=get_keys_recursive(en_data)
    
    print(f'{conv}:')
    for lang in languages[:3]:
        lang_file=f'lib/i18n/translations/{lang}/converters/{conv}.json'
        if not os.path.exists(lang_file):
            print(f'  {lang}: 文件不存在')
            continue
        
        with open(lang_file,'r',encoding='utf-8') as f:
            lang_data=json.load(f)
        lang_keys=get_keys_recursive(lang_data)
        
        missing=en_keys-lang_keys
        extra=lang_keys-en_keys
        
        if missing or extra:
            print(f'  {lang}: 缺失{len(missing)}个键, 多余{len(extra)}个键')
        else:
            print(f'  {lang}: ✅ 结构一致')
    print()

print('🎉 结构对比完成！')


