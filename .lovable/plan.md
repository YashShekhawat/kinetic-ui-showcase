

# Mobile Responsive Overhaul for Kinetic UI

This plan makes all 3 pages fully responsive across mobile, tablet, and desktop breakpoints, disables touch-inappropriate interactions, and adapts complex layouts for smaller screens.

---

## Scope Overview

**~20 files to modify** across landing page sections, inner page layouts, component previews, and section components. The work is grouped into 6 phases.

---

## Phase 1: Global Touch Detection and Cursor

**Files:** `src/App.tsx`, `src/components/layout/Cursor.tsx`, `src/hooks/use-mobile.tsx`

- Add a shared `useIsTouch()` hook using `window.matchMedia("(hover: none)")` in `use-mobile.tsx`
- In `App.tsx`, conditionally render `<Cursor />` only when `!isTouch`
- The cursor already checks `ontouchstart` but we'll align it with the new media query approach for consistency

---

## Phase 2: Landing Page Mobile Responsiveness

### 2a. LandingNavbar (`src/components/layout/LandingNavbar.tsx`)
- Hide center nav links below `md` (768px)
- Replace "Browse Components" button with a hamburger menu on mobile
- Add a full-screen mobile menu overlay with GSAP slide-in animation
- Hamburger morphs to X using GSAP rotation on the two lines
- Menu links stack vertically with clip-path stagger reveal
- On click: close menu + navigate

### 2b. HeroSection (`src/components/landing/HeroSection.tsx`)
- Reduce padding to `px-5` on mobile
- Heading: `clamp(2.2rem, 9vw, 3rem)` on mobile
- Subheading: `text-[0.9rem]`
- CTA buttons: `flex-col w-full` on mobile, each button full width
- Stats row: `flex-col gap-4` on mobile, remove dividers
- Badge: smaller padding, text-center, allow wrapping

### 2c. MovingStatsBar (`src/components/landing/MovingStatsBar.tsx`)
- Reduce font-size to `text-[10px]` on mobile; otherwise keep as-is

### 2d. LiveShowcase (`src/components/landing/LiveShowcase.tsx`)
- Below 768px: replace CSS grid with a horizontal swipe carousel
- Show 6 best cells (Aurora, Particle Field, Tilt Card, Gradient Text, Orbit Loader, Beam of Light)
- Each card: `w-[80vw] h-[200px] flex-shrink-0 scroll-snap-align-center`
- Bottom hover bar always visible on mobile
- Add dot indicators using IntersectionObserver
- Section heading: `text-center`, `clamp(1.8rem, 6vw, 2.5rem)`
- Tablet (md-lg): 3-column grid, 6 cells visible

### 2e. WhyKineticUI (`src/components/landing/WhyKineticUI.tsx`)
- Heading: `text-center` on mobile, `clamp(1.8rem, 6vw, 2.5rem)`
- Table: reduce padding `px-3 py-2.5`, font-size `text-[11px]`
- Full width, `px-5` on mobile

### 2f. BlocksPreview (`src/components/landing/BlocksPreview.tsx`)
- Header: `text-center`, `px-5`
- Cards: `w-[260px] h-[180px]` on mobile, scale `0.28`
- CTA button: full width on mobile

### 2g. CTABanner (`src/components/landing/CTABanner.tsx`)
- Heading lines: `clamp(2.5rem, 11vw, 5rem)` on mobile
- CTA buttons: `flex-col w-full` on mobile
- Bottom text: `text-center`

### 2h. LandingFooter (`src/components/landing/LandingFooter.tsx`)
- `flex-col items-center gap-3 text-center p-5` on mobile

---

## Phase 3: Components Page and Blocks Page Layout

### 3a. TopBar (`src/components/layout/TopBar.tsx`)
- Already has mobile search icon and hidden desktop search -- keep as-is
- Ensure menu toggle button visible on mobile

### 3b. ComponentsSidebar (`src/components/layout/ComponentsSidebar.tsx`)
- Already has mobile drawer behavior with backdrop -- verify width is `280px` on mobile
- Add a "Close" button at top-right of drawer
- Ensure drawer slides from `-280px` to `0`

### 3c. ComponentsPage (`src/pages/ComponentsPage.tsx`)
- Add a horizontal category filter pill strip below search on mobile
- Component cards grid: single column on mobile (`grid-cols-1`), 2 columns on tablet+
- `ml-0` on mobile (no sidebar offset), `lg:ml-[220px]`

### 3d. BlocksPage (`src/pages/BlocksPage.tsx`)
- Pro banner: `flex-col gap-2 text-center p-3` on mobile, button full width
- Block cards: `min-h-[400px]` on mobile (from 560px)
- On mobile, replace miniaturized scale previews with a static placeholder card showing block name, category label, placeholder lines, and "Preview on desktop" text

### 3e. ComponentCard (`src/components/ComponentCard.tsx`)
- Preview area: `min-h-[240px]` on mobile (from 280px)
- Code area: `max-h-[240px]`, `text-[11px]`, `overflow-x-auto` for horizontal scroll

---

## Phase 4: Component Preview Mobile Fixes

### 4a. Text components
- Apply responsive font sizes using Tailwind classes (`text-xl sm:text-2xl` etc.) or CSS clamp
- Files: `TextReveal.tsx`, `ScrambleText.tsx`, `GradientText.tsx`, `CountingNumbers.tsx`, `Typewriter.tsx`, `WordByWordReveal.tsx`

### 4b. Card components
- `TiltCard.tsx`: Disable tilt on touch devices (check `useIsTouch`), show static card with entrance animation only. Reduce width to `max-w-[240px]` on mobile.
- `MagneticCard.tsx`: Disable magnetic effect on touch
- `MagneticButton.tsx`: Disable magnetic effect on touch, add tap scale animation instead

### 4c. Image components
- `InfiniteGallery.tsx`: Reduce item sizes on mobile
- `HoverRevealImage.tsx`: Tap-to-show on touch devices
- `ParticleField.tsx`: Reduce particle count from 80 to 40 on mobile via `useIsMobile`

### 4d. Background components
- `AuroraBackground.tsx`: Reduce blob sizes by 30% on mobile
- `FloatingOrbs.tsx`: Reduce orb sizes by 30% on mobile

---

## Phase 5: Section Component Mobile Fixes

### 5a. MarqueeStatementSection (`src/components/ui-showcase/MarqueeStatementSection.tsx`)
- Two column to single column on mobile: `flex-col`
- Left sticky column becomes static, `mb-6`
- Heading: `text-[1.6rem]` on mobile
- Marquee font: `clamp(1.8rem, 7vw, 5.5vw)`

### 5b. BentoGridSection (`src/components/ui-showcase/BentoGridSection.tsx`)
- Below 768px: replace CSS grid with a swipeable card carousel
- 6 cards, `w-[85vw]`, touch-to-swipe with GSAP snap
- Dot indicators and prev/next arrows below
- Tablet: 2-column grid, Cell B auto-span
- Each card shows full content in vertical layout

### 5c. CinematicTextImageReveal (`src/components/ui-showcase/CinematicTextImageReveal.tsx`)
- Stack vertically on mobile: left half 100% width, right half 100% width
- Hide vertical divider, add horizontal divider between halves
- Heading: `text-[1.5rem]` on mobile
- Decorative number: `text-[5rem]` on mobile
- Inner framed box: `w-[85%] h-[140px]`

### 5d. TestimonialTicker (`src/components/ui-showcase/TestimonialTicker.tsx`)
- Quote text: `text-[1rem]` on mobile
- Otherwise works well on mobile as-is

### 5e. ProcessStepsAccordion (`src/components/ui-showcase/ProcessStepsAccordion.tsx`)
- Two column to single column on mobile
- Left column: static, `mb-6`, counter `text-[3rem]`
- Right accordion: full width

### 5f. PricingCards (`src/components/ui-showcase/PricingCards.tsx`)
- 3-column grid to single column on mobile
- Tablet: 2 columns (Starter + Pro), Team full width below
- Each card full width on mobile

---

## Phase 6: Tablet Adjustments (640-1024px)

Applied inline with Tailwind `md:` and `lg:` breakpoints throughout all changes above:
- Landing navbar: show nav links, keep CTA button, hide hamburger
- Showcase grid: 3 columns
- Sidebar: permanent at 180px width on tablet
- Component cards: 2-column grid
- Bento grid: 2-column grid
- Block previews: show miniaturized scale(0.28)

---

## Technical Notes

- All changes use Tailwind's `sm:`, `md:`, `lg:` breakpoints where possible
- Touch detection via `window.matchMedia("(hover: none)")` for disabling magnetic/tilt/hover effects
- The `useIsTouch` / `useIsMobile` hooks will be the primary mechanism for conditional behavior in JS
- GSAP entrance and loop animations remain untouched
- Hover-only GSAP animations (magnetic, tilt, card hover lifts) are disabled on touch via the hook
- The Bento Grid mobile carousel uses touch event listeners (`touchstart`, `touchmove`, `touchend`) with GSAP snap animations

