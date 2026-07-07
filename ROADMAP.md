# Today's Vibe — Roadmap

## 现状总览

| 模块 | 状态 | 备注 |
|---|---|---|
| 核心 vibe 生成 | 已完成 | Date-seeded PRNG + 组合词库 |
| 运势签卡片 UI | 已完成 | 白卡 + accent 色顶边 + 装饰纹样 |
| 六维条状图 | 已完成 | 纯 HTML/CSS，hover 变色，逐条入场动画 |
| 12 种背景轮换 | 已完成 | 浅色渐变，每天随机选一 |
| 动态主题色 | 已完成 | 按钮/光晕/边框均跟随每日幸运色 |
| 分享卡片 (Canvas PNG) | 已完成 | 1080×1350，运势签卡片布局 |
| 粒子特效 | 已完成 | 点击按钮时爆发 sparkle |
| localStorage 持久化 | 已完成 | 当日结果 + 14 天历史 |
| 响应式适配 | 已完成 | 400px / 768px 断点 |
| 部署 | 已完成 | todaysvibe.pages.dev |
| GitHub | 已完成 | public repo，horaceace/todaysvibe |

---

## P0 — 上线必做

### 1. 自定义域名
- 买域名（建议 `todaysvibe.lol`，$2-5/年，Namesilo/Porkbun）
- Cloudflare Pages → Custom domains → 填入域名
- DNS 自动配置，SSL 自动签发
- _估时：买域名 5 分钟 + DNS 生效 10 分钟_

### 2. GitHub 自动部署
- Cloudflare Dashboard → Pages → 连接 GitHub
- 选 `horaceace/todaysvibe`，主分支 `master`
- 之后每次 `git push` 自动部署，不用再跑 wrangler CLI
- _估时：5 分钟_

### 3. SEO 基础
- 补动态 `<title>`：`"Cosmic Hurricane — Today's Vibe"`
- 补动态 `<meta description>`：用当天 desc 的前半段
- OG 标签 + 一张 1200×630 的社交预览图（Canvas 生成，复用 share card 逻辑）
- `robots.txt`：允许全部爬虫
- _估时：1-2 小时_

### 4. 访问分析
- 接入 Cloudflare Web Analytics（免费，在 CF Dashboard 一键开）
- 不需要 cookie banner，完全隐私友好
- 关注：日活、回访率、分享转化
- _估时：10 分钟_

---

## P1 — 一周内

### 5. 加载体验
- 骨架屏：reveal 前展示一个模糊的卡片轮廓
- 按钮加 `navigator.vibrate(10)` 触觉反馈（移动端）
- _估时：1 小时_

### 6. 分享强化
- 长名字自适应字号（当前 64px Canvas 字体可能溢出）
- 桌面端一键复制图片到剪贴板（`navigator.clipboard.write()` + `ClipboardItem`）
- 分享 URL 带 `?from=share` 参数做归因
- _估时：2-3 小时_

### 7. 动效打磨
- 条状图入场改用纯 CSS `animation-delay: calc(var(--i) * 80ms)`
- 按钮消失加 scale(0.3) + opacity(0) 过渡
- 卡片入场从 `translateY(20px)` 改为弹性缓动
- _估时：1-2 小时_

### 8. 回访体验
- 已 reveal 过的访客打开页面直接展示结果（已实现）
- 加倒计时条：`"Next vibe in 05:23:41"`（倒计时到 UTC+8 凌晨）
- 每天第一次打开时给一个小提示：`"You haven't checked today's vibe yet"`
- _估时：1 小时_

### 9. PWA 基础支持
- 加 `manifest.json`（app name、icon、theme color 动态化）
- 加一个简单的 service worker 做离线缓存（可选，单页应用其实不需要）
- _估时：30 分钟_

---

## P2 — 增长实验

### 10. "和朋友的 vibe 匹配度"
- 分享链接带当前 vibe 的签名 hash（`?match=abc123`）
- 朋友打开后，双方用同一个衍生种子算出"匹配度"
- 展示："You and @friend are 87% compatible today"
- 纯前端，无后端
- _估时：3-4 小时_

### 11. Vibe 周报/月报
- 聚合 7 天数据进行 vibe 趋势总结
- 如："This week your average Energy was 7.2, up 1.3 from last week"
- 生成一张长图（Canvas 1200×2000）供分享
- 需要至少 7 天历史数据（已存储）
- _估时：4-6 小时_

### 12. 节日限定主题
- 检测特殊日期（12/25、1/1、2/14、10/31 等）
- 替换主题背景（圣诞红绿、新年金、情人节粉、万圣节橙黑）
- 数据池加节日词条（`HOLLY`, `MISTLETOE`, `CUPID`...）
- 节日当天 header 加一行小字主题提示
- _估时：2-3 小时_

### 13. 分享卡片模板
- 支持多种卡片风格（目前只有一种运势签风格）
- 可选：极简风 / 赛博朋克 / 复古像素
- 由每天的 seed 决定风格（增加新鲜感）
- _估时：每个模板 1-2 小时_

---

## 暂不做

| 项 | 原因 |
|---|---|
| 登录/注册 | 破坏"零门槛"体验 |
| 后端/数据库 | 保持零运维成本 |
| 多语言 | 先验证英文市场 PMF |
| 广告/收费 | 没有流量基数前毫无意义 |
| AI 生成内容 | 当前词库已够大，加 AI 增加延迟和成本 |

---

## 决策日志

| 日期 | 决策 | 原因 |
|---|---|---|
| 2026-07-07 | 去 Canvas 雷达图，改用 HTML 条状图 | 雷达图 hover 效果始终调不好，条状图实现简单且视觉效果更好 |
| 2026-07-07 | 运势签卡片风格 | 用户反馈比纯雷达图有仪式感 |
| 2026-07-07 | 按钮/光晕跟随每日幸运色 | 避免固定紫色太单调，每天有新鲜感 |
| 2026-07-07 | Cloudflare Pages 部署 | 免费额度够用，GitHub 集成方便 |
| 2026-07-07 | 零依赖纯静态 | 不引入框架，降低维护成本和加载时间 |
