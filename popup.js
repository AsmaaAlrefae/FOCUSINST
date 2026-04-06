const toggle   = document.getElementById('focus-toggle');
const dot      = document.getElementById('status-dot');
const statusTx = document.getElementById('status-text');
const btnDark  = document.getElementById('btn-dark');
const btnLight = document.getElementById('btn-light');

chrome.storage.local.get(['focusinst_enabled','focusinst_theme'], (r) => {
  const enabled = r.focusinst_enabled !== false;
  const theme   = r.focusinst_theme || 'light';
  toggle.checked = enabled;
  updateStatus(enabled);
  applyTheme(theme, false);
});

toggle.addEventListener('change', () => {
  const enabled = toggle.checked;
  chrome.storage.local.set({ focusinst_enabled: enabled });
  updateStatus(enabled);
  sendToTab({ type: 'TOGGLE_FOCUS', enabled });
});

function updateStatus(enabled) {
  dot.className = 'dot ' + (enabled ? 'on' : 'off');
  statusTx.textContent = enabled ? 'Active — feed is hidden' : 'Paused — Instagram is normal';
}

[btnDark, btnLight].forEach(btn => {
  btn.addEventListener('click', () => {
    const theme = btn.dataset.theme;
    chrome.storage.local.set({ focusinst_theme: theme });
    applyTheme(theme, true);
  });
});

function applyTheme(theme, notify) {
  document.body.className = 'theme-' + theme;
  btnDark.classList.toggle('active',  theme === 'dark');
  btnLight.classList.toggle('active', theme === 'light');
  if (notify) sendToTab({ type: 'SET_THEME', theme });
}

function sendToTab(msg) {
  chrome.tabs.query({ active:true, currentWindow:true }, (tabs) => {
    const tab = tabs[0];
    if (tab?.url?.includes('instagram.com')) chrome.tabs.sendMessage(tab.id, msg);
  });
}
