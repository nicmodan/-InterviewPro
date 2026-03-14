// ============================================================
//  God's Celebrities — app.js
//  Handles: Admin overlay, tab switching, toast, public UI
//  Firebase logic lives in firebase.js (ES module)
// ============================================================

// ---------- Admin Overlay ----------
document.addEventListener('keydown', function (e) {
  if (e.shiftKey && e.key === 'A') {
    e.preventDefault();
    toggleAdmin();
  }
  if (e.key === 'Escape') closeAdmin();
});

function toggleAdmin() {
  const overlay = document.getElementById('admin-overlay');
  const isOpen = overlay.style.display === 'flex';
  overlay.style.display = isOpen ? 'none' : 'flex';
  if (!isOpen) overlay.style.flexDirection = 'column';
}

function closeAdmin() {
  document.getElementById('admin-overlay').style.display = 'none';
}

// ---------- Tab Switching ----------
function switchTab(tab) {
  const tabs = document.querySelectorAll('.admin-tab');
  const panels = ['celebrities', 'testimonies-admin', 'settings'];
  tabs.forEach((t, i) => t.classList.toggle('active', panels[i] === tab));
  document.querySelectorAll('.admin-panel').forEach(p => p.classList.remove('active'));
  document.getElementById('panel-' + tab).classList.add('active');
}

// ---------- Celebrity Form Helpers ----------
function clearCelebForm() {
  ['celeb-edit-id', 'celeb-name', 'celeb-title', 'celeb-scripture', 'celeb-story'].forEach(
    id => (document.getElementById(id).value = '')
  );
  document.getElementById('celeb-sphere').value = 'Ministry';
  document.getElementById('celeb-form-title').textContent = 'Add New Celebrity';
}

function editCeleb(id, name, title, scripture, story, sphere) {
  document.getElementById('celeb-edit-id').value = id;
  document.getElementById('celeb-name').value = name;
  document.getElementById('celeb-title').value = title;
  document.getElementById('celeb-scripture').value = scripture;
  document.getElementById('celeb-story').value = decodeURIComponent(story);
  document.getElementById('celeb-sphere').value = sphere;
  document.getElementById('celeb-form-title').textContent = 'Edit Celebrity';
  document.getElementById('admin-tabs').scrollIntoView({ behavior: 'smooth' });
}

// ---------- Toast Hint ----------
setTimeout(() => {
  const toast = document.getElementById('admin-toast');
  toast.style.display = 'block';
  setTimeout(() => (toast.style.display = 'none'), 4000);
}, 3000);

// Expose helpers to global scope (called from inline onclick attributes)
window.toggleAdmin   = toggleAdmin;
window.closeAdmin    = closeAdmin;
window.switchTab     = switchTab;
window.clearCelebForm = clearCelebForm;
window.editCeleb     = editCeleb;
