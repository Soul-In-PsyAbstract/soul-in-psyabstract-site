// page-assistant.js - AI Chat Assistant · Soul In PsyAbstract · V2.0 · session memory
document.addEventListener('DOMContentLoaded', function() {
  const contexts = {
    'gallery':  'UV-reactive artwork gallery, psychedelic abstract',
    'poems':    'original poems by Aelin AquaSoul, love and soul themes',
    'songs':    'original song lyrics by Aelin AquaSoul',
    'manifest': 'artist manifest, philosophy of Soul In PsyAbstract',
    'nft':      'NFT collection on Rarible, Zora',
    'contacts': 'how to contact and find Aelin AquaSoul online',
    'default':  'Soul In PsyAbstract - UV-reactive psychedelic abstract art by Aelin AquaSoul'
  };

  const pageAttr = document.body.getAttribute('data-page');
  const pageContext = contexts[pageAttr] || contexts.default;

  // Session persistence
  function getSessionId() {
    let sid = localStorage.getItem('sipa_session_id');
    if (!sid) { sid = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2); localStorage.setItem('sipa_session_id', sid); }
    return sid;
  }

  const widget = document.createElement('div');
  widget.id = 'page-assistant-widget';
  widget.style.cssText = 'position:fixed;bottom:80px;right:16px;z-index:9999;font-family:-apple-system,BlinkMacSystemFont,sans-serif;';

  const toggleBtn = document.createElement('button');
  toggleBtn.innerHTML = '💬<span style="display:block;font-size:9px;font-weight:700;letter-spacing:.06em;margin-top:1px">SIPA</span>';
  toggleBtn.style.cssText = 'width:60px;height:60px;border-radius:50%;background:#7ff3e7;color:#0a0d10;border:none;font-size:20px;cursor:pointer;box-shadow:0 4px 16px rgba(127,243,231,.5);transition:transform .2s;line-height:1;display:flex;flex-direction:column;align-items:center;justify-content:center;';
  toggleBtn.onmouseover = () => toggleBtn.style.transform = 'scale(1.1)';
  toggleBtn.onmouseout  = () => toggleBtn.style.transform = 'scale(1)';

  const chatBox = document.createElement('div');
  chatBox.style.cssText = 'position:absolute;bottom:68px;right:0;width:300px;background:#0a0d10;border:1px solid #7ff3e7;border-radius:8px;padding:14px;display:none;box-shadow:0 8px 24px rgba(0,0,0,.6);';

  const hdrRow = document.createElement('div');
  hdrRow.style.cssText = 'display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;';
  const hdr = document.createElement('span');
  hdr.textContent = '✦ SIPA Assistant';
  hdr.style.cssText = 'color:#7ff3e7;font-weight:700;font-size:13px;letter-spacing:.05em;';
  const newBtn = document.createElement('button');
  newBtn.textContent = 'New topic';
  newBtn.title = 'Start new topic (clear context)';
  newBtn.style.cssText = 'font-size:10px;padding:2px 6px;background:rgba(127,243,231,.1);border:1px solid rgba(127,243,231,.3);border-radius:3px;color:#7ff3e7;cursor:pointer;';
  hdrRow.append(hdr, newBtn);

  const msgs = document.createElement('div');
  msgs.style.cssText = 'height:180px;overflow-y:auto;margin-bottom:10px;padding:8px;background:rgba(255,255,255,.04);border-radius:4px;font-size:13px;color:#ccc;line-height:1.5;';

  const ta = document.createElement('textarea');
  ta.placeholder = 'Ask about this page...';
  ta.style.cssText = 'width:100%;height:56px;padding:8px;background:rgba(255,255,255,.07);border:1px solid rgba(127,243,231,.4);border-radius:4px;color:#fff;font-size:13px;resize:none;margin-bottom:8px;box-sizing:border-box;';

  const btn = document.createElement('button');
  btn.textContent = 'Send';
  btn.style.cssText = 'width:100%;padding:8px;background:#7ff3e7;color:#0a0d10;border:none;border-radius:4px;font-weight:700;cursor:pointer;font-size:13px;';

  chatBox.append(hdrRow, msgs, ta, btn);
  widget.append(toggleBtn, chatBox);
  document.body.appendChild(widget);

  toggleBtn.addEventListener('click', () => {
    const open = chatBox.style.display === 'block';
    chatBox.style.display = open ? 'none' : 'block';
    if (!open) ta.focus();
  });

  newBtn.addEventListener('click', () => {
    localStorage.removeItem('sipa_session_id');
    msgs.innerHTML = '';
    addMsg('New topic started ✦');
  });

  function addMsg(text, isUser) {
    const m = document.createElement('div');
    m.textContent = text;
    m.style.cssText = 'margin-bottom:7px;padding:5px 8px;border-radius:4px;background:' +
      (isUser ? 'rgba(127,243,231,.15);border-left:3px solid #7ff3e7;' : 'rgba(255,255,255,.07);');
    msgs.appendChild(m);
    msgs.scrollTop = msgs.scrollHeight;
  }

  let pendingNewTopic = false;

  async function send() {
    const msg = ta.value.trim();
    if (!msg) return;
    addMsg(msg, true);
    ta.value = '';
    btn.disabled = true;
    btn.textContent = '...';
    try {
      const r = await fetch('/api/chat', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
          message: msg,
          page: pageAttr,
          page_context: pageContext,
          session_id: getSessionId(),
          new_topic: pendingNewTopic
        })
      });
      pendingNewTopic = false;
      if (!r.ok) throw new Error('HTTP ' + r.status);
      const d = await r.json();
      if (d.session_id) localStorage.setItem('sipa_session_id', d.session_id);
      if (d.l2) activateL2(d.session_id);
      addMsg(d.reply || 'Thank you!');
    } catch(e) {
      addMsg('Coming soon ✦');
    } finally {
      btn.disabled = false;
      btn.textContent = 'Send';
    }
  }

  // L2 Architect mode — submit panel
  function activateL2(sid) {
    if (document.getElementById('sipa-l2-panel')) return;
    const panel = document.createElement('div');
    panel.id = 'sipa-l2-panel';
    panel.style.cssText = 'margin-top:10px;padding:10px;background:rgba(127,243,231,.07);border:1px solid rgba(127,243,231,.3);border-radius:6px;';
    panel.innerHTML = '<div style="color:#7ff3e7;font-size:11px;font-weight:700;letter-spacing:.06em;margin-bottom:8px;">✦ АРХИТЕКТОР · L2</div>';
    const types = ['note','report','audit','protocol','raw'];
    const sel = document.createElement('select');
    sel.style.cssText = 'width:100%;background:rgba(0,0,0,.4);border:1px solid rgba(127,243,231,.3);color:#e8f2ff;border-radius:4px;padding:4px 6px;font-size:12px;margin-bottom:6px;';
    types.forEach(t => { const o = document.createElement('option'); o.value=t; o.textContent=t.toUpperCase(); sel.appendChild(o); });
    const txt = document.createElement('textarea');
    txt.placeholder = 'Заметка / репорт / аудит...';
    txt.style.cssText = 'width:100%;height:60px;background:rgba(0,0,0,.3);border:1px solid rgba(127,243,231,.3);color:#fff;font-size:12px;border-radius:4px;padding:6px;resize:none;box-sizing:border-box;margin-bottom:6px;';
    const tagIn = document.createElement('input');
    tagIn.placeholder = 'TAG (необязательно)';
    tagIn.style.cssText = 'width:100%;background:rgba(0,0,0,.3);border:1px solid rgba(127,243,231,.2);color:#a6b4c6;font-size:11px;border-radius:4px;padding:4px 6px;box-sizing:border-box;margin-bottom:6px;';
    const sbtn = document.createElement('button');
    sbtn.textContent = 'Отправить → SIPA';
    sbtn.style.cssText = 'width:100%;padding:6px;background:rgba(127,243,231,.2);color:#7ff3e7;border:1px solid rgba(127,243,231,.4);border-radius:4px;font-size:12px;font-weight:700;cursor:pointer;';
    const status = document.createElement('div');
    status.style.cssText = 'font-size:11px;color:#7ff3e7;min-height:16px;';
    sbtn.addEventListener('click', async () => {
      if (!txt.value.trim()) return;
      sbtn.disabled = true; sbtn.textContent = '...';
      try {
        const r = await fetch('/api/report', {
          method:'POST', headers:{'Content-Type':'application/json'},
          body: JSON.stringify({ session_id: sid, type: sel.value, content: txt.value.trim(), tag: tagIn.value.trim() })
        });
        const d = await r.json();
        if (d.status === 'ACCEPTED') {
          status.textContent = '✓ Принято · sha:' + d.sha;
          txt.value = ''; tagIn.value = '';
        } else { status.textContent = '✗ ' + (d.error||'ошибка'); }
      } catch(e) { status.textContent = '✗ нет связи'; }
      sbtn.disabled = false; sbtn.textContent = 'Отправить → SIPA';
    });
    panel.append(sel, txt, tagIn, sbtn, status);
    chatBox.appendChild(panel);
  }

  btn.addEventListener('click', send);
  ta.addEventListener('keydown', e => { if (e.key==='Enter' && !e.shiftKey){ e.preventDefault(); send(); }});
  document.addEventListener('click', e => { if (!widget.contains(e.target)) chatBox.style.display='none'; });
  setTimeout(() => addMsg('Hi ✦ Ask me about ' + (pageAttr||'this page') + ' →'), 400);
});
