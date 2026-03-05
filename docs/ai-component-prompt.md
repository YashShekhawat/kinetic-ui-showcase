# AI Prompt Guide — Creating Components for Kinetic UI

Use this document as a system prompt or reference when asking Gemini, Claude, or any AI to generate components/blocks for the Kinetic UI project. Components generated following these rules will work out-of-the-box with the `npm run add` CLI script.

---

## 1. File Structure & Export

- **One default export per file.** The component name must be PascalCase.
- **No named exports, no barrel files.**
- The file must be a self-contained `.tsx` file.

```tsx
const MyComponent = () => {
  // ...
  return <div>...</div>;
};

export default MyComponent;
```

---

## 2. Animation Library — GSAP Only

- **Use GSAP for ALL animations.** Do NOT use Framer Motion, CSS keyframes, or CSS transitions for any meaningful animation.
- Import from `gsap` directly:
  ```tsx
  import gsap from 'gsap';
  ```
- For scroll-triggered animations, use GSAP's ScrollTrigger (already available in the project).
- Always clean up animations in `useEffect` return:
  ```tsx
  useEffect(() => {
    const ctx = gsap.context(() => {
      // animations here
    }, containerRef);
    return () => ctx.revert();
  }, []);
  ```
- For looping/repeating animations that don't use `gsap.context`, kill tweens manually:
  ```tsx
  return () => {
    tl.kill();
    gsap.killTweensOf(element);
  };
  ```

---

## 3. Fonts

The project uses three fonts. Use the corresponding Tailwind classes:

| Font           | Tailwind Class | Usage                        |
| -------------- | -------------- | ---------------------------- |
| Syne           | `font-syne`    | Headings, display text       |
| Inter          | `font-inter`   | Body text, descriptions      |
| JetBrains Mono | `font-mono`    | Code snippets, labels, badges |

**Never use arbitrary font-family values.** Always use these three.

---

## 4. Color System

### Tailwind Utility Classes (preferred)

Use the `kinetic-*` color tokens defined in tailwind config:

| Token                    | Hex       | Usage                          |
| ------------------------ | --------- | ------------------------------ |
| `text-kinetic-text`      | `#ededed` | Primary text                   |
| `text-kinetic-text-muted`| `#606070` | Secondary/muted text           |
| `text-kinetic-text-dim`  | `#353548` | Very subtle text               |
| `bg-kinetic-bg`          | `#060608` | Deepest background             |
| `bg-kinetic-bg-card`     | `#0d0d12` | Card/container background      |
| `bg-kinetic-bg-hover`    | `#13131e` | Hover state background         |
| `border-kinetic-border`  | `#1a1a2e` | Standard border color          |
| `text-kinetic-accent`    | `#7c3aed` | Primary accent (purple)        |
| `text-kinetic-accent-light` | `#a78bfa` | Lighter accent              |
| `text-kinetic-green`     | `#22c55e` | Success/positive color         |

### Inline Styles (when Tailwind can't express it)

When using inline `style={{}}` (e.g., for GSAP-animated properties, gradients, radial gradients), use the **exact hex values** from the depth system:

| Layer    | Hex       | Purpose                 |
| -------- | --------- | ----------------------- |
| L0       | `#0e0e14` | Page background         |
| L1       | `#13131e` | Even section background |
| L2       | `#1a1a28` | Card background         |
| L3       | `#12121e` | Inner elements          |
| L4       | `#1c1c2a` | Hover states            |
| L5       | `#1e1e35` | Active/focus            |
| Border   | `#2a2a3e` | Card borders            |
| Divider  | `#222235` | General dividers        |
| Text     | `#f0ede8` | Primary text (alt)      |
| Accent   | `#7c3aed` | Purple accent           |
| Accent Lt| `#a78bfa` | Light purple            |
| Green    | `#22c55e` | Success green           |

### ❌ Never Do
- Don't use `text-white`, `bg-black`, `text-gray-500`, or any default Tailwind color.
- Don't use colors outside the palette above.
- Don't use `bg-background` or `text-foreground` inside showcase components (these are for the app shell, not previews).

---

## 5. Component Types

### UI Components (type: `component`)

These are small, self-contained animation primitives displayed in a **280px tall preview card**.

**Rules:**
- Must be visually centered and fit within ~280px height.
- Should auto-animate (loop or trigger on mount). The user shouldn't need to interact to see the effect.
- No external dependencies beyond `gsap` and React.
- No images unless the component is in the `images` category — use colored divs, SVGs, or shapes instead.
- Keep the DOM minimal.

**Categories:** `text`, `cards`, `buttons`, `loaders`, `images`, `backgrounds`, `cursor`, `scroll`

**Example — small component:**
```tsx
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const PulseButton = () => {
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(ref.current, {
        scale: 1.05,
        boxShadow: '0 0 20px rgba(124,58,237,0.4)',
        duration: 0.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <button
      ref={ref}
      className="px-6 py-3 rounded-md font-syne font-bold text-sm text-kinetic-text"
      style={{ background: '#7c3aed', border: 'none' }}
    >
      Pulse
    </button>
  );
};

export default PulseButton;
```

### Blocks (type: `block`)

These are full-width, multi-element **page sections** (heroes, feature grids, pricing, testimonials, etc.). They render at their natural height.

**Rules:**
- Should be responsive. Use the `useIsMobile()` hook for mobile adaptations:
  ```tsx
  import { useIsMobile } from '@/hooks/use-mobile';
  ```
- Must include `pointerEvents: 'none'` on the outermost wrapper (since blocks are rendered inside a preview container). Add `pointerEvents: 'auto'` on any interactive elements (buttons, links) that need to be clickable.
- Max-width container: use `maxWidth: 1200` or `maxWidth: 960` with `margin: '0 auto'`.
- Blocks can be more complex (100-400 lines) with multiple animated sections.
- Use `data-preview="true"` on the root element to disable the custom cursor.

**Categories:** `hero`, `features`, `social-proof`, `pricing`, `process`, `content`

---

## 6. The `// ---CODE---` Marker

When writing a component file for the CLI script, you can split the file into two parts using the `// ---CODE---` marker:

```tsx
// Everything ABOVE this marker → saved as the actual component file
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const MyComponent = () => {
  // ... full component code
};

export default MyComponent;
// ---CODE---
// Everything BELOW this marker → displayed in the UI's "Code" tab
// This is what users copy-paste. Simplify/clean up if needed.
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const MyComponent = () => {
  // ... simplified or identical code
};

export default MyComponent;
```

If no `// ---CODE---` marker is present, the entire file content is used for both the preview AND the code display.

**For most components, you don't need the marker** — just write the component normally and the full source will be shown in the Code tab.

---

## 7. Styling Conventions

- **Inline styles for GSAP targets.** Properties that GSAP will animate should be set via `style={{}}`, not Tailwind.
- **Tailwind for layout and static styles.** Use `className` for positioning, spacing, font, overflow, etc.
- **Rounded corners:** use `rounded-md` or `rounded-lg` (not arbitrary values).
- **Card pattern:**
  ```tsx
  style={{ background: '#0d0d12', border: '1px solid #1a1a2e', borderRadius: 8 }}
  ```
- **Label/badge pattern:**
  ```tsx
  <span
    className="font-mono text-[10px] px-3 py-1 rounded"
    style={{
      color: '#a78bfa',
      letterSpacing: '0.2em',
      border: '1px solid rgba(124,58,237,0.2)',
      background: 'rgba(124,58,237,0.06)',
    }}
  >
    LABEL
  </span>
  ```
- **Purple gradient:** `linear-gradient(135deg, #7c3aed, #a78bfa)`
- **Purple glow:** `rgba(124,58,237,0.08)` to `rgba(124,58,237,0.25)` depending on intensity.

---

## 8. Refs & TypeScript

- Always type refs: `useRef<HTMLDivElement>(null)`
- Use `React.MouseEvent`, `React.TouchEvent` for event handlers.
- Component function signature: `const Name = () => { ... }` (no React.FC).
- No props needed — showcase components are self-contained with no external props.

---

## 9. Responsive Design (Blocks only)

```tsx
import { useIsMobile } from '@/hooks/use-mobile';

const MyBlock = () => {
  const isMobile = useIsMobile();

  return (
    <div style={{ padding: isMobile ? '48px 20px' : '96px 48px' }}>
      <h1
        className="font-syne font-extrabold"
        style={{ fontSize: isMobile ? '2rem' : '4rem' }}
      >
        Heading
      </h1>
    </div>
  );
};
```

- Small components do NOT need mobile responsiveness (they're rendered in fixed-size cards).

---

## 10. Common Patterns

### Looping timeline
```tsx
const tl = gsap.timeline({ repeat: -1, repeatDelay: 2 });
```

### Staggered entrance
```tsx
gsap.fromTo('.my-items', { opacity: 0, y: 20 }, {
  opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out'
});
```

### Mouse-follow effect
```tsx
const onMove = (e: React.MouseEvent) => {
  const rect = ref.current!.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  gsap.to(target.current, { x, y, duration: 0.3, ease: 'power2.out' });
};
```

### GSAP class selectors
- Prefix class names with a short unique id to avoid collisions: `kh-`, `tr-`, `sf-`, etc.
- Example: `.kh-line-inner`, `.tr-word-inner`

---

## 11. What NOT to Do

| ❌ Don't                                    | ✅ Do Instead                              |
| ------------------------------------------- | ------------------------------------------ |
| Use Framer Motion                           | Use GSAP                                   |
| Use CSS `@keyframes`                        | Use GSAP timelines                         |
| Use `text-white`, `bg-gray-900`             | Use `text-kinetic-text`, kinetic tokens    |
| Use random fonts                            | Use `font-syne`, `font-inter`, `font-mono` |
| Accept props                                | Self-contained, no props                   |
| Use images in non-image components          | Use SVGs, colored divs, shapes             |
| Use `useState` for animations               | Use GSAP refs and timelines                |
| Forget cleanup in useEffect                 | Always `ctx.revert()` or `tl.kill()`       |
| Use named exports                           | Use `export default ComponentName`          |
| Use `React.FC`                              | Use `const Name = () => {}`                |

---

## 12. Quick Checklist Before Using the CLI Script

- [ ] File is `.tsx` with a single default export
- [ ] Component name is PascalCase
- [ ] Only uses GSAP for animations
- [ ] Uses `font-syne`, `font-inter`, or `font-mono` for fonts
- [ ] Colors match the kinetic palette (no `text-white`, `bg-black`)
- [ ] Animations clean up in `useEffect` return
- [ ] For blocks: uses `useIsMobile()`, has `pointerEvents: 'none'` on root
- [ ] No external dependencies beyond `gsap` and React hooks
- [ ] Works self-contained with no props

---

## 13. Example CLI Usage

```bash
# UI Component
npm run add -- \
  --name "Pulse Button" \
  --id "pulse-button" \
  --category "buttons" \
  --code ./tmp/PulseButton.tsx

# Block
npm run add -- \
  --name "Stats Grid" \
  --id "stats-grid" \
  --category "features" \
  --type block \
  --code ./tmp/StatsGrid.tsx

# Dry run (preview changes without writing)
npm run add -- \
  --name "Pulse Button" \
  --id "pulse-button" \
  --category "buttons" \
  --code ./tmp/PulseButton.tsx \
  --dry-run
```
