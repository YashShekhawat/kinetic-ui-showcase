import { useEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * Reliable scroll-reveal using IntersectionObserver.
 * Falls back gracefully on all mobile browsers where
 * GSAP ScrollTrigger may not fire inside Lenis containers.
 */
export function useScrollReveal<T extends HTMLElement>(
  options?: {
    y?: number;
    x?: number;
    duration?: number;
    delay?: number;
    threshold?: number;
    once?: boolean;
  }
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const {
      y = 30,
      x = 0,
      duration = 0.6,
      delay = 0,
      threshold = 0.1,
      once = true,
    } = options ?? {};

    // Set initial hidden state via GSAP (not CSS class)
    gsap.set(el, { opacity: 0, y, x });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.to(el, {
              opacity: 1,
              y: 0,
              x: 0,
              duration,
              delay,
              ease: 'power3.out',
            });
            if (once) observer.unobserve(el);
          }
        });
      },
      { threshold }
    );

    observer.observe(el);

    // Safety: force visible after 4s if observer never fires
    const safety = setTimeout(() => {
      gsap.to(el, { opacity: 1, y: 0, x: 0, duration: 0.3 });
    }, 4000);

    return () => {
      observer.disconnect();
      clearTimeout(safety);
    };
  }, []);

  return ref;
}

/**
 * Batch reveal: animates all children matching a selector
 * as they enter the viewport.
 */
export function useScrollRevealChildren(
  containerRef: React.RefObject<HTMLElement>,
  selector: string,
  options?: {
    y?: number;
    x?: number;
    duration?: number;
    stagger?: number;
    threshold?: number;
  }
) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const {
      y = 30,
      x = 0,
      duration = 0.5,
      stagger = 0.06,
      threshold = 0.1,
    } = options ?? {};

    const elements = container.querySelectorAll<HTMLElement>(selector);
    if (!elements.length) return;

    // Set initial state
    gsap.set(elements, { opacity: 0, y, x });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Find index of this element to calculate delay
            const idx = Array.from(elements).indexOf(entry.target as HTMLElement);
            gsap.to(entry.target, {
              opacity: 1,
              y: 0,
              x: 0,
              duration,
              delay: idx * stagger,
              ease: 'power2.out',
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold }
    );

    elements.forEach((el) => observer.observe(el));

    // Safety fallback
    const safety = setTimeout(() => {
      gsap.to(elements, { opacity: 1, y: 0, x: 0, duration: 0.3 });
    }, 5000);

    return () => {
      observer.disconnect();
      clearTimeout(safety);
    };
  }, [selector]);
}
