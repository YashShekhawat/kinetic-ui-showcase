

## Replace `usePro` with Supabase-backed version and remove all localStorage license logic

### Overview
Replace the localStorage-based Pro system with the new Supabase-backed `usePro` hook, and clean up all dead license/localStorage references across the codebase.

### Files to Change

**1. `src/hooks/usePro.ts`** — Replace entire file with the provided Supabase-backed implementation (fetches `is_pro` + `is_active` from `profiles` table).

**2. `src/config/proConfig.ts`** — Remove all localStorage functions (`isProUnlocked`, `saveLicense`, `revokeLicense`, `getLicenseKey`). Keep only `PRO_CONFIG` object and nothing else.

**3. `src/components/layout/TopBar.tsx`** — Major changes:
- Replace `import { PRO_CONFIG, isProUnlocked, getLicenseKey, revokeLicense }` with `import { PRO_CONFIG }` and `import { usePro }` 
- Replace `const proUnlocked = isProUnlocked()` with `const { isPro: proUnlocked } = usePro()`
- Remove `maskKey` helper function
- Remove the entire PRO popover (license key display + revoke button). Replace with a simple "PRO" badge (no popover, no license key display, no revoke)
- Keep the "Upgrade" button for non-pro users as-is

**4. `src/components/ComponentCard.tsx`** — The `usePro` hook return type changes: it no longer returns `unlock` or `revoke`. Update destructure from `{ isPro: proUnlocked, unlock }` to `{ isPro: proUnlocked }`. Remove any `unlock` usage passed to `ProGate`'s `onUnlock`.

**5. `src/pages/PricingPage.tsx`** — Update destructure from `{ isPro, unlock }` to `{ isPro }`. Remove `unlock` passed to `LicenseModal`'s `onUnlock`. The LicenseModal still works for license activation but the `onUnlock` callback no longer writes to localStorage — it will need to either be removed or adapted (the modal itself calls the Lemon Squeezy API; after activation the page can simply reload to re-fetch from Supabase).

**6. `src/components/ProGate.tsx`** — The `onUnlock` prop can remain for now but will be a no-op since callers no longer pass localStorage-based unlock functions.

**7. `src/components/LicenseModal.tsx`** — Keep as-is (it calls Lemon Squeezy API). The `onUnlock` callback it receives will just need to trigger a page reload so Supabase re-fetches the profile.

### What gets removed
- All `localStorage.getItem/setItem/removeItem` calls for `kinetic_license_key` and `kinetic_license_status`
- `isProUnlocked()`, `saveLicense()`, `revokeLicense()`, `getLicenseKey()` from proConfig
- License key display popover and revoke button in TopBar
- `maskKey` helper in TopBar

### What stays unchanged
- `PRO_CONFIG` object (checkoutUrl, proPrice, proModeEnabled)
- `ProGate` component structure
- `LicenseModal` Lemon Squeezy API call
- `toFramerCode.ts` inline for usePro (already returns `true`)

