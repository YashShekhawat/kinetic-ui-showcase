

# Detailed Docs Section + Full Component Code

## Problem

1. **The docs (Getting Started) section is too minimal** -- just 3 short steps with no real guidance on how to use the components in a real project.
2. **The "Code" tab is inconsistent and incomplete** -- some components (like Text Reveal) show full copy-pasteable React code, but most (Cards, Buttons, Loaders, Scroll, etc.) only show small GSAP animation snippets. Users can't actually copy and use those.

## Solution

### Part 1: Expand the Getting Started / Docs section

Transform the current 3-step section into a comprehensive guide with these subsections:

**Step 1 -- Install dependencies** (existing, keep as-is)

**Step 2 -- Setup smooth scroll** (existing, keep as-is)

**Step 3 -- How to use a component** (NEW -- detailed guide)
- Explain that each component is a self-contained React component file
- Show a real example: copying `TextReveal.tsx` into a project
- Code block showing: creating the file, importing it, and rendering it in JSX
- Mention that components only need `gsap` as a dependency (no special wrapper needed)

**Step 4 -- Customization guide** (NEW)
- Show how to change text content, colors, timing, and easing
- A before/after code snippet showing how to modify props like `duration`, `stagger`, `ease`
- Explain GSAP cleanup pattern (`gsap.context` + `ctx.revert()`)

**Step 5 -- Project structure recommendation** (NEW)
- Suggest folder structure: `/components/animations/TextReveal.tsx`
- Brief note on TypeScript types (all components are typed)

Each subsection uses the existing `CodeBlock` component with the same dark styling.

### Part 2: Provide full component code in every Code tab

Update ALL section files to include the **complete, self-contained React component code** (imports, component definition, export) instead of just GSAP snippets. This means updating the `code` string in:

- **CardsSection.tsx** -- 4 components (SpotlightCard, TiltCard, BorderGlowCard, MagneticCard)
- **ButtonsSection.tsx** -- 6 components (LiquidFill, ArrowSlide, MagneticPill, Shatter, BorderDraw, Loading)
- **ImagesSection.tsx** -- 4 components
- **ScrollSection.tsx** -- 3 components
- **CursorSection.tsx** -- 3 components
- **HeroComponentsSection.tsx** -- 3 components
- **LoadersSection.tsx** -- 6 components
- **BackgroundsSection.tsx** -- 6 components

The TextSection already has full code for some components, but Word by Word Reveal, Counting Numbers, and Gradient Text only have snippets -- those will be updated too.

The full code will be pulled directly from each component's actual source file (e.g., `SpotlightCard.tsx`), ensuring what users copy is exactly what works.

### Part 3: Update sidebar navigation

Add new sidebar entries under "Getting Started":
- Introduction (existing)
- Usage Guide (new, links to the expanded section)

---

## Technical Details

**Files to modify:**
- `src/components/sections/GettingStarted.tsx` -- expand with usage guide, customization, and structure sections
- `src/components/sections/CardsSection.tsx` -- replace snippet `code` strings with full component source
- `src/components/sections/ButtonsSection.tsx` -- same
- `src/components/sections/ImagesSection.tsx` -- same
- `src/components/sections/ScrollSection.tsx` -- same
- `src/components/sections/CursorSection.tsx` -- same
- `src/components/sections/HeroComponentsSection.tsx` -- same
- `src/components/sections/LoadersSection.tsx` -- same
- `src/components/sections/BackgroundsSection.tsx` -- same
- `src/components/sections/TextSection.tsx` -- update the 3 components that only have snippets
- `src/pages/Index.tsx` -- update sidebar sections array if needed

**No new dependencies required.**

**Design consistency:** All new docs content uses the same CodeBlock component, same fonts (Syne for headings, Inter for body, JetBrains Mono for code), same color tokens, and same numbered-step pattern already established.
