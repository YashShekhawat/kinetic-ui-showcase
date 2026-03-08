import type { ComponentConfig } from './components.config';

export const components: ComponentConfig[] = [
  // TEXT
  { id: 'text-reveal', name: 'Text Reveal', category: 'text', type: 'component', isPro: false, isNew: true },
  { id: 'scramble-text', name: 'Scramble Text', category: 'text', type: 'component', isPro: false, isNew: false },
  { id: 'gradient-text', name: 'Gradient Text', category: 'text', type: 'component', isPro: false, isNew: false },
  { id: 'typewriter', name: 'Typewriter', category: 'text', type: 'component', isPro: false, isNew: false },
  { id: 'counting-numbers', name: 'Counting Numbers', category: 'text', type: 'component', isPro: false, isNew: false },
  { id: 'word-by-word', name: 'Word by Word', category: 'text', type: 'component', isPro: false, isNew: false },

  // CARDS
  { id: 'spotlight-card', name: 'Spotlight Card', category: 'cards', type: 'component', isPro: false, isNew: false },
  { id: 'tilt-card', name: 'Tilt Card', category: 'cards', type: 'component', isPro: false, isNew: false },
  { id: 'magnetic-card', name: 'Magnetic Card', category: 'cards', type: 'component', isPro: false, isNew: false },
  { id: 'border-glow-card', name: 'Border Glow Card', category: 'cards', type: 'component', isPro: false, isNew: false },

  // BUTTONS
  { id: 'liquid-fill', name: 'Liquid Fill Button', category: 'buttons', type: 'component', isPro: false, isNew: false },
  { id: 'arrow-slide', name: 'Arrow Slide Button', category: 'buttons', type: 'component', isPro: false, isNew: false },
  { id: 'magnetic-button', name: 'Magnetic Button', category: 'buttons', type: 'component', isPro: false, isNew: false },
  { id: 'border-draw', name: 'Border Draw Button', category: 'buttons', type: 'component', isPro: false, isNew: true },
  { id: 'shatter-button', name: 'Shatter Button', category: 'buttons', type: 'component', isPro: false, isNew: true },
  { id: 'loading-button', name: 'Loading Button', category: 'buttons', type: 'component', isPro: false, isNew: false },

  // LOADERS
  { id: 'dna-loader', name: 'DNA Strand', category: 'loaders', type: 'component', isPro: false, isNew: false },
  { id: 'orbit-loader', name: 'Orbit Loader', category: 'loaders', type: 'component', isPro: false, isNew: false },
  { id: 'skeleton-loader', name: 'Skeleton Screen', category: 'loaders', type: 'component', isPro: false, isNew: false },
  { id: 'pulse-ring', name: 'Pulse Ring', category: 'loaders', type: 'component', isPro: false, isNew: false },
  { id: 'text-progress-loader', name: 'Text Progress', category: 'loaders', type: 'component', isPro: false, isNew: true },
  { id: 'morphing-shape', name: 'Morphing Shape', category: 'loaders', type: 'component', isPro: false, isNew: true },

  // IMAGES
  { id: 'image-reveal-grid', name: 'Image Reveal Grid', category: 'images', type: 'component', isPro: false, isNew: true },
  { id: 'parallax-image', name: 'Parallax Image', category: 'images', type: 'component', isPro: false, isNew: false },
  { id: 'hover-reveal', name: 'Hover Reveal', category: 'images', type: 'component', isPro: false, isNew: false },
  { id: 'infinite-gallery', name: 'Infinite Gallery', category: 'images', type: 'component', isPro: false, isNew: false },
  { id: 'image-stack', name: 'Image Stack', category: 'images', type: 'component', isPro: false, isNew: true },

  // BACKGROUNDS
  { id: 'particle-field', name: 'Particle Field', category: 'backgrounds', type: 'component', isPro: false, isNew: false },
  { id: 'aurora', name: 'Aurora Background', category: 'backgrounds', type: 'component', isPro: false, isNew: false },
  { id: 'floating-orbs', name: 'Floating Orbs', category: 'backgrounds', type: 'component', isPro: false, isNew: false },
  { id: 'matrix-rain', name: 'Matrix Rain', category: 'backgrounds', type: 'component', isPro: false, isNew: false },
  { id: 'animated-grid', name: 'Animated Grid', category: 'backgrounds', type: 'component', isPro: false, isNew: true },
  { id: 'beam-of-light', name: 'Beam of Light', category: 'backgrounds', type: 'component', isPro: false, isNew: true },

  // CURSOR
  { id: 'trail-cursor', name: 'Trail Cursor', category: 'cursor', type: 'component', isPro: false, isNew: false },
  { id: 'spotlight-cursor', name: 'Spotlight Cursor', category: 'cursor', type: 'component', isPro: false, isNew: false },
  { id: 'magnetic-cursor', name: 'Magnetic Cursor', category: 'cursor', type: 'component', isPro: false, isNew: false },

  // SCROLL
  { id: 'marquee', name: 'Smooth Marquee', category: 'scroll', type: 'component', isPro: false, isNew: false },
  { id: 'sticky-scroll', name: 'Sticky Scroll Reveal', category: 'scroll', type: 'component', isPro: false, isNew: false },
  { id: 'scroll-progress', name: 'Scroll Progress Bar', category: 'scroll', type: 'component', isPro: false, isNew: false },
];

export const componentCategories = [
  'text',
  'cards',
  'buttons',
  'loaders',
  'images',
  'backgrounds',
  'cursor',
  'scroll',
];
