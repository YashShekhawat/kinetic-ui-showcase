import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ChevronUp } from 'lucide-react';

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      // Show button when scrolled down 300px
      const scrollPos = window.scrollY || window.pageYOffset;
      const lenis = (window as any).__lenis;
      const lenisScroll = lenis?.animatedScroll || 0;
      const currentScroll = scrollPos || lenisScroll;

      const shouldShow = currentScroll > 300;

      if (shouldShow && !isVisible) {
        setIsVisible(true);
        if (buttonRef.current) {
          gsap.fromTo(
            buttonRef.current,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }
          );
        }
      } else if (!shouldShow && isVisible) {
        setIsVisible(false);
        if (buttonRef.current) {
          gsap.to(buttonRef.current, {
            opacity: 0,
            y: 20,
            duration: 0.3,
            ease: 'power2.out',
          });
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    if ((window as any).__lenis) {
      (window as any).__lenis.on('scroll', handleScroll);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isVisible]);

  const handleClick = () => {
    const lenis = (window as any).__lenis;
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.2 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      className="fixed bottom-8 right-8 z-40 p-3 rounded-full transition-all duration-200 hover:scale-110"
      style={{
        background: 'rgba(124, 58, 237, 0.1)',
        border: '1px solid rgba(124, 58, 237, 0.3)',
        color: '#a78bfa',
        opacity: 0,
        pointerEvents: isVisible ? 'auto' : 'none',
      }}
      onMouseEnter={(e) => {
        if (isVisible) {
          (e.currentTarget as HTMLElement).style.background =
            'rgba(124, 58, 237, 0.2)';
          (e.currentTarget as HTMLElement).style.borderColor =
            'rgba(124, 58, 237, 0.5)';
        }
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.background =
          'rgba(124, 58, 237, 0.1)';
        (e.currentTarget as HTMLElement).style.borderColor =
          'rgba(124, 58, 237, 0.3)';
      }}
      aria-label="Scroll to top"
    >
      <ChevronUp size={20} />
    </button>
  );
};

export default ScrollToTopButton;
