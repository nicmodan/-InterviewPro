// ============================================================
// firebase-config.js — Shared Firebase initialisation
// ============================================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth }       from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore }  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey:            "AIzaSyBbAu27RCUnU2Bd7dUhjpHCQpaV6i_UHDg",
  authDomain:        "modanmic-ai-power-exams.firebaseapp.com",
  projectId:         "modanmic-ai-power-exams",
  storageBucket:     "modanmic-ai-power-exams.firebasestorage.app",
  messagingSenderId: "592742880638",
  appId:             "1:592742880638:web:ff788ba10a3a6e889e4f2f"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db   = getFirestore(app);
export default app;
