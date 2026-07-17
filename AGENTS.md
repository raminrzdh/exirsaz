<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Exirsaz SEO & Core Web Vitals Guidelines

As an expert SEO and developer, you MUST ALWAYS follow these rules for every page, component, and feature you build in this project:

## 1. URL Structure & Routing
- Use lowercase, kebab-case for all English URLs (e.g., `/products/shade-net`).
- If using Persian slugs, ensure they are URL-friendly and correctly decoded in UI, but encoded in requests.
- Avoid using pure numerical IDs in public URLs; use descriptive slugs instead (e.g., `/products/[slug]`).
- Ensure trailing slashes are handled consistently (Next.js default behavior).

## 2. Semantic HTML & Accessibility
- Always use semantic tags (`<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, `<footer>`).
- Maintain a strict heading hierarchy. Every page MUST have exactly ONE `<h1>` tag. Do not skip heading levels (e.g., going from `<h2>` directly to `<h4>`).
- Every `<img>` or `next/image` MUST have a descriptive `alt` attribute. Avoid generic alts like "image" or "picture".
- Use `aria-label` for interactive elements that don't have text (like icon-only buttons).
- **UX Rules**: Always apply `cursor-pointer` to interactive/clickable elements (buttons, selectable cards, custom radios, list items acting as links) to provide clear visual feedback.

## 3. Metadata & Head Tags
- Always implement the Next.js `generateMetadata` API for dynamic pages.
- Every page must have a unique `title` (optimal: 50-60 chars) and `description` (optimal: 150-160 chars).
- Include Open Graph (`og:title`, `og:image`, `og:description`) and Twitter cards for all shareable pages (Products, Blog posts).
- Define `alternates.canonical` to avoid duplicate content issues, especially for paginated or filtered pages.

## 4. Internal Linking & Crawlability
- Use Next.js `<Link>` component for all internal navigation to ensure client-side transitions and proper `href` exposure to crawlers.
- Use descriptive anchor text. Avoid "click here". (e.g., `<Link href="/contact">تماس با پشتیبانی</Link>`).
- Implement Breadcrumbs for deep pages (e.g., Products, Categories) and mark them up with JSON-LD.

## 5. Performance (Core Web Vitals)
- **LCP (Largest Contentful Paint)**: Prioritize loading the hero image/text. Use `priority` on above-the-fold `next/image` components.
- **CLS (Cumulative Layout Shift)**: Always provide `width` and `height` to images, or use aspect ratios. Avoid dynamically injecting UI elements above existing content without reserved space.
- Avoid heavy client-side JavaScript for content that should be indexed. Prefer Server Components (RSC) for content delivery.

## 6. Structured Data (Schema.org)
- Inject JSON-LD (`<script type="application/ld+json">`) for all core entities:
  - **Products**: Price, Availability, SKU, Name, Image, Ratings.
  - **Breadcrumbs**: BreadcrumbList for hierarchical navigation.
  - **Articles**: BlogPosting for news and articles.
  - **LocalBusiness**: For the main landing page and contact pages.
