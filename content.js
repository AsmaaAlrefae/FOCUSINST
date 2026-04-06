(function () {
  'use strict';

  const STORAGE_KEY = 'focusinst_items';
  const ENABLED_KEY = 'focusinst_enabled';
  const THEME_KEY   = 'focusinst_theme';

  let isEnabled = true;
  let theme     = 'light';
  let items     = [];

  chrome.storage.local.get([STORAGE_KEY, ENABLED_KEY, THEME_KEY], (result) => {
    isEnabled = result[ENABLED_KEY] !== false;
    theme     = result[THEME_KEY] || 'light';
    items     = result[STORAGE_KEY] || [];
    init();
  });

  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === 'TOGGLE_FOCUS') { isEnabled = msg.enabled; applyFocusMode(); }
    if (msg.type === 'SET_THEME')    { theme = msg.theme; applyThemeToAll(); }
  });

  function init() { applyFocusMode(); observeDOM(); }

  function applyFocusMode() {
    if (isEnabled) {
      hideNoiseElements();
      injectHomeOverlay();
      injectChecklist();
    } else {
      removeAllInjected();
      unhideAll();
    }
  }

  function removeAllInjected() {
    ['focusinst-home-overlay','focusinst-panel'].forEach(id => document.getElementById(id)?.remove());
  }

  function unhideAll() {
    document.querySelectorAll('[data-fi-hidden]').forEach(el => {
      el.style.removeProperty('display');
      el.removeAttribute('data-fi-hidden');
    });
  }

  function themeClass() { return theme === 'light' ? 'fi-light' : 'fi-dark'; }

  function applyThemeToAll() {
    ['focusinst-home-overlay','focusinst-panel'].forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      el.classList.remove('fi-dark','fi-light');
      el.classList.add(themeClass());
    });
  }

  /* ── Hide noise ── */
  function hideNoiseElements() {
    if (!isEnabled) return;
    document.querySelectorAll('div[role="feed"]').forEach(hide);
    document.querySelectorAll('[aria-label="Stories"],[aria-label="Story tray"]').forEach(hide);

    document.querySelectorAll('*').forEach(el => {
      if (isHidden(el)) return;
      const text = el.innerText?.trim();
      if (['Suggested for you','Suggested accounts','Who to follow'].includes(text)) {
        let t = el;
        for (let i=0;i<6;i++) {
          if (!t.parentElement) break;
          t = t.parentElement;
          if (['section','article','aside'].includes(t.tagName?.toLowerCase())) break;
        }
        hide(t);
      }
    });

    document.querySelectorAll('aside').forEach(a => {
      if (a.querySelector('a[href*="suggested"]') || a.innerText?.includes('Suggested')) hide(a);
    });

    document.querySelectorAll('span').forEach(s => {
      if (s.innerText?.trim() === 'Sponsored') {
        let t = s;
        for (let i=0;i<8;i++) {
          if (!t.parentElement) break;
          t = t.parentElement;
          if (t.tagName?.toLowerCase() === 'article') break;
        }
        hide(t);
      }
    });
  }

  function hide(el) {
    if (!el || isHidden(el)) return;
    el.style.setProperty('display','none','important');
    el.setAttribute('data-fi-hidden','1');
  }

  function isHidden(el) { return el?.getAttribute?.('data-fi-hidden') === '1'; }
  function isHomePage()  { return location.pathname === '/' || location.pathname === ''; }

  /* ── Home overlay ── */
  function injectHomeOverlay() {
    if (!isEnabled || !isHomePage() || document.getElementById('focusinst-home-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'focusinst-home-overlay';
    overlay.className = themeClass();
    overlay.innerHTML = `
      <div id="fi-icon-ring">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.8">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
          <circle cx="12" cy="12" r="5"/>
          <circle cx="17.5" cy="6.5" r="1.2" fill="white" stroke="none"/>
        </svg>
      </div>
      <div class="fi-logo">FocusInst</div>
      <h1>What are you looking for?</h1>
      <p>Search without the scroll.</p>
      <div id="fi-search-form">
        <input id="fi-search-input" type="text" placeholder="Search Instagram…" autocomplete="off"/>
        <button id="fi-search-btn">Search</button>
      </div>
      <div id="fi-quick-links">
        <a class="fi-quick-link" href="/direct/inbox/">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          Messages
        </a>
        <a class="fi-quick-link" href="/explore/">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          Explore
        </a>
        <a class="fi-quick-link" href="/notifications/">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
          Notifications
        </a>
        <a class="fi-quick-link" href="/accounts/edit/">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          Profile
        </a>
      </div>
    `;
    document.body.appendChild(overlay);

    const input = document.getElementById('fi-search-input');
    const doSearch = () => {
      const q = input.value.trim();
      if (q) window.location.href = `/search/?q=${encodeURIComponent(q)}`;
    };
    document.getElementById('fi-search-btn').addEventListener('click', doSearch);
    input.addEventListener('keydown', e => { if (e.key === 'Enter') doSearch(); });
    setTimeout(() => input?.focus(), 150);
  }

  /* ── Back button ── */
  /* ── Checklist ── */
  function injectChecklist() {
    if (!isEnabled || document.getElementById('focusinst-panel')) return;

    const panel = document.createElement('div');
    panel.id = 'focusinst-panel';
    panel.className = themeClass();
    panel.innerHTML = `
      <div id="focusinst-header">
        <div id="focusinst-header-icon">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5">
            <polyline points="9 11 12 14 22 4"/>
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
          </svg>
        </div>
        <div id="focusinst-header-title">
          <h3>My List</h3>
          <p>${items.length} item${items.length!==1?'s':''}</p>
        </div>
        <button id="focusinst-toggle-btn" title="Minimize">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </button>
      </div>
      <div id="focusinst-body">${renderItems()}</div>
      <div id="focusinst-add-area">
        <input id="focusinst-input" type="text" placeholder="Add to your list…"/>
        <button id="focusinst-add-btn">+</button>
      </div>
    `;
    document.body.appendChild(panel);

    let collapsed = false;
    document.getElementById('focusinst-toggle-btn').addEventListener('click', () => {
      collapsed = !collapsed;
      panel.classList.toggle('collapsed', collapsed);
      document.getElementById('focusinst-toggle-btn').innerHTML = collapsed
        ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>`
        : `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/></svg>`;
    });

    const input  = document.getElementById('focusinst-input');
    const addBtn = document.getElementById('focusinst-add-btn');
    const addItem = () => {
      const text = input.value.trim();
      if (!text) return;
      items.push({ text, checked: false });
      saveItems(); refreshPanel(); input.value = ''; input.focus();
    };
    addBtn.addEventListener('click', addItem);
    input.addEventListener('keydown', e => { if (e.key==='Enter') addItem(); });
    bindItemEvents(panel);
  }

  function renderItems() {
    if (!items.length) return `<div id="focusinst-empty"><span>📋</span>Your list is empty.<br>Add things to check here.</div>`;
    return items.map((item,i) => `
      <div class="fi-item">
        <div class="fi-checkbox${item.checked?' checked':''}" data-action="check" data-index="${i}"></div>
        <span class="fi-label${item.checked?' checked':''}">${escapeHTML(item.text)}</span>
        <button class="fi-delete" data-action="delete" data-index="${i}" title="Remove">×</button>
      </div>
    `).join('');
  }

  function refreshPanel() {
    const body = document.getElementById('focusinst-body');
    if (body) body.innerHTML = renderItems();
    const sub = document.querySelector('#focusinst-header-title p');
    if (sub) sub.textContent = `${items.length} item${items.length!==1?'s':''}`;
    const panel = document.getElementById('focusinst-panel');
    if (panel) bindItemEvents(panel);
  }

  function bindItemEvents(panel) {
    panel.querySelectorAll('[data-action="check"]').forEach(btn => {
      btn.addEventListener('click', () => {
        items[+btn.dataset.index].checked = !items[+btn.dataset.index].checked;
        saveItems(); refreshPanel();
      });
    });
    panel.querySelectorAll('[data-action="delete"]').forEach(btn => {
      btn.addEventListener('click', () => {
        items.splice(+btn.dataset.index, 1);
        saveItems(); refreshPanel();
      });
    });
  }

  function saveItems() { chrome.storage.local.set({ [STORAGE_KEY]: items }); }

  function escapeHTML(str) { const d=document.createElement('div'); d.textContent=str; return d.innerHTML; }

  /* ── DOM observer + SPA nav ── */
  function observeDOM() {
    const observer = new MutationObserver(() => {
      if (!isEnabled) return;
      hideNoiseElements();
      const onHome = isHomePage();
      if (onHome && !document.getElementById('focusinst-home-overlay')) injectHomeOverlay();
      if (!onHome) document.getElementById('focusinst-home-overlay')?.remove();
      if (!document.getElementById('focusinst-panel')) injectChecklist();
    });
    observer.observe(document.body, { childList:true, subtree:true });

    let lastPath = location.pathname;
    setInterval(() => {
      if (location.pathname !== lastPath) {
        lastPath = location.pathname;
        setTimeout(() => {
          if (!isEnabled) return;
          hideNoiseElements();
          const onHome = isHomePage();
          if (onHome) { injectHomeOverlay(); }
          else { document.getElementById('focusinst-home-overlay')?.remove(); }
        }, 400);
      }
    }, 300);
  }
})();
