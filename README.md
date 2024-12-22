# 商品评价助手

一个基于文心一言API的智能评价生成工具，帮助用户生成优质的商品评价。

## 功能特点

- 🖼️ 图片优化：自动优化上传的商品图片
- ✍️ 智能评价：基于用户描述生成自然、真实的评价
- 💬 智能对话：支持自然语言交互
- 📋 一键复制：便捷的评价复制功能
- 🔄 分享功能：支持分享到其他平台
- 📢 发布功能：可以发布到评价广场

## 技术栈

- 前端：HTML5, CSS3, JavaScript
- API：百度文心一言API
- 图片处理：Canvas API

## 快速开始

1. 克隆项目
```bash
git clone https://github.com/[your-username]/product-review-assistant.git
```

2. 配置API密钥
在`config.js`中配置你的文心一言API密钥：
```javascript
const API_KEY = 'your-api-key';
const SECRET_KEY = 'your-secret-key';
```

3. 运行项目
使用任意HTTP服务器运行项目，例如：
```bash
python -m http.server 8000
```

## 使用说明

1. 上传商品图片
2. 描述你的商品体验
3. 系统会自动生成优质评价
4. 使用复制按钮一键复制评价内容
5. 可以选择分享或发布到评价广场

## 许可证

MIT License
