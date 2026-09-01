# Deploy RukZa Fashion Hub to Vercel

## Quick deploy (recommended)

### Option A — Vercel website (easiest)

1. Push this folder to **GitHub** (see below)
2. Go to [vercel.com](https://vercel.com) → **Add New Project**
3. Import your GitHub repo
4. Set **Root Directory** to `rukza-fashion-hub` if the repo is the whole `NEW PROJUCT` folder, or import a repo that contains only this app
5. Add environment variables:

| Variable | Value |
|----------|--------|
| `NEXT_PUBLIC_APP_URL` | `https://your-site.vercel.app` (update after first deploy) |
| `NEXT_PUBLIC_APP_NAME` | `RukZa's Fashion Hub` |
| `AUTH_SECRET` | Random string (run `openssl rand -base64 32`) |
| `ADMIN_PASSWORD` | **Your private admin password** (only in Vercel, never in GitHub) |
| `ADMIN_SECRET` | Another random secret string |

**Never commit `.env`** — passwords stay only on your PC (`.env`) and Vercel (Environment Variables).

6. Click **Deploy**

### Option B — Vercel CLI

```bash
cd rukza-fashion-hub
npm install -g vercel
vercel login
vercel
```

Follow prompts. For production:

```bash
vercel --prod
```

## After deploy

1. Open **Vercel → Project → Settings → Environment Variables**
2. Set `NEXT_PUBLIC_APP_URL` to your live URL (e.g. `https://rukza-fashion.vercel.app`)
3. Redeploy once so links and SEO use the correct domain

## Custom domain

1. Vercel → **Settings → Domains**
2. Add `rukzasfashionhub.com` (or your domain)
3. Update DNS at your registrar as Vercel instructs

## Notes

- Store data (products, orders, settings) uses **browser localStorage** in this version — each visitor/device has its own data until you connect a database (PostgreSQL + Prisma) for production.
- Admin panel: `https://your-site.vercel.app/admin/login` — password is set via `ADMIN_PASSWORD` in Vercel only.
