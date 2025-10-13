# 自动化测试运行脚本 (PowerShell)
# 用法: .\scripts\run-tests.ps1 [quick|pages|compress|convert|detailed|all]

param(
    [string]$TestType = "quick"
)

# 颜色输出函数
function Write-ColorOutput($ForegroundColor) {
    $fc = $host.UI.RawUI.ForegroundColor
    $host.UI.RawUI.ForegroundColor = $ForegroundColor
    if ($args) {
        Write-Output $args
    }
    $host.UI.RawUI.ForegroundColor = $fc
}

Write-ColorOutput Blue "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
Write-ColorOutput Blue "   TinyCompressor 自动化测试套件"
Write-ColorOutput Blue "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
Write-Output ""

# 检查开发服务器
Write-ColorOutput Yellow "检查开发服务器..."
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -TimeoutSec 5 -ErrorAction Stop
    Write-ColorOutput Green "✓ 开发服务器正在运行"
} catch {
    Write-ColorOutput Red "错误: 开发服务器未运行"
    Write-ColorOutput Yellow "请先运行: npm run dev"
    exit 1
}
Write-Output ""

# 运行对应的测试
switch ($TestType) {
    "quick" {
        Write-ColorOutput Blue "运行快速冒烟测试..."
        npx playwright test e2e/quick-smoke-test.spec.ts
    }
    "pages" {
        Write-ColorOutput Blue "运行全站页面测试..."
        npx playwright test e2e/all-pages-smoke-test.spec.ts
    }
    "compress" {
        Write-ColorOutput Blue "运行压缩功能测试..."
        npx playwright test e2e/compression-functionality.spec.ts
    }
    "convert" {
        Write-ColorOutput Blue "运行转换功能测试..."
        npx playwright test e2e/conversion-functionality.spec.ts
    }
    "detailed" {
        Write-ColorOutput Blue "运行详细功能测试..."
        npx playwright test e2e/functional-pages-detailed.spec.ts
    }
    "all" {
        Write-ColorOutput Blue "运行所有测试..."
        npx playwright test
    }
    default {
        Write-ColorOutput Red "错误: 未知的测试类型 '$TestType'"
        Write-Output ""
        Write-Output "用法: .\scripts\run-tests.ps1 [quick|pages|compress|convert|detailed|all]"
        Write-Output ""
        Write-Output "测试类型:"
        Write-Output "  quick    - 快速冒烟测试 (~5分钟)"
        Write-Output "  pages    - 全站页面测试 (~10分钟)"
        Write-Output "  compress - 压缩功能测试 (~10分钟)"
        Write-Output "  convert  - 转换功能测试 (~15分钟)"
        Write-Output "  detailed - 详细功能测试 (~20分钟)"
        Write-Output "  all      - 所有测试 (~60分钟)"
        exit 1
    }
}

# 测试完成
Write-Output ""
Write-ColorOutput Green "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
Write-ColorOutput Green "   测试完成！"
Write-ColorOutput Green "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
Write-Output ""
Write-ColorOutput Blue "查看测试报告:"
Write-Output "  npx playwright show-report"
Write-Output ""




