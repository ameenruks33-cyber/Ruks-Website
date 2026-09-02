# Auto-deploy: Cursor → GitHub → Vercel

Every code change can go live automatically in 3 steps (one-time setup + daily use).

## One-time setup (10 minutes)

### 1. Vercel ↔ GitHub (main deploy path)

1. [vercel.com/dashboard](https://vercel.com/dashboard) → **ruks-website**
2. **Settings** → **Git**
3. Connect: **ameenruks33-cyber/Ruks-Website**
4. Production branch: **main**

After this, every push to `main` triggers a Vercel build.

### 2. GitHub Actions secrets (backup if Vercel Git fails)

Open: [github.com/ameenruks33-cyber/Ruks-Website/settings/secrets/actions](https://github.com/ameenruks33-cyber/Ruks-Website/settings/secrets/actions)

| Secret | Value |
|--------|--------|
| `VERCEL_TOKEN` | [vercel.com/account/tokens](https://vercel.com/account/tokens) → Create → **Full Account** |
| `VERCEL_ORG_ID` | `team_JSFALASTsTpSVJhhfE3PLgxz` |
| `VERCEL_PROJECT_ID` | `prj_jVgE6KFVLpNL115R2x6DnCo7mfEE` |

Or run the guided script:

```powershell
powershell -ExecutionPolicy Bypass -File setup-auto-deploy.ps1
```

---

## Daily use (after Cursor edits)

### Option A — Ask Cursor

Say: **"publish to GitHub"** or **"push and deploy"**

Cursor will run `publish.ps1` automatically.

### Option B — Run script yourself

```powershell
cd "F:\NEW PROJUCT\rukza-fashion-hub"
powershell -ExecutionPolicy Bypass -File publish.ps1 -Message "Fix marketing page loading"
```

---

## What happens

```
Cursor saves files
    → publish.ps1 commits + pushes to GitHub main
    → Vercel detects push (or GitHub Actions deploys)
    → Live site updates in 2-4 minutes
```

**Live site:** https://ruks-website.vercel.app

---

## Check deploy status

| Where | URL |
|-------|-----|
| Vercel builds | [vercel.com](https://vercel.com) → ruks-website → Deployments |
| GitHub Actions | [Actions tab](https://github.com/ameenruks33-cyber/Ruks-Website/actions) |
| Confirm new code | Admin Marketing shows `Panel version: 2026-09-02-b` |

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Push fails | Run `push-to-github.ps1` — wrong GitHub login |
| Vercel not building | Reconnect Git in Vercel Settings |
| Build canceled (unverified commit) | `publish.ps1` uses verified email — use that script |
| Old site still showing | Hard refresh: **Ctrl + Shift + R** |
