

## Plan: Replace Footer + Add to All Pages

### 1. Rewrite `src/components/layout/Footer.tsx`

Replace the entire file with the new footer design:

**Top section** (`py-16 px-10`): flex row (column on mobile), justify-between
- **Left**: KINETIC UI logo (font-syne extrabold 1.1rem #f0ede8), tagline (font-inter 0.8rem #606070), @kineticui link (font-mono 11px #404050 → external)
- **Right**: 3 columns with gap-16 (wrap on mobile with gap-8)
  - PRODUCT: Components, Blocks, Pricing, Docs, Changelog (React Router Links)
  - RESOURCES: GitHub (external `target="_blank"`), License, Terms
  - LEGAL: Privacy, Refunds
  - Column labels: font-mono 10px tracking-[0.15em] #404050 uppercase mb-4
  - Link style: font-inter 0.85rem #606070, hover #f0ede8

**Bottom bar**: border-top 1px #1e1e2e, py-6 px-10, flex row (column on mobile)
- Left: copyright (font-mono 11px #404050)
- Right: License · Terms · Privacy · Refunds links (font-mono 11px #404050, hover #909098, gap-6)

Mobile: top section flex-col gap-10, columns wrap gap-8, bottom bar flex-col gap-3 text-center.

### 2. Delete `src/components/landing/LandingFooter.tsx`

No longer needed — the new Footer replaces it.

### 3. Update `src/pages/LandingPage.tsx`

Replace `LandingFooter` import with `Footer` from `@/components/layout/Footer`.

### 4. Add Footer to pages missing it

These pages need `import Footer` + `<Footer />` at the bottom:
- `src/pages/ComponentsPage.tsx`
- `src/pages/BlocksPage.tsx`
- `src/pages/BlockCategoryPage.tsx`
- `src/pages/DocsPage.tsx`
- `src/pages/PricingPage.tsx`

Pages that already have Footer (no changes needed): LicensePage, TermsPage, PrivacyPage, RefundPage, Index.

### Files changed: 8 files modified, 1 deleted

