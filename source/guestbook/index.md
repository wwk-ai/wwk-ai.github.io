---
title: 留言板
date: 2024-01-01 00:00:00
comments: true
toc: false
---

> **欢迎交流** — 这里是 Wesley 的留言板，欢迎留下你的想法、建议或技术交流。
> - 技术问题探讨 / 项目合作咨询 / 文章纠错反馈 / 随便聊聊

> 若需更系统的技术文档，欢迎访问我的语雀主页：
>
> <a href="https://yuque.com/wwk-ai" target="_blank" style="font-weight:bold;color:#3dd9b6;">yuque.com/wwk-ai</a>

<!-- 留言方式 Tab 切换 -->
<div class="comment-tabs">
  <button class="comment-tab active" data-tab="github" onclick="switchTab('github')">
    <i class="fa-brands fa-github"></i> GitHub 登录留言
  </button>
  <button class="comment-tab" data-tab="guest" onclick="switchTab('guest')">
    <i class="fa-solid fa-user"></i> 游客留言
  </button>
</div>

<div class="comment-panel active" id="panel-github">
  <div class="comment-tip">
    <i class="fa-solid fa-circle-info"></i> 使用 GitHub 账号登录后即可留言，支持 Markdown 格式和表情回复。
  </div>
  <div id="giscus-container"></div>
</div>

<div class="comment-panel" id="panel-guest">
  <div class="comment-tip">
    <i class="fa-solid fa-circle-info"></i> 无需登录，直接以游客身份留言，系统会自动记录你的 IP 地区信息。
  </div>
  <div id="waline-container"></div>
</div>

<style>
.comment-tabs {
  display: flex; gap: 8px; margin: 32px 0 20px;
}
.comment-tab {
  display: flex; align-items: center; gap: 8px;
  padding: 10px 20px; border-radius: 10px;
  font-size: 14px; font-weight: 500;
  border: 1px solid rgba(0,0,0,0.08);
  background: transparent; color: #57534e;
  cursor: pointer; transition: all 0.25s;
}
.comment-tab:hover { background: rgba(99,102,241,0.06); border-color: rgba(99,102,241,0.2); }
.comment-tab.active {
  background: var(--bg-white); border-color: var(--accent);
  color: var(--accent); box-shadow: 0 2px 8px rgba(99,102,241,0.1);
}
.comment-panel { display: none; }
.comment-panel.active { display: block; }
.comment-tip {
  padding: 12px 16px; border-radius: 10px; margin-bottom: 20px;
  background: rgba(99,102,241,0.06); border: 1px solid rgba(99,102,241,0.12);
  font-size: 13px; color: #57534e;
}
.comment-tip i { color: var(--accent); margin-right: 6px; }
</style>

<script>
function switchTab(tab) {
  document.querySelectorAll('.comment-tab').forEach(function(btn) {
    btn.classList.toggle('active', btn.dataset.tab === tab);
  });
  document.querySelectorAll('.comment-panel').forEach(function(panel) {
    panel.classList.toggle('active', panel.id === 'panel-' + tab);
  });
}

// 初始化 Waline（游客留言）
// 注意：使用游客留言前，需要先部署 Waline 后端到 Vercel
// 部署教程：https://waline.js.org/guide/get-started/
// 部署完成后，将下面的 serverURL 替换为你的 Waline 服务地址
(function() {
  var walineContainer = document.getElementById('waline-container');
  if (!walineContainer) return;

  var serverURL = ''; // ← 填入你的 Waline 服务地址，例如 'https://wesley-blog-waline.vercel.app'

  if (!serverURL) {
    walineContainer.innerHTML =
      '<div style="padding:48px 24px;text-align:center;border-radius:16px;border:1px dashed rgba(0,0,0,0.12);background:rgba(0,0,0,0.02);">' +
      '<div style="font-size:40px;margin-bottom:16px;">🚧</div>' +
      '<div style="font-size:16px;font-weight:600;color:var(--text-primary);margin-bottom:8px;">游客留言功能即将上线</div>' +
      '<div style="font-size:14px;color:var(--text-secondary);line-height:1.7;max-width:480px;margin:0 auto;">' +
      '当前使用 <strong>Giscus (GitHub 登录留言)</strong> 即可正常留言。<br>' +
      '游客免登录留言基于 Waline，需要部署后端服务到 Vercel。<br>' +
      '<a href="https://waline.js.org/guide/get-started/" target="_blank" style="color:var(--accent);text-decoration:underline;">查看 Waline 部署教程 →</a>' +
      '</div></div>';
    return;
  }

  var script = document.createElement('script');
  script.src = 'https://unpkg.com/@waline/client@v3/dist/waline.js';
  script.onload = function() {
    if (window.Waline) {
      window.Waline.init({
        el: '#waline-container',
        serverURL: serverURL,
        lang: 'zh-CN',
        pageview: false,
        comment: true,
        emoji: ['https://unpkg.com/@waline/emojis@1.1.0/weibo'],
        meta: ['nick', 'mail'],
        requiredMeta: ['nick'],
        placeholder: '欢迎留下你的想法...',
        avatar: 'mp',
        avatarCDN: 'https://cravatar.cn/avatar/'
      });
    }
  };
  document.head.appendChild(script);

  var link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://unpkg.com/@waline/client@v3/dist/waline.css';
  document.head.appendChild(link);
})();
</script>
