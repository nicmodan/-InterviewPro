// ============================================================
// app.js — Shared utility functions
// Import on any page that needs these helpers
// ============================================================

/**
 * Show a toast notification
 * @param {string} type  - 'success' | 'error' | 'warning' | 'info'
 * @param {string} title - Bold title line
 * @param {string} msg   - Optional secondary message
 * @param {number} dur   - Duration in ms (default 4000)
 */
export function toast(type, title, msg = '', dur = 4000) {
  const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
  const wrap = document.getElementById('toast-wrap');
  if (!wrap) return;
  const el = document.createElement('div');
  el.className = `toast t-${type}`;
  el.innerHTML = `
    <div class="t-ico">${icons[type] || 'ℹ️'}</div>
    <div class="t-body">
      <div class="t-title">${title}</div>
      ${msg ? `<div class="t-msg">${msg}</div>` : ''}
    </div>
    <button class="t-close" onclick="this.parentElement.remove()">✕</button>`;
  wrap.appendChild(el);
  setTimeout(() => { el.classList.add('leaving'); setTimeout(() => el.remove(), 350); }, dur);
  return el;
}

/**
 * Format a Firestore Timestamp to a readable string
 */
export function fmtDate(ts) {
  if (!ts?.toDate) return '—';
  return ts.toDate().toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}

/**
 * Animate a number counter up
 */
export function animCount(elId, target) {
  const el = document.getElementById(elId);
  if (!el) return;
  let cur = 0;
  const step = Math.max(1, Math.ceil(target / 20));
  const iv = setInterval(() => {
    cur = Math.min(cur + step, target);
    el.textContent = cur;
    if (cur >= target) clearInterval(iv);
  }, 40);
}

/**
 * Set a button into loading state
 */
export function setLoading(btn, loading, label = '') {
  const span = btn.querySelector('span');
  const spin = btn.querySelector('.spin');
  btn.disabled = loading;
  if (span && label) span.textContent = loading ? label : span.dataset.orig || span.textContent;
  if (span && !span.dataset.orig) span.dataset.orig = span.textContent;
  if (spin) spin.classList.toggle('hidden', !loading);
}

/**
 * Validate all [required] fields in a container
 */
export function validateContainer(container) {
  let ok = true;
  container.querySelectorAll('[required]').forEach(el => {
    el.classList.remove('err');
    if (!el.value.trim()) { el.classList.add('err'); ok = false; }
  });
  return ok;
}

/**
 * Spawn confetti particles
 */
export function spawnConfetti(containerId = 'confetti-box') {
  const box = document.getElementById(containerId);
  if (!box) return;
  const colors = ['#f59e0b','#14b8a6','#3b82f6','#22c55e','#a855f7','#ec4899','#f97316'];
  for (let i = 0; i < 80; i++) {
    const p = document.createElement('div');
    p.className = 'confetti-piece';
    const sz = Math.random() * 10 + 6;
    p.style.cssText = `left:${Math.random()*100}%;width:${sz}px;height:${sz}px;background:${colors[Math.floor(Math.random()*colors.length)]};opacity:${Math.random()*.8+.2};animation-duration:${Math.random()*2+2}s;animation-delay:${Math.random()*1}s;transform:rotate(${Math.random()*360}deg);border-radius:${Math.random()>.5?'50%':'2px'}`;
    box.appendChild(p);
  }
  setTimeout(() => { box.innerHTML = ''; }, 5500);
}

/**
 * Close a modal overlay
 */
export function closeModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add('hidden');
}

/**
 * Handle background click to close modal
 */
export function bgClose(e, id) {
  if (e.target.classList.contains('modal-overlay')) closeModal(id);
}

/**
 * Toggle password field visibility
 */
export function toggleEye(inputId) {
  const el = document.getElementById(inputId);
  if (el) el.type = el.type === 'password' ? 'text' : 'password';
}

/**
 * Password strength checker
 * Returns { score: 0-5, label, color, pct }
 */
export function checkPasswordStrength(pw) {
  if (!pw) return { score: 0, label: '', color: '', pct: '0%' };
  let score = 0;
  if (pw.length >= 6)  score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw))   score++;
  if (/[^a-zA-Z0-9]/.test(pw)) score++;
  const levels = [
    { label: 'Very weak',    color: '#ef4444', pct: '20%' },
    { label: 'Weak',         color: '#f97316', pct: '40%' },
    { label: 'Fair',         color: '#eab308', pct: '60%' },
    { label: 'Strong',       color: '#22c55e', pct: '80%' },
    { label: 'Very strong!', color: '#10b981', pct: '100%' },
  ];
  return { score, ...levels[Math.min(score - 1, 4)] || levels[0] };
}
