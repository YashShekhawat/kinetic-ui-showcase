

## Complete Mobile Redesign for All Blocks

### Core Problem
Currently, mobile block previews show a **placeholder card** ("Preview on desktop for full experience") instead of the actual component. This redesign will render real, mobile-optimized versions of all 7 block components on mobile devices.

### Architecture Change

**ComponentCard.tsx** — Remove the mobile placeholder branch. On mobile, render the actual block component inside a scrollable container (height: auto, min-height: 400px) instead of the fake placeholder. This is the single gate that currently prevents any block from rendering on mobile.

### Per-Component Changes

**1. KineticHero.tsx**
- Import `useIsMobile` hook
- Mobile layout: single column, centered, padding 24px 20px
- Hide: floating shapes (already hidden via `hidden md:block`), scroll text (already hidden), bottom stats bar, vertical divider
- Badge: font-size 9px, px-2 py-1
- Heading: `clamp(1.8rem, 7vw, 2.4rem)`, text-align left, letter-spacing -0.01em, line-height 1.1
- Description: 0.8rem, max-width 100%, mt-12px
- CTA buttons: flex-column, width 100%, gap 8px, mt-20px, py-2.5, font-size 0.8rem
- Social proof row: flex-wrap, gap 8px, font-size 0.7rem, mt-16px, hide separator

**2. BentoGridSection.tsx** (mobile carousel already exists)
- Reorder carousel cards: A → D → C → B → D2 → E → F
- Cell B SVG: height 80px
- Cell F stats: justify-between, font-size 1.2rem
- Each cell: padding 16px, height auto, min-height unset

**3. PricingCards.tsx**
- Add `useIsMobile` import
- Mobile: padding 16px 14px, single column, gap 10px
- Heading: `clamp(1.4rem, 6vw, 2rem)`, subtext 0.75rem
- Toggle: font-size 11px, padding 2px, each option px-3 py-1.5
- Card padding: 16px, plan name 0.9rem, price `clamp(1.6rem, 6vw, 2.2rem)`, feature text 0.75rem, gap 8px, CTA py-2 font-size 0.8rem
- RECOMMENDED badge: font-size 8px, px-3 py-0.5

**4. TestimonialTicker.tsx**
- Add `useIsMobile` import
- Mobile: padding 20px 16px
- Quote text: 0.85rem, line-height 1.6
- Quote mark: font-size 4rem, opacity 0.06
- Author: avatar 28px, name 0.8rem, role 0.7rem
- Hide ticker strip below 480px (use `useIsMobile` or media query class)
- Dots: keep visible

**5. ProcessStepsAccordion.tsx**
- Mobile: hide entire left column
- Add a compact header row at top (full width): label badge + "How it works." heading at `clamp(1.2rem, 5vw, 1.6rem)`, mb-16px
- Accordion: full width
- Step row padding: 14px 0, title 0.9rem, number 0.7rem, description 0.75rem, tags 9px px-1.5 py-0.5
- Auto-advance: keep

**6. MarqueeStatementSection.tsx**
- Add `useIsMobile` import
- Mobile: stack vertically (left column on top)
- Left: width 100%, position static, padding 20px 16px 0, heading `clamp(1.2rem, 5vw, 1.8rem)`, body 0.75rem, link 0.75rem
- Marquee rows: width 100%, mt-16px, font-size `clamp(1rem, 5vw, 1.8rem)`, padding 8px 0
- Border rules between rows: keep

**7. CinematicTextImageReveal.tsx**
- Add `useIsMobile` import
- Mobile: stack vertically
- Hide vertical divider (already `hidden md:block`), show horizontal rule (already exists)
- Left: width 100%, min-height auto, padding 24px 20px, eyebrow 9px, heading `clamp(1rem, 4vw, 1.4rem)`, metadata 0.7rem
- Right: width 100%, min-height 160px, inner box width 80% height 120px, corner ticks 4px, decorative number 3rem bottom 4px right 8px, "View Case Study" 0.7rem

### Global CSS Safety Net (index.css)
Add a media query block targeting block preview containers on mobile:
```css
@media (max-width: 767px) {
  .block-preview-scroll h1,
  .block-preview-scroll h2,
  .block-preview-scroll h3 { font-size: clamp(1rem, 5vw, 2.4rem) !important; }
  .block-preview-scroll p,
  .block-preview-scroll span,
  .block-preview-scroll div { max-font-size: 1rem; }
  .block-preview-scroll * { word-break: break-word; overflow-wrap: break-word; }
}
```

### Files to Edit (8 files)
1. `src/components/ComponentCard.tsx` — Remove mobile placeholder, render actual components
2. `src/components/ui-showcase/KineticHero.tsx` — Mobile layout
3. `src/components/ui-showcase/BentoGridSection.tsx` — Reorder carousel, adjust cell sizing
4. `src/components/ui-showcase/PricingCards.tsx` — Mobile sizing
5. `src/components/ui-showcase/TestimonialTicker.tsx` — Mobile sizing, hide ticker
6. `src/components/ui-showcase/ProcessStepsAccordion.tsx` — Hide left column, compact header
7. `src/components/ui-showcase/MarqueeStatementSection.tsx` — Stack layout
8. `src/components/ui-showcase/CinematicTextImageReveal.tsx` — Stack layout
9. `src/index.css` — Global font safety net

