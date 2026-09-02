# Marketing Automation Roadmap — RukZa Fashion Hub

**Workflow:** Product → AI content → Your approval → Multi-channel publish → Analytics

---

## Phase 1 — Foundation ✅ (Built now)

| Feature | Status |
|---------|--------|
| Marketing Dashboard (`/admin/marketing`) | ✅ |
| AI caption + hashtag generator | ✅ (template-based) |
| WhatsApp promo message generator | ✅ |
| Facebook caption generator | ✅ |
| Reel script outline | ✅ |
| Approve / Edit / Regenerate workflow | ✅ |
| "Market This Product" on product edit | ✅ |
| NEW ARRIVAL auto-draft trigger | ✅ |
| Channel toggles (Instagram, WhatsApp, Facebook, Website) | ✅ |
| Copy to clipboard + WhatsApp link | ✅ |
| Social Connections page (placeholder) | ✅ |
| Data saved to catalog (Vercel Blob) | ✅ |

---

## Phase 2 — Triggers & Campaigns (Next)

- [ ] Low stock auto-draft (stock ≤ 5)
- [ ] Back in stock auto-draft
- [ ] Clearance / sale trigger
- [ ] Campaign types: New Arrivals, Today's Offers, Weekend Collection
- [ ] Bulk market multiple products

---

## Phase 3 — Instagram + Facebook API

**Requirements:**
- Instagram Business/Creator account
- Facebook Page linked to Instagram
- Meta Developer App
- Permissions: `instagram_content_publish`, `pages_manage_posts`

**Build:**
- [ ] OAuth connect flow in Social Connections
- [ ] Auto-publish feed posts
- [ ] Auto-publish carousels (multiple product images)
- [ ] Store access tokens securely (env / secrets)

---

## Phase 4 — WhatsApp Business API

**Requirements:**
- WhatsApp Business Platform account
- Customer opt-in lists
- Approved message templates

**Build:**
- [ ] WhatsApp Marketing Center UI
- [ ] Broadcast to opted-in customers
- [ ] Channel / status promotion (where Meta allows)

**Note:** Personal WhatsApp automation is not supported. Use official API only.

---

## Phase 5 — Reel Creator + Scheduler

- [ ] FFmpeg / Remotion: images → 9:16 MP4 Reel
- [ ] Multiple Reel templates
- [ ] Smart schedule (Mon–Fri 7:30 PM UAE)
- [ ] Vercel Cron / Firebase scheduler
- [ ] `GET /api/marketing/publish` cron processes due posts

---

## Phase 6 — Stock-based Smart Promotions

| Stock | Message |
|-------|---------|
| > 10 | Normal promotion |
| ≤ 5 | LIMITED STOCK |
| ≤ 2 | ALMOST SOLD OUT |
| 0 | Stop promoting |
| Restock | BACK IN STOCK |

---

## Phase 7 — AI Vision + Analytics

- [ ] Upload image → AI detects style, color, occasion
- [ ] OpenAI Vision / Gemini Vision
- [ ] Post performance tracking
- [ ] Best posting time recommendations

---

## Admin URLs

| Page | URL |
|------|-----|
| Marketing Dashboard | `/admin/marketing` |
| Edit Post | `/admin/marketing/[id]` |
| Social Connections | `/admin/marketing/connections` |
| Product → Market | Edit product → **Market This Product** |

---

## How to use Phase 1 today

1. Edit a product → check **New Arrival** → Save (creates marketing draft)
2. Or click **Market This Product** on any product
3. Go to **AI Marketing** in admin sidebar
4. Open the draft → review caption, WhatsApp text, hashtags
5. Click **Regenerate** if you want new copy
6. Click **Approve** then **Publish**
7. Copy Instagram caption or open WhatsApp link to send
