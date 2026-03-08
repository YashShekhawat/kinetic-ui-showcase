import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useIsMobile } from "@/hooks/use-mobile";

const stories = [
  {
    id: 1,
    eyebrow: "PERFORMANCE",
    headline: ["Animate", "without", "limits."],
    sub: "GSAP handles millions of elements at 60fps. From micro-interactions to full-page takeovers — no compromises.",
    stat: { num: "60", unit: "FPS", label: "Guaranteed" },
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&q=85",
    accent: "#7c3aed",
  },
  {
    id: 2,
    eyebrow: "DESIGN SYSTEM",
    headline: ["Dark", "by", "design."],
    sub: "Every token built for depth. Violet accents, obsidian surfaces, and purposeful contrast that makes your UI breathe.",
    stat: { num: "∞", unit: "TOKENS", label: "Customizable" },
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=900&q=85",
    accent: "#a78bfa",
  },
  {
    id: 3,
    eyebrow: "DEVELOPER XP",
    headline: ["Copy.", "Paste.", "Ship."],
    sub: "Zero configuration, zero fighting with peer deps. Drop it in, watch it work. Your deadline just got easier.",
    stat: { num: "<5", unit: "MIN", label: "To integrate" },
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=900&q=85",
    accent: "#7c3aed",
  },
];

// Single story card shown at a time
const StoryCard = ({ story, isActive, isPrev }: { story: (typeof stories)[0]; isActive: boolean; isPrev: boolean }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const wordsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const subRef = useRef<HTMLParagraphElement>(null);
  const statRef = useRef<HTMLDivElement>(null);
  const imgRevealRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current) return;

    if (isActive) {
      const tl = gsap.timeline();

      // Reset first
      gsap.set(wordsRef.current.filter(Boolean), { y: "110%", opacity: 0 });
      gsap.set(subRef.current, { opacity: 0, y: 16 });
      gsap.set(statRef.current, { opacity: 0, y: 12 });
      gsap.set(imgRevealRef.current, { clipPath: "inset(0 100% 0 0)" });
      gsap.set(imgRef.current, { scale: 1.12 });
      gsap.set(lineRef.current, { scaleX: 0, transformOrigin: "left center" });

      // Animate in
      tl.to(wordsRef.current.filter(Boolean), {
        y: "0%",
        opacity: 1,
        duration: 0.7,
        stagger: 0.1,
        ease: "power4.out",
      })
        .to(lineRef.current, { scaleX: 1, duration: 0.6, ease: "power3.inOut" }, "-=0.3")
        .to(subRef.current, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }, "-=0.4")
        .to(statRef.current, { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" }, "-=0.3")
        .to(imgRevealRef.current, { clipPath: "inset(0 0% 0 0)", duration: 0.9, ease: "power4.inOut" }, 0.15)
        .to(imgRef.current, { scale: 1, duration: 1.1, ease: "power3.out" }, 0.15);
    } else {
      // Fade out
      gsap.to(cardRef.current, {
        opacity: 0,
        y: isPrev ? -20 : 20,
        duration: 0.35,
        ease: "power2.in",
      });
    }
  }, [isActive]);

  // Reset opacity when becoming active
  useEffect(() => {
    if (isActive && cardRef.current) {
      gsap.set(cardRef.current, { opacity: 1, y: 0 });
    }
  }, [isActive]);

  return (
    <div
      ref={cardRef}
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "row",
        opacity: isActive ? 1 : 0,
        pointerEvents: isActive ? "auto" : "none",
      }}
    >
      {/* LEFT: Text column */}
      <div
        style={{
          flex: "0 0 48%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "24px 20px 24px 24px",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* Eyebrow */}
        <span
          className="font-mono"
          style={{
            fontSize: "9px",
            color: story.accent,
            letterSpacing: "0.2em",
            border: `1px solid ${story.accent}30`,
            background: `${story.accent}0d`,
            padding: "3px 10px",
            borderRadius: 3,
            display: "inline-block",
            alignSelf: "flex-start",
          }}
        >
          {story.eyebrow}
        </span>

        {/* Headline — words inline so they flow on 1-2 lines, not a vertical tower */}
        <div>
          {story.headline.map((word, i) => (
            <span
              key={i}
              ref={(el) => {
                wordsRef.current[i] = el;
              }}
              className="font-syne font-extrabold"
              style={{
                fontSize: "2.8rem",
                color: i === story.headline.length - 1 ? "transparent" : "#f0ede8",
                WebkitTextStroke: i === story.headline.length - 1 ? `1.5px ${story.accent}` : undefined,
                lineHeight: 1.2,
                display: "inline-block",
                marginRight: i < story.headline.length - 1 ? "0.3em" : 0,
              }}
            >
              {word}
            </span>
          ))}
        </div>

        {/* Animated line */}
        <div
          ref={lineRef}
          style={{
            height: 1,
            background: `linear-gradient(to right, ${story.accent}80, transparent)`,
          }}
        />

        {/* Sub copy */}
        <p
          ref={subRef}
          className="font-inter font-light"
          style={{
            fontSize: "0.78rem",
            color: "#909098",
            lineHeight: 1.65,
            margin: 0,
          }}
        >
          {story.sub}
        </p>

        {/* Stat */}
        <div ref={statRef} className="flex items-baseline gap-2">
          <span className="font-syne font-extrabold" style={{ fontSize: "1.4rem", color: story.accent, lineHeight: 1 }}>
            {story.stat.num}
          </span>
          <span className="font-mono" style={{ fontSize: "9px", color: story.accent, letterSpacing: "0.15em" }}>
            {story.stat.unit}
          </span>
          <span className="font-mono" style={{ fontSize: "9px", color: "#404050", letterSpacing: "0.1em" }}>
            — {story.stat.label.toUpperCase()}
          </span>
        </div>
      </div>

      {/* ── RIGHT: Image column */}
      <div
        style={{
          flex: "0 0 52%",
          position: "relative",
          overflow: "hidden",
          borderLeft: "1px solid #1a1a2e",
        }}
      >
        {/* Clip reveal wrapper */}
        <div
          ref={imgRevealRef}
          style={{
            position: "absolute",
            inset: 0,
            clipPath: "inset(0 100% 0 0)",
          }}
        >
          <img
            ref={imgRef}
            src={story.image}
            alt={story.eyebrow}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "brightness(0.55)",
              willChange: "transform",
              pointerEvents: "none",
            }}
            draggable={false}
          />
          {/* Gradient bleed into text column */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(to right, #0e0e14 0%, transparent 30%, ${story.accent}15 100%)`,
              pointerEvents: "none",
            }}
          />
        </div>

        {/* Story index — bottom right corner */}
        <div
          style={{
            position: "absolute",
            bottom: 20,
            right: 24,
            zIndex: 3,
            pointerEvents: "none",
          }}
        >
          <span
            className="font-syne font-extrabold"
            style={{
              fontSize: "3.5rem",
              lineHeight: 1,
              color: "transparent",
              WebkitTextStroke: `1px ${story.accent}30`,
            }}
          >
            0{story.id}
          </span>
        </div>
      </div>
    </div>
  );
};

// ── Mobile card (simple stacked layout)
const MobileCard = ({ story }: { story: (typeof stories)[0] }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          gsap.fromTo(el, { opacity: 0, y: 32 }, { opacity: 1, y: 0, duration: 0.65, ease: "power3.out" });
        }
      },
      { threshold: 0.2 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      className="relative overflow-hidden rounded-xl"
      style={{ border: "1px solid #2a2a3e", background: "#0d0d12", opacity: 0 }}
    >
      {/* Image */}
      <div style={{ height: 180, overflow: "hidden", position: "relative" }}>
        <img
          src={story.image}
          alt={story.eyebrow}
          style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.4)" }}
          draggable={false}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, #0d0d12 0%, transparent 60%)",
          }}
        />
        <span
          className="font-mono absolute"
          style={{
            top: 12,
            left: 12,
            fontSize: "8px",
            color: story.accent,
            letterSpacing: "0.18em",
            border: `1px solid ${story.accent}30`,
            background: `${story.accent}10`,
            padding: "3px 8px",
            borderRadius: 3,
          }}
        >
          {story.eyebrow}
        </span>
      </div>

      {/* Text */}
      <div style={{ padding: "14px 16px 18px" }}>
        <h3
          className="font-syne font-extrabold"
          style={{
            fontSize: "1.3rem",
            color: "#f0ede8",
            lineHeight: 1.1,
            marginBottom: 8,
          }}
        >
          {story.headline.join(" ")}
        </h3>
        <p
          className="font-inter font-light"
          style={{
            fontSize: "0.75rem",
            color: "#808090",
            lineHeight: 1.65,
            marginBottom: 12,
          }}
        >
          {story.sub}
        </p>
        <div className="flex items-baseline gap-1.5">
          <span className="font-syne font-extrabold" style={{ fontSize: "1.4rem", color: story.accent }}>
            {story.stat.num}
          </span>
          <span className="font-mono" style={{ fontSize: "8px", color: story.accent, letterSpacing: "0.1em" }}>
            {story.stat.unit}
          </span>
          <span className="font-mono" style={{ fontSize: "8px", color: "#404050" }}>
            — {story.stat.label}
          </span>
        </div>
      </div>
    </div>
  );
};

// ── Main block
const TextImageScroll = () => {
  const isMobile = useIsMobile();
  const [active, setActive] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const autoRef = useRef<ReturnType<typeof setInterval>>();

  // Auto-advance every 3.5s
  useEffect(() => {
    if (isMobile) return;
    autoRef.current = setInterval(() => {
      setActive((a) => {
        setPrev(a);
        return (a + 1) % stories.length;
      });
    }, 3500);
    return () => clearInterval(autoRef.current);
  }, [isMobile]);

  const goTo = (i: number) => {
    clearInterval(autoRef.current);
    setPrev(active);
    setActive(i);
    // Restart auto
    autoRef.current = setInterval(() => {
      setActive((a) => {
        setPrev(a);
        return (a + 1) % stories.length;
      });
    }, 3500);
  };

  if (isMobile) {
    return (
      <div
        data-preview="true"
        className="w-full"
        style={{
          background: "#0e0e14",
          padding: "28px 20px 36px",
          boxSizing: "border-box",
          pointerEvents: "none",
        }}
      >
        <div style={{ marginBottom: 20 }}>
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
              marginBottom: 10,
            }}
          >
            OUR STORY
          </span>
          <h2
            className="font-syne font-extrabold"
            style={{
              fontSize: "1.6rem",
              color: "#f0ede8",
              lineHeight: 1.1,
              margin: 0,
            }}
          >
            Built different.
          </h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {stories.map((s) => (
            <MobileCard key={s.id} story={s} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      data-preview="true"
      className="w-full overflow-hidden"
      style={{
        background: "#0e0e14",
        boxSizing: "border-box",
        pointerEvents: "none",
      }}
    >
      {/* Top bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "22px 36px 0",
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
              marginBottom: 10,
            }}
          >
            OUR STORY
          </span>
          <h2
            className="font-syne font-extrabold"
            style={{
              fontSize: "1.4rem",
              color: "#f0ede8",
              lineHeight: 1.1,
              margin: 0,
            }}
          >
            Built different.
          </h2>
        </div>

        {/* Nav dots + counter */}
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ display: "flex", gap: 8 }}>
            {stories.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                style={{
                  pointerEvents: "auto",
                  width: active === i ? 28 : 8,
                  height: 8,
                  borderRadius: 4,
                  background: active === i ? stories[active].accent : "#2a2a3e",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  transition: "width 0.4s ease, background 0.3s ease",
                }}
              />
            ))}
          </div>
          <span className="font-mono" style={{ fontSize: "9px", color: "#404050", letterSpacing: "0.1em" }}>
            {String(active + 1).padStart(2, "0")} / {String(stories.length).padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* Story stage */}
      <div
        ref={containerRef}
        style={{
          position: "relative",
          height: 360,
          margin: "16px 0 0",
          borderTop: "1px solid #1a1a2e",
          borderBottom: "1px solid #1a1a2e",
          overflow: "hidden",
          background: "#0e0e14",
        }}
      >
        {stories.map((story, i) => (
          <StoryCard key={story.id} story={story} isActive={i === active} isPrev={i === prev} />
        ))}

        {/* Auto-progress bar */}
        <AutoProgressBar active={active} accent={stories[active].accent} duration={3500} />
      </div>

      {/* Footer row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 36px",
        }}
      >
        <span className="font-mono" style={{ fontSize: "8px", color: "#1e1e2e", letterSpacing: "0.15em" }}>
          KINETIC UI — TEXT IMAGE SCROLL
        </span>
        <div style={{ display: "flex", gap: 16 }}>
          {stories.map((s, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="font-mono"
              style={{
                fontSize: "9px",
                letterSpacing: "0.1em",
                color: active === i ? s.accent : "#303040",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
                transition: "color 0.3s",
                pointerEvents: "auto",
              }}
            >
              {s.eyebrow}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Thin auto-progress bar at bottom of stage
const AutoProgressBar = ({ active, accent, duration }: { active: number; accent: string; duration: number }) => {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!barRef.current) return;
    gsap.killTweensOf(barRef.current);
    gsap.fromTo(
      barRef.current,
      { scaleX: 0, transformOrigin: "left center" },
      { scaleX: 1, duration: duration / 1000, ease: "none" },
    );
  }, [active, duration]);

  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 2,
        background: "#1a1a2e",
        zIndex: 10,
      }}
    >
      <div
        ref={barRef}
        style={{
          height: "100%",
          background: `linear-gradient(to right, ${accent}, ${accent}88)`,
          transformOrigin: "left center",
        }}
      />
    </div>
  );
};

export default TextImageScroll;
