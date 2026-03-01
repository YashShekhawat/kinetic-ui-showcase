

# CLI Script to Auto-Add Components and Blocks

Yes, this is absolutely possible! We'll create a Node.js CLI script you can run locally from your terminal. It will handle all the file creation and wiring automatically.

---

## What the script does

When you run it, it will:
1. Create the component file in `src/components/ui-showcase/`
2. Register it in `src/config/components.config.ts`
3. Add it to the correct section file (e.g., `TextSection.tsx`, `ButtonsSection.tsx`)
4. For blocks: wire it into `BlocksPage.tsx` with proper imports and map entry

All from a single command.

---

## How you'll use it

**Adding a component:**
```bash
node scripts/add-component.mjs \
  --name "Bounce Button" \
  --id "bounce-button" \
  --category "buttons" \
  --code ./my-bounce-button-code.tsx \
  --pro false \
  --new true
```

**Adding a block:**
```bash
node scripts/add-component.mjs \
  --name "Stats Grid" \
  --id "stats-grid" \
  --category "features" \
  --type block \
  --code ./my-stats-grid-code.tsx \
  --pro true \
  --new true
```

The `--code` flag points to a file containing the full component source code (the JSX/TSX that renders the preview AND the code string shown in the code tab).

---

## What gets created/modified

### For a component (e.g. "Bounce Button" in "buttons"):

| Action | File |
|--------|------|
| **Create** | `src/components/ui-showcase/BounceButton.tsx` (the preview component) |
| **Modify** | `src/config/components.config.ts` -- adds entry to `components` array |
| **Modify** | `src/components/sections/ButtonsSection.tsx` -- adds import, adds to array with code string |

### For a block (e.g. "Stats Grid" in "features"):

| Action | File |
|--------|------|
| **Create** | `src/components/ui-showcase/StatsGrid.tsx` |
| **Modify** | `src/config/components.config.ts` -- adds entry to `blocks` array |
| **Modify** | `src/pages/BlocksPage.tsx` -- adds import and `blockComponentMap` entry |

---

## Input file format

You provide a single `.tsx` file that contains:
- The default-exported React component (used for the live preview)
- A special comment block `// ---CODE---` followed by the code string to display in the Code tab

Example input file (`my-bounce-button.tsx`):
```tsx
import { useRef } from 'react';
import gsap from 'gsap';

const BounceButton = () => {
  const ref = useRef<HTMLButtonElement>(null);
  const onClick = () => {
    gsap.fromTo(ref.current, { scale: 0.9 }, { scale: 1, duration: 0.5, ease: 'elastic.out(1,0.3)' });
  };
  return (
    <button ref={ref} onClick={onClick}
      className="px-6 py-3 rounded-md font-inter font-medium text-sm text-white"
      style={{ background: '#7c3aed' }}>
      Bounce
    </button>
  );
};

export default BounceButton;

// ---CODE---
// Everything below this marker becomes the "code" string
// shown in the Code tab of the ComponentCard.
// If this marker is missing, the entire file content is used as the code string.
```

If you omit the `// ---CODE---` marker, the script uses the full file content as both the component source and the displayed code string.

---

## Technical details

### File: `scripts/add-component.mjs`

**Argument parsing:** Uses Node.js built-in `process.argv` parsing (no dependencies needed).

**Required flags:**
- `--name` : Display name (e.g. "Bounce Button")
- `--id` : Kebab-case ID (e.g. "bounce-button")
- `--category` : Must match an existing category in `components.config.ts`
- `--code` : Path to the `.tsx` input file

**Optional flags:**
- `--type` : `component` (default) or `block`
- `--pro` : `true` or `false` (default: `false` for components, `true` for blocks)
- `--new` : `true` or `false` (default: `true`)

**Step-by-step logic:**

1. **Parse args and validate** -- check all required flags, verify category exists, verify `--code` file exists

2. **Read the input file** -- split on `// ---CODE---` to get component source and code display string

3. **Create the showcase component file** -- write the component source to `src/components/ui-showcase/{PascalName}.tsx`

4. **Update `components.config.ts`** -- find the correct category comment block (e.g. `// BUTTONS`) and insert a new entry line right after the last item in that category

5. **For components: update the section file** -- the script maps categories to section files:
   ```
   text -> TextSection.tsx
   cards -> CardsSection.tsx
   buttons -> ButtonsSection.tsx
   loaders -> LoadersSection.tsx
   images -> ImagesSection.tsx
   backgrounds -> BackgroundsSection.tsx
   cursor -> CursorSection.tsx
   scroll -> ScrollSection.tsx
   ```
   It adds an import statement at the top, and appends a new entry to the section's array (e.g. `buttonComponents`) with the name, JSX element, and code string.

6. **For blocks: update `BlocksPage.tsx`** -- adds the import statement and a new entry in `blockComponentMap`.

**New category handling:** If `--category` doesn't exist yet, the script will:
- Add it to `categoryLabels`, `componentCategories` or `blockCategories` in the config
- Create a new section file from a template
- Add the section import and render call in `ComponentsPage.tsx`

### File: `scripts/templates/section.template.mjs`

A small template string used when creating a brand new section file for a new category.

---

## npm script shortcut

Add to `package.json`:
```json
"scripts": {
  "add": "node scripts/add-component.mjs"
}
```

Then usage becomes:
```bash
npm run add -- --name "Bounce Button" --id "bounce-button" --category "buttons" --code ./my-code.tsx
```

---

## Safety features

- **Duplicate check**: If the `--id` already exists in the config, the script exits with an error
- **Backup**: Before modifying any file, creates a `.bak` copy (optional, can be disabled with `--no-backup`)
- **Dry run**: `--dry-run` flag prints what would change without writing anything
- **Validation**: Checks that the category exists (or offers to create it), verifies the section file exists

---

## Summary of files to create

| File | Purpose |
|------|---------|
| `scripts/add-component.mjs` | Main CLI script (~200 lines) |
| `scripts/templates/section.template.mjs` | Template for new section files |
| Update `package.json` | Add `"add"` script shortcut |

No new dependencies required -- pure Node.js `fs` and `path` modules.

