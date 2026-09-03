# Fix "Not authorized" Vercel deploy

Your token was rejected. Use the **website** instead (no token needed).

---

## Deploy from Vercel website (do this now)

1. Open **https://vercel.com/login** and log in
   - Use the **same account** that owns **ruks-website**
2. Open project **ruks-website**
3. Click **Deployments**
4. Click **Create Deployment** (top right)
5. Choose:
   - Git repo: **ameenruks33-cyber/Ruks-Website**
   - Branch: **main**
6. Click **Deploy**
7. Wait until status = **Ready** (green)
8. Hard refresh your site: **Ctrl+Shift+R**

### Check it worked

| Page | Look for |
|------|----------|
| `/admin/customers` | **Add Customer**, **Remove**, `Customers panel v2026-09-03` |
| `/admin/marketing` | **AI Marketing**, `Panel version: 2026-09-03-fix` (not blank Loading...) |

---

## If you still want CLI later — make a NEW token

Old token is bad. Create a fresh one:

1. Open **https://vercel.com/account/tokens**
2. **Create** → name `rukza-deploy`
3. Scope: **Full Account**
4. Copy the **full** token immediately (starts with `vcp_` or similar)
5. Run (use your real folder path):

```powershell
cd "F:\NEW PROJUCT\rukza-fashion-hub"
powershell -ExecutionPolicy Bypass -File deploy-now.ps1 -Token "PASTE_FULL_TOKEN_HERE"
```

### Common mistakes that cause "Not authorized"

- Token cut off / missing characters when pasting
- Logged into a **different** Vercel account than the one that owns the site
- Token expired or revoked
- Extra spaces or quotes around the token

---

## One-time: connect Git (so you never need a token again)

Vercel → **ruks-website** → **Settings** → **Git** → connect **ameenruks33-cyber/Ruks-Website**, production branch **main**.

After that, every push to `main` auto-updates the live site.
