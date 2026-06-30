/**
 * Wesley AI Lab - 全站统一访问计数器
 * 所有页面共享同一套 localStorage 数据，彻底解决 busuanzi 缓存不一致问题
 */
(function() {
  'use strict';

  var PV_KEY = 'wal_site_pv';
  var UV_TOTAL_KEY = 'wal_site_uv_total';
  var UV_DATE_KEY = 'wal_site_uv_date';
  var INIT_KEY = 'wal_counter_init';

  // 初始化基准值（从 busuanzi 博客页读取过的正确数字）
  // 如果用户之前访问过博客页，localStorage 中可能已有 busuanzi 同步的数据
  var legacyPv = localStorage.getItem('busuanzi_site_pv');
  var legacyUv = localStorage.getItem('busuanzi_site_uv');
  var hasInit = localStorage.getItem(INIT_KEY);

  var pv = parseInt(localStorage.getItem(PV_KEY) || '0');
  var uvTotal = parseInt(localStorage.getItem(UV_TOTAL_KEY) || '0');

  // 首次运行：如果之前有 busuanzi 同步的数据，用它作为初始值
  if (!hasInit && legacyPv) {
    pv = Math.max(pv, parseInt(legacyPv) || 0);
    uvTotal = Math.max(uvTotal, parseInt(legacyUv) || 0);
    localStorage.setItem(INIT_KEY, '1');
  }

  // PV 每次页面加载都 +1
  pv++;
  localStorage.setItem(PV_KEY, pv);

  // UV：每天只计一次（按日期判断）
  var today = new Date().toISOString().slice(0, 10);
  var lastDate = localStorage.getItem(UV_DATE_KEY);
  if (lastDate !== today) {
    uvTotal++;
    localStorage.setItem(UV_TOTAL_KEY, uvTotal);
    localStorage.setItem(UV_DATE_KEY, today);
  }

  // 写入页面
  function update() {
    var pvEl = document.getElementById('site-pv');
    var uvEl = document.getElementById('site-uv');
    var bzPv = document.getElementById('busuanzi_value_site_pv');
    var bzUv = document.getElementById('busuanzi_value_site_uv');

    var pvText = pv.toLocaleString();
    var uvText = uvTotal.toLocaleString();

    if (pvEl) pvEl.textContent = pvText;
    if (uvEl) uvEl.textContent = uvText;
    if (bzPv) bzPv.textContent = pvText;
    if (bzUv) bzUv.textContent = uvText;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', update);
  } else {
    update();
  }
})();
