#!/bin/bash

# 自动化测试运行脚本
# 用法: ./scripts/run-tests.sh [quick|pages|compress|convert|detailed|all]

set -e

# 颜色输出
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}   TinyCompressor 自动化测试套件${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# 检查是否安装了Playwright
if ! command -v npx &> /dev/null; then
    echo -e "${RED}错误: 未找到npx命令${NC}"
    exit 1
fi

# 确保开发服务器正在运行
echo -e "${YELLOW}检查开发服务器...${NC}"
if ! curl -s http://localhost:3000 > /dev/null; then
    echo -e "${RED}错误: 开发服务器未运行${NC}"
    echo -e "${YELLOW}请先运行: npm run dev${NC}"
    exit 1
fi
echo -e "${GREEN}✓ 开发服务器正在运行${NC}"
echo ""

# 获取测试类型
TEST_TYPE=${1:-quick}

case $TEST_TYPE in
  quick)
    echo -e "${BLUE}运行快速冒烟测试...${NC}"
    npx playwright test e2e/quick-smoke-test.spec.ts
    ;;
  pages)
    echo -e "${BLUE}运行全站页面测试...${NC}"
    npx playwright test e2e/all-pages-smoke-test.spec.ts
    ;;
  compress)
    echo -e "${BLUE}运行压缩功能测试...${NC}"
    npx playwright test e2e/compression-functionality.spec.ts
    ;;
  convert)
    echo -e "${BLUE}运行转换功能测试...${NC}"
    npx playwright test e2e/conversion-functionality.spec.ts
    ;;
  detailed)
    echo -e "${BLUE}运行详细功能测试...${NC}"
    npx playwright test e2e/functional-pages-detailed.spec.ts
    ;;
  all)
    echo -e "${BLUE}运行所有测试...${NC}"
    npx playwright test
    ;;
  *)
    echo -e "${RED}错误: 未知的测试类型 '$TEST_TYPE'${NC}"
    echo ""
    echo "用法: $0 [quick|pages|compress|convert|detailed|all]"
    echo ""
    echo "测试类型:"
    echo "  quick    - 快速冒烟测试 (~5分钟)"
    echo "  pages    - 全站页面测试 (~10分钟)"
    echo "  compress - 压缩功能测试 (~10分钟)"
    echo "  convert  - 转换功能测试 (~15分钟)"
    echo "  detailed - 详细功能测试 (~20分钟)"
    echo "  all      - 所有测试 (~60分钟)"
    exit 1
    ;;
esac

# 测试完成
echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}   测试完成！${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${BLUE}查看测试报告:${NC}"
echo "  npx playwright show-report"
echo ""




