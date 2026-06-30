/**
 * Wesley AI Lab - 全站统一访问计数器
 * 所有页面共享同一套 localStorage 数据
 * PV: 每次页面加载 +1
 * UV: 每个浏览器每天只计一次
 * 
 * 注意：此计数器基于 localStorage，仅同一浏览器内数据一致。
 * 如需跨设备/跨浏览器统计，需部署 Cloudflare Workers 后端（见 /workers/counter.js）
 */
(function() {
  'use strict';

  var PV_KEY = 'wal_site_pv';
  var UV_TOTAL_KEY = 'wal_site_uv_total';
  var UV_DATE_KEY = 'wal_site_uv_date';
  var INIT_KEY = 'wal_counter_init';

  var pv = parseInt(localStorage.getItem(PV_KEY) || '0');
  var uvTotal = parseInt(localStorage.getItem(UV_TOTAL_KEY) || '0');
  var hasInit = localStorage.getItem(INIT_KEY);

  // 首次运行：继承之前 busuanzi 同步脚本的数据（如有）
  if (!hasInit) {
    var legacyPv = localStorage.getItem('busuanzi_site_pv');
    var legacyUv = localStorage.getItem('busuanzi_site_uv');
    if (legacyPv) pv = Math.max(pv, parseInt(legacyPv) || 0);
    if (legacyUv) uvTotal = Math.max(uvTotal, parseInt(legacyUv) || 0);
    localStorage.setItem(INIT_KEY, '1');
  }

  // PV +1
  pv++;
  localStorage.setItem(PV_KEY, pv);

  // UV：每天只计一次
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
