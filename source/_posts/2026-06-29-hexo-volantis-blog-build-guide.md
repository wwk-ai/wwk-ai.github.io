---
title: "从零搭建企业级技术博客：Hexo 7 + Volantis 6 + GitHub Pages 完整实战记录"
date: 2026-06-29 10:00:00
updated: 2026-06-29 18:00:00
tags:
  - Hexo
  - Volantis
  - GitHub Pages
  - 博客搭建
  - CI/CD
categories:
  - 技术随笔
keywords: Hexo博客搭建, Volantis主题, GitHub Pages, GitHub Actions, 技术博客, 博客部署
description: "完整记录使用 Hexo 7.x + Volantis 6.x + GitHub Pages 从零搭建企业级技术博客的全过程，包含踩坑实录、CI/CD配置、主题定制与部署优化。"
comments: true
toc: true
cover: https://picsum.photos/seed/hexoblog/1200/600
---

## 背景

### 为什么重建博客？

过去几年，我的技术内容一直写在**语雀**上。语雀确实好用，文档协作、知识库管理都很方便，但随着内容越来越多，几个痛点也逐渐暴露：

- **无法打造个人IP**：语雀的文章链接是 `yuque.com/wwk-ai/xxx`，域名属于平台，不利于个人品牌沉淀
- **年年付费**：语雀的高级功能需要持续付费，内容托管在别人的平台上，没有完全的自主权
- **样式受限**：语雀的页面定制能力有限，无法像独立博客那样自由设计主题、布局、交互
- **SEO 差**：语雀的内容在搜索引擎中的权重远不如独立域名站点

于是，2026年6月，我决定彻底重建独立博客。我的旧博客始建于2020年，当时用的是 Volantis v2 主题（现已废弃），内容仅有几个静态HTML页面，年久失修。这次重建的目标是：

> **把语雀上的技术内容全部迁移过来，打造一个完全属于自己的、可长期维护的技术品牌阵地。**

新博客定位为一个**企业级AI/Java技术博客**，具备以下特性：

- 现代化主题（Volantis 6.x），支持深色/浅色双模式
- GitHub Pages 免费托管，零成本运维
- GitHub Actions 自动化 CI/CD，push 即部署
- 自定义域名与个人品牌（`wwk-ai.github.io`）
- 完整的 SEO 支持（sitemap、structured data）
- 响应式设计，移动端友好

## 技术栈选型

| 组件 | 版本 | 说明 |
|------|------|------|
| Hexo | 7.x | 静态博客生成器，Node.js生态 |
| Volantis | 6.0.4 | 高度模块化主题（npm稳定版） |
| Node.js | 22 LTS | 运行环境 |
| GitHub Pages | - | 免费静态托管 |
| GitHub Actions | - | 自动构建与部署 |

> **为什么选 Volantis 而不是其他主题？** Volantis 的模块化设计非常灵活，widget系统可以自由组合侧边栏组件，配色方案支持完全自定义，而且原生支持深色模式切换。

## 搭建过程

### 第一步：初始化 Hexo 项目

标准做法是用 `hexo init`，但在我的环境中它失败了（Windows + npm兼容性问题），所以手动创建项目结构：

```bash
mkdir my-blog && cd my-blog
npm init -y
npm install hexo --ignore-scripts
npm install hexo-theme-volantis --ignore-scripts
```

> **踩坑1**：`--ignore-scripts` 是必须的！Volantis 的 npm 包内嵌了一个旧版 `hexo` 依赖，它的 postinstall 脚本会尝试编译 `hexo-util` 的 native 模块，在 Windows 上大概率失败。

**关键目录结构：**

```
my-blog/
├── _config.yml              # 站点全局配置
├── _config.volantis.yml     # 主题配置覆盖文件
├── package.json
├── .github/
│   └── workflows/
│       └── pages.yml         # CI/CD 部署脚本
└── source/
    ├── _posts/              # 博客文章
    ├── about/index.md       # 关于页面
    ├── ai-column/index.md   # AI专栏
    ├── java-column/index.md # Java专栏
    ├── projects/index.md    # 项目作品
    ├── friends/index.md      # 友链
    └── guestbook/index.md   # 留言
```

### 第二步：解决 Volantis 兼性问题

安装 Volantis 6.0.4 后，运行 `hexo generate` 会报错：

```
Maximum call stack size exceeded
```

**原因**：Volantis 的 npm 包在 `node_modules/hexo-theme-volantis/node_modules/` 下嵌套了一份完整的 `hexo` 依赖，与项目根目录的 Hexo 7.x 冲突，导致无限递归调用。

**解决方案**：删除嵌套的 hexo：

```bash
rm -rf node_modules/hexo-theme-volantis/node_modules/hexo
```

> **踩坑2**：这个问题在 CI/CD 环境中同样存在，所以 `pages.yml` 中必须加一步：
> ```yaml
> - name: Remove nested hexo (fix Volantis compatibility)
>   run: rm -rf node_modules/hexo-theme-volantis/node_modules/hexo
> ```

### 第三步：配置 _config.yml

站点全局配置的关键项：

```yaml
title: "Wesley AI Lab"
subtitle: "企业级AI大模型与Java后端技术实战"
language: zh-CN
timezone: Asia/Shanghai

# 网站地址 —— 这一步非常重要！
url: https://wwk-ai.github.io
root: /
permalink: posts/:year/:month/:title/

# 关闭 Hexo 自带的代码高亮，交给 Volantis 处理
highlight:
  enable: false

# 主题
theme: volantis
```

> **踩坑3**：`root` 必须设为 `/`。如果仓库名不是 `username.github.io` 格式（例如 `my-blog`），则 `root` 需要设为 `/<仓库名>/`，否则所有 CSS/JS 的相对路径都会404，首页会变成"乱七八糟"的样式。

> **踩坑4**：`permalink` 不要用 `:abbrlink/` 除非安装了 `hexo-abbrlink` 插件，否则文章链接会变成 `posts/undefined/`！

### 第四步：配置 Volantis 主题

通过 `_config.volantis.yml` 覆盖主题默认配置（Hexo 5.0+ 支持 `_config.[theme].yml` 合并机制）。

**导航栏配置：**

```yaml
navbar:
  logo:
    icon: fa-solid fa-microchip
    title: 'Wesley AI Lab'
  menu:
    - name: 首页
      icon: fa-solid fa-home
      url: /
    - name: AI专栏
      icon: fa-solid fa-brain
      url: /ai-column/
    - name: Java专栏
      icon: fa-brands fa-java
      url: /java-column/
    # ... 更多菜单项
```

**博主信息卡（Volantis 6.x 正确格式）：**

```yaml
sidebar:
  for_page: [blogger, category, tagcloud, guide]
  widget_library:
    blogger:
      class: blogger
      display: [desktop, mobile]
      avatar: ''
      shape: circle
      url: /about/
      title: Wesley
      subtitle: 'AI大模型落地 | Java后端架构 | 企业级实战'
      jinrishici: false
      social:
        - icon: fa-brands fa-github
          url: https://github.com/wwk-ai
        - icon: fa-solid fa-book
          url: https://yuque.com/wwk-ai
```

> **踩坑5**：Volantis 6.x 的 blogger widget 字段是 `title`/`subtitle`/`social`，不是 `name`/`description`/`header`。用错字段会导致侧边栏显示默认诗句而不是博主信息。

**封面区域：**

```yaml
cover:
  title: 'Wesley AI Lab'
  subtitle: '企业级AI大模型与Java后端技术实战'
  background: https://images.unsplash.com/photo-1620712943543-bcc4688e7485
  features:
    - name: AI专栏
      img: volantis-static/media/twemoji/assets/svg/1f9e0.svg
      url: /ai-column/
    - name: Java专栏
      img: volantis-static/media/twemoji/assets/svg/2615.svg
      url: /java-column/
```

### 第五步：GitHub Pages 部署配置

**仓库名规则（关键）：**

GitHub Pages 的自定义域名规则：
- 仓库名为 `username.github.io` → 部署到 `https://username.github.io/`（根路径）
- 仓库名为其他名称 → 部署到 `https://username.github.io/<仓库名>/`（子路径）

我的 GitHub 用户名是 `wwk-ai`，所以仓库必须命名为 `wwk-ai.github.io`，这样博客才能直接通过 `https://wwk-ai.github.io/` 访问。

> **踩坑6**：最初仓库名是 `wesleywwk.github.io`（旧用户名），导致部署后访问地址变成了 `https://wwk-ai.github.io/wesleywwk.github.io/`，所有资源路径全部错误。解决方案是在 GitHub Settings 中将仓库重命名为 `wwk-ai.github.io`。

**GitHub Actions CI/CD (`pages.yml`)：**

```yaml
name: Pages

on:
  push:
    branches:
      - master
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "22"
      - name: Install Dependencies
        run: npm install --ignore-scripts
      - name: Remove nested hexo
        run: rm -rf node_modules/hexo-theme-volantis/node_modules/hexo
      - name: Build
        run: npx hexo generate
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./public

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

> **踩坑7**：GitHub Pages 的部署分支必须是 `master`（不是 `main`）。使用 `main` 分支会报错 "Deployments are only allowed from master"。

### 第六步：创建页面和文章

**独立页面**（放在 `source/` 对应目录下）：

```bash
# 每个页面目录下需要一个 index.md
source/about/index.md
source/ai-column/index.md
source/java-column/index.md
source/projects/index.md
source/friends/index.md
source/guestbook/index.md
```

页面 Front Matter 示例：

```yaml
---
title: 关于
layout: page
---
```

**文章 Front Matter 示例：**

```yaml
---
title: "文章标题"
date: 2026-06-29 10:00:00
tags:
  - 标签1
  - 标签2
categories:
  - 分类名
description: "文章摘要"
comments: true
toc: true
cover: https://example.com/cover.jpg
---
```

> **注意**：Volantis 6.x 不支持 `{% note %}{% endnote %}` 标签插件（会报 Nunjucks 错误），请使用 Markdown 的 `> **提示**` 语法代替。

## 踩坑总结

| # | 问题 | 原因 | 解决方案 |
|---|------|------|----------|
| 1 | npm install hexo-util 编译失败 | Windows + 嵌套 native 模块 | 加 `--ignore-scripts` |
| 2 | Maximum call stack size exceeded | Volantis 内嵌旧版 hexo 冲突 | 删除嵌套 hexo |
| 3 | 首页样式"乱七八糟" | 仓库名不匹配，root 配置错误 | 仓库名改为 username.github.io，root 设为 `/` |
| 4 | 文章链接 posts/undefined/ | permalink 用了 :abbrlink 但没装插件 | 改用 `:year/:month/:title/` |
| 5 | 侧边栏显示默认诗句 | blogger widget 字段名错误 | 用 title/subtitle/social |
| 6 | 部署到错误子路径 | 仓库名不是 username.github.io | GitHub 上重命名仓库 |
| 7 | CI/CD "only allowed from master" | GitHub Pages 要求 master 分支 | 推送到 master 分支 |
| 8 | {% note %} 报错 | Volantis 6.x 不支持此标签 | 用 Markdown blockquote |

## 最终效果

博客已成功部署到：**https://wwk-ai.github.io/**

主要特性：
- 响应式双栏布局（文章列表 + 侧边栏）
- 深色/浅色模式切换
- Hero 封面 + 导航图标
- 博主信息卡、分类、标签云、快速导航
- 完整的 CI/CD 自动化（push 即部署）

## 后续计划

- 接入评论系统（Giscus）
- 添加更多原创技术文章
- 优化 SEO（structured data、sitemap）
- 考虑自定义域名

---

> 如果这篇搭建记录对你有帮助，欢迎到 [GitHub](https://github.com/wwk-ai) 点个 Star，也可以在 [语雀](https://yuque.com/wwk-ai) 查看更多技术文档。
