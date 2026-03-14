// ============================================================
//  God's Celebrities — firebase.js
//  Firebase initialisation + all Firestore / Auth operations
//
//  ⚠️  REPLACE the firebaseConfig values below with your own
//      Firebase project credentials before deploying.
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore, collection, addDoc, getDocs,
  deleteDoc, doc, updateDoc, serverTimestamp,
  query, orderBy
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import {
  getAuth, signInWithEmailAndPassword,
  signOut, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// ---------- Your Firebase Config ----------
const firebaseConfig = {
  apiKey:            "YOUR_API_KEY",
  authDomain:        "YOUR_PROJECT.firebaseapp.com",
  projectId:         "YOUR_PROJECT_ID",
  storageBucket:     "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId:             "YOUR_APP_ID"
};

// ---------- Init ----------
const app  = initializeApp(firebaseConfig);
const db   = getFirestore(app);
const auth = getAuth(app);

// ---------- Auth State ----------
onAuthStateChanged(auth, (user) => {
  window._currentUser = user;
  if (user) {
    document.getElementById('admin-status').textContent = 'Signed in: ' + user.email;
    document.getElementById('admin-signout-btn').style.display  = 'inline-block';
    document.getElementById('admin-login-form').style.display   = 'none';
    document.getElementById('admin-content').style.display      = 'block';
    loadAdminData();
  } else {
    document.getElementById('admin-status').textContent         = '';
    document.getElementById('admin-signout-btn').style.display  = 'none';
    document.getElementById('admin-login-form').style.display   = 'block';
    document.getElementById('admin-content').style.display      = 'none';
  }
});

// ---------- Login / Logout ----------
window.adminLogin = async function () {
  const email = document.getElementById('admin-email').value;
  const pass  = document.getElementById('admin-pass').value;
  try {
    await signInWithEmailAndPassword(auth, email, pass);
  } catch (e) {
    document.getElementById('login-error').textContent = 'Invalid credentials.';
  }
};

window.adminLogout = async function () {
  await signOut(auth);
  window.closeAdmin();
};

// ---------- Load Admin Data ----------
window.loadAdminData = async function () {
  try {
    // Celebrities
    const cq   = query(collection(db, 'celebrities'), orderBy('createdAt', 'desc'));
    const csnap = await getDocs(cq);
    const list  = document.getElementById('admin-celeb-list');
    list.innerHTML = '';
    csnap.forEach(d => {
      const data = d.data();
      list.innerHTML += `
        <div class="admin-item" id="item-${d.id}">
          <div class="admin-item-info">
            <strong>${data.name}</strong>
            <span>${data.title}</span>
          </div>
          <div class="admin-item-actions">
            <button onclick="editCeleb('${d.id}','${data.name}','${data.title}',
              '${data.scripture}','${encodeURIComponent(data.story)}','${data.sphere}')"
              class="btn-edit">Edit</button>
            <button onclick="deleteCeleb('${d.id}')" class="btn-del">Delete</button>
          </div>
        </div>`;
    });

    // Testimonies
    const tq    = query(collection(db, 'testimonies'), orderBy('createdAt', 'desc'));
    const tsnap = await getDocs(tq);
    const tlist = document.getElementById('admin-testimony-list');
    tlist.innerHTML = '';
    tsnap.forEach(d => {
      const data = d.data();
      tlist.innerHTML += `
        <div class="admin-item">
          <div class="admin-item-info">
            <strong>${data.name}</strong>
            <span>${data.message.substring(0, 60)}...</span>
          </div>
          <div class="admin-item-actions">
            <button onclick="deleteTestimony('${d.id}')" class="btn-del">Delete</button>
          </div>
        </div>`;
    });

    loadPublicData();
  } catch (e) {
    console.warn('Firebase not configured yet:', e.message);
  }
};

// ---------- Save / Delete Celebrity ----------
window.saveCeleb = async function () {
  const name     = document.getElementById('celeb-name').value;
  const title    = document.getElementById('celeb-title').value;
  const scripture= document.getElementById('celeb-scripture').value;
  const story    = document.getElementById('celeb-story').value;
  const sphere   = document.getElementById('celeb-sphere').value;
  const editId   = document.getElementById('celeb-edit-id').value;

  if (!name || !title) { alert('Name and title are required.'); return; }

  try {
    if (editId) {
      await updateDoc(doc(db, 'celebrities', editId), { name, title, scripture, story, sphere });
    } else {
      await addDoc(collection(db, 'celebrities'), {
        name, title, scripture, story, sphere, createdAt: serverTimestamp()
      });
    }
    window.clearCelebForm();
    loadAdminData();
  } catch (e) { alert('Error: ' + e.message); }
};

window.deleteCeleb = async function (id) {
  if (!confirm('Delete this celebrity?')) return;
  await deleteDoc(doc(db, 'celebrities', id));
  loadAdminData();
};

window.deleteTestimony = async function (id) {
  if (!confirm('Delete this testimony?')) return;
  await deleteDoc(doc(db, 'testimonies', id));
  loadAdminData();
};

// ---------- Public Testimony Submission ----------
window.submitTestimony = async function () {
  const name    = document.getElementById('t-name').value;
  const message = document.getElementById('t-message').value;
  if (!name || !message) { alert('Please fill all fields.'); return; }
  try {
    await addDoc(collection(db, 'testimonies'), {
      name, message, createdAt: serverTimestamp()
    });
    document.getElementById('t-name').value    = '';
    document.getElementById('t-message').value = '';
    const success = document.getElementById('testimony-success');
    success.style.display = 'block';
    setTimeout(() => (success.style.display = 'none'), 3000);
  } catch (e) { alert('Error: ' + e.message); }
};

// ---------- Load Public Celebrity Cards ----------
window.loadPublicData = async function () {
  try {
    const q    = query(collection(db, 'celebrities'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    const container = document.getElementById('dynamic-celebrities');
    if (snap.empty) return;
    container.innerHTML = '';
    snap.forEach(d => {
      const data = d.data();
      container.innerHTML += `
        <div class="legend-card">
          <div class="legend-crown">✦</div>
          <h3>${data.name}</h3>
          <p class="legend-role">${data.title}</p>
          <p class="legend-scripture">${data.scripture}</p>
          <p class="legend-story">${data.story}</p>
          <span class="sphere-badge">${data.sphere}</span>
        </div>`;
    });
  } catch (e) {
    // Firebase not configured — static cards remain visible
  }
};

// Load public data on page ready
document.addEventListener('DOMContentLoaded', () => {
  try { window.loadPublicData(); } catch (e) {}
});
