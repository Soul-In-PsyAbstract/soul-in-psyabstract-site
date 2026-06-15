// /assets/js/buy-modal.js — модалка с Exclusive +200
(function(){
  const $ = (s,p=document)=>p.querySelector(s);
  function fmt(n){return '$'+(n||0)}
  window.openBuy = function(code, priceArg, titleArg){
    // accept numeric index (from gallery.js) or string code
    let a;
    if (typeof code === 'number') {
      a = (window.__DATA__ && __DATA__.ART[code-1]) || null;
    } else {
      a = (window.__DATA__ && __DATA__.ART.find(x=>x.code===code)) || null;
    }
    if(!a) return alert('Work not found');
    const ex = 200, base = a.price_usd||priceArg||0;
    const eth = (window.__PAYCFG__&&__PAYCFG__.ETH_ADDRESS)||'';
    const ncpCode = (window.__PAYCFG__&&window.__PAYCFG__.NCP&&window.__PAYCFG__.NCP[String(base)])||'';
    const shipNcp = (window.__PAYCFG__&&window.__PAYCFG__.SHIP_NCP)||{ship150:'WN5SEBVTCPV2J',ship200:'X3FPSE4E3Z2PE',ship300:'VYBZADUBRHC4L'};
    const label = a.title_ru||a.title_en||titleArg||a.code||('Art #'+code);
    const lang = window.__LANG||'ru';
    const t = (ru,en)=>lang==='en'?en:ru;
    const html = `
    <div class="modal" id="buym" onclick="this===event.target && this.remove()">
      <div class="box">
        <h3>${label}</h3>
        <div style="margin-bottom:10px">
          <label style="display:flex;align-items:center;gap:8px;margin-bottom:6px;font-size:14px">
            <input type="checkbox" id="bm-excl"> ${t('Эксклюзив','Exclusive')} <span style="color:var(--muted)">+${fmt(ex)}</span>
          </label>
          <label style="display:flex;align-items:center;gap:8px;font-size:14px">
            ${t('Доставка','Shipping')}:
            <select id="bm-ship" style="background:rgba(0,0,0,.4);border:1px solid rgba(127,243,231,.3);color:#e8f2ff;border-radius:4px;padding:3px 6px;font-size:13px">
              <option value="">${t('Без доставки','No shipping')}</option>
              <option value="ship150">$150</option>
              <option value="ship200">$200</option>
              <option value="ship300">$300</option>
            </select>
          </label>
        </div>
        <div style="font-size:15px;font-weight:700;margin-bottom:10px">${t('Итого','Total')}: <span id="bm-total">${fmt(base)}</span></div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;flex-direction:column">
          <div style="font-size:12px;color:var(--muted);letter-spacing:.05em">${t('ОПЛАТА КАРТИНЫ','ARTWORK PAYMENT')}</div>
          <div style="display:flex;gap:8px;flex-wrap:wrap">
            ${ncpCode?`<a class="btn" id="bm-art" target="_blank" rel="noopener" href="https://www.paypal.com/ncp/payment/${ncpCode}">${t('Картина','Artwork')} · PayPal ${fmt(base)}</a>`:''}
            <a class="btn" target="_blank" rel="noopener" href="${(window.__PAYCFG__&&__PAYCFG__.PAYPAL_ME)||'https://paypal.me/SoulInPsyAbstract'}">PayPal.me</a>
            ${a.nft?`<a class="btn" target="_blank" href="${a.nft}" rel="noopener">NFT</a>`:''}
            ${eth?`<button class="btn" id="copyeth">${t('ETH адрес','Copy ETH')}</button>`:''}
            <button class="btn" id="bm-crypto" style="background:linear-gradient(135deg,#00c6ff 0%,#7b2fff 100%);color:#fff;border:none">${t('Крипто · NOWPayments','Crypto · NOWPayments')}</button>
          </div>
          <div id="bm-ship-wrap" style="display:none;margin-top:6px">
            <div style="font-size:12px;color:var(--muted);letter-spacing:.05em">${t('ОПЛАТА ДОСТАВКИ','SHIPPING PAYMENT')}</div>
            <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:4px">
              <a class="btn" id="bm-ship-pay" target="_blank" rel="noopener" href="#">${t('Доставка','Shipping')} · PayPal</a>
            </div>
          </div>
        </div>
        <div style="margin-top:10px"><button class="btn" onclick="document.getElementById('buym').remove()">${t('Закрыть','Close')}</button></div>
      </div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', html);

    const exEl = document.getElementById('bm-excl');
    const shipEl = document.getElementById('bm-ship');
    const totalEl = document.getElementById('bm-total');
    const artEl = document.getElementById('bm-art');
    const shipPayEl = document.getElementById('bm-ship-pay');
    const shipWrapEl = document.getElementById('bm-ship-wrap');
    function recalc(){
      const shipAmount = shipEl.value==='ship150'?150:shipEl.value==='ship200'?200:shipEl.value==='ship300'?300:0;
      const artAmount = base + (exEl.checked?ex:0);
      const total = artAmount + shipAmount;
      totalEl.textContent = fmt(total);
      // Artwork button — always artwork NCP
      if(artEl){
        const artCode = exEl.checked ? (window.__PAYCFG__&&window.__PAYCFG__.NCP&&window.__PAYCFG__.NCP[String(artAmount)])||ncpCode : ncpCode;
        artEl.href = 'https://www.paypal.com/ncp/payment/' + (artCode||ncpCode);
        artEl.textContent = t('Картина','Artwork') + ' · PayPal ' + fmt(artAmount);
      }
      // Shipping button — separate, only visible when shipping selected
      if(shipWrapEl && shipPayEl){
        if(shipEl.value && shipNcp[shipEl.value]){
          shipWrapEl.style.display = 'block';
          shipPayEl.href = 'https://www.paypal.com/ncp/payment/' + shipNcp[shipEl.value];
          shipPayEl.textContent = t('Доставка','Shipping') + ' · PayPal ' + fmt(shipAmount);
        } else {
          shipWrapEl.style.display = 'none';
        }
      }
    }
    if(exEl) exEl.addEventListener('change', recalc);
    if(shipEl) shipEl.addEventListener('change', recalc);

    const b = document.getElementById('copyeth');
    if(b){ b.addEventListener('click', async ()=>{
      try{ await navigator.clipboard.writeText(eth); b.textContent=t('Скопировано!','Copied!'); }catch(e){}
    }); }

    const cryptoBtn = document.getElementById('bm-crypto');
    if(cryptoBtn){ cryptoBtn.addEventListener('click', async ()=>{
      const artAmount = base + (exEl&&exEl.checked?ex:0);
      const apiUrl = (window.__PAYCFG__&&window.__PAYCFG__.NOWPAYMENTS_API)||'/api/nowpayments/create';
      const fallback = (window.__PAYCFG__&&window.__PAYCFG__.NOWPAYMENTS_FALLBACK)||'https://nowpayments.io/payment?iid=4954740232';
      cryptoBtn.textContent = t('Загрузка...','Loading...');
      cryptoBtn.disabled = true;
      try{
        const r = await fetch(apiUrl, {
          method:'POST',
          headers:{'Content-Type':'application/json'},
          body: JSON.stringify({amount: artAmount, title: label, user_id:'store_'+Date.now()})
        });
        const d = await r.json();
        if(d.invoice_url){ window.open(d.invoice_url,'_blank'); cryptoBtn.textContent=t('Открыто ↗','Opened ↗'); }
        else throw new Error(d.error||'no url');
      }catch(e){
        window.open(fallback,'_blank');
        cryptoBtn.textContent=t('Открыто ↗','Opened ↗');
      }
      setTimeout(()=>{ cryptoBtn.disabled=false; cryptoBtn.style.background='linear-gradient(135deg,#00c6ff 0%,#7b2fff 100%)'; cryptoBtn.textContent=t('Крипто · NOWPayments','Crypto · NOWPayments'); },3000);
    }); }
  };
})();