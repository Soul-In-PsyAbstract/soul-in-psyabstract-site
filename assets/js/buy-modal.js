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
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          ${ncpCode?`<a class="btn" id="bm-fast" target="_blank" rel="noopener" href="https://www.paypal.com/ncp/payment/${ncpCode}">PayPal Fast</a>`:''}
          <a class="btn" target="_blank" rel="noopener" href="${(window.__PAYCFG__&&__PAYCFG__.PAYPAL_ME)||'https://paypal.me/SoulInPsyAbstract'}">PayPal.me</a>
          ${a.nft?`<a class="btn" target="_blank" href="${a.nft}" rel="noopener">NFT</a>`:''}
          ${eth?`<button class="btn" id="copyeth">${t('ETH адрес','Copy ETH')}</button>`:''}
        </div>
        <div style="margin-top:10px"><button class="btn" onclick="document.getElementById('buym').remove()">${t('Закрыть','Close')}</button></div>
      </div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', html);

    const exEl = document.getElementById('bm-excl');
    const shipEl = document.getElementById('bm-ship');
    const totalEl = document.getElementById('bm-total');
    const fastEl = document.getElementById('bm-fast');
    function recalc(){
      const total = base + (exEl.checked?ex:0) + (shipEl.value==='ship150'?150:shipEl.value==='ship200'?200:shipEl.value==='ship300'?300:0);
      totalEl.textContent = fmt(total);
      if(fastEl){
        const shipCode = shipEl.value ? (shipNcp[shipEl.value]||'') : '';
        const baseCode = exEl.checked ? (window.__PAYCFG__&&window.__PAYCFG__.NCP&&window.__PAYCFG__.NCP[String(base+ex)])||ncpCode : ncpCode;
        fastEl.href = 'https://www.paypal.com/ncp/payment/' + (shipCode||baseCode||ncpCode);
      }
    }
    if(exEl) exEl.addEventListener('change', recalc);
    if(shipEl) shipEl.addEventListener('change', recalc);

    const b = document.getElementById('copyeth');
    if(b){ b.addEventListener('click', async ()=>{
      try{ await navigator.clipboard.writeText(eth); b.textContent=t('Скопировано!','Copied!'); }catch(e){}
    }); }
  };
})();