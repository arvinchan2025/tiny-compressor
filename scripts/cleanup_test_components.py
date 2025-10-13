#!/usr/bin/env python3
"""
清理测试组件脚本
删除 components/test 目录中的临时测试组件
保留正式的测试套件（__tests__ 和 e2e）
"""

import shutil
from pathlib import Path

ROOT_DIR = Path(__file__).parent.parent

# 要删除的测试组件目录
TEST_COMPONENTS_DIR = ROOT_DIR / 'components' / 'test'

# 检查是否被引用
def check_references():
    """检查测试组件是否还在被引用"""
    print("\n[1/2] Checking for references to test components...")
    
    app_dir = ROOT_DIR / 'app'
    if not app_dir.exists():
        print("  [SKIP] app directory not found")
        return True
    
    # 搜索可能的引用
    references_found = False
    for tsx_file in app_dir.rglob('*.tsx'):
        content = tsx_file.read_text(encoding='utf-8', errors='ignore')
        if 'components/test' in content or 'from "@/components/test' in content:
            print(f"  [WARNING] Reference found in: {tsx_file.relative_to(ROOT_DIR)}")
            references_found = True
    
    if not references_found:
        print("  [OK] No references found in app directory")
    
    return not references_found

def delete_test_components():
    """删除测试组件目录"""
    print("\n[2/2] Deleting test components directory...")
    
    if not TEST_COMPONENTS_DIR.exists():
        print("  [SKIP] components/test directory not found")
        return 0
    
    # 统计文件数量
    files = list(TEST_COMPONENTS_DIR.glob('*.tsx'))
    file_count = len(files)
    
    # 删除目录
    try:
        shutil.rmtree(TEST_COMPONENTS_DIR)
        print(f"  [OK] Deleted components/test/ directory")
        print(f"  [OK] Removed {file_count} test component files")
        return file_count
    except Exception as e:
        print(f"  [ERROR] Failed to delete: {e}")
        return 0

def print_summary(deleted_count):
    """打印清理总结"""
    print("\n" + "=" * 60)
    print("TEST COMPONENTS CLEANUP COMPLETED")
    print("=" * 60)
    print(f"\nRemoved: {deleted_count} test component files")
    print("\nWhat was cleaned:")
    print("  - components/test/ directory (development test components)")
    print("\nWhat was kept:")
    print("  - __tests__/ directory (unit tests)")
    print("  - e2e/ directory (end-to-end tests)")
    print("  - jest.config.js (test configuration)")
    print("  - playwright.config.ts (E2E configuration)")
    print("\nProject test structure is now cleaner!")
    print("=" * 60)

def main():
    print("=" * 60)
    print("CLEANUP TEST COMPONENTS")
    print("=" * 60)
    print("\nThis will:")
    print("1. Check for references to test components")
    print("2. Delete components/test/ directory")
    print("\nPreserving:")
    print("- __tests__/ (unit tests)")
    print("- e2e/ (end-to-end tests)")
    
    # 检查引用
    safe_to_delete = check_references()
    
    if not safe_to_delete:
        print("\n[WARNING] Found references to test components!")
        print("You may need to remove these references first.")
        response = input("\nContinue anyway? (yes/no): ").strip().lower()
        if response != 'yes':
            print("\nCancelled.")
            return
    
    # 删除测试组件
    deleted_count = delete_test_components()
    
    # 打印总结
    print_summary(deleted_count)

if __name__ == '__main__':
    main()

