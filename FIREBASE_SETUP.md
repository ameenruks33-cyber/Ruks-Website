# Firebase + GitHub setup for RukZa Fashion Hub

## How it works (important)

| Service | What it stores |
|---------|----------------|
| **GitHub** (`Ruks-Website`) | Your **source code** — all project files |
| **Firebase App Hosting** | Your **live website** (built from GitHub) |
| **Firebase Secrets** | Passwords and API keys (like Vercel env vars) |
| **Vercel Blob** (current) | Admin product/settings data on live site |

You do **not** upload files manually to Firebase. GitHub holds the code; Firebase **deploys automatically** when you push to GitHub.

---

## Requirements

1. Google account
2. Firebase **Blaze** plan (pay-as-you-go — small sites often stay near $0)
   - Upgrade: [Firebase billing](https://console.firebase.google.com/project/_/overview?purchaseBillingPlan=metered)
3. GitHub repo: https://github.com/ameenruks33-cyber/Ruks-Website

---

## Step 1 — Create Firebase project

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Click **Add project**
3. Name: `RukZa Fashion Hub`
4. Project ID example: `rukza-fashion-hub` (must be unique globally)
5. Enable **Google Analytics** (optional)
6. Finish setup

---

## Step 2 — Enable App Hosting + connect GitHub

1. In Firebase Console → your project
2. Left menu → **Build** → **App Hosting**
3. Click **Get started**
4. Choose **Connect GitHub**
5. Authorize Firebase to access GitHub
6. Select repository: **ameenruks33-cyber/Ruks-Website**
7. Branch: **main**
8. Root directory: `/` (repo root is the Next.js app)
9. Backend ID: `rukza-fashion-hub`
10. Region: pick closest (e.g. `asia-south1` for UAE/India)
11. Click **Finish**

Firebase will build and deploy your site from GitHub.

---

## Step 3 — Add secrets (admin password)

In PowerShell on your PC:

```powershell
cd "F:\NEW PROJUCT\rukza-fashion-hub"
npx -y firebase-tools@latest login
npx -y firebase-tools@latest use your-firebase-project-id
npx -y firebase-tools@latest apphosting:secrets:set ADMIN_PASSWORD
npx -y firebase-tools@latest apphosting:secrets:set ADMIN_SECRET
npx -y firebase-tools@latest apphosting:secrets:set AUTH_SECRET
```

When prompted, enter:
- `ADMIN_PASSWORD` → `RukZa@Admin2026` (or your own password)
- `ADMIN_SECRET` → a long random string
- `AUTH_SECRET` → another long random string

Then redeploy from Firebase Console → App Hosting → **Roll out**.

---

## Step 4 — Set live URL

After first deploy, copy your Firebase URL (e.g. `https://rukza-fashion-hub--your-project.web.app`).

Add in Firebase App Hosting → your backend → **Environment**:
- `NEXT_PUBLIC_APP_URL` = your Firebase live URL

Or add to `apphosting.yaml` and push to GitHub.

---

## Daily workflow

```
Edit code on PC → git push to GitHub main → Firebase auto-deploys → live site updates
```

Same idea as Vercel, but hosted on Firebase.

---

## Vercel vs Firebase

You can use **one** host for production:

| Option | Keep |
|--------|------|
| **Stay on Vercel** (current, free) | Vercel + GitHub |
| **Move to Firebase** | Firebase App Hosting + GitHub |

If you move to Firebase, admin catalog storage still uses **Vercel Blob** today. For full Firebase-only setup, catalog storage must be migrated to Firebase Storage or Firestore (ask to set this up).

---

## Files added for Firebase

- `firebase.json` — App Hosting backend config
- `apphosting.yaml` — build/runtime settings and secrets
- `.firebaserc.example` — copy to `.firebaserc` with your project ID

`.firebaserc` is gitignored; each developer sets their own project ID locally.
