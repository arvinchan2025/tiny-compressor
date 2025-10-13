# 测试图片文件夹

## 📁 目录说明

此文件夹用于存放E2E测试所需的测试图片。

## 🖼️ 需要的测试图片

为了运行完整的功能测试，请在此文件夹中放置以下测试图片：

### **必需的测试图片**

1. **test-image.png** - PNG格式测试图片
   - 建议大小: 500KB - 2MB
   - 建议尺寸: 1000x1000 或更大
   - 最好包含透明通道（用于测试透明度处理）

2. **test-image.jpg** - JPEG格式测试图片
   - 建议大小: 500KB - 2MB
   - 建议尺寸: 1000x1000 或更大

3. **test-image.webp** - WebP格式测试图片（可选）
   - 建议大小: 500KB - 2MB
   - 建议尺寸: 1000x1000 或更大

## 📥 如何获取测试图片

### **方法1: 使用在线图片**
从以下网站下载免费测试图片：
- [Unsplash](https://unsplash.com/) - 高质量免费图片
- [Pexels](https://www.pexels.com/) - 免费图片和视频
- [Pixabay](https://pixabay.com/) - 免费图片

### **方法2: 使用自己的图片**
使用任何PNG、JPG、WebP格式的图片，建议：
- 文件大小在 500KB - 5MB 之间
- 尺寸不要太小（至少 500x500）
- PNG图片最好有透明背景

### **方法3: 生成测试图片**
使用以下命令生成测试图片（需要安装ImageMagick）：

```bash
# 生成PNG测试图片（带透明度）
magick -size 1000x1000 xc:transparent -fill blue -draw "circle 500,500 500,200" test-image.png

# 生成JPG测试图片
magick -size 1000x1000 gradient:blue-red test-image.jpg

# 转换为WebP
magick test-image.png test-image.webp
```

## 🚀 快速开始

1. 下载或创建测试图片
2. 将图片重命名为上述文件名
3. 放置在此文件夹中
4. 运行测试：
   ```bash
   npm run test:e2e:compress  # 压缩功能测试
   npm run test:e2e:convert   # 转换功能测试
   ```

## ⚠️ 注意事项

- **不要提交大文件**: 测试图片不应提交到Git仓库
- **文件大小**: 建议每个测试图片不超过5MB
- **文件格式**: 确保文件扩展名正确
- **权限**: 确保测试图片有读取权限

## 📊 测试覆盖

有了这些测试图片，您可以测试：

### **压缩功能**
- ✅ PNG压缩
- ✅ JPEG压缩
- ✅ WebP压缩
- ✅ 质量设置
- ✅ 批量处理
- ✅ 文件大小减小验证

### **转换功能**
- ✅ PNG → JPG 转换
- ✅ PNG → WebP 转换
- ✅ JPG → PNG 转换
- ✅ WebP → PNG 转换
- ✅ WebP → JPG 转换
- ✅ 透明度处理
- ✅ 质量设置
- ✅ 批量转换

## 🔍 测试示例

### **运行压缩测试**
```bash
# 测试PNG压缩
npx playwright test e2e/image-compression-real.spec.ts -g "PNG压缩"

# 测试所有压缩功能
npx playwright test e2e/image-compression-real.spec.ts
```

### **运行转换测试**
```bash
# 测试PNG to JPG转换
npx playwright test e2e/image-conversion-real.spec.ts -g "PNG to JPG"

# 测试所有转换功能
npx playwright test e2e/image-conversion-real.spec.ts
```

## 📝 .gitignore

此文件夹中的图片文件已被添加到 `.gitignore`，不会被提交到Git仓库。

```gitignore
# 测试图片
e2e/fixtures/*.png
e2e/fixtures/*.jpg
e2e/fixtures/*.jpeg
e2e/fixtures/*.webp
e2e/fixtures/*.gif
e2e/fixtures/*.bmp
e2e/fixtures/*.avif
e2e/fixtures/*.heic

# 但保留README
!e2e/fixtures/README.md
```

## 🆘 常见问题

### **Q: 测试跳过了，显示"测试图片不存在"**
A: 请确保在 `e2e/fixtures/` 文件夹中放置了对应的测试图片。

### **Q: 测试超时**
A: 可能是图片太大，建议使用2MB以下的测试图片。

### **Q: 转换失败**
A: 检查图片格式是否正确，文件是否损坏。

### **Q: 需要多少个测试图片？**
A: 最少需要2个（test-image.png 和 test-image.jpg），建议准备3个（再加test-image.webp）。




