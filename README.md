# SparkChat Web App

A WhatsApp/Messenger-style chat app that runs entirely in the browser.
Built with **React + Vite + Supabase**.

## Architecture

```
Landing Page (/)
       │
  Sign In / Register (/auth)
       │  ← Authentication wall
       ▼
  App (/app)
  ├── Chats      (conversation list + chat window)
  ├── Friends    (add by Spark Code, accept requests)
  └── Profile    (edit username, avatar, your code)
```

## Project Structure

```
sparkchat-web/
├── index.html
├── vite.config.js
├── package.json
├── .env.example
└── src/
    ├── main.jsx               ← App entry, routing
    ├── index.css              ← Global styles / design tokens
    ├── logo.png
    ├── lib/
    │   └── supabase.js        ← Supabase client
    ├── context/
    │   └── AuthContext.jsx    ← Session, profile, auth methods
    ├── hooks/
    │   ├── useMessages.js     ← Realtime messages
    │   ├── useConversations.js
    │   └── useFriends.js
    ├── utils/
    │   └── dateUtils.js
    ├── components/
    │   ├── UI.jsx             ← Avatar, Btn, Input, Spinner, Toast
    │   └── chat/
    │       ├── Sidebar.jsx
    │       ├── ConversationList.jsx
    │       ├── ChatWindow.jsx
    │       ├── MessageBubble.jsx
    │       ├── FriendsPanel.jsx
    │       └── ProfilePanel.jsx
    └── pages/
        ├── LandingPage.jsx
        ├── AuthPage.jsx
        └── AppPage.jsx
```

---

## 1. Supabase Setup

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor → New query**
3. Paste and run the entire contents of:
   ```
   chat-app/supabase/migrations/001_initial_schema.sql
   ```
   (from the React Native project delivered earlier)
4. Note your credentials under **Settings → API**:
   - `Project URL`
   - `anon public` key

---

## 2. Google OAuth (optional)

1. [console.cloud.google.com](https://console.cloud.google.com) → New project
2. **APIs & Services → OAuth consent screen** → External → fill app name
3. **Credentials → Create OAuth 2.0 Client ID** (Web application)
4. Authorized redirect URIs:
   ```
   https://YOUR_PROJECT_ID.supabase.co/auth/v1/callback
   ```
5. Copy **Client ID** + **Client Secret**
6. Supabase Dashboard → **Authentication → Providers → Google** → enable + paste

---

## 3. Run Locally

```bash
cd sparkchat-web

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env and add your Supabase URL and anon key

# Start dev server
npm run dev
# → http://localhost:5173
```

---

## 4. Deploy to GitHub Pages

**Step 1 — Update `vite.config.js`** to match your repo name:
```js
base: '/YOUR_REPO_NAME/',
```

**Step 2 — Push to GitHub:**
```bash
git init
git add .
git commit -m "Initial SparkChat commit"
git remote add origin https://github.com/USERNAME/REPO_NAME.git
git push -u origin main
```

**Step 3 — Deploy:**
```bash
npm run deploy
```

**Step 4 — Enable Pages on GitHub:**
Go to repo → **Settings → Pages** → Source: `gh-pages` branch → Save

Your app will be live at:
```
https://USERNAME.github.io/REPO_NAME/
```

> The app uses `HashRouter` (`/#/`, `/#/auth`, `/#/app`) so GitHub Pages
> works without any server-side redirect config.

---

## 5. Environment Variables

For GitHub Pages, you can either:

**A) Hardcode in vite.config.js** (less secure, fine for public anon key):
```js
define: {
  'import.meta.env.VITE_SUPABASE_URL':      JSON.stringify('https://...'),
  'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify('eyJ...'),
}
```

**B) Use GitHub Actions secrets** (recommended):

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm install
      - run: npm run build
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
      - uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

Then add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as secrets in
**GitHub repo → Settings → Secrets and variables → Actions**.

---

## Security Notes

- The Supabase `anon` key is safe to expose publicly — it cannot bypass RLS
- All data access is controlled by Row Level Security policies in Supabase
- Never expose your Supabase `service_role` key in frontend code
