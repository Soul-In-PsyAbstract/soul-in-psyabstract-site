;(function(){
  const mount = document.getElementById('nft-list');
  if (!mount) return;

  const NFT_LINKS = [
    "https://og.rarible.com/token/0xc9154424b823b10579895ccbe442d41b9abd96ed:19223264877338955498166477182825409596884630599573943600177382871287898046501",
    "https://og.rarible.com/token/0xc9154424b823b10579895ccbe442d41b9abd96ed:19223264877338955498166477182825409596884630599573943600177382871287898046499",
    "https://og.rarible.com/token/0xc9154424b823b10579895ccbe442d41b9abd96ed:19223264877338955498166477182825409596884630599573943600177382871287898046497",
    "https://og.rarible.com/token/0xc9154424b823b10579895ccbe442d41b9abd96ed:19223264877338955498166477182825409596884630599573943600177382871287898046496",
    "https://og.rarible.com/token/0xc9154424b823b10579895ccbe442d41b9abd96ed:19223264877338955498166477182825409596884630599573943600177382871287898046494",
    "https://og.rarible.com/token/0xc9154424b823b10579895ccbe442d41b9abd96ed:19223264877338955498166477182825409596884630599573943600177382871287898046493",
    "https://og.rarible.com/token/0xc9154424b823b10579895ccbe442d41b9abd96ed:19223264877338955498166477182825409596884630599573943600177382871287898046492",
    "https://og.rarible.com/token/0xc9154424b823b10579895ccbe442d41b9abd96ed:19223264877338955498166477182825409596884630599573943600177382871287898046491",
    "https://og.rarible.com/token/0xc9154424b823b10579895ccbe442d41b9abd96ed:19223264877338955498166477182825409596884630599573943600177382871287898046490",
    "https://og.rarible.com/token/0xc9154424b823b10579895ccbe442d41b9abd96ed:19223264877338955498166477182825409596884630599573943600177382871287898046487",
    "https://og.rarible.com/token/0xc9154424b823b10579895ccbe442d41b9abd96ed:19223264877338955498166477182825409596884630599573943600177382871287898046481",
    "https://og.rarible.com/token/0xc9154424b823b10579895ccbe442d41b9abd96ed:19223264877338955498166477182825409596884630599573943600177382871287898046480",
    "https://og.rarible.com/token/0xc9154424b823b10579895ccbe442d41b9abd96ed:19223264877338955498166477182825409596884630599573943600177382871287898046479",
    "https://og.rarible.com/token/0xc9154424b823b10579895ccbe442d41b9abd96ed:19223264877338955498166477182825409596884630599573943600177382871287898046469",
    "https://og.rarible.com/token/0xc9154424b823b10579895ccbe442d41b9abd96ed:19223264877338955498166477182825409596884630599573943600177382871287898046465",
    "https://og.rarible.com/token/polygon/0x35f8aee672cde8e5fd09c93d2bfe4ff5a9cf0756:19223264877338955498166477182825409596884630599573943600177382871287898046476",
    "https://og.rarible.com/token/polygon/0x35f8aee672cde8e5fd09c93d2bfe4ff5a9cf0756:19223264877338955498166477182825409596884630599573943600177382871287898046475",
    "https://og.rarible.com/token/polygon/0x35f8aee672cde8e5fd09c93d2bfe4ff5a9cf0756:19223264877338955498166477182825409596884630599573943600177382871287898046474",
    "https://og.rarible.com/token/polygon/0x35f8aee672cde8e5fd09c93d2bfe4ff5a9cf0756:19223264877338955498166477182825409596884630599573943600177382871287898046472",
    "https://og.rarible.com/token/polygon/0x35f8aee672cde8e5fd09c93d2bfe4ff5a9cf0756:19223264877338955498166477182825409596884630599573943600177382871287898046471",
    "https://og.rarible.com/token/polygon/0x35f8aee672cde8e5fd09c93d2bfe4ff5a9cf0756:19223264877338955498166477182825409596884630599573943600177382871287898046470"
  ];

  function getLang(){
    try{ const v=localStorage.getItem('soulinpsy_lang'); return v==='en'?'en':'ru'; }catch{ return 'ru'; }
  }

  function render(){
    const lang = getLang();
    const arts = (window.__DATA__ && window.__DATA__.ART) || [];
    mount.innerHTML = '';

    const hdr = document.createElement('div');
    hdr.className = 'nft-links-row';
    hdr.innerHTML = `
      <a class="pill" href="https://og.rarible.com/soulinpsyabstract" target="_blank" rel="noopener">Rarible Collection →</a>
      <a class="pill" href="https://zora.co/@soulinpsyabstract" target="_blank" rel="noopener">Zora →</a>
    `;
    mount.appendChild(hdr);

    const count = document.createElement('div');
    count.className = 'nft-count small';
    count.textContent = lang==='ru' ? `${NFT_LINKS.length} работ в NFT` : `${NFT_LINKS.length} works as NFT`;
    mount.appendChild(count);

    const grid = document.createElement('div');
    grid.className = 'grid-arts';

    NFT_LINKS.forEach((link, i) => {
      const art = arts[i] || {};
      const file = art.file || (String(i+1).padStart(2,'0') + '.jpg');
      const title = lang==='ru' ? (art.title_ru || `NFT #${i+1}`) : (art.title_en || `NFT #${i+1}`);
      const card = document.createElement('article');
      card.className = 'art nft-card';
      card.style.cssText = 'background:rgba(127,243,231,.06);border:1px solid rgba(127,243,231,.18);border-radius:8px;padding:1rem;display:flex;flex-direction:column;gap:.5rem;';
      card.innerHTML = `
        <div style="font-size:.7rem;color:var(--muted,#888);letter-spacing:.08em">NFT #${i+1} · ${link.includes('polygon')?'Polygon':'Ethereum'}</div>
        <div style="font-weight:600;color:var(--accent,#7ff3e7)">${title}</div>
        <a class="btn" href="${link}" target="_blank" rel="noopener" style="margin-top:.25rem;text-align:center">Rarible →</a>
      `;
      grid.appendChild(card);
    });

    mount.appendChild(grid);
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();
