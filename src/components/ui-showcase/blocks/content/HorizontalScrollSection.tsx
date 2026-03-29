import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useIsMobile } from "@/hooks/use-mobile";

const slides = [
  {
    id: 1,
    num: "01",
    tag: "FOUNDATION",
    title: "Built for\nperformance.",
    body: "Every component is GPU-accelerated. No layout thrashing, no jank — just silky 60fps animations your users will actually feel.",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
    accent: "#7c3aed",
  },
  {
    id: 2,
    num: "02",
    tag: "DESIGN",
    title: "Dark by\ndefault.",
    body: "Crafted for modern dark-mode interfaces. Every token, every shadow, every glow is purpose-built for depth and contrast.",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80",
    accent: "#a78bfa",
  },
  {
    id: 3,
    num: "03",
    tag: "ANIMATION",
    title: "GSAP\nat the core.",
    body: "Not CSS transitions dressed up. Real GSAP timelines, proper contexts, and cleanup on every unmount.",
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80",
    accent: "#7c3aed",
  },
  {
    id: 4,
    num: "04",
    tag: "WORKFLOW",
    title: "Copy.\nPaste.\nShip.",
    body: "Zero config. Drop any component into your project and it works. No fighting with dependencies or broken peer packages.",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80",
    accent: "#a78bfa",
  },
];

const CARD_HEIGHT_DESKTOP = 320;
const CARD_HEIGHT_MOBILE = 340;
const GAP = 12;

const HorizontalScrollSection = () => {
  const isMobile = useIsMobile();
  const scrollRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const imgRefs = useRef<(HTMLImageElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  // Cards entrance animation on mount
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    gsap.fromTo(
      Array.from(track.children),
      { opacity: 0, y: 28 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.09, ease: "power3.out", delay: 0.15 },
    );
  }, []);

  // Native scroll → GSAP progress bar + parallax + active dot
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onScroll = () => {
      const maxScroll = el.scrollWidth - el.clientWidth;
      const progress = maxScroll > 0 ? el.scrollLeft / maxScroll : 0;

      // Progress bar
      if (progressBarRef.current) {
        gsap.set(progressBarRef.current, { scaleX: progress });
      }

      // Active dot index
      const idx = Math.round(progress * (slides.length - 1));
      setActiveIndex(Math.min(Math.max(idx, 0), slides.length - 1));

      // Parallax on images — shift slightly as user scrolls
      imgRefs.current.forEach((img) => {
        if (img) gsap.set(img, { x: progress * 35 });
      });
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  // Dot click → smooth scroll to slide
  const goTo = (i: number) => {
    const el = scrollRef.current;
    const track = trackRef.current;
    if (!el || !track) return;
    const cardW = (track.children[0] as HTMLElement)?.offsetWidth ?? 0;
    const targetScroll = i * (cardW + GAP);
    gsap.to(el, {
      scrollLeft: targetScroll,
      duration: 0.6,
      ease: "power3.inOut",
    });
  };

  const cardH = isMobile ? CARD_HEIGHT_MOBILE : CARD_HEIGHT_DESKTOP;

  return (
    <div
      data-preview="true"
      className="w-full overflow-hidden"
      style={{
        background: "var(--theme-bg-panel)",
        boxSizing: "border-box",
        pointerEvents: "none",
      }}
    >
      {/* Progress bar */}
      <div style={{ height: 1, background: "var(--theme-border)", overflow: "hidden" }}>
        <div
          ref={progressBarRef}
          style={{
            height: "100%",
            background: "linear-gradient(to right, #7c3aed, #a78bfa)",
            transformOrigin: "left center",
            transform: "scaleX(0)",
          }}
        />
      </div>

      {/* Header */}
      <div
        style={{
          padding: isMobile ? "20px 20px 14px" : "28px 36px 18px",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 10,
        }}
      >
        <div>
          <span
            className="font-mono inline-block"
            style={{
              fontSize: "10px",
              color: "#a78bfa",
              letterSpacing: "0.2em",
              border: "1px solid rgba(124,58,237,0.2)",
              background: "rgba(124,58,237,0.06)",
              padding: "3px 10px",
              borderRadius: 4,
              marginBottom: 8,
            }}
          >
            {isMobile ? "SWIPE" : "SCROLL"} TO EXPLORE
          </span>
          <h2
            className="font-syne font-extrabold"
            style={{
              fontSize: isMobile ? "1.5rem" : "1.9rem",
              color: "var(--theme-text-primary)",
              lineHeight: 1.1,
              margin: 0,
            }}
          >
            Why Kinetic UI.
          </h2>
        </div>

        {/* Dot indicators */}
        <div className="flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              style={{
                width: activeIndex === i ? 18 : 5,
                height: 5,
                borderRadius: 3,
                background: activeIndex === i ? "var(--theme-accent)" : "var(--theme-border-hover)",
                border: "none",
                padding: 0,
                cursor: "pointer",
                transition: "width 0.3s ease, background 0.3s ease",
                pointerEvents: "auto",
              }}
            />
          ))}
        </div>
      </div>

      {/* ── Native horizontal scroll container ── */}
      <div
        ref={scrollRef}
        style={{
          overflowX: "scroll",
          overflowY: "hidden",
          // Hide scrollbar visually but keep it functional
          scrollbarWidth: "none", // Firefox
          WebkitOverflowScrolling: "touch",
          paddingLeft: isMobile ? "20px" : "36px",
          paddingBottom: isMobile ? "20px" : "28px",
          pointerEvents: "auto", // only this area is interactive
          cursor: "default",
        }}
      >
        {/* Hide scrollbar for webkit */}
        <style>{`
          .hs-scroll::-webkit-scrollbar { display: none; }
        `}</style>

        <div
          ref={trackRef}
          className="hs-scroll"
          style={{
            display: "flex",
            gap: GAP,
            // Make track wide enough to scroll — fits all cards + end card + right padding
            width: "max-content",
            paddingRight: isMobile ? "20px" : "36px",
          }}
        >
          {slides.map((slide, i) => (
            <div
              key={slide.id}
              className="flex-shrink-0 relative overflow-hidden rounded-xl flex flex-col"
              style={{
                width: isMobile ? "78vw" : "52vw",
                height: cardH,
                border: "1px solid var(--theme-border-hover)",
                background: "var(--theme-bg-card)",
              }}
            >
              {/* Image section — top portion */}
              <div className="relative" style={{ height: isMobile ? "45%" : "50%", flexShrink: 0, overflow: "hidden" }}>
                <img
                  ref={(el) => {
                    imgRefs.current[i] = el;
                  }}
                  src={slide.image}
                  alt={slide.title}
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "115%",
                    height: "100%",
                    objectFit: "cover",
                    filter: "brightness(0.45)",
                    willChange: "transform",
                    pointerEvents: "none",
                    marginLeft: "-7.5%",
                  }}
                  draggable={false}
                />

                {/* Colour accent overlay */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: `linear-gradient(135deg, ${slide.accent}18 0%, transparent 55%)`,
                    pointerEvents: "none",
                  }}
                />
                {/* Bottom fade into card bg */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: "40%",
                    background: "linear-gradient(to top, var(--theme-bg-card) 0%, transparent 100%)",
                    pointerEvents: "none",
                  }}
                />

                {/* Outline number — top right */}
                <div
                  className="absolute font-syne font-extrabold"
                  style={{
                    top: isMobile ? 10 : 18,
                    right: isMobile ? 12 : 20,
                    fontSize: isMobile ? "2.5rem" : "5rem",
                    lineHeight: 1,
                    color: "transparent",
                    WebkitTextStroke: `1.5px ${slide.accent}40`,
                    pointerEvents: "none",
                    userSelect: "none",
                  }}
                >
                  {slide.num}
                </div>

                {/* Tag — top left */}
                <div style={{ position: "absolute", top: isMobile ? 10 : 18, left: isMobile ? 10 : 18 }}>
                  <span
                    className="font-mono"
                    style={{
                      fontSize: "8px",
                      color: slide.accent,
                      letterSpacing: "0.16em",
                      border: `1px solid ${slide.accent}30`,
                      background: `${slide.accent}10`,
                      padding: "3px 8px",
                      borderRadius: 3,
                    }}
                  >
                    {slide.tag}
                  </span>
                </div>
              </div>

              {/* Text content — bottom portion with solid bg */}
              <div
                style={{
                  flex: 1,
                  padding: isMobile ? "8px 14px 14px" : "10px 22px 22px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  background: "var(--theme-bg-card)",
                  zIndex: 2,
                }}
              >
                <h3
                  className="font-syne font-extrabold"
                  style={{
                    fontSize: isMobile ? "1.15rem" : "1.6rem",
                    color: "var(--theme-text-primary)",
                    lineHeight: 1.15,
                    marginBottom: isMobile ? 6 : 10,
                    whiteSpace: "pre-line",
                  }}
                >
                  {slide.title}
                </h3>
                <p
                  className="font-inter font-light"
                  style={{
                    fontSize: isMobile ? "0.72rem" : "0.8rem",
                    color: "var(--theme-text-muted)",
                    lineHeight: 1.65,
                    maxWidth: 300,
                  }}
                >
                  {slide.body}
                </p>
              </div>
            </div>
          ))}

          {/* End CTA card */}
          <div
            className="flex-shrink-0 rounded-xl flex flex-col items-center justify-center"
            style={{
              width: isMobile ? "48vw" : "20vw",
              height: cardH,
              border: "1px solid var(--theme-border)",
              background: "var(--theme-bg-card)",
              gap: 10,
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                border: "1px solid var(--theme-border-hover)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ color: "var(--theme-accent)", fontSize: "0.95rem" }}>↗</span>
            </div>
            <p
              className="font-syne font-bold"
              style={{
                fontSize: "0.85rem",
                color: "var(--theme-text-primary)",
                textAlign: "center",
                lineHeight: 1.4,
              }}
            >
              Explore all
              <br />
              components
            </p>
            <span
              className="font-mono"
              style={{
                fontSize: "8px",
                color: "var(--theme-text-very-dim)",
                letterSpacing: "0.1em",
                textAlign: "center",
              }}
            >
              60+ BLOCKS
            </span>
          </div>
        </div>
      </div>

      {/* Footer counter */}
      <div
        style={{
          padding: isMobile ? "0 20px 16px" : "0 36px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span className="font-mono" style={{ fontSize: "8px", color: "var(--theme-border)", letterSpacing: "0.15em" }}>
          KINETIC UI — HORIZONTAL SCROLL
        </span>
        <div className="flex items-center gap-1.5">
          <span className="font-syne font-bold" style={{ fontSize: "0.85rem", color: "var(--theme-text-primary)" }}>
            {String(activeIndex + 1).padStart(2, "0")}
          </span>
          <span className="font-mono" style={{ fontSize: "9px", color: "var(--theme-text-dim)" }}>
            /
          </span>
          <span className="font-mono" style={{ fontSize: "9px", color: "var(--theme-text-very-dim)" }}>
            {String(slides.length).padStart(2, "0")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default HorizontalScrollSection;
