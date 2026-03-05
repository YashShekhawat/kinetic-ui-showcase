# Adding Components & Blocks

Use the CLI script to add new components or blocks to Kinetic UI.

## Prerequisites

- Node.js installed
- Project dependencies installed (`npm install`)

## Command

```bash
npm run add -- --name "<Name>" --id "<slug>" --category "<category>" --code <path-to-file> [options]
```

## Required Flags

| Flag         | Description                          | Example              |
| ------------ | ------------------------------------ | -------------------- |
| `--name`     | Display name of the component        | `"Bounce Button"`    |
| `--id`       | Unique slug (kebab-case)             | `"bounce-button"`    |
| `--category` | Category slug                        | `"buttons"`          |
| `--code`     | Path to the `.tsx` source file       | `./tmp/BounceButton.tsx` |

## Optional Flags

| Flag          | Default       | Description                                      |
| ------------- | ------------- | ------------------------------------------------ |
| `--type`      | `component`   | `"component"` or `"block"`                       |
| `--pro`       | `false` (components), `true` (blocks) | Mark as Pro-only |
| `--new`       | `true`        | Show "NEW" badge. Pass `--new false` to disable  |
| `--dry-run`   | `false`       | Preview changes without writing files             |
| `--no-backup` | `false`       | Skip creating `.bak` backup files                 |

## Component Categories

`text` · `cards` · `buttons` · `loaders` · `images` · `backgrounds` · `cursor` · `scroll`

## Block Categories

`hero` · `features` · `social-proof` · `pricing` · `process` · `content`

---

## Step-by-Step: Adding a Component

### 1. Create the source file

Create a `.tsx` file with your component. Example `tmp/BounceButton.tsx`:

```tsx
import { useRef } from 'react';
import gsap from 'gsap';

const BounceButton = () => {
  const btnRef = useRef<HTMLButtonElement>(null);

  const handleClick = () => {
    gsap.fromTo(btnRef.current, { scale: 0.85 }, { scale: 1, duration: 0.4, ease: 'elastic.out(1, 0.4)' });
  };

  return (
    <button ref={btnRef} onClick={handleClick} className="px-6 py-3 bg-white text-black rounded-lg font-medium">
      Click Me
    </button>
  );
};

export default BounceButton;
```

### 2. (Optional) Separate preview code from display code

If you want the "Code" tab to show different code than the actual component file, add a `// ---CODE---` marker. Everything **above** it is the real component; everything **below** is the code string shown in the UI:

```tsx
// ... full component code here ...

export default BounceButton;

// ---CODE---
// This part is what users see when they click "Code"
const BounceButton = () => {
  // simplified version...
};
```

If you skip the marker, the entire file is used as both the component and the displayed code.

### 3. Dry run (recommended)

Preview what the script will do without modifying any files:

```bash
npm run add -- --name "Bounce Button" --id "bounce-button" --category "buttons" --code ./tmp/BounceButton.tsx --dry-run
```

### 4. Run for real

```bash
npm run add -- --name "Bounce Button" --id "bounce-button" --category "buttons" --code ./tmp/BounceButton.tsx
```

### 5. Verify

The script automatically:

1. **Creates** `src/components/ui-showcase/BounceButton.tsx`
2. **Registers** the component in `src/config/components.config.ts`
3. **Wires** it into the matching section file (e.g., `ButtonsSection.tsx`)
   - If the category is new, it creates a new section file and updates `ComponentsPage.tsx`

---

## Step-by-Step: Adding a Block

```bash
npm run add -- --name "Stats Grid" --id "stats-grid" --category "features" --type block --code ./tmp/StatsGrid.tsx
```

This will:

1. **Create** `src/components/ui-showcase/StatsGrid.tsx`
2. **Register** it in `components.config.ts` under the `blocks` array
3. **Wire** it into `BlocksPage.tsx` (import + map entry)

> Blocks default to `isPro: true`. Pass `--pro false` to make it free.

---

## Adding a New Category

If you use a category that doesn't exist yet, the script automatically:

- Adds a `// CATEGORY` comment block in the config
- Creates a label in `categoryLabels`
- Appends to `componentCategories` or `blockCategories`
- Generates a new section file (for components)
- Updates `ComponentsPage.tsx` with the import and render

---

## Backups

By default, the script creates `.bak` copies of every file it modifies. Use `--no-backup` to skip this.

---

## Troubleshooting

| Error | Cause |
|---|---|
| `Missing required flag --name` | A required flag was not provided |
| `ID "x" already exists` | The `--id` is already registered in the config |
| `File already exists: ...` | A showcase file with that PascalCase name already exists |
| `Code file not found` | The `--code` path doesn't point to an existing file |
