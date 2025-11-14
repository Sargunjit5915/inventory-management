📦 Dussat Inventory Wizard

A simple, fast, and realtime inventory management system built for Dussat Global.
Users can add items, search items, and instantly see updates made by others through Firebase Firestore realtime sync.

Live demo: Add your GitHub Pages / Vercel link here

🚀 Features
✅ Add New Inventory Items

Item name

Description

Cupboard / rack location

Quantity

Auto timestamp

Stored in Firebase Firestore

🔍 Search & Manage Items

Instant filtering by name, description, or location

Realtime updates — all users see changes immediately

Copy item JSON

Delete items

Import CSV → auto-adds to Firestore

Export CSV

☁️ Cloud Synced (No Local Storage)

All data is stored in Firebase Firestore, not localStorage —
so multiple users can collaborate seamlessly.

🌐 Hosted Online

Can be deployed using:

GitHub Pages

Vercel (recommended)

Netlify

🛠️ Tech Stack

React + Vite

Firebase Firestore (Realtime Database)

TailwindCSS

GitHub Pages / Vercel

CSV Tools for import/export

📂 Project Structure
src/
 ├── DussatInventory.jsx   # Main UI and logic
 ├── firebase.js           # Firebase setup and Firestore helpers
 ├── index.css             # Tailwind styles
 ├── main.jsx              # React entry point
public/
.env                       # Firebase environment variables (not committed)
vite.config.js

🔧 Setup Instructions
1. Install dependencies
npm install

2. Add Firebase environment variables

Create .env in the project root:

VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id


⚠️ Never commit .env — keep Firebase secrets safe.

3. Run locally
npm run dev

4. Build for production
npm run build

☁️ Deployment (GitHub Pages)

Add this to vite.config.js:

export default defineConfig({
  base: "/YOUR_REPO_NAME/",
  plugins: [react()],
});


Install gh-pages

npm install -D gh-pages


Add to package.json:

"predeploy": "npm run build",
"deploy": "gh-pages -d dist"


Deploy:

npm run deploy

🔥 Deployment (Vercel Recommended)

Push repo to GitHub

Go to https://vercel.com
 → “New Project”

Import the repository

Add all VITE_FIREBASE_... environment variables

Deploy

Instant updates. Free. No base path issues.

🛡️ Firestore Security Rules (dev mode)
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /items/{id} {
      allow read, write: if true;
    }
  }
}


⚠️ For production, enable Firebase Auth and secure rules.

🙌 Contributors

Dussat Global Engineering

📄 License

Internal project — not licensed for public redistribution unless permitted by Dussat Global.

