// Wesley AI Lab - 访问计数 API
// 部署到 Cloudflare Workers（免费额度：每天 10 万次请求）
// 使用 Cloudflare KV 存储，所有用户共享同一计数器

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json'
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // PV endpoint: GET /pv — 每次调用 +1
    if (path === '/pv') {
      const pv = (await env.COUNTERS.get('site_pv', { type: 'json' })) || 0;
      const newPv = pv + 1;
      await env.COUNTERS.put('site_pv', JSON.stringify(newPv));
      return new Response(JSON.stringify({ pv: newPv }), { headers: corsHeaders });
    }

    // UV endpoint: GET /uv?date=2026-07-01 — 按天去重，总计 +1
    if (path === '/uv') {
      const date = url.searchParams.get('date') || new Date().toISOString().slice(0, 10);
      const key = 'site_uv_' + date;
      const uv = (await env.COUNTERS.get(key, { type: 'json' })) || 0;
      const newUv = uv + 1;
      await env.COUNTERS.put(key, JSON.stringify(newUv));
      // 新访客：总计 +1
      let totalUv = (await env.COUNTERS.get('site_uv_total', { type: 'json' })) || 0;
      if (newUv === 1) {
        totalUv = totalUv + 1;
        await env.COUNTERS.put('site_uv_total', JSON.stringify(totalUv));
      }
      return new Response(JSON.stringify({ uv: newUv, totalUv: totalUv }), { headers: corsHeaders });
    }

    // Stats endpoint: GET /stats — 只读，不递增
    if (path === '/stats') {
      const pv = (await env.COUNTERS.get('site_pv', { type: 'json' })) || 0;
      const today = new Date().toISOString().slice(0, 10);
      const todayUv = (await env.COUNTERS.get('site_uv_' + today, { type: 'json' })) || 0;
      const totalUv = (await env.COUNTERS.get('site_uv_total', { type: 'json' })) || 0;
      return new Response(JSON.stringify({ pv, todayUv, totalUv }), { headers: corsHeaders });
    }

    return new Response('Not Found', { status: 404, headers: corsHeaders });
  }
};
