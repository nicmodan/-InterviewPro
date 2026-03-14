# God's Celebrities — Node.js Server

## Project Structure

```
gods-celebrities/
├── server.js          ← Express server (serves the build folder)
├── package.json       ← Dependencies & npm scripts
├── build/             ← Static website files (served by the server)
│   ├── index.html
│   ├── styles.css
│   ├── app.js
│   └── firebase.js
└── README.md
```

---

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Configure Firebase
Open `build/firebase.js` and replace the placeholder config with your own:
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

### 3. Start the server
```bash
npm start
```
Then open → **http://localhost:3000**

### 4. Development mode (auto-restart on file changes)
```bash
npm run dev
```

---

## Firebase Setup

1. Go to **https://console.firebase.google.com** → Create a project
2. Enable **Firestore Database** (start in test mode)
3. Enable **Authentication → Sign-in method → Email/Password**
4. Go to **Authentication → Users → Add user** — set your admin email & password
5. Go to **Project Settings → General → Your apps** → register a Web app → copy the config

---

## Admin Dashboard

Press **Shift + A** anywhere on the website to open the hidden admin dashboard.
Sign in with the admin email/password you created in Firebase Auth.

### Admin features:
- **Celebrities** — Add, edit, delete legends (appear live on the site)
- **Testimonies** — View and moderate submitted testimonies
- **Settings** — Firebase config reference

---

## Deploying to a Server (VPS / Cloud)

```bash
# On your server
git clone <your-repo> gods-celebrities
cd gods-celebrities
npm install
npm start

# To keep it running permanently, use PM2:
npm install -g pm2
pm2 start server.js --name "gods-celebrities"
pm2 save
pm2 startup
```

The server runs on port **3000** by default.  
To use a different port: `PORT=8080 npm start`

---

## Firestore Collections

| Collection    | Fields                                          |
|---------------|-------------------------------------------------|
| `celebrities` | name, title, scripture, story, sphere, createdAt |
| `testimonies` | name, message, createdAt                        |
