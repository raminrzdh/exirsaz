# Exirsaz — B2B Agricultural & Greenhouse Supply Platform

> A full-featured, production-ready e-commerce and lead management platform built for **Exirsaz**, a leading manufacturer of shade nets, greenhouse equipment, and agricultural covering systems in Iran.

---

## Overview

Exirsaz is a **Next.js 16** full-stack application featuring a dual-channel sales architecture:

- **Direct Sales** — Customers browse and purchase products online with real-time pricing, variant selection, coupon application, and order tracking.
- **Geo-Routed Agency Sales** — The platform intelligently routes B2B and bulk inquiries to authorized regional distributors based on the customer's province and city selection, capturing leads and tracking conversion through a built-in analytics pipeline.

The platform includes a fully-featured **Admin Panel** for managing products, orders, agencies, inquiries, blog content, users, and real-time analytics — all with mobile-responsive layouts and RTL-first design.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16.2 (App Router, Turbopack, RSC) |
| **Language** | TypeScript 5 |
| **Database** | PostgreSQL via Prisma ORM 6 |
| **Auth** | Phone-based OTP + Password login (bcryptjs, HTTP-only cookies) |
| **UI** | shadcn/ui · Tailwind CSS v4 · Radix UI Primitives |
| **Rich Text** | Tiptap v3 (tables, images, YouTube, color, highlight) |
| **Charts** | Recharts |
| **Maps** | React Leaflet + React Iran Map |
| **Forms** | React Hook Form + Zod |
| **Toasts** | Sonner |
| **State** | Zustand |
| **Font** | Vazirmatn (RTL-native, variable) |

---

## Features

### Storefront (Customer-facing)

- **RTL-first, Persian UI** — Full Farsi interface with Jalali date support
- **Smart Product Pages** — Variant selection, attributes, stock indicators, SEO-optimized slugs
- **Geo-Routed Agency Discovery** — Province/city picker routes customers to their nearest authorized distributor, showing contact cards with direct WhatsApp/Bale/phone CTAs
- **Direct Inquiry Forms** — Quick lead capture for wholesale and project-based orders
- **Blog & Content** — Full blog with categories, rich text, SEO metadata, OG images, and comment system
- **Page View Tracking** — Anonymous session-based analytics pipeline
- **SEO Infrastructure** — `generateMetadata`, JSON-LD structured data, `sitemap.ts`, `robots.ts`, canonical URLs, Open Graph

### Admin Panel (`/admin`)

- **Dashboard** — KPI overview: orders, revenue, lead events, top products
- **Order Management** — Full order lifecycle: `PENDING → PROCESSING → SHIPPED → DELIVERED`, shipping code entry
- **Product Management** — CRUD with variants, attributes, categories, pricing, SEO fields, and media library
- **Agency Management** — Create/edit regional distributors with multi-city coverage, WhatsApp/Bale/phone toggles, geo-exclusion rules
- **Inquiry CRM** — Manage incoming B2B inquiry requests with status tracking (`PENDING → CONTACTED → CLOSED`)
- **Blog CMS** — Posts with Tiptap rich text editor, category management, comment moderation
- **Analytics & SEO Dashboard** — Funnel events, page views, lead conversion rates
- **User & Role Management** — Role-based access control (RBAC) with granular permissions
- **General Settings** — Site name, logo, support contacts, custom header scripts (GTM), agency routing toggle

---

## Project Structure

```
src/
├── app/
│   ├── (storefront)/          # Public-facing pages
│   │   ├── products/[slug]/   # Product detail pages
│   │   ├── blog/[slug]/       # Blog post pages
│   │   ├── contact/           # Contact page
│   │   └── page.tsx           # Landing page
│   ├── admin/
│   │   ├── (panel)/           # Protected admin routes
│   │   │   ├── orders/        # Order management
│   │   │   ├── products/      # Product CRUD
│   │   │   ├── agencies/      # Agency management
│   │   │   ├── inquiries/     # B2B inquiry CRM
│   │   │   ├── posts/         # Blog CMS
│   │   │   ├── analytics/     # Analytics dashboard
│   │   │   ├── crm/           # Customer management
│   │   │   ├── settings/      # Store settings & geo-rules
│   │   │   └── users/         # User & role management
│   │   └── login/             # Admin authentication
│   ├── api/                   # API routes (analytics tracking, uploads)
│   ├── sitemap.ts
│   └── robots.ts
├── components/
│   ├── admin/                 # Admin-specific components
│   ├── storefront/            # Storefront components
│   └── ui/                    # shadcn/ui primitives
├── lib/
│   ├── db/prisma.ts           # Prisma singleton
│   └── utils/                 # Formatters, helpers, currency
└── prisma/
    └── schema.prisma          # Full DB schema
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 14+ (local or hosted, e.g. Supabase)
- `pnpm` (recommended)

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/raminrzdh/exirsaz.git
cd exirsaz

# 2. Install dependencies
pnpm install --no-frozen-lockfile

# 3. Configure environment
cp .env.example .env
# Edit .env and set your DATABASE_URL and DIRECT_URL

# 4. Push schema to database
npx prisma db push

# 5. Seed initial data (provinces, cities, categories)
node seed.js
node seed_agencies.js

# 6. Create an admin user
node -e "
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const p = new PrismaClient();
bcrypt.hash('your_password', 10).then(hash =>
  p.user.create({ data: { phoneNumber: '09XXXXXXXXX', password: hash } })
).then(() => { console.log('Admin created'); p.\$disconnect(); });
"

# 7. Start dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) for the storefront.
Open [http://localhost:3000/admin](http://localhost:3000/admin) for the admin panel.

### Environment Variables

```env
DATABASE_URL="postgresql://user:password@host:5432/exirsaz?schema=public"
DIRECT_URL="postgresql://user:password@host:5432/exirsaz?schema=public"
```

### Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start development server with Turbopack |
| `pnpm build` | Generate Prisma client, push schema, build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `npx prisma studio` | Open Prisma Studio GUI |

---

## Database Schema

The Prisma schema covers the following core models:

- `User` — Customer/admin accounts with OTP and password auth
- `Role` / `Permission` — RBAC system
- `Product` / `ProductVariant` / `ProductAttribute` — Full variable product support
- `Order` / `OrderItem` — Order lifecycle with price snapshots
- `Coupon` — Percentage and fixed-amount discount codes
- `Agency` — Regional distributors with multi-city coverage
- `Province` / `City` — Iranian geography (31 provinces, 1320+ cities)
- `InquiryRequest` — B2B lead capture
- `LeadEvent` — CTA click tracking per agency/product
- `Post` / `PostComment` — Blog system with threaded comments
- `FunnelEvent` — Sales funnel analytics
- `StoreSettings` — Global site configuration

---

## Architecture Notes

- **Server Components first** — Data fetching is done in RSC where possible; client components are reserved for interactivity.
- **Geo-Routing Engine** — Agency routing decisions are made server-side based on `City → Agency` many-to-many relations, with per-category exclusion rules and a global master toggle in `StoreSettings`.
- **RTL Architecture** — All layouts use Tailwind logical properties (`ms-*`, `me-*`, `ps-*`, `pe-*`) for correct RTL behavior without per-element overrides.
- **Media Library** — Uploaded files are stored in `/public/uploads` and managed through a dedicated admin UI.

---

## License

Private repository — All rights reserved © Exirsaz.
