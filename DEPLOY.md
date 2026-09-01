# Deploy RukZa Fashion Hub to Vercel

## Quick deploy (recommended)

### Option A — Vercel website (easiest)

1. Push this folder to **GitHub**
2. Go to [vercel.com](https://vercel.com) → **Add New Project**
3. Import your GitHub repo **Ruks-Website**
4. Add environment variables:

| Variable | Value |
|----------|--------|
| `NEXT_PUBLIC_APP_URL` | `https://your-site.vercel.app` (update after first deploy) |
| `NEXT_PUBLIC_APP_NAME` | `RukZa's Fashion Hub` |
| `AUTH_SECRET` | Random string |
| `ADMIN_PASSWORD` | **Your private admin password** |
| `ADMIN_SECRET` | Another random secret string |
| `WHATSAPP_NOTIFY_PHONE` | Your WhatsApp number (optional) |

5. Click **Deploy**

### Connect Vercel Blob (required for admin → live website updates)

Without this step, admin edits **will not save** on the hosted Vercel website.

1. Open your project on [vercel.com](https://vercel.com)
2. Go to **Storage** tab → **Create Database** → choose **Blob**
3. Name it (e.g. `rukza-store`) → **Create**
4. Click **Connect to Project** → select your website project
5. Vercel automatically adds `BLOB_READ_WRITE_TOKEN` to your project
6. Go to **Deployments** → click **⋯** on latest deploy → **Redeploy**

After this, when you edit products/settings in admin on your live URL, changes publish to all visitors.

### Admin panel (live site)

- URL: `https://your-site.vercel.app/admin/login`
- Password: value of `ADMIN_PASSWORD` in Vercel env vars

## After deploy

1. Set `NEXT_PUBLIC_APP_URL` to your live URL
2. Connect **Vercel Blob** (see above)
3. Redeploy once

## Custom domain

1. Vercel → **Settings → Domains**
2. Add your domain and update DNS as instructed

## Notes

- **Products, banners, settings** are stored in Vercel Blob on the live site (after you connect it).
- **Orders** are stored on the server; for high-volume production consider a database later.
- Never commit `.env` — passwords stay in Vercel Environment Variables only.
