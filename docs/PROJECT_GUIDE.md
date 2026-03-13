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
11. [AI Prompt Integration](#ai-prompt-integration)
12. [Documentation Page](#documentation-page)
13. [Preview-Only Code Stripping](#preview-only-code-stripping)
14. [Styling Conventions](#styling-conventions)
15. [Common Gotchas](#common-gotchas)

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
│   ├── DocsPage.tsx          # Documentation (/docs)
│   ├── PricingPage.tsx       # Pricing page (/pricing)
│   ├── AdminPage.tsx         # Admin page (/admin)
│   └── NotFound.tsx
│
├── components/
│   ├── ui-showcase/          # ⭐ All showcase components & blocks
│   │   ├── components/       # Atomic UI components (category-based)
│   │   │   ├── text/         # Text animation components
│   │   │   ├── cards/        # Card components
│   │   │   ├── buttons/      # Button components
│   │   │   ├── loaders/      # Loader components
│   │   │   ├── images/       # Image components
│   │   │   ├── backgrounds/  # Background components
│   │   │   ├── cursor/       # Cursor components
│   │   │   └── scroll/       # Scroll components
│   │   └── blocks/           # Full-page section blocks (category-based)
│   │       ├── hero/         # Hero blocks
│   │       ├── features/     # Feature blocks
│   │       ├── social-proof/ # Social proof blocks
│   │       ├── pricing/      # Pricing blocks
│   │       ├── process/      # Process blocks
│   │       ├── content/      # Content blocks
│   │       └── pre-loaders/  # Pre-loader blocks
│   ├── sections/             # Category section wrappers for /components page
│   ├── layout/               # Shared layout: TopBar, Sidebar, Cursor, etc.
│   ├── landing/              # Landing page-specific sections
│   ├── ui/                   # shadcn/ui primitives (don't edit directly)
│   ├── AIPromptButtons.tsx   # AI platform prompt dropdown (clipboard copy)
│   ├── ComponentCard.tsx     # Card wrapper with preview + code tab (two-row header)
│   ├── LazyBlockPreview.tsx  # IntersectionObserver lazy loader for blocks
│   ├── ProGate.tsx           # Pro access gate overlay
│   └── SectionHeader.tsx     # Reusable section header
│
├── config/
│   ├── components.config.ts  # ⭐ Shared types, categoryLabels, re-exports
│   ├── components.registry.ts # Component definitions & componentCategories
│   ├── blocks.registry.ts    # Block definitions & blockCategories
│   └── proConfig.ts          # Pro mode toggle & pricing
│
├── hooks/
│   ├── use-mobile.tsx        # useIsMobile / useIsTouch hooks
│   └── usePro.ts             # Pro access state
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
       ├── /docs          → DocsPage
       ├── /pricing       → PricingPage
       ├── /admin         → AdminPage
       └── *              → NotFound
```

### Data flow

1. **Config files** are the single source of truth:
   - `components.registry.ts` — component definitions
   - `blocks.registry.ts` — block definitions
   - `components.config.ts` — shared types, `categoryLabels`, and re-exports both registries
2. **Pages** import from the config and filter by `type` (`component` vs `block`) and `category`.
3. **Section files** (e.g., `ButtonsSection.tsx`) render groups of components on the `/components` page.
4. **`BlockCategoryPage.tsx`** uses a `blockComponentMap` to map block IDs → lazy-loaded React components + raw source code strings.

### File organization

All showcase files are organized by category in `src/components/ui-showcase/<category>/`:
- **Components**: `text/`, `cards/`, `buttons/`, `loaders/`, `images/`, `backgrounds/`, `cursor/`, `scroll/`
- **Blocks**: `hero/`, `features/`, `social-proof/`, `pricing/`, `process/`, `content/`, `pre-loaders/`

---

## Routing & Navigation

| Route               | Page                | Description                          |
| -------------------- | ------------------- | ------------------------------------ |
| `/`                  | `LandingPage`       | Marketing hero, feature previews     |
| `/components`        | `ComponentsPage`    | All components grouped by category   |
| `/blocks`            | `BlocksPage`        | Category cards (hero, features, etc.)|
| `/blocks/:category`  | `BlockCategoryPage` | All blocks in a specific category    |
| `/docs`              | `DocsPage`          | Documentation with sidebar nav       |
| `/pricing`           | `PricingPage`       | Pro pricing page                     |
| `/admin`             | `AdminPage`         | Admin utilities                      |

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
| **Categories** | text, cards, buttons, loaders, images, backgrounds, cursor, scroll | hero, features, social-proof, pricing, process, content, pre-loaders |
| **Default Pro** | `false` | `true` |

All files live in `src/components/ui-showcase/<category>/` — organized by category subfolders.

---

## Config System

### Config files

The config is split across three files:

**`src/config/components.config.ts`** — Shared interface, `categoryLabels`, and re-exports:
```ts
export interface ComponentConfig {
  id: string;        // Unique kebab-case slug
  name: string;      // Display name
  category: string;  // Category slug
  type: 'component' | 'block';
  isPro: boolean;
  isNew: boolean;
}
export { components, componentCategories } from './components.registry';
export { blocks, blockCategories } from './blocks.registry';
export const categoryLabels: Record<string, string> = { ... };
```

**`src/config/components.registry.ts`** — All component entries + `componentCategories`

**`src/config/blocks.registry.ts`** — All block entries + `blockCategories`

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

## AI Prompt Integration

`src/components/AIPromptButtons.tsx` provides a "Copy prompt" dropdown on each `ComponentCard`. It generates platform-specific integration prompts for three AI coding tools:

### Supported platforms

| Platform | Prompt style |
|---|---|
| **Lovable** | Full setup verification + file placement instructions |
| **Bolt** | Concise setup + save-as instructions |
| **v0** | Minimal integration-focused prompt |

### How it works

1. Each platform gets a **flavored template string** that includes the raw component source code and a generated file name (derived from the component name).
2. Clicking any platform item **copies the prompt to clipboard** via `navigator.clipboard.writeText()` and shows a success toast.
3. **No external tabs are opened** — all platforms use clipboard-only workflow.
4. The file name is generated from the component name: `"Curtain Preloader"` → `CurtainPreloader.tsx`

### Locked state

- AI prompts are a **Pro feature** — when locked, clicking the trigger shows a toast with an upgrade link to `/pricing`.
- The dropdown does not open for locked components. Code is passed as `null` for pro items.

---

## Documentation Page

The `/docs` page (`DocsPage.tsx`) is the single source of truth for user-facing documentation.

### Structure

- **Desktop**: Fixed sidebar navigation
- **Mobile**: Horizontal scrollable pill navigation

### Content sections

1. **Getting Started** — Installation, Introduction
2. **Usage** — Next.js, Vite, Remix integration guides
3. **Animations** — GSAP basics, Lenis smooth scroll, Custom Timing

### Navigation sync

An `IntersectionObserver` tracks which section is currently in view and updates the active navigation state accordingly.

---

## Preview-Only Code Stripping

Block files can separate production code from preview-specific code using the `// @preview-only` marker.

### How it works

```tsx
// Production component code above...

export default MyComponent;

// @preview-only — everything below is for the component card preview only.
// Do NOT copy this into your project.

function PreviewWrapper() {
  // Demo wrapper, replay buttons, etc.
}
```

- **Everything ABOVE** `// @preview-only` → shown in the Code tab (production code users copy)
- **Everything BELOW** `// @preview-only` → only used for the live preview rendering, never shown to users

The `getCode()` function in `BlockCategoryPage.tsx` strips everything from the marker onwards before displaying source code.

### Currently used in

- `CurtainPreloader.tsx` — preview wrapper with replay button

---

## Styling Conventions

- **Dark theme only** — background `#060608`, text `#f0ede8`, muted `#606070`
- **Fonts**: `font-syne` (headings), `font-inter` (body), `font-mono` (labels/badges)
- **Accent**: Violet `#7c3aed` / `#a78bfa` used for highlights, borders, badges
- **Inline styles** are used heavily for one-off dark UI (borders, backgrounds) — this is intentional for the showcase aesthetic
- **Tailwind** is used for layout utilities and responsive classes
- **shadcn/ui** components are in `src/components/ui/` — avoid editing these directly

### ComponentCard header layout

The `ComponentCard` uses a **two-row header** layout:
- **Row 1**: Component name (full width, no truncation, separated by a `1px solid #1a1a2a` border)
- **Row 2**: Controls — AI prompt dropdown (left) and Preview/Code tab switcher (right), using `justify-between`

This two-row layout applies universally (not just mobile) since the 3-column grid makes cards narrow enough that single-row headers would clip.

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
| **Preview code showing in Code tab** | Use the `// @preview-only` marker to separate preview-only code from production code |

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

ComponentCard.tsx
  ├── AIPromptButtons.tsx (Copy prompt dropdown → clipboard)
  ├── ProGate.tsx (locked overlay for pro items)
  └── LazyBlockPreview.tsx (deferred block rendering)
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
