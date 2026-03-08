# Kinetic UI — Developer Guide

> A curated showcase of animated React components and production-ready page sections ("blocks"), powered by **GSAP**, **Lenis**, and **Tailwind CSS**. Built with **Vite + React + TypeScript**.

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Project Structure](#project-structure)
3. [Architecture Overview](#architecture-overview)
4. [Routing & Navigation](#routing--navigation)
5. [Component vs Block](#component-vs-block)
6. [Config System](#config-system)
7. [Key Libraries & Patterns](#key-libraries--patterns)
8. [Adding New Components / Blocks](#adding-new-components--blocks)
9. [Search System](#search-system)
10. [Pro Mode](#pro-mode)
11. [Styling Conventions](#styling-conventions)
12. [Common Gotchas](#common-gotchas)

---

## Quick Start

```bash
npm install
npm run dev        # Vite dev server → http://localhost:5173
npm run build      # Production build
npm run add        # CLI to add new components/blocks (see below)
```

---

## Project Structure

```
src/
├── pages/                    # Route-level pages
│   ├── LandingPage.tsx       # Marketing landing page (/)
│   ├── ComponentsPage.tsx    # Component showcase (/components)
│   ├── BlocksPage.tsx        # Block category grid (/blocks)
│   ├── BlockCategoryPage.tsx # Individual block category (/blocks/:category)
│   └── NotFound.tsx
│
├── components/
│   ├── ui-showcase/          # ⭐ All showcase components & blocks live here
│   │   ├── TextReveal.tsx
│   │   ├── KineticHero.tsx
│   │   └── ...
│   ├── sections/             # Category section wrappers for /components page
│   │   ├── TextSection.tsx
│   │   ├── ButtonsSection.tsx
│   │   └── ...
│   ├── layout/               # Shared layout: TopBar, Sidebar, Cursor, etc.
│   ├── landing/              # Landing page-specific sections
│   ├── ui/                   # shadcn/ui primitives (don't edit directly)
│   ├── ComponentCard.tsx     # Card wrapper with preview + code tab
│   ├── LazyBlockPreview.tsx  # IntersectionObserver lazy loader for blocks
│   ├── ProGate.tsx           # Pro access gate overlay
│   └── SectionHeader.tsx     # Reusable section header
│
├── config/
│   ├── components.config.ts  # ⭐ Central registry of ALL components & blocks
│   └── proConfig.ts          # Pro mode toggle & pricing
│
├── hooks/
│   ├── use-mobile.tsx        # useIsMobile / useIsTouch hooks
│   └── useProAccess.ts       # Pro access state
│
├── App.tsx                   # Root: Lenis, GSAP, routes, global overlays
├── index.css                 # Tailwind + CSS variables + design tokens
└── main.tsx                  # Entry point
```

---

## Architecture Overview

```
App.tsx
  ├── Lenis (smooth scroll, stored on window.__lenis)
  ├── GSAP ScrollTrigger (registered globally)
  ├── Cursor (custom cursor, hidden on touch)
  ├── PageTransition (GSAP route transition sweep)
  ├── ScrollToTop (resets scroll on route change)
  ├── ScrollToTopButton (floating button)
  └── Routes
       ├── /              → LandingPage
       ├── /components    → ComponentsPage
       ├── /blocks        → BlocksPage (category grid)
       ├── /blocks/:cat   → BlockCategoryPage (block list)
       └── *              → NotFound
```

### Data flow

1. **`components.config.ts`** is the single source of truth — it defines every component and block with `id`, `name`, `category`, `type`, `isPro`, and `isNew`.
2. **Pages** import from the config and filter by `type` (`component` vs `block`) and `category`.
3. **Section files** (e.g., `ButtonsSection.tsx`) render groups of components on the `/components` page.
4. **`BlockCategoryPage.tsx`** uses a `blockComponentMap` to map block IDs → lazy-loaded React components + raw source code strings.

---

## Routing & Navigation

| Route               | Page                | Description                          |
| -------------------- | ------------------- | ------------------------------------ |
| `/`                  | `LandingPage`       | Marketing hero, feature previews     |
| `/components`        | `ComponentsPage`    | All components grouped by category   |
| `/blocks`            | `BlocksPage`        | Category cards (hero, features, etc.)|
| `/blocks/:category`  | `BlockCategoryPage` | All blocks in a specific category    |

- **Page transitions**: GSAP sweep animation via `PageTransition.tsx`
- **Scroll reset**: `ScrollToTop.tsx` cleans up ScrollTriggers and resets scroll on route change
- **TopBar**: Shared fixed header with Components/Blocks tab switcher and smart search

---

## Component vs Block

| | Component | Block |
|---|---|---|
| **What** | Small, isolated UI element | Full-width page section |
| **Examples** | Text Reveal, Magnetic Button | Kinetic Hero, Pricing Cards |
| **Page** | `/components` | `/blocks/:category` |
| **Rendering** | Inside `ComponentCard` with preview + code | Inside `ComponentCard` with `fullBleed` + `isBlock` |
| **Categories** | text, cards, buttons, loaders, images, backgrounds, cursor, scroll | hero, features, social-proof, pricing, process, content |
| **Default Pro** | `false` | `true` |

Both live in `src/components/ui-showcase/` — there's no separate folder.

---

## Config System

### `src/config/components.config.ts`

```ts
export interface ComponentConfig {
  id: string;        // Unique kebab-case slug (e.g., "text-reveal")
  name: string;      // Display name (e.g., "Text Reveal")
  category: string;  // Category slug (e.g., "text", "hero")
  type: 'component' | 'block';
  isPro: boolean;
  isNew: boolean;    // Shows "NEW" badge
}

export const components: ComponentConfig[] = [ ... ];
export const blocks: ComponentConfig[] = [ ... ];
export const categoryLabels: Record<string, string> = { ... };
export const componentCategories: string[] = [ ... ];
export const blockCategories: string[] = [ ... ];
```

### `src/config/proConfig.ts`

Controls the Pro paywall UI. Toggle `proModeEnabled` to show/hide Pro badges, lock overlays, and pricing banners.

---

## Key Libraries & Patterns

### GSAP

- Registered globally in `App.tsx` with `ScrollTrigger`
- Used for: entrance animations, hover effects, scroll-driven reveals, page transitions
- Pattern: `gsap.context()` scoped to a container ref, cleaned up in `useEffect` return
- Blocks use `gsap.fromTo` for entrance animations with `data-anim` attributes

### Lenis (Smooth Scroll)

- Initialized in `App.tsx`, stored on `window.__lenis`
- Synced with GSAP ticker for smooth ScrollTrigger integration
- Used by `ScrollToTopButton` and `SmartSearchDropdown` for programmatic scrolling

### Vite `?raw` Imports

Source code for the "Code" tab is imported as raw strings:

```ts
import myComponentCode from '@/components/ui-showcase/MyComponent.tsx?raw';
```

This string is passed to `ComponentCard` which renders it in a syntax-highlighted code block.

### Lazy Loading

- Blocks use `React.lazy()` + `<Suspense>` for code splitting
- `LazyBlockPreview` uses `IntersectionObserver` to defer mounting until visible

---

## Adding New Components / Blocks

Use the CLI script — **do not manually edit config files**:

```bash
# Component
npm run add -- --name "Bounce Button" --id "bounce-button" --category "buttons" --code ./tmp/BounceButton.tsx

# Block
npm run add -- --name "Stats Grid" --id "stats-grid" --category "features" --type block --code ./tmp/StatsGrid.tsx

# Dry run (preview changes)
npm run add -- --name "Bounce Button" --id "bounce-button" --category "buttons" --code ./tmp/BounceButton.tsx --dry-run
```

The script automatically:
1. Copies the file to `src/components/ui-showcase/`
2. Registers it in `components.config.ts`
3. Wires it into the correct section file (components) or `BlockCategoryPage.tsx` (blocks)

See [`docs/adding-components.md`](./adding-components.md) for full details including the `// ---CODE---` marker for custom display code.

---

## Search System

The search bar in the `TopBar` uses `SmartSearchDropdown.tsx` — a two-tier dropdown:

1. **Tier 1 — Category matches**: Jumps to section headers (on `/components`) or navigates to `/blocks/:category`
2. **Tier 2 — Item matches**: Scrolls to specific component cards (on `/components`) or navigates to `/blocks/:category?search=<query>` to deep-link to a specific block

On the **`/blocks` overview page**, search filters the category grid itself — categories with no matching blocks are hidden.

On **`/blocks/:category`**, the `?search=` URL param pre-fills the search, auto-scrolls to the matched block, highlights it with a violet glow, then cleans the URL.

---

## Pro Mode

Controlled by `src/config/proConfig.ts`:

- `proModeEnabled`: When `true`, shows PRO badges, lock overlays on pro components, and pricing banners
- `ProGate.tsx`: Overlay component that blocks interaction on pro items
- `getCode()` helper: Returns placeholder string instead of real source for pro blocks

Pro status is **UI-only** — there's no auth or payment integration. It's a visual gate for the showcase.

---

## Styling Conventions

- **Dark theme only** — background `#060608`, text `#f0ede8`, muted `#606070`
- **Fonts**: `font-syne` (headings), `font-inter` (body), `font-mono` (labels/badges)
- **Accent**: Violet `#7c3aed` / `#a78bfa` used for highlights, borders, badges
- **Inline styles** are used heavily for one-off dark UI (borders, backgrounds) — this is intentional for the showcase aesthetic
- **Tailwind** is used for layout utilities and responsive classes
- **shadcn/ui** components are in `src/components/ui/` — avoid editing these directly

---

## Common Gotchas

| Issue | Explanation |
|---|---|
| **ScrollTrigger not cleaning up** | Always use `gsap.context()` scoped to a ref and `ctx.revert()` in cleanup |
| **Lenis conflicts with ScrollTrigger** | They're synced via `gsap.ticker` in `App.tsx` — don't create a second Lenis instance |
| **Block not rendering** | Check `blockComponentMap` in `BlockCategoryPage.tsx` — every block needs a lazy import + map entry |
| **"NEW" badge not showing** | Set `isNew: true` in `components.config.ts` |
| **Search not finding a block** | The search checks `name` and `category` from config — ensure spelling matches |
| **Page transition flash** | `PageTransition.tsx` listens to route changes — if you add routes, they're automatically covered |
| **Raw import failing** | Ensure the `?raw` suffix is on the import and the file path is correct |
| **Mobile placeholder on blocks** | `ComponentCard.tsx` has mobile-specific rendering — check `isMobileBlock` prop |

---

## File Relationship Map

```
components.config.ts
  ↓ imported by
  ├── ComponentsPage.tsx → renders Section files → ComponentCard → ui-showcase/*
  ├── BlocksPage.tsx → category grid (navigates to ↓)
  ├── BlockCategoryPage.tsx → blockComponentMap → lazy ui-showcase/* → ComponentCard
  ├── TopBar.tsx → SmartSearchDropdown.tsx (search)
  └── ComponentsSidebar.tsx (navigation)
```

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build locally |
| `npm run add` | CLI to add components/blocks (see docs) |

---

*Last updated: March 2026*
