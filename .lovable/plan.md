

# Fix Pro Unlock UI — Implementation Plan

## 5 files to modify

### 1. `src/components/layout/TopBar.tsx`
**CHANGE 1 — Hide PRO labels when unlocked**
- Line 99: Change condition from `PRO_CONFIG.proModeEnabled` to `PRO_CONFIG.proModeEnabled && !proUnlocked` for the PRO badge next to "Blocks" (both desktop line 99 and mobile line 211)
- The "Upgrade to Pro" button (line 175-183) already only shows when `!proUnlocked` — no change needed
- The PRO status badge popover (line 141-173) stays as-is — correct behavior

### 2. `src/pages/BlockCategoryPage.tsx`
**CHANGE 1 — Hide "PRO" in block count (rightText)**
- Lines 244-253: When `proUnlocked`, show just `catBlocks.length + " blocks"` without the "· PRO" suffix. Use `usePro` hook instead of static `isProUnlocked()` for reactivity.

**CHANGE 3 — Banner text when unlocked vs locked**
- Lines 269-308: Replace entire pro banner with conditional:
  - If `proUnlocked`: Show friendly confirmation with violet-tinted bg (`rgba(124,58,237,0.08)`), checkmark icon, text "You have access to all Pro blocks. Happy coding! 🚀" in `#a78bfa`. No lock icon, no button.
  - If not unlocked: Keep existing banner but fix alignment with `flex items-center justify-between` on a single row. Lock icon + text on left, button pushed right.

**Code reactivity**: Import `usePro` hook, use `isPro` state instead of calling `isProUnlocked()` directly so UI updates on unlock without reload. Also update `getCode` to accept a `proUnlocked` parameter instead of calling `isProUnlocked()` at module level (the `blockComponentMap` must be built inside the component or use a function that checks current state).

### 3. `src/components/ProGate.tsx`
**CHANGE 4 — Fix overlay layout + two styled buttons**
- Replace the overlay div: use `rgba(10,10,20,0.85)` bg with `backdrop-filter: blur(2px)`
- Stack items in column with `gap-3` (12px), centered vertically/horizontally
- Button 1 (primary): `<a>` tag with checkout URL, `lemonsqueezy-button` class, full width, solid violet bg, white text, `rounded-lg`, `py-2.5 px-5`
- Button 2 (secondary): `<button>` tag, "Already have a key?", transparent bg, `border: 1px solid #7c3aed`, violet text `#a78bfa`, full width, `rounded-lg`, hover bg `rgba(124,58,237,0.1)`
- Remove the old "Enter License Key" text link style

**CHANGE 5 — Code tab locked state**
- When `isLocked`, instead of rendering blurred children, render a centered message panel:
  - PRO badge, headline "Purchase Pro to access the source code", subtext "Previews are always free. The full source code is available with Pro access."
  - Same two buttons as the overlay
- Remove the blur/children rendering entirely when locked

### 4. `src/components/ComponentCard.tsx`
**CHANGE 5 — Code tab uses ProGate's new locked message**
- The ProGate wrapping on line 243 already handles this — once ProGate is updated to show the centered message instead of blurred code, this will work automatically. No changes needed here beyond ensuring `usePro` hook is used (already is).

### 5. `src/pages/PricingPage.tsx`
**CHANGE 2 — Pricing page when unlocked**
- Import `usePro` hook (already imported)
- In the PRO card section: wrap the CTA area in a conditional on `isPro`:
  - If unlocked: Show green checkmark SVG + "You have Pro access" text in green/violet, subtext "You're all set. Every component and block is unlocked." Hide "Already purchased?" link.
  - If not unlocked: Keep existing CTA button and "Already purchased?" link as-is.

## Reactivity note
All checks will use the `usePro()` hook's `isPro` state rather than direct `isProUnlocked()` calls, ensuring the UI updates immediately when a user activates their license via the modal without needing a page reload. The one exception is `blockComponentMap` code resolution in BlockCategoryPage — this will be refactored to compute code inside the render using a helper function that accepts the current pro state.

