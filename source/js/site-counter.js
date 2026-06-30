/**
 * Wesley AI Lab - 全站统一访问计数器（Cloudflare Workers 版）
 * PV: 每次页面加载 +1（服务端计数，跨设备共享）
 * UV: 每个浏览器每天只计一次（客户端 localStorage 去重 + 服务端计数）
 * 所有设备/浏览器共享同一套数据
 */
(function() {
  'use strict';

  var API_BASE = 'https://wesley-counter.weiwk01.workers.dev';
  var UV_DATE_KEY = 'wal_uv_date';

  function updateDisplay(pv, uv) {
    var pvEl = document.getElementById('site-pv');
    var uvEl = document.getElementById('site-uv');
    var bzPv = document.getElementById('busuanzi_value_site_pv');
    var bzUv = document.getElementById('busuanzi_value_site_uv');
    var pvText = pv ? pv.toLocaleString() : '--';
    var uvText = uv ? uv.toLocaleString() : '--';
    if (pvEl) pvEl.textContent = pvText;
    if (uvEl) uvEl.textContent = uvText;
    if (bzPv) bzPv.textContent = pvText;
    if (bzUv) bzUv.textContent = uvText;
  }

  function update() {
    var today = new Date().toISOString().slice(0, 10);
    var lastUvDate = null;
    try { lastUvDate = localStorage.getItem(UV_DATE_KEY); } catch(e) {}

    // PV: 每次页面访问 +1
    fetch(API_BASE + '/pv')
      .then(function(r) { return r.json(); })
      .then(function(data) {
        var pv = data.pv || 0;

        // UV: 每天只计一次
        var uvPromise;
        if (lastUvDate !== today) {
          // 新的一天，调用 /uv 增加计数
          uvPromise = fetch(API_BASE + '/uv?date=' + today)
            .then(function(r) { return r.json(); })
            .then(function(data) {
              try { localStorage.setItem(UV_DATE_KEY, today); } catch(e) {}
              return data.totalUv || 0;
            })
            .catch(function() { return 0; });
        } else {
          // 今天已计过，只读取当前值
          uvPromise = fetch(API_BASE + '/stats')
            .then(function(r) { return r.json(); })
            .then(function(data) { return data.totalUv || 0; })
            .catch(function() { return 0; });
        }

        return uvPromise.then(function(uv) {
          updateDisplay(pv, uv);
        });
      })
      .catch(function() {
        // Worker API 不可用时显示占位符
        updateDisplay(0, 0);
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', update);
  } else {
    update();
  }
})();
