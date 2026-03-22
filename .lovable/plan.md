

## Copy for Framer — Implementation Plan

### Overview
Add a "Copy for Framer" button next to the existing "Copy" button in the Code tab of block cards. It transforms the raw source code into Framer-compatible code (CDN imports, property controls) and copies it to clipboard.

### Files to Change

**1. Create `src/lib/toFramerCode.ts`** — Paste the provided utility file as-is (exports `toFramerCode`, `FramerProp` type, etc.)

**2. Update `src/config/components.config.ts`**
- Import `FramerProp` from `@/lib/toFramerCode`
- Add `framerProps?: FramerProp[]` to `ComponentConfig` interface

**3. Update `src/config/blocks.registry.ts`**
- Add `framerProps` arrays to the 3 preloader entries only:
  - `curtain-preloader`: brandName + tagline
  - `grid-reveal-preloader`: brandName + tagline + cols + rows
  - `slice-text-preloader`: brandName + eyebrow + slices
- No changes to any other block entries

**4. Update `src/components/ComponentCard.tsx`**
- Add new props: `framerProps?: FramerProp[]`, `blockId?: string`
- Import `toFramerCode` and `FramerProp` from `@/lib/toFramerCode`
- Import `toast` from `@/hooks/use-toast`
- Add a `toComponentName` helper inline
- In the Code tab section (line ~217-227), add a "Copy for Framer" button next to the existing "Copy" button, only when `framerProps?.length > 0`
- On click: generate Framer code via `toFramerCode(code, componentName, framerProps)`, copy to clipboard, show "Copied for Framer!" toast
- Button styled with `#06b6d4` cyan color, Framer SVG icon (14x14), matching existing copy button style

**5. Update `src/pages/BlockCategoryPage.tsx`**
- Pass `framerProps={block.framerProps}` and `blockId={block.id}` to `ComponentCard` (lines 508-521)
- Also pass the raw (unstripped) source code for Framer generation — add a new prop `rawCode` that uses the original source before `getCode` strips `@preview-only` sections. The `toFramerCode` function needs the clean production code, so we reuse `mapped.code` (which already strips preview-only).

### Button Placement
The "Copy for Framer" button sits to the left of the existing "Copy" button inside the Code tab's `<div>` at the top-right. Both buttons are `absolute top-3` positioned — existing Copy stays `right-3`, Framer button at `right-[120px]` or use a flex wrapper for both buttons.

### Pro Gating
The Framer button lives inside the existing `<ProGate>` wrapper, so it's automatically hidden for locked Pro blocks.

