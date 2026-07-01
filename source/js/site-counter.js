/**
 * Wesley AI Lab - 全站统一访问计数器
 * 方案: busuanzi（不蒜子）- 国内可访问的免费统计服务
 * 所有页面加载 busuanzi，统一显示 site_pv / site_uv
 * busuanzi 按 referer 统计，不同路径数字略有差异属正常现象
 */
(function() {
  'use strict';

  function updateDisplay(pv, uv) {
    var pvEl = document.getElementById('site-pv');
    var uvEl = document.getElementById('site-uv');
    if (pvEl && pv) pvEl.textContent = pv;
    if (uvEl && uv) uvEl.textContent = uv;
  }

  // 动态加载 busuanzi
  var script = document.createElement('script');
  script.src = 'https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js';
  script.async = true;

  script.onload = function() {
    // busuanzi 加载后会把数字写入 #busuanzi_value_site_pv 和 #busuanzi_value_site_uv
    // 等待数字填充（busuanzi 异步请求，需要轮询）
    var attempts = 0;
    var maxAttempts = 30; // 最多等 3 秒
    var timer = setInterval(function() {
      attempts++;
      var bzPv = document.getElementById('busuanzi_value_site_pv');
      var bzUv = document.getElementById('busuanzi_value_site_uv');
      var pv = bzPv ? bzPv.textContent : '';
      var uv = bzUv ? bzUv.textContent : '';

      if ((pv && uv && pv !== '--') || attempts >= maxAttempts) {
        clearInterval(timer);
        updateDisplay(pv || '--', uv || '--');
      }
    }, 100);
  };

  script.onerror = function() {
    // busuanzi 加载失败，显示 --
    updateDisplay('--', '--');
  };

  // 创建隐藏的 busuanzi 标签（如果页面没有的话）
  if (!document.getElementById('busuanzi_value_site_pv')) {
    var hidden = document.createElement('span');
    hidden.style.display = 'none';
    hidden.innerHTML = '<span id="busuanzi_container_site_pv"><span id="busuanzi_value_site_pv"></span></span><span id="busuanzi_container_site_uv"><span id="busuanzi_value_site_uv"></span></span>';
    document.body.appendChild(hidden);
  }

  document.head.appendChild(script);
})();
