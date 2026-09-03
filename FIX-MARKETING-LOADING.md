# STOP the AI Marketing "Loading..." screen

## What that screen is

The blank **"Loading..."** page is the **old** marketing editor URL:

`/admin/marketing/some-post-id`

That old page waited forever for catalog data and never opened the editor.

## Fix already in code (must deploy)

Latest code:
- Never navigates to that URL
- Old URLs instantly redirect back to `/admin/marketing`
- Editor opens **inline** on the same page

You will know it worked when you see: **`Panel version: 2026-09-03-fix`**

---

## Deploy NOW (pick one — 2 minutes)

### A) Vercel dashboard (fastest)

1. Open https://vercel.com/dashboard → **ruks-website**
2. **Deployments** → **Create Deployment**
3. Branch: **main** → **Deploy**
4. Wait until **Ready**
5. Open https://ruks-website.vercel.app/admin/marketing
6. Hard refresh: **Ctrl+Shift+R**
7. Confirm you see **Panel version: 2026-09-03-fix**

### B) From your PC (paste Vercel token)

1. Get token: https://vercel.com/account/tokens
2. Run:

```powershell
cd "F:\NEW PROJUCT\rukza-fashion-hub"
powershell -ExecutionPolicy Bypass -File deploy-now.ps1 -Token "vcp_YOUR_TOKEN"
```

---

## After deploy — how to use AI Marketing

1. Open **/admin/marketing**
2. Click **Market a Product**
3. Pick a product
4. Editor opens on the **same page** (no Loading screen)
