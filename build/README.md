# God's Celebrities — Official Website

## File Structure
```
gods-celebrities-site/
├── index.html      ← Main HTML structure
├── styles.css      ← All styling and responsive design
├── app.js          ← UI logic (admin overlay, tabs, helpers)
├── firebase.js     ← Firebase init, Firestore & Auth operations
└── README.md       ← This file
```

## Setup Instructions

### 1. Create a Firebase Project
1. Go to https://console.firebase.google.com
2. Click **Add project** and follow the steps
3. Enable **Firestore Database** (start in test mode first)
4. Enable **Authentication → Sign-in method → Email/Password**
5. Go to **Authentication → Users** and click **Add user** — enter your admin email and password

### 2. Get Your Firebase Config
1. In Firebase Console, go to **Project Settings → General**
2. Scroll to **Your apps** and click the `</>` Web icon
3. Register your app and copy the config object

### 3. Update firebase.js
Open `firebase.js` and replace the placeholder config:

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

### 4. Deploy
You can host this on:
- **Firebase Hosting** (recommended): `firebase deploy`
- **Netlify**: drag and drop the folder
- **Any web server**: upload all 4 files keeping the same folder structure

## Accessing the Admin Dashboard
Press **Shift + A** on any page to open the hidden admin dashboard.
Sign in with the admin email/password you created in Firebase Authentication.

## Admin Features
- **Celebrities tab** — Add, edit, and delete God's Celebrities (updates live on site)
- **Testimonies tab** — View and delete submitted testimonies
- **Settings tab** — Firebase config reference

## Firestore Collections
The app uses two collections:
- `celebrities` — name, title, scripture, story, sphere, createdAt
- `testimonies` — name, message, createdAt
