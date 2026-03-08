

# Admin Panel Implementation Plan

## Overview
Build a password-protected admin panel at `/admin` that uses the GitHub API to add components/blocks directly to the repo. The panel mirrors the logic in `scripts/add-component.mjs` but operates via GitHub's Contents API instead of the filesystem.

## Files to Create

### 1. `src/lib/github.ts` — GitHub API helper
- `getFile(path)` — fetches file content + SHA via GitHub Contents API
- `putFile(path, content, message, sha?)` — creates/updates files
- `getRecentCommits(count)` — fetches last N commits for the activity log
- Uses `import.meta.env.VITE_GITHUB_TOKEN`, `VITE_GITHUB_REPO`, `VITE_GITHUB_BRANCH`
- Install `js-base64` package for Base64 encoding/decoding

### 2. `src/lib/adminUtils.ts` — Component registration logic
- Port of `scripts/add-component.mjs` using GitHub API instead of `fs`
- `addComponentToRepo(opts)` — orchestrates: write component file, update registry file (`components.registry.ts` or `blocks.registry.ts`), update `BlockCategoryPage.tsx` (for blocks) or section files (for components)
- Key difference from the CLI script: registry files are separate (`components.registry.ts` / `blocks.registry.ts`), not a single `components.config.ts` — the admin utils must target the correct registry file
- `previewChanges(opts)` — dry-run that returns descriptions of what would change without committing

### 3. `src/pages/AdminPage.tsx` — Full admin UI
**Password gate:**
- Centered login screen, checks input against `import.meta.env.VITE_ADMIN_PASSWORD`
- Stores auth in `sessionStorage('admin_auth')`
- Dark design matching site theme

**Two-column layout (after auth):**

**Left sidebar (260px):**
- Fetches `components.registry.ts` and `blocks.registry.ts` from GitHub API on mount
- Parses the arrays to extract component/block entries
- Displays grouped by category with name, category pill, PRO badge
- Refresh button to re-fetch
- Total counts at bottom

**Right main area:**
- "Add New Component / Block" form with fields:
  - Name (text) — auto-generates kebab-case ID
  - ID (text, editable)
  - Category (input with datalist, suggestions change based on type)
  - Type (radio: Component | Block)
  - isPro toggle (default ON for blocks, OFF for components)
  - isNew toggle (default ON)
  - Code (monospace textarea, min-height 400px)
- "Preview Changes" button — shows modal listing files to create/update
- "Add to Repository" submit button — calls `addComponentToRepo()`
- Success/error feedback panel
- Recent commits log (last 5 from GitHub API)

**Validation:**
- Name not empty
- ID matches `/^[a-z0-9-]+$/`
- Category not empty
- Code not empty and contains `export default`
- Inline red errors per field

## File to Modify

### 4. `src/App.tsx` — Add route
- Import `AdminPage`, add `<Route path="/admin" element={<AdminPage />} />`
- No navigation link added anywhere

## Technical Details

- **Registry targeting**: The CLI script targets `components.config.ts` but the actual data lives in `components.registry.ts` and `blocks.registry.ts`. The admin utils will target these files directly, matching the array format (`export const components/blocks: ComponentConfig[] = [...]`)
- **Block page updates**: For blocks, also updates `BlockCategoryPage.tsx` — adds lazy import, raw import, and map entry (same logic as CLI script lines 337-397)
- **Component section updates**: For components, updates the matching section file in `src/components/sections/` — adds import + raw import + array entry (same logic as CLI script lines 202-310)
- **File path convention**: Showcase files go to `src/components/ui-showcase/blocks/{category}/` for blocks and `src/components/ui-showcase/components/{category}/` for components (matching the current nested structure)
- **Error handling**: All GitHub API calls wrapped in try/catch with user-facing error messages for invalid token, rate limiting, file conflicts
- **Security**: `VITE_GITHUB_TOKEN` is never displayed in UI; password gate uses sessionStorage (cleared on tab close)

