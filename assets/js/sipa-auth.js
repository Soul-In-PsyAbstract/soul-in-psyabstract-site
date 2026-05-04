(function () {
  'use strict';

  var SUPABASE_URL = 'https://xkwuqvpjnbtwdjhvjbki.supabase.co';
  var SUPABASE_ANON = 'sb_publishable_aj4l3LSW2u7mL3aw029x2w_S-QtEq_A2cALcEa';
  var KEY_EMAIL = 'sipa_sub_email';
  var KEY_AUTH  = 'sipa_auth_ts';

  function isAuthed() {
    return !!localStorage.getItem(KEY_EMAIL);
  }

  function saveSubscriber(email, cb) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', SUPABASE_URL + '/rest/v1/users', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('apikey', SUPABASE_ANON);
    xhr.setRequestHeader('Authorization', 'Bearer ' + SUPABASE_ANON);
    xhr.setRequestHeader('Prefer', 'resolution=ignore-duplicates');
    xhr.onload = function () { cb(null); };
    xhr.onerror = function () { cb(null); };
    xhr.send(JSON.stringify({
      email: email,
      subscription_tier: 'free',
      proof_level: 0
    }));
  }

  function injectStyles() {
    var s = document.createElement('style');
    s.textContent = [
      '#sipa-gate-overlay{position:fixed;inset:0;background:rgba(5,7,9,.96);z-index:99999;display:flex;align-items:center;justify-content:center;font-family:inherit;}',
      '#sipa-gate-box{background:#0d1015;border:1px solid #1b2230;border-radius:16px;padding:36px 32px;max-width:380px;width:90%;text-align:center;color:#c7ecff;}',
      '#sipa-gate-box h2{font-size:1.2rem;margin:0 0 8px;color:#e8d5ff;}',
      '#sipa-gate-box p{font-size:.85rem;color:#7a90aa;margin:0 0 22px;line-height:1.5;}',
      '#sipa-gate-email{width:100%;box-sizing:border-box;background:#070a0f;border:1px solid #2a3040;border-radius:8px;padding:11px 14px;color:#c7ecff;font-size:.92rem;outline:none;margin-bottom:12px;}',
      '#sipa-gate-email:focus{border-color:#5b3fa6;}',
      '#sipa-gate-btn{width:100%;background:#5b3fa6;color:#fff;border:none;border-radius:8px;padding:12px;font-size:.92rem;font-weight:600;cursor:pointer;transition:background .2s;}',
      '#sipa-gate-btn:hover{background:#7048c8;}',
      '#sipa-gate-err{font-size:.78rem;color:#ff6b6b;margin-top:8px;display:none;}',
      '#sipa-gate-logo{font-size:1.6rem;margin-bottom:12px;}'
    ].join('');
    document.head.appendChild(s);
  }

  function showGate() {
    injectStyles();
    var overlay = document.createElement('div');
    overlay.id = 'sipa-gate-overlay';
    overlay.innerHTML = [
      '<div id="sipa-gate-box">',
        '<div id="sipa-gate-logo">✦</div>',
        '<h2>Soul In PsyAbstract</h2>',
        '<p>Enter your email to access this page.<br/>Free access — no spam.</p>',
        '<input id="sipa-gate-email" type="email" placeholder="your@email.com" autocomplete="email" />',
        '<button id="sipa-gate-btn">Enter →</button>',
        '<div id="sipa-gate-err">Please enter a valid email.</div>',
      '</div>'
    ].join('');
    document.body.appendChild(overlay);

    var input = document.getElementById('sipa-gate-email');
    var btn   = document.getElementById('sipa-gate-btn');
    var err   = document.getElementById('sipa-gate-err');

    function submit() {
      var email = input.value.trim().toLowerCase();
      if (!email || !email.includes('@') || !email.includes('.')) {
        err.style.display = 'block';
        input.focus();
        return;
      }
      btn.textContent = '...';
      btn.disabled = true;
      saveSubscriber(email, function () {
        localStorage.setItem(KEY_EMAIL, email);
        localStorage.setItem(KEY_AUTH, Date.now());
        if (window.posthog) posthog.capture('gate_subscribe', { email: email, page: location.pathname });
        if (window.Intercom) Intercom('update', { email: email });
        overlay.remove();
      });
    }

    btn.addEventListener('click', submit);
    input.addEventListener('keydown', function (e) { if (e.key === 'Enter') submit(); });
    setTimeout(function () { input.focus(); }, 100);
  }

  function init() {
    if (isAuthed()) return;
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', showGate);
    } else {
      showGate();
    }
  }

  init();
})();
