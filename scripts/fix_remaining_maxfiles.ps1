# 修复剩余的 maxFiles 占位符

$files = Get-ChildItem -Path "lib/i18n/translations/*/converters/*.json" -Recurse
$fixedCount = 0

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    
    if ($content -match '"maxFiles"') {
        Write-Host "Fixing: $($file.FullName)"
        
        # 移除 maxFiles 行
        $content = $content -replace '      "maxFiles": "[^"]*",\s*\n', ''
        
        # 将 10MB 改为 50MB
        $content = $content -replace '10MB', '50MB'
        
        # 写回文件
        Set-Content -Path $file.FullName -Value $content -Encoding UTF8 -NoNewline
        $fixedCount++
    }
}

Write-Host "Fixed: $fixedCount files"
