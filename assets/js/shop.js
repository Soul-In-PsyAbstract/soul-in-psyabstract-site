// shop.js — Products page · Soul In PsyAbstract · V1.0 · 2026-03-24
// Candles / Soap / Oils · click → modal card with product info

(function() {
  'use strict';

  const PRODUCTS_URL = '/assets/data/products.json';
  let allProducts = [];
  let allCategories = [];

  // ── helpers ─────────────────────────────────────────────────────────────
  function L(obj) {
    const lang = (window.ST && ST.lang) ? ST.lang : 'ru';
    return obj['title_' + lang] || obj['title_ru'] || '';
  }
  function Lf(obj, field) {
    const lang = (window.ST && ST.lang) ? ST.lang : 'ru';
    return obj[field + '_' + lang] || obj[field + '_ru'] || '';
  }
  function t(key) {
    const lang = (window.ST && ST.lang) ? ST.lang : 'ru';
    const T = {
      ingredients: { ru:'Состав', en:'Ingredients', he:'מרכיבים' },
      volume:      { ru:'Объём',  en:'Volume',      he:'נפח' },
      scent:       { ru:'Аромат', en:'Scent',       he:'ניחוח' },
      handmade:    { ru:'Ручная работа', en:'Handmade', he:'עבודת יד' },
      uv:          { ru:'UV-реактивный', en:'UV-reactive', he:'UV-ריאקטיבי' },
      buy:         { ru:'Купить', en:'Buy', he:'לקנות' },
      all:         { ru:'Все',    en:'All', he:'הכל' },
      price:       { ru:'Цена',   en:'Price', he:'מחיר' },
      contact_buy: { ru:'Написать для покупки', en:'Contact to buy', he:'צור קשר לרכישה' },
      price_tbd:   { ru:'По запросу', en:'On request', he:'לפי בקשה' },
      close:       { ru:'Закрыть', en:'Close', he:'סגור' },
    };
    return (T[key] && T[key][lang]) || (T[key] && T[key]['ru']) || key;
  }

  // ── modal ────────────────────────────────────────────────────────────────
  function buildModal() {
    const m = document.createElement('div');
    m.id = 'shop-modal';
    m.style.cssText = [
      'display:none;position:fixed;inset:0;z-index:9000;',
      'background:rgba(5,7,9,.92);backdrop-filter:blur(6px);',
      'align-items:center;justify-content:center;padding:20px;',
    ].join('');
    m.innerHTML = `
      <div id="shop-modal-inner" style="
        background:#0d1117;border:1px solid rgba(127,243,231,.3);
        border-radius:12px;max-width:480px;width:100%;max-height:90vh;
        overflow-y:auto;padding:24px;position:relative;
        box-shadow:0 8px 40px rgba(127,243,231,.12);">
        <button id="shop-modal-close" style="
          position:absolute;top:14px;right:16px;background:none;
          border:none;color:#7ff3e7;font-size:20px;cursor:pointer;
          line-height:1;padding:4px 8px;">&times;</button>
        <div id="shop-modal-content"></div>
      </div>`;
    document.body.appendChild(m);
    m.addEventListener('click', function(e) {
      if (e.target === m) closeModal();
    });
    document.getElementById('shop-modal-close').addEventListener('click', closeModal);
    return m;
  }

  function openModal(product) {
    const m = document.getElementById('shop-modal') || buildModal();
    const c = document.getElementById('shop-modal-content');

    const price = product.price_ils
      ? product.price_ils + ' ₪'
      : t('price_tbd');

    const weightStr = product.weight_g ? product.weight_g + 'г' : '';

    const uvBadge = product.uv_reactive
      ? `<span style="
          display:inline-block;padding:2px 8px;border-radius:20px;
          background:rgba(127,243,231,.15);border:1px solid rgba(127,243,231,.4);
          color:#7ff3e7;font-size:11px;letter-spacing:.06em;margin-left:6px;">
          ✦ ${t('uv')}</span>`
      : '';

    const imgHtml = product.img
      ? `<img src="${product.img}" alt="${L(product)}" style="
          width:100%;border-radius:8px;margin-bottom:16px;
          object-fit:cover;max-height:260px;
          background:#111;border:1px solid rgba(127,243,231,.15);"
          onerror="this.style.display='none'">`
      : `<div style="
          width:100%;height:180px;border-radius:8px;margin-bottom:16px;
          background:rgba(127,243,231,.05);border:1px solid rgba(127,243,231,.1);
          display:flex;align-items:center;justify-content:center;
          color:rgba(127,243,231,.3);font-size:32px;">✦</div>`;

    const contactHref = 'https://t.me/messycketch';
    const wiseHref = product.wise_url || null;
    const wiseBtn = wiseHref
      ? `<a href="${wiseHref}" target="_blank" rel="noopener" style="
          flex:1;display:block;text-align:center;padding:10px 16px;
          background:linear-gradient(90deg,#163300,#2d6a00);
          border:1px solid #4ade8066;color:#4ade80;border-radius:6px;
          font-weight:700;font-size:14px;text-decoration:none;
          font-family:'Courier New',monospace;">🏦 Wise $${product.price_usd || ''}</a>`
      : '';

    c.innerHTML = `
      ${imgHtml}
      <h2 style="color:#7ff3e7;font-size:18px;margin:0 0 4px;font-family:'Courier New',monospace;">
        ${L(product)}${uvBadge}
      </h2>
      <div style="color:#4ade80;font-size:22px;font-weight:700;margin-bottom:16px;font-family:'Courier New',monospace;">
        ${price}${weightStr ? ' · ' + weightStr : ''}
      </div>
      <div style="background:rgba(255,255,255,.04);border-radius:6px;padding:14px;margin-bottom:14px;font-size:13px;line-height:1.9;font-family:'Courier New',monospace;">
        <div style="display:grid;grid-template-columns:110px 1fr;gap:4px;">
          <span style="color:#888;">${t('scent')}:</span>
          <span style="color:#e2e8f0;">${Lf(product, 'scent')}</span>
          ${weightStr ? `<span style="color:#888;">${t('volume')}:</span><span style="color:#e2e8f0;">${weightStr}</span>` : ''}
          <span style="color:#888;">${t('ingredients')}:</span>
          <span style="color:#e2e8f0;">${Lf(product, 'ingredients')}</span>
          <span style="color:#888;">${t('handmade')}:</span>
          <span style="color:#4ade80;">✓</span>
        </div>
      </div>
      <p style="color:#aaa;font-size:13px;line-height:1.6;margin-bottom:20px;font-family:'Courier New',monospace;">
        ${Lf(product, 'description')}
      </p>
      <div style="display:flex;gap:10px;flex-wrap:wrap;">
        <a href="${contactHref}" target="_blank" rel="noopener" style="
          flex:1;display:block;text-align:center;padding:10px 16px;
          background:#7ff3e7;color:#0a0d10;border-radius:6px;
          font-weight:700;font-size:14px;text-decoration:none;
          font-family:'Courier New',monospace;">${t('buy')}</a>
        ${wiseBtn}
        <button onclick="closeShopModal()" style="
          padding:10px 16px;background:none;border:1px solid rgba(127,243,231,.3);
          color:#7ff3e7;border-radius:6px;cursor:pointer;font-size:13px;
          font-family:'Courier New',monospace;">${t('close')}</button>
      </div>`;

    m.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    const m = document.getElementById('shop-modal');
    if (m) m.style.display = 'none';
    document.body.style.overflow = '';
  }
  window.closeShopModal = closeModal;

  // ── render cards ─────────────────────────────────────────────────────────
  function renderCards(products) {
    const grid = document.getElementById('shop-grid');
    if (!grid) return;
    if (!products.length) {
      grid.innerHTML = '<p style="color:#666;text-align:center;padding:40px;font-family:\'Courier New\',monospace;">—</p>';
      return;
    }
    grid.innerHTML = products.map(function(p) {
      const price = p.price_ils ? p.price_ils + ' ₪' : t('price_tbd');
      const uvDot = p.uv_reactive ? '<span style="color:#7ff3e7;font-size:10px;"> ✦UV</span>' : '';
      const imgHtml = p.img
        ? `<img src="${p.img}" alt="${L(p)}" style="
            width:100%;height:180px;object-fit:cover;border-radius:6px 6px 0 0;
            background:#111;display:block;" onerror="this.style.display='none'">`
        : `<div style="
            width:100%;height:180px;border-radius:6px 6px 0 0;
            background:rgba(127,243,231,.04);
            display:flex;align-items:center;justify-content:center;
            color:rgba(127,243,231,.2);font-size:40px;">✦</div>`;
      return `
        <div class="shop-card" data-id="${p.id}" style="
          background:#0d1117;border:1px solid rgba(127,243,231,.18);
          border-radius:8px;cursor:pointer;transition:border-color .2s,transform .15s;
          overflow:hidden;"
          onmouseover="this.style.borderColor='rgba(127,243,231,.6)';this.style.transform='translateY(-2px)'"
          onmouseout="this.style.borderColor='rgba(127,243,231,.18)';this.style.transform=''"
        >
          ${imgHtml}
          <div style="padding:12px 14px;">
            <div style="color:#7ff3e7;font-size:13px;font-weight:700;margin-bottom:4px;font-family:'Courier New',monospace;line-height:1.3;">
              ${L(p)}${uvDot}
            </div>
            <div style="color:#4ade80;font-size:15px;font-weight:700;font-family:'Courier New',monospace;">
              ${price}
            </div>
            <div style="color:#666;font-size:11px;margin-top:4px;font-family:'Courier New',monospace;">
              ${Lf(p, 'scent')}
            </div>
          </div>
        </div>`;
    }).join('');

    grid.querySelectorAll('.shop-card').forEach(function(card) {
      card.addEventListener('click', function() {
        const p = allProducts.find(function(x) { return x.id === card.dataset.id; });
        if (p) openModal(p);
      });
    });
  }

  // ── filter tabs ──────────────────────────────────────────────────────────
  function renderTabs(categories) {
    const tabs = document.getElementById('shop-tabs');
    if (!tabs) return;
    const lang = (window.ST && ST.lang) ? ST.lang : 'ru';
    const allLabel = t('all');

    tabs.innerHTML = `<button class="shop-tab active" data-cat="" style="
        padding:6px 16px;border-radius:20px;border:1px solid rgba(127,243,231,.5);
        background:rgba(127,243,231,.15);color:#7ff3e7;cursor:pointer;
        font-size:12px;font-family:'Courier New',monospace;letter-spacing:.05em;">
        ${allLabel}</button>` +
      categories.map(function(cat) {
        return `<button class="shop-tab" data-cat="${cat.id}" style="
          padding:6px 16px;border-radius:20px;border:1px solid rgba(127,243,231,.25);
          background:none;color:#aaa;cursor:pointer;
          font-size:12px;font-family:'Courier New',monospace;letter-spacing:.05em;
          transition:all .2s;"
          onmouseover="this.style.borderColor='rgba(127,243,231,.5)';this.style.color='#7ff3e7'"
          onmouseout="if(!this.classList.contains('active')){this.style.borderColor='rgba(127,243,231,.25)';this.style.color='#aaa'}"
        >${cat[lang] || cat.ru}</button>`;
      }).join('');

    tabs.querySelectorAll('.shop-tab').forEach(function(btn) {
      btn.addEventListener('click', function() {
        tabs.querySelectorAll('.shop-tab').forEach(function(b) {
          b.classList.remove('active');
          b.style.background = 'none';
          b.style.color = '#aaa';
          b.style.borderColor = 'rgba(127,243,231,.25)';
        });
        btn.classList.add('active');
        btn.style.background = 'rgba(127,243,231,.15)';
        btn.style.color = '#7ff3e7';
        btn.style.borderColor = 'rgba(127,243,231,.5)';
        const cat = btn.dataset.cat;
        const filtered = cat ? allProducts.filter(function(p) { return p.category === cat; }) : allProducts;
        renderCards(filtered);
      });
    });
  }

  // ── init ─────────────────────────────────────────────────────────────────
  function init() {
    fetch(PRODUCTS_URL)
      .then(function(r) { return r.json(); })
      .then(function(data) {
        allProducts   = data.products || [];
        allCategories = data.categories || [];
        // filter only categories that have products
        const usedCats = allCategories.filter(function(cat) {
          return allProducts.some(function(p) { return p.category === cat.id; });
        });
        renderTabs(usedCats);
        renderCards(allProducts);
      })
      .catch(function() {
        const grid = document.getElementById('shop-grid');
        if (grid) grid.innerHTML = '<p style="color:#f87171;text-align:center;padding:40px;font-family:\'Courier New\',monospace;">—</p>';
      });
  }

  // wait for ST (i18n) if needed
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    setTimeout(init, 0);
  }
})();
