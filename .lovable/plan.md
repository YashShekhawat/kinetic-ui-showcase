## Goal
Free blocks should never trigger sign-in or a Supabase edge-function call. Only Pro blocks should require auth to fetch source code.

## Current behavior (bug)
In `src/components/ComponentCard.tsx`:
- Clicking the **Code** tab calls `fetchProCode()` for any block with a `blockId`, even free ones.
- The `<SyntaxHighlighter>` renders `proCode ?? '// Loading source code...'` for every block with a `blockId`, ignoring the already-bundled `code` prop for free blocks.
- `fetchProCode()` opens the AuthModal when there's no session — so free blocks prompt sign-in.

## Change
Gate all Pro-code logic behind `isProBlock && !proUnlocked`. Free blocks keep using the local `code` prop that's already imported via Vite's `?raw`.

### Edits in `src/components/ComponentCard.tsx`
1. **Tab click handler** (~line 380-389): only call `fetchProCode()` when `isProBlock && !proUnlocked`.
   ```tsx
   if (t === 'code' && isBlock && blockId && isProBlock && !proUnlocked && !hasFetched.current) {
     fetchProCode();
   }
   ```
2. **Code renderer** (~line 534-536): only substitute `proCode` when the block is a locked Pro block; otherwise render the bundled `code`.
   ```tsx
   {isBlock && blockId && isProBlock && !proUnlocked
     ? (proCode ?? '// Loading source code...')
     : code}
   ```
3. Loading/error UI (`proCodeLoading`, `proCodeError`) already only appears when those states are set, so no additional guard is needed — they'll simply never fire for free blocks.

## Out of scope
- No changes to the `get-pro-code` edge function.
- No changes to `AuthModal`, `usePro`, or Pro gating for locked Pro blocks (those still require sign-in, as intended).
- Free components (non-block, single components) already use `code` directly — no change needed there.

## Verification
- Open a **free** block → click Code → source appears instantly, no AuthModal, no network call to `get-pro-code`.
- Open a **Pro** block while signed out → click Code → AuthModal opens (unchanged).
- Open a **Pro** block while signed in as Pro → click Code → edge function fetches source (unchanged).
