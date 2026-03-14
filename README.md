# God's Celebrities — Node.js + Render Deployment

## Project Structure

```
gods-celebrities/
├── server.js          ← Express server (entry point)
├── package.json       ← npm config
├── render.yaml        ← Render auto-deploy config
├── README.md
└── public/            ← All static files served by Express
    ├── index.html
    ├── styles.css
    ├── app.js
    └── firebase.js    ← ⚠️  Add your Firebase config here
```

---

## Running Locally

```bash
npm install
node server.js
# → http://localhost:3000
```

---

## Deploying to Render.com

### Option A — Auto config (render.yaml included)
Render will detect `render.yaml` automatically and configure everything.

### Option B — Manual settings in Render dashboard

| Setting           | Value              |
|-------------------|--------------------|
| **Environment**   | Node               |
| **Build Command** | `npm install`      |
| **Start Command** | `node server.js`   |
| **Publish Dir**   | *(leave blank)*    |

> ⚠️ Do NOT set a publish directory — this is a Node.js web service, not a static site.

---

## Firebase Setup

1. Go to https://console.firebase.google.com → create a project
2. Enable **Firestore Database** (test mode is fine to start)
3. Enable **Authentication → Email/Password**
4. Go to **Authentication → Users → Add user** (your admin credentials)
5. Go to **Project Settings → Your apps → Web** → copy config

Open `public/firebase.js` and replace:

```js
const firebaseConfig = {
  apiKey:            "YOUR_API_KEY",
  authDomain:        "YOUR_PROJECT.firebaseapp.com",
  projectId:         "YOUR_PROJECT_ID",
  storageBucket:     "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId:             "YOUR_APP_ID"
};
```

---

## Admin Dashboard

Press **Shift + A** on the live site to open the hidden admin panel.
Sign in with the email/password you created in Firebase Auth.
