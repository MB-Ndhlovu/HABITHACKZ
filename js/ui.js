/* HealthQuest — Shared UI helpers */
function renderTopbar(title, user) {
  const streak = HQ.getStreak(user.id);
  return `
    <div class="topbar">
      <h1>${title}</h1>
      <div class="streak-badge" title="Daily streak">🔥 ${streak.count}</div>
    </div>
  `;
}

function renderBottomNav(active) {
  const items = [
    { id: 'dashboard', icon: '🏠', label: 'Home' },
    { id: 'quests', icon: '🎯', label: 'Quests' },
    { id: 'activity', icon: '🏃', label: 'Activity' },
    { id: 'community', icon: '👥', label: 'Community' },
    { id: 'profile', icon: '👤', label: 'Profile' }
  ];
  return `
    <nav class="bottom-nav">
      ${items.map(i => `
        <a href="${i.id}.html" class="nav-item ${i.id === active ? 'active' : ''}">
          <div class="nav-icon">${i.icon}</div>
          <div>${i.label}</div>
        </a>
      `).join('')}
    </nav>
  `;
}

function renderProfilePhoto(user, size) {
  size = size || 80;
  if (user.profilePhoto) return `<div class="profile-photo" style="width:${size}px;height:${size}px;font-size:${size/2.5}px"><img src="${user.profilePhoto}" alt=""></div>`;
  return `<div class="profile-photo" style="width:${size}px;height:${size}px;font-size:${size/2.5}px">${(user.fullName || user.username || '?')[0].toUpperCase()}</div>`;
}

function renderRankBadge(rank) {
  return `<span class="rank-badge ${HQ.rankClass(rank)}">${rank}</span>`;
}

function getPageParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

// Minimal toast helper used by quests.js (completeQuestForUser, badge unlock, etc.)
// Previously missing entirely — callers like `HQ.toast('+30 XP')` would throw.
(function ensureToastHost() {
  if (document.getElementById('hq-toast-host')) return;
  const host = document.createElement('div');
  host.id = 'hq-toast-host';
  host.style.cssText = 'position:fixed;left:50%;bottom:88px;transform:translateX(-50%);z-index:9999;display:flex;flex-direction:column;gap:8px;pointer-events:none;';
  document.addEventListener('DOMContentLoaded', () => document.body.appendChild(host));
  // In case DOMContentLoaded already fired before this script ran
  if (document.body) document.body.appendChild(host);
})();

HQ.toast = function(message, opts) {
  opts = opts || {};
  const host = document.getElementById('hq-toast-host');
  if (!host || !document.body) {
    // Last-resort fallback so the app never throws on a missing host
    console.log('[HQ.toast]', message);
    return;
  }
  const el = document.createElement('div');
  el.className = 'hq-toast';
  el.textContent = String(message);
  el.style.cssText = 'background:rgba(28,26,22,0.92);color:#f5f1e8;padding:10px 16px;border-radius:999px;font:600 14px/1.2 system-ui,sans-serif;box-shadow:0 6px 20px rgba(0,0,0,0.25);opacity:0;transition:opacity .2s ease,transform .2s ease;transform:translateY(8px);';
  host.appendChild(el);
  requestAnimationFrame(() => {
    el.style.opacity = '1';
    el.style.transform = 'translateY(0)';
  });
  setTimeout(() => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(8px)';
    setTimeout(() => el.remove(), 250);
  }, opts.duration || 2500);
};
