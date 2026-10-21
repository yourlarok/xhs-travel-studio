# 旅图工坊 · XHS Travel Studio

一个面向“外国游客看中国”的小红书图文工作台原型。它把每日内容生产拆成：设置 → 自动生成 → 审核 → 发布准备。

## 桌面版

便携版位于 `dist/Travel-Studio-0.2.0-Portable.exe`，无需安装，双击即可运行。

重新打包：

```powershell
cd C:\Users\Administrator\xhs-travel-studio
npm install
npm run pack:win
```

## 网页版启动

需要 Node.js 18 或更高版本。

```powershell
cd C:\Users\Administrator\xhs-travel-studio
npm run web
```

浏览器打开 `http://127.0.0.1:4173`。

当前版本不依赖第三方 npm 包。设置保存在浏览器 `localStorage`，不会上传。

## 当前可用

- 内容方向、受众、语言、基调设置
- AI生成、网络找图、混合三种图片策略
- TapNow / Seedream 5 Pro、自定义图片供应商配置入口
- 今日草稿编辑与7张图文预览
- 主题场景图、路线、时间轴、短语卡、选择对比和保存清单等混合版式
- 审核队列、七天内容日历
- 审核通过后打开小红书创作中心
- 内置 `content-skill/`，用于后续内容模型稳定生成国际游客导览

## 接口接入前仍为演示的部分

- AI联网选题和事实核实
- TapNow / Seedream 5 Pro真实生图调用
- 合法图片库检索、许可记录和素材下载
- 每日定时任务
- 小红书页面自动填充和最终发布

这些部分需要确认本机 TapNow 的实际 API 地址、鉴权方法、请求与返回格式。小红书普通账号目前没有稳定开放的官方发帖接口，因此发布动作设计为“审核后打开创作中心”；后续可以在已登录浏览器中增加辅助填充，但保留最终确认。

## 推荐的下一阶段

1. 接入内容模型与联网检索，生成结构化草稿。
2. 按本机 TapNow API 文档接入 Seedream 5 Pro。
3. 建立素材许可台账和重复度数据库。
4. 增加 Windows 每日任务，任务只生成草稿，不直接发布。
5. 增加审核后的发布包导出与浏览器辅助填写。
