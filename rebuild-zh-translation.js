const fs = require('fs');

// 读取英文翻译文件
const en = JSON.parse(fs.readFileSync('lib/translations/en.json', 'utf8'));

// 创建中文翻译的基础结构
const zh = {
  "metadata": {
    "title": "TinyCompressor - 免费在线图片压缩和转换工具 | JPG、PNG、WebP、AVIF、GIF",
    "description": "专业图片压缩和格式转换工具。压缩JPG、PNG、WebP、AVIF、GIF图片，文件大小减少高达90%，零质量损失。即时转换格式。100%免费、安全、注重隐私。无需注册。",
    "keywords": "图片压缩, 图片转换器, 压缩图片, 减少文件大小, JPG压缩, PNG压缩, WebP压缩, AVIF压缩, GIF压缩, 图片格式转换器, 在线图片优化器, 照片压缩, 批量压缩, 隐私, 安全, 免费图片工具, Web优化",
    "openGraphTitle": "TinyCompressor - 免费在线图片压缩和转换工具",
    "openGraphDescription": "免费在线压缩和转换图片。减少文件大小高达90%同时保持质量。支持JPG、PNG、WebP、AVIF、GIF格式。快速、安全、完全私密。",
    "twitterTitle": "TinyCompressor - 免费图片压缩和转换工具",
    "twitterDescription": "专业图片压缩和格式转换。压缩图片高达90%更小，零质量损失。100%免费安全。"
  },
  "nav": {
    "features": "功能",
    "about": "关于",
    "language": "语言",
    "compressor": "压缩器",
    "converter": "转换器",
    "home": "首页"
  },
  "settings": {
    "settings": "设置",
    "processingMode": "处理模式",
    "singleFile": "单文件",
    "batchMode": "批量模式",
    "ui": "界面",
    "advancedSettings": "高级设置",
    "batchOperations": "批量操作",
    "smartPresets": "智能预设",
    "fileThumbnails": "文件缩略图",
    "compactMode": "紧凑模式",
    "defaults": "默认值",
    "compressionQuality": "压缩质量",
    "conversionFormat": "转换格式",
    "preserveMetadata": "保留元数据",
    "optimizeForWeb": "Web优化",
    "features": "功能",
    "dragDrop": "拖拽上传",
    "keyboardShortcuts": "键盘快捷键",
    "autoSave": "自动保存",
    "progressNotifications": "进度通知",
    "theme": "主题",
    "colorScheme": "配色方案",
    "light": "浅色",
    "dark": "深色",
    "auto": "自动",
    "accentColor": "强调色",
    "save": "保存",
    "reset": "重置",
    "close": "关闭",
    "optional": "（可选）",
    "showSettings": "显示设置",
    "hideSettings": "隐藏设置",
    "toggleSettings": "切换设置"
  },
  "hero": {
    "title": "即时图片压缩",
    "subtitle": "无损压缩图片文件大小，快速、安全、完全免费",
    "description": "专业的图片压缩和格式转换工具。压缩JPG、PNG、WebP、AVIF、GIF图片，文件大小减少高达90%，零质量损失。即时转换格式。100%免费、安全、注重隐私。无需注册。",
    "cta": "开始压缩",
    "compressButton": "压缩图片",
    "convertButton": "转换图片",
    "trustedBy": "全球数千用户信赖",
    "stats": {
      "sizeReduction": "文件大小减少90%",
      "supportedFormats": "支持10+格式",
      "freeSecure": "100%免费安全"
    }
  },
  "upload": {
    "title": "上传您的图片",
    "subtitle": "拖拽图片到此处或点击浏览",
    "singleFileTitle": "上传您的图片",
    "singleFileSubtitle": "拖拽您的图片到此处或点击浏览",
    "batchTitle": "上传多张图片",
    "batchSubtitle": "拖拽多张图片到此处或点击浏览",
    "dragActive": "释放图片",
    "dragInactive": "拖拽图片到此处",
    "dragReject": "不支持的文件类型",
    "supportedFormats": "支持 JPG、PNG、WebP 等格式",
    "maxSize": "单文件最大：10MB",
    "uploadedFiles": "已上传文件",
    "removeFile": "移除文件",
    "ready": "就绪",
    "addMore": "添加更多文件",
    "clickToUpload": "或点击浏览",
    "maxFiles": "最大文件数：20",
    "uploadError": "上传失败",
    "uploadSuccess": "上传成功"
  }
};

// 写回文件
fs.writeFileSync('lib/translations/zh.json', JSON.stringify(zh, null, 2));
console.log('中文翻译文件已重新创建');
