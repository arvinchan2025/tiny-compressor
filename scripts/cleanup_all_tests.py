#!/usr/bin/env python3
"""
全面清理测试相关代码
删除开发期间的测试页面和组件
保留正式测试套件
"""

import shutil
from pathlib import Path

ROOT_DIR = Path(__file__).parent.parent

# 测试页面目录（要删除）
TEST_PAGE_DIRS = [
    'app/[locale]/test-japanese-compressors',
    'app/[locale]/test-italian-compressors',
    'app/[locale]/test-french-compressors',
    'app/[locale]/test-german-compressors',
    'app/[locale]/test-avif-translation',
    'app/[locale]/test-all-compressors-i18n',
    'app/[locale]/test-bmp',
    'app/[locale]/test-modern-seo',
    'app/[locale]/test-all-compressors',
    'app/[locale]/test-gif',
    'app/[locale]/test-avif',
    'app/[locale]/test-translation',
    'app/[locale]/test-webp',
]

# 测试组件目录（要删除）
TEST_COMPONENTS_DIR = 'components/test'

def delete_test_pages():
    """删除测试页面目录"""
    print("\n[1/2] Deleting test page routes...")
    
    deleted = 0
    not_found = 0
    
    for test_dir in TEST_PAGE_DIRS:
        dir_path = ROOT_DIR / test_dir
        if dir_path.exists():
            try:
                shutil.rmtree(dir_path)
                deleted += 1
                print(f"  [OK] Deleted: {test_dir}")
            except Exception as e:
                print(f"  [ERROR] Failed to delete {test_dir}: {e}")
        else:
            not_found += 1
    
    print(f"\n  Summary: Deleted {deleted}/{len(TEST_PAGE_DIRS)} test pages")
    if not_found > 0:
        print(f"           {not_found} already removed")
    
    return deleted

def delete_test_components():
    """删除测试组件目录"""
    print("\n[2/2] Deleting test components...")
    
    test_comp_path = ROOT_DIR / TEST_COMPONENTS_DIR
    
    if not test_comp_path.exists():
        print("  [SKIP] components/test/ already removed")
        return 0
    
    # 统计文件
    files = list(test_comp_path.glob('*.tsx'))
    file_count = len(files)
    
    try:
        shutil.rmtree(test_comp_path)
        print(f"  [OK] Deleted: components/test/")
        print(f"  [OK] Removed {file_count} test component files")
        return file_count
    except Exception as e:
        print(f"  [ERROR] Failed to delete: {e}")
        return 0

def print_summary(pages_deleted, components_deleted):
    """打印清理总结"""
    print("\n" + "=" * 60)
    print("TEST CLEANUP COMPLETED")
    print("=" * 60)
    print(f"\nRemoved:")
    print(f"  - {pages_deleted} test page routes")
    print(f"  - {components_deleted} test component files")
    print(f"  - components/test/ directory")
    print(f"\nTotal cleaned: {pages_deleted + components_deleted} files")
    print("\nWhat was kept (正式测试套件):")
    print("  - __tests__/ directory (单元测试)")
    print("  - e2e/ directory (E2E测试)")
    print("  - jest.config.js (Jest配置)")
    print("  - playwright.config.ts (Playwright配置)")
    print("\nTest structure is now production-ready!")
    print("=" * 60)

def list_what_will_be_deleted():
    """列出将要删除的内容"""
    print("\nTest pages to be deleted (13):")
    for i, test_dir in enumerate(TEST_PAGE_DIRS, 1):
        print(f"  {i}. {test_dir}")
    
    print("\nTest components to be deleted:")
    test_comp_path = ROOT_DIR / TEST_COMPONENTS_DIR
    if test_comp_path.exists():
        files = list(test_comp_path.glob('*.tsx'))
        print(f"  - components/test/ ({len(files)} files)")
        for f in files[:5]:  # 只显示前5个
            print(f"    - {f.name}")
        if len(files) > 5:
            print(f"    - ... and {len(files) - 5} more files")
    else:
        print("  - components/test/ (already removed)")

def main():
    print("=" * 60)
    print("CLEANUP ALL TEST CODE")
    print("=" * 60)
    print("\nThis will remove development test pages and components.")
    print("Formal test suites (__tests__ and e2e) will be preserved.")
    
    # 列出要删除的内容
    list_what_will_be_deleted()
    
    print("\n" + "=" * 60)
    print("Ready to clean up!")
    
    # 执行清理
    pages_deleted = delete_test_pages()
    components_deleted = delete_test_components()
    
    # 打印总结
    print_summary(pages_deleted, components_deleted)

if __name__ == '__main__':
    main()

