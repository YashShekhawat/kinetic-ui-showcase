

## Plan: Create 4 Legal Pages + Update Footers

### New Files

**1–4. Legal Pages** (`src/pages/LicensePage.tsx`, `TermsPage.tsx`, `PrivacyPage.tsx`, `RefundPage.tsx`)

Each page follows a shared layout pattern:
- Import TopBar (with empty search state) and Footer
- Background `#060608`, content `max-w-[720px] mx-auto`, padding `80px 24px`
- Title: `font-syne font-extrabold text-[2.4rem]` color `#f0ede8`
- "Last updated" where applicable: `font-mono text-[11px]` color `#404050`, `mb-12`
- Section headings: `font-syne font-bold text-[1.1rem]` color `#f0ede8`, `mt-10`
- Body: `font-inter text-[0.9rem] leading-[1.8]` color `#909098`
- Bold text: color `#f0ede8`
- Lists: `pl-5 list-disc`, same font/color as body
- Dividers: `border-t border-[#1e1e2e]`
- Content exactly as specified in the request

### Modified Files

**5. `src/App.tsx`** — Add 4 lazy-loaded routes:
```tsx
const LicensePage = lazy(() => import('./pages/LicensePage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const RefundPage = lazy(() => import('./pages/RefundPage'));
```
Wrap routes in `<Suspense>`, add `/license`, `/terms`, `/privacy`, `/refunds` routes.

**6. `src/components/layout/Footer.tsx`** — Update bottom section:
- Change copyright to "© 2025 Kinetic UI. Built by Yash Shekhawat."
- Add a row of `Link` elements: License · Terms · Privacy · Refunds
- Links: `font-mono text-[11px]` color `#404050`, hover `#909098`, separated by `·`

**7. `src/components/landing/LandingFooter.tsx`** — Add same legal links row:
- Below existing content, add: License · Terms · Privacy · Refunds
- Same styling as Footer.tsx links
- Use `useNavigate` (already imported) for navigation

