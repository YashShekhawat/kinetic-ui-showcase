

# Lemon Squeezy Pro Unlock Flow — Implementation Plan

## Overview
Integrate Lemon Squeezy checkout overlay and a complete pro unlock flow: license activation, a pricing page, updated ProGate with checkout + license key entry, and TopBar pro status indicator.

## Files to Create/Modify

### 1. `index.html` — Add Lemon Squeezy script
Add `<script src="https://assets.lemonsqueezy.com/lemon.js" defer></script>` in `<head>`.

### 2. `src/config/proConfig.ts` — Add license helpers
Keep existing `PRO_CONFIG` object. Add four exported functions: `isProUnlocked()` (checks localStorage), `saveLicense(key)`, `revokeLicense()`, `getLicenseKey()`. Update `proPrice` from `'$19'` to `'$49'`.

### 3. `src/hooks/usePro.ts` — Create new hook
Replace the old `useProAccess.ts`. Returns `{ isPro, unlock, revoke }` using the localStorage-backed functions from proConfig. Uses `useState` seeded from `isProUnlocked()`.

### 4. `src/components/LicenseModal.tsx` — Create new file
Dark modal matching the design system. Contains:
- Text input for license key
- "Verify & Unlock" button that POSTs to `https://api.lemonsqueezy.com/v1/licenses/activate` with `{ license_key, instance_name: "kinetic-ui-web" }`
- Success: calls `onUnlock(key)`, closes modal, shows toast
- Failure: inline red error text
- Close on backdrop click or ESC

### 5. `src/components/ProGate.tsx` — Rewrite
Replace current implementation. New behavior when locked (`isPro` prop is true):
- Render children with `filter: blur(3px) brightness(0.4)`, `pointerEvents: none`
- Overlay with PRO badge, "Unlock this component" text
- Primary CTA: `<a>` tag with Lemon Squeezy checkout URL and `className="lemonsqueezy-button"` — text "Get Pro Access — $49"
- Secondary: "Enter License Key" outline button opening LicenseModal
- When unlocked: render children normally

### 6. `src/components/ComponentCard.tsx` — Wire ProGate
- Add `isPro` to `ComponentCardProps`
- Import `usePro` hook, call it inside the component
- Wrap the code tab content (not preview) with ProGate when `isPro && !proUnlocked`
- The preview tab remains always visible (per existing behavior: "Previews are free")

### 7. `src/pages/PricingPage.tsx` — Create new page
Dark page with:
- Hero: "SIMPLE PRICING" eyebrow, "One price. Everything unlocked." headline, subtitle
- Two cards side by side (FREE / PRO with violet glow on PRO)
- FREE card: $0, feature list, "Browse Components" CTA → /components
- PRO card: $49 one-time, feature list, Lemon Squeezy `<a>` checkout button, "Already purchased?" → LicenseModal
- FAQ accordion (6 items) using existing Accordion components, styled dark with violet accents

### 8. `src/components/layout/TopBar.tsx` — Add pricing nav + pro status
- Add "Pricing" nav button → `/pricing`
- If not pro: show "Upgrade to Pro" violet outline button → `/pricing`
- If pro: show "PRO" violet pill badge. On click, show popover with masked license key and "Revoke License" button

### 9. `src/App.tsx` — Add route
Import `PricingPage`, add `<Route path="/pricing" element={<PricingPage />} />`.

### 10. `src/pages/BlockCategoryPage.tsx` — Wire isPro prop
Pass `isPro={block.isPro}` to each `ComponentCard`. Update the pro banner CTA to be a Lemon Squeezy `<a>` checkout link.

### 11. Cleanup
- Delete `src/hooks/useProAccess.ts` (replaced by `usePro.ts`)
- Update any remaining imports of `useProAccess`

## Technical Notes
- The `lemonsqueezy-button` class on `<a>` tags auto-triggers the overlay checkout via `lemon.js` — no extra JS needed
- License validation uses a public Lemon Squeezy endpoint (no API key required)
- Pro state is stored in localStorage — this is intentional per the user's design (client-side paywall for a component library, not a SaaS app)
- The `getCode()` function in BlockCategoryPage already handles code visibility based on `PRO_CONFIG.proModeEnabled` — it will also need to check `isProUnlocked()` so unlocked users see real code

