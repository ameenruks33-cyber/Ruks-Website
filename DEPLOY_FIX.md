# Fix live site 404 — deploy latest code to Vercel

Your code **is on GitHub** but Vercel is still showing the **old version**.
GitHub auto-deploy failed because Vercel secrets were missing.

---

## FASTEST FIX (do this now — 3 minutes)

### Option A — Deploy from Vercel website (recommended)

1. Go to **[vercel.com](https://vercel.com)** → log in
2. Open project **Ruks-Website**
3. Click **Deployments** tab
4. Click **Create Deployment** (top right)
5. Select:
   - **Git Repository:** ameenruks33-cyber/Ruks-Website
   - **Branch:** `main`
6. Click **Deploy**
7. Wait until status = **Ready** (green, ~2–4 min)
8. Open: **https://ruks-website.vercel.app/admin/marketing**

### Option B — Redeploy latest

1. Vercel → **Ruks-Website** → **Deployments**
2. Click **⋯** on any deployment → **Redeploy**
3. Turn **OFF** "Use existing Build Cache"
4. Click **Redeploy**

---

## Make sure Git is connected (one time)

1. Vercel → **Ruks-Website** → **Settings** → **Git**
2. Connected repository: **ameenruks33-cyber/Ruks-Website**
3. Production Branch: **main**
4. If not connected → click **Connect Git Repository**

After this, every `git push` to `main` auto-updates the live site.

---

## Fix GitHub Actions auto-deploy (optional)

Go to GitHub → **Ruks-Website** → **Settings** → **Secrets and variables** → **Actions**

Add these 3 secrets:

| Secret name | Where to get it |
|-------------|-----------------|
| `VERCEL_TOKEN` | [vercel.com/account/tokens](https://vercel.com/account/tokens) → Create Token |
| `VERCEL_ORG_ID` | Vercel → Settings → General → **Team ID** |
| `VERCEL_PROJECT_ID` | Vercel → Ruks-Website → Settings → General → **Project ID** |

Your project IDs (from your setup):
- **Project ID:** `prj_jVgE6KFVLpNL115R2x6DnCo7mfEE`
- **Team ID:** `team_JSFALASTsTpSVJhhfE3PLgxz`

After adding secrets, push any small change or re-run the failed workflow:
GitHub → **Actions** → **Deploy to Vercel** → **Re-run all jobs**

---

## Deploy from your PC (if you have Vercel token)

```powershell
cd "F:\NEW PROJUCT\rukza-fashion-hub"
powershell -ExecutionPolicy Bypass -File setup-vercel-auto.ps1
```

Paste your token from [vercel.com/account/tokens](https://vercel.com/account/tokens)

---

## After successful deploy, these will work

| Page | URL |
|------|-----|
| AI Marketing | https://ruks-website.vercel.app/admin/marketing |
| Home Panels | https://ruks-website.vercel.app/admin/panels |
| Admin login | https://ruks-website.vercel.app/admin/login |
| Product page | https://ruks-website.vercel.app/shop/slim-fit-dress-shirt |
