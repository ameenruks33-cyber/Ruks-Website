# Fix deploy NOW (2 minutes)

GitHub Actions keeps failing because **no deploy secret is set**.
Your code is on GitHub — the live site is just old.

---

## Easiest fix: Vercel Deploy Hook (recommended)

### Step 1 — Create hook in Vercel

1. Open **[vercel.com/dashboard](https://vercel.com/dashboard)**
2. Click project **ruks-website**
3. **Settings** → **Git** → scroll to **Deploy Hooks**
4. Click **Create Hook**
   - Name: `github`
   - Branch: `main`
5. Click **Create** and **copy the full URL** (starts with `https://api.vercel.com/v1/integrations/deploy/...`)

### Step 2 — Add GitHub secret

1. Open **[GitHub → Ruks-Website → Settings → Secrets → Actions → New](https://github.com/ameenruks33-cyber/Ruks-Website/settings/secrets/actions/new)**
2. Name: `VERCEL_DEPLOY_HOOK` (copy exactly)
3. Value: paste the URL from Step 1
4. Click **Add secret**

### Step 3 — Re-run deploy

1. Open **[Actions → Deploy to Vercel → Run workflow](https://github.com/ameenruks33-cyber/Ruks-Website/actions/workflows/deploy-vercel.yml)**
2. Click **Run workflow** → **Run workflow**
3. Wait until green (~30 seconds)
4. Wait 2–4 min for Vercel build, then hard refresh: **Ctrl+Shift+R**

---

## Instant fix (no GitHub): deploy from Vercel

1. Vercel → **ruks-website** → **Deployments**
2. **Create Deployment** → branch **main** → **Deploy**
3. Wait until **Ready**

Also connect Git once: **Settings → Git → Connect** `ameenruks33-cyber/Ruks-Website`

After that, every `git push` to `main` auto-deploys — no GitHub Actions needed.

---

## Verify live site updated

| URL | You should see |
|-----|----------------|
| `/admin/customers` | **Add Customer** button, `Customers panel v2026-09-02` |
| `/admin/marketing` | Inline editor, `Panel version: 2026-09-02-b` |
