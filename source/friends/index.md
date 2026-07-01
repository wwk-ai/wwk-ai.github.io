---
title: 友情链接
date: 2024-01-01 00:00:00
comments: true
toc: false
---

<div class="fl-container">
  <!-- 我的信息 -->
  <div class="fl-section-title">Wesley AI Lab</div>
  <div class="fl-myself" id="flMyself"></div>

  <!-- 友链列表 -->
  <div class="fl-section-title">友情链接</div>
  <div class="fl-grid" id="flGrid"></div>

  <!-- 申请说明 -->
  <div class="fl-apply">
    <div class="fl-apply-title">交换友链</div>
    <p>欢迎技术博主交换友链，要求：原创内容、定期更新、技术相关。</p>
    <p>申请格式：站点名称 / 站点地址 / 站点描述 / 站点头像</p>
  </div>
</div>

<style>
  .fl-container { max-width: 960px; margin: 0 auto; padding: 20px 0 60px; }
  .fl-section-title { font-size: 22px; font-weight: 700; color: #1a1a2e; margin: 40px 0 24px; letter-spacing: -0.01em; }
  .fl-section-title:first-child { margin-top: 0; }

  /* 我的信息 */
  .fl-myself { display: flex; gap: 28px; align-items: flex-start; padding: 28px; background: #fff; border-radius: 16px; border: 1px solid rgba(0,0,0,0.06); box-shadow: 0 4px 20px rgba(0,0,0,0.04); }
  .fl-myself-avatar { width: 80px; height: 80px; border-radius: 50%; object-fit: cover; flex-shrink: 0; border: 3px solid rgba(99,102,241,0.12); }
  .fl-myself-info { flex: 1; }
  .fl-myself-name { font-size: 20px; font-weight: 700; color: #1a1a2e; margin-bottom: 6px; }
  .fl-myself-desc { font-size: 14px; color: #64748b; line-height: 1.6; margin-bottom: 12px; }
  .fl-myself-tags { display: flex; flex-wrap: wrap; gap: 6px; }
  .fl-myself-tags span { padding: 3px 12px; border-radius: 8px; font-size: 12px; font-weight: 500; background: rgba(99,102,241,0.08); color: #4f46e5; border: 1px solid rgba(79,70,229,0.1); }
  .fl-myself-link { display: inline-flex; align-items: center; gap: 6px; margin-top: 12px; font-size: 13px; color: #4f46e5; font-weight: 500; }
  .fl-myself-link:hover { color: #4338ca; }

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

  /* 申请说明 */
  .fl-apply { margin-top: 48px; padding: 28px; background: #fff; border-radius: 16px; border: 1px solid rgba(0,0,0,0.06); }
  .fl-apply-title { font-size: 17px; font-weight: 600; color: #1a1a2e; margin-bottom: 12px; }
  .fl-apply p { font-size: 14px; color: #64748b; line-height: 1.7; margin-bottom: 6px; }

  @media (max-width: 768px) {
    .fl-grid { grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 12px; }
    .fl-myself { flex-direction: column; align-items: center; text-align: center; }
    .fl-myself-tags { justify-content: center; }
  }
</style>

<script>
fetch('/friends/friends.json')
  .then(function(r) { return r.json(); })
  .then(function(data) {
    // 渲染我的信息
    var myselfEl = document.getElementById('flMyself');
    if (data.myself && myselfEl) {
      var m = data.myself;
      var tags = (m.keywords || []).map(function(k) { return '<span>' + k + '</span>'; }).join('');
      myselfEl.innerHTML =
        '<img src="' + m.avatar + '" alt="' + m.title + '" class="fl-myself-avatar">' +
        '<div class="fl-myself-info">' +
          '<div class="fl-myself-name">' + m.title + '</div>' +
          '<div class="fl-myself-desc">' + m.description + '</div>' +
          '<div class="fl-myself-tags">' + tags + '</div>' +
          '<a href="' + m.url + '" target="_blank" class="fl-myself-link"><i class="fa-solid fa-link"></i> 访问站点</a>' +
        '</div>';
    }

    // 渲染友链列表
    var gridEl = document.getElementById('flGrid');
    if (data.friends && gridEl) {
      gridEl.innerHTML = data.friends.map(function(f) {
        var tags = (f.keywords || []).map(function(k) { return '<span>#' + k + '</span>'; }).join('');
        return '<a href="' + f.url + '" target="_blank" class="fl-card">' +
          '<img src="' + f.avatar + '" alt="' + f.title + '" class="fl-card-avatar" loading="lazy">' +
          '<div class="fl-card-name">' + f.title + '</div>' +
          '<div class="fl-card-desc">' + f.description + '</div>' +
          '<div class="fl-card-tags">' + tags + '</div>' +
        '</a>';
      }).join('');
    }
  })
  .catch(function() {
    document.getElementById('flGrid').innerHTML = '<p style="color:#999;text-align:center;">友链加载失败，请刷新重试。</p>';
  });
</script>
