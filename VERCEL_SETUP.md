# Vercel auto-deploy setup (one time)

Your site auto-updates when code is pushed to GitHub `main`.

## Part A — GitHub → Vercel auto deploy

### Option 1: Vercel GitHub app (easiest, recommended)

If you imported **Ruks-Website** from GitHub on vercel.com, this is **already on**:

- Every `git push` to `main` → Vercel rebuilds your live site automatically

No extra setup needed for code deploys.

### Option 2: GitHub Actions (backup)

This repo includes `.github/workflows/deploy-vercel.yml`.

Add these **GitHub Secrets** (repo → Settings → Secrets and variables → Actions):

| Secret | Where to get it |
|--------|-----------------|
| `VERCEL_TOKEN` | [vercel.com/account/tokens](https://vercel.com/account/tokens) → Create Token |
| `VERCEL_ORG_ID` | Vercel → Project → Settings → General (Team ID / Org ID) |
| `VERCEL_PROJECT_ID` | Same page → Project ID |

> If you use Option 1, you can skip Option 2 to avoid double deploys.

---

## Part B — Admin changes on live website (Vercel Blob)

Required so product/settings edits in admin appear on the **hosted** site.

### Run this script once on your PC

```powershell
cd "F:\NEW PROJUCT\rukza-fashion-hub"
powershell -ExecutionPolicy Bypass -File setup-vercel-auto.ps1
```

You will be asked for your **Vercel token** ([create here](https://vercel.com/account/tokens)).

The script will:

1. Link your project to Vercel
2. Create **rukza-store** Blob storage
3. Connect Blob to your project (all environments)
4. Deploy production

### Or do it manually in Vercel dashboard

1. Project → **Storage** → **Blob** → Create `rukza-store`
2. **Connect to Project** → select your website
3. **Deployments** → **Redeploy**

---

## After setup

| Action | Result |
|--------|--------|
| Push code to GitHub `main` | Live site rebuilds automatically |
| Edit admin on live URL | Changes publish to all customers (with Blob connected) |

**Live admin:** `https://YOUR-SITE.vercel.app/admin/login`
