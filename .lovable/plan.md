

## Plan: Replace Hero Right Side with Abstract Motion Graphic

### What changes

**File: `src/components/landing/HeroSection.tsx`**

**Remove** (lines 6-146): All inline mini-components (`ScrambleTextMini`, `CounterMini`, `GradientTextMini`, `PulseRingMini`, `FloatingCard`) — no longer needed.

**Remove** (lines 177-181): Floating card GSAP animations (`sh-float-0` through `sh-float-3`).

**Remove** (line 170): `sh-card` entrance animation from timeline.

**Replace right side** (lines 377-446): Remove the entire right-side div containing floating cards and mobile card strip. Replace with:

- On **desktop**: A `relative overflow-hidden` div (45% width, full hero height, no background) containing 10 layers:
  1. Primary orb (520px, blurred radial gradient, breathing animation)
  2. Secondary orb (280px, top-right, drifting)
  3. Accent orb (200px, bottom-left, drifting opposite)
  4. Mesh grid overlay (48px grid lines, radial mask)
  5. Floating ring 1 (400px, rotating 30s)
  6. Floating ring 2 (260px, rotating -20s)
  7. Floating ring 3 (140px, rotating 12s)
  8. Center dot (6px, glowing)
  9. Orbiting dot (4px, circles center at 130px radius every 8s via gsap.ticker)
  10. 6 floating particles (2px each, gentle random float animations)

- On **mobile** (`< 768px`): Hide the entire right side. Left content becomes full width.

**GSAP setup**: All animations in the existing `useEffect` with `gsap.context()`. Add refs for orbs, rings, orbiting dot, particles, and right panel. Orbiting dot uses `gsap.ticker.add()` with cleanup via `gsap.ticker.remove()`. Initial reveal fades in the right panel with `opacity 0→1, duration 1.5, delay 0.3`.

**Left side**: No changes. The `isMobile` check already handles full-width on mobile. Update the right side's `flex` from `0 0 45%` to same, but remove `background: '#111119'` (inherits hero bg).

### Summary of edits
- 1 file modified: `src/components/landing/HeroSection.tsx`
- ~140 lines of dead code removed (mini-components, FloatingCard)
- Right side replaced with ~80 lines of layered orb/ring/particle markup + ~60 lines of GSAP animations

