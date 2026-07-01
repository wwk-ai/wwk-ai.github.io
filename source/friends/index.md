---
title: 友情链接
date: 2024-01-01 00:00:00
comments: true
toc: false
---

<div class="fl-container">
  <!-- 友链列表 -->
  <div class="fl-section-title">友情链接</div>
  <div class="fl-grid" id="flGrid"></div>

  <!-- 本站信息 -->
  <div class="fl-section-title">友链信息</div>
  <div class="fl-apply">
    <p>想要添加本站到您的友链列表，可直接复制以下信息：</p>
    <pre style="background:#f8f9fc;border:1px solid rgba(0,0,0,0.06);border-radius:10px;padding:16px;font-size:13px;line-height:1.8;overflow-x:auto;margin:12px 0;color:#334155;"><code>- title: Wesley AI Lab
  avatar: https://gcore.jsdelivr.net/gh/volantis-x/cdn-org/blog/Logo-NavBar@3x.png
  url: https://wwk-ai.github.io/
  screenshot: https://gcore.jsdelivr.net/gh/volantis-x/cdn-org/blog/Logo-NavBar@3x.png
  description: 技术改变生活
  keywords: [AI, 大数据]</code></pre>
  </div>
</div>

<style>
  .fl-container { max-width: 960px; margin: 0 auto; padding: 20px 0 60px; }
  .fl-section-title { font-size: 22px; font-weight: 700; color: #1a1a2e; margin: 40px 0 24px; letter-spacing: -0.01em; }
  .fl-section-title:first-child { margin-top: 0; }

  /* 友链卡片网格 */
  .fl-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; }
  .fl-card { display: flex; flex-direction: column; align-items: center; text-align: center; padding: 24px 16px; background: #fff; border-radius: 16px; border: 1px solid rgba(0,0,0,0.06); box-shadow: 0 4px 20px rgba(0,0,0,0.04); transition: all 0.3s ease; text-decoration: none; color: inherit; }
  .fl-card:hover { transform: translateY(-4px); box-shadow: 0 8px 30px rgba(0,0,0,0.08); border-color: rgba(99,102,241,0.15); }
  .fl-card-avatar { width: 64px; height: 64px; border-radius: 50%; object-fit: cover; margin-bottom: 14px; border: 3px solid rgba(99,102,241,0.1); transition: all 0.3s; }
  .fl-card:hover .fl-card-avatar { border-color: rgba(99,102,241,0.25); transform: scale(1.05); }
  .fl-card-name { font-size: 15px; font-weight: 600; color: #1a1a2e; margin-bottom: 6px; }
  .fl-card-desc { font-size: 12px; color: #8892b0; line-height: 1.5; margin-bottom: 10px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  .fl-card-tags { display: flex; flex-wrap: wrap; gap: 5px; justify-content: center; }
  .fl-card-tags span { padding: 2px 10px; border-radius: 6px; font-size: 11px; font-weight: 500; background: rgba(99,102,241,0.06); color: #4f46e5; border: 1px solid rgba(79,70,229,0.08); }

  /* 本站信息 */
  .fl-apply { padding: 28px; background: #fff; border-radius: 16px; border: 1px solid rgba(0,0,0,0.06); }
  .fl-apply p { font-size: 14px; color: #64748b; line-height: 1.7; margin-bottom: 6px; }

  @media (max-width: 768px) {
    .fl-grid { grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 12px; }
  }
</style>

<script>
// 内置友链数据（主数据源 + 兜底）
var ALL_FRIENDS = [
  { title: '前端ovo', url: 'https://www.qdovo.com/', avatar: 'https://www.qdovo.com/images/avatar.jpeg', description: 'web前端开发', keywords: ['前端'] },
  { title: 'ControlNet Blog', url: 'https://controlnet.space/', avatar: 'https://controlnet.space/images/avatar.jpg', screenshot: 'https://controlnet.space/images/site_screenshot.webp', description: '永远13岁~', keywords: ['二次元', '技术'] }
];

function renderFriends(friends) {
  var gridEl = document.getElementById('flGrid');
  if (!gridEl) return;
  if (friends.length === 0) {
    gridEl.innerHTML = '<p style="color:#999;text-align:center;grid-column:1/-1;">暂无友链，欢迎在本页下方留言申请。</p>';
    return;
  }
  gridEl.innerHTML = friends.map(function(f) {
    var tags = '';
    if (f.keywords) {
      var kwArr = Array.isArray(f.keywords) ? f.keywords : String(f.keywords).split(/[,，]/);
      tags = kwArr.map(function(k) {
        var clean = String(k).trim().replace(/^\[|\]$/g, '').replace(/^#/, '');
        return clean ? '<span>#' + clean + '</span>' : '';
      }).filter(Boolean).join('');
    }
    return '<a href="' + f.url + '" target="_blank" class="fl-card" title="' + (f.description || '') + '">' +
      '<img src="' + (f.avatar || 'https://gcore.jsdelivr.net/gh/volantis-x/cdn-org/blog/Logo-NavBar@3x.png') + '" alt="' + f.title + '" class="fl-card-avatar" loading="lazy" onerror="this.src=\'https://gcore.jsdelivr.net/gh/volantis-x/cdn-org/blog/Logo-NavBar@3x.png\'">' +
      '<div class="fl-card-name">' + f.title + '</div>' +
      '<div class="fl-card-desc">' + (f.description || '') + '</div>' +
      (tags ? '<div class="fl-card-tags">' + tags + '</div>' : '') +
    '</a>';
  }).join('');
}

// 优先从本站 /friends.json 读取（同域名，最可靠），失败用内置数据
fetch('/friends.json')
  .then(function(r) { return r.ok ? r.json() : Promise.reject('HTTP ' + r.status); })
  .then(function(data) {
    var friends = Array.isArray(data) ? data : ALL_FRIENDS;
    console.log('[Friends] Loaded from /friends.json:', friends.length);
    renderFriends(friends);
  })
  .catch(function(err) {
    console.warn('[Friends] /friends.json failed:', err, '- using built-in data');
    renderFriends(ALL_FRIENDS);
  });
</script>
