/**
 * Wesley AI Lab - 全站统一访问计数器（Cloudflare Workers 版）
 * PV: 每次页面加载 +1（服务端计数，跨设备共享）
 * UV: 每个浏览器每天只计一次（客户端 localStorage 去重 + 服务端计数）
 * 手机端网络不通时自动回退到 localStorage 缓存值
 */
(function() {
  'use strict';

  var API_BASE = 'https://wesley-counter.weiwk01.workers.dev';
  var UV_DATE_KEY = 'wal_uv_date';
  var CACHE_PV_KEY = 'wal_cache_pv';
  var CACHE_UV_KEY = 'wal_cache_uv';
  var CACHE_TIME_KEY = 'wal_cache_time';
  var TIMEOUT_MS = 5000;

  // 读取上次缓存的值（用于 API 不可用时的兜底显示）
  function getCached() {
    try {
      return {
        pv: parseInt(localStorage.getItem(CACHE_PV_KEY) || '0'),
        uv: parseInt(localStorage.getItem(CACHE_UV_KEY) || '0')
      };
    } catch(e) {
      return { pv: 0, uv: 0 };
    }
  }

  function saveCache(pv, uv) {
    try {
      localStorage.setItem(CACHE_PV_KEY, pv);
      localStorage.setItem(CACHE_UV_KEY, uv);
      localStorage.setItem(CACHE_TIME_KEY, Date.now());
    } catch(e) {}
  }

  function updateDisplay(pv, uv) {
    var pvEl = document.getElementById('site-pv');
    var uvEl = document.getElementById('site-uv');
    var bzPv = document.getElementById('busuanzi_value_site_pv');
    var bzUv = document.getElementById('busuanzi_value_site_uv');
    var pvText = pv > 0 ? pv.toLocaleString() : '--';
    var uvText = uv > 0 ? uv.toLocaleString() : '--';
    if (pvEl) pvEl.textContent = pvText;
    if (uvEl) uvEl.textContent = uvText;
    if (bzPv) bzPv.textContent = pvText;
    if (bzUv) bzUv.textContent = uvText;
  }

  // 带超时的 fetch
  function fetchWithTimeout(url) {
    return Promise.race([
      fetch(url),
      new Promise(function(_, reject) {
        setTimeout(function() { reject(new Error('timeout')); }, TIMEOUT_MS);
      })
    ]);
  }

  function update() {
    var today = new Date().toISOString().slice(0, 10);
    var lastUvDate = null;
    try { lastUvDate = localStorage.getItem(UV_DATE_KEY); } catch(e) {}
    var cached = getCached();

    // 先立即显示缓存值（让手机端不用等 API）
    if (cached.pv > 0) {
      updateDisplay(cached.pv, cached.uv);
    }

    // PV: 每次页面访问 +1
    fetchWithTimeout(API_BASE + '/pv')
      .then(function(r) { return r.json(); })
      .then(function(data) {
        var pv = data.pv || 0;

        // UV: 每天只计一次
        var uvPromise;
        if (lastUvDate !== today) {
          // 新的一天，调用 /uv 增加计数
          uvPromise = fetchWithTimeout(API_BASE + '/uv?date=' + today)
            .then(function(r) { return r.json(); })
            .then(function(data) {
              try { localStorage.setItem(UV_DATE_KEY, today); } catch(e) {}
              return data.totalUv || 0;
            })
            .catch(function() { return cached.uv; });
        } else {
          // 今天已计过，只读取当前值
          uvPromise = fetchWithTimeout(API_BASE + '/stats')
            .then(function(r) { return r.json(); })
            .then(function(data) { return data.totalUv || 0; })
            .catch(function() { return cached.uv; });
        }

        return uvPromise.then(function(uv) {
          saveCache(pv, uv);
          updateDisplay(pv, uv);
        });
      })
      .catch(function() {
        // Worker API 不可用（手机网络屏蔽等），显示缓存值
        // 缓存值已在上面显示过，这里无需再调
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', update);
  } else {
    update();
  }
})();
