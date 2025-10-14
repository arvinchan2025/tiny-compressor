#!/usr/bin/env python3
"""
翻译工具模块
提供通用的翻译功能和工具函数
"""

import json
import os
import time
from pathlib import Path

# 模拟翻译函数（实际项目中应该集成真实的翻译 API）
def translate_text(text, target_lang, context=""):
    """
    翻译文本
    
    Args:
        text (str): 要翻译的文本
        target_lang (str): 目标语言代码
        context (str): 上下文信息
    
    Returns:
        str: 翻译后的文本
    """
    # 这里应该调用真实的翻译 API
    # 目前返回原文作为占位符
    return text

def translate_array(items, target_lang, context=""):
    """
    翻译数组
    
    Args:
        items (list): 要翻译的数组
        target_lang (str): 目标语言代码
        context (str): 上下文信息
    
    Returns:
        list: 翻译后的数组
    """
    translated_items = []
    for item in items:
        if isinstance(item, str):
            translated_items.append(translate_text(item, target_lang, context))
        elif isinstance(item, dict):
            translated_items.append(translate_object(item, target_lang, context))
        else:
            translated_items.append(item)
    return translated_items

def translate_object(obj, target_lang, context=""):
    """
    翻译对象
    
    Args:
        obj (dict): 要翻译的对象
        target_lang (str): 目标语言代码
        context (str): 上下文信息
    
    Returns:
        dict: 翻译后的对象
    """
    translated_obj = {}
    for key, value in obj.items():
        if isinstance(value, str):
            translated_obj[key] = translate_text(value, target_lang, f"{context}.{key}")
        elif isinstance(value, list):
            translated_obj[key] = translate_array(value, target_lang, f"{context}.{key}")
        elif isinstance(value, dict):
            translated_obj[key] = translate_object(value, target_lang, f"{context}.{key}")
        else:
            translated_obj[key] = value
    return translated_obj

def get_language_code(lang_name):
    """
    获取语言代码
    
    Args:
        lang_name (str): 语言名称
    
    Returns:
        str: 语言代码
    """
    lang_map = {
        'Chinese (Simplified)': 'zh',
        'Spanish': 'es',
        'French': 'fr',
        'German': 'de',
        'Italian': 'it',
        'Portuguese': 'pt',
        'Russian': 'ru',
        'Arabic': 'ar',
        'Japanese': 'ja',
        'Korean': 'ko'
    }
    return lang_map.get(lang_name, 'en')

def create_directory_if_not_exists(directory_path):
    """
    创建目录（如果不存在）
    
    Args:
        directory_path (Path): 目录路径
    """
    directory_path.mkdir(parents=True, exist_ok=True)

def log_translation_progress(current, total, item_name=""):
    """
    记录翻译进度
    
    Args:
        current (int): 当前进度
        total (int): 总数量
        item_name (str): 项目名称
    """
    percentage = (current / total) * 100 if total > 0 else 0
    print(f"  📝 {item_name} ({current}/{total}) - {percentage:.1f}%")

def save_json_file(file_path, data):
    """
    保存 JSON 文件
    
    Args:
        file_path (Path): 文件路径
        data (dict): 要保存的数据
    """
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def load_json_file(file_path):
    """
    加载 JSON 文件
    
    Args:
        file_path (Path): 文件路径
    
    Returns:
        dict: 加载的数据
    """
    with open(file_path, 'r', encoding='utf-8') as f:
        return json.load(f)
