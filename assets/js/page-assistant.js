// page-assistant.js - AI Chat Assistant · Soul In PsyAbstract · SESSION-47
document.addEventListener('DOMContentLoaded', function() {
  const contexts = {
    'gallery':   'UV-reactive artwork gallery, psychedelic abstract',
    'poems':     'original poems by Aelin AquaSoul, love and soul themes',
    'songs':     'original song lyrics by Aelin AquaSoul',
    'manifest':  'artist manifest, philosophy of Soul In PsyAbstract',
    'nft':       'NFT collection on Foundation, OpenSea, Rarible, Zora',
    'contacts':  'how to contact and find Aelin AquaSoul online',
    'default':   'Soul In PsyAbstract - UV-reactive psychedelic abstract art by Aelin AquaSoul'
  };

  const pageAttr = document.body.getAttribute('data-page');
  const pageContext = contexts[pageAttr] || contexts.default;

  const widget = document.createElement('div');
  widget.id = 'page-assistant-widget';
  widget.style.cssText = 'position:fixed;bottom:20px;right:20px;z-index:1000;font-family:-apple-system,BlinkMacSystemFont,sans-serif;';

  const toggleBtn = document.createElement('button');
  toggleBtn.innerHTML = '💬';
  toggleBtn.style.cssText = 'width:50px;height:50px;border-radius:50%;background:#7ff3e7;color:#0a0d10;border:none;font-size:22px;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,.4);transition:transform .2s;';
  toggleBtn.onmouseover = () => toggleBtn.style.transform = 'scale(1.1)';
  toggleBtn.onmouseout  = () => toggleBtn.style.transform = 'scale(1)';

  const chatBox = document.createElement('div');
  chatBox.style.cssText = 'position:absolute;bottom:60px;right:0;width:300px;background:#0a0d10;border:1px solid #7ff3e7;border-radius:8px;padding:14px;display:none;box-shadow:0 8px 24px rgba(0,0,0,.6);';

  const hdr = document.createElement('div');
  hdr.textContent = '✦ SIPA Assistant';
  hdr.style.cssText = 'color:#7ff3e7;font-weight:700;margin-bottom:10px;font-size:13px;letter-spacing:.05em;';

  const msgs = document.createElement('div');
  msgs.style.cssText = 'height:180px;overflow-y:auto;margin-bottom:10px;padding:8px;background:rgba(255,255,255,.04);border-radius:4px;font-size:13px;color:#ccc;line-height:1.5;';

  const ta = document.createElement('textarea');
  ta.placeholder = 'Ask about this page...';
  ta.style.cssText = 'width:100%;height:56px;padding:8px;background:rgba(255,255,255,.07);border:1px solid rgba(127,243,231,.4);border-radius:4px;color:#fff;font-size:13px;resize:none;margin-bottom:8px;box-sizing:border-box;';

  const btn = document.createElement('button');
  btn.textContent = 'Send';
  btn.style.cssText = 'width:100%;padding:8px;background:#7ff3e7;color:#0a0d10;border:none;border-radius:4px;font-weight:700;cursor:pointer;font-size:13px;';

  chatBox.append(hdr, msgs, ta, btn);
  widget.append(toggleBtn, chatBox);
  document.body.appendChild(widget);

  toggleBtn.addEventListener('click', () => {
    const open = chatBox.style.display === 'block';
    chatBox.style.display = open ? 'none' : 'block';
    if (!open) ta.focus();
  });

  function addMsg(text, isUser) {
    const m = document.createElement('div');
    m.textContent = text;
    m.style.cssText = 'margin-bottom:7px;padding:5px 8px;border-radius:4px;background:' +
      (isUser ? 'rgba(127,243,231,.15);border-left:3px solid #7ff3e7;' : 'rgba(255,255,255,.07);');
    msgs.appendChild(m);
    msgs.scrollTop = msgs.scrollHeight;
  }

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
        body: JSON.stringify({message: msg, page_context: pageContext})
      });
      if (!r.ok) throw new Error();
      const d = await r.json();
      addMsg(d.reply || 'Thank you!');
    } catch {
      addMsg('Coming soon ✦');
    } finally {
      btn.disabled = false;
      btn.textContent = 'Send';
    }
  }

  btn.addEventListener('click', send);
  ta.addEventListener('keydown', e => { if (e.key==='Enter' && !e.shiftKey){ e.preventDefault(); send(); }});
  document.addEventListener('click', e => { if (!widget.contains(e.target)) chatBox.style.display='none'; });
  setTimeout(() => addMsg('Hi ✦ Ask me about ' + (pageAttr||'this page') + ' →'), 400);
});
