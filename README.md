
# RukZa's Fashion Hub

A premium online fashion marketplace built with Next.js, TypeScript, and Tailwind CSS.

**Style for Everyone** — Ladies, Gents, and Children's fashion with a scalable marketplace architecture.

## Features (Stage 1)

### Storefront
- Premium responsive homepage with hero banners, category cards, and product grids
- Product catalog with search, filters, and category browsing
- Product detail pages with size/color variants and add-to-cart
- Shopping cart with persistent storage (localStorage)
- Full checkout flow with shipping, coupons, and payment method selection
- Customer account pages (login/register placeholders)
- Instagram and Facebook integration sections

### Admin Panel (`/admin`)
- Dashboard with catalog overview
- Product management table
- Category management
- Orders view (ready for live data)
- Sidebar navigation for all admin sections

### API Routes
- `GET /api/products` — List/filter products
- `GET /api/categories` — List categories
- `POST /api/coupons/validate` — Validate coupon codes
- `POST /api/orders` — Create orders

### Database (Ready for Production)
Full Prisma schema at `prisma/schema.prisma` supporting:
- Category → Subcategory → Brand → Product → Variants → Inventory → Order
- Users, addresses, coupons, reviews, banners, and site settings
- Marketplace-ready with `SELLER` role for Stage 3

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, React 19, TypeScript |
| Styling | Tailwind CSS 4 |
| State | Zustand (cart) |
| Database | Prisma + SQLite (dev) / PostgreSQL (prod) |
| Icons | Lucide React |

## Getting Started

```bash
cd rukza-fashion-hub
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Admin Panel
Visit [http://localhost:3000/admin](http://localhost:3000/admin)

### Test Coupons
- `WELCOME10` — 10% off (min AED 100)
- `SUMMER25` — 25% off (min AED 200)
- `FLAT50` — AED 50 off (min AED 300)

## Environment Variables

Copy `.env.example` to `.env` and configure:

```env
DATABASE_URL="file:./dev.db"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
AUTH_SECRET="your-secret-key"
STRIPE_SECRET_KEY=""          # Payment gateway
STRIPE_PUBLISHABLE_KEY=""
META_APP_ID=""                # Facebook/Instagram (Stage 2)
```

## Database Setup (Optional)

```bash
npm run db:push      # Create SQLite database
npm run db:studio    # Open Prisma Studio
```

## Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Set environment variables
4. Deploy

### Custom Domain
Point `rukzasfashionhub.com` to your hosting provider.

## Roadmap

### Stage 2 — Business Integration
- [ ] Facebook/Instagram product catalog sync
- [ ] WhatsApp order support
- [ ] Stripe/PayTabs payment integration
- [ ] Email order confirmations
- [ ] Reviews system
- [ ] Sales analytics

### Stage 3 — Marketplace
- [ ] Multi-seller registration
- [ ] Seller dashboards
- [ ] Commission system
- [ ] Seller payouts
- [ ] Marketplace moderation

## Project Structure

```
rukza-fashion-hub/
├── prisma/schema.prisma     # Database schema
├── src/
│   ├── app/
│   │   ├── (main)/          # Storefront pages
│   │   ├── admin/           # Admin panel
│   │   └── api/             # API routes
│   ├── components/          # UI components
│   ├── data/store.ts        # Sample product data
│   ├── lib/                 # Utilities & constants
│   ├── store/               # Zustand stores
│   └── types/               # TypeScript types
└── public/                  # Static assets
```

## License

Private — RukZa's Fashion Hub
