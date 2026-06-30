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
  var BASELINE_PV = 250;   // 从 busuanzi 迁移的基准 PV 值
  var BASELINE_UV = 20;    // 从 busuanzi 迁移的基准 UV 值

  var pv = parseInt(localStorage.getItem(PV_KEY) || '0');
  var uvTotal = parseInt(localStorage.getItem(UV_TOTAL_KEY) || '0');
  var hasInit = localStorage.getItem(INIT_KEY);

  // 首次运行：使用 busuanzi 历史数据或基准值作为初始值
  if (!hasInit) {
    var legacyPv = localStorage.getItem('busuanzi_site_pv');
    var legacyUv = localStorage.getItem('busuanzi_site_uv');
    var basePv = legacyPv ? parseInt(legacyPv) : BASELINE_PV;
    var baseUv = legacyUv ? parseInt(legacyUv) : BASELINE_UV;
    pv = Math.max(pv, basePv);
    uvTotal = Math.max(uvTotal, baseUv);
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
